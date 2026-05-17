/**
 * Tiered scrape orchestrator: tier-1 → tier-2 → tier-3 fallback.
 *
 * Phase 3 lands tier-1 only. Playwright + Firecrawl tiers ship later;
 * orchestrator already passes the right error shape through.
 */
import { ScrapeError, type ScrapeOptions, type ScrapeResult, type ScrapeTier } from './types';
import { scrapeWithFetch } from './fetch-cheerio';

export type ScrapeFn = (url: string, opts?: ScrapeOptions) => Promise<ScrapeResult>;

/**
 * Tier registry. Test code can replace entries to inject stubs without
 * touching the orchestrator.
 */
export const TIERS: Record<ScrapeTier, ScrapeFn | null> = {
  fetch_cheerio: scrapeWithFetch,
  playwright: null,
  firecrawl: null,
};

const DEFAULT_ORDER: ScrapeTier[] = ['fetch_cheerio', 'playwright', 'firecrawl'];

export interface OrchestratedScrapeResult extends ScrapeResult {
  /** Tiers attempted before success, in order. */
  attempts: ScrapeTier[];
}

export async function scrapeUrl(
  url: string,
  options: ScrapeOptions & { order?: ScrapeTier[] } = {},
): Promise<OrchestratedScrapeResult> {
  const order = options.order ?? DEFAULT_ORDER;
  const attempts: ScrapeTier[] = [];
  let lastError: unknown = null;

  for (const tier of order) {
    const fn = TIERS[tier];
    attempts.push(tier);
    if (!fn) {
      lastError = new ScrapeError(`tier ${tier} not configured`, tier);
      continue;
    }
    try {
      const result = await fn(url, options);
      return { ...result, attempts };
    } catch (err) {
      lastError = err;
    }
  }

  const message = lastError instanceof Error ? lastError.message : 'all tiers failed';
  const finalTier = attempts[attempts.length - 1] ?? 'fetch_cheerio';
  throw new ScrapeError(`all scrape tiers exhausted: ${message}`, finalTier);
}

export { ScrapeError } from './types';
export type { ScrapeResult, ScrapeOptions, ScrapeTier } from './types';
