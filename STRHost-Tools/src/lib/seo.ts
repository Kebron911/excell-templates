/**
 * SEO library — Schema.org JSON-LD builders.
 *
 * Per design spec section 12:
 * - Organization (site-wide, embedded in Layout)
 * - WebApplication (per tool)
 * - FAQPage (per tool)
 * - Article (per blog post)
 *
 * Returned objects are plain JSON-ready data — render via
 * <script type="application/ld+json">{JSON.stringify(obj)}</script>.
 */

const SITE_URL = 'https://strhost.tools';
const SITE_NAME = 'strhost.tools';
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
      'https://thestrledger.com',
      'https://strguests.tools',
      'https://strops.tools',
      'https://strbuyers.tools',
      'https://strmanuals.com',
    ],
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;  // absolute or path; absolute preferred
}

/**
 * BreadcrumbList JSON-LD builder.
 *
 * Pass an ordered array Home → ... → current page. Relative paths are
 * resolved against SITE_URL. The current page should appear last; its
 * URL is still emitted (Google accepts both styles).
 */
export function buildBreadcrumb(crumbs: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url.startsWith('http') ? c.url : canonical(c.url),
    })),
  };
}

export interface WebApplicationInput {
  name: string;             // e.g., "Airbnb Fee Calculator"
  description: string;
  toolPath: string;         // e.g., "/airbnb-fee-calculator"
  applicationCategory?: string;  // default 'FinanceApplication'
  inLanguage?: string;      // default 'en-US'
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
  slug: string;             // e.g., "how-airbnb-fees-work"
  datePublished: string;    // ISO date
  dateModified?: string;    // ISO date (default: datePublished)
  authorName?: string;      // default site name
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
 *
 * Convention: trailing slash on every non-root path. Matches the live
 * sitemap emitted by @astrojs/sitemap and prevents the dual-URL
 * canonical drift that flagged in the SEO audit.
 */
export function canonical(path: string): string {
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  if (cleaned === '/') return `${SITE_URL}/`;
  // Strip query/hash before adding trailing slash, then re-append.
  const [pathOnly, ...rest] = cleaned.split(/(?=[?#])/);
  const withSlash = pathOnly.endsWith('/') ? pathOnly : `${pathOnly}/`;
  return `${SITE_URL}${withSlash}${rest.join('')}`;
}

/**
 * Returns the OG image URL for a path. The build-time Satori generator (Task 23)
 * writes PNGs to public/og/<route>.png — this just constructs the URL.
 */
export function ogImageFor(path: string): string {
  const slug = path === '/' ? 'index' : path.replace(/^\//, '').replace(/\//g, '-');
  return `${SITE_URL}/og/${slug}.png`;
}
