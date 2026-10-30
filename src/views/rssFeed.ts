import rss from "@astrojs/rss";
import { LANG_TAGS, type Locale } from "@/i18n/locales";
import { getPostUrl, localeUrl } from "@/i18n/urls";
import { getLocalePosts } from "@/utils/getLocalePosts";
import config from "@/config";

// The feed of one locale, served by `/rss.xml` (PT-BR) and `/en/rss.xml`.
// `/rss.xml` used to be the Hashnode feed, in English; see docs/TDD.md.
export async function rssFeed(locale: Locale) {
  const sortedPosts = await getLocalePosts(locale);

  return rss({
    title: config.site.title,
    description: config.site.description,
    // The channel links to the locale's home; Post links are absolute paths.
    site: new URL(localeUrl(locale, { page: "home" }), config.site.url).href,
    items: sortedPosts.map(post => ({
      link: getPostUrl(post),
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.modDatetime ?? post.data.pubDatetime),
    })),
    customData: `<language>${LANG_TAGS[locale]}</language>`,
  });
}
