import gsap from "gsap";

export function createWebsiteReveal(
  overlay: HTMLDivElement,
  content: HTMLDivElement,
  onComplete: () => void,
) {
  const letters = overlay.querySelectorAll<HTMLElement>("[data-reveal-letter]");
  const rule = overlay.querySelector<HTMLElement>("[data-reveal-rule]");
  const upper = overlay.querySelector<HTMLElement>("[data-reveal-upper]");
  const lower = overlay.querySelector<HTMLElement>("[data-reveal-lower]");
  const nav = content.querySelector<HTMLElement>("[data-reveal-nav]");
  const heading = content.querySelectorAll<HTMLElement>("[data-reveal-heading-line]");
  const image = content.querySelector<HTMLImageElement>("[data-hero-image]");
  const description = content.querySelector<HTMLElement>("[data-reveal-description]");
  const action = content.querySelector<HTMLElement>("[data-reveal-action]");

  if (
    !letters.length || !rule || !upper || !lower || !nav || !heading.length ||
    !image || !description || !action
  ) return;

  const clearFade = "opacity,visibility";
  const clearEntrance = "opacity,visibility,transform";

  return gsap.timeline({ paused: true, defaults: { ease: "power2.out" }, onComplete })
    .addLabel("brand", 0)
    .addLabel("brandExit", 1.02)
    .addLabel("curtain", "brandExit+=0.41")
    .addLabel("hero", "curtain+=0.37")
    .fromTo(letters, { autoAlpha: 0, yPercent: 52 }, {
      autoAlpha: 1, yPercent: 0, duration: 0.58, stagger: { amount: 0.28 },
    }, "brand")
    .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.7 }, "brand+=0.22")
    .to(letters, {
      yPercent: -124,
      duration: 0.43,
      ease: "sine.inOut",
      stagger: gsap.utils.distribute({ amount: 0.18, from: "center" }),
    }, "brandExit")
    .to(rule, { scaleX: 0, duration: 0.4, ease: "sine.inOut" }, "brandExit+=0.02")
    .to([upper, lower], {
      yPercent: (index: number) => index === 0 ? -100 : 100,
      duration: 0.98,
      ease: "sine.inOut",
    }, "curtain")
    .fromTo(nav, { autoAlpha: 0 }, {
      autoAlpha: 1, duration: 0.56, clearProps: clearFade,
    }, "hero")
    .fromTo(heading, { autoAlpha: 0, yPercent: 24 }, {
      autoAlpha: 1, yPercent: 0, duration: 0.67, stagger: 0.08, clearProps: clearEntrance,
    }, "hero+=0.06")
    .fromTo(image, { scale: 1.055 }, {
      scale: 1, duration: 0.84, clearProps: "transform",
    }, "hero+=0.13")
    .fromTo(description, { autoAlpha: 0 }, {
      autoAlpha: 1, duration: 0.56, clearProps: clearFade,
    }, "hero+=0.23")
    .fromTo(action, { autoAlpha: 0, y: 8 }, {
      autoAlpha: 1, y: 0, duration: 0.57, clearProps: clearEntrance,
    }, "hero+=0.42");
}
