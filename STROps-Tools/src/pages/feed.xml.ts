import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const escapeXml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = async () => {
  const all = await getCollection('posts');
  const posts = [...all].sort((a, b) =>
    a.data.datePublished < b.data.datePublished ? 1 : -1,
  );

  const site = 'https://strops.tools';
  const feedUrl = `${site}/feed.xml`;
  const built = new Date().toUTCString();

  const items = posts
    .map((p) => {
      const slug = p.id.replace(/\.mdx?$/, '');
      const link = `${site}/blog/${slug}`;
      const pubDate = new Date(p.data.datePublished + 'T12:00:00Z').toUTCString();
      return `    <item>
      <title>${escapeXml(p.data.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(p.data.description)}</description>
      <category>${escapeXml(p.data.category)}</category>
      <author>noreply@strops.tools (${escapeXml(p.data.author)})</author>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>strops.tools — Operations Notebook</title>
    <link>${site}/blog</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>Field notes for active short-term rental operators. Turnover, cleaning, access, supply, maintenance, damage cost.</description>
    <language>en-us</language>
    <lastBuildDate>${built}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
