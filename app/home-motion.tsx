"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function HomeMotion({ children }: { children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia(content);

    media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-detail-image]",
        { scale: 1.08, yPercent: 1.75 },
        {
          scale: 1.14,
          yPercent: -1.75,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-detail-frame]",
            start: "top bottom",
            end: "clamp(bottom top)",
            scrub: 0.18,
          },
        },
      );
    });

    return () => media.revert();
  }, { scope: content });

  return <div ref={content}>{children}</div>;
}
