import gsap from "gsap";

export function createWebsiteReveal(
  overlay: HTMLDivElement,
  content: HTMLDivElement,
  onComplete: () => void,
) {
  const letters = overlay.querySelectorAll<HTMLElement>("[data-reveal-letter]");
  const mark = overlay.querySelector<HTMLElement>("[data-reveal-mark]");
  const rule = overlay.querySelector<HTMLElement>("[data-reveal-rule]");
  const upper = overlay.querySelector<HTMLElement>("[data-reveal-upper]");
  const lower = overlay.querySelector<HTMLElement>("[data-reveal-lower]");
  const nav = content.querySelector<HTMLElement>("[data-reveal-nav]");
  const heading = content.querySelectorAll<HTMLElement>("[data-reveal-heading-line]");
  const image = content.querySelector<HTMLImageElement>("[data-hero-image]");
  const description = content.querySelector<HTMLElement>("[data-reveal-description]");
  const action = content.querySelector<HTMLElement>("[data-reveal-action]");

  if (
    !letters.length || !mark || !rule || !upper || !lower || !nav || !heading.length ||
    !image || !description || !action
  ) return;

  const clearFade = "opacity,visibility";
  const clearEntrance = "opacity,visibility,transform";

  return gsap.timeline({ paused: true, defaults: { ease: "power3.out" }, onComplete })
    .addLabel("brand", 0)
    .addLabel("curtain", 1.14)
    .addLabel("hero", "curtain+=0.52")
    .fromTo(letters, { autoAlpha: 0, yPercent: 36 }, {
      autoAlpha: 1, yPercent: 0, duration: 0.58, stagger: { amount: 0.28 },
    }, "brand")
    .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.7 }, "brand+=0.22")
    .to(mark, { autoAlpha: 0, y: -8, duration: 0.26, ease: "power2.in" }, "curtain-=0.08")
    .to([upper, lower], {
      yPercent: (index: number) => index === 0 ? -100 : 100,
      duration: 1.05,
      ease: "power3.inOut",
    }, "curtain")
    .fromTo(nav, { autoAlpha: 0 }, {
      autoAlpha: 1, duration: 0.58, ease: "power2.out", clearProps: clearFade,
    }, "hero")
    .fromTo(heading, { autoAlpha: 0, yPercent: 32 }, {
      autoAlpha: 1, yPercent: 0, duration: 0.76, stagger: 0.11, clearProps: clearEntrance,
    }, "hero+=0.08")
    .fromTo(image, { scale: 1.08 }, {
      scale: 1, duration: 0.98, clearProps: "transform",
    }, "hero+=0.16")
    .fromTo(description, { autoAlpha: 0 }, {
      autoAlpha: 1, duration: 0.61, clearProps: clearFade,
    }, "hero+=0.29")
    .fromTo(action, { autoAlpha: 0, y: 10 }, {
      autoAlpha: 1, y: 0, duration: 0.57, clearProps: clearEntrance,
    }, "hero+=0.56");
}
