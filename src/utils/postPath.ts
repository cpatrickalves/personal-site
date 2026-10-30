import { splitLocalePath } from "../i18n/contentPath.ts";
import type { Locale } from "../i18n/locales.ts";
import { slugifyStr } from "./slugify.ts";

/** The folder of the `posts` collection, relative to the project root. */
export const BLOG_PATH = "src/content/posts";

/**
 * Splits the path of a Post, relative to the posts folder, into its locale
 * and its slug. The slug is the same in both Versões: the subfolders after the
 * locale folder (except those starting with `_`) plus the file name, slugified
 * (the file name without punctuation).
 * e.g. `en/My Series/part-1.md` → `{ locale: "en", slug: "my-series/part-1" }`
 */
export function parsePostPath(path: string): { locale: Locale; slug: string } {
  const { locale, segments } = splitLocalePath(path);
  const fileName = (segments.at(-1) ?? "").replace(/\.mdx?$/, "");
  const folders = segments
    .slice(0, -1)
    .filter(segment => !segment.startsWith("_"));
  const slug = [
    ...folders.map(folder => slugifyStr(folder)),
    slugifyStr(fileName, { strict: true }),
  ].join("/");
  return { locale, slug };
}
