import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

// RSS 2.0 feed for /blog. Drives Substack imports, podcast aggregators,
// IFTTT/Zapier triggers, and RSS readers (Inoreader, Feedly, NetNewsWire).
//
// Feed surfaces only the description — full content lives at the post URL,
// which keeps clicks coming back to the site.

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
    title: 'STR Host Tools — Blog',
    description: 'Calculator-paired guides for short-term rental hosts. Profit, RevPAR, break-even, cleaning fees, lodging tax, co-host splits.',
    site: context.site ?? 'https://strhost.tools',
    items: posts,
    customData: '<language>en-us</language>',
    stylesheet: false,
  });
}
