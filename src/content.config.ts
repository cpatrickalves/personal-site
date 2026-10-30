import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";
import { LOCALES } from "@/i18n/locales";
import { BLOG_PATH } from "@/utils/postPath";

// Posts and pages live in one folder per locale (`pt-br/`, `en/`): the locale
// comes from the folder, and both Versões of a Post share the file name.
const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      // false on agent-made translation drafts until Patrick approves them;
      // absent on the original Versão.
      translationReviewed: z.boolean().optional(),
      fake: z.boolean().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

// Projetos and Palestras are one YAML per item, with the text fields in both
// locales. Strict objects, so a misspelled key breaks the build.
const localized = z.strictObject({
  "pt-br": z.string().min(1),
  en: z.string().min(1),
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{yml,yaml}",
    base: "./src/content/projects",
  }),
  schema: ({ image }) =>
    z.strictObject({
      title: localized,
      description: localized,
      cover: image(),
      date: z.date(),
      stack: z.array(z.string()).default([]),
      links: z
        .strictObject({
          repo: z.url().optional(),
          demo: z.url().optional(),
          // Slug of the Post; the link goes to its Versão in the current locale.
          post: z.string().optional(),
        })
        .default({}),
      featured: z.boolean().optional(),
      fake: z.boolean().optional(),
    }),
});

const talks = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{yml,yaml}", base: "./src/content/talks" }),
  schema: z.strictObject({
    title: localized,
    description: localized.optional(),
    event: z.string(),
    date: z.date(),
    location: z.string(),
    // The language the talk was given in.
    language: z.enum(LOCALES),
    links: z
      .strictObject({
        slides: z.url().optional(),
        video: z.url().optional(),
      })
      .default({}),
    fake: z.boolean().optional(),
  }),
});

export const collections = { posts, pages, projects, talks };
