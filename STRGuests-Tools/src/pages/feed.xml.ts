import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts'))
    .sort((a, b) => (a.data.datePublished < b.data.datePublished ? 1 : -1))
    .map((post) => {
      const slug = post.id.replace(/\.mdx$/, '');
      return {
        title: post.data.title,
        description: post.data.description,
        link: `/blog/${slug}`,
        pubDate: new Date(post.data.datePublished + 'T12:00:00Z'),
        author: post.data.author,
        categories: [post.data.category],
      };
    });

  return rss({
    title: 'STR Guests Tools — Blog',
    description: 'Field-tested guides on the host-guest interface. House rules, welcome books, check-in flow, review responses, message templates.',
    site: context.site ?? 'https://strguests.tools',
    items: posts,
    customData: '<language>en-us</language>',
    stylesheet: false,
  });
}
