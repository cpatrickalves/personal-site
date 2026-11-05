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

test("C23 acusa --muted só no claro e --extra sobrando na cópia", () => {
  assert.deepEqual(
    problems(
      css("--card: #fff; --muted: #ddd;", "--card: #000;", "--card: #000;")
    ),
    ["--muted só no claro"]
  );
  assert.deepEqual(
    problems(
      css("--card: #fff;", "--card: #000;", "--card: #000; --extra: #123;")
    ),
    ["--extra sobrando na cópia"]
  );
});

test("C23 acusa a cópia sob um seletor que pintaria quem escolheu claro", () => {
  for (const selector of [
    ":root",
    '[data-theme="light"]',
    ":root:not([data-theme])",
  ]) {
    const source = `
:root,
[data-theme="light"] { --card: #fff; }
[data-theme="dark"] { --card: #000; }
@media (prefers-color-scheme: dark) {
  ${selector} { --card: #000; }
}`;
    assert.deepEqual(problems(source), ["--card ausente na cópia"], selector);
  }
});
