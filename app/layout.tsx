import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/instrument-sans";
import "@fontsource/instrument-serif/latin-400.css";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SiteShell } from "./site-shell";

const title = "Silverstoned | Silver accessories";
const description =
  "Explore Silverstoned, an editorial concept for a collection of sculptural silver accessories.";
const siteName = "Silver Stoned";

export const metadata: Metadata = {
  title: { default: title, template: `%s | ${siteName}` },
  description,
  openGraph: { title, description, type: "website", siteName },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><SiteShell>{children}</SiteShell></body>
    </html>
  );
}
