import { getLocalePosts } from "@/utils/getLocalePosts";
import { getPostLocale, getPostSlug, type PostRef } from "@/utils/getPostPaths";
import { withBase } from "@/utils/withBase";
import type { Locale } from "./locales";
import { equivalentRoute, localePath, routePath, type Route } from "./routes";

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
 * or the blog list there when a Post has no Versão in `target`.
 */
export async function getEquivalentUrl(
  route: Route,
  target: Locale
): Promise<string> {
  const targetSlugs = new Set((await getLocalePosts(target)).map(getPostSlug));
  return localeUrl(target, equivalentRoute(route, targetSlugs));
}
