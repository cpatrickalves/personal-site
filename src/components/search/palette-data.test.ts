import { test } from "node:test";
import assert from "node:assert/strict";
import en from "../../i18n/lang/en.ts";
import ptBr from "../../i18n/lang/pt-br.ts";
import { localePath, routePath, type Route } from "../../i18n/routes.ts";
import {
  groupOrder,
  matchesQuery,
  MAX_RESULTS,
  pagefindBaseUrl,
  paletteKey,
  paletteSections,
  resultCount,
  serialisePaletteData,
  shortcutFor,
  splitResults,
  toPalettePost,
} from "./palette-data.ts";

const key = (overrides: Partial<Parameters<typeof paletteKey>[0]>) => ({
  key: "",
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  ...overrides,
});
const body = { tagName: "BODY", isContentEditable: false };

test("C1 ⌘K e Ctrl+K abrem ou fecham", () => {
  assert.equal(paletteKey(key({ key: "k", metaKey: true }), body), "toggle");
  assert.equal(paletteKey(key({ key: "k", ctrlKey: true }), body), "toggle");
  assert.equal(paletteKey(key({ key: "K", ctrlKey: true }), body), "toggle");
  // Inside the palette's own field, the shortcut still closes it.
  assert.equal(
    paletteKey(key({ key: "k", ctrlKey: true }), { tagName: "INPUT" }),
    "toggle"
  );
  assert.equal(paletteKey(key({ key: "k" }), body), null);
  assert.equal(
    paletteKey(key({ key: "k", ctrlKey: true, shiftKey: true }), body),
    null
  );
  assert.equal(
    paletteKey(key({ key: "k", metaKey: true, altKey: true }), body),
    null
  );
  assert.equal(
    paletteKey(key({ key: "k", ctrlKey: true, isComposing: true }), body),
    null
  );
});

test("C2 / abre fora de campos de texto e não nos 4 tipos de campo", () => {
  assert.equal(paletteKey(key({ key: "/" }), body), "open");
  assert.equal(paletteKey(key({ key: "/" }), { tagName: "A" }), "open");
  assert.equal(paletteKey(key({ key: "/" }), null), "open");
  for (const tagName of ["INPUT", "TEXTAREA", "SELECT"]) {
    assert.equal(paletteKey(key({ key: "/" }), { tagName }), null, tagName);
  }
  assert.equal(
    paletteKey(key({ key: "/" }), { tagName: "DIV", isContentEditable: true }),
    null
  );
  assert.equal(paletteKey(key({ key: "/", ctrlKey: true }), body), null);
  assert.equal(
    paletteKey(key({ key: "/", defaultPrevented: true }), body),
    null
  );
});

test("C4 atalho por sistema nos 5 sistemas", () => {
  const cases: [string, string][] = [
    ["MacIntel", "⌘K"],
    ["macOS", "⌘K"],
    ["iPhone", "⌘K"],
    ["iPad", "⌘K"],
    ["iOS", "⌘K"],
    ["Win32", "Ctrl+K"],
    ["Windows", "Ctrl+K"],
    ["Linux x86_64", "Ctrl+K"],
    ["Android", "Ctrl+K"],
    ["Linux armv8l", "Ctrl+K"],
  ];
  for (const [platform, shortcut] of cases) {
    assert.equal(shortcutFor(platform), shortcut, platform);
  }
});

test("C11 fragmento vira linha com título, trecho e data", () => {
  const row = toPalettePost({
    url: "/personal-site/blog/hello-world/",
    excerpt: "Olá, <mark>mundo</mark>. Texto provisório.",
    meta: { title: " Olá, mundo " },
    filters: { date: ["2026-02-28"] },
  });
  assert.deepEqual(row, {
    url: "/personal-site/blog/hello-world/",
    title: "Olá, mundo",
    date: "2026-02-28",
    excerpt: "Olá, <mark>mundo</mark>. Texto provisório.",
  });
  // No tags reach the row, whatever the fragment carries.
  assert.equal("tags" in row, false);
  // A fragment without meta falls back to its URL and no date.
  assert.deepEqual(toPalettePost({ url: "/blog/x/" }), {
    url: "/blog/x/",
    title: "/blog/x/",
    date: "",
    excerpt: "",
  });
});

test("C12 corta em 8 e conta os que sobram em 8, 9 e 18 achados", () => {
  assert.equal(MAX_RESULTS, 8);
  const found = (n: number) => Array.from({ length: n }, (_, i) => i);

  assert.deepEqual(splitResults(found(8), false), {
    shown: found(8),
    more: 0,
  });
  assert.deepEqual(splitResults(found(9), false), {
    shown: found(8),
    more: 1,
  });
  assert.deepEqual(splitResults(found(18), false), {
    shown: found(8),
    more: 10,
  });
  // Expanded: every result, in Pagefind's order, and no row left.
  assert.deepEqual(splitResults(found(18), true), {
    shown: found(18),
    more: 0,
  });
  assert.deepEqual(splitResults([], false), { shown: [], more: 0 });

  assert.equal(ptBr.search.showMore.replace("{{n}}", "10"), "Mostrar mais 10");
  assert.equal(en.search.showMore.replace("{{n}}", "10"), "Show 10 more");
});

test("C15 baseUrl do Pagefind com e sem base", () => {
  assert.equal(pagefindBaseUrl("/personal-site"), "/personal-site/");
  assert.equal(pagefindBaseUrl("/personal-site/"), "/personal-site/");
  assert.equal(pagefindBaseUrl("/"), "/");
  assert.equal(pagefindBaseUrl(""), "/");
});

test("C19 contagem no singular e no plural nos 2 idiomas", () => {
  assert.equal(resultCount(1, ptBr.search), "1 resultado");
  assert.equal(resultCount(0, ptBr.search), "0 resultados");
  assert.equal(resultCount(7, ptBr.search), "7 resultados");
  assert.equal(resultCount(1, en.search), "1 result");
  assert.equal(resultCount(0, en.search), "0 results");
  assert.equal(resultCount(7, en.search), "7 results");
});

const flagsOn = { talks: false, showArchives: true };
const href = (route: Route) => `/personal-site${routePath("pt-br", route)}`;
const ptSections = paletteSections(flagsOn, ptBr.nav, href);
const matching = (query: string) =>
  ptSections.filter(section => matchesQuery(section, query)).map(s => s.title);

test("C22 seções filtradas por nome ou caminho nos 3 exemplos", () => {
  assert.deepEqual(matching("proj"), ["Projetos"]);
  assert.deepEqual(matching("PROJ"), ["Projetos"]);
  // `about` is only in Sobre's path, /about/.
  assert.deepEqual(matching("about"), ["Sobre"]);
  // Both words are only in Tags (/blog/tags/); Blog has no `tags`.
  assert.deepEqual(matching("blog tags"), ["Tags"]);
  assert.deepEqual(matching("Blog   TAGS"), ["Tags"]);
  assert.deepEqual(matching("projetos sobre"), []);
  // A blank term is an empty field: every section.
  assert.equal(matching("   ").length, ptSections.length);
  assert.deepEqual(groupOrder("   ", 0), ["latest", "navigation"]);
});

test("C21 seções na ordem do menu, com o Início e as flags", () => {
  assert.deepEqual(
    ptSections.map(({ title, href, path }) => [title, href, path]),
    [
      ["Início", "/personal-site/", "/"],
      ["Blog", "/personal-site/blog/", "/blog/"],
      ["Tags", "/personal-site/blog/tags/", "/blog/tags/"],
      ["Projetos", "/personal-site/projects/", "/projects/"],
      ["Sobre", "/personal-site/about/", "/about/"],
      ["Arquivo", "/personal-site/archives/", "/archives/"],
    ]
  );
  const enSections = paletteSections(
    { talks: true, showArchives: false },
    en.nav,
    route => localePath("en", routePath("pt-br", route).slice(1))
  );
  assert.deepEqual(
    enSections.map(({ title, href, path }) => [title, href, path]),
    [
      ["Home", "/en/", "/"],
      ["Blog", "/en/blog/", "/blog/"],
      ["Tags", "/en/blog/tags/", "/blog/tags/"],
      ["Projects", "/en/projects/", "/projects/"],
      ["Talks", "/en/talks/", "/talks/"],
      ["About", "/en/about/", "/about/"],
    ]
  );
});

test("C23 Navegação antes de Posts quando alguma seção casa", () => {
  assert.deepEqual(matching("sobre"), ["Sobre"]);
  assert.deepEqual(groupOrder("sobre", matching("sobre").length), [
    "navigation",
    "posts",
  ]);
  assert.deepEqual(matching("mundo"), []);
  assert.deepEqual(groupOrder("mundo", matching("mundo").length), [
    "posts",
    "navigation",
  ]);
  assert.deepEqual(groupOrder("", 6), ["latest", "navigation"]);
});

test("os dados da página não fecham a tag do script", () => {
  const out = serialisePaletteData({
    posts: [{ url: "/x/", title: "</script><b>", date: "2026-02-28" }],
    sections: [],
    strings: ptBr.search,
  });
  assert.equal(out.includes("<"), false);
  assert.equal(JSON.parse(out).posts[0].title, "</script><b>");
});
