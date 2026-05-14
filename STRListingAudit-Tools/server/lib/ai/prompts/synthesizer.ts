/**
 * Synthesizer — Sonnet-tier call that ingests the 5 per-dimension outputs and
 * selects the TOP 5 fixes across all dimensions ranked by impact × inverse-effort.
 *
 * Also produces the host-facing one-paragraph executive summary that goes at
 * the top of the result page + the share image.
 */

import { z } from 'zod';
import type { AiProvider } from '../anthropic';
import type { AiCompletionResponse } from '../anthropic';
import { SYNTH_MODEL, parseModelJson } from './_shared';
import type { DimensionScore, Fix } from '../../audit/types';

const SynthSchema = z.object({
  summary: z.string().min(20),
  topFixIds: z.array(z.string()).min(1).max(5),
});

export const SYNTHESIZER_SYSTEM_PROMPT = `You are the synthesizer for a 5-dimension short-term-rental listing audit. You receive the per-dimension scores + every dimension's proposed fixes.

YOUR JOB:
  1. Write a one-paragraph (3-5 sentence) executive summary for the host. Specific, no fluff, no superlatives. Mention the strongest dimension and the weakest. End with the single most leveraged fix to attempt first.
  2. Select the TOP 5 fixes out of all proposed fixes, ranked by impact × (1 / effort).
     - Prefer one fix per dimension when possible.
     - Never include two fixes that target the same change.
     - "high impact, low effort" beats everything.
     - "low impact, high effort" never makes the top 5.

OUTPUT — return ONLY a JSON object, no markdown, matching:
{
  "summary": "3-5 sentence executive summary aimed at the host",
  "topFixIds": ["dimension:slug", "dimension:slug", ...]   // exactly 5, in priority order
}

The ids MUST match ids that exist in the input.`;

export interface SynthesizerInput {
  scores: DimensionScore[];
}

export interface SynthesizerResult {
  summary: string;
  topFixes: Fix[];
  overallScore: number;
}

/** Weighted average. Weights tuned to match scorecard hero priority: title/photos heavy. */
const DIMENSION_WEIGHTS: Record<string, number> = {
  title: 1.2,
  description: 1.0,
  photos: 1.3,
  amenities: 0.9,
  reviews: 1.1,
};

function computeOverallScore(scores: DimensionScore[]): number {
  const weighted = scores.reduce((acc, s) => acc + s.score * (DIMENSION_WEIGHTS[s.dimension] ?? 1), 0);
  const totalWeight = scores.reduce((acc, s) => acc + (DIMENSION_WEIGHTS[s.dimension] ?? 1), 0);
  return Math.round(weighted / totalWeight);
}

export async function runSynthesizer(
  input: SynthesizerInput,
  ai: AiProvider,
): Promise<{ result: SynthesizerResult; response: AiCompletionResponse }> {
  const allFixes: Fix[] = input.scores.flatMap((s) => s.fixes);
  const payload = {
    scores: input.scores.map((s) => ({
      dimension: s.dimension,
      score: s.score,
      reasoning: s.reasoning,
    })),
    fixes: allFixes.map((f) => ({
      id: f.id,
      dimension: f.dimension,
      title: f.title,
      description: f.description,
      impact: f.impact,
      effort: f.effort,
    })),
  };

  const response = await ai.complete({
    model: SYNTH_MODEL,
    systemCacheable: SYNTHESIZER_SYSTEM_PROMPT,
    userMessage: JSON.stringify(payload, null, 2),
    maxTokens: 1200,
  });

  let synth: z.infer<typeof SynthSchema>;
  try {
    synth = SynthSchema.parse(parseModelJson(response.text));
  } catch {
    // Soft-fail: pick the highest-impact 5 fixes deterministically.
    synth = {
      summary:
        'Audit complete. The synthesizer fell back to deterministic top-5 selection — operator should inspect logs.',
      topFixIds: allFixes
        .slice()
        .sort((a, b) => impactWeight(b.impact) - impactWeight(a.impact))
        .slice(0, 5)
        .map((f) => f.id),
    };
  }

  const byId = new Map(allFixes.map((f) => [f.id, f]));
  const topFixes = synth.topFixIds
    .map((id) => byId.get(id))
    .filter((f): f is Fix => f != null)
    .slice(0, 5);

  return {
    result: {
      summary: synth.summary,
      topFixes,
      overallScore: computeOverallScore(input.scores),
    },
    response,
  };
}

function impactWeight(i: Fix['impact']): number {
  return i === 'high' ? 3 : i === 'medium' ? 2 : 1;
}
