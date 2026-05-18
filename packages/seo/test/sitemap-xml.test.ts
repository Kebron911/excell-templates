import { loadCatalog } from '@str/catalog';
import { describe, expect, it } from 'vitest';
import {
  listSiteToolUrls,
  renderEmpireSitemapIndexXml,
  renderSiteSitemapXml,
} from '../src/sitemap-xml.js';

const { catalog } = loadCatalog();

describe('renderSiteSitemapXml', () => {
  it('renders valid XML with homepage + all shipped tools', () => {
    const xml = renderSiteSitemapXml(catalog, 'host');
    expect(xml.startsWith('<?xml version="1.0"')).toBe(true);
    expect(xml).toContain('<urlset');
    expect(xml).toContain('<loc>https://strhost.tools/</loc>');
    expect(xml).toContain('<loc>https://strhost.tools/profit-calculator</loc>');
    expect(xml.endsWith('\n')).toBe(true);
  });

  it('excludes planned tools', () => {
    const xml = renderSiteSitemapXml(catalog, 'laws');
    expect(xml).not.toContain('/regulations-lookup');
  });

  it('escapes XML special chars in URLs', () => {
    const xml = renderSiteSitemapXml(catalog, 'guests');
    expect(xml).not.toContain('&loc');
    expect(xml).not.toContain('<loc></loc>');
  });

  it('throws on unknown site', () => {
    // @ts-expect-error testing runtime guard
    expect(() => renderSiteSitemapXml(catalog, 'nope')).toThrow(/unknown site/);
  });
});

describe('renderEmpireSitemapIndexXml', () => {
  it('lists every site sitemap', () => {
    const xml = renderEmpireSitemapIndexXml(catalog);
    expect(xml).toContain('<sitemapindex');
    expect(xml).toContain('https://strguests.tools/sitemap.xml');
    expect(xml).toContain('https://strops.tools/sitemap.xml');
    expect(xml).toContain('https://strbuyers.tools/sitemap.xml');
    expect(xml).toContain('https://thestrledger.com/sitemap.xml');
  });
});

describe('listSiteToolUrls', () => {
  it('returns absolute URLs for shipped tools only', () => {
    const urls = listSiteToolUrls(catalog, 'buyers');
    expect(urls.length).toBeGreaterThan(0);
    expect(urls.every((u) => u.startsWith('https://strbuyers.tools'))).toBe(true);
  });
});
