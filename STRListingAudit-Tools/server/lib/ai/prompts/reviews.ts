/**
 * Reviews dimension — scores recurring guest sentiment + recurring complaint themes.
 *
 * The rubric extracts themes (NOT individual quotes) and identifies the top
 * 1-2 friction patterns that show up across multiple reviews. Single-mention
 * complaints are ignored — only patterns of >=2 mentions matter.
 */

import type { ListingSnapshot } from '../../scrape/types';
import { runDimensionPrompt } from './_shared';
import type { AiProvider } from '../anthropic';
import type { DimensionScore } from '../../audit/types';
import type { AiCompletionResponse } from '../anthropic';

export const REVIEWS_SYSTEM_PROMPT = `You are scoring a short-term-rental listing's REVIEW SIGNAL — average rating, count, AND recurring complaint themes that appear in 2+ reviews.

RUBRIC (apply in order, deduct from 100):
  1. Average rating — 4.95+ is excellent; 4.8-4.94 is strong; 4.5-4.79 has friction; <4.5 indicates structural issues. Deduct in proportion (e.g. 4.6 -> -25).
  2. Review count — <10 is too thin to be trustworthy and triggers Airbnb's "new listing" deprioritization (-10). 10-30 is normal early-stage. 100+ is a strong moat.
  3. Recurring complaint themes — identify any complaint mentioned by 2+ reviewers. Common themes: cleanliness, communication latency, noise, AC/heat, photo-vs-reality, parking confusion, check-in friction. Each recurring theme -15.
  4. Praise themes — host should LEAN INTO themes the reviews praise (no deduction; surfaces as a fix recommendation to amplify in the description).
  5. Response cadence (NOT scoreable without host data — only flag if mentioned by guests as slow).

FIX PRIORITIES:
  - high  : recurring complaint themes (any 2+ mentions of the same issue)
  - medium: low review count (<10); average rating <4.8
  - low   : amplify praise themes into the description; respond to recent low-rated review

When recommending fixes for complaint themes, include the concrete operational change (e.g. "add white-noise machine to bedroom", "respond within 1 hr during business hours").

OUTPUT — return ONLY a JSON object, no markdown, matching the standard schema.

Cap fixes at 5. Order by impact desc, effort asc.`;

export async function scoreReviews(
  snapshot: ListingSnapshot,
  ai: AiProvider,
): Promise<{ score: DimensionScore; response: AiCompletionResponse }> {
  return runDimensionPrompt({
    ai,
    dimension: 'reviews',
    systemCacheable: REVIEWS_SYSTEM_PROMPT,
    payload: {
      ratingAverage: snapshot.ratingAverage,
      reviewCount: snapshot.reviewCount,
      // Truncate review texts upstream so the per-dim call stays cheap.
      recentReviews: snapshot.reviewSnippets.slice(0, 12).map((r) => ({
        date: r.date,
        rating: r.rating,
        text: r.text,
      })),
    },
    maxTokens: 900,
  });
}
