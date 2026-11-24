# Silverstoned project overview

## Objective

Build a responsive website for Silverstoned, a silver accessories business. The site should introduce the brand, show the pieces with enough detail to understand their form and finish, and give visitors clear paths to order or get in touch. The design ambition is Awwwards-level craft, with a black-and-white palette, original photography, and purposeful motion.

## Project status

The Next.js App Router app is initialized at the repository root, with Home, About, Collection, Order Now, and Contact us connected by a shared animated menu. Dependencies are managed with npm and locked in `package-lock.json`. Vercel deployment is planned.

Use `npm ci` to install the locked dependencies and `npm run dev` to serve the sample at `http://localhost:3000`. Run `npm run lint`, `npm run typecheck`, and `npm run build` to verify changes.

The sample includes two AI-generated concept images in `public/images/`. `silver-cuff.webp` is the cuff study used in the hero and material crop. `collection-study.webp` shows the cuff and band together. Replace them with approved Silverstoned photography for launch.

## Proposed technology stack

| Technology | Purpose | Why use it? |
| --- | --- | --- |
| Next.js | Web framework | The App Router serves prerendered pages, page metadata, and optimized images. |
| React Router | Internal navigation | Resolves internal links and marks the active menu item. Its navigator uses the Next.js App Router to load server-rendered pages and maintain browser history. |
| TypeScript | Language | Gives components and product content a typed structure that is easier to maintain. |
| Tailwind CSS | Styling | Supports responsive layouts and consistent use of the design tokens. |
| GSAP | Animation | Sequences the hero entrance, SplitText reveals, and circular transitions between pages. |
| GSAP ScrollTrigger | Scroll effects | Connects scroll progress to the product-detail story. |
| Lenis | Smooth scrolling | Provides optional smooth scrolling coordinated with ScrollTrigger while retaining native scroll for reduced motion. |
| Lucide | Iconography | Supplies a consistent set of simple interface icons. |
| Vercel | Deployment | Supports preview and production deployment for the Next.js app. |

## Site scope

- The shared menu will link to the five pages below. The URL paths are proposed.
- Home retains the hero, a preview of featured pieces, and the material detail section. The planned “Explore the collection” action leads to the Collection page when that route is available. Use [design.md](design.md) for the visual and motion direction.
- Include semantic page structure, page-specific search and sharing metadata, responsive product assets, keyboard access, and a reduced-motion experience.
- Use any available preview to review the experience before production deployment.

| Menu item | Proposed URL | Purpose |
| --- | --- | --- |
| Home | `/` | Introduce Silver Stoned and highlight featured pieces. |
| About | `/about` | Tell the brand story. |
| Products / Collection | `/collection` | Browse the available pieces and their verified details. “Collection” is the proposed short menu label. |
| Order Now | `/order` | Let visitors choose an official external ordering destination, such as Shopee, TikTok Shop, or the Silver Stoned Facebook Page. |
| Contact us | `/contact` | Share approved channels for general inquiries. |

Visitors place orders through the external destination they select. Each option links directly to the verified Silver Stoned storefront or page. A cart, on-site checkout, product CMS, and accounts are outside the current scope.

Set the approved public HTTPS links in the build environment using `SILVERSTONED_SHOPEE_URL`, `SILVERSTONED_TIKTOK_SHOP_URL`, and `SILVERSTONED_FACEBOOK_URL`. Set `SILVERSTONED_CONTACT_URL` for general inquiries. The pages show only the destinations that are configured.

## Open launch details

| Item | Needed for |
| --- | --- |
| Brand assets and approved wordmark | Header, footer, and social sharing assets. A text wordmark can carry the first draft. |
| Product photography and selected pieces | Hero image, collection layout, and material close-up. |
| Product names and verified descriptions | Collection captions and the material story. |
| Official storefront URLs | Confirm which Shopee, TikTok Shop, and Facebook destinations to list on Order Now. |
| Public contact channels and social links | Contact us and footer destinations. |
| Production domain and Vercel project | Deployment, canonical URL, and sharing metadata. |
