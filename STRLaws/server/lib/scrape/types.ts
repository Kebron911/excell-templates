/**
 * Shared types for the tiered scraping pipeline.
 *
 * Tier 1: native fetch + cheerio  (fast, free, ~80% of static city-code pages)
 * Tier 2: Playwright              (JS-rendered portals)
 * Tier 3: Firecrawl               (paywalls, bot challenges, anti-scrape)
 *
 * Each tier returns a ScrapeResult on success. Failures throw a ScrapeError
 * with `tier` set so the orchestrator can try the next tier.
 */

export type ScrapeTier = 'fetch_cheerio' | 'playwright' | 'firecrawl';

export interface ScrapeResult {
  url: string;
  tier: ScrapeTier;
  status: number;
  contentType: string | null;
  /** Cleaned, whitespace-normalized text body (HTML stripped). */
  text: string;
  /** Raw HTML if available (omitted for non-HTML responses). */
  html: string | null;
  /** SHA-256 hex hash of the cleaned text. Used for dedup against ordinance_snapshots.raw_text_hash. */
  hash: string;
  /** Page <title>, when present. */
  title: string | null;
  scrapedAt: string;
}

export class ScrapeError extends Error {
  readonly tier: ScrapeTier;
  override readonly cause?: unknown;

  constructor(message: string, tier: ScrapeTier, cause?: unknown) {
    super(message);
    this.name = 'ScrapeError';
    this.tier = tier;
    this.cause = cause;
  }
}

export interface ScrapeOptions {
  /** Per-request timeout in milliseconds. Default 15s. */
  timeoutMs?: number;
  /** User-Agent override. Defaults to identifying-but-polite STRLaws bot. */
  userAgent?: string;
  /** When false, treat non-2xx responses as success (some city sites return 403 for healthy bodies). */
  failOnNon2xx?: boolean;
}
