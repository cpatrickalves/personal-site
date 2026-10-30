import { test } from "node:test";
import assert from "node:assert/strict";
import { splitLocalePath } from "./contentPath.ts";

test("takes the locale from the first folder", () => {
  assert.deepEqual(splitLocalePath("pt-br/my-post.md"), {
    locale: "pt-br",
    segments: ["my-post.md"],
  });
  assert.deepEqual(splitLocalePath("en/my-post"), {
    locale: "en",
    segments: ["my-post"],
  });
});

test("keeps the subfolders after the locale", () => {
  assert.deepEqual(splitLocalePath("/en/series/part-1.mdx"), {
    locale: "en",
    segments: ["series", "part-1.mdx"],
  });
});

test("both Versões of a Post share the segments after the locale", () => {
  assert.deepEqual(
    splitLocalePath("pt-br/my-post.md").segments,
    splitLocalePath("en/my-post.md").segments
  );
});

test("throws when the file is not inside a locale folder", () => {
  assert.throws(() => splitLocalePath("my-post.md"), /my-post\.md/);
  assert.throws(() => splitLocalePath("pt_br/my-post.md"), /pt_br/);
  assert.throws(() => splitLocalePath("PT-BR/my-post.md"), /PT-BR/);
});
