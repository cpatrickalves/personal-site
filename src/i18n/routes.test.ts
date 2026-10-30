import { test } from "node:test";
import assert from "node:assert/strict";
import {
  equivalentRoute,
  hreflangLocales,
  listPageCount,
  localePath,
  routePath,
  type LocalePages,
} from "./routes.ts";

test("PT-BR stays at the root and EN goes under /en", () => {
  assert.equal(routePath("pt-br", { page: "home" }), "/");
  assert.equal(routePath("en", { page: "home" }), "/en/");
  assert.equal(routePath("pt-br", { page: "about" }), "/about/");
  assert.equal(routePath("en", { page: "about" }), "/en/about/");
});

test("section names are the same in both locales", () => {
  for (const [locale, prefix] of [
    ["pt-br", "/"],
    ["en", "/en/"],
  ] as const) {
    assert.equal(routePath(locale, { page: "blog" }), `${prefix}blog/`);
    assert.equal(
      routePath(locale, { page: "post", slug: "hello-world" }),
      `${prefix}blog/hello-world/`
    );
    assert.equal(routePath(locale, { page: "tags" }), `${prefix}blog/tags/`);
    assert.equal(
      routePath(locale, { page: "tag", tag: "python" }),
      `${prefix}blog/tags/python/`
    );
    assert.equal(routePath(locale, { page: "projects" }), `${prefix}projects/`);
    assert.equal(routePath(locale, { page: "talks" }), `${prefix}talks/`);
    assert.equal(routePath(locale, { page: "archives" }), `${prefix}archives/`);
    assert.equal(routePath(locale, { page: "search" }), `${prefix}search/`);
  }
});

test("a Post in a subfolder keeps its subfolder in the URL", () => {
  assert.equal(
    routePath("en", { page: "post", slug: "series/part-1" }),
    "/en/blog/series/part-1/"
  );
});

test("the feed is a file, without a trailing slash", () => {
  assert.equal(routePath("pt-br", { page: "rss" }), "/rss.xml");
  assert.equal(routePath("en", { page: "rss" }), "/en/rss.xml");
});

test("localePath prefixes any path with the locale", () => {
  assert.equal(localePath("pt-br", "blog/tags/"), "/blog/tags/");
  assert.equal(localePath("en", "blog/tags/"), "/en/blog/tags/");
  assert.equal(localePath("en", ""), "/en/");
});

test("list pages after the first get their number in the path", () => {
  assert.equal(routePath("pt-br", { page: "blog", pageNumber: 1 }), "/blog/");
  assert.equal(routePath("en", { page: "blog", pageNumber: 2 }), "/en/blog/2/");
  assert.equal(
    routePath("pt-br", { page: "tag", tag: "python", pageNumber: 3 }),
    "/blog/tags/python/3/"
  );
});

test("a list has as many pages as Astro's paginate builds, at least one", () => {
  assert.equal(listPageCount(0, 4), 1);
  assert.equal(listPageCount(4, 4), 1);
  assert.equal(listPageCount(5, 4), 2);
});

// PT-BR has two Posts, one with an EN Versão, and two pages of blog list;
// EN has one page and no Posts tagged "python".
const ptPages: LocalePages = {
  postSlugs: new Set(["hello-world", "only-pt"]),
  blogPages: 2,
  tagPages: new Map([
    ["python", 2],
    ["astro", 1],
  ]),
};
const enPages: LocalePages = {
  postSlugs: new Set(["hello-world"]),
  blogPages: 1,
  tagPages: new Map([
    ["python", 1],
    ["astro", 1],
  ]),
};

test("a Post with a Versão in the other locale leads to that Versão", () => {
  const route = { page: "post", slug: "hello-world" } as const;
  assert.deepEqual(equivalentRoute(route, enPages), route);
});

test("a Post without a Versão in the other locale leads to the blog list", () => {
  assert.deepEqual(
    equivalentRoute({ page: "post", slug: "only-pt" }, enPages),
    { page: "blog" }
  );
});

test("a tag page leads to the same tag, even with no Posts there", () => {
  const route = { page: "tag", tag: "python" } as const;
  assert.deepEqual(equivalentRoute(route, enPages), route);
});

test("a list page missing in the other locale leads to its first page", () => {
  assert.deepEqual(equivalentRoute({ page: "blog", pageNumber: 2 }, enPages), {
    page: "blog",
  });
  assert.deepEqual(
    equivalentRoute({ page: "tag", tag: "python", pageNumber: 2 }, enPages),
    { page: "tag", tag: "python" }
  );
});

test("pages that exist in both locales lead to themselves", () => {
  for (const page of [
    "home",
    "blog",
    "tags",
    "projects",
    "talks",
    "about",
    "archives",
    "search",
    "rss",
  ] as const) {
    assert.deepEqual(equivalentRoute({ page }, enPages), { page });
  }
});

const pages = { "pt-br": ptPages, en: enPages };

test("a page built in both locales gets hreflang for both", () => {
  for (const route of [
    { page: "home" },
    { page: "post", slug: "hello-world" },
    { page: "blog" },
    { page: "tag", tag: "python" },
    { page: "tags" },
  ] as const) {
    assert.deepEqual(hreflangLocales(route, pages), ["pt-br", "en"]);
  }
});

test("a page built in one locale only gets no hreflang", () => {
  for (const route of [
    { page: "post", slug: "only-pt" },
    { page: "blog", pageNumber: 2 },
    { page: "tag", tag: "python", pageNumber: 2 },
  ] as const) {
    assert.deepEqual(hreflangLocales(route, pages), []);
  }
});
