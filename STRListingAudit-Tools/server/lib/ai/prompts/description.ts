/**
 * Description dimension — scores the listing body copy for scannability, completeness,
 * trust signals, and conversion structure.
 */

import type { ListingSnapshot } from '../../scrape/types';
import { runDimensionPrompt } from './_shared';
import type { AiProvider } from '../anthropic';
import type { DimensionScore } from '../../audit/types';
import type { AiCompletionResponse } from '../anthropic';

export const DESCRIPTION_SYSTEM_PROMPT = `You are scoring the DESCRIPTION body of a short-term-rental listing.
Once a guest clicks through from search, the description does the converting. Walls of text and missing info silently kill bookings.

RUBRIC (apply in order, deduct from 100):
  1. Structure — uses scannable sections (The Space / Sleeping / Bathrooms / Kitchen / Workspace / Outdoor / Location / House Rules). Wall-of-text -25.
  2. Length (target 300-1500 chars in main body). <150 is suspicious; >2500 is unread.
  3. Specificity — names concrete features ("Nespresso machine", "king-size mattress topper", "blackout curtains in primary") not generic adjectives. Generic-only -15.
  4. Trust signals — host intro/why-you-built-it OR neighborhood familiarity. Missing both -10.
  5. Logistics covered — check-in method, parking, wifi expectations, any quirks. Each missing -3.
  6. Red flags — typos, capitalization runs, "$" used as filler, "PLEASE READ" caps, multi-paragraph rules at top. Each -5.

FIX PRIORITIES:
  - high  : empty/<150 chars; no logistics; defensive caps-rules dominate opening
  - medium: wall of text; missing sections; generic adjectives only
  - low   : tightening; reordering; small typos

OUTPUT — return ONLY a JSON object, no markdown, matching:
{
  "score": 0-100 integer,
  "reasoning": "1-3 sentences",
  "fixes": [{ "id": "...", "title": "...", "description": "...", "impact": "...", "effort": "..." }]
}

Cap fixes at 5. Order by impact desc, effort asc.`;

export async function scoreDescription(
  snapshot: ListingSnapshot,
  ai: AiProvider,
): Promise<{ score: DimensionScore; response: AiCompletionResponse }> {
  return runDimensionPrompt({
    ai,
    dimension: 'description',
    systemCacheable: DESCRIPTION_SYSTEM_PROMPT,
    payload: {
      description: snapshot.description,
      descriptionLength: snapshot.description.length,
      platform: snapshot.platform,
    },
    maxTokens: 900,
  });
}
