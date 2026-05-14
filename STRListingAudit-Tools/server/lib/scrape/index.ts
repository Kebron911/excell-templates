/**
 * Scrape orchestrator — public entry point.
 *
 * Strategy:
 *   1. Try JSON-LD first (free, fast, no API spend). If complete, return it.
 *   2. If JSON-LD is missing or incomplete, fall back to the Apify provider.
 *   3. If JSON-LD has SOME data but Apify is unconfigured, return whatever
 *      JSON-LD gave us — better than failing the whole audit.
 *
 * Callers MUST handle a thrown error: missing API key, network error,
 * platform that JSON-LD can't reach AND Apify rejects.
 */

import {
  ApifyProvider,
  APIFY_COST_PER_RUN_USD,
  type ApifyClientOptions,
} from './apify';
import { JsonLdProvider, parseListingHtml } from './jsonld';
import type { ListingSnapshot, ScrapeResult } from './types';

export interface ScrapeOptions {
  /** Apify config; if omitted, the orchestrator runs JSON-LD only. */
  apify?: ApifyClientOptions;
  /** Inject providers for testing. */
  jsonLdProvider?: JsonLdProvider;
  apifyProvider?: ApifyProvider;
}

function isComplete(snapshot: ListingSnapshot): boolean {
  return (
    snapshot.title.length > 0 &&
    snapshot.description.length > 0 &&
    snapshot.photos.length >= 3 &&
    snapshot.amenities.length >= 3
  );
}

export async function fetchListingSnapshot(
  url: string,
  options: ScrapeOptions = {},
): Promise<ScrapeResult> {
  const jsonLd = options.jsonLdProvider ?? new JsonLdProvider();

  // Step 1 — try JSON-LD.
  let snapshot: ListingSnapshot | null = null;
  try {
    snapshot = await jsonLd.fetch(url);
  } catch {
    snapshot = null;
  }

  if (snapshot && isComplete(snapshot)) {
    return { snapshot, costUsd: 0 };
  }

  // Step 2 — fall back to Apify.
  const apifyOpts = options.apify;
  const apifyProvider =
    options.apifyProvider ?? (apifyOpts ? new ApifyProvider(apifyOpts) : null);

  if (!apifyProvider) {
    if (snapshot) {
      // Partial data is better than no data. Mark source as hybrid for telemetry.
      return { snapshot: { ...snapshot, source: 'hybrid' }, costUsd: 0 };
    }
    throw new Error('scrape_failed_no_provider');
  }

  const apifySnapshot = await apifyProvider.fetch(url);
  if (apifySnapshot) {
    // Prefer Apify but borrow JSON-LD fields it missed.
    const merged: ListingSnapshot = snapshot
      ? mergeSnapshots(apifySnapshot, snapshot)
      : apifySnapshot;
    return { snapshot: merged, costUsd: APIFY_COST_PER_RUN_USD };
  }

  if (snapshot) {
    return { snapshot: { ...snapshot, source: 'hybrid' }, costUsd: APIFY_COST_PER_RUN_USD };
  }
  throw new Error('scrape_failed_no_data');
}

/** Apify wins for primary fields; JSON-LD fills in any gaps. */
function mergeSnapshots(primary: ListingSnapshot, fallback: ListingSnapshot): ListingSnapshot {
  const pick = <K extends keyof ListingSnapshot>(key: K): ListingSnapshot[K] => {
    const v = primary[key];
    if (Array.isArray(v)) return (v.length > 0 ? v : fallback[key]) as ListingSnapshot[K];
    if (typeof v === 'string') return (v.length > 0 ? v : fallback[key]) as ListingSnapshot[K];
    return (v != null ? v : fallback[key]) as ListingSnapshot[K];
  };
  return {
    platform: primary.platform,
    url: primary.url,
    listingId: pick('listingId'),
    title: pick('title'),
    description: pick('description'),
    photos: pick('photos'),
    amenities: pick('amenities'),
    reviewSnippets: pick('reviewSnippets'),
    priceNight: pick('priceNight'),
    cleaningFee: pick('cleaningFee'),
    minNights: pick('minNights'),
    location: pick('location'),
    ratingAverage: pick('ratingAverage'),
    reviewCount: pick('reviewCount'),
    fetchedAt: primary.fetchedAt,
    source: 'hybrid',
  };
}

export { parseListingHtml };
export * from './types';
