import type { GetStaticPathsOptions } from "astro";
import type { Locale } from "@/i18n/locales";
import { getLocalePosts } from "@/utils/getLocalePosts";
import { getLocaleTags } from "@/utils/getLocaleTags";
import { getPostSlug } from "@/utils/getPostPaths";
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
              title: sortedPosts[index + 1].data.title,
              filePath: sortedPosts[index + 1].filePath,
            }
          : null,
      nextPost:
        index > 0
          ? {
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

// A locale with no Posts for a tag shows the empty list.
export async function tagPaths(
  locale: Locale,
  { paginate }: GetStaticPathsOptions
) {
  return (await getLocaleTags(locale)).flatMap(({ tag, tagName, posts }) =>
    paginate(posts, {
      params: { tag },
      props: { tag, tagName },
      pageSize: config.posts.perPage,
    })
  );
}

// `/talks/` is a dynamic route only so that `features.talks = false` can leave
// it out of the build (and so out of the sitemap).
export function talksPaths() {
  return config.features.talks ? [{ params: { talks: "talks" } }] : [];
}
