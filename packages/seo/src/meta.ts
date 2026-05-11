import type { SiteConfig } from './site-config.js';

/**
 * Returns the canonical URL for a path, relative to the site's canonical base.
 *
 * Convention: trailing slash on every non-root path to match @astrojs/sitemap output.
 * Query strings and fragments are preserved after the trailing slash.
 *
 * Source: STRHost variant (most correct — strips query/hash before slash-appending).
 */
export function canonical(siteConfig: SiteConfig, path: string): string {
  const base = siteConfig.url.canonical;
  // Treat empty string as root
  let cleaned = path === '' ? '/' : path.startsWith('/') ? path : `/${path}`;
  if (cleaned === '/') return `${base}/`;
  // Strip query/hash before adding trailing slash, then re-append.
  const parts = cleaned.split(/(?=[?#])/);
  const pathOnly = parts[0] ?? '/';
  const rest = parts.slice(1);
  const withSlash = pathOnly.endsWith('/') ? pathOnly : `${pathOnly}/`;
  return `${base}${withSlash}${rest.join('')}`;
}

/**
 * Returns the OG image URL for a path.
 *
 * The build-time Satori generator writes PNGs to:
 *   public/og/index.png               root
 *   public/og/{slug}.png              top-level routes
 *   public/og/cities/{slug}.png       city pages (buyers site only)
 *   public/og/default.png             fallback
 *
 * Source: STRBuyers variant (includes city-pages special case).
 */
export function ogImageFor(siteConfig: SiteConfig, path: string): string {
  const base = siteConfig.url.canonical;
  if (path === '/' || path === '') {
    return `${base}/og/index.png`;
  }
  // City pages on the buyers site get their own /og/cities/ directory.
  if (siteConfig.siteId === 'buyers') {
    const cityMatch = path.match(/^\/cities\/([^/]+)\/?$/);
    if (cityMatch) {
      return `${base}/og/cities/${cityMatch[1]}.png`;
    }
  }
  // Top-level and nested pages: strip leading/trailing slashes, join with '-'.
  const slug = path.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '-');
  return `${base}/og/${slug}.png`;
}
