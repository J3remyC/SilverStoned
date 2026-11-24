import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { SiteLink } from "../site-router";
import cuff from "../../public/images/silver-cuff.webp";
import { pageMetadata } from "../page-metadata";

export const metadata = pageMetadata("About", "About Silver Stoned and its studies in sculptural silver.");

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1} className="page-frame route-page route-split" data-route="/about">
      <div>
        <h1 className="display section-title" tabIndex={-1} data-route-heading>About Silver Stoned</h1>
        <p>
          Silver Stoned explores the way silver holds its shape and catches the light.
          An open curve, a rounded edge, and a polished surface give each piece its character.
        </p>
        <SiteLink to="/collection" className="collection-link">
          Explore the collection <ArrowRight aria-hidden="true" size={17} strokeWidth={1.6} />
        </SiteLink>
      </div>
      <figure>
        <div className="route-image">
          <Image
            src={cuff}
            alt="The polished edge of an open cuff illuminated against black"
            fill
            sizes="(min-width: 900px) 44vw, calc(100vw - 48px)"
            className="object-cover"
          />
        </div>
        <figcaption className="image-caption">Cuff study, concept imagery</figcaption>
      </figure>
    </main>
  );
}
