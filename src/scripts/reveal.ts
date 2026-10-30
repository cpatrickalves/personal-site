// Reveal on scroll for elements marked with [data-reveal]. Elements stay
// visible until this script arms them, so no-JS and reduced-motion visitors
// always see the content.
const REVEALED = "is-revealed";

let observer: IntersectionObserver | undefined;

function setupReveal(): void {
  observer?.disconnect();
  const root = document.documentElement;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.remove("reveal-ready");
    return;
  }

  const targets = document.querySelectorAll<HTMLElement>(
    `[data-reveal]:not(.${REVEALED})`
  );
  // Anything already on screen at load is shown at once, never animated in.
  const fold = window.innerHeight;
  targets.forEach(el => {
    if (el.getBoundingClientRect().top < fold) el.classList.add(REVEALED);
  });

  observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add(REVEALED);
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" }
  );
  targets.forEach(el => {
    if (!el.classList.contains(REVEALED)) observer?.observe(el);
  });
  root.classList.add("reveal-ready");
}

document.addEventListener("astro:page-load", setupReveal);

export {};
