import { getCollection } from "astro:content";
import type { Locale } from "@/i18n/locales";
import { getLocalePosts } from "./getLocalePosts";
import { getUniqueTags } from "./getUniqueTags";
import { slugifyAll } from "./slugify";

/**
 * Every tag of the site, each with the Posts of one locale that carry it,
 * newest first. A tag no Post of the locale carries has none: every tag has a
 * page in both locales, so the language switch always lands on the same tag.
 */
export async function getLocaleTags(locale: Locale) {
  const tags = getUniqueTags(await getCollection("posts"));
  const posts = await getLocalePosts(locale);

  return tags.map(({ tag, tagName }) => ({
    tag,
    tagName,
    posts: posts.filter(({ data }) => slugifyAll(data.tags).includes(tag)),
  }));
}
