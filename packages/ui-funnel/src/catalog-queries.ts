import type { Catalog, Tool } from '@str/catalog';

/**
 * Find shipped cross-site tools referenced by a source tool's `related[]` +
 * `upsells[]`. Deduped, capped at `limit`.
 *
 * Used by CatalogCrossSiteRelated.astro; extracted into a pure function so
 * the filter rules can be unit-tested without an Astro runtime.
 */
export function findCrossSiteRelated(
  catalog: Catalog,
  toolId: string,
  limit = 4,
): Tool[] {
  const current = catalog.tools.find((t) => t.id === toolId);
  if (!current) return [];

  const refs = [...current.related, ...current.upsells];
  const seen = new Set<string>();
  const out: Tool[] = [];

  for (const id of refs) {
    if (seen.has(id)) continue;
    seen.add(id);
    const t = catalog.tools.find((x) => x.id === id);
    if (!t) continue;
    if (t.status !== 'shipped') continue;
    if (t.site === current.site) continue;
    out.push(t);
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * Return all shipped tools for a site, optionally narrowed by category and
 * capped at `limit`.
 */
export function findSiteTools(
  catalog: Catalog,
  siteId: string,
  opts: { category?: string; limit?: number } = {},
): Tool[] {
  const { category, limit = 12 } = opts;
  return catalog.tools
    .filter((t) => t.site === siteId && t.status === 'shipped')
    .filter((t) => (category ? t.category === category : true))
    .slice(0, limit);
}
