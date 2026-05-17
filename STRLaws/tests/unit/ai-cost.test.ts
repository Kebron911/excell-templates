import { describe, expect, it } from 'vitest';
import {
  CostAccumulator,
  CostExceededError,
  priceUsage,
} from '../../server/lib/ai/cost';
import { PER_SNAPSHOT_USD_CEILING, PRICING } from '../../server/lib/ai/pricing';

describe('priceUsage', () => {
  it('prices a pure-input call correctly for Haiku', () => {
    const cost = priceUsage('claude-haiku-4-5-20251001', {
      input_tokens: 1_000_000,
      output_tokens: 0,
    });
    expect(cost.inputUsd).toBeCloseTo(PRICING['claude-haiku-4-5-20251001'].inputUsdPerMTok, 5);
    expect(cost.totalUsd).toBeCloseTo(PRICING['claude-haiku-4-5-20251001'].inputUsdPerMTok, 5);
  });

  it('prices cache writes and reads at the right multipliers', () => {
    const cost = priceUsage('claude-haiku-4-5-20251001', {
      input_tokens: 0,
      cache_creation_input_tokens: 1_000_000,
      cache_read_input_tokens: 1_000_000,
      output_tokens: 0,
    });
    expect(cost.cacheWriteUsd).toBeCloseTo(1.25, 5);
    expect(cost.cacheReadUsd).toBeCloseTo(0.1, 5);
  });

  it('Opus is more expensive than Haiku for the same usage', () => {
    const usage = { input_tokens: 1000, output_tokens: 500 };
    const haiku = priceUsage('claude-haiku-4-5-20251001', usage);
    const opus = priceUsage('claude-opus-4-7', usage);
    expect(opus.totalUsd).toBeGreaterThan(haiku.totalUsd);
  });
});

describe('CostAccumulator', () => {
  it('records calls and totals correctly', () => {
    const acc = new CostAccumulator(1.0);
    acc.record('claude-haiku-4-5-20251001', { input_tokens: 1000, output_tokens: 500 });
    acc.record('claude-haiku-4-5-20251001', { input_tokens: 2000, output_tokens: 1000 });
    expect(acc.callCount).toBe(2);
    expect(acc.totalUsd).toBeGreaterThan(0);
  });

  it('uses the spec ceiling by default ($0.05)', () => {
    const acc = new CostAccumulator();
    expect(acc.ceilingUsd).toBe(PER_SNAPSHOT_USD_CEILING);
  });

  it('assertCanAfford passes when projected cost is under ceiling', () => {
    const acc = new CostAccumulator(0.05);
    expect(() =>
      acc.assertCanAfford('claude-haiku-4-5-20251001', { input_tokens: 1000, output_tokens: 500 }),
    ).not.toThrow();
  });

  it('assertCanAfford throws CostExceededError when projection blows ceiling', () => {
    const acc = new CostAccumulator(0.01);
    expect(() =>
      acc.assertCanAfford('claude-opus-4-7', { input_tokens: 100_000, output_tokens: 50_000 }),
    ).toThrow(CostExceededError);
  });

  it('accounts for prior calls when projecting (Haiku → Opus escalation budget)', () => {
    const acc = new CostAccumulator(0.05);
    // Haiku first pass uses a chunk of the budget
    acc.record('claude-haiku-4-5-20251001', {
      input_tokens: 5000,
      cache_creation_input_tokens: 3000,
      output_tokens: 2000,
    });
    // Then Opus retry against the same accumulator may overflow
    expect(() =>
      acc.assertCanAfford('claude-opus-4-7', { input_tokens: 5000, output_tokens: 2000 }),
    ).toThrow(CostExceededError);
  });

  it('CostExceededError carries projected and ceiling values for logging', () => {
    const acc = new CostAccumulator(0.001);
    try {
      acc.assertCanAfford('claude-opus-4-7', { input_tokens: 10_000, output_tokens: 5_000 });
      throw new Error('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(CostExceededError);
      const e = err as CostExceededError;
      expect(e.ceilingUsd).toBe(0.001);
      expect(e.projectedUsd).toBeGreaterThan(0.001);
    }
  });
});
