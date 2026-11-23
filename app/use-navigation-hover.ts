"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { RefObject } from "react";

function bindRollover(
  target: HTMLElement,
  timeline: gsap.core.Timeline,
  hoverPointer: MediaQueryList,
) {
  let hovered = false;
  let focused = false;
  let destination = 0;
  const move = gsap.quickTo(timeline, "progress", {
    duration: 0.34,
    ease: "sine.inOut",
  });

  const update = () => {
    const next = hovered || focused ? 1 : 0;
    if (next === destination) return;
    destination = next;
    move(next, timeline.progress());
  };
  const enter = (event: PointerEvent) => {
    if (event.pointerType === "touch" || !hoverPointer.matches) return;
    hovered = true;
    update();
  };
  const leave = () => {
    hovered = false;
    update();
  };
  const focus = () => {
    focused = target.matches(":focus-visible");
    update();
  };
  const blur = () => {
    focused = false;
    update();
  };

  target.addEventListener("pointerenter", enter);
  target.addEventListener("pointerleave", leave);
  target.addEventListener("pointercancel", leave);
  target.addEventListener("focus", focus);
  target.addEventListener("blur", blur);

  return {
    reset() {
      hovered = false;
      focused = false;
      destination = 0;
      move.tween.pause();
      timeline.progress(0, true);
    },
    remove() {
      target.removeEventListener("pointerenter", enter);
      target.removeEventListener("pointerleave", leave);
      target.removeEventListener("pointercancel", leave);
      target.removeEventListener("focus", focus);
      target.removeEventListener("blur", blur);
    },
  };
}

export function useNavigationHover(header: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const scope = header.current;
    const dialog = scope?.querySelector("dialog");
    const openButton = scope?.querySelector<HTMLButtonElement>(".menu-toggle--open");
    const closeButton = dialog?.querySelector<HTMLButtonElement>(".menu-toggle--close");
    const closeIcon = closeButton?.querySelector("svg");
    if (!scope || !dialog || !openButton || !closeButton || !closeIcon) return;

    const media = gsap.matchMedia(scope);

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const hoverPointer = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
      const timeline = () => gsap.timeline({
        paused: true,
        defaults: { duration: 1, ease: "none" },
      });

      const strokes = gsap.utils.toArray<SVGElement>("path, line", openButton);
      const openMotion = timeline()
        .to(strokes[0], { x: 2, y: -2, scaleX: 0.84, transformOrigin: "left center" }, 0)
        .to(strokes[1], { scaleX: 0.66, transformOrigin: "center center" }, 0)
        .to(strokes[2], { x: -2, y: 2, scaleX: 0.84, transformOrigin: "right center" }, 0);
      const openRollover = bindRollover(openButton, openMotion, hoverPointer);

      const closeMotion = timeline().to(closeIcon, { rotation: 12, scale: 0.9 });
      const menuRollovers = [bindRollover(closeButton, closeMotion, hoverPointer)];

      for (const link of gsap.utils.toArray<HTMLAnchorElement>(".site-menu__links a", dialog)) {
        const label = link.querySelector(".site-menu__label-track");
        const rule = link.querySelector(".site-menu__silver-rule");
        const arrow = link.querySelector(".site-menu__arrow");
        if (!label || !rule || !arrow) continue;

        const linkMotion = timeline()
          .to(label, { yPercent: -100 }, 0)
          .to(rule, { scaleX: 1 }, 0)
          .to(arrow, { x: 3, y: -3, "--menu-arrow-visibility": 1 }, 0);
        menuRollovers.push(bindRollover(link, linkMotion, hoverPointer));
      }

      const resetMenu = () => menuRollovers.forEach((rollover) => rollover.reset());
      const resetPointer = () => {
        if (hoverPointer.matches) return;
        openRollover.reset();
        resetMenu();
      };
      dialog.addEventListener("close", resetMenu);
      hoverPointer.addEventListener("change", resetPointer);

      return () => {
        dialog.removeEventListener("close", resetMenu);
        hoverPointer.removeEventListener("change", resetPointer);
        openRollover.remove();
        menuRollovers.forEach((rollover) => rollover.remove());
      };
    });

    return () => media.revert();
  }, { scope: header });
}
