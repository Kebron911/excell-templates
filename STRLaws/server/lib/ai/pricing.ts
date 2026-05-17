/**
 * Anthropic model pricing (USD per 1M tokens).
 *
 * Numbers should be kept in sync with Anthropic's pricing page. The cost
 * accumulator multiplies usage by these constants — overrides can be
 * supplied at call sites if Anthropic adjusts pricing mid-quarter.
 *
 * Cache pricing convention:
 *   - cache_write (5m TTL): 1.25× the base input rate
 *   - cache_read:           0.10× the base input rate
 *
 * For prompt caching to be cost-effective at our scale, every Claude call
 * MUST land cache_control markers on the stable parts of the prompt
 * (system + schema + examples). The "1-3k variable raw ordinance" should
 * be the only un-cached portion of the input.
 */

export type ClaudeModel = 'claude-haiku-4-5-20251001' | 'claude-opus-4-7';

export interface ModelPricing {
  /** USD per 1M input tokens (uncached). */
  inputUsdPerMTok: number;
  /** USD per 1M cache-write tokens. */
  cacheWriteUsdPerMTok: number;
  /** USD per 1M cache-read tokens. */
  cacheReadUsdPerMTok: number;
  /** USD per 1M output tokens. */
  outputUsdPerMTok: number;
}

export const PRICING: Record<ClaudeModel, ModelPricing> = {
  'claude-haiku-4-5-20251001': {
    inputUsdPerMTok: 1.0,
    cacheWriteUsdPerMTok: 1.25,
    cacheReadUsdPerMTok: 0.1,
    outputUsdPerMTok: 5.0,
  },
  'claude-opus-4-7': {
    inputUsdPerMTok: 15.0,
    cacheWriteUsdPerMTok: 18.75,
    cacheReadUsdPerMTok: 1.5,
    outputUsdPerMTok: 75.0,
  },
};

/** Hard per-snapshot ceiling (spec §7). Calls that would exceed it must abort. */
export const PER_SNAPSHOT_USD_CEILING = 0.05;
