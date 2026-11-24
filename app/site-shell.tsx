"use client";

import { ArrowUp } from "lucide-react";
import { type ReactNode, useCallback, useRef } from "react";
import { RevealOverlay } from "./reveal-overlay";
import { useSiteMotion } from "./site-motion";
import { type MenuTransition, SiteNavigation } from "./site-navigation";
import { SiteRouter } from "./site-router";
import { usePageTransition } from "./use-page-transition";

export function SiteShell({ children }: { children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const transitionOverlay = useRef<HTMLDivElement>(null);
  const menu = useRef<MenuTransition>(null);
  const setScrollLock = useSiteMotion(content, overlay);
  const setMenuLock = useCallback((active: boolean) => setScrollLock("menu", active), [setScrollLock]);
  const setRouteLock = useCallback((active: boolean) => setScrollLock("route", active), [setScrollLock]);
  const { navigate, skipTransition } = usePageTransition(content, transitionOverlay, menu, setRouteLock);

  return (
    <SiteRouter transition={navigate}>
      <RevealOverlay ref={overlay} />
      <div ref={transitionOverlay} className="page-transition" hidden>
        <div className="page-transition__matte" aria-hidden="true" />
        <p className="page-transition__status" role="status" />
      </div>
      <div ref={content} className="website-content" id="top">
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteNavigation ref={menu} setMenuLock={setMenuLock} skipTransition={skipTransition} />
        {children}
        <footer className="page-frame footer">
          <span className="wordmark">silverstoned</span>
          <a className="flex min-h-11 items-center gap-2" href="#top">
            Back to top
            <ArrowUp aria-hidden="true" size={16} strokeWidth={1.6} />
          </a>
        </footer>
      </div>
    </SiteRouter>
  );
}
