/**
 * Imported by `CommandPaletteLoader.astro` on the first open, from
 * karhdo.dev's `mount-palette.tsx` (MIT, see THIRD_PARTY_NOTICES.md): this
 * module and what it imports (React, react-dom, cmdk, the palette's CSS) are
 * a chunk of their own. The CSS comes as a string (`?inline`) and renders in
 * a `<style>` inside the root: a plain import would be hoisted into every
 * page, and a `<style>` in `<head>` would go at the next page swap. One root
 * per page life: `#cmdk-root` is persisted across ClientRouter navigations.
 */
import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import CommandPalette from "./CommandPalette";
import paletteCss from "./palette.css?inline";

let root: Root | undefined;

export function mountPalette(
  element: HTMLElement,
  opener: HTMLElement | null
): void {
  if (root) return;
  root = createRoot(element);
  root.render(
    <StrictMode>
      <style>{paletteCss}</style>
      <CommandPalette initialOpener={opener} />
    </StrictMode>
  );
}
