import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePostPath } from "./postPath.ts";

test("takes the locale from the folder and the slug from the file name", () => {
  assert.deepEqual(parsePostPath("en/hello-world.md"), {
    locale: "en",
    slug: "hello-world",
  });
  assert.deepEqual(parsePostPath("pt-br/hello-world.mdx"), {
    locale: "pt-br",
    slug: "hello-world",
  });
});

test("keeps the subfolders, slugified, in the slug", () => {
  assert.equal(
    parsePostPath("en/My Series/part-1.md").slug,
    "my-series/part-1"
  );
});

test("leaves folders starting with an underscore out of the slug", () => {
  assert.equal(
    parsePostPath("en/_drafts/series/part-1.md").slug,
    "series/part-1"
  );
});

test("slugifies the file name", () => {
  assert.equal(parsePostPath("en/Hello World.md").slug, "hello-world");
  assert.equal(parsePostPath("pt-br/introdução.md").slug, "introducao");
});

test("drops punctuation from the file name", () => {
  assert.equal(parsePostPath("en/C++ (tips).md").slug, "c-tips");
  assert.equal(parsePostPath("en/don't-panic.md").slug, "dont-panic");
});

test("both Versões of a Post share the slug", () => {
  assert.equal(
    parsePostPath("pt-br/series/part-1.md").slug,
    parsePostPath("en/series/part-1.md").slug
  );
});

test("throws when the file is not inside a locale folder", () => {
  assert.throws(() => parsePostPath("hello-world.md"), /locale folder/);
});
