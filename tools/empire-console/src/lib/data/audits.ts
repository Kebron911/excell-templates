import { readdir, stat, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { paths } from '../paths.js';

/**
 * Real site-audits scanner. Walks each sister site's dist/ for:
 *   - missing <title> / <meta description>
 *   - JSON-LD presence
 *   - sitemap.xml freshness (lastmod ≤7d → P0 if any older)
 *   - broken internal links (href→file existence)
 *   - OG image presence
 *
 * Filesystem-only — no network. Pairs with the build pipeline.
 */

export interface PageAudit {
  path: string;          // e.g. /tools/house-rules/
  source: string;        // dist/tools/house-rules/index.html
  hasTitle: boolean;
  titleLength: number;
  hasMetaDescription: boolean;
  metaDescriptionLength: number;
  hasJsonLd: boolean;
  hasOgImage: boolean;
  brokenInternalLinks: string[];
}

export interface SiteAudit {
  id: string;
  name: string;
  hasDist: boolean;
  pagesScanned: number;
  pageIssues: PageAudit[];
  sitemapFound: boolean;
  sitemapPath: string | null;
  sitemapAgeHours: number | null;
  robotsFound: boolean;
  // Aggregates
  missingTitle: number;
  missingMetaDescription: number;
  missingJsonLd: number;
  missingOgImage: number;
  brokenInternal: number;
}

export interface AuditsReport {
  sites: SiteAudit[];
  totals: {
    pages: number;
    missingTitle: number;
    missingMetaDescription: number;
    missingJsonLd: number;
    missingOgImage: number;
    brokenInternal: number;
    sitemapStaleHours: number; // worst-case across cluster
    sitemapMissingCount: number;
  };
}

const STALE_SITEMAP_HOURS = 168; // 7 days

async function* walkHtml(dir: string): AsyncGenerator<string> {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walkHtml(full);
    else if (e.isFile() && e.name === 'index.html') yield full;
  }
}

async function auditPage(htmlPath: string, distRoot: string): Promise<PageAudit> {
  let html = '';
  try { html = await readFile(htmlPath, 'utf8'); } catch { /* unreadable */ }

  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const desc = descMatch ? descMatch[1].trim() : '';
  const hasJsonLd = /<script[^>]+type=["']application\/ld\+json["']/i.test(html);
  const ogMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);

  // Internal links: href starts with / and not external/anchors
  const linkMatches = [...html.matchAll(/href=["']([^"']+)["']/gi)];
  const brokenInternalLinks: string[] = [];
  for (const m of linkMatches) {
    const href = m[1].split('#')[0].split('?')[0];
    if (!href || !href.startsWith('/') || href.startsWith('//')) continue;
    // Check if target file exists
    const target1 = join(distRoot, href, 'index.html');
    const target2 = join(distRoot, href);
    let ok = false;
    try { await stat(target1); ok = true; } catch { /* */ }
    if (!ok) try { await stat(target2); ok = true; } catch { /* */ }
    if (!ok && !brokenInternalLinks.includes(href)) brokenInternalLinks.push(href);
    if (brokenInternalLinks.length > 10) break;
  }

  return {
    path: htmlPath.slice(distRoot.length).replace(/\\/g, '/').replace(/\/index\.html$/, '/') || '/',
    source: htmlPath.slice(paths.root.length + 1).replace(/\\/g, '/'),
    hasTitle: title.length > 0,
    titleLength: title.length,
    hasMetaDescription: desc.length > 0,
    metaDescriptionLength: desc.length,
    hasJsonLd,
    hasOgImage: !!ogMatch,
    brokenInternalLinks,
  };
}

async function readSitemapAge(distRoot: string): Promise<{ found: boolean; path: string | null; ageHours: number | null }> {
  for (const name of ['sitemap.xml', 'sitemap-index.xml']) {
    const p = join(distRoot, name);
    try {
      const s = await stat(p);
      const ageHours = (Date.now() - s.mtimeMs) / 3_600_000;
      return { found: true, path: p.slice(paths.root.length + 1).replace(/\\/g, '/'), ageHours };
    } catch { /* try next */ }
  }
  return { found: false, path: null, ageHours: null };
}

async function fileExists(p: string): Promise<boolean> {
  try { await stat(p); return true; } catch { return false; }
}

async function auditSite(site: { id: string; name: string; dir: string }): Promise<SiteAudit> {
  const distRoot = join(site.dir, 'dist');
  let hasDist = false;
  try { const s = await stat(distRoot); hasDist = s.isDirectory(); } catch { /* */ }

  const pageIssues: PageAudit[] = [];
  if (hasDist) {
    let count = 0;
    for await (const html of walkHtml(distRoot)) {
      pageIssues.push(await auditPage(html, distRoot));
      if (++count >= 200) break; // safety cap
    }
  }

  const sitemap = hasDist ? await readSitemapAge(distRoot) : { found: false, path: null, ageHours: null };
  const robotsFound = hasDist && (await fileExists(join(distRoot, 'robots.txt')));

  const missingTitle = pageIssues.filter((p) => !p.hasTitle).length;
  const missingMetaDescription = pageIssues.filter((p) => !p.hasMetaDescription).length;
  const missingJsonLd = pageIssues.filter((p) => !p.hasJsonLd).length;
  const missingOgImage = pageIssues.filter((p) => !p.hasOgImage).length;
  const brokenInternal = pageIssues.reduce((s, p) => s + p.brokenInternalLinks.length, 0);

  return {
    id: site.id, name: site.name, hasDist,
    pagesScanned: pageIssues.length, pageIssues,
    sitemapFound: sitemap.found, sitemapPath: sitemap.path, sitemapAgeHours: sitemap.ageHours,
    robotsFound,
    missingTitle, missingMetaDescription, missingJsonLd, missingOgImage, brokenInternal,
  };
}

export async function readAudits(): Promise<AuditsReport> {
  const sites = await Promise.all(paths.sites.map(auditSite));
  const totals = {
    pages: sites.reduce((s, x) => s + x.pagesScanned, 0),
    missingTitle: sites.reduce((s, x) => s + x.missingTitle, 0),
    missingMetaDescription: sites.reduce((s, x) => s + x.missingMetaDescription, 0),
    missingJsonLd: sites.reduce((s, x) => s + x.missingJsonLd, 0),
    missingOgImage: sites.reduce((s, x) => s + x.missingOgImage, 0),
    brokenInternal: sites.reduce((s, x) => s + x.brokenInternal, 0),
    sitemapStaleHours: Math.max(0, ...sites
      .filter((s) => s.sitemapAgeHours !== null)
      .map((s) => s.sitemapAgeHours!)),
    sitemapMissingCount: sites.filter((s) => s.hasDist && !s.sitemapFound).length,
  };
  return { sites, totals };
}

export const STALE_SITEMAP_HOURS_THRESHOLD = STALE_SITEMAP_HOURS;
