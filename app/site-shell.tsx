"use client";

import { ArrowUp } from "lucide-react";
import { type ReactNode, useRef } from "react";
import { RevealOverlay } from "./reveal-overlay";
import { useSiteMotion } from "./site-motion";
import { SiteNavigation } from "./site-navigation";

export function SiteShell({ children }: { children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const setMenuLock = useSiteMotion(content, overlay);

  return (
    <>
      <RevealOverlay ref={overlay} />
      <div ref={content} className="website-content" id="top">
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteNavigation setMenuLock={setMenuLock} />
        {children}
        <footer className="page-frame footer">
          <span className="wordmark">silverstoned</span>
          <a className="flex min-h-11 items-center gap-2" href="#top">
            Back to top
            <ArrowUp aria-hidden="true" size={16} strokeWidth={1.6} />
          </a>
        </footer>
      </div>
    </>
  );
}
