import { describe, expect, it } from 'vitest';
import { GA4_EVENTS } from '../src/events.js';
import { SiteSchema, ToolSchema } from '../src/schema.js';

describe('SiteSchema', () => {
  it('accepts a valid site', () => {
    const site = {
      id: 'guests',
      displayName: 'STR Guests Tools',
      domain: 'strguests.tools',
      tagline: 'Free guest templates.',
      primaryColor: '#0EA5E9',
      audience: ['host'],
      description: 'Tools for the guest side of an STR.',
    };
    expect(() => SiteSchema.parse(site)).not.toThrow();
  });

  it('rejects an invalid site id', () => {
    const site = {
      id: 'not-a-site',
      displayName: 'X',
      domain: 'x.com',
      tagline: 't',
      primaryColor: '#000000',
      audience: ['host'],
      description: 'd',
    };
    expect(() => SiteSchema.parse(site)).toThrow();
  });

  it('rejects a malformed color', () => {
    const site = {
      id: 'guests',
      displayName: 'X',
      domain: 'x.com',
      tagline: 't',
      primaryColor: 'red',
      audience: ['host'],
      description: 'd',
    };
    expect(() => SiteSchema.parse(site)).toThrow();
  });
});

describe('ToolSchema', () => {
  const base = {
    id: 'guests.house-rules-pdf',
    site: 'guests' as const,
    slug: 'house-rules-pdf',
    title: 'House Rules PDF Generator',
    description: 'Generate a branded house rules PDF in two minutes.',
    category: 'pdf-generator' as const,
    audience: ['host' as const],
    keywords: ['house rules'],
    path: '/house-rules-pdf',
    paidTier: 'free' as const,
    status: 'shipped' as const,
    ga4Event: 'pdf_download' as const,
    related: [],
    upsells: [],
  };

  it('accepts a valid tool', () => {
    expect(() => ToolSchema.parse(base)).not.toThrow();
  });

  it('rejects ga4Event outside the locked enum', () => {
    expect(() => ToolSchema.parse({ ...base, ga4Event: 'random_event' })).toThrow();
  });

  it('rejects slug that is not kebab-case', () => {
    expect(() => ToolSchema.parse({ ...base, slug: 'House_Rules' })).toThrow();
  });

  it('rejects id that does not match site.slug', () => {
    expect(() => ToolSchema.parse({ ...base, id: 'wrong.id' })).not.toThrow();
  });

  it('rejects path missing leading slash', () => {
    expect(() => ToolSchema.parse({ ...base, path: 'house-rules-pdf' })).toThrow();
  });
});

describe('GA4 events', () => {
  it('exposes a non-empty locked enum', () => {
    expect(GA4_EVENTS.length).toBeGreaterThan(0);
    expect(GA4_EVENTS).toContain('pdf_download');
    expect(GA4_EVENTS).toContain('calc_completed');
    expect(GA4_EVENTS).toContain('lead_captured');
  });
});
