import type { TransitionDirectionalAnimations } from "astro";

// Page transition for the main content: the outgoing page sinks and fades,
// the incoming one rises. Keyframes live in src/styles/motion.css, which also
// turns them off under prefers-reduced-motion.
const sink = {
  name: "vt-sink",
  duration: "0.18s",
  easing: "cubic-bezier(0.7, 0, 0.84, 0)",
  fillMode: "both",
};

const rise = {
  name: "vt-rise",
  duration: "0.5s",
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  delay: "0.08s",
  fillMode: "both",
};

export const pageRise: TransitionDirectionalAnimations = {
  forwards: { old: sink, new: rise },
  backwards: { old: sink, new: rise },
};
