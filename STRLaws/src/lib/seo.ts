/**
 * Schema.org JSON-LD builders for STRLaws pages.
 * Output is meant to be embedded in <script type="application/ld+json">.
 */

const SITE_URL = process.env.PUBLIC_SITE_URL ?? 'https://strlaws.com';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export interface CityRegSchemaInput {
  cityName: string;
  stateName: string;
  pageUrl: string;
  permitCostUsd: number | null;
  permitRequired: boolean | null;
  taxRatePct: number | null;
  banStatus: string | null;
  lastVerifiedAt: string | null;
}

export function buildGovernmentServiceSchema(input: CityRegSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: `Short-Term Rental Regulation in ${input.cityName}, ${input.stateName}`,
    serviceType: 'Short-Term Rental Permit & Compliance',
    provider: {
      '@type': 'GovernmentOrganization',
      name: `${input.cityName} Municipal Government`,
    },
    areaServed: {
      '@type': 'City',
      name: input.cityName,
      containedInPlace: {
        '@type': 'State',
        name: input.stateName,
      },
    },
    url: input.pageUrl.startsWith('http') ? input.pageUrl : `${SITE_URL}${input.pageUrl}`,
    ...(input.lastVerifiedAt && { dateModified: input.lastVerifiedAt }),
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export function buildFaqSchema(entries: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((e) => ({
      '@type': 'Question',
      name: e.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: e.answer,
      },
    })),
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'STRLaws',
    url: SITE_URL,
    description: 'National database of US short-term-rental regulations covering all 50 states and 500+ cities.',
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'STRLaws',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface MetaTags {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
}

export function buildCityMeta(cityName: string, stateName: string, slug: string, monthYear: string): MetaTags {
  return {
    title: `Short-Term Rental Laws in ${cityName}, ${stateName} — Permit, Tax, Ban Status (Updated ${monthYear})`,
    description: `Current short-term rental regulations for ${cityName}, ${stateName}. Permit costs, occupancy caps, tax rates, and ban status — verified and updated.`,
    canonical: `${SITE_URL}${slug}`,
    ogImage: `${SITE_URL}/og${slug}.png`,
  };
}

export function buildStateMeta(stateName: string, slug: string): MetaTags {
  return {
    title: `Short-Term Rental Laws in ${stateName} — City-by-City Regulation Guide`,
    description: `Complete guide to short-term rental regulations across ${stateName}. Compare permit costs, taxes, and ban status by city.`,
    canonical: `${SITE_URL}${slug}`,
    ogImage: `${SITE_URL}/og${slug}.png`,
  };
}
