/**
 * SEO library — Schema.org JSON-LD builders for strmanuals.com.
 *
 * Mirrors the sister-site pattern (STRHost-Tools, STRBuyers-Tools) but
 * extends it with Product + Offer schema since strmanuals.com is the
 * only paid-PDF e-commerce site in the cluster.
 *
 * Returned objects are plain JSON-ready data — render via
 * <script type="application/ld+json">{JSON.stringify(obj)}</script>.
 */

const SITE_URL = 'https://strmanuals.com';
const SITE_NAME = 'strmanuals.com';
const PUBLISHER_NAME = 'The STR Ledger';
const PUBLISHER_URL = 'https://thestrledger.com';

export interface JsonLd {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

/**
 * Returns the canonical URL for a path. Sitemap defaults to trailing
 * slashes on non-root URLs; canonical follows the same convention.
 */
export function canonical(path: string): string {
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  if (cleaned === '/') return `${SITE_URL}/`;
  const withSlash = cleaned.endsWith('/') ? cleaned : `${cleaned}/`;
  return `${SITE_URL}${withSlash}`;
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
      'https://strbuyers.tools',
    ],
  };
}

export interface ProductInput {
  sku: string;            // "TAX-01"
  name: string;
  description: string;
  url: string;            // path or full URL — gets normalized
  price: number;          // dollars, e.g. 29
  priceCurrency?: string; // default 'USD'
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  image?: string;
  category?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

/**
 * Product + nested Offer. Non-negotiable schema for a paid-PDF e-commerce
 * site — every manual page should emit one. Eligible for Google's
 * merchant-listings rich results once review/rating data lands.
 */
export function buildProduct(input: ProductInput): JsonLd {
  const productUrl = input.url.startsWith('http') ? input.url : canonical(input.url);
  const product: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    sku: input.sku,
    name: input.name,
    description: input.description,
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: PUBLISHER_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: input.priceCurrency ?? 'USD',
      price: input.price.toFixed(2),
      availability: `https://schema.org/${input.availability ?? 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: PUBLISHER_NAME,
        url: PUBLISHER_URL,
      },
    },
  };
  if (input.image) product.image = input.image.startsWith('http') ? input.image : `${SITE_URL}${input.image}`;
  if (input.category) product.category = input.category;
  if (input.aggregateRating) {
    product.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: input.aggregateRating.ratingValue,
      reviewCount: input.aggregateRating.reviewCount,
    };
  }
  return product;
}

export interface FaqEntry {
  q: string;
  a: string;
}

export function buildFAQPage(faqs: FaqEntry[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  path?: string;
}

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

export interface ItemListEntry {
  name: string;
  path: string;
}

export function buildItemList(items: ItemListEntry[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((entry, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: entry.name,
      url: canonical(entry.path),
    })),
  };
}

export interface WebSiteInput {
  searchPath?: string; // e.g. '/?q={search_term_string}'
}

export function buildWebSite(input: WebSiteInput = {}): JsonLd {
  const ws: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  };
  if (input.searchPath) {
    ws.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}${input.searchPath}`,
      },
      'query-input': 'required name=search_term_string',
    };
  }
  return ws;
}
