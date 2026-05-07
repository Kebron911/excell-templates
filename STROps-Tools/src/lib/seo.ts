/**
 * SEO library — Schema.org JSON-LD builders for strops.tools.
 * Mirrors strhost.tools' SEO contract; no Place builder (no city pages).
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
    applicationCategory: input.applicationCategory ?? 'BusinessApplication',
    operatingSystem: 'Any',
    inLanguage: input.inLanguage ?? 'en-US',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: PUBLISHER_NAME, url: PUBLISHER_URL },
  };
}

export interface FaqEntry { question: string; answer: string; }

export function buildFAQPage(faqs: FaqEntry[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
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
  pathPrefix?: 'blog' | 'maintenance' | 'replacement';
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
    author: { '@type': 'Organization', name: input.authorName ?? SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: PUBLISHER_NAME, url: PUBLISHER_URL },
    ...(input.imageUrl ? { image: input.imageUrl } : {}),
  };
}

export function canonical(path: string): string {
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleaned}`;
}

export function ogImageFor(path: string): string {
  const slug = path === '/' ? 'index' : path.replace(/^\//, '').replace(/\//g, '-');
  return `${SITE_URL}/og/${slug}.png`;
}
