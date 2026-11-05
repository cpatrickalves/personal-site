/** How long the new theme takes to grow from the toggle over the whole window. */
export const REVEAL_MS = 350;

/** The radius from a point to the window's farthest corner. */
export function revealRadius(
  x: number,
  y: number,
  width: number,
  height: number
): number {
  return Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
}

/** The circle only runs when it has colours to reveal and nothing to fight. */
export function shouldReveal(state: {
  coloursChange: boolean;
  reducedMotion: boolean;
  supported: boolean;
  navigating: boolean;
}): boolean {
  return (
    state.coloursChange &&
    !state.reducedMotion &&
    state.supported &&
    !state.navigating
  );
}
