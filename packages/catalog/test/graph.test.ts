import { describe, expect, it } from 'vitest';
import { loadCatalog } from '../src/loader.js';
import { findInternalLinks, findTopicallyRelated } from '../src/graph.js';

const { catalog } = loadCatalog();

describe('findTopicallyRelated', () => {
  it('returns tools ranked by score', () => {
    const out = findTopicallyRelated(catalog, 'guests.house-rules-pdf');
    expect(out.length).toBeGreaterThan(0);
    for (let i = 0; i < out.length - 1; i++) {
      expect(out[i]!.score).toBeGreaterThanOrEqual(out[i + 1]!.score);
    }
  });

  it('excludes the source tool', () => {
    const out = findTopicallyRelated(catalog, 'guests.house-rules-pdf');
    expect(out.every((r) => r.tool.id !== 'guests.house-rules-pdf')).toBe(true);
  });

  it('returns [] for unknown tool', () => {
    expect(findTopicallyRelated(catalog, 'guests.nope')).toEqual([]);
  });

  it('crossSiteOnly excludes same-site tools', () => {
    const out = findTopicallyRelated(catalog, 'guests.house-rules-pdf', { crossSiteOnly: true });
    expect(out.every((r) => r.tool.site !== 'guests')).toBe(true);
  });

  it('shippedOnly excludes planned tools by default', () => {
    const out = findTopicallyRelated(catalog, 'host.lodging-tax');
    expect(out.every((r) => r.tool.status === 'shipped')).toBe(true);
  });

  it('boosts curated related[] / upsells[] above pure topical matches', () => {
    const source = catalog.tools.find((t) => t.id === 'guests.house-rules-pdf')!;
    const out = findTopicallyRelated(catalog, source.id, { limit: 20 });
    const curatedIds = new Set([...source.related, ...source.upsells]);
    const shippedCurated = out.filter((r) => curatedIds.has(r.tool.id));
    if (shippedCurated.length > 0) {
      expect(shippedCurated.every((r) => r.reasons.some((x) => x.includes('curated')))).toBe(true);
      expect(shippedCurated[0]!.score).toBeGreaterThanOrEqual(10);
    }
  });

  it('respects limit', () => {
    const out = findTopicallyRelated(catalog, 'host.profit-calculator', { limit: 3 });
    expect(out.length).toBeLessThanOrEqual(3);
  });
});

describe('findInternalLinks', () => {
  it('returns label + href + crossSite for each result', () => {
    const links = findInternalLinks(catalog, 'guests.house-rules-pdf');
    for (const l of links) {
      expect(l.label.length).toBeGreaterThan(0);
      expect(l.href.length).toBeGreaterThan(0);
      if (l.crossSite) {
        expect(l.href.startsWith('https://')).toBe(true);
      } else {
        expect(l.href.startsWith('/')).toBe(true);
      }
    }
  });

  it('uses absolute URL for cross-site, relative for same-site', () => {
    const links = findInternalLinks(catalog, 'guests.house-rules-pdf', { limit: 20 });
    const sameSite = links.filter((l) => l.site === 'guests');
    const crossSite = links.filter((l) => l.site !== 'guests');
    if (sameSite.length > 0) {
      expect(sameSite[0]!.href.startsWith('/')).toBe(true);
    }
    if (crossSite.length > 0) {
      expect(crossSite[0]!.href.startsWith('https://')).toBe(true);
    }
  });
});
