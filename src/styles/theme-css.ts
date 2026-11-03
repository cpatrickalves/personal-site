/**
 * A small parser for the token blocks of `theme.css`, adapted from karhdo.dev's
 * `theme-css.ts` (MIT, see THIRD_PARTY_NOTICES.md). The dark tokens live twice,
 * once for `data-theme` and once for readers without JavaScript, and the tests
 * use this to keep the copies equal.
 */
export type TokenBlock = Map<string, string>;

export type ThemeBlocks = {
  light: TokenBlock;
  dark: TokenBlock;
  /** The copy under `@media (prefers-color-scheme: dark)`. */
  darkMedia: TokenBlock;
};

const DARK_MEDIA = "@media (prefers-color-scheme: dark)";

function declarations(body: string, into: TokenBlock): void {
  for (const declaration of body.split(";")) {
    const colon = declaration.indexOf(":");
    if (colon === -1) continue;
    const name = declaration.slice(0, colon).trim();
    if (!name.startsWith("--")) continue;
    into.set(
      name,
      declaration
        .slice(colon + 1)
        .trim()
        .replace(/\s+/g, " ")
    );
  }
}

/** The body of the block opening at `open`, nested braces included. */
function blockBody(css: string, open: number): string {
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
  }
  throw new Error("theme.css: unbalanced braces");
}

function rules(css: string): Array<{ selector: string; body: string }> {
  const found: Array<{ selector: string; body: string }> = [];
  let start = 0;
  while (start < css.length) {
    const open = css.indexOf("{", start);
    if (open === -1) break;
    const selector = css.slice(start, open).trim();
    const body = blockBody(css, open);
    found.push({ selector, body });
    start = open + body.length + 2;
  }
  return found;
}

/** Blocks that apply to both `:root` and light count as light; the rest stay out. */
export function parseThemeBlocks(source: string): ThemeBlocks {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, "");
  const blocks: ThemeBlocks = {
    light: new Map(),
    dark: new Map(),
    darkMedia: new Map(),
  };
  for (const { selector, body } of rules(css)) {
    if (selector === DARK_MEDIA) {
      for (const inner of rules(body))
        declarations(inner.body, blocks.darkMedia);
      continue;
    }
    const parts = selector.split(",").map(part => part.trim());
    if (parts.includes('[data-theme="dark"]')) declarations(body, blocks.dark);
    if (parts.includes('[data-theme="light"]'))
      declarations(body, blocks.light);
  }
  return blocks;
}

/** What is wrong with the blocks, in words; empty when they agree. */
export function themeBlockProblems(blocks: ThemeBlocks): string[] {
  const problems: string[] = [];
  for (const name of blocks.dark.keys()) {
    if (!blocks.light.has(name)) problems.push(`${name} só no escuro`);
    if (!blocks.darkMedia.has(name)) problems.push(`${name} ausente na cópia`);
    else if (blocks.darkMedia.get(name) !== blocks.dark.get(name))
      problems.push(`${name} divergente na cópia`);
  }
  for (const name of blocks.light.keys())
    if (!blocks.dark.has(name)) problems.push(`${name} só no claro`);
  for (const name of blocks.darkMedia.keys())
    if (!blocks.dark.has(name)) problems.push(`${name} sobrando na cópia`);
  return problems;
}
