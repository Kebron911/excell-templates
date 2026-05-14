/**
 * Public entry point for the AI scoring pipeline.
 *
 *   scoreListingSnapshot(snapshot, ai) → { result, cost }
 *
 * Strategy:
 *   1. Run the 5 per-dim Haiku calls in PARALLEL (Promise.all). Each takes
 *      ~1.5-3s, so 5 in parallel is roughly the duration of one + jitter.
 *   2. Pass the 5 DimensionScores to the Sonnet synthesizer for the top-5
 *      fix selection + summary.
 *   3. Aggregate every call's TokenUsage into an AuditCostBreakdown.
 *
 * The audit endpoint (Phase 4) wraps this with: rate-limit → DB insert →
 * call this → DB update with scores + fixes + cost + share image path.
 */

import type { ListingSnapshot } from '../scrape/types';
import type { AiProvider } from '../ai/anthropic';
import type { AuditCostBreakdown, AuditResult, DimensionScore } from './types';
import { PER_DIM_MODEL, SYNTH_MODEL } from '../ai/prompts/_shared';
import { scoreTitle } from '../ai/prompts/title';
import { scoreDescription } from '../ai/prompts/description';
import { scorePhotos } from '../ai/prompts/photos';
import { scoreAmenities } from '../ai/prompts/amenities';
import { scoreReviews } from '../ai/prompts/reviews';
import { runSynthesizer } from '../ai/prompts/synthesizer';
import { summarizeCost } from './cost-tracker';

export interface ScorecardOutcome {
  result: AuditResult;
  cost: AuditCostBreakdown;
}

export async function scoreListingSnapshot(
  snapshot: ListingSnapshot,
  ai: AiProvider,
): Promise<ScorecardOutcome> {
  const [titleOut, descOut, photosOut, amenitiesOut, reviewsOut] = await Promise.all([
    scoreTitle(snapshot, ai),
    scoreDescription(snapshot, ai),
    scorePhotos(snapshot, ai),
    scoreAmenities(snapshot, ai),
    scoreReviews(snapshot, ai),
  ]);

  const scores: DimensionScore[] = [
    titleOut.score,
    descOut.score,
    photosOut.score,
    amenitiesOut.score,
    reviewsOut.score,
  ];

  const { result: synthResult, response: synthResponse } = await runSynthesizer({ scores }, ai);

  const cost = summarizeCost({
    perDim: [
      { model: PER_DIM_MODEL, usage: titleOut.response.usage },
      { model: PER_DIM_MODEL, usage: descOut.response.usage },
      { model: PER_DIM_MODEL, usage: photosOut.response.usage },
      { model: PER_DIM_MODEL, usage: amenitiesOut.response.usage },
      { model: PER_DIM_MODEL, usage: reviewsOut.response.usage },
    ],
    synth: { model: SYNTH_MODEL, usage: synthResponse.usage },
  });

  const result: AuditResult = {
    scores,
    overallScore: synthResult.overallScore,
    topFixes: synthResult.topFixes,
    summary: synthResult.summary,
  };

  return { result, cost };
}
