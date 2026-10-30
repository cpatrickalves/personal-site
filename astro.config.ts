import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";
import { DEFAULT_LOCALE, LANG_TAGS, LOCALES } from "./src/i18n/locales";

export default defineConfig({
  site: config.site.url,
  // Preview on GitHub Pages; removing `base` at the Virada turns the build into Produção.
  base: "/personal-site",
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        !page.includes("/styleguide/") &&
        (config.features?.showArchives !== false ||
          !page.endsWith("/archives/")),
      // Pairs each page with the same path in the other locale (xhtml:link),
      // as the hreflang links in Layout.astro do.
      i18n: { defaultLocale: DEFAULT_LOCALE, locales: LANG_TAGS },
    }),
  ],
  i18n: {
    // PT-BR at the root, EN under /en.
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts],
    }),
    shikiConfig: {
      // Syntax colours come from the palette tokens in src/styles/theme.css.
      theme: "css-variables",
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      // Everything that is read.
      name: "Outfit",
      cssVariable: "--font-outfit",
      provider: fontProviders.google(),
      fallbacks: ["sans-serif"],
      weights: ["100 900"],
      styles: ["normal"],
      formats: ["woff2"],
    },
    {
      // Static ttf copies for the OG image generator only (satori reads
      // neither woff2 nor variable fonts); never loaded by a page.
      name: "Outfit",
      cssVariable: "--font-outfit-og",
      provider: fontProviders.google(),
      fallbacks: ["sans-serif"],
      weights: [400, 700],
      styles: ["normal"],
      formats: ["ttf"],
    },
    {
      // Detail face (numbers, dates, one emphasis word per title) and code.
      name: "Martian Mono",
      cssVariable: "--font-martian-mono",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: ["100 800"],
      styles: ["normal"],
      formats: ["woff2"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
