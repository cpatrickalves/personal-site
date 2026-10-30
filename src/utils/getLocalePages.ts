import { LOCALES, type Locale } from "@/i18n/locales";
import { listPageCount, type LocalePages } from "@/i18n/routes";
import { getLocalePosts } from "./getLocalePosts";
import { getLocaleTags } from "./getLocaleTags";
import { getPostSlug } from "./getPostPaths";
import config from "@/config";

// Every page's head asks for both locales, so the build counts each locale's
// pages once. The dev server recounts on every request to see content edits.
const cache = new Map<Locale, Promise<LocalePages>>();

async function countLocalePages(locale: Locale): Promise<LocalePages> {
  const { perPage } = config.posts;
  // The same lists `blogListPaths` and `tagPaths` paginate.
  const posts = await getLocalePosts(locale);
  const tags = await getLocaleTags(locale);

  return {
    postSlugs: new Set(posts.map(getPostSlug)),
    blogPages: listPageCount(posts.length, perPage),
    tagPages: new Map(
      tags.map(({ tag, posts }) => [tag, listPageCount(posts.length, perPage)])
    ),
  };
}

/** What a locale builds: its Post slugs and how many pages each list has. */
export function getLocalePages(locale: Locale): Promise<LocalePages> {
  if (import.meta.env.DEV) {
    return countLocalePages(locale);
  }
  let pages = cache.get(locale);
  if (!pages) {
    pages = countLocalePages(locale);
    cache.set(locale, pages);
  }
  return pages;
}

/** What every locale builds, keyed by locale. */
export async function getAllLocalePages(): Promise<
  Record<Locale, LocalePages>
> {
  const entries = await Promise.all(
    LOCALES.map(async locale => [locale, await getLocalePages(locale)] as const)
  );
  return Object.fromEntries(entries) as Record<Locale, LocalePages>;
}
