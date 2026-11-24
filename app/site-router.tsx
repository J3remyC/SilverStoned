"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useMemo } from "react";
import { createPath, Router, type Navigator, type To } from "react-router";

export { Link as SiteLink } from "react-router";

export type StartPageTransition = (
  href: string,
  commit: (manualScroll: boolean) => void,
  prefetch: () => void,
) => void;

function href(to: To) {
  return typeof to === "string" ? to : createPath(to);
}

export function SiteRouter({
  children,
  transition,
}: { children: ReactNode; transition: StartPageTransition }) {
  const pathname = usePathname();
  const next = useRouter();

  // React Router resolves links against the committed route. Next supplies
  // the server-rendered page and manages the corresponding history entry.
  const navigator = useMemo<Navigator>(() => {
    const navigate = (mode: "push" | "replace", to: To, preserveScroll?: boolean) => {
      const target = href(to);
      transition(
        target,
        (manualScroll) => next[mode](target, { scroll: !manualScroll && !preserveScroll }),
        () => next.prefetch(target),
      );
    };
    return {
      createHref: href,
      go: (delta) => window.history.go(delta),
      push: (to, _state, options) => navigate("push", to, options?.preventScrollReset),
      replace: (to, _state, options) => navigate("replace", to, options?.preventScrollReset),
    };
  }, [next, transition]);

  return <Router location={pathname} navigator={navigator}>{children}</Router>;
}
