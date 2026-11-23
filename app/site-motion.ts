"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { type RefObject, useCallback, useEffect, useRef } from "react";
import { createWebsiteReveal } from "./website-reveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function useSiteMotion(
  content: RefObject<HTMLDivElement | null>,
  overlay: RefObject<HTMLDivElement | null>,
) {
  const smoothScroll = useRef<Lenis | null>(null);
  const startReveal = useRef<(() => void) | null>(null);

  const setMenuLock = useCallback((locked: boolean) => {
    const root = document.documentElement;
    if (locked && !root.hasAttribute("data-menu-open")) {
      const gutter = window.innerWidth - root.getBoundingClientRect().width;
      root.style.setProperty("--menu-scrollbar", `${Math.max(0, gutter)}px`);
      root.setAttribute("data-menu-open", "");
      smoothScroll.current?.stop();
    } else if (!locked && root.hasAttribute("data-menu-open")) {
      root.removeAttribute("data-menu-open");
      root.style.removeProperty("--menu-scrollbar");
      smoothScroll.current?.resize();
      smoothScroll.current?.start();
      ScrollTrigger.update();
    }
  }, []);

  useGSAP((_context, contextSafe) => {
    const page = content.current;
    const curtain = overlay.current;
    if (!page || !curtain || !contextSafe) return;

    const media = gsap.matchMedia(page);
    const root = document.documentElement;
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let releaseReveal: (() => void) | undefined;

    const unlockPage = () => {
      delete root.dataset.websiteReveal;
      root.style.removeProperty("--reveal-scrollbar");
    };

    const enableSmoothScroll = () => {
      media.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const lenis = new Lenis({ anchors: true });
        const tick = (seconds: number) => lenis.raf(seconds * 1000);
        smoothScroll.current = lenis;
        if (root.hasAttribute("data-menu-open")) lenis.stop();

        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);

        return () => {
          smoothScroll.current = null;
          gsap.ticker.remove(tick);
          lenis.destroy();
        };
      });
    };

    startReveal.current = contextSafe(() => {
      const finish = () => {
        releaseReveal?.();
        unlockPage();
        enableSmoothScroll();
      };

      if (
        root.dataset.websiteReveal !== "pending" ||
        !motion.matches || document.hidden || window.scrollY !== 0
      ) {
        finish();
        return;
      }

      const timeline = createWebsiteReveal(curtain, page, finish);
      if (!timeline) {
        finish();
        return;
      }

      const skip = () => timeline.progress(1);
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Tab" || event.key === "Escape") skip();
      };
      const onVisibility = () => {
        if (document.hidden) skip();
      };

      releaseReveal = () => {
        page.inert = false;
        motion.removeEventListener("change", skip);
        document.removeEventListener("keydown", onKey, true);
        document.removeEventListener("visibilitychange", onVisibility);
        releaseReveal = undefined;
      };

      motion.addEventListener("change", skip);
      document.addEventListener("keydown", onKey, true);
      document.addEventListener("visibilitychange", onVisibility);
      page.inert = true;
      root.dataset.websiteReveal = "running";
      timeline.play(0);
    });

    const refresh = () => ScrollTrigger.refresh();
    document.fonts.addEventListener("loadingdone", refresh);

    return () => {
      startReveal.current = null;
      if (releaseReveal) {
        releaseReveal();
        unlockPage();
      }
      document.fonts.removeEventListener("loadingdone", refresh);
      media.revert();
      setMenuLock(false);
    };
  }, { scope: content });

  useEffect(() => {
    // Let Strict Mode replay the mount before starting the first-visit reveal.
    const frame = requestAnimationFrame(() => startReveal.current?.());
    return () => cancelAnimationFrame(frame);
  }, []);

  return setMenuLock;
}
