import type { GetStaticPathsOptions } from "astro";
import { getCollection } from "astro:content";
import type { Locale } from "@/i18n/locales";
import { getLocalePosts } from "@/utils/getLocalePosts";
import { getPostSlug } from "@/utils/getPostPaths";
import { getUniqueTags } from "@/utils/getUniqueTags";
import { slugifyAll } from "@/utils/slugify";
import config from "@/config";

// One `getStaticPaths` per route, shared by the PT-BR page and its copy under
// `src/pages/en/`. Each locale builds only its own Posts.

export async function blogListPaths(
  locale: Locale,
  { paginate }: GetStaticPathsOptions
) {
  return paginate(await getLocalePosts(locale), {
    pageSize: config.posts.perPage,
  });
}

export async function postPaths(locale: Locale) {
  const sortedPosts = await getLocalePosts(locale);

  return sortedPosts.map((post, index) => ({
    params: { slug: getPostSlug(post) },
    props: {
      post,
      // sortedPosts is newest-first, so "older" (prev) is a higher index
      // and "newer" (next) is a lower index.
      prevPost:
        index < sortedPosts.length - 1
          ? {
              id: sortedPosts[index + 1].id,
              title: sortedPosts[index + 1].data.title,
              filePath: sortedPosts[index + 1].filePath,
            }
          : null,
      nextPost:
        index > 0
          ? {
              id: sortedPosts[index - 1].id,
              title: sortedPosts[index - 1].data.title,
              filePath: sortedPosts[index - 1].filePath,
            }
          : null,
    },
  }));
}

export async function postOgImagePaths(locale: Locale) {
  if (!config.features.dynamicOgImage) {
    return [];
  }

  const posts = await getLocalePosts(locale);
  return posts
    .filter(({ data }) => !data.ogImage)
    .map(post => ({ params: { slug: getPostSlug(post) }, props: post }));
}

// Every tag gets a page in both locales, so the language switch on a tag page
// always lands on the same tag; a locale with no Posts for it shows the empty
// list.
export async function tagPaths(
  locale: Locale,
  { paginate }: GetStaticPathsOptions
) {
  const tags = getUniqueTags(await getCollection("posts"));
  const posts = await getLocalePosts(locale);

  return tags.flatMap(({ tag, tagName }) =>
    paginate(
      posts.filter(({ data }) => slugifyAll(data.tags).includes(tag)),
      {
        params: { tag },
        props: { tagName },
        pageSize: config.posts.perPage,
      }
    )
  );
}

// `/talks/` is a dynamic route only so that `features.talks = false` can leave
// it out of the build (and so out of the sitemap).
export function talksPaths() {
  return config.features.talks ? [{ params: { talks: "talks" } }] : [];
}
