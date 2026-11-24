import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { SiteLink } from "./site-router";
import { HomeMotion } from "./home-motion";
import collection from "../public/images/collection-study.webp";
import cuff from "../public/images/silver-cuff.webp";

export default function Home() {
  return (
    <HomeMotion>
      <main id="main" tabIndex={-1} data-route="/">
        <section className="page-frame hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title" className="display hero-title" tabIndex={-1} data-route-heading>
              <span className="block" data-reveal-heading-line>Silver</span>{" "}
              <span className="block" data-reveal-heading-line>in form.</span>
            </h1>
            <p data-reveal-description>Sculptural silver accessories by Silverstoned.</p>
            <SiteLink className="collection-link" to="/collection" data-reveal-action>
              Explore the collection
              <ArrowRight aria-hidden="true" size={17} strokeWidth={1.6} />
            </SiteLink>
          </div>

          <figure>
            <div className="hero-image relative overflow-hidden">
              <Image
                src={cuff}
                alt="Polished silver cuff with a rim of light against black"
                fill
                preload
                sizes="(min-width: 1440px) 760px, (min-width: 900px) 56vw, calc(100vw - 48px)"
                className="object-cover"
                data-hero-image
              />
            </div>
            <figcaption className="image-caption">Cuff study, concept imagery</figcaption>
          </figure>
        </section>

        <section className="page-frame collection" id="collection" aria-labelledby="collection-title">
          <div className="collection-copy">
            <h2 id="collection-title" className="display section-title">
              The collection
            </h2>
            <p>
              An open cuff and a rounded band. Two simple shapes with a different
              play of light on each surface.
            </p>
          </div>
          <figure>
            <div className="collection-image relative overflow-hidden">
              <Image
                src={collection}
                alt="An open silver cuff and domed ring on a pale studio surface"
                fill
                sizes="(min-width: 1440px) 740px, (min-width: 900px) 54vw, calc(100vw - 48px)"
                className="object-cover"
              />
            </div>
            <figcaption className="image-caption">Cuff and band study, concept imagery</figcaption>
          </figure>
        </section>

        <section className="detail" id="detail" aria-labelledby="detail-title">
          <div className="page-frame detail-grid">
            <div className="detail-copy">
              <h2 id="detail-title" className="display section-title">
                A closer look.
              </h2>
              <p>Follow the highlight along the cuff as the curved face turns into shadow.</p>
            </div>
            <div className="detail-image relative overflow-hidden" data-detail-frame>
              <Image
                src={cuff}
                alt=""
                fill
                sizes="(min-width: 1440px) 1024px, (min-width: 900px) 67vw, calc(100vw - 48px)"
                className="object-cover"
                data-detail-image
              />
            </div>
          </div>
        </section>
        <section className="page-frame home-order" aria-labelledby="home-order-title">
          <h2 id="home-order-title" className="display section-title">Order now</h2>
          <SiteLink className="collection-link" to="/order">
            Choose a shop
            <ArrowRight aria-hidden="true" size={17} strokeWidth={1.6} />
          </SiteLink>
        </section>
      </main>
    </HomeMotion>
  );
}
