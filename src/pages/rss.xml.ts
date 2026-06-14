import rss from '@astrojs/rss';
import { getPublishedPosts } from '../utils/content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: 'hokke414.com',
    description: 'hokke414の技術ブログ',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>ja</language>`,
  });
}
