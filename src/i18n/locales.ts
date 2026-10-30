// The one list of locales: astro.config.ts, the content schemas and the
// content path helpers all read it.
export const LOCALES = ["pt-br", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt-br";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
