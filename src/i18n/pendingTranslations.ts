import { LOCALES, type Locale } from "./locales.ts";

/** One Versão of a Post, with the frontmatter fields the report reads. */
export interface PostVersion {
  path: string;
  locale: Locale;
  slug: string;
  draft?: boolean;
  fake?: boolean;
  translationReviewed?: boolean;
}

/**
 * `missing`: the Post has no Versão in `locale`; `path` is a Versão it has.
 * `unreviewed`: the Versão at `path` is a translation still waiting for review.
 */
export interface TranslationProblem {
  kind: "missing" | "unreviewed";
  locale: Locale;
  path: string;
}

export interface PendingTranslation {
  slug: string;
  fake: boolean;
  problems: TranslationProblem[];
}

export interface PendingTranslations {
  /** How many Posts were checked, drafts left out. */
  checked: number;
  pending: PendingTranslation[];
}

/**
 * Finds the Posts with no Versão in some locale, or with a Versão marked
 * `translationReviewed: false`. A Versão without the field is an original.
 * Drafts are left out, as if the file did not exist: they are not published.
 * Throws when two files in one locale share a slug.
 */
export function findPendingTranslations(
  versions: PostVersion[]
): PendingTranslations {
  const posts = new Map<string, PostVersion[]>();
  for (const version of versions.filter(({ draft }) => !draft)) {
    const postVersions = posts.get(version.slug) ?? [];
    const twin = postVersions.find(({ locale }) => locale === version.locale);
    if (twin) {
      throw new Error(
        `"${twin.path}" and "${version.path}" have the same slug "${version.slug}" in ${version.locale}.`
      );
    }
    posts.set(version.slug, [...postVersions, version]);
  }

  const pending = [...posts]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([slug, postVersions]) => ({
      slug,
      fake: postVersions.some(({ fake }) => fake),
      problems: LOCALES.flatMap((locale): TranslationProblem[] => {
        const version = postVersions.find(v => v.locale === locale);
        if (!version) {
          return [{ kind: "missing", locale, path: postVersions[0].path }];
        }
        return version.translationReviewed === false
          ? [{ kind: "unreviewed", locale, path: version.path }]
          : [];
      }),
    }))
    .filter(({ problems }) => problems.length > 0);

  return { checked: posts.size, pending };
}

const describe = ({ kind, locale }: TranslationProblem) =>
  kind === "missing"
    ? `Falta a Versão ${locale.toUpperCase()}`
    : `Versão ${locale.toUpperCase()} não revisada`;

/** The report as Markdown, for the CI Job Summary and the terminal. */
export function formatReport({
  checked,
  pending,
}: PendingTranslations): string {
  const lines = ["## Traduções pendentes", ""];
  if (pending.length === 0) {
    const label = checked === 1 ? "Post verificado" : "Posts verificados";
    lines.push(
      `Nenhuma tradução pendente: ${checked} ${label} (rascunhos não entram).`
    );
  } else {
    const label = checked === 1 ? "Post" : "Posts";
    lines.push(
      `${pending.length} de ${checked} ${label} com pendência (rascunhos não entram).`,
      "",
      "| Post | Pendência | Arquivo |",
      "| --- | --- | --- |",
      ...pending.flatMap(({ slug, fake, problems }) =>
        problems.map(
          problem =>
            `| \`${slug}\`${fake ? " (fake)" : ""} | ${describe(problem)} | \`${problem.path}\` |`
        )
      )
    );
  }
  return [...lines, ""].join("\n");
}
