import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SiteLink } from "../site-router";
import { pageMetadata } from "../page-metadata";
import { publicUrl } from "../public-url";

export const metadata = pageMetadata("Contact us", "Get in touch with Silver Stoned.");

const contactUrl = publicUrl(process.env.SILVERSTONED_CONTACT_URL);

export default function ContactPage() {
  return (
    <main id="main" tabIndex={-1} className="page-frame route-page" data-route="/contact">
      <h1 className="display section-title" tabIndex={-1} data-route-heading>Contact us</h1>
      {contactUrl ? (
        <>
          <p>Get in touch with Silver Stoned for general inquiries.</p>
          <a href={contactUrl} className="collection-link">
            Contact Silver Stoned <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.6} />
          </a>
        </>
      ) : (
        <p>Public contact details will be posted here when available.</p>
      )}
      <p>
        <SiteLink to="/order" className="collection-link">
          Order Now <ArrowRight aria-hidden="true" size={17} strokeWidth={1.6} />
        </SiteLink>
      </p>
    </main>
  );
}
