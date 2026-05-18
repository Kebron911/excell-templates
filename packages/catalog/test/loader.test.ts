import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { filterBySite, findSite, findTool, loadCatalog } from '../src/loader.js';

let dir: string;

const SITE = {
  id: 'guests',
  displayName: 'X',
  domain: 'x.com',
  tagline: 't',
  primaryColor: '#000000',
  audience: ['host'],
  description: 'd',
};

const TOOL = {
  id: 'guests.house-rules-pdf',
  site: 'guests',
  slug: 'house-rules-pdf',
  title: 'House Rules PDF',
  description: 'A printable house rules PDF for STRs.',
  category: 'pdf-generator',
  audience: ['host'],
  keywords: ['house rules'],
  path: '/house-rules-pdf',
  paidTier: 'free',
  status: 'shipped',
  ga4Event: 'pdf_download',
  related: [],
  upsells: [],
};

function writeTool(name: string, body: unknown): void {
  mkdirSync(join(dir, 'tools', 'guests'), { recursive: true });
  writeFileSync(join(dir, 'tools', 'guests', `${name}.json`), JSON.stringify(body));
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'catalog-test-'));
  writeFileSync(join(dir, 'sites.json'), JSON.stringify([SITE]));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('loadCatalog', () => {
  it('loads sites and tools successfully', () => {
    writeTool('house-rules-pdf', TOOL);
    const { catalog, warnings } = loadCatalog({ dataDir: dir });
    expect(catalog.tools).toHaveLength(1);
    expect(catalog.sites).toHaveLength(1);
    expect(warnings).toHaveLength(0);
  });

  it('throws on duplicate tool id across files', () => {
    writeTool('a', TOOL);
    writeTool('b', TOOL);
    expect(() => loadCatalog({ dataDir: dir })).toThrow(/duplicate tool id/);
  });

  it('throws on duplicate slug within same site', () => {
    writeTool('a', TOOL);
    writeTool('b', { ...TOOL, id: 'guests.house-rules-pdf' });
    expect(() => loadCatalog({ dataDir: dir })).toThrow(/duplicate/);
  });

  it('throws when tool id does not match site + slug', () => {
    writeTool('a', { ...TOOL, id: 'guests.other-slug' });
    expect(() => loadCatalog({ dataDir: dir })).toThrow(/expected id/);
  });

  it('throws when tool references an unknown site', () => {
    writeTool('a', { ...TOOL, id: 'host.house-rules-pdf', site: 'host' });
    expect(() => loadCatalog({ dataDir: dir })).toThrow(/unknown site/);
  });

  it('warns on related ids that do not exist', () => {
    writeTool('a', { ...TOOL, related: ['guests.does-not-exist'] });
    const { warnings } = loadCatalog({ dataDir: dir });
    expect(warnings.some((w) => w.includes('does-not-exist'))).toBe(true);
  });
});

describe('helpers', () => {
  it('filterBySite returns only that site’s tools', () => {
    writeTool('a', TOOL);
    const { catalog } = loadCatalog({ dataDir: dir });
    expect(filterBySite(catalog, 'guests')).toHaveLength(1);
    expect(filterBySite(catalog, 'host')).toHaveLength(0);
  });

  it('findTool returns the tool by id', () => {
    writeTool('a', TOOL);
    const { catalog } = loadCatalog({ dataDir: dir });
    expect(findTool(catalog, TOOL.id)?.slug).toBe('house-rules-pdf');
  });

  it('findSite returns the site by id', () => {
    writeTool('a', TOOL);
    const { catalog } = loadCatalog({ dataDir: dir });
    expect(findSite(catalog, 'guests')?.displayName).toBe('X');
  });
});
