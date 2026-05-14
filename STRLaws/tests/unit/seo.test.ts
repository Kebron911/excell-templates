import { describe, expect, it } from 'vitest';
import {
  buildBreadcrumbList,
  buildCityMeta,
  buildFaqSchema,
  buildGovernmentServiceSchema,
  buildOrganizationSchema,
  buildStateMeta,
  buildWebSiteSchema,
} from '../../src/lib/seo';

describe('seo schema builders', () => {
  it('builds BreadcrumbList with position-indexed items', () => {
    const schema = buildBreadcrumbList([
      { name: 'Home', url: '/' },
      { name: 'Utah', url: '/utah' },
      { name: 'Salt Lake City', url: '/utah/salt-lake-city' },
    ]);
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toHaveLength(3);
    expect(schema.itemListElement[0]).toMatchObject({ position: 1, name: 'Home' });
    expect(schema.itemListElement[2]).toMatchObject({ position: 3, name: 'Salt Lake City' });
  });

  it('builds GovernmentService schema with city, state, and dateModified', () => {
    const schema = buildGovernmentServiceSchema({
      cityName: 'Nashville',
      stateName: 'Tennessee',
      pageUrl: '/tennessee/nashville',
      permitCostUsd: 313,
      permitRequired: true,
      taxRatePct: 6,
      banStatus: 'partial',
      lastVerifiedAt: '2026-05-14',
    });
    expect(schema['@type']).toBe('GovernmentService');
    expect(schema.name).toContain('Nashville');
    expect(schema.name).toContain('Tennessee');
    expect(schema.dateModified).toBe('2026-05-14');
  });

  it('omits dateModified when lastVerifiedAt is null', () => {
    const schema = buildGovernmentServiceSchema({
      cityName: 'Austin',
      stateName: 'Texas',
      pageUrl: '/texas/austin',
      permitCostUsd: null,
      permitRequired: null,
      taxRatePct: null,
      banStatus: null,
      lastVerifiedAt: null,
    });
    expect(schema).not.toHaveProperty('dateModified');
  });

  it('builds FAQPage with mainEntity per question', () => {
    const schema = buildFaqSchema([
      { question: 'Q1?', answer: 'A1' },
      { question: 'Q2?', answer: 'A2' },
    ]);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0]).toMatchObject({
      '@type': 'Question',
      name: 'Q1?',
      acceptedAnswer: { '@type': 'Answer', text: 'A1' },
    });
  });

  it('builds Organization + WebSite schemas', () => {
    expect(buildOrganizationSchema()['@type']).toBe('Organization');
    expect(buildWebSiteSchema()['@type']).toBe('WebSite');
  });

  it('builds city meta with month-year freshness in title', () => {
    const meta = buildCityMeta('Salt Lake City', 'Utah', '/utah/salt-lake-city', 'May 2026');
    expect(meta.title).toContain('Salt Lake City');
    expect(meta.title).toContain('Utah');
    expect(meta.title).toContain('May 2026');
    expect(meta.canonical).toContain('/utah/salt-lake-city');
  });

  it('builds state meta', () => {
    const meta = buildStateMeta('Utah', '/utah');
    expect(meta.title).toContain('Utah');
    expect(meta.canonical).toContain('/utah');
  });
});
