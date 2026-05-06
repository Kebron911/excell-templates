/**
 * SEO library — Schema.org JSON-LD builders.
 *
 * Per design spec section 12 (mirrors strhost.tools):
 * - Organization (site-wide, embedded in Layout)
 * - WebApplication (per generator)
 * - FAQPage (per generator)
 * - Article (per blog post)
 *
 * strguests addition: programmatic /templates/[scenario] pages also use
 * Article schema, so buildArticle accepts a pathPrefix ("blog" | "templates").
 *
 * Returned objects are plain JSON-ready data — render via
 * <script type="application/ld+json">{JSON.stringify(obj)}</script>.
 */

const SITE_URL = 'https://strguests.tools';
const SITE_NAME = 'strguests.tools';
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
    sameAs: [
      // Filled in as social presences come online.
    ],
  };
}

export interface WebApplicationInput {
  name: string;             // e.g., "Welcome Book Builder"
  description: string;
  toolPath: string;         // e.g., "/welcome-book"
  applicationCategory?: string;  // default 'BusinessApplication'
  inLanguage?: string;      // default 'en-US'
}

export function buildWebApplication(input: WebApplicationInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: input.name,
    url: `${SITE_URL}${input.toolPath}`,
    description: input.description,
    applicationCategory: input.applicationCategory ?? 'BusinessApplication',
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
  answer: string;  // plain text or HTML
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
  slug: string;             // e.g., "late-checkout-request"
  datePublished: string;    // ISO date
  dateModified?: string;    // ISO date (default: datePublished)
  authorName?: string;
  imageUrl?: string;
  /** URL prefix segment. 'blog' for posts, 'templates' for scenario pages. */
  pathPrefix?: 'blog' | 'templates';
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

/**
 * Convenience wrapper for /templates/[scenario] programmatic pages.
 * Identical to buildArticle with pathPrefix: 'templates'.
 */
export function buildScenarioArticle(input: Omit<ArticleInput, 'pathPrefix'>): JsonLd {
  return buildArticle({ ...input, pathPrefix: 'templates' });
}

/**
 * Returns the canonical URL for a path. Used by Layout for
 * <link rel="canonical">.
 */
export function canonical(path: string): string {
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleaned}`;
}

/**
 * Returns the OG image URL for a path. The build-time Satori generator
 * (Phase 5) writes PNGs to public/og/<route>.png — this just constructs the URL.
 */
export function ogImageFor(path: string): string {
  const slug = path === '/' ? 'index' : path.replace(/^\//, '').replace(/\//g, '-');
  return `${SITE_URL}/og/${slug}.png`;
}
