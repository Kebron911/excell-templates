/**
 * SEO library — Schema.org JSON-LD builders for thestrledger.com (hub brand).
 *
 * This site IS the parent of the STR cluster:
 *   strhost.tools / strbuyers.tools / strops.tools / strguests.tools / strmanuals.com
 *
 * Builders:
 * - Organization (site-wide, no parentOrganization — this is the hub)
 * - WebSite (with SearchAction)
 * - Product + Offer (per workbook SKU)
 * - BreadcrumbList
 * - FAQPage
 * - ItemList (product catalog)
 * - Article (per blog post)
 *
 * Returned objects are plain JSON-ready data — render via
 * <script type="application/ld+json">{JSON.stringify(obj)}</script>.
 */

export const SITE_URL = 'https://thestrledger.com';
export const SITE_NAME = 'The STR Ledger';
export const SITE_TAGLINE = 'Run your rentals before they run you.';
export const CONTACT_EMAIL = 'hello@thestrledger.com';

export const SISTER_SITES = [
  'https://strhost.tools',
  'https://strbuyers.tools',
  'https://strops.tools',
  'https://strguests.tools',
  'https://strmanuals.com',
] as const;

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
    logo: `${SITE_URL}/favicon.svg`,
    description:
      'Excel workbooks and PDF guides for serious short-term rental operators. Schedule E-ready bookkeeping, turnover ops, guest experience, and acquisition math — built for portfolios of 3+ properties.',
    email: CONTACT_EMAIL,
    // Parent brand — owns all five sister sites. This is the hub-and-spoke
    // entity signal: thestrledger.com publishes the workbooks; the .tools
    // sites are free funnels into the workbook catalog.
    sameAs: [...SISTER_SITES],
  };
}

export function buildWebSite(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

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

export interface ProductInput {
  name: string;
  description: string;
  slug: string;
  sku: string;
  price: number;            // USD
  image?: string;
  gtin?: string;
  brand?: string;
  category?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export function buildProduct(input: ProductInput): JsonLd {
  const url = `${SITE_URL}/products/${input.slug}/`;
  const obj: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    sku: input.sku,
    url,
    brand: {
      '@type': 'Brand',
      name: input.brand ?? SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url,
      price: input.price.toFixed(2),
      priceCurrency: 'USD',
      availability: `https://schema.org/${input.availability ?? 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
  };
  if (input.image) obj.image = input.image.startsWith('http') ? input.image : `${SITE_URL}${input.image}`;
  if (input.gtin) obj.gtin = input.gtin;
  if (input.category) obj.category = input.category;
  if (input.aggregateRating) {
    obj.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: input.aggregateRating.ratingValue.toFixed(1),
      reviewCount: input.aggregateRating.reviewCount,
    };
  }
  return obj;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export function buildFAQPage(faqs: FaqEntry[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export interface ItemListEntry {
  name: string;
  url: string;
  position?: number;
}

export interface ItemListInput {
  name: string;
  items: ItemListEntry[];
}

export function buildItemList(input: ItemListInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: input.name,
    itemListElement: input.items.map((item, i) => ({
      '@type': 'ListItem',
      position: item.position ?? i + 1,
      name: item.name,
      url: item.url.startsWith('http') ? item.url : canonical(item.url),
    })),
  };
}

export interface ArticleInput {
  headline: string;
  description: string;
  slug: string;
  datePublished: string;    // ISO date
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
    url: `${SITE_URL}/blog/${input.slug}/`,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      '@type': 'Organization',
      name: input.authorName ?? SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(input.imageUrl ? { image: input.imageUrl } : {}),
  };
}

/**
 * Canonical URL for a path. Always trailing slash on non-root paths to match
 * astro.config.mjs `trailingSlash: 'always'` and the live sitemap.
 */
export function canonical(path: string): string {
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  if (cleaned === '/') return `${SITE_URL}/`;
  const [pathOnly, ...rest] = cleaned.split(/(?=[?#])/);
  const withSlash = pathOnly.endsWith('/') ? pathOnly : `${pathOnly}/`;
  return `${SITE_URL}${withSlash}${rest.join('')}`;
}

export function ogImageFor(path: string): string {
  const slug = path === '/' ? 'index' : path.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '-');
  return `${SITE_URL}/og/${slug}.png`;
}
