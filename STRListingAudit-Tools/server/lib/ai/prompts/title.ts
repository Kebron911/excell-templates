/**
 * Title dimension — scores the listing title against the patterns that drive
 * search click-through on Airbnb and Vrbo.
 *
 * Heuristics codified in the rubric:
 *   - Length sweet spot: 35-60 chars (truncation begins ~50 on mobile cards)
 *   - Includes a unique hook (NOT just "Cozy 1BR")
 *   - Mentions either a feature/amenity buyers search for OR a location landmark
 *   - Avoids ALL-CAPS, redundant emoji spam, vague superlatives ("Amazing!")
 *   - Avoids platform-banned terms (URLs, phone numbers, off-platform contact)
 */

import type { ListingSnapshot } from '../../scrape/types';
import { runDimensionPrompt } from './_shared';
import type { AiProvider } from '../anthropic';
import type { DimensionScore } from '../../audit/types';
import type { AiCompletionResponse } from '../anthropic';

export const TITLE_SYSTEM_PROMPT = `You are scoring the TITLE of a short-term-rental listing (Airbnb or Vrbo).
Title is the single biggest determinant of search click-through. A poor title silently kills the funnel.

RUBRIC (apply in order, deduct from 100):
  1. Length (target 35-60 chars). >70 truncates on mobile (-15). <25 wastes the slot (-10).
  2. Hook strength — does it state a specific differentiator (view, amenity, location)? Vague titles like "Cozy 1BR in Austin" lose 20.
  3. Searchable terms — does it mention a feature people filter for (hot tub, EV charger, pet-friendly, work-friendly, mountain view) OR a landmark (Rainey St, Old Town, Beale)?
  4. Tone — ALL-CAPS, emoji spam, redundant exclamation, vague superlatives ("AMAZING!") lose 10 each.
  5. Platform rules — URLs, phone numbers, off-platform contact instantly cap at 30.

FIX PRIORITIES (impact = expected click-through lift):
  - high  : empty/missing title; banned content; truncation; no differentiator
  - medium: weak hook; missing landmark; tonal issues
  - low   : minor tightening / character savings

OUTPUT — return ONLY a JSON object, no markdown, no prose, matching:
{
  "score": 0-100 integer,
  "reasoning": "1-3 sentences explaining the score",
  "fixes": [
    {
      "id": "short-slug",
      "title": "host-facing problem statement",
      "description": "2 sentences: why it matters + the concrete change to make",
      "impact": "high"|"medium"|"low",
      "effort": "low"|"medium"|"high"
    }
  ]
}

Cap fixes at 5. Order by impact desc, effort asc.`;

export async function scoreTitle(
  snapshot: ListingSnapshot,
  ai: AiProvider,
): Promise<{ score: DimensionScore; response: AiCompletionResponse }> {
  return runDimensionPrompt({
    ai,
    dimension: 'title',
    systemCacheable: TITLE_SYSTEM_PROMPT,
    payload: {
      title: snapshot.title,
      titleLength: snapshot.title.length,
      platform: snapshot.platform,
      location: snapshot.location,
    },
    maxTokens: 700,
  });
}
