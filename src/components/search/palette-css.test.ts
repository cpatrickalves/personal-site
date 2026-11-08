import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path: string) =>
  readFileSync(new URL(path, import.meta.url), "utf8");

const PALETTE_CSS = read("./palette.css");
const TOKENS_CSS =
  read("../../styles/theme.css") + read("../../styles/motion.css");

const NAMED_COLORS =
  /\b(white|black|red|green|blue|gray|grey|yellow|orange|purple|pink|silver|navy|teal|maroon|olive|lime|aqua|fuchsia|cyan|magenta|brown|gold|beige|ivory|indigo|violet|tomato|salmon|crimson)\b/i;

const declared = (css: string) =>
  new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map(([, name]) => name));

/** Everything in the palette's CSS that breaks the DESIGN.md token rules. */
function problems(css: string): string[] {
  const found: string[] = [];
  const body = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const tokens = new Set([...declared(TOKENS_CSS), ...declared(body)]);

  for (const [hex] of body.matchAll(/#[0-9a-f]{3,8}\b/gi)) {
    found.push(`hex colour ${hex}`);
  }
  for (const [fn] of body.matchAll(
    /\b(rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/gi
  )) {
    found.push(`colour function ${fn}`);
  }
  for (const [, prop, value] of body.matchAll(/([\w-]+)\s*:\s*([^;{}]+)/g)) {
    if (prop.startsWith("--")) continue;
    if (NAMED_COLORS.test(value))
      found.push(`named colour in ${prop}: ${value.trim()}`);
    if (/radius/.test(prop) && value.trim() !== "0") {
      found.push(`${prop}: ${value.trim()}`);
    }
    if (
      prop === "font-family" &&
      !/^(inherit|var\(--font-(app|sans)\))$/.test(value.trim())
    ) {
      found.push(`font-family: ${value.trim()}`);
    }
  }
  for (const [, name] of body.matchAll(/var\((--[\w-]+)/g)) {
    if (name.startsWith("--color-")) found.push(`Tailwind alias ${name}`);
    else if (!tokens.has(name)) found.push(`unknown token ${name}`);
  }
  return found;
}

test("C32 CSS da paleta só com tokens, sem cantos nem cor fixa", () => {
  assert.deepEqual(problems(PALETTE_CSS), []);
  // The palette is a plate: it uses the plate's own tokens.
  for (const token of ["--card", "--foreground", "--shadow", "--accent-ink"]) {
    assert.ok(PALETTE_CSS.includes(`var(${token})`), token);
  }
  // The rules catch what they guard.
  assert.deepEqual(problems(".x { color: #fff; }"), ["hex colour #fff"]);
  assert.deepEqual(problems(".x { background: rgb(0 0 0); }"), [
    "colour function rgb(",
  ]);
  assert.deepEqual(problems(".x { border-color: white; }"), [
    "named colour in border-color: white",
  ]);
  assert.deepEqual(problems(".x { border-radius: 4px; }"), [
    "border-radius: 4px",
  ]);
  assert.deepEqual(problems(".x { color: var(--color-card); }"), [
    "Tailwind alias --color-card",
  ]);
  assert.deepEqual(problems(".x { color: var(--fg); }"), [
    "unknown token --fg",
  ]);
  assert.deepEqual(problems(".x { font-family: monospace; }"), [
    "font-family: monospace",
  ]);
});
