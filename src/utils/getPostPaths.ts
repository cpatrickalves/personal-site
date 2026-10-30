import type { CollectionEntry } from "astro:content";
import { BLOG_PATH } from "@/content.config";
import { splitLocalePath } from "@/i18n/contentPath";
import type { Locale } from "@/i18n/locales";
import { slugifyStr } from "./slugify";

export type PostRef = Pick<CollectionEntry<"posts">, "id" | "filePath">;

function splitPostPath(filePath: string | undefined) {
  if (!filePath) {
    throw new Error("Post without a file path: its locale is unknown.");
  }
  return splitLocalePath(filePath.replace(BLOG_PATH, ""));
}

/** The locale of a Post, taken from its folder (`pt-br/`, `en/`). */
export function getPostLocale({ filePath }: PostRef): Locale {
  return splitPostPath(filePath).locale;
}

/**
 * The slug of a Post, the same in both Versões: the subfolders after the
 * locale folder plus the file name, with no leading slash.
 * e.g. `en/series/part-1.md` → `series/part-1`
 */
export function getPostSlug({ id, filePath }: PostRef): string {
  const folders = splitPostPath(filePath)
    .segments.filter(path => !path.startsWith("_"))
    .slice(0, -1)
    .map(segment => slugifyStr(segment));
  const idSlug = id.split("/").at(-1) ?? id;
  return [...folders, idSlug].join("/");
}
