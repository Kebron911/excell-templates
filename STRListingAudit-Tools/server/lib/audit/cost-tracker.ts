/**
 * Aggregates token usage across the audit pipeline and emits the audit_runs
 * cost columns the database expects.
 *
 * Lives outside scorecard.ts so the audit endpoint can also persist the
 * full breakdown to the DB without re-importing scorecard internals.
 */

import { addUsage, computeCostUsd, ZERO_USAGE, type TokenUsage, type ModelId } from '../ai/pricing';
import type { AuditCostBreakdown } from './types';

export interface PipelineCostInput {
  perDim: Array<{ model: ModelId; usage: TokenUsage }>;
  synth: { model: ModelId; usage: TokenUsage };
}

export function summarizeCost(input: PipelineCostInput): AuditCostBreakdown {
  const perDimUsages = input.perDim.map((d) => d.usage);
  const total = [...perDimUsages, input.synth.usage].reduce((acc, u) => addUsage(acc, u), ZERO_USAGE);
  const perDimCost = input.perDim.reduce((acc, d) => acc + computeCostUsd(d.model, d.usage), 0);
  const synthCost = computeCostUsd(input.synth.model, input.synth.usage);
  const totalCostUsd = Math.round((perDimCost + synthCost) * 100_000) / 100_000;

  return {
    perDim: perDimUsages,
    synth: input.synth.usage,
    total,
    totalCostUsd,
  };
}

/** Row shape for `INSERT INTO audit_runs(... anthropic_*, total_cost_usd)`. */
export function toAuditRunsCostColumns(cost: AuditCostBreakdown) {
  return {
    anthropic_input_tokens: cost.total.inputTokens,
    anthropic_output_tokens: cost.total.outputTokens,
    anthropic_cache_read_tokens: cost.total.cacheReadTokens,
    anthropic_cache_write_tokens: cost.total.cacheWriteTokens,
    total_cost_usd: cost.totalCostUsd,
  };
}
