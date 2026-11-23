import { ArrowDown, ArrowUp } from "lucide-react";
import Image from "next/image";
import { HomeMotion } from "./home-motion";
import collection from "../public/images/collection-study.webp";
import cuff from "../public/images/silver-cuff.webp";

export default function Home() {
  return (
    <HomeMotion>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="page-frame masthead" id="top" data-reveal-nav>
        <a href="#top" className="wordmark" aria-label="Silverstoned home">
          silverstoned
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#collection">Collection</a>
          <a href="#detail">Details</a>
        </nav>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="page-frame hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title" className="display hero-title">
              <span className="block" data-reveal-heading-line>Silver</span>{" "}
              <span className="block" data-reveal-heading-line>in form.</span>
            </h1>
            <p data-reveal-description>Sculptural silver accessories by Silverstoned.</p>
            <a className="collection-link" href="#collection" data-reveal-action>
              Explore the collection
              <ArrowDown aria-hidden="true" size={17} strokeWidth={1.6} />
            </a>
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
      </main>

      <footer className="page-frame footer">
        <span className="wordmark">silverstoned</span>
        <a className="flex min-h-11 items-center gap-2" href="#top">
          Back to top
          <ArrowUp aria-hidden="true" size={16} strokeWidth={1.6} />
        </a>
      </footer>
    </HomeMotion>
  );
}
