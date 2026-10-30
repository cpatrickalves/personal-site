import { LOCALES, isLocale, type Locale } from "./locales.ts";

/**
 * Splits a content path, relative to its collection folder, into the locale
 * (the first folder) and the segments after it.
 * e.g. `pt-br/series/part-1.md` → `{ locale: "pt-br", segments: ["series", "part-1.md"] }`
 *
 * Throws when the first folder is not a locale, so a misplaced file breaks the
 * build instead of being published without a language.
 */
export function splitLocalePath(path: string): {
  locale: Locale;
  segments: string[];
} {
  const [first = "", ...segments] = path.split("/").filter(s => s !== "");
  if (!isLocale(first)) {
    throw new Error(
      `Content file "${path}" must be inside a locale folder (${LOCALES.join(", ")}).`
    );
  }
  return { locale: first, segments };
}
