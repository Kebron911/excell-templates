import { describe, expect, it } from 'vitest';
import { slugifyChange, toMdxBlogPost } from '../../server/lib/diff/blog-mdx';
import type { DiffResult } from '../../server/lib/diff/types';

function makeDiff(severity: DiffResult['severity'], overrides: Partial<DiffResult> = {}): DiffResult {
  return {
    cityId: 1,
    prevRegulationId: 10,
    nextRegulationId: 11,
    severity,
    changes: [
      {
        field: 'ban_status',
        before: 'none',
        after: 'full',
        severity,
        description: 'Market status crossed open/closed boundary: none → full.',
      },
    ],
    isNoop: false,
    ...overrides,
  };
}

describe('slugifyChange', () => {
  it('produces lowercase kebab slugs', () => {
    expect(slugifyChange('Salt Lake City', 'Utah', '2026-05-14', 'major'))
      .toBe('salt-lake-city-utah-str-major-2026-05-14');
  });

  it('collapses runs of separators', () => {
    expect(slugifyChange('  Saint   Paul  ', 'MN', '2026-01-01', 'minor'))
      .toBe('saint-paul-mn-str-minor-2026-01-01');
  });
});

describe('toMdxBlogPost', () => {
  const city = { slug: 'salt-lake-city', name: 'Salt Lake City' };
  const state = { slug: 'utah', name: 'Utah' };

  it('emits frontmatter with all required fields', () => {
    const out = toMdxBlogPost({ diff: makeDiff('major'), city, state, publishedAt: '2026-05-14' });
    expect(out.frontmatter.title).toContain('Salt Lake City');
    expect(out.frontmatter.title).toContain('Major Change');
    expect(out.frontmatter.severity).toBe('major');
    expect(out.frontmatter.city_slug).toBe('salt-lake-city');
    expect(out.frontmatter.state_slug).toBe('utah');
    expect(out.frontmatter.date).toBe('2026-05-14');
    expect(out.slug).toBe('salt-lake-city-utah-str-major-2026-05-14');
  });

  it('emits content with YAML frontmatter block at top', () => {
    const out = toMdxBlogPost({ diff: makeDiff('material'), city, state, publishedAt: '2026-05-14' });
    expect(out.content.startsWith('---\n')).toBe(true);
    expect(out.content).toMatch(/^---\n[\s\S]+?\n---\n/);
  });

  it('emits a change list with one bullet per FieldChange', () => {
    const diff = makeDiff('material', {
      changes: [
        { field: 'permit_cost_usd', before: 100, after: 200, severity: 'material', description: 'Permit fee doubled.' },
        { field: 'tax_rate_pct', before: 6, after: 8, severity: 'material', description: 'Tax rate up 2pp.' },
      ],
    });
    const out = toMdxBlogPost({ diff, city, state, publishedAt: '2026-05-14' });
    expect(out.content).toContain('Permit fee doubled.');
    expect(out.content).toContain('Tax rate up 2pp.');
    const bulletCount = (out.content.match(/^- \*\*/gm) ?? []).length;
    expect(bulletCount).toBe(2);
  });

  it('cross-links to the city page and history page', () => {
    const out = toMdxBlogPost({ diff: makeDiff('major'), city, state, publishedAt: '2026-05-14' });
    expect(out.content).toContain('/utah/salt-lake-city');
    expect(out.content).toContain('/utah/salt-lake-city/history');
    expect(out.content).toContain('/legal/sources');
  });

  it('adjusts the advisory paragraph by severity', () => {
    const major = toMdxBlogPost({ diff: makeDiff('major'), city, state, publishedAt: '2026-05-14' });
    const material = toMdxBlogPost({ diff: makeDiff('material'), city, state, publishedAt: '2026-05-14' });
    const minor = toMdxBlogPost({ diff: makeDiff('minor'), city, state, publishedAt: '2026-05-14' });
    expect(major.content.toLowerCase()).toContain('attorney');
    expect(material.content.toLowerCase()).toContain('unit economics');
    expect(minor.content.toLowerCase()).toContain('clarification');
  });

  it('escapes double-quotes in title/description for YAML safety', () => {
    const diff = makeDiff('material', {
      changes: [
        {
          field: 'enforcement_notes_md',
          before: null,
          after: null,
          severity: 'material',
          description: 'Enforcement note mentions "21-day" cure period.',
        },
      ],
    });
    const out = toMdxBlogPost({ diff, city, state, publishedAt: '2026-05-14' });
    // Frontmatter description should NOT contain a raw unescaped quote that would break YAML
    const fmBlock = out.content.match(/^---\n([\s\S]+?)\n---/)?.[1] ?? '';
    expect(fmBlock).toContain('\\"21-day\\"');
  });
});
