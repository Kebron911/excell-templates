import { loadCatalog } from '@str/catalog';
import { describe, expect, it } from 'vitest';
import { findCrossSiteRelated, findSiteTools } from '../src/catalog-queries.js';

const { catalog } = loadCatalog();

describe('findCrossSiteRelated', () => {
  it('returns only shipped, cross-site tools', () => {
    const out = findCrossSiteRelated(catalog, 'guests.house-rules-pdf');
    expect(out.length).toBeGreaterThan(0);
    for (const t of out) {
      expect(t.status).toBe('shipped');
      expect(t.site).not.toBe('guests');
    }
  });

  it('dedupes when related[] and upsells[] reference the same id', () => {
    const ids = findCrossSiteRelated(catalog, 'guests.house-rules-pdf').map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('caps at limit', () => {
    const out = findCrossSiteRelated(catalog, 'buyers.cash-on-cash-calculator', 2);
    expect(out.length).toBeLessThanOrEqual(2);
  });

  it('returns [] for unknown tool', () => {
    expect(findCrossSiteRelated(catalog, 'guests.does-not-exist')).toEqual([]);
  });

  it('skips planned tools', () => {
    const out = findCrossSiteRelated(catalog, 'host.lodging-tax');
    expect(out.every((t) => t.status === 'shipped')).toBe(true);
  });
});

describe('findSiteTools', () => {
  it('returns only shipped tools for that site', () => {
    const out = findSiteTools(catalog, 'host');
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((t) => t.site === 'host' && t.status === 'shipped')).toBe(true);
  });

  it('narrows by category', () => {
    const out = findSiteTools(catalog, 'buyers', { category: 'calculator' });
    expect(out.every((t) => t.category === 'calculator')).toBe(true);
  });

  it('respects limit', () => {
    const out = findSiteTools(catalog, 'host', { limit: 2 });
    expect(out.length).toBeLessThanOrEqual(2);
  });
});
