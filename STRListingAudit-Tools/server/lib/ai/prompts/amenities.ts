/**
 * Amenities dimension — scores against the amenities that filter-search hosts.
 *
 * The rubric focuses on "filters that segment buyers" — wifi, parking, AC,
 * workspace, washer, kitchen, pet-friendly, hot tub, EV charger. Missing
 * common-filter amenities (when present in the property) is the biggest fix.
 */

import type { ListingSnapshot } from '../../scrape/types';
import { runDimensionPrompt } from './_shared';
import type { AiProvider } from '../anthropic';
import type { DimensionScore } from '../../audit/types';
import type { AiCompletionResponse } from '../anthropic';

export const AMENITIES_SYSTEM_PROMPT = `You are scoring a short-term-rental listing's AMENITIES list against the search-filter taxonomy used by Airbnb and Vrbo. Listing amenities that are NOT checked on the platform-side filter cause your listing to disappear from those searches.

RUBRIC (apply in order, deduct from 100):
  1. Search-filter staples (each missing -8): Wifi, Kitchen, Parking, Air conditioning OR Heating, TV, Washer, Hair dryer.
  2. Differentiator filters (-12 each if implied by the description but missing from amenities): Hot tub, Pool, EV charger, Pet-friendly, Workspace/Dedicated workspace, Fireplace, Beach access, Mountain view, Self check-in, Pack-n-play/crib.
  3. Safety + trust filters (each missing -10): Smoke alarm, Carbon monoxide alarm, First aid kit, Fire extinguisher. Not all platforms surface these — only flag if amenity surface includes safety category at all.
  4. Top-line count — fewer than 15 amenities total is suspiciously thin (-10), <8 is a major signal of low effort (-25).
  5. Specificity — bare strings like "Wifi" vs "Fast wifi — 250 Mbps" leave conversion on the table. Note but don't deduct heavily (only -5).

FIX PRIORITIES:
  - high  : missing search-filter staples; missing differentiator filters when the property clearly has them
  - medium: top-line count below 15; missing safety amenities
  - low   : add specificity (speeds, brand, square footage of feature)

OUTPUT — return ONLY a JSON object, no markdown, matching the standard schema.

Cap fixes at 5. Order by impact desc, effort asc.`;

export async function scoreAmenities(
  snapshot: ListingSnapshot,
  ai: AiProvider,
): Promise<{ score: DimensionScore; response: AiCompletionResponse }> {
  return runDimensionPrompt({
    ai,
    dimension: 'amenities',
    systemCacheable: AMENITIES_SYSTEM_PROMPT,
    payload: {
      amenities: snapshot.amenities,
      amenityCount: snapshot.amenities.length,
      title: snapshot.title,
      description: snapshot.description,
    },
    maxTokens: 800,
  });
}
