import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/instrument-sans";
import "@fontsource/instrument-serif/latin-400.css";
import "lenis/dist/lenis.css";
import "./globals.css";

const title = "Silverstoned | Silver accessories";
const description =
  "Explore Silverstoned, an editorial concept for a collection of sculptural silver accessories.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "Silverstoned" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
