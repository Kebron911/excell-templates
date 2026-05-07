/**
 * SEO library — Schema.org JSON-LD builders.
 *
 * Per design spec section 12 (mirrors strhost.tools, plus strbuyers Place
 * builder for city pages):
 * - Organization (site-wide, embedded in Layout)
 * - WebApplication (per calculator)
 * - FAQPage (per calculator)
 * - Article (per blog/disclosure post)
 * - Place (per city page — strbuyers cluster delta)
 *
 * Returned objects are plain JSON-ready data — render via
 * <script type="application/ld+json">{JSON.stringify(obj)}</script>.
 */

const SITE_URL = 'https://strbuyers.tools';
const SITE_NAME = 'strbuyers.tools';
const PUBLISHER_NAME = 'The STR Ledger';
const PUBLISHER_URL = 'https://thestrledger.com';

export interface JsonLd {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

export function buildOrganization(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    parentOrganization: {
      '@type': 'Organization',
      name: PUBLISHER_NAME,
      url: PUBLISHER_URL,
    },
    sameAs: [],
  };
}

export interface WebApplicationInput {
  name: string;
  description: string;
  toolPath: string;
  applicationCategory?: string;
  inLanguage?: string;
}

export function buildWebApplication(input: WebApplicationInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: input.name,
    url: `${SITE_URL}${input.toolPath}`,
    description: input.description,
    applicationCategory: input.applicationCategory ?? 'FinanceApplication',
    operatingSystem: 'Any',
    inLanguage: input.inLanguage ?? 'en-US',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER_NAME,
      url: PUBLISHER_URL,
    },
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export function buildFAQPage(faqs: FaqEntry[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export interface ArticleInput {
  headline: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  imageUrl?: string;
  pathPrefix?: 'blog' | 'disclosures';
}

export function buildArticle(input: ArticleInput): JsonLd {
  const prefix = input.pathPrefix ?? 'blog';
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: `${SITE_URL}/${prefix}/${input.slug}`,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      '@type': 'Organization',
      name: input.authorName ?? SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER_NAME,
      url: PUBLISHER_URL,
    },
    ...(input.imageUrl ? { image: input.imageUrl } : {}),
  };
}

export interface PlaceInput {
  /** City name, e.g. "Asheville" */
  name: string;
  /** State or country region, e.g. "NC" or "Texas" */
  region: string;
  /** Country code or name. Default 'US'. */
  country?: string;
  /** Slug for the city page, e.g. "asheville-nc" */
  slug: string;
  /** Optional ISO lat/long (decimal). */
  latitude?: number;
  longitude?: number;
  /** Optional 1-line description used in Place.description. */
  description?: string;
}

/**
 * Place schema for /cities/[slug] programmatic pages. strbuyers cluster delta
 * — sister sites don't ship Place. Used to anchor city-level STR market data
 * with proper Schema.org Place + addressRegion + geo coordinates.
 */
export function buildPlace(input: PlaceInput): JsonLd {
  const country = input.country ?? 'US';
  const out: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: input.name,
    url: `${SITE_URL}/cities/${input.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: input.name,
      addressRegion: input.region,
      addressCountry: country,
    },
  };
  if (input.description) out.description = input.description;
  if (input.latitude !== undefined && input.longitude !== undefined) {
    out.geo = {
      '@type': 'GeoCoordinates',
      latitude: input.latitude,
      longitude: input.longitude,
    };
  }
  return out;
}

export function canonical(path: string): string {
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleaned}`;
}

export function ogImageFor(path: string): string {
  const slug = path === '/' ? 'index' : path.replace(/^\//, '').replace(/\//g, '-');
  return `${SITE_URL}/og/${slug}.png`;
}
