/**
 * The rules of the ⌘K palette, adapted from karhdo.dev's
 * `src/components/search/palette-data.ts` (MIT, see THIRD_PARTY_NOTICES.md):
 * what a Pagefind result shows, which sections match a term, how many rows
 * the list keeps, the order of the groups and the shortcut of each system.
 * Shared by the loader in the page and the palette loaded on the first open.
 * No DOM, no React, no aliases: `node --test` runs it.
 */
import { tplStr } from "../../i18n/format.ts";
import { DEFAULT_LOCALE } from "../../i18n/locales.ts";
import { routePath, type Route } from "../../i18n/routes.ts";
import { navItems, type NavKey } from "../header/navigation.ts";
import type { UIStrings } from "../../i18n/types.ts";

/** A Post row: the latest Posts (empty field) and the Pagefind results. */
export type PalettePost = {
  url: string;
  title: string;
  /** Publication date, `AAAA-MM-DD`, as `formatDate` gives it. */
  date: string;
  /** Pagefind's excerpt: only `<` and `>` escaped, the term in `<mark>`. */
  excerpt?: string;
};

/** A section of the site: the home and the sections of the bar's menu. */
export type PaletteSection = {
  title: string;
  /** The link, with the `base`, from `localeUrl`. */
  href: string;
  /** The path without `base` nor locale (`/about/`), matched like the name. */
  path: string;
};

/** The palette's texts, in the page's language. */
export type PaletteStrings = UIStrings["search"];

/** What a page writes for the palette: read again on every open. */
export type PaletteData = {
  posts: PalettePost[];
  sections: PaletteSection[];
  strings: PaletteStrings;
};

/** The part of a Pagefind `result.data()` the palette reads. */
export type PagefindFragment = {
  url: string;
  excerpt?: string;
  meta?: Record<string, string | undefined>;
  filters?: Record<string, string[] | undefined>;
};

/**
 * The sections the palette offers: the home, then the bar's menu in its
 * order, with the same flags. `href` builds a link with the `base`
 * (`localeUrl` in the page's locale); `names` are the menu's labels.
 */
export function paletteSections(
  features: { talks: boolean; showArchives: boolean },
  names: Record<NavKey | "home", string>,
  href: (route: Route) => string
): PaletteSection[] {
  const routes: { key: NavKey | "home"; route: Route }[] = [
    { key: "home", route: { page: "home" } },
    ...navItems(features, "/").map(({ key, route }) => ({ key, route })),
  ];
  return routes.map(({ key, route }) => ({
    title: names[key],
    href: href(route),
    path: routePath(DEFAULT_LOCALE, route),
  }));
}

/** Pagefind results shown before the `Mostrar mais` row. */
export const MAX_RESULTS = 8;

/** Latest Posts shown with the field empty. */
export const LATEST_POSTS = 3;

/**
 * A Pagefind fragment as a row: the title is the Post's `<h1>`, the date the
 * `date` filter that `PostPage.astro` writes (a meta would be searchable
 * text). The URL already has the `base`, which `pagefindBaseUrl` hands to
 * Pagefind.
 */
export function toPalettePost(fragment: PagefindFragment): PalettePost {
  return {
    url: fragment.url,
    title: fragment.meta?.title?.trim() || fragment.url,
    date: fragment.filters?.date?.[0]?.trim() ?? "",
    excerpt: fragment.excerpt ?? "",
  };
}

/**
 * Pagefind's `baseUrl` for a site `base`: the prefix it puts on every result
 * URL. e.g. `/personal-site` → `/personal-site/`, `/` → `/`
 */
export function pagefindBaseUrl(base: string): string {
  return `${base.replace(/\/+$/, "")}/`;
}

/** The words of a term, lower-cased; none for a blank term. */
export function queryWords(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

/**
 * True when every word of the term is in the section's name or path,
 * ignoring case. A blank term matches every section.
 */
export function matchesQuery(section: PaletteSection, query: string): boolean {
  const haystack = `${section.title} ${section.path}`.toLowerCase();
  return queryWords(query).every(word => haystack.includes(word));
}

/**
 * The results the list shows: the first `MAX_RESULTS`, and how many are left
 * for the `Mostrar mais` row, until the reader asks for them all.
 */
export function splitResults<T>(
  results: readonly T[],
  expanded: boolean
): { shown: T[]; more: number } {
  if (expanded || results.length <= MAX_RESULTS) {
    return { shown: [...results], more: 0 };
  }
  return {
    shown: results.slice(0, MAX_RESULTS),
    more: results.length - MAX_RESULTS,
  };
}

export type PaletteGroup = "latest" | "posts" | "navigation";

/**
 * The order of the groups. Empty field: the latest Posts, then the sections.
 * A term: the sections first whenever one matches, so `sobre` opens Sobre
 * and not the 9th row; otherwise the Posts.
 */
export function groupOrder(
  query: string,
  matchingSections: number
): PaletteGroup[] {
  if (queryWords(query).length === 0) return ["latest", "navigation"];
  return matchingSections > 0
    ? ["navigation", "posts"]
    : ["posts", "navigation"];
}

/** What the live region says: `1 resultado`, `3 resultados`. */
export function resultCount(rows: number, strings: PaletteStrings): string {
  return tplStr(rows === 1 ? strings.resultOne : strings.resultOther, {
    n: rows,
  });
}

/** The shortcut the reader's system uses: ⌘K on Apple systems, else Ctrl+K. */
export function shortcutFor(platform: string): "⌘K" | "Ctrl+K" {
  return /mac|iphone|ipad|ipod|ios/i.test(platform) ? "⌘K" : "Ctrl+K";
}

type KeyLike = {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  isComposing?: boolean;
  defaultPrevented?: boolean;
};

type TargetLike = { tagName?: string; isContentEditable?: boolean } | null;

/** True when a key lands in a text field: `/` is typed there. */
export function isTypingTarget(target: TargetLike): boolean {
  if (!target) return false;
  return (
    target.isContentEditable === true ||
    /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName ?? "")
  );
}

/**
 * What a key does to the palette: ⌘K and Ctrl+K open or close it, `/` opens
 * it outside text fields, anything else nothing.
 */
export function paletteKey(
  event: KeyLike,
  target: TargetLike
): "toggle" | "open" | null {
  if (event.isComposing) return null;
  if (
    (event.metaKey || event.ctrlKey) &&
    !event.altKey &&
    !event.shiftKey &&
    event.key.toLowerCase() === "k"
  ) {
    return "toggle";
  }
  if (
    event.key === "/" &&
    !event.defaultPrevented &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !isTypingTarget(target)
  ) {
    return "open";
  }
  return null;
}

/**
 * The data as JSON for a `<script type="application/json">`: `<` is escaped,
 * so a title with `</script>` cannot close the tag.
 */
export function serialisePaletteData(data: PaletteData): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
