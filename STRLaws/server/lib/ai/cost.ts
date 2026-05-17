/**
 * Per-snapshot cost accumulator with hard ceiling enforcement.
 *
 * One accumulator instance per ordinance snapshot extraction. Calls increment
 * usage; helpers project cost before a hypothetical next call so the caller
 * can bail before the API ever sees the request.
 */
import { PRICING, PER_SNAPSHOT_USD_CEILING, type ClaudeModel, type ModelPricing } from './pricing';

export interface UsagePayload {
  /** Uncached input tokens billed at the model's input rate. */
  input_tokens: number;
  /** Tokens written to the prompt cache (5-min TTL). */
  cache_creation_input_tokens?: number;
  /** Tokens read from the prompt cache. */
  cache_read_input_tokens?: number;
  /** Output tokens. */
  output_tokens: number;
}

export interface CostBreakdown {
  inputUsd: number;
  cacheWriteUsd: number;
  cacheReadUsd: number;
  outputUsd: number;
  totalUsd: number;
}

export class CostExceededError extends Error {
  constructor(
    message: string,
    public readonly projectedUsd: number,
    public readonly ceilingUsd: number,
  ) {
    super(message);
    this.name = 'CostExceededError';
  }
}

export function priceUsage(model: ClaudeModel, usage: UsagePayload, override?: ModelPricing): CostBreakdown {
  const p = override ?? PRICING[model];
  const inputUsd = (usage.input_tokens * p.inputUsdPerMTok) / 1_000_000;
  const cacheWriteUsd = ((usage.cache_creation_input_tokens ?? 0) * p.cacheWriteUsdPerMTok) / 1_000_000;
  const cacheReadUsd = ((usage.cache_read_input_tokens ?? 0) * p.cacheReadUsdPerMTok) / 1_000_000;
  const outputUsd = (usage.output_tokens * p.outputUsdPerMTok) / 1_000_000;
  return {
    inputUsd,
    cacheWriteUsd,
    cacheReadUsd,
    outputUsd,
    totalUsd: inputUsd + cacheWriteUsd + cacheReadUsd + outputUsd,
  };
}

export class CostAccumulator {
  private readonly entries: Array<{ model: ClaudeModel; usage: UsagePayload; cost: CostBreakdown }> = [];
  readonly ceilingUsd: number;

  constructor(ceilingUsd = PER_SNAPSHOT_USD_CEILING) {
    this.ceilingUsd = ceilingUsd;
  }

  record(model: ClaudeModel, usage: UsagePayload): CostBreakdown {
    const cost = priceUsage(model, usage);
    this.entries.push({ model, usage, cost });
    return cost;
  }

  get totalUsd(): number {
    return this.entries.reduce((sum, e) => sum + e.cost.totalUsd, 0);
  }

  get callCount(): number {
    return this.entries.length;
  }

  /**
   * Project the cost of a hypothetical next call (estimated tokens).
   * Throws CostExceededError if projected total would exceed ceiling.
   * Use BEFORE issuing the API call.
   */
  assertCanAfford(model: ClaudeModel, estimatedUsage: UsagePayload): void {
    const projected = priceUsage(model, estimatedUsage);
    const projectedTotal = this.totalUsd + projected.totalUsd;
    if (projectedTotal > this.ceilingUsd) {
      throw new CostExceededError(
        `Projected snapshot cost $${projectedTotal.toFixed(5)} exceeds ceiling $${this.ceilingUsd.toFixed(5)}`,
        projectedTotal,
        this.ceilingUsd,
      );
    }
  }

  summary(): { totalUsd: number; callCount: number; perCall: CostBreakdown[] } {
    return {
      totalUsd: this.totalUsd,
      callCount: this.callCount,
      perCall: this.entries.map((e) => e.cost),
    };
  }
}
