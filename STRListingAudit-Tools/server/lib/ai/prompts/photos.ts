/**
 * Photos dimension — v0.1 is METADATA-ONLY (no vision API calls).
 *
 * Scoring uses count, aspect ratios, cover-photo presence, and alt-text /
 * caption hints. Vision-based audit (cover quality, sequencing, missing shot
 * types via image content) lands in v0.2 paid tier where the budget allows it.
 */

import type { ListingSnapshot } from '../../scrape/types';
import { runDimensionPrompt } from './_shared';
import type { AiProvider } from '../anthropic';
import type { DimensionScore } from '../../audit/types';
import type { AiCompletionResponse } from '../anthropic';

export const PHOTOS_SYSTEM_PROMPT = `You are scoring a short-term-rental listing's PHOTO SET, using METADATA ONLY (count, aspect ratios, captions/alt text, ordering). You do NOT see the images themselves.

RUBRIC (apply in order, deduct from 100):
  1. Count — fewer than 15 photos is a major signal of low investment (-20 if <15, -35 if <8).
  2. Cover photo — first photo position 0 is the search-card thumbnail. Captions/alt mentioning "exterior" or "front" or that omit the "money shot" indicator (the room you sell) suggest a weak cover.
  3. Sequencing — captions/alt text should imply: cover → living → kitchen → bedrooms → bathrooms → outdoor → details. Disordered captions (bathroom 2nd, exterior last) lose 10.
  4. Aspect ratios — listing photos perform best at 3:2 or 4:3 horizontal. Many portrait/vertical photos (aspect < 1) suggest phone-shot photos (-10 if >30% of photos are portrait).
  5. Diversity — if photo captions repeat the same word ("Bedroom", "Bedroom", "Bedroom") it suggests missing shot types (-10).
  6. Missing shot types — based on amenities and captions, infer if any of: workspace, outdoor seating, kitchen, bathroom, view, neighborhood detail are entirely absent. Each missing common shot -5.

FIX PRIORITIES:
  - high  : <8 photos; cover photo appears weak (exterior-only first); no bedrooms shown
  - medium: <15 photos; disordered sequencing; no workspace shot when listing implies remote-work-friendly
  - low   : low caption diversity; minor aspect-ratio issues

OUTPUT — return ONLY a JSON object, no markdown, matching the standard dimension schema.

Cap fixes at 5. Order by impact desc, effort asc.`;

export async function scorePhotos(
  snapshot: ListingSnapshot,
  ai: AiProvider,
): Promise<{ score: DimensionScore; response: AiCompletionResponse }> {
  const captionedCount = snapshot.photos.filter((p) => p.alt && p.alt.length > 0).length;
  const portraitCount = snapshot.photos.filter(
    (p) => typeof p.aspect === 'number' && p.aspect < 1,
  ).length;

  return runDimensionPrompt({
    ai,
    dimension: 'photos',
    systemCacheable: PHOTOS_SYSTEM_PROMPT,
    payload: {
      totalCount: snapshot.photos.length,
      withCaption: captionedCount,
      portraitOrientationCount: portraitCount,
      coverPhoto: snapshot.photos[0]
        ? { alt: snapshot.photos[0].alt, aspect: snapshot.photos[0].aspect }
        : null,
      // Send only captions, not URLs — keeps tokens low, no vision intent.
      photoCaptions: snapshot.photos.slice(0, 30).map((p, i) => ({
        position: p.position ?? i,
        alt: p.alt ?? null,
      })),
      amenities: snapshot.amenities,
    },
    maxTokens: 800,
  });
}
