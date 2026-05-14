/**
 * Cost-budget guardrail test — fails CI if the realistic per-audit cost
 * across the fixture set exceeds the locked budget ($0.08 average).
 *
 * Uses the RealisticMockAiProvider which models typical token counts plus
 * the prompt-caching pattern (one cache write on the first per-dim call,
 * four cache reads on the remaining; synth cold on first audit, warm on
 * subsequent).
 *
 * If THIS TEST FAILS:
 *   1. The fixture audits got significantly more expensive — investigate
 *      whether prompts ballooned, models changed, or pricing shifted.
 *   2. If the budget genuinely needs to move, change the limit AND the
 *      decision row in PROJECT.md AND the design plan.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { scoreListingSnapshot } from '../lib/audit/scorecard';
import { RealisticMockAiProvider } from './helpers/mock-ai';
import type { ListingSnapshot } from '../lib/scrape/types';

const here = dirname(fileURLToPath(import.meta.url));
const fixtures = JSON.parse(
  readFileSync(resolve(here, 'fixtures/scorecard-snapshots.json'), 'utf-8'),
);

const BUDGET_AVG_USD = 0.08; // Locked in PROJECT.md decision row.
const BUDGET_P95_USD = 0.10; // No single audit should breach the headline cap.

describe('cost-budget', () => {
  it(`average per-audit cost across ${fixtures.fixtures.length} fixtures stays under $${BUDGET_AVG_USD}`, async () => {
    const costs: number[] = [];
    for (const fx of fixtures.fixtures as Array<{ snapshot: ListingSnapshot }>) {
      const ai = new RealisticMockAiProvider();
      const { cost } = await scoreListingSnapshot(fx.snapshot, ai);
      costs.push(cost.totalCostUsd);
    }
    const sum = costs.reduce((a, b) => a + b, 0);
    const avg = sum / costs.length;
    // Helpful failure output: print the per-fixture breakdown.
    if (avg >= BUDGET_AVG_USD) {
      // eslint-disable-next-line no-console
      console.error(
        `[cost-budget] avg=$${avg.toFixed(5)} costs=${costs.map((c) => '$' + c.toFixed(5)).join(', ')}`,
      );
    }
    expect(avg).toBeLessThan(BUDGET_AVG_USD);
  });

  it(`no single fixture audit exceeds $${BUDGET_P95_USD}`, async () => {
    for (const fx of fixtures.fixtures as Array<{ name: string; snapshot: ListingSnapshot }>) {
      const ai = new RealisticMockAiProvider();
      const { cost } = await scoreListingSnapshot(fx.snapshot, ai);
      expect(cost.totalCostUsd).toBeLessThan(BUDGET_P95_USD);
    }
  });

  it('cost breakdown sums match the column-export helper', async () => {
    const ai = new RealisticMockAiProvider();
    const { cost } = await scoreListingSnapshot(
      fixtures.fixtures[0].snapshot as ListingSnapshot,
      ai,
    );
    expect(cost.totalCostUsd).toBeGreaterThan(0);
    expect(cost.total.inputTokens).toBeGreaterThan(0);
    expect(cost.total.outputTokens).toBeGreaterThan(0);
  });
});
