"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { RefObject } from "react";

function bindRollover(
  target: HTMLElement,
  timeline: gsap.core.Timeline,
  hoverPointer: MediaQueryList,
  duration = 0.34,
) {
  let hovered = false;
  let focused = false;
  let destination = 0;
  const move = gsap.quickTo(timeline, "progress", {
    duration,
    ease: "sine.inOut",
  });

  const update = () => {
    const next = hovered || focused ? 1 : 0;
    if (next === destination) return;
    destination = next;
    const progress = timeline.progress();
    const distance = Math.abs(next - progress);
    move.tween.duration(gsap.utils.interpolate(duration * 0.35, duration, distance));
    move(next, progress);
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

function bindLinkProximity(dialog: HTMLDialogElement, hoverPointer: MediaQueryList) {
  const content = dialog.querySelector<HTMLElement>(".site-menu__content");
  const navigation = content?.querySelector("nav");
  if (!content || !navigation) return;

  const entries = gsap.utils.toArray<HTMLAnchorElement>("a", navigation).flatMap((link) => {
    const label = link.querySelector(".site-menu__label");
    const ink = label?.querySelector(".site-menu__label-ink");
    if (!label || !ink) return [];

    const motion = gsap.timeline({ paused: true }).to(ink, {
      scale: 1.075, "--menu-link-emphasis": "100%", duration: 1, ease: "none",
    });
    const move = gsap.quickTo(motion, "progress", { duration: 0.22, ease: "power2.out" });
    return [{ link, label, motion, move, emphasis: 0 }];
  });

  const clamp = gsap.utils.clamp(0, 1);
  let pointer: { x: number; y: number } | undefined;
  let bounds: DOMRect[] | undefined;
  let frame: number | undefined;

  const update = () => {
    frame = undefined;
    if (!dialog.open) return;

    const cursor = navigation.inert ? undefined : pointer;
    const focus = document.activeElement;
    const keyboardFocus = focus?.matches(":focus-visible") ? focus : null;
    if (cursor && !bounds) bounds = entries.map(({ label }) => label.getBoundingClientRect());

    entries.forEach((entry, index) => {
      const box = bounds?.[index];
      let emphasis = entry.link === keyboardFocus ? 1 : 0;
      if (!emphasis && cursor && box) {
        const horizontal = Math.max(box.left - cursor.x, cursor.x - box.right, 0);
        const vertical = cursor.y - (box.top + box.height / 2);
        const radius = gsap.utils.clamp(112, 180, box.height * 1.7);
        const proximity = clamp(1 - Math.hypot(horizontal, vertical) / radius);
        emphasis = proximity * proximity * (3 - 2 * proximity);
      }

      if (emphasis === entry.emphasis) return;
      if (emphasis > 0 && emphasis < 1 && Math.abs(emphasis - entry.emphasis) < 0.008) return;

      entry.emphasis = emphasis;
      entry.move(emphasis, entry.motion.progress());
    });
  };

  const requestUpdate = () => {
    frame ??= requestAnimationFrame(update);
  };
  const invalidate = () => {
    bounds = undefined;
    if (pointer) requestUpdate();
  };
  const clearPointer = () => {
    pointer = undefined;
    requestUpdate();
  };
  const onPointer = (event: PointerEvent) => {
    if (event.pointerType === "touch" || !hoverPointer.matches || navigation.inert) return;
    pointer = { x: event.clientX, y: event.clientY };
    requestUpdate();
  };
  const reset = () => {
    pointer = undefined;
    bounds = undefined;
    if (frame !== undefined) cancelAnimationFrame(frame);
    frame = undefined;
    for (const entry of entries) {
      entry.emphasis = 0;
      entry.move.tween.pause();
      entry.motion.progress(0, true);
    }
  };

  const observer = new ResizeObserver(invalidate);
  observer.observe(content);
  entries.forEach(({ label }) => observer.observe(label));
  content.addEventListener("scroll", invalidate, { passive: true });
  content.addEventListener("pointermove", onPointer, { passive: true });
  content.addEventListener("pointerleave", clearPointer);
  content.addEventListener("pointercancel", clearPointer);
  navigation.addEventListener("focusin", requestUpdate);
  navigation.addEventListener("focusout", requestUpdate);
  hoverPointer.addEventListener("change", clearPointer);
  dialog.addEventListener("close", reset);

  return () => {
    observer.disconnect();
    content.removeEventListener("scroll", invalidate);
    content.removeEventListener("pointermove", onPointer);
    content.removeEventListener("pointerleave", clearPointer);
    content.removeEventListener("pointercancel", clearPointer);
    navigation.removeEventListener("focusin", requestUpdate);
    navigation.removeEventListener("focusout", requestUpdate);
    hoverPointer.removeEventListener("change", clearPointer);
    dialog.removeEventListener("close", reset);
    if (frame !== undefined) cancelAnimationFrame(frame);
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
      const closeRollover = bindRollover(closeButton, closeMotion, hoverPointer);
      const removeProximity = bindLinkProximity(dialog, hoverPointer);
      const resetPointer = () => {
        if (hoverPointer.matches) return;
        openRollover.reset();
        closeRollover.reset();
      };
      dialog.addEventListener("close", closeRollover.reset);
      hoverPointer.addEventListener("change", resetPointer);

      return () => {
        dialog.removeEventListener("close", closeRollover.reset);
        hoverPointer.removeEventListener("change", resetPointer);
        openRollover.remove();
        closeRollover.remove();
        removeProximity?.();
      };
    });

    return () => media.revert();
  }, { scope: header });
}
