"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import cuff from "../public/images/silver-cuff.webp";
import { useNavigationHover } from "./use-navigation-hover";

const destinations = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Collection", href: "/collection" },
  { label: "Order Now", href: "/order" },
  { label: "Contact us", href: "/contact" },
] as const;

type Destination = (typeof destinations)[number]["href"];

const reduceMotion = "(prefers-reduced-motion: reduce)";

function focusPageHeading() {
  const main = document.getElementById("main");
  (main?.querySelector<HTMLElement>("[data-route-heading]") ?? main)?.focus({
    preventScroll: true,
  });
  if (main?.ariaBusy !== "true" || !main.parentElement) return;

  const observer = new MutationObserver(() => {
    const destination = document.getElementById("main");
    if (!destination || destination.ariaBusy === "true") return;

    observer.disconnect();
    if (document.activeElement === main || document.activeElement === document.body) {
      (destination.querySelector<HTMLElement>("[data-route-heading]") ?? destination).focus({
        preventScroll: true,
      });
    }
  });
  observer.observe(main.parentElement, { childList: true, subtree: true });
  return () => observer.disconnect();
}

export function SiteNavigation({ setMenuLock }: { setMenuLock: (locked: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const header = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const closeIcon = useRef<SVGSVGElement>(null);
  const links = useRef<HTMLElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const fadeLinks = useRef<gsap.core.Tween | null>(null);
  const opening = useRef(false);
  const focusDestination = useRef(false);
  const cancelFocus = useRef<(() => void) | undefined>(undefined);
  const requestedRoute = useRef<Destination | null>(null);
  const pending = useRef<number | null>(null);
  const lastPath = useRef(pathname);

  useNavigationHover(header);

  const focusPage = useCallback(() => {
    cancelFocus.current?.();
    cancelFocus.current = focusPageHeading();
  }, []);

  const dismiss = useCallback(() => {
    const wasOpen = dialog.current?.open;
    if (pending.current !== null) window.clearTimeout(pending.current);
    pending.current = null;
    opening.current = false;
    dialog.current?.close();
    fadeLinks.current?.pause(0, true);
    setMenuLock(false);
    setExpanded(false);

    if (focusDestination.current) {
      focusDestination.current = false;
      focusPage();
    } else if (wasOpen) {
      menuButton.current?.focus({ preventScroll: true });
    }
  }, [focusPage, setMenuLock]);

  const close = useCallback((focusPage = false) => {
    opening.current = false;
    focusDestination.current = focusPage;
    if (links.current) links.current.inert = true;
    closeButton.current?.focus({ preventScroll: true });

    const timeline = animation.current;
    if (!timeline || timeline.time() === 0 || window.matchMedia(reduceMotion).matches) {
      timeline?.pause(0, true);
      dismiss();
    } else {
      timeline.timeScale(focusPage ? 1.14 : 1.22).reverse();
    }
  }, [dismiss]);

  useGSAP(() => {
    const surface = panel.current;
    const navigation = links.current;
    const strokes = closeIcon.current?.querySelectorAll("path, line");
    if (!surface || !navigation || !strokes || strokes.length !== 3) return;

    const rows = navigation.querySelectorAll("a");
    const [top, middle, bottom] = strokes;
    const timeline = gsap.timeline({
      paused: true,
      defaults: { ease: "sine.out" },
      onComplete: () => { navigation.inert = false; },
      onReverseComplete: dismiss,
    });

    timeline
      .fromTo(surface, { yPercent: -100 }, { yPercent: 0, duration: 0.49, ease: "sine.inOut" }, 0)
      .fromTo(closeButton.current, { opacity: 0 }, { opacity: 1, duration: 0.16 }, 0.08)
      .to(top, { y: 7, rotation: 45, transformOrigin: "50% 50%", duration: 0.28 }, 0.1)
      .to(middle, { opacity: 0, duration: 0.18 }, 0.1)
      .to(bottom, { y: -7, rotation: -45, transformOrigin: "50% 50%", duration: 0.28 }, 0.1)
      .fromTo(rows, { opacity: 0, y: 13 }, {
        opacity: 1, y: 0, duration: 0.26, stagger: 0.027,
      }, 0.15);

    animation.current = timeline;
    fadeLinks.current = gsap.to(navigation, {
      opacity: 0, duration: 0.2, ease: "sine.out", paused: true,
    });

    const preference = window.matchMedia(reduceMotion);
    const onPreferenceChange = () => {
      if (!preference.matches || !dialog.current?.open) return;
      if (opening.current && pending.current === null) timeline.progress(1).pause();
      else close(focusDestination.current);
    };
    preference.addEventListener("change", onPreferenceChange);

    return () => {
      preference.removeEventListener("change", onPreferenceChange);
      animation.current = null;
      fadeLinks.current = null;
      if (pending.current !== null) window.clearTimeout(pending.current);
      pending.current = null;
      cancelFocus.current?.();
      setMenuLock(false);
    };
  }, { scope: dialog });

  const open = () => {
    const menu = dialog.current;
    const navigation = links.current;
    const timeline = animation.current;
    if (!menu || !navigation || !timeline || pending.current) return;

    focusDestination.current = false;
    opening.current = true;
    navigation.inert = true;
    if (!menu.open) {
      cancelFocus.current?.();
      requestedRoute.current = null;
      setMenuLock(true);
      menu.showModal();
      setExpanded(true);
    }
    closeButton.current?.focus({ preventScroll: true });

    if (window.matchMedia(reduceMotion).matches) {
      timeline.progress(1).pause();
      navigation.inert = false;
    } else {
      timeline.timeScale(1).play();
    }
  };

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    cancelFocus.current?.();
    const arrived = requestedRoute.current === pathname;
    requestedRoute.current = null;

    if (arrived) {
      if (pending.current !== null) window.clearTimeout(pending.current);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (dialog.current?.open) close(true);
      else focusPage();
    } else if (dialog.current?.open) {
      animation.current?.pause(0, true);
      dismiss();
    }
  }, [pathname, close, dismiss, focusPage]);

  const navigate = (href: Destination) => {
    if (pending.current) return;
    if (href === pathname) {
      close();
      return;
    }

    pending.current = window.setTimeout(() => close(), 1100);
    requestedRoute.current = href;
    if (links.current) {
      links.current.inert = true;
      closeButton.current?.focus({ preventScroll: true });
    }

    if (window.matchMedia(reduceMotion).matches) {
      close();
    } else {
      fadeLinks.current?.restart();
    }
    router.push(href, { scroll: false });
  };

  return (
    <header ref={header} className="site-header" data-reveal-nav>
      <div className="page-frame masthead">
        <Link href="/" className="wordmark" aria-label="Silver Stoned home">silverstoned</Link>
        <button
          ref={menuButton}
          type="button"
          className="menu-toggle menu-toggle--open"
          aria-label="Open navigation"
          aria-haspopup="dialog"
          aria-expanded={expanded}
          aria-controls="site-menu"
          onClick={open}
        >
          <Menu size={26} strokeWidth={1.55} aria-hidden="true" />
        </button>
        <noscript>
          <style>{".menu-toggle--open{display:none}"}</style>
          <nav className="site-menu-fallback" aria-label="Main navigation">
            {destinations.map(({ href, label }) => <a key={href} href={href}>{label}</a>)}
          </nav>
        </noscript>
      </div>

      <dialog
        ref={dialog}
        className="site-menu"
        id="site-menu"
        aria-label="Site navigation"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        <div className="site-menu__chrome">
          <div className="page-frame masthead">
            <button
              ref={closeButton}
              type="button"
              className="menu-toggle menu-toggle--close"
              aria-label="Close navigation"
              onClick={() => {
                if (opening.current || pending.current) close();
                else open();
              }}
            >
              <Menu ref={closeIcon} size={26} strokeWidth={1.55} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div ref={panel} className="site-menu__surface" data-lenis-prevent>
          <div className="page-frame masthead site-menu__brand" aria-hidden="true">
            <span className="wordmark">silverstoned</span>
          </div>
          <div className="page-frame site-menu__layout">
            <nav ref={links} aria-label="Main navigation">
              <ul className="site-menu__links">
                {destinations.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={pathname === href ? "page" : undefined}
                      onNavigate={(event) => {
                        event.preventDefault();
                        navigate(href);
                      }}
                    >
                      <span className="site-menu__label">
                        <span className="site-menu__label-track">
                          <span className="site-menu__label-line">{label}</span>
                          <span className="site-menu__label-line site-menu__label-echo" aria-hidden="true">
                            {label}
                          </span>
                        </span>
                      </span>
                      <span className="site-menu__arrow" aria-hidden="true">
                        <ArrowUpRight size={22} strokeWidth={1.4} />
                      </span>
                      <span className="site-menu__silver-rule" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="site-menu__image">
              <Image
                src={cuff}
                alt=""
                fill
                sizes="(min-width: 900px) 36vw, 1px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </dialog>
    </header>
  );
}
