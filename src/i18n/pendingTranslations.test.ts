import { test } from "node:test";
import assert from "node:assert/strict";
import {
  findPendingTranslations,
  formatReport,
  type PostVersion,
} from "./pendingTranslations.ts";

const version = (
  locale: PostVersion["locale"],
  slug: string,
  frontmatter: Partial<PostVersion> = {}
): PostVersion => ({
  path: `src/content/posts/${locale}/${slug}.md`,
  locale,
  slug,
  ...frontmatter,
});

test("a Post only in EN is missing its PT-BR Versão", () => {
  const { pending } = findPendingTranslations([version("en", "only-en")]);
  assert.deepEqual(pending, [
    {
      slug: "only-en",
      fake: false,
      problems: [
        {
          kind: "missing",
          locale: "pt-br",
          path: "src/content/posts/en/only-en.md",
        },
      ],
    },
  ]);
});

test("a Post only in PT-BR is missing its EN Versão", () => {
  const { pending } = findPendingTranslations([version("pt-br", "so-pt")]);
  assert.deepEqual(pending[0]?.problems, [
    { kind: "missing", locale: "en", path: "src/content/posts/pt-br/so-pt.md" },
  ]);
});

test("a Versão with translationReviewed: false is unreviewed, in any locale", () => {
  for (const locale of ["pt-br", "en"] as const) {
    const { pending } = findPendingTranslations([
      version("pt-br", "post", { translationReviewed: locale !== "pt-br" }),
      version("en", "post", { translationReviewed: locale !== "en" }),
    ]);
    assert.deepEqual(pending[0]?.problems, [
      {
        kind: "unreviewed",
        locale,
        path: `src/content/posts/${locale}/post.md`,
      },
    ]);
  }
});

test("a Versão with translationReviewed: true or without the field is done", () => {
  const result = findPendingTranslations([
    version("pt-br", "post", { translationReviewed: true }),
    version("en", "post"),
  ]);
  assert.deepEqual(result, { checked: 1, pending: [] });
});

test("drafts are left out, as if the file did not exist", () => {
  const result = findPendingTranslations([
    version("en", "both-drafts", { draft: true }),
    version("pt-br", "both-drafts", { draft: true }),
    version("en", "pt-draft"),
    version("pt-br", "pt-draft", { draft: true, translationReviewed: false }),
  ]);
  assert.equal(result.checked, 1);
  assert.deepEqual(
    result.pending.map(({ slug, problems }) => [slug, problems]),
    [
      [
        "pt-draft",
        [
          {
            kind: "missing",
            locale: "pt-br",
            path: "src/content/posts/en/pt-draft.md",
          },
        ],
      ],
    ]
  );
});

test("a Post is fake when any of its Versões is fake", () => {
  const { pending } = findPendingTranslations([
    version("en", "post", { fake: true, translationReviewed: false }),
    version("pt-br", "post"),
  ]);
  assert.equal(pending[0]?.fake, true);
});

test("throws when two files in one locale share a slug", () => {
  assert.throws(
    () =>
      findPendingTranslations([
        version("en", "post"),
        { ...version("en", "post"), path: "src/content/posts/en/_old/post.md" },
      ]),
    /same slug "post" in en/
  );
});

test("sorts the Posts by slug", () => {
  const { pending } = findPendingTranslations([
    version("en", "b"),
    version("en", "a"),
  ]);
  assert.deepEqual(
    pending.map(({ slug }) => slug),
    ["a", "b"]
  );
});

test("the report has one row per problem", () => {
  const report = formatReport(
    findPendingTranslations([
      version("en", "only-en", { fake: true }),
      version("pt-br", "post", { translationReviewed: false }),
      version("en", "post"),
      version("en", "done"),
      version("pt-br", "done"),
    ])
  );
  assert.equal(
    report,
    [
      "## Traduções pendentes",
      "",
      "2 de 3 Posts com pendência (rascunhos não entram).",
      "",
      "| Post | Pendência | Arquivo |",
      "| --- | --- | --- |",
      "| `only-en` (fake) | Falta a Versão PT-BR | `src/content/posts/en/only-en.md` |",
      "| `post` | Versão PT-BR não revisada | `src/content/posts/pt-br/post.md` |",
      "",
    ].join("\n")
  );
});

test("the report says so when nothing is pending", () => {
  const report = formatReport(
    findPendingTranslations([version("en", "done"), version("pt-br", "done")])
  );
  assert.equal(
    report,
    [
      "## Traduções pendentes",
      "",
      "Nenhuma tradução pendente: 1 Post verificado (rascunhos não entram).",
      "",
    ].join("\n")
  );
});
