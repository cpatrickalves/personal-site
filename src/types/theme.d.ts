export type ThemePref = "light" | "dark" | "system";

declare global {
  interface Window {
    /** Set by the inline script of `ThemeScript.astro`, before the first paint. */
    __theme: {
      get(): ThemePref;
      set(pref: ThemePref): void;
      next(): ThemePref;
      resolve(pref: ThemePref): "light" | "dark";
      cycle(): void;
    };
  }
}
