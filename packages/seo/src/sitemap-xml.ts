import type { Catalog, SiteId } from '@str/catalog';

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlElement(entry: SitemapEntry): string {
  const parts = [`    <loc>${escapeXml(entry.loc)}</loc>`];
  if (entry.lastmod) parts.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
  if (entry.changefreq) parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  if (entry.priority !== undefined) parts.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
  return `  <url>\n${parts.join('\n')}\n  </url>`;
}

/**
 * Render a sitemap.xml string from the catalog for a single site.
 * Includes the homepage + every shipped tool.
 */
export function renderSiteSitemapXml(catalog: Catalog, siteId: SiteId, baseUrl?: string): string {
  const site = catalog.sites.find((s) => s.id === siteId);
  if (!site) throw new Error(`unknown site ${siteId}`);
  const origin = baseUrl ?? `https://${site.domain}`;
  const today = catalog.generatedAt.slice(0, 10);

  const entries: SitemapEntry[] = [
    { loc: `${origin}/`, lastmod: today, changefreq: 'weekly', priority: 1.0 },
  ];

  for (const tool of catalog.tools) {
    if (tool.site !== siteId || tool.status !== 'shipped') continue;
    entries.push({
      loc: `${origin}${tool.path}`,
      lastmod: tool.shippedAt ?? today,
      changefreq: 'monthly',
      priority: tool.paidTier === 'paid' ? 0.9 : 0.8,
    });
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(urlElement),
    '</urlset>',
    '',
  ].join('\n');
}

/**
 * Render an empire-wide sitemap-index.xml pointing at every site's sitemap.
 * Hosted on dashboard.thestrledger.com and submitted to Google Search Console
 * once for the whole network.
 */
export function renderEmpireSitemapIndexXml(catalog: Catalog): string {
  const today = catalog.generatedAt.slice(0, 10);
  const entries = catalog.sites.map((s) => ({
    loc: `https://${s.domain}/sitemap.xml`,
    lastmod: today,
  }));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(
      (e) =>
        `  <sitemap>\n    <loc>${escapeXml(e.loc)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n  </sitemap>`,
    ),
    '</sitemapindex>',
    '',
  ].join('\n');
}

/**
 * Per-site tool URL list (useful for ItemList JSON-LD on homepages).
 */
export function listSiteToolUrls(catalog: Catalog, siteId: SiteId): string[] {
  const site = catalog.sites.find((s) => s.id === siteId);
  if (!site) throw new Error(`unknown site ${siteId}`);
  const origin = `https://${site.domain}`;
  return catalog.tools
    .filter((t) => t.site === siteId && t.status === 'shipped')
    .map((t) => `${origin}${t.path}`);
}
