"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { type ReactNode, useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function HomeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia(root);

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero-image]", { scale: 1.055, duration: 1.1 })
        .from("[data-hero-heading]", { y: 10, duration: 0.7 }, 0.12);
    });

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

    const refresh = () => ScrollTrigger.refresh();
    document.fonts.addEventListener("loadingdone", refresh);

    return () => {
      document.fonts.removeEventListener("loadingdone", refresh);
      media.revert();
    };
  }, { scope: root });

  return <div ref={root}>{children}</div>;
}
