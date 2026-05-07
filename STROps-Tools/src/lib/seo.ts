/**
 * SEO library — stub. Full JSON-LD builders ship in Task 8.
 *
 * This file exists so Layout.astro can compile in Task 4. The Task 8
 * implementation expands `buildOrganization`, `buildWebApplication`,
 * `buildFAQPage`, `buildArticle`, and adds `canonical` / `ogImageFor`.
 */

export interface JsonLd {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

const SITE_URL = 'https://strops.tools';

export function buildOrganization(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'strops.tools',
    url: SITE_URL,
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
