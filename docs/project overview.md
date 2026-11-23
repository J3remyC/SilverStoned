# Silverstoned project overview

## Objective

Build a responsive landing page for Silverstoned, a silver accessories business. The page should introduce the brand, show the pieces with enough detail to understand their form and finish, and give visitors a clear next step. The design ambition is Awwwards-level craft, with a black-and-white palette, original photography, and purposeful motion.

## Project status

The Next.js App Router app is initialized at the repository root, with a sample landing page in `app/page.tsx`. Dependencies are managed with npm and locked in `package-lock.json`. Vercel deployment is planned.

Use `npm ci` to install the locked dependencies and `npm run dev` to serve the sample at `http://localhost:3000`. Run `npm run lint`, `npm run typecheck`, and `npm run build` to verify changes.

The sample includes two AI-generated concept images in `public/images/`. `silver-cuff.webp` is the cuff study used in the hero and material crop. `collection-study.webp` shows the cuff and band together. Replace them with approved Silverstoned photography for launch.

## Proposed technology stack

| Technology | Purpose | Why use it? |
| --- | --- | --- |
| Next.js | Web framework | Supports routing, page metadata for SEO, and image optimization. The App Router is the proposed starting point. |
| TypeScript | Language | Gives components and product content a typed structure that is easier to maintain. |
| Tailwind CSS | Styling | Supports responsive layouts and consistent use of the design tokens. |
| GSAP | Animation | Sequences the hero entrance and other purposeful transitions. |
| GSAP ScrollTrigger | Scroll effects | Connects scroll progress to the product-detail story. |
| Lenis | Smooth scrolling | Provides optional smooth scrolling coordinated with ScrollTrigger while retaining native scroll for reduced motion. |
| Lucide | Iconography | Supplies a consistent set of simple interface icons. |
| Vercel | Deployment | Supports preview and production deployment for the Next.js app. |

## Landing page scope

- Plan a single landing page with navigation, a hero, featured pieces, a material detail section, a final action, and a footer. Use [design.md](design.md) for the visual and motion direction.
- The first action, “Explore the collection,” links to featured pieces on the page. The final conversion path depends on the verified store or contact destination. A cart, checkout, product CMS, and account features are outside the current landing-page scope.
- Include semantic page structure, search and sharing metadata, responsive product assets, keyboard access, and a reduced-motion experience.
- Use any available preview to review the experience before production deployment.

## Open launch details

| Item | Needed for |
| --- | --- |
| Brand assets and approved wordmark | Header, footer, and social sharing assets. A text wordmark can carry the first draft. |
| Product photography and selected pieces | Hero image, collection layout, and material close-up. |
| Product names and verified descriptions | Collection captions and the material story. |
| Store or inquiry URL and public social links | Final action and footer destinations. |
| Production domain and Vercel project | Deployment, canonical URL, and sharing metadata. |
