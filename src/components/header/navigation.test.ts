import { test } from "node:test";
import assert from "node:assert/strict";
import { navItems } from "./navigation.ts";

const allOn = { talks: true, showArchives: true };

function currentOf(path: string) {
  return navItems(allOn, path)
    .filter(item => item.current)
    .map(({ key, current }) => `${key}:${current}`);
}

test("the menu lists the sections in order", () => {
  assert.deepEqual(
    navItems(allOn, "/").map(({ key }) => key),
    ["blog", "tags", "projects", "talks", "about", "archives"]
  );
});

test("flags take Palestras and Arquivo out of the menu", () => {
  const keys = navItems({ talks: false, showArchives: false }, "/").map(
    ({ key }) => key
  );
  assert.deepEqual(keys, ["blog", "tags", "projects", "about"]);
});

test("the home page marks no section", () => {
  assert.deepEqual(currentOf("/"), []);
});

test("a section's own page is the current page", () => {
  assert.deepEqual(currentOf("/blog/"), ["blog:page"]);
  assert.deepEqual(currentOf("/about/"), ["about:page"]);
});

test("a page inside a section marks the section", () => {
  assert.deepEqual(currentOf("/blog/hello-world/"), ["blog:true"]);
  assert.deepEqual(currentOf("/blog/2/"), ["blog:true"]);
});

test("tags win over the blog they live under", () => {
  assert.deepEqual(currentOf("/blog/tags/"), ["tags:page"]);
  assert.deepEqual(currentOf("/blog/tags/ai/"), ["tags:true"]);
});

test("a path without a trailing slash still matches", () => {
  assert.deepEqual(currentOf("/projects"), ["projects:page"]);
  assert.deepEqual(currentOf("/blog/tags/ai"), ["tags:true"]);
});

test("a section name inside another word does not match", () => {
  assert.deepEqual(currentOf("/blogroll/"), []);
});
