// Fill <meta name="theme-color"> with the background token so Android's browser
// chrome matches the page. The token, not the body's computed colour: under
// reduced motion every property has a tiny transition, so the body would still
// report the old colour at this moment.
function fillThemeColor(): void {
  const bg = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--background")
    .trim();
  document
    .querySelector("meta[name='theme-color']")
    ?.setAttribute("content", bg);
}

fillThemeColor();
document.addEventListener("astro:after-swap", fillThemeColor);
document.addEventListener("theme-change", fillThemeColor);

// Carry the theme-color value across View Transitions to prevent the
// Android navigation bar from flashing during page transitions.
document.addEventListener("astro:before-swap", event => {
  const color = document
    .querySelector("meta[name='theme-color']")
    ?.getAttribute("content");
  if (color) {
    (event as { newDocument: Document }).newDocument
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", color);
  }
});
