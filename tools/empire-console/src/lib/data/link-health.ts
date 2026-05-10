import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { paths } from '../paths.js';

/**
 * Cross-site link checker — walks every dist/ HTML in the cluster,
 * extracts external (https://) links pointing to OTHER sister sites,
 * and verifies each target URL exists as a built file in the target site.
 *
 * Catches "we ship a link to https://strops.tools/foo but strops.tools has
 * no /foo page" — the cross-cluster funnel band failure mode.
 */

export interface CrossLink {
  fromSite: string;
  fromPath: string;       // /tools/house-rules/
  href: string;           // full https URL
  targetSite: string;     // e.g. "strops"
  targetPath: string;     // /tools/foo/
  resolved: boolean;
}

export interface LinkHealthReport {
  links: CrossLink[];
  byTargetSite: Record<string, { resolved: number; broken: number }>;
  totals: { total: number; resolved: number; broken: number };
}

const SITE_DOMAINS: Record<string, string> = {
  strguests: 'strguests.tools',
  strhost: 'strhost.tools',
  strops: 'strops.tools',
  strbuyers: 'strbuyers.tools',
  thestrledger: 'thestrledger.com',
};

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

async function fileExists(p: string): Promise<boolean> {
  try { await (await import('node:fs/promises')).stat(p); return true; }
  catch { return false; }
}

export async function readLinkHealth(): Promise<LinkHealthReport> {
  const links: CrossLink[] = [];

  for (const fromSite of paths.sites) {
    const distRoot = join(fromSite.dir, 'dist');
    let count = 0;
    for await (const html of walkHtml(distRoot)) {
      let raw = '';
      try { raw = await readFile(html, 'utf8'); } catch { continue; }
      const fromPath = html.slice(distRoot.length).replace(/\\/g, '/').replace(/\/index\.html$/, '/') || '/';

      const matches = [...raw.matchAll(/href=["']([^"']+)["']/gi)];
      for (const m of matches) {
        const href = m[1];
        if (!href.startsWith('http')) continue;
        let targetUrl: URL;
        try { targetUrl = new URL(href); } catch { continue; }

        // Find target site by domain
        const targetSiteId = Object.entries(SITE_DOMAINS).find(([_, d]) => targetUrl.hostname.endsWith(d))?.[0];
        if (!targetSiteId || targetSiteId === fromSite.id) continue;

        // Resolve target file existence in target dist/
        const targetSite = paths.sites.find((s) => s.id === targetSiteId);
        if (!targetSite) continue;
        const targetDist = join(targetSite.dir, 'dist');
        const targetPath = targetUrl.pathname;
        const target1 = join(targetDist, targetPath, 'index.html');
        const target2 = join(targetDist, targetPath);
        const resolved = (await fileExists(target1)) || (await fileExists(target2));

        links.push({
          fromSite: fromSite.id,
          fromPath,
          href,
          targetSite: targetSiteId,
          targetPath,
          resolved,
        });
        if (links.length > 1000) break;
      }
      if (++count >= 200) break;
    }
  }

  const byTargetSite: Record<string, { resolved: number; broken: number }> = {};
  for (const l of links) {
    byTargetSite[l.targetSite] ??= { resolved: 0, broken: 0 };
    if (l.resolved) byTargetSite[l.targetSite].resolved++;
    else byTargetSite[l.targetSite].broken++;
  }

  return {
    links,
    byTargetSite,
    totals: {
      total: links.length,
      resolved: links.filter((l) => l.resolved).length,
      broken: links.filter((l) => !l.resolved).length,
    },
  };
}
