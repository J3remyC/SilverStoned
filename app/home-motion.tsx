"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { type ReactNode, useEffect, useRef } from "react";
import { RevealOverlay } from "./reveal-overlay";
import { createWebsiteReveal } from "./website-reveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function HomeMotion({ children }: { children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const startReveal = useRef<(() => void) | null>(null);

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

    media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-detail-image]",
        { scale: 1.08, yPercent: 2 },
        {
          scale: 1.16,
          yPercent: -2,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-detail-frame]",
            start: "top bottom",
            end: "clamp(bottom top)",
            scrub: true,
          },
        },
      );
    });

    const enableSmoothScroll = () => {
      media.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const lenis = new Lenis({ anchors: true });
        const tick = (seconds: number) => lenis.raf(seconds * 1000);

        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);

        return () => {
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
    };
  }, { scope: content });

  useEffect(() => {
    // Schedule from the passive effect so Strict Mode can replay the mount first.
    const frame = requestAnimationFrame(() => startReveal.current?.());
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <RevealOverlay ref={overlay} />
      <div ref={content} className="website-content">{children}</div>
    </>
  );
}
