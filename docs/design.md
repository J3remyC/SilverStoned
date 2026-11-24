# Silverstoned design guide

## Art direction

Photograph silver by the way it catches light. Lead with a close crop where a single highlight defines the edge, curve, or texture of a real piece. Pair the image with confident editorial typography and enough space to see the material clearly. Let quiet white sections between dark images make the detail stand out.

The first screen should identify Silverstoned, say that it sells silver accessories, and offer a clear route to the collection. Use one strong product image as the opening focal point and keep the main message and action legible from the first frame.

## Color and type

| Element | Direction |
| --- | --- |
| Black | `#000000` for dark surfaces, type on white, and solid actions on light backgrounds. |
| White | `#FFFFFF` for light surfaces, type on black, and solid actions on dark backgrounds. |
| Champagne gold | `#E4C58C` for menu pointer and keyboard emphasis and the thin edge of the page reveal. |
| Rules and dividers | Use black or white with opacity. Keep low-contrast lines decorative and give essential control boundaries sufficient contrast. |
| Photography | Use neutral grayscale. Preserve the range between polished highlights and shadow detail so the product reads as silver. |
| Display type | Instrument Serif, proposed for the hero headline and section titles. Use one expressive treatment across the whole headline. |
| Text and controls | Instrument Sans, proposed for navigation, body copy, captions, and actions. Use sentence case and keep body text around 45–65 characters per line where space allows. |

Use a fluid scale. Start with a 48–120 px hero, a 32–72 px section heading, and 16–18 px body text. Make the final scale work with the real copy at narrow widths. Use a visible focus outline with sufficient contrast against the surface underneath.

## Page composition

| Section | Layout and purpose |
| --- | --- |
| Header | A text wordmark and shared navigation to the five pages in the [project overview](project%20overview.md). Keep the navigation legible against the hero and in any scrolled state. |
| Hero | On wide screens, set a left-aligned message and one action beside a large macro photograph. On mobile, keep the message and action together, with a crop composed for the narrower frame. Use “Explore the collection” for the link to the collection. |
| Featured collection | Use an editorial grid with a larger lead image and supporting pieces. Give each piece a clear view and a verified name. Stack or simplify the grid on mobile so the entire set is reachable without horizontal scrolling. |
| Material detail | Pair a wide close-up with a short description grounded in the supplied material, finish, or construction details. Use this image as the page's main scroll-led moment. |
| Final action and footer | Direct shoppers to Order Now and link to approved brand contact channels in the footer. |
| Order Now | Label each external link with its platform name so visitors can choose where to place an order. Use the verified Silver Stoned storefront or page URL. |

Start with 24 px gutters on small screens and 48–80 px on wide screens. Align headings and captions to shared edges. Use space and image scale to make pieces distinct. Keep controls simple and use Lucide when an icon clarifies an action. Label icon-only controls accessibly.

## Imagery and copy

- Prefer original Silverstoned product images. Direct the shoot around three views where available: the full silhouette, a macro detail, and an on-body view that conveys scale. Keep reflections controlled and preserve the true shape and finish of each piece.
- Use licensed, clearly identified concept imagery for drafts if actual product images are pending. Track its source and usage rights. Meaningful product images need descriptive alt text. Decorative duplicates use empty alt text.
- Give media an intentional aspect ratio and focal position for each layout. Prioritize the hero image, reserve space for media, and lazy-load below-the-fold imagery where appropriate.
- Keep copy short, concrete, and easy to scan. Use approval-backed product names, material descriptions, care instructions, prices, and availability. Publish testimonials, partnerships, or award claims only with verification.
- Keep labels useful. Spend the page's visual emphasis on the product, the type, and the crop. Skip decorative badges, generic gradients, and filler headings.

## Motion and interaction

- On initial homepage entry, introduce SILVER STONED in Instrument Serif against charcoal. Draw a fine rule beneath the wordmark. Lift the letters out through a mask in a stagger from the center of the wordmark and retract the rule toward its midpoint. As the last letters clear, open the two curtain panels and bring in the hero text, image, and navigation. Reveal the collection action last. Keep the full sequence around 2.8 seconds.
- Lock scrolling and tab focus during the reveal. During playback, Tab or Escape completes it immediately. Release the page before starting Lenis, and bypass the entrance for deep links, history restoration, reduced motion, and browsers with JavaScript disabled.
- Use GSAP ScrollTrigger for the material close-up. Reveal a single crop with a short scrub so it catches up smoothly when scroll speed changes. Use a static composition on small screens if scrubbing crowds the layout or harms performance. Prefer bounded transforms and opacity. Use CSS for routine hover and focus states.
- Use Lenis as the sole smooth-scroll engine when motion is enabled. Integrate it with ScrollTrigger, refresh measurements when font or media sizes settle, and clean up animation instances and listeners on unmount.
- Under `prefers-reduced-motion: reduce`, bypass Lenis and scroll-linked movement and display the composed end states. Preserve the page content, anchor links, and primary action with JavaScript disabled. Support touch and keyboard wherever a pointer interaction is offered.
- Align the shared wordmark and icon-only navigation controls to the homepage gutters. Give the open and close icons accessible names. Center the five large Instrument Serif links on charcoal and highlight the current page with brighter text and `aria-current`. Allow the menu to scroll on short screens.
- Animate the hamburger strokes outward on hover and draw them back on exit. As the pointer approaches the links, gradually tint and scale the labels in proportion to distance. Use the full champagne-gold emphasis on keyboard focus. Keep the link hit areas fixed and use static color feedback with reduced motion.
- On menu open, slide five charcoal bands horizontally from the left with a stagger. Once they cover the viewport, slide the split letters through their masks from left to right. Reverse the sequence on close. Ease these transitions and the homepage curtain and circular route reveal gently at both ends.
- Use a single transition for menu selections, the wordmark, and links between site pages. Slide a charcoal cover in from the left on a page link, or hand off from the charcoal menu as its labels clear. Prefetch during the cover and swap pages once it fills the viewport. On slower requests, show a loading message. When the destination renders, open a circular aperture with a fine champagne edge. Center it on wide, image-led pages and bring it toward the heading on compact or text-only layouts. Reveal the heading word by word and bring in the image and primary action during the opening. Release the cover on Escape or a stalled request, and hand focus to the destination heading. Honor reduced motion and native browser history and anchor navigation.

## Review before shipping

- Check the first screen, collection, and final action at narrow mobile and wide desktop sizes. Look for awkward line breaks, cropped product details, and horizontal overflow.
- Verify link destinations, keyboard order, focus visibility, contrast, and accessible names. Confirm the page still makes sense with reduced motion and with JavaScript disabled.
- Check that images are sharp at their display size, the layout stays stable as media loads, and the main scroll sequence feels smooth on a representative mobile device.
