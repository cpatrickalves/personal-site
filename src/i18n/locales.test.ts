import { test } from "node:test";
import assert from "node:assert/strict";
import { toLocale } from "./locales.ts";

test("toLocale keeps a known locale", () => {
  assert.equal(toLocale("en"), "en");
  assert.equal(toLocale("pt-br"), "pt-br");
});

test("toLocale falls back to the default locale", () => {
  assert.equal(toLocale(undefined), "pt-br");
  assert.equal(toLocale("fr"), "pt-br");
});
