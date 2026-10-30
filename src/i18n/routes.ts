import { DEFAULT_LOCALE, type Locale } from "./locales.ts";

/**
 * A page of the site, without its locale. Section names are the same in both
 * locales, so a Route plus a locale is enough to build any internal URL.
 */
export type Route =
  | { page: "home" }
  | { page: "blog" }
  | { page: "post"; slug: string }
  | { page: "tags" }
  | { page: "tag"; tag: string }
  | { page: "projects" }
  | { page: "talks" }
  | { page: "about" }
  | { page: "archives" }
  | { page: "search" }
  | { page: "rss" };

// Pages are directories, with a trailing slash as Astro builds them; the feed
// is a file.
function sectionPath(route: Route): string {
  switch (route.page) {
    case "home":
      return "";
    case "post":
      return `blog/${route.slug}/`;
    case "tags":
      return "blog/tags/";
    case "tag":
      return `blog/tags/${route.tag}/`;
    case "rss":
      return "rss.xml";
    default:
      return `${route.page}/`;
  }
}

/**
 * Prefixes a path, relative to the site root, with the locale: none for the
 * default locale, `/en/` for EN. No `base`; see `localeUrl` for links.
 * e.g. `("en", "blog/tags/")` → `/en/blog/tags/`
 */
export function localePath(locale: Locale, path: string): string {
  const prefix = locale === DEFAULT_LOCALE ? "/" : `/${locale}/`;
  return `${prefix}${path}`;
}

/** e.g. `("en", { page: "post", slug: "hello-world" })` → `/en/blog/hello-world/` */
export function routePath(locale: Locale, route: Route): string {
  return localePath(locale, sectionPath(route));
}

/**
 * The Route the language switch leads to, given the Post slugs that have a
 * Versão in the other locale:
 * - a Post with a Versão there leads to it;
 * - a Post without one leads to the blog list;
 * - a tag page leads to the same tag, which exists in both locales;
 * - every other page exists in both locales and leads to itself.
 */
export function equivalentRoute(
  route: Route,
  otherLocaleSlugs: ReadonlySet<string>
): Route {
  if (route.page === "post" && !otherLocaleSlugs.has(route.slug)) {
    return { page: "blog" };
  }
  return route;
}
