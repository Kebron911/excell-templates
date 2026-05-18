import { loadCatalog, type Catalog } from '@str/catalog';
import { describe, expect, it } from 'vitest';
import { checkCannibalization, summarize, renderMarkdownReport } from '../src/cannibalization.js';

const { catalog: realCatalog } = loadCatalog();

function fakeCatalog(tools: Array<Partial<{ id: string; site: string; keywords: string[]; category: string }>>): Catalog {
  return {
    schema: 'catalog.v1',
    generatedAt: '2026-05-18T00:00:00.000Z',
    sites: realCatalog.sites,
    tools: tools.map((t, i) => ({
      id: t.id ?? `guests.tool-${i}`,
      site: (t.site ?? 'guests') as Catalog['tools'][number]['site'],
      slug: `tool-${i}`,
      title: 'X',
      description: 'A description that is at least twenty chars long.',
      category: (t.category ?? 'calculator') as Catalog['tools'][number]['category'],
      audience: ['host'],
      keywords: t.keywords ?? [],
      path: '/tool-' + i,
      paidTier: 'free',
      status: 'shipped',
      ga4Event: 'tool_viewed',
      related: [],
      upsells: [],
    })) as Catalog['tools'],
  };
}

describe('checkCannibalization', () => {
  it('flags cross-site pairs with 2+ shared keywords as conflicts', () => {
    const cat = fakeCatalog([
      { id: 'guests.a', site: 'guests', keywords: ['airbnb tips', 'host', 'pdf'] },
      { id: 'host.b', site: 'host', keywords: ['airbnb tips', 'host', 'fee'] },
    ]);
    const r = checkCannibalization(cat);
    expect(r.conflicts).toHaveLength(1);
    expect(r.conflicts[0].crossSite).toBe(true);
    expect(r.conflicts[0].sharedKeywords).toEqual(['airbnb tips', 'host']);
  });

  it('escalates 3+ shared keywords cross-site to HIGH', () => {
    const cat = fakeCatalog([
      { id: 'guests.a', site: 'guests', keywords: ['a', 'b', 'c'] },
      { id: 'host.b', site: 'host', keywords: ['a', 'b', 'c'] },
    ]);
    const r = checkCannibalization(cat);
    expect(r.conflicts[0].severity).toBe('high');
  });

  it('escalates same-category cross-site with 2 keywords to HIGH', () => {
    const cat = fakeCatalog([
      { id: 'guests.a', site: 'guests', category: 'calculator', keywords: ['a', 'b'] },
      { id: 'host.b', site: 'host', category: 'calculator', keywords: ['a', 'b'] },
    ]);
    const r = checkCannibalization(cat);
    expect(r.conflicts[0].severity).toBe('high');
  });

  it('keeps same-site pairs at medium', () => {
    const cat = fakeCatalog([
      { id: 'guests.a', site: 'guests', keywords: ['a', 'b'] },
      { id: 'guests.c', site: 'guests', keywords: ['a', 'b'] },
    ]);
    const r = checkCannibalization(cat);
    expect(r.conflicts[0].severity).toBe('medium');
  });

  it('ignores pairs sharing only 1 keyword by default', () => {
    const cat = fakeCatalog([
      { id: 'guests.a', site: 'guests', keywords: ['a', 'x'] },
      { id: 'host.b', site: 'host', keywords: ['a', 'y'] },
    ]);
    expect(checkCannibalization(cat).conflicts).toEqual([]);
  });

  it('honours minShared override', () => {
    const cat = fakeCatalog([
      { id: 'guests.a', site: 'guests', keywords: ['a'] },
      { id: 'host.b', site: 'host', keywords: ['a'] },
    ]);
    expect(checkCannibalization(cat, { minShared: 1 }).conflicts).toHaveLength(1);
  });

  it('normalizes case + whitespace in keywords', () => {
    const cat = fakeCatalog([
      { id: 'guests.a', site: 'guests', keywords: ['Airbnb Tips', 'HOST'] },
      { id: 'host.b', site: 'host', keywords: ['airbnb tips', 'host'] },
    ]);
    expect(checkCannibalization(cat).conflicts).toHaveLength(1);
  });

  it('sorts conflicts by severity then by shared-count', () => {
    const cat = fakeCatalog([
      { id: 'guests.a', site: 'guests', keywords: ['x', 'y'] },
      { id: 'guests.b', site: 'guests', keywords: ['x', 'y'] },
      { id: 'guests.c', site: 'guests', category: 'calculator', keywords: ['x', 'y', 'z'] },
      { id: 'host.d', site: 'host', category: 'calculator', keywords: ['x', 'y', 'z'] },
    ]);
    const r = checkCannibalization(cat);
    expect(r.conflicts[0].severity).toBe('high');
  });
});

describe('summarize + renderMarkdownReport', () => {
  it('summarizes counts', () => {
    const cat = fakeCatalog([
      { id: 'guests.a', site: 'guests', keywords: ['a', 'b', 'c'] },
      { id: 'host.b', site: 'host', keywords: ['a', 'b', 'c'] },
    ]);
    const r = checkCannibalization(cat);
    const s = summarize(r);
    expect(s.high).toBe(1);
    expect(s.total).toBe(1);
  });

  it('renders a usable markdown report', () => {
    const cat = fakeCatalog([
      { id: 'guests.a', site: 'guests', keywords: ['a', 'b', 'c'] },
      { id: 'host.b', site: 'host', keywords: ['a', 'b', 'c'] },
    ]);
    const md = renderMarkdownReport(checkCannibalization(cat));
    expect(md).toContain('# Keyword Cannibalization Report');
    expect(md).toContain('HIGH');
    expect(md).toContain('guests.a');
    expect(md).toContain('host.b');
  });
});

describe('real catalog smoke test', () => {
  it('runs against the live catalog without throwing', () => {
    const r = checkCannibalization(realCatalog);
    expect(r.scannedTools).toBeGreaterThan(0);
    expect(Array.isArray(r.conflicts)).toBe(true);
  });
});
