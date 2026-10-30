import type { CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n/locales";
import { BLOG_PATH, parsePostPath } from "./postPath";

export type PostRef = Pick<CollectionEntry<"posts">, "filePath">;

function parsePostRef({ filePath }: PostRef) {
  if (!filePath) {
    throw new Error("Post without a file path: its locale is unknown.");
  }
  return parsePostPath(filePath.replace(BLOG_PATH, ""));
}

/** The locale of a Post, taken from its folder (`pt-br/`, `en/`). */
export function getPostLocale(post: PostRef): Locale {
  return parsePostRef(post).locale;
}

/**
 * The slug of a Post, the same in both Versões, with no leading slash.
 * e.g. `en/series/part-1.md` → `series/part-1`
 */
export function getPostSlug(post: PostRef): string {
  return parsePostRef(post).slug;
}
