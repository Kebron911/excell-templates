import type { Catalog, Tool } from './schema.js';

export interface RankedTool {
  tool: Tool;
  score: number;
  reasons: string[];
}

export interface TopicalGraphOptions {
  /** Maximum results. Default 5. */
  limit?: number;
  /** Only include tools from other sites. Default false (mixed). */
  crossSiteOnly?: boolean;
  /** Only include shipped tools. Default true. */
  shippedOnly?: boolean;
  /** Minimum score required. Default 1. */
  minScore?: number;
}

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

/**
 * Rank catalog tools by topical similarity to `toolId`. Used by the internal
 * link engine to auto-surface related tools across the empire without anyone
 * hand-editing nav files.
 *
 * Scoring:
 *   +3 per shared normalized keyword
 *   +2 per shared audience tag
 *   +1 if same category
 *   +1 small bonus for cross-site (we WANT empire-wide linking)
 *   Curated related[] / upsells[] from the catalog get a flat boost so editor
 *   intent always beats automated ranking.
 *
 * The current tool is always excluded. Same-site `paid` tools are de-emphasized
 * via a small penalty so we don't surface paywalls in every internal link slot.
 */
export function findTopicallyRelated(
  catalog: Catalog,
  toolId: string,
  opts: TopicalGraphOptions = {},
): RankedTool[] {
  const { limit = 5, crossSiteOnly = false, shippedOnly = true, minScore = 1 } = opts;
  const source = catalog.tools.find((t) => t.id === toolId);
  if (!source) return [];

  const srcKw = new Set(source.keywords.map(normalize));
  const srcAud = new Set(source.audience);
  const curated = new Set<string>([...source.related, ...source.upsells]);

  const ranked: RankedTool[] = [];

  for (const t of catalog.tools) {
    if (t.id === source.id) continue;
    if (shippedOnly && t.status !== 'shipped') continue;
    if (crossSiteOnly && t.site === source.site) continue;

    let score = 0;
    const reasons: string[] = [];

    const sharedKw: string[] = [];
    for (const kw of t.keywords) {
      if (srcKw.has(normalize(kw))) sharedKw.push(kw);
    }
    if (sharedKw.length > 0) {
      score += sharedKw.length * 3;
      reasons.push(`shared keywords: ${sharedKw.join(', ')}`);
    }

    const sharedAud: string[] = [];
    for (const a of t.audience) {
      if (srcAud.has(a)) sharedAud.push(a);
    }
    if (sharedAud.length > 0) {
      score += sharedAud.length * 2;
      reasons.push(`audience: ${sharedAud.join(', ')}`);
    }

    if (t.category === source.category) {
      score += 1;
      reasons.push(`category: ${t.category}`);
    }

    if (t.site !== source.site) {
      score += 1;
      reasons.push('cross-site bonus');
    }

    if (curated.has(t.id)) {
      score += 10;
      reasons.push('curated link from source');
    }

    if (t.paidTier === 'paid' && t.site === source.site) {
      score -= 1;
    }

    if (score >= minScore) {
      ranked.push({ tool: t, score, reasons });
    }
  }

  ranked.sort((a, b) => b.score - a.score);
  return ranked.slice(0, limit);
}

/**
 * Convenience: return the URLs of the top topically-related tools, formatted
 * as `{label, href}` for in-content link rendering.
 */
export function findInternalLinks(
  catalog: Catalog,
  toolId: string,
  opts: TopicalGraphOptions = {},
): Array<{ id: string; label: string; href: string; site: string; crossSite: boolean }> {
  const source = catalog.tools.find((t) => t.id === toolId);
  if (!source) return [];

  const sitesById = new Map(catalog.sites.map((s) => [s.id, s] as const));
  return findTopicallyRelated(catalog, toolId, opts).map(({ tool }) => {
    const site = sitesById.get(tool.site);
    const crossSite = tool.site !== source.site;
    const href = crossSite && site ? `https://${site.domain}${tool.path}` : tool.path;
    return {
      id: tool.id,
      label: tool.shortTitle ?? tool.title,
      href,
      site: tool.site,
      crossSite,
    };
  });
}
