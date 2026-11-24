import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { SiteLink } from "../site-router";
import collection from "../../public/images/collection-study.webp";
import { pageMetadata } from "../page-metadata";

export const metadata = pageMetadata("Collection", "Explore Silver Stoned’s cuff and band concept studies.");

export default function CollectionPage() {
  return (
    <main id="main" tabIndex={-1} className="page-frame route-page route-split" data-route="/collection">
      <div>
        <h1 className="display section-title" tabIndex={-1} data-route-heading>Collection</h1>
        <p>An open cuff and a rounded band. Two studies in the way light moves across silver.</p>
        <SiteLink to="/order" className="collection-link">
          Order Now <ArrowRight aria-hidden="true" size={17} strokeWidth={1.6} />
        </SiteLink>
      </div>
      <figure>
        <div className="route-image">
          <Image
            src={collection}
            alt="An open silver cuff and a rounded band on a pale studio surface"
            fill
            sizes="(min-width: 900px) 44vw, calc(100vw - 48px)"
            className="object-cover"
          />
        </div>
        <figcaption className="image-caption">Cuff and band study, concept imagery</figcaption>
      </figure>
    </main>
  );
}
