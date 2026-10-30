import { DEFAULT_LOCALE, LOCALES, type Locale } from "./locales.ts";

/**
 * A page of the site, without its locale. Section names are the same in both
 * locales, so a Route plus a locale is enough to build any internal URL.
 * Paginated lists carry their page number; none means the first page.
 */
export type Route =
  | { page: "home" }
  | { page: "blog"; pageNumber?: number }
  | { page: "post"; slug: string }
  | { page: "tags" }
  | { page: "tag"; tag: string; pageNumber?: number }
  | { page: "projects" }
  | { page: "talks" }
  | { page: "about" }
  | { page: "archives" }
  | { page: "search" }
  | { page: "rss" };

// Pages are directories, with a trailing slash as Astro builds them; the feed
// is a file. The first page of a list has no number, as `paginate` builds it.
function pageNumberPath(pageNumber = 1): string {
  return pageNumber > 1 ? `${pageNumber}/` : "";
}

function sectionPath(route: Route): string {
  switch (route.page) {
    case "home":
      return "";
    case "blog":
      return `blog/${pageNumberPath(route.pageNumber)}`;
    case "post":
      return `blog/${route.slug}/`;
    case "tags":
      return "blog/tags/";
    case "tag":
      return `blog/tags/${route.tag}/${pageNumberPath(route.pageNumber)}`;
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
 * What a locale builds, enough to tell whether a Route exists there: the slugs
 * of its Posts and how many pages the blog list and each tag list have. Every
 * tag has at least one page in both locales.
 */
export type LocalePages = {
  postSlugs: ReadonlySet<string>;
  blogPages: number;
  tagPages: ReadonlyMap<string, number>;
};

/** How many pages Astro's `paginate` builds for a list: at least one. */
export function listPageCount(items: number, pageSize: number): number {
  return Math.max(1, Math.ceil(items / pageSize));
}

function routeExists(route: Route, pages: LocalePages): boolean {
  switch (route.page) {
    case "post":
      return pages.postSlugs.has(route.slug);
    case "blog":
      return (route.pageNumber ?? 1) <= pages.blogPages;
    case "tag":
      return (route.pageNumber ?? 1) <= (pages.tagPages.get(route.tag) ?? 0);
    default:
      return true;
  }
}

/**
 * The Route the language switch leads to, given what the other locale builds:
 * - the same page when it exists there;
 * - a Post without a Versão there leads to the blog list;
 * - a list page beyond the other locale's last leads to that list's first page.
 */
export function equivalentRoute(route: Route, otherPages: LocalePages): Route {
  if (routeExists(route, otherPages)) {
    return route;
  }
  switch (route.page) {
    case "post":
    case "blog":
      return { page: "blog" };
    case "tag":
      return { page: "tag", tag: route.tag };
    default:
      return route;
  }
}

/**
 * The locales a page gets `hreflang` links for: every locale that builds the
 * same Route, or none when only one does. The sitemap pairs URLs the same way.
 */
export function hreflangLocales(
  route: Route,
  pages: Record<Locale, LocalePages>
): Locale[] {
  const locales = LOCALES.filter(locale => routeExists(route, pages[locale]));
  return locales.length > 1 ? locales : [];
}
