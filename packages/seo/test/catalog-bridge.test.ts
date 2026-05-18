import { loadCatalog } from '@str/catalog';
import { describe, expect, it } from 'vitest';
import {
  buildSiteToolsItemList,
  buildToolBreadcrumb,
  buildWebApplicationFromCatalog,
  listSiteTools,
} from '../src/catalog-bridge.js';

const { catalog } = loadCatalog();

describe('buildWebApplicationFromCatalog', () => {
  it('builds WebApplication JSON-LD for a real tool', () => {
    const ld = buildWebApplicationFromCatalog(
      { catalog, siteId: 'guests' },
      'guests.house-rules-pdf',
    );
    expect(ld['@type']).toBe('WebApplication');
    expect(ld.name).toContain('House Rules');
    expect(ld.url).toMatch(/^https:\/\/strguests\.tools\/house-rules-pdf\/?$/);
    expect(ld.applicationCategory).toBe('BusinessApplication');
  });

  it('classifies calculators as FinanceApplication', () => {
    const ld = buildWebApplicationFromCatalog(
      { catalog, siteId: 'buyers' },
      'buyers.cash-on-cash-calculator',
    );
    expect(ld.applicationCategory).toBe('FinanceApplication');
  });

  it('throws when tool belongs to a different site', () => {
    expect(() =>
      buildWebApplicationFromCatalog({ catalog, siteId: 'host' }, 'guests.house-rules-pdf'),
    ).toThrow(/belongs to site/);
  });

  it('throws on unknown tool', () => {
    expect(() =>
      buildWebApplicationFromCatalog({ catalog, siteId: 'guests' }, 'guests.does-not-exist'),
    ).toThrow(/unknown tool/);
  });
});

describe('buildSiteToolsItemList', () => {
  it('returns an ItemList with only shipped tools for the site', () => {
    const ld = buildSiteToolsItemList({ catalog, siteId: 'host' });
    expect(ld['@type']).toBe('ItemList');
    const items = (ld.itemListElement as Array<{ url: string }>);
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((i) => i.url.startsWith('https://strhost.tools'))).toBe(true);
  });
});

describe('buildToolBreadcrumb', () => {
  it('builds a Home → Tool breadcrumb', () => {
    const ld = buildToolBreadcrumb(
      { catalog, siteId: 'guests' },
      'guests.house-rules-pdf',
    );
    expect(ld['@type']).toBe('BreadcrumbList');
    const items = ld.itemListElement as Array<{ name: string }>;
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe('Home');
  });
});

describe('listSiteTools', () => {
  it('returns absolute URLs for shipped tools', () => {
    const listings = listSiteTools({ catalog, siteId: 'ops' });
    expect(listings.length).toBeGreaterThan(0);
    for (const l of listings) {
      expect(l.url.startsWith('https://strops.tools')).toBe(true);
      expect(l.tool.status).toBe('shipped');
    }
  });
});
