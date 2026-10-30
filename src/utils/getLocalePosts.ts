import { getCollection } from "astro:content";
import type { Locale } from "@/i18n/locales";
import { getPostLocale } from "./getPostPaths";
import { getSortedPosts } from "./getSortedPosts";

/**
 * The Posts of one locale that are shown to readers (no drafts, no scheduled
 * posts), newest first. Each locale lists only its own Posts.
 */
export async function getLocalePosts(locale: Locale) {
  const posts = await getCollection(
    "posts",
    post => getPostLocale(post) === locale
  );
  return getSortedPosts(posts);
}
