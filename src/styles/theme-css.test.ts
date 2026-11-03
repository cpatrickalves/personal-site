import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseThemeBlocks, themeBlockProblems } from "./theme-css.ts";

const real = readFileSync(new URL("./theme.css", import.meta.url), "utf8");

const css = (light: string, dark: string, media: string) => `
:root,
[data-theme="light"] { ${light} }
[data-theme="dark"] { ${dark} }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { ${media} }
}`;

const problems = (source: string) =>
  themeBlockProblems(parseThemeBlocks(source));

test("C23 theme.css real tem cópias iguais e os mesmos papéis", () => {
  const blocks = parseThemeBlocks(real);
  for (const token of [
    "--background",
    "--foreground",
    "--warning",
    "--danger",
  ]) {
    assert.ok(blocks.dark.has(token), `${token} no escuro`);
    assert.ok(blocks.darkMedia.has(token), `${token} na cópia`);
    assert.ok(blocks.light.has(token), `${token} no claro`);
  }
  assert.deepEqual(themeBlockProblems(blocks), []);
});

test("C23 acusa --card divergente, --warning ausente e --muted só no escuro", () => {
  assert.deepEqual(
    problems(css("--card: #fff;", "--card: #000;", "--card: #111;")),
    ["--card divergente na cópia"]
  );
  assert.deepEqual(
    problems(
      css(
        "--card: #fff; --warning: #a00;",
        "--card: #000; --warning: #f00;",
        "--card: #000;"
      )
    ),
    ["--warning ausente na cópia"]
  );
  assert.deepEqual(
    problems(
      css(
        "--card: #fff;",
        "--card: #000; --muted: #222;",
        "--card: #000; --muted: #222;"
      )
    ),
    ["--muted só no escuro"]
  );
});
