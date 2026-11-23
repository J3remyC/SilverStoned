import type { Ref } from "react";

const bootstrap = `
(() => {
  if (
    !matchMedia('(prefers-reduced-motion: no-preference)').matches ||
    document.hidden || location.hash ||
    performance.getEntriesByType('navigation')[0]?.type === 'back_forward'
  ) return;

  const root = document.documentElement;
  const scrollbarProbe = document.createElement('div');
  scrollbarProbe.style.cssText = 'position:absolute;visibility:hidden;overflow:scroll;width:100px;height:100px';
  document.body.append(scrollbarProbe);
  const scrollbarWidth = scrollbarProbe.offsetWidth - scrollbarProbe.clientWidth;
  scrollbarProbe.remove();

  root.style.setProperty('--reveal-scrollbar', scrollbarWidth + 'px');
  root.dataset.websiteReveal = 'pending';

  // Let the server-rendered page through if the animation bundle never starts.
  setTimeout(() => {
    if (root.dataset.websiteReveal === 'pending') {
      delete root.dataset.websiteReveal;
      root.style.removeProperty('--reveal-scrollbar');
    }
  }, 2500);
})();`;

export function RevealOverlay({ ref }: { ref: Ref<HTMLDivElement> }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
      <div ref={ref} className="website-reveal" aria-hidden="true" inert>
        <div className="website-reveal__panel website-reveal__panel--upper" data-reveal-upper />
        <div className="website-reveal__panel website-reveal__panel--lower" data-reveal-lower />
        <div className="website-reveal__mark" data-reveal-mark>
          <div className="website-reveal__wordmark">
            {["SILVER", "STONED"].map((word) => (
              <span className="website-reveal__word" key={word}>
                {Array.from(word, (letter, index) => (
                  <span key={index} data-reveal-letter>{letter}</span>
                ))}
              </span>
            ))}
          </div>
          <span className="website-reveal__rule" data-reveal-rule />
        </div>
      </div>
    </>
  );
}
