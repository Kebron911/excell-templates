import { describe, it, expect } from 'vitest';
import {
  buildOrganization,
  buildWebApplication,
  buildFAQPage,
  buildArticle,
  buildScenarioArticle,
  buildBreadcrumb,
  buildHowTo,
  buildItemList,
  buildPlace,
  buildBlogPosting,
} from '../src/jsonld';
import type { SiteConfig } from '../src/site-config';

const fixtureSite: SiteConfig = {
  siteId: 'guests',
  brand: {
    name: 'STR Guests Tools',
    wordmark: 'STR Guests',
    tagline: 'Free tools for hosts',
    primaryColor: '#000',
    logo: '/logo.svg',
  },
  url: { canonical: 'https://strguests.tools' },
  emailGate: { listId: 'guests-main', welcomeSubject: 'Welcome' },
  analytics: {},
  nav: [],
  footer: { sections: [] },
};

const buyersSite: SiteConfig = {
  ...fixtureSite,
  siteId: 'buyers',
  url: { canonical: 'https://strbuyers.tools' },
  brand: { ...fixtureSite.brand, name: 'STR Buyers Tools' },
};

const opsSite: SiteConfig = {
  ...fixtureSite,
  siteId: 'ops',
  url: { canonical: 'https://strops.tools' },
  brand: { ...fixtureSite.brand, name: 'strops.tools' },
};

const PUBLISHER_URL = 'https://thestrledger.com';
const PUBLISHER_NAME = 'The STR Ledger';

// ---------- buildOrganization ----------

describe('buildOrganization()', () => {
  it('sets @type to Organization', () => {
    const ld = buildOrganization(fixtureSite);
    expect(ld['@type']).toBe('Organization');
  });

  it('name comes from siteConfig.brand.name', () => {
    expect(buildOrganization(fixtureSite).name).toBe('STR Guests Tools');
    expect(buildOrganization(buyersSite).name).toBe('STR Buyers Tools');
  });

  it('url comes from siteConfig.url.canonical', () => {
    expect(buildOrganization(fixtureSite).url).toBe('https://strguests.tools');
    expect(buildOrganization(buyersSite).url).toBe('https://strbuyers.tools');
  });

  it('parentOrganization is The STR Ledger', () => {
    const parent = buildOrganization(fixtureSite).parentOrganization as Record<string, unknown>;
    expect(parent.name).toBe(PUBLISHER_NAME);
    expect(parent.url).toBe(PUBLISHER_URL);
  });

  it('sameAs array includes thestrledger.com', () => {
    const sameAs = buildOrganization(fixtureSite).sameAs as string[];
    expect(sameAs).toContain('https://thestrledger.com');
  });

  it('@context is https://schema.org', () => {
    expect(buildOrganization(fixtureSite)['@context']).toBe('https://schema.org');
  });

  it('sameAs does NOT include own URL (trailing-slash safe)', () => {
    const sameAs = buildOrganization(fixtureSite).sameAs as string[];
    // fixtureSite uses 'https://strguests.tools' — must not appear, with or without trailing slash
    expect(sameAs).not.toContain('https://strguests.tools');
    expect(sameAs).not.toContain('https://strguests.tools/');
  });

  it('sameAs handles canonical with trailing slash correctly', () => {
    const siteWithSlash = { ...fixtureSite, url: { canonical: 'https://strguests.tools/' } };
    const sameAs = buildOrganization(siteWithSlash).sameAs as string[];
    expect(sameAs).not.toContain('https://strguests.tools');
    expect(sameAs).not.toContain('https://strguests.tools/');
  });
});

// ---------- buildWebApplication ----------

describe('buildWebApplication()', () => {
  const input = { name: 'My Tool', description: 'A tool', toolPath: '/my-tool' };

  it('url is canonical + toolPath', () => {
    expect(buildWebApplication(fixtureSite, input).url).toBe('https://strguests.tools/my-tool/');
  });

  it('url uses correct site canonical', () => {
    expect(buildWebApplication(buyersSite, input).url).toBe('https://strbuyers.tools/my-tool/');
  });

  it('default applicationCategory is FinanceApplication', () => {
    expect(buildWebApplication(fixtureSite, input).applicationCategory).toBe('FinanceApplication');
  });

  it('applicationCategory can be overridden', () => {
    const ld = buildWebApplication(fixtureSite, {
      ...input,
      applicationCategory: 'BusinessApplication',
    });
    expect(ld.applicationCategory).toBe('BusinessApplication');
  });

  it('price is 0 USD', () => {
    const offers = buildWebApplication(fixtureSite, input).offers as Record<string, unknown>;
    expect(offers.price).toBe('0');
    expect(offers.priceCurrency).toBe('USD');
  });

  it('publisher name and url are set', () => {
    const publisher = buildWebApplication(fixtureSite, input).publisher as Record<string, unknown>;
    expect(publisher.name).toBe(PUBLISHER_NAME);
    expect(publisher.url).toBe(PUBLISHER_URL);
  });
});

// ---------- URL normalization edge cases ----------

describe('URL normalization edge cases', () => {
  it('buildWebApplication accepts toolPath without leading slash', () => {
    const out = buildWebApplication(fixtureSite, { name: 'Foo', description: 'Foo tool', toolPath: 'foo-tool' });
    expect(out.url).toBe('https://strguests.tools/foo-tool/');
  });

  it('buildArticle handles pathPrefix with leading slash', () => {
    const out = buildArticle(fixtureSite, {
      slug: 'test',
      headline: 't',
      description: 'd',
      datePublished: '2026-01-01',
      pathPrefix: '/blog',
    });
    expect(out.url).toBe('https://strguests.tools/blog/test/');
  });

  it('buildArticle handles pathPrefix with trailing slash', () => {
    const out = buildArticle(fixtureSite, {
      slug: 'test',
      headline: 't',
      description: 'd',
      datePublished: '2026-01-01',
      pathPrefix: 'blog/',
    });
    expect(out.url).toBe('https://strguests.tools/blog/test/');
  });
});

// ---------- buildFAQPage ----------

describe('buildFAQPage()', () => {
  const faqs = [
    { question: 'What is this?', answer: 'A tool.' },
    { question: 'Is it free?', answer: 'Yes.' },
  ];

  it('@type is FAQPage', () => {
    expect(buildFAQPage(faqs)['@type']).toBe('FAQPage');
  });

  it('mainEntity has correct count', () => {
    const entity = buildFAQPage(faqs).mainEntity as unknown[];
    expect(entity).toHaveLength(2);
  });

  it('each entry has Question type', () => {
    const entity = buildFAQPage(faqs).mainEntity as Record<string, unknown>[];
    expect(entity[0]['@type']).toBe('Question');
  });

  it('answer text is preserved', () => {
    const entity = buildFAQPage(faqs).mainEntity as Record<string, unknown>[];
    const answer = entity[0].acceptedAnswer as Record<string, unknown>;
    expect(answer.text).toBe('A tool.');
  });

  it('empty faqs yields empty mainEntity', () => {
    const entity = buildFAQPage([]).mainEntity as unknown[];
    expect(entity).toHaveLength(0);
  });
});

// ---------- buildArticle ----------

describe('buildArticle()', () => {
  const input = {
    headline: 'Test Post',
    description: 'A post.',
    slug: 'test-post',
    datePublished: '2026-01-01',
  };

  it('url defaults to /blog/{slug}', () => {
    expect(buildArticle(fixtureSite, input).url).toBe('https://strguests.tools/blog/test-post/');
  });

  it('uses correct site canonical in url', () => {
    expect(buildArticle(buyersSite, input).url).toBe('https://strbuyers.tools/blog/test-post/');
  });

  it('pathPrefix overrides url segment', () => {
    const ld = buildArticle(fixtureSite, { ...input, pathPrefix: 'templates' });
    expect(ld.url).toBe('https://strguests.tools/templates/test-post/');
  });

  it('dateModified defaults to datePublished', () => {
    expect(buildArticle(fixtureSite, input).dateModified).toBe('2026-01-01');
  });

  it('dateModified is used when provided', () => {
    const ld = buildArticle(fixtureSite, { ...input, dateModified: '2026-02-01' });
    expect(ld.dateModified).toBe('2026-02-01');
  });

  it('author url is site canonical when authorName not given', () => {
    const author = buildArticle(fixtureSite, input).author as Record<string, unknown>;
    expect(author.url).toBe('https://strguests.tools');
  });

  it('image is omitted when not provided', () => {
    expect(buildArticle(fixtureSite, input).image).toBeUndefined();
  });

  it('image is set when provided', () => {
    const ld = buildArticle(fixtureSite, { ...input, imageUrl: '/img.png' });
    expect(ld.image).toBe('/img.png');
  });
});

// ---------- buildScenarioArticle ----------

describe('buildScenarioArticle()', () => {
  const input = {
    headline: 'Late Checkout',
    description: 'Handle late checkout.',
    slug: 'late-checkout-request',
    datePublished: '2026-01-01',
  };

  it('url uses /templates/ prefix', () => {
    expect(buildScenarioArticle(fixtureSite, input).url).toBe(
      'https://strguests.tools/templates/late-checkout-request/',
    );
  });

  it('@type is Article', () => {
    expect(buildScenarioArticle(fixtureSite, input)['@type']).toBe('Article');
  });

  it('works on buyers site', () => {
    expect(buildScenarioArticle(buyersSite, input).url).toBe(
      'https://strbuyers.tools/templates/late-checkout-request/',
    );
  });

  it('dateModified defaults to datePublished', () => {
    expect(buildScenarioArticle(fixtureSite, input).dateModified).toBe('2026-01-01');
  });

  it('publisher is The STR Ledger', () => {
    const publisher = buildScenarioArticle(fixtureSite, input).publisher as Record<string, unknown>;
    expect(publisher.name).toBe(PUBLISHER_NAME);
  });
});

// ---------- buildBreadcrumb ----------

describe('buildBreadcrumb()', () => {
  const crumbs = [
    { name: 'Home', url: 'https://strguests.tools/' },
    { name: 'Templates', url: '/templates' },
    { name: 'Late Checkout', url: '/templates/late-checkout-request' },
  ];

  it('@type is BreadcrumbList', () => {
    expect(buildBreadcrumb(fixtureSite, crumbs)['@type']).toBe('BreadcrumbList');
  });

  it('position is 1-indexed', () => {
    const items = buildBreadcrumb(fixtureSite, crumbs).itemListElement as Record<
      string,
      unknown
    >[];
    expect(items[0].position).toBe(1);
    expect(items[2].position).toBe(3);
  });

  it('absolute URL is kept as-is', () => {
    const items = buildBreadcrumb(fixtureSite, crumbs).itemListElement as Record<
      string,
      unknown
    >[];
    expect(items[0].item).toBe('https://strguests.tools/');
  });

  it('relative URL is resolved against siteConfig canonical', () => {
    const items = buildBreadcrumb(fixtureSite, crumbs).itemListElement as Record<
      string,
      unknown
    >[];
    expect(items[1].item).toBe('https://strguests.tools/templates/');
  });

  it('uses correct canonical for buyers site', () => {
    const buyersCrumbs = [
      { name: 'Home', url: '/' },
      { name: 'DSCR', url: '/dscr-loan-calculator' },
    ];
    const items = buildBreadcrumb(buyersSite, buyersCrumbs).itemListElement as Record<
      string,
      unknown
    >[];
    expect(items[0].item).toBe('https://strbuyers.tools/');
  });
});

// ---------- buildHowTo ----------

describe('buildHowTo()', () => {
  const input = {
    name: 'How to Calculate DSCR',
    description: 'Step-by-step DSCR.',
    steps: [
      { name: 'Step 1', text: 'Gather NOI.' },
      { name: 'Step 2', text: 'Divide by debt service.' },
    ],
  };

  it('@type is HowTo', () => {
    expect(buildHowTo(input)['@type']).toBe('HowTo');
  });

  it('step count matches input', () => {
    const steps = buildHowTo(input).step as unknown[];
    expect(steps).toHaveLength(2);
  });

  it('steps have 1-based position', () => {
    const steps = buildHowTo(input).step as Record<string, unknown>[];
    expect(steps[0].position).toBe(1);
    expect(steps[1].position).toBe(2);
  });

  it('totalTime is omitted when not given', () => {
    expect(buildHowTo(input).totalTime).toBeUndefined();
  });

  it('totalTime is set when provided', () => {
    const ld = buildHowTo({ ...input, totalTime: 'PT5M' });
    expect(ld.totalTime).toBe('PT5M');
  });

  it('no siteConfig needed — buildHowTo is site-agnostic', () => {
    // HowTo content is caller-supplied; no URLs injected
    const ld = buildHowTo(input);
    expect(ld.name).toBe('How to Calculate DSCR');
  });
});

// ---------- buildItemList ----------

describe('buildItemList()', () => {
  const input = {
    name: 'All Templates',
    items: [
      { name: 'Late Checkout', path: '/templates/late-checkout-request' },
      { name: 'Early Check-in', path: '/templates/early-check-in' },
    ],
  };

  it('@type is ItemList', () => {
    expect(buildItemList(fixtureSite, input)['@type']).toBe('ItemList');
  });

  it('numberOfItems matches items length', () => {
    expect(buildItemList(fixtureSite, input).numberOfItems).toBe(2);
  });

  it('item URL is absolute using canonical()', () => {
    const items = buildItemList(fixtureSite, input).itemListElement as Record<string, unknown>[];
    expect(items[0].url).toBe(
      'https://strguests.tools/templates/late-checkout-request/',
    );
  });

  it('item URL uses correct site canonical', () => {
    const buyersInput = {
      name: 'US Cities',
      items: [{ name: 'Austin', path: '/cities/austin-tx' }],
    };
    const items = buildItemList(buyersSite, buyersInput).itemListElement as Record<
      string,
      unknown
    >[];
    expect(items[0].url).toBe('https://strbuyers.tools/cities/austin-tx/');
  });

  it('description is included when provided', () => {
    const ld = buildItemList(fixtureSite, { ...input, description: 'Guest message templates.' });
    expect(ld.description).toBe('Guest message templates.');
  });

  it('description is omitted when not provided', () => {
    expect(buildItemList(fixtureSite, input).description).toBeUndefined();
  });

  it('handles empty items array (numberOfItems: 0)', () => {
    const out = buildItemList(fixtureSite, { name: 'Empty Directory', items: [] });
    expect(out.numberOfItems).toBe(0);
    expect(out.itemListElement).toEqual([]);
  });
});

// ---------- buildPlace ----------

describe('buildPlace()', () => {
  const input = {
    city: 'Austin',
    addressRegion: 'TX',
    slug: 'austin-tx',
    description: 'Live music capital.',
  };

  it('@type is Place', () => {
    expect(buildPlace(buyersSite, input)['@type']).toBe('Place');
  });

  it('name is city', () => {
    expect(buildPlace(buyersSite, input).name).toBe('Austin');
  });

  it('url uses buyers canonical + /cities/{slug}', () => {
    expect(buildPlace(buyersSite, input).url).toBe('https://strbuyers.tools/cities/austin-tx/');
  });

  it('url is omitted when no slug given', () => {
    const { slug: _s, ...noSlug } = input;
    expect(buildPlace(buyersSite, noSlug).url).toBeUndefined();
  });

  it('address has correct locality and region', () => {
    const addr = buildPlace(buyersSite, input).address as Record<string, unknown>;
    expect(addr.addressLocality).toBe('Austin');
    expect(addr.addressRegion).toBe('TX');
  });

  it('addressCountry defaults to US', () => {
    const addr = buildPlace(buyersSite, input).address as Record<string, unknown>;
    expect(addr.addressCountry).toBe('US');
  });

  it('geo is included when provided', () => {
    const ld = buildPlace(buyersSite, { ...input, geo: { latitude: 30.27, longitude: -97.74 } });
    const geo = ld.geo as Record<string, unknown>;
    expect(geo['@type']).toBe('GeoCoordinates');
    expect(geo.latitude).toBe(30.27);
  });
});

// ---------- buildBlogPosting ----------

describe('buildBlogPosting()', () => {
  const input = {
    headline: 'Managing Cleaners',
    description: 'How to dispatch cleaners efficiently.',
    url: 'https://strops.tools/blog/managing-cleaners',
    image: 'https://strops.tools/og/managing-cleaners.png',
    datePublished: '2026-01-15',
    dateModified: '2026-01-20',
    authorName: 'Daniel Harrison',
    section: 'Operations',
  };

  it('@type is BlogPosting', () => {
    expect(buildBlogPosting(opsSite, input)['@type']).toBe('BlogPosting');
  });

  it('headline is preserved', () => {
    expect(buildBlogPosting(opsSite, input).headline).toBe('Managing Cleaners');
  });

  it('author is Person with provided name', () => {
    const author = buildBlogPosting(opsSite, input).author as Record<string, unknown>;
    expect(author['@type']).toBe('Person');
    expect(author.name).toBe('Daniel Harrison');
  });

  it('publisher name comes from siteConfig.brand.name', () => {
    const publisher = buildBlogPosting(opsSite, input).publisher as Record<string, unknown>;
    expect(publisher.name).toBe('strops.tools');
  });

  it('publisher url comes from siteConfig.url.canonical', () => {
    const publisher = buildBlogPosting(opsSite, input).publisher as Record<string, unknown>;
    expect(publisher.url).toBe('https://strops.tools');
  });

  it('keywords are joined to a string when provided', () => {
    const ld = buildBlogPosting(opsSite, { ...input, keywords: ['cleaning', 'operations'] });
    expect(ld.keywords).toBe('cleaning, operations');
  });

  it('keywords are omitted when not provided', () => {
    expect(buildBlogPosting(opsSite, input).keywords).toBeUndefined();
  });
});
