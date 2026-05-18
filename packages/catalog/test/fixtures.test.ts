import { describe, expect, it } from 'vitest';
import { loadCatalog } from '../src/loader.js';

describe('catalog data fixtures (real data)', () => {
  it('loads the shipped catalog without errors', () => {
    expect(() => loadCatalog()).not.toThrow();
  });

  it('contains all 8 sites', () => {
    const { catalog } = loadCatalog();
    expect(catalog.sites).toHaveLength(8);
  });

  it('every shipped tool has a usable path', () => {
    const { catalog } = loadCatalog();
    for (const t of catalog.tools.filter((t) => t.status === 'shipped')) {
      expect(t.path.startsWith('/')).toBe(true);
    }
  });

  it('every tool id matches site + slug', () => {
    const { catalog } = loadCatalog();
    for (const t of catalog.tools) {
      expect(t.id).toBe(`${t.site}.${t.slug}`);
    }
  });
});
