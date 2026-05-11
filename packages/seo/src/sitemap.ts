import type { SiteConfig } from './site-config.js';

/**
 * Returns the sitemap URL list configured in siteConfig.url.sitemap.
 *
 * This is a thin accessor — the actual sitemap generation is handled by
 * @astrojs/sitemap in each app. This helper lets components/pages read
 * the declared URL list for programmatic use (e.g., ItemList JSON-LD).
 *
 * Returns an empty array when sitemap is not configured.
 */
export function getSitemapUrls(siteConfig: SiteConfig): string[] {
  return siteConfig.url.sitemap ? [...siteConfig.url.sitemap] : [];
}
