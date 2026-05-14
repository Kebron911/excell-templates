/**
 * Phase 3 scorecard pipeline tests.
 *
 * Verifies the end-to-end audit pipeline:
 *   ListingSnapshot → 5 parallel Haiku per-dim calls → 1 Sonnet synth call → AuditResult
 *
 * No live AI calls. Uses MockAiProvider/RealisticMockAiProvider helpers.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { scoreListingSnapshot } from '../lib/audit/scorecard';
import { runSynthesizer } from '../lib/ai/prompts/synthesizer';
import { MockAiProvider, RealisticMockAiProvider } from './helpers/mock-ai';
import type { ListingSnapshot } from '../lib/scrape/types';

const here = dirname(fileURLToPath(import.meta.url));
const fixtures = JSON.parse(
  readFileSync(resolve(here, 'fixtures/scorecard-snapshots.json'), 'utf-8'),
);

describe('scoreListingSnapshot — orchestrator', () => {
  for (const fx of fixtures.fixtures as Array<{
    name: string;
    snapshot: ListingSnapshot;
    expectedScoreBand: { min: number; max: number };
  }>) {
    it(`produces a valid scorecard for ${fx.name}`, async () => {
      const ai = new RealisticMockAiProvider();
      const { result, cost } = await scoreListingSnapshot(fx.snapshot, ai);

      // Structure assertions
      expect(result.scores).toHaveLength(5);
      const dims = result.scores.map((s) => s.dimension).sort();
      expect(dims).toEqual(['amenities', 'description', 'photos', 'reviews', 'title']);
      for (const s of result.scores) {
        expect(s.score).toBeGreaterThanOrEqual(0);
        expect(s.score).toBeLessThanOrEqual(100);
        expect(s.reasoning.length).toBeGreaterThan(0);
      }
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);

      // Top fixes: 1-5, no duplicate ids, every id maps to a known dim fix
      expect(result.topFixes.length).toBeGreaterThan(0);
      expect(result.topFixes.length).toBeLessThanOrEqual(5);
      const ids = result.topFixes.map((f) => f.id);
      expect(new Set(ids).size).toBe(ids.length);

      // Score band assertion — strong fixtures should land high, weak fixtures low.
      expect(result.overallScore).toBeGreaterThanOrEqual(fx.expectedScoreBand.min);
      expect(result.overallScore).toBeLessThanOrEqual(fx.expectedScoreBand.max);

      // Cost breakdown is well-formed
      expect(cost.perDim).toHaveLength(5);
      expect(cost.totalCostUsd).toBeGreaterThan(0);
      expect(cost.total.outputTokens).toBeGreaterThan(0);
    });
  }
});

describe('synthesizer — deterministic fallback when no AI response', () => {
  it('still picks top 5 fixes when the AI returns malformed JSON', async () => {
    const broken = {
      async complete() {
        return {
          text: 'not valid json at all',
          model: 'claude-sonnet-4-5' as const,
          usage: { inputTokens: 100, outputTokens: 50, cacheReadTokens: 0, cacheWriteTokens: 0 },
        };
      },
    };
    const scores = [
      {
        dimension: 'title' as const,
        score: 40,
        reasoning: 'weak',
        fixes: [
          {
            id: 'title:add-location',
            dimension: 'title' as const,
            title: 'add location',
            description: 'add city name to title',
            impact: 'high' as const,
            effort: 'low' as const,
          },
        ],
      },
      {
        dimension: 'photos' as const,
        score: 30,
        reasoning: 'few photos',
        fixes: [
          {
            id: 'photos:add-more',
            dimension: 'photos' as const,
            title: 'add more photos',
            description: 'aim for 20+',
            impact: 'high' as const,
            effort: 'medium' as const,
          },
        ],
      },
    ];
    const { result } = await runSynthesizer({ scores }, broken);
    expect(result.topFixes.length).toBeGreaterThan(0);
    expect(result.summary).toContain('synthesizer');
  });
});

describe('MockAiProvider — sanity', () => {
  it('produces a high score for a strong listing on the title dimension', async () => {
    const ai = new MockAiProvider();
    const res = await ai.complete({
      model: 'claude-haiku-4-5',
      systemCacheable: 'rubric',
      userMessage: `Listing data for the title dimension:\n\n${JSON.stringify({
        title: 'Modern Loft in East Austin — Walk to Rainey Street',
        titleLength: 51,
      })}`,
      maxTokens: 700,
    });
    const parsed = JSON.parse(res.text);
    expect(parsed.score).toBeGreaterThanOrEqual(70);
  });

  it('produces a low score for a weak listing on the title dimension', async () => {
    const ai = new MockAiProvider();
    const res = await ai.complete({
      model: 'claude-haiku-4-5',
      systemCacheable: 'rubric',
      userMessage: `Listing data for the title dimension:\n\n${JSON.stringify({
        title: 'Cabin',
        titleLength: 5,
      })}`,
      maxTokens: 700,
    });
    const parsed = JSON.parse(res.text);
    expect(parsed.score).toBeLessThan(30);
  });
});
