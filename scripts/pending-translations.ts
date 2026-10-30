// Lists the Posts with no Versão in some locale or with a Versão marked
// `translationReviewed: false`. Prints the report as Markdown and, in CI,
// appends it to the Job Summary. Pending translations never fail the run.
// Run: pnpm translations

import { appendFileSync, readdirSync, readFileSync } from "node:fs";
import { basename } from "node:path";
import { parseFrontmatter } from "@astrojs/markdown-remark";
import {
  findPendingTranslations,
  formatReport,
  type PostVersion,
} from "../src/i18n/pendingTranslations.ts";
import { BLOG_PATH, parsePostPath } from "../src/utils/postPath.ts";

// The same files the `posts` collection loads: `**/[^_]*.{md,mdx}`.
const isPostFile = (path: string) =>
  /\.mdx?$/.test(path) && !basename(path).startsWith("_");

const versions = readdirSync(BLOG_PATH, { recursive: true, encoding: "utf8" })
  .map(path => path.replaceAll("\\", "/"))
  .filter(isPostFile)
  .map((path): PostVersion => {
    const file = `${BLOG_PATH}/${path}`;
    const { draft, fake, translationReviewed } = parseFrontmatter(
      readFileSync(file, "utf8")
    ).frontmatter;
    return {
      path: file,
      ...parsePostPath(path),
      draft: draft === true,
      fake: fake === true,
      translationReviewed:
        typeof translationReviewed === "boolean"
          ? translationReviewed
          : undefined,
    };
  });

const report = formatReport(findPendingTranslations(versions));
process.stdout.write(report);
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
}
