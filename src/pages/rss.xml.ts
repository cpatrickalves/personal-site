import rss from "@astrojs/rss";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { getPostUrl } from "@/i18n/urls";
import { getLocalePosts } from "@/utils/getLocalePosts";
import config from "@/config";

export async function GET() {
  // PT-BR only; the EN feed (/en/rss.xml) comes with #15.
  const sortedPosts = await getLocalePosts(DEFAULT_LOCALE);

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    items: sortedPosts.map(post => ({
      link: getPostUrl(post),
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.modDatetime ?? post.data.pubDatetime),
    })),
  });
}
