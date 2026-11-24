"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { usePathname } from "next/navigation";
import { type RefObject, useCallback, useEffect, useRef } from "react";
import type { MenuTransition } from "./site-navigation";
import type { StartPageTransition } from "./site-router";

gsap.registerPlugin(useGSAP, SplitText);

type Request = {
  path: string;
  origin: HTMLElement | null;
  commit: ((manualScroll: boolean) => void) | null;
  manualScroll: boolean;
  released: boolean;
  ready: boolean;
  timeout?: number;
  statusDelay?: number;
  imageDelay?: number;
};

export function usePageTransition(
  content: RefObject<HTMLDivElement | null>,
  overlay: RefObject<HTMLDivElement | null>,
  menu: RefObject<MenuTransition | null>,
  setRouteLock: (active: boolean) => void,
) {
  const pathname = usePathname();
  const pending = useRef<Request | null>(null);
  const start = useRef<StartPageTransition | null>(null);
  const show = useRef<((request: Request, main: HTMLElement, heading: HTMLElement) => void) | null>(null);
  const skip = useRef<(() => void) | null>(null);

  useGSAP((_context, contextSafe) => {
    const page = content.current;
    const veil = overlay.current;
    const matte = veil?.querySelector(".page-transition__matte");
    const status = veil?.querySelector(".page-transition__status");
    if (!page || !veil || !matte || !status || !contextSafe) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let motion: gsap.core.Animation | null = null;
    let split: SplitText | null = null;

    const dispatch = (request: Request) => {
      const commit = request.commit;
      request.commit = null;
      commit?.(request.manualScroll);
    };

    const release = (request: Request, restoreFocus = false) => {
      window.clearTimeout(request.timeout);
      window.clearTimeout(request.statusDelay);
      window.clearTimeout(request.imageDelay);
      if (request.released) return;

      request.released = true;
      veil.hidden = true;
      delete veil.dataset.phase;
      status.textContent = "";
      motion?.revert();
      motion = null;
      split?.revert();
      split = null;
      menu.current?.dismiss();
      page.inert = false;
      setRouteLock(false);
      if (restoreFocus && request.origin?.isConnected) request.origin.focus({ preventScroll: true });
    };

    const finish = (request: Request, heading: HTMLElement) => {
      if (pending.current !== request) return;
      release(request);
      pending.current = null;
      heading.focus({ preventScroll: true });
    };

    skip.current = () => {
      const request = pending.current;
      if (!request || request.released) return;
      const heading = page.querySelector<HTMLElement>("main[data-route] [data-route-heading]");
      if (request.ready && heading) {
        finish(request, heading);
        return;
      }
      if (request.commit) request.manualScroll = false;
      release(request, true);
      dispatch(request);
    };

    start.current = contextSafe((href: string, commit: Request["commit"], prefetch: () => void) => {
      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin || destination.hash ||
        destination.pathname === window.location.pathname) {
        commit?.(false);
        return;
      }
      if (pending.current && !pending.current.released) return;

      const animate = !reduced.matches && !document.hidden;
      const focused = document.activeElement;
      const menuExit = menu.current?.depart(animate) ?? null;
      const origin = menuExit === null
        ? (focused instanceof HTMLElement ? focused : null)
        : page.querySelector<HTMLElement>(".menu-toggle--open");
      const request: Request = {
        path: destination.pathname, origin, commit, manualScroll: animate, released: !animate, ready: false,
      };
      pending.current = request;

      if (!animate) {
        menu.current?.dismiss();
        dispatch(request);
        return;
      }

      const covered = () => {
        if (pending.current !== request || request.released) return;
        menu.current?.dismiss();
        veil.dataset.phase = "waiting";
        request.statusDelay = window.setTimeout(() => { status.textContent = "Opening page…"; }, 400);
        dispatch(request);
      };

      setRouteLock(true);
      page.inert = true;
      veil.hidden = false;
      veil.dataset.phase = "covering";
      request.timeout = window.setTimeout(() => skip.current?.(), 8000);
      prefetch();

      if (menuExit !== null) {
        motion = gsap.delayedCall(menuExit, covered);
      } else {
        motion = gsap.fromTo(matte, { xPercent: -101 }, {
          xPercent: 0, duration: 0.23, ease: "power2.inOut", onComplete: covered,
        });
      }
    });

    show.current = contextSafe((request: Request, main: HTMLElement, heading: HTMLElement) => {
      if (request.manualScroll) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (request.released) {
        menu.current?.dismiss();
        finish(request, heading);
        return;
      }

      const image = main.querySelector<HTMLImageElement>("[data-hero-image], .route-image img");
      const reveal = contextSafe(() => {
        if (pending.current !== request || request.released || veil.dataset.phase === "revealing") return;
        window.clearTimeout(request.imageDelay);
        window.clearTimeout(request.statusDelay);
        motion?.revert();
        veil.dataset.phase = "revealing";

        const titleFirst = !image || window.innerWidth < 900;
        let apertureCenter = "50%";
        if (titleFirst) {
          const bounds = heading.getBoundingClientRect();
          const center = (bounds.top + bounds.height / 2) / window.innerHeight * 100;
          apertureCenter = `${gsap.utils.clamp(16, 55, center).toFixed(1)}%`;
        }
        split = SplitText.create(heading, {
          type: "words", mask: "words", tag: "span", wordsClass: "route-heading-word",
        });
        const media = image?.parentElement;
        const caption = media?.closest("figure")?.querySelector("figcaption");
        const supporting = [main.querySelector("p"), main.querySelector("[data-reveal-action], .collection-link, .order-links")]
          .filter((element) => element !== null);
        const timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          onComplete: () => finish(request, heading),
        });
        motion = timeline;
        if (status.textContent) timeline.to(status, { opacity: 0, duration: 0.15 }, 0);
        timeline.set(matte, { "--page-aperture-center": apertureCenter }, 0);
        timeline.fromTo(matte, { "--page-aperture": "0%" }, {
          "--page-aperture": "101%", duration: 0.56, ease: "sine.inOut",
        }, 0);
        timeline.fromTo(split.words, { yPercent: 80, opacity: 0 }, {
          yPercent: 0, opacity: 1, duration: 0.39, stagger: { amount: 0.08 },
        }, titleFirst ? 0.09 : 0.15);
        if (image && media) {
          timeline.fromTo(image, { scale: 1.055 }, { scale: 1, duration: 0.5 }, 0.08);
          if (caption) timeline.fromTo(caption, { opacity: 0 }, { opacity: 1, duration: 0.24 }, 0.33);
        }
        if (supporting.length) {
          timeline.fromTo(supporting, { opacity: 0, y: 8 }, {
            opacity: 1, y: 0, duration: 0.29, stagger: 0.05,
          }, 0.26);
        }
      });

      if (image && !image.complete) {
        request.imageDelay = window.setTimeout(reveal, 180);
        void image.decode().then(reveal, reveal);
      } else {
        reveal();
      }
    });

    const onKey = (event: KeyboardEvent) => {
      if (!pending.current || pending.current.released || event.key !== "Escape") return;
      event.preventDefault();
      skip.current?.();
    };
    const onPreferenceChange = () => { if (reduced.matches) skip.current?.(); };
    const onVisibility = () => { if (document.hidden) skip.current?.(); };
    const onHistory = () => {
      if (pending.current) release(pending.current);
      pending.current = null;
      menu.current?.dismiss();
    };
    document.addEventListener("keydown", onKey, true);
    reduced.addEventListener("change", onPreferenceChange);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("popstate", onHistory);

    return () => {
      if (pending.current) release(pending.current);
      pending.current = null;
      start.current = null;
      show.current = null;
      skip.current = null;
      document.removeEventListener("keydown", onKey, true);
      reduced.removeEventListener("change", onPreferenceChange);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("popstate", onHistory);
    };
  }, { scope: overlay });

  useEffect(() => {
    const request = pending.current;
    const page = content.current;
    if (!request || !page || request.path !== pathname) return;

    const revealWhenReady = () => {
      if (pending.current !== request || request.ready) return true;
      const main = page.querySelector<HTMLElement>("main[data-route]");
      const heading = main?.querySelector<HTMLElement>("[data-route-heading]");
      if (!main || main.dataset.route !== pathname || !heading) return false;
      request.ready = true;
      show.current?.(request, main, heading);
      return true;
    };

    if (revealWhenReady()) return;
    const observer = new MutationObserver(() => {
      if (revealWhenReady()) observer.disconnect();
    });
    observer.observe(page, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [content, pathname]);

  const navigate = useCallback<StartPageTransition>((href, commit, prefetch) => {
    if (start.current) start.current(href, commit, prefetch);
    else commit(false);
  }, []);
  const skipTransition = useCallback(() => skip.current?.(), []);
  return { navigate, skipTransition };
}
