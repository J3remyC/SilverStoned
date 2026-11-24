"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Menu } from "lucide-react";
import { type MouseEvent, type Ref, useCallback, useImperativeHandle, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { useNavigationHover } from "./use-navigation-hover";

gsap.registerPlugin(useGSAP);

const destinations = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Collection", href: "/collection" },
  { label: "Order Now", href: "/order" },
  { label: "Contact us", href: "/contact" },
] as const;

const reduceMotion = "(prefers-reduced-motion: reduce)";

export type MenuTransition = {
  depart: (animate: boolean) => number | null;
  dismiss: () => void;
};

function MenuLabel({ label }: { label: string }) {
  return (
    <span className="site-menu__label" aria-hidden="true">
      <span className="site-menu__label-ink">
        {label.split(" ").map((word, wordIndex) => (
          <span className="site-menu__word" key={wordIndex}>
            {Array.from(word, (letter, index) => (
              <span className="site-menu__letter" key={index}>
                <span className="site-menu__glyph">{letter}</span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}

export function SiteNavigation({
  ref,
  setMenuLock,
  skipTransition,
}: {
  ref: Ref<MenuTransition>;
  setMenuLock: (locked: boolean) => void;
  skipTransition: () => void;
}) {
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(false);
  const header = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const menuContent = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const links = useRef<HTMLElement>(null);
  const opening = useRef(false);
  const menuMotion = useRef<gsap.core.Timeline | null>(null);
  const linkExit = useRef<gsap.core.Timeline | null>(null);
  const leaving = useRef(false);

  useNavigationHover(header);

  const dismiss = useCallback((restoreFocus = true) => {
    const wasOpen = dialog.current?.open;
    opening.current = false;
    leaving.current = false;
    dialog.current?.close();
    linkExit.current?.pause(0, true);
    menuMotion.current?.pause(0, true);
    setMenuLock(false);
    setExpanded(false);

    if (wasOpen && restoreFocus) menuButton.current?.focus({ preventScroll: true });
  }, [setMenuLock]);

  const close = useCallback(() => {
    if (leaving.current) {
      skipTransition();
      return;
    }
    if (!opening.current) return;

    opening.current = false;
    if (links.current) links.current.inert = true;
    closeButton.current?.focus({ preventScroll: true });

    const timeline = menuMotion.current;
    if (!timeline?.time() || window.matchMedia(reduceMotion).matches) {
      dismiss();
    } else {
      timeline.timeScale(1.13).reverse();
    }
  }, [dismiss, skipTransition]);

  useImperativeHandle(ref, () => ({
    depart(animate) {
      if (!dialog.current?.open) return null;
      leaving.current = true;
      if (links.current) links.current.inert = true;
      closeButton.current?.focus({ preventScroll: true });
      if (!animate || !linkExit.current) return 0;
      return linkExit.current.restart().duration();
    },
    dismiss: () => dismiss(false),
  }), [dismiss]);

  useGSAP(() => {
    const surface = panel.current;
    const navigation = links.current;
    const closeControl = closeButton.current;
    if (!surface || !navigation || !closeControl) return;

    const bands = gsap.utils.toArray<HTMLElement>(".site-menu__band", surface);
    const rows = gsap.utils.toArray<HTMLLIElement>("li", navigation);
    const strokes = closeControl.querySelectorAll("path, line");
    if (!bands.length || !rows.length || strokes.length !== 3) return;

    const timeline = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.out" },
      onComplete: () => { navigation.inert = leaving.current; },
      onReverseComplete: () => dismiss(),
    });

    timeline
      .fromTo(bands, { xPercent: -101 }, {
        xPercent: 0, duration: 0.4, stagger: 0.052, ease: "sine.inOut",
      }, 0)
      .addLabel("content", ">")
      .to(strokes[0], { y: 7, rotation: 45, transformOrigin: "50% 50%", duration: 0.3 }, 0.08)
      .to(strokes[1], { opacity: 0, duration: 0.17 }, 0.08)
      .to(strokes[2], { y: -7, rotation: -45, transformOrigin: "50% 50%", duration: 0.3 }, 0.08)
      .fromTo(rows, { opacity: 0 }, { opacity: 1, duration: 0.27, stagger: 0.036 }, "content");

    rows.forEach((row, index) => {
      const chars = row.querySelectorAll(".site-menu__glyph");
      timeline.fromTo(chars, { xPercent: -115 }, {
        xPercent: 0, duration: 0.32, stagger: { amount: 0.11 },
      }, `content+=${index * 0.036}`);
    });

    menuMotion.current = timeline;

    const exit = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" } })
      .to(rows, {
        opacity: 0, x: 12, duration: 0.2,
        stagger: gsap.utils.distribute({ amount: 0.065, from: "start" }),
      }, 0)
      .to(navigation, { opacity: 0, duration: 0.12 }, 0.13);
    linkExit.current = exit;

    const preference = window.matchMedia(reduceMotion);
    const onPreferenceChange = () => {
      if (!preference.matches || leaving.current) return;
      if (opening.current) timeline.progress(1).pause();
      else if (dialog.current?.open) dismiss();
    };
    preference.addEventListener("change", onPreferenceChange);

    return () => {
      preference.removeEventListener("change", onPreferenceChange);
      menuMotion.current = null;
      linkExit.current = null;
      setMenuLock(false);
    };
  }, { scope: dialog });

  const open = () => {
    const menu = dialog.current;
    const navigation = links.current;
    const timeline = menuMotion.current;
    if (!menu || !navigation || !timeline || leaving.current) return;

    opening.current = true;
    navigation.inert = true;
    if (!menu.open) {
      setMenuLock(true);
      menu.showModal();
      if (menuContent.current) menuContent.current.scrollTop = 0;
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

  const select = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    if (href !== pathname) return;
    event.preventDefault();
    close();
  };

  return (
    <header ref={header} className="site-header" data-reveal-nav>
      <div className="page-frame masthead">
        <Link to="/" className="wordmark" aria-label="Silver Stoned home">silverstoned</Link>
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
          <Menu size={24} strokeWidth={1.55} aria-hidden="true" />
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
                if (opening.current) close();
                else open();
              }}
            >
              <Menu size={24} strokeWidth={1.55} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div ref={panel} className="site-menu__surface">
          <div className="site-menu__bands" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => <span className="site-menu__band" key={index} />)}
          </div>
          <div ref={menuContent} className="site-menu__content" data-lenis-prevent>
            <nav ref={links} aria-label="Main navigation">
              <ul className="site-menu__links">
                {destinations.map((destination) => {
                  const { href, label } = destination;
                  return (
                    <li key={href}>
                      <NavLink
                        to={href}
                        end
                        aria-label={label}
                        onClick={(event) => select(event, href)}
                      >
                        <MenuLabel label={label} />
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </dialog>
    </header>
  );
}
