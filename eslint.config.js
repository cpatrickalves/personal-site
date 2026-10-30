import eslintPluginAstro from "eslint-plugin-astro";
import tsParser from "@typescript-eslint/parser";

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
    },
  },
  { rules: { "no-console": "error" } },
  {
    ignores: [
      "dist/**",
      ".astro/**",
      "public/pagefind/**",
      // Local agent tooling, not part of the project.
      ".claude/**",
      ".github/agents/**",
      ".github/hooks/**",
      ".github/skills/**",
      ".impeccable/**",
    ],
  },
];
