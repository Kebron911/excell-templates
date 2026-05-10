/**
 * SEO library — Schema.org JSON-LD builders.
 *
 * Builders:
 * - Organization (site-wide, embedded in Layout)
 * - WebApplication (per tool)
 * - FAQPage (per tool)
 * - Article (per blog post)
 * - Place (per city page — strbuyers delta from strhost.tools)
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
    sameAs: [
      // Filled in as social presences come online.
    ],
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
 * Place JSON-LD for city pages (Phase 3). strbuyers-only delta:
 * strhost.tools' SEO library doesn't ship Place; we add it here for the
 * 200-city programmatic page set in Phase 3.
 */
export interface PlaceInput {
  /** City name, e.g. "Austin" */
  city: string;
  /** Two-letter US state code or full region name, e.g. "TX" */
  addressRegion: string;
  /** ISO 3166-1 alpha-2 country, default "US" */
  addressCountry?: string;
  /** Optional geo coordinates */
  geo?: { latitude: number; longitude: number };
  /** Slug used in the city URL, e.g. "austin-tx" */
  slug?: string;
  /** Short description / about blurb. */
  description?: string;
}

export function buildPlace(input: PlaceInput): JsonLd {
  const { city, addressRegion, addressCountry = 'US', geo, slug, description } = input;
  const url = slug ? `${SITE_URL}/cities/${slug}` : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: city,
    ...(url ? { url } : {}),
    ...(description ? { description } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion,
      addressCountry,
    },
    ...(geo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: geo.latitude,
            longitude: geo.longitude,
          },
        }
      : {}),
  };
}

export interface BreadcrumbCrumb {
  /** Display name, e.g. "Blog" */
  name: string;
  /** Path on this site, e.g. "/blog". Last crumb may omit URL but
   * Google rendering improves when every crumb has one. */
  path: string;
}

/**
 * BreadcrumbList — emit on every non-root page so SERPs show the breadcrumb
 * navigation chip and Google can build a hub-and-spoke understanding of the
 * site. Canonical URLs are derived via SITE_URL + path.
 */
export function buildBreadcrumbList(crumbs: BreadcrumbCrumb[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
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
 * Returns the OG image URL for a path. The Phase 4 Satori generator
 * (scripts/build-og.mjs) writes PNGs to:
 *   public/og/{slug}.png             top-level routes
 *   public/og/cities/{slug}.png      city pages
 *   public/og/default.png            fallback
 *
 * Mirror that layout here so <meta og:image> resolves to a real file.
 */
export function ogImageFor(path: string): string {
  if (path === '/' || path === '') {
    return `${SITE_URL}/og/index.png`;
  }
  // City pages keep the /cities/ prefix in the OG path so we can colocate
  // 219 PNGs in their own directory rather than flooding /og/.
  const cityMatch = path.match(/^\/cities\/([^/]+)\/?$/);
  if (cityMatch) {
    return `${SITE_URL}/og/cities/${cityMatch[1]}.png`;
  }
  // Top-level pages: strip leading slash. If the route still has nested
  // segments (none today on strbuyers.tools), join with '-' and the build
  // script needs to add a matching entry, otherwise the meta tag will 404
  // and OG validators will surface it loudly during launch QA.
  const slug = path.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '-');
  return `${SITE_URL}/og/${slug}.png`;
}
