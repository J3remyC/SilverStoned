import { ArrowUpRight } from "lucide-react";
import { pageMetadata } from "../page-metadata";
import { publicUrl } from "../public-url";

export const metadata = pageMetadata("Order Now", "Find the official Silver Stoned storefronts.");

const storefronts = [
  { name: "Shopee", value: process.env.SILVERSTONED_SHOPEE_URL },
  { name: "TikTok Shop", value: process.env.SILVERSTONED_TIKTOK_SHOP_URL },
  { name: "Facebook", value: process.env.SILVERSTONED_FACEBOOK_URL },
].flatMap(({ name, value }) => {
  const href = publicUrl(value);
  return href ? [{ name, href }] : [];
});

export default function OrderPage() {
  return (
    <main id="main" tabIndex={-1} className="page-frame route-page">
      <h1 className="display section-title" tabIndex={-1} data-route-heading>Order Now</h1>
      {storefronts.length ? (
        <>
          <p>Choose a Silver Stoned storefront to place your order.</p>
          <ul className="order-links">
            {storefronts.map(({ name, href }) => (
              <li key={name}>
                <a href={href}>
                  {name} <ArrowUpRight aria-hidden="true" size={20} strokeWidth={1.5} />
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Official storefront links will be posted here once they’re confirmed.</p>
      )}
    </main>
  );
}
