/**
 * SEO library — Schema.org JSON-LD builders.
 *
 * Per design spec:
 * - Organization (site-wide, embedded in Layout)
 * - WebApplication (per tool)
 * - FAQPage (per tool)
 * - Article (per blog post)
 *
 * No Place builder — strops.tools has no city pages (operations layer doesn't
 * need geo-targeted programmatic content; that's the acquisition cluster's job).
 *
 * Returned objects are plain JSON-ready data — render via
 * <script type="application/ld+json">{JSON.stringify(obj)}</script>.
 */

const SITE_URL = 'https://strops.tools';
const SITE_NAME = 'strops.tools';
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
  name: string;             // e.g., "Turnover scheduler"
  description: string;
  toolPath: string;         // e.g., "/turnover-scheduler"
  /**
   * Default 'BusinessApplication' (operational tooling for short-term rental
   * operators). Override per-tool if a more specific Schema.org category fits.
   */
  applicationCategory?: string;
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
  slug: string;             // e.g., "how-airbnb-cleaner-dispatch-works"
  datePublished: string;    // ISO date
  dateModified?: string;    // ISO date (default: datePublished)
  authorName?: string;
  imageUrl?: string;
}

export function buildArticle(input: ArticleInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: `${SITE_URL}/blog/${input.slug}`,
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
 * Returns the canonical URL for a path. Used by Layout for
 * <link rel="canonical"> and astro-seo's `canonical` prop.
 */
export function canonical(path: string): string {
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleaned}`;
}

/**
 * Returns the OG image URL for a path. The build-time Satori generator
 * (Phase 4 Task 30) writes PNGs to public/og/<route>.png — this just
 * constructs the URL.
 */
export function ogImageFor(path: string): string {
  const slug = path === '/' ? 'index' : path.replace(/^\//, '').replace(/\//g, '-');
  return `${SITE_URL}/og/${slug}.png`;
}
