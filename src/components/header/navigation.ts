import { DEFAULT_LOCALE } from "../../i18n/locales.ts";
import { routePath, type Route } from "../../i18n/routes.ts";

export type NavKey =
  "blog" | "tags" | "projects" | "talks" | "about" | "archives";

export type NavItem = {
  key: NavKey;
  route: Route;
  /** `page` on the section's own page, `true` on a page inside it. */
  current?: "page" | "true";
};

type NavFeatures = { talks: boolean; showArchives: boolean };

// Each section with its path without a locale (e.g. `/blog/tags/`), the
// default locale having no prefix.
const SECTIONS = (
  [
    { key: "blog", route: { page: "blog" } },
    { key: "tags", route: { page: "tags" } },
    { key: "projects", route: { page: "projects" } },
    { key: "talks", route: { page: "talks" } },
    { key: "about", route: { page: "about" } },
    { key: "archives", route: { page: "archives" } },
  ] satisfies { key: NavKey; route: Route }[]
).map(section => ({
  ...section,
  path: routePath(DEFAULT_LOCALE, section.route),
}));

/**
 * The menu of the header, the same on desktop and in the mobile menu.
 * `currentPath` is the page's path without the `base` and the locale. The
 * section with the longest matching path is the current one, so a tag page
 * marks Tags and not the Blog it lives under.
 */
export function navItems(
  features: NavFeatures,
  currentPath: string
): NavItem[] {
  const path = currentPath.endsWith("/") ? currentPath : `${currentPath}/`;
  const shown = SECTIONS.filter(
    ({ key }) =>
      (key !== "talks" || features.talks) &&
      (key !== "archives" || features.showArchives)
  );
  const current = shown
    .filter(section => path.startsWith(section.path))
    .sort((a, b) => b.path.length - a.path.length)
    .at(0);

  return shown.map(({ key, route, path: sectionPath }) => ({
    key,
    route,
    current:
      key === current?.key
        ? path === sectionPath
          ? "page"
          : "true"
        : undefined,
  }));
}
