import { test } from "node:test";
import assert from "node:assert/strict";
import { equivalentRoute, localePath, routePath } from "./routes.ts";

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

test("a Post with a Versão in the other locale leads to that Versão", () => {
  const route = { page: "post", slug: "hello-world" } as const;
  assert.deepEqual(equivalentRoute(route, new Set(["hello-world"])), route);
});

test("a tag page leads to the same tag", () => {
  const route = { page: "tag", tag: "python" } as const;
  assert.deepEqual(equivalentRoute(route, new Set()), route);
});

test("a Post without a Versão in the other locale leads to the blog list", () => {
  assert.deepEqual(
    equivalentRoute({ page: "post", slug: "only-here" }, new Set(["other"])),
    { page: "blog" }
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
    assert.deepEqual(equivalentRoute({ page }, new Set()), { page });
  }
});
