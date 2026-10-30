import { getAllLocalePages, getLocalePages } from "@/utils/getLocalePages";
import { getPostLocale, getPostSlug, type PostRef } from "@/utils/getPostPaths";
import { withBase } from "@/utils/withBase";
import { LANG_TAGS, type Locale } from "./locales";
import {
  equivalentRoute,
  hreflangLocales,
  localePath,
  routePath,
  type Route,
} from "./routes";

/**
 * The link to a page in a locale, with the `base`. Every internal link goes
 * through here, so no path is written by hand.
 * e.g. `("en", { page: "blog" })` → `/personal-site/en/blog/`
 */
export function localeUrl(locale: Locale, route: Route): string {
  return withBase(routePath(locale, route));
}

/** Like `localeUrl`, for a path built from URL segments (the breadcrumb). */
export function localePathUrl(locale: Locale, path: string): string {
  return withBase(localePath(locale, path));
}

/** The link to a Post, in its own locale. */
export function getPostUrl(post: PostRef): string {
  return localeUrl(getPostLocale(post), {
    page: "post",
    slug: getPostSlug(post),
  });
}

/**
 * The link the language switch puts on a page: the same page in `target`,
 * or the closest list there when `target` does not build it (see
 * `equivalentRoute`).
 */
export async function getEquivalentUrl(
  route: Route,
  target: Locale
): Promise<string> {
  return localeUrl(
    target,
    equivalentRoute(route, await getLocalePages(target))
  );
}

/**
 * The `hreflang` links of a page: one per locale that builds the same Route,
 * or none when only one does. `href` has the `base` but no origin.
 */
export async function getHreflangLinks(
  route: Route
): Promise<{ lang: string; href: string }[]> {
  return hreflangLocales(route, await getAllLocalePages()).map(locale => ({
    lang: LANG_TAGS[locale],
    href: localeUrl(locale, route),
  }));
}
