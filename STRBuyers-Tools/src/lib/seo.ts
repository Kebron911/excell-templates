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
      'https://thestrledger.com',
      'https://strhost.tools',
      'https://strguests.tools',
      'https://strops.tools',
      'https://strmanuals.com',
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

/**
 * Returns the canonical URL for a path. Used by Layout for
 * <link rel="canonical"> and astro-seo's `canonical` prop.
 *
 * Trailing-slash convention: every non-root path is normalized to a
 * trailing slash to match the sitemap output (`@astrojs/sitemap` emits
 * `/about/`-style URLs by default). Aligning canonical with sitemap
 * removes a duplicate-content signal Google was previously seeing.
 */
export function canonical(path: string): string {
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  if (cleaned === '/') return `${SITE_URL}/`;
  const withSlash = cleaned.endsWith('/') ? cleaned : `${cleaned}/`;
  return `${SITE_URL}${withSlash}`;
}

/* ------------------------------------------------------------------ */
/* Breadcrumb / HowTo / ItemList builders                             */
/* ------------------------------------------------------------------ */

export interface BreadcrumbItem {
  /** Visible name, e.g. "Cities" */
  name: string;
  /** Site-relative path, e.g. "/cities" — pass `undefined` for the
   *  current page (last item) to omit the URL per schema.org guidance. */
  path?: string;
}

/**
 * BreadcrumbList JSON-LD. Pass items in order from root to current page.
 * Example: `buildBreadcrumb([{name:'Home',path:'/'},{name:'Cities',path:'/cities'},{name:'Austin, TX'}])`
 */
export function buildBreadcrumb(items: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      ...(item.path ? { item: canonical(item.path) } : {}),
    })),
  };
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface HowToInput {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration, e.g. "PT5M"
}

/**
 * HowTo JSON-LD for stepwise calculators (DSCR, down-payment, year-1, furnishing).
 */
export function buildHowTo(input: HowToInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
    step: input.steps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export interface ItemListEntry {
  name: string;
  /** Site-relative path, e.g. "/cities/austin-tx" */
  path: string;
}

export interface ItemListInput {
  name: string;
  description?: string;
  items: ItemListEntry[];
}

/**
 * ItemList JSON-LD. Used by /cities (219 items) and any future directory
 * page. Emits a `SummaryList` of `ListItem` with `url` only — keeps the
 * payload manageable when the list is large.
 */
export function buildItemList(input: ItemListInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    numberOfItems: input.items.length,
    itemListElement: input.items.map((entry, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: entry.name,
      url: canonical(entry.path),
    })),
  };
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
