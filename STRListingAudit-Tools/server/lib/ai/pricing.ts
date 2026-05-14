/**
 * Anthropic Claude pricing table — USD per million tokens.
 *
 * **Verify against https://www.anthropic.com/pricing before each release.**
 * Stored as code so cost-tracker is deterministic in tests and so we can
 * grep for "claude-haiku-4-5" to find every spot that touches model selection.
 *
 * Cache read tokens are billed at ~10% of input. Cache writes are ~25% above
 * input (one-time amortization). See:
 *   https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching#pricing
 */

export interface ModelPrice {
  /** Cost per million standard input tokens. */
  inputPerM: number;
  /** Cost per million output tokens. */
  outputPerM: number;
  /** Cost per million cache-read input tokens. */
  cacheReadPerM: number;
  /** Cost per million cache-write (creation) input tokens. */
  cacheWritePerM: number;
}

export type ModelId =
  | 'claude-sonnet-4-5'
  | 'claude-haiku-4-5';

export const ANTHROPIC_PRICING: Record<ModelId, ModelPrice> = {
  // Sonnet 4.5 — synthesizer model (premium reasoning for top-5 fix selection).
  'claude-sonnet-4-5': {
    inputPerM: 3.0,
    outputPerM: 15.0,
    cacheReadPerM: 0.30,
    cacheWritePerM: 3.75,
  },
  // Haiku 4.5 — per-dimension scoring model (cheap, fast, runs in parallel).
  'claude-haiku-4-5': {
    inputPerM: 1.0,
    outputPerM: 5.0,
    cacheReadPerM: 0.10,
    cacheWritePerM: 1.25,
  },
};

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
}

/** Computes USD cost from token counts and a model-id. Result rounded to 5 dp. */
export function computeCostUsd(model: ModelId, usage: TokenUsage): number {
  const p = ANTHROPIC_PRICING[model];
  const cost =
    (usage.inputTokens * p.inputPerM) / 1_000_000 +
    (usage.outputTokens * p.outputPerM) / 1_000_000 +
    (usage.cacheReadTokens * p.cacheReadPerM) / 1_000_000 +
    (usage.cacheWriteTokens * p.cacheWritePerM) / 1_000_000;
  return Math.round(cost * 100_000) / 100_000;
}

/** Aggregates many TokenUsages into one — used by cost-tracker to sum a full audit. */
export function addUsage(a: TokenUsage, b: TokenUsage): TokenUsage {
  return {
    inputTokens: a.inputTokens + b.inputTokens,
    outputTokens: a.outputTokens + b.outputTokens,
    cacheReadTokens: a.cacheReadTokens + b.cacheReadTokens,
    cacheWriteTokens: a.cacheWriteTokens + b.cacheWriteTokens,
  };
}

export const ZERO_USAGE: TokenUsage = {
  inputTokens: 0,
  outputTokens: 0,
  cacheReadTokens: 0,
  cacheWriteTokens: 0,
};
