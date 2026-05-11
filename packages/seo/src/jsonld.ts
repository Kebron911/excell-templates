/**
 * Schema.org JSON-LD builders, parameterized by SiteConfig.
 *
 * All functions return plain JSON-ready objects for use in:
 *   <script type="application/ld+json">{JSON.stringify(obj)}</script>
 *
 * Reconciliation source:
 *   - buildOrganization, buildWebApplication, buildFAQPage, buildArticle,
 *     buildBreadcrumb, buildHowTo: STRBuyers canonical (merged with STRGuests delta).
 *   - buildScenarioArticle: STRGuests (unique, has callers).
 *   - buildPlace: STRBuyers (unique, has callers in cities/[slug].astro).
 *   - buildItemList: STRBuyers shape (richer name+description wrapper vs bare array).
 *   - buildBlogPosting: STROps (unique BlogPosting type, has callers in blog/[slug].astro).
 *   - STROps functions (orgJsonLd, articleJsonLd, etc.) are renamed equivalents —
 *     they map to the canonical names above; STROps wiring handled in Task 8.
 */

import type { SiteConfig } from './site-config.js';
import { canonical } from './meta.js';

const PUBLISHER_NAME = 'The STR Ledger';
const PUBLISHER_URL = 'https://thestrledger.com';

/** All sites in the network for sameAs arrays. */
const NETWORK_URLS = [
  'https://thestrledger.com',
  'https://strhost.tools',
  'https://strguests.tools',
  'https://strbuyers.tools',
  'https://strops.tools',
  'https://strmanuals.com',
];

export interface JsonLd {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

// ---------- Organization ----------

export function buildOrganization(siteConfig: SiteConfig): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.brand.name,
    url: siteConfig.url.canonical,
    parentOrganization: {
      '@type': 'Organization',
      name: PUBLISHER_NAME,
      url: PUBLISHER_URL,
    },
    sameAs: NETWORK_URLS.filter(u =>
      u.replace(/\/$/, '') !== siteConfig.url.canonical.replace(/\/$/, '')
    ),
  };
}

// ---------- WebApplication ----------

export interface WebApplicationInput {
  name: string;
  description: string;
  toolPath: string;
  /** @default 'FinanceApplication' */
  applicationCategory?: string;
  /** @default 'en-US' */
  inLanguage?: string;
}

export function buildWebApplication(
  siteConfig: SiteConfig,
  input: WebApplicationInput,
): JsonLd {
  const normalizedPath = input.toolPath.startsWith('/') ? input.toolPath : `/${input.toolPath}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: input.name,
    url: canonical(siteConfig, normalizedPath),
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

// ---------- FAQPage ----------

export interface FaqEntry {
  question: string;
  answer: string; // plain text or HTML
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

// ---------- Article ----------

export interface ArticleInput {
  headline: string;
  description: string;
  slug: string;
  datePublished: string; // ISO date
  dateModified?: string; // ISO date (default: datePublished)
  authorName?: string;
  imageUrl?: string;
  /**
   * URL path prefix. Default: 'blog'.
   * STRGuests also uses 'templates' for programmatic scenario pages.
   */
  pathPrefix?: string;
}

export function buildArticle(siteConfig: SiteConfig, input: ArticleInput): JsonLd {
  const prefix = (input.pathPrefix ?? 'blog').replace(/^\//, '').replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: canonical(siteConfig, `/${prefix}/${input.slug}`),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      '@type': 'Organization',
      name: input.authorName ?? siteConfig.brand.name,
      url: siteConfig.url.canonical,
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
 * Convenience wrapper for /templates/[scenario] programmatic pages (STRGuests).
 * Identical to buildArticle with pathPrefix: 'templates'.
 */
export function buildScenarioArticle(
  siteConfig: SiteConfig,
  input: Omit<ArticleInput, 'pathPrefix'>,
): JsonLd {
  return buildArticle(siteConfig, { ...input, pathPrefix: 'templates' });
}

// ---------- BreadcrumbList ----------

export interface BreadcrumbItem {
  name: string;
  /**
   * Absolute URL or site-relative path (e.g. '/templates').
   * Relative paths are resolved against siteConfig.url.canonical via canonical().
   */
  url: string;
}

/**
 * BreadcrumbList JSON-LD. Pass items in order from root to current page.
 * Both absolute and relative URLs are accepted; relative are resolved
 * against siteConfig.url.canonical with trailing-slash normalization.
 *
 * Note: STRBuyers used a {name, path?} shape where last item omitted URL.
 * The canonical shape here is {name, url} — callers control whether to
 * include the current page URL (Google accepts both styles).
 */
export function buildBreadcrumb(siteConfig: SiteConfig, items: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http')
        ? item.url
        : canonical(siteConfig, item.url),
    })),
  };
}

// ---------- HowTo ----------

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
 * HowTo JSON-LD for stepwise calculators/generators.
 * Site-agnostic — no URLs in the output schema; caller supplies all content.
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

// ---------- ItemList ----------

export interface ItemListEntry {
  name: string;
  /** Site-relative path, e.g. "/templates/late-checkout-request" */
  path: string;
}

export interface ItemListInput {
  name: string;
  description?: string;
  items: ItemListEntry[];
}

/**
 * ItemList JSON-LD for directory pages.
 * Uses STRBuyers' richer shape (name + optional description wrapper).
 * STRGuests/STRHost/STROps passed a bare array — callers migrating to this
 * package wrap their array in {name, items}.
 */
export function buildItemList(siteConfig: SiteConfig, input: ItemListInput): JsonLd {
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
      url: canonical(siteConfig, entry.path),
    })),
  };
}

// ---------- Place (STRBuyers only, Phase 3 city pages) ----------

export interface PlaceInput {
  city: string;
  addressRegion: string;
  addressCountry?: string;
  geo?: { latitude: number; longitude: number };
  slug?: string;
  description?: string;
}

/**
 * Place JSON-LD for city pages (STRBuyers /cities/[slug]).
 * STRBuyers-specific; other sites don't have city directory pages.
 */
export function buildPlace(siteConfig: SiteConfig, input: PlaceInput): JsonLd {
  const { city, addressRegion, addressCountry = 'US', geo, slug, description } = input;
  const url = slug ? canonical(siteConfig, `/cities/${slug}`) : undefined;
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

// ---------- BlogPosting (STROps blog pages) ----------

export interface BlogPostingInput {
  headline: string;
  description: string;
  url: string; // caller supplies absolute URL
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  section: string;
  keywords?: string[];
  wordCount?: number;
}

/**
 * Build BlogPosting JSON-LD.
 * NOTE: caller passes absolute `url`; caller is responsible for trailing-slash consistency
 * with their site's canonical convention. Use canonical() from @str/seo to construct it.
 *
 * STROps uses BlogPosting (richer than Article) with Person author.
 * publisher name/url come from siteConfig to avoid hardcoding.
 */
export function buildBlogPosting(siteConfig: SiteConfig, input: BlogPostingInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': input.url },
    headline: input.headline,
    description: input.description,
    image: input.image,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: {
      '@type': 'Person',
      name: input.authorName,
      url: PUBLISHER_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.brand.name,
      url: siteConfig.url.canonical,
    },
    articleSection: input.section,
    ...(input.keywords && input.keywords.length ? { keywords: input.keywords.join(', ') } : {}),
    ...(input.wordCount ? { wordCount: input.wordCount } : {}),
    inLanguage: 'en-US',
  };
}
