/**
 * Apify scrape fallback — Step 2 of the scrape pipeline.
 *
 * Invoked by the orchestrator when JSON-LD is missing or incomplete.
 *
 * Uses the synchronous "run-sync-get-dataset-items" endpoint so we get
 * the parsed listing in one HTTP call without orchestrating a webhook.
 * Default actor: `tri_angle/airbnb-scraper` (configurable via env).
 *
 * Cost: ~$0.001-0.005 per URL on the default actor's pricing.
 */

import type { ListingPhoto, ListingSnapshot, Platform, ScrapeProvider } from './types';
import { detectPlatform, extractListingId } from './jsonld';

const APIFY_BASE = 'https://api.apify.com/v2';

interface ApifyAirbnbItem {
  name?: string;
  title?: string;
  description?: string;
  primaryHost?: { firstName?: string };
  starRating?: number;
  numberOfReviews?: number;
  reviewsCount?: number;
  reviews?: Array<{
    reviewerFirstName?: string;
    author?: string;
    createdAt?: string;
    rating?: number;
    comments?: string;
    text?: string;
  }>;
  photos?: Array<{ pictureUrl?: string; url?: string; caption?: string; aspectRatio?: number }>;
  images?: string[];
  amenities?: Array<{ title?: string; name?: string } | string>;
  price?: { rate?: number; currency?: string };
  pricePerNight?: number;
  cleaningFee?: number;
  minNights?: number;
  minimumStay?: number;
  location?: { city?: string; state?: string; country?: string };
  address?: string;
}

function mapAmenities(raw: ApifyAirbnbItem['amenities']): string[] {
  if (!raw) return [];
  return raw
    .map((a) => (typeof a === 'string' ? a : (a.title ?? a.name ?? '')))
    .filter((s) => s.length > 0);
}

function mapPhotos(raw: ApifyAirbnbItem): ListingPhoto[] {
  if (raw.photos?.length) {
    return raw.photos
      .map((p, i): ListingPhoto | null => {
        const url = p.pictureUrl ?? p.url;
        if (!url) return null;
        return { url, alt: p.caption, position: i, aspect: p.aspectRatio };
      })
      .filter((p): p is ListingPhoto => p !== null);
  }
  if (raw.images?.length) {
    return raw.images.map((url, i) => ({ url, position: i }));
  }
  return [];
}

export function mapApifyItemToSnapshot(
  url: string,
  item: ApifyAirbnbItem,
): ListingSnapshot {
  const platform: Platform = detectPlatform(url);
  const listingId = extractListingId(url, platform);
  const priceNum = item.pricePerNight ?? item.price?.rate;
  const reviewCount = item.reviewsCount ?? item.numberOfReviews;
  const locationParts = [item.location?.city, item.location?.state, item.location?.country].filter(
    Boolean,
  ) as string[];
  const location = locationParts.length > 0 ? locationParts.join(', ') : item.address;

  return {
    platform,
    url,
    listingId,
    title: (item.title ?? item.name ?? '').trim(),
    description: (item.description ?? '').trim(),
    photos: mapPhotos(item),
    amenities: mapAmenities(item.amenities),
    reviewSnippets:
      item.reviews?.map((r) => ({
        reviewer: r.reviewerFirstName ?? r.author,
        date: r.createdAt,
        rating: r.rating,
        text: (r.comments ?? r.text ?? '').slice(0, 500),
      })) ?? [],
    priceNight: priceNum != null ? Math.round(priceNum * 100) : undefined,
    cleaningFee: item.cleaningFee != null ? Math.round(item.cleaningFee * 100) : undefined,
    minNights: item.minNights ?? item.minimumStay,
    location,
    ratingAverage: item.starRating,
    reviewCount,
    fetchedAt: new Date().toISOString(),
    source: 'apify',
  };
}

/**
 * Runs the configured Apify actor synchronously and returns the first dataset item.
 *
 * `fetchImpl` is injectable for tests — default uses global fetch.
 */
export interface ApifyClientOptions {
  token: string;
  actor: string;
  fetchImpl?: typeof globalThis.fetch;
  timeoutSecs?: number;
}

export async function runApifyActor(
  url: string,
  opts: ApifyClientOptions,
): Promise<ApifyAirbnbItem | null> {
  const { token, actor, fetchImpl = globalThis.fetch, timeoutSecs = 60 } = opts;
  const actorPath = encodeURIComponent(actor.replace('/', '~'));
  const endpoint = `${APIFY_BASE}/acts/${actorPath}/run-sync-get-dataset-items?token=${encodeURIComponent(
    token,
  )}&timeout=${timeoutSecs}`;

  const res = await fetchImpl(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ startUrls: [{ url }] }),
  });
  if (!res.ok) {
    throw new Error(`apify_http_${res.status}`);
  }
  const items = (await res.json()) as ApifyAirbnbItem[] | unknown;
  if (!Array.isArray(items) || items.length === 0) return null;
  return items[0] as ApifyAirbnbItem;
}

export class ApifyProvider implements ScrapeProvider {
  readonly name = 'apify' as const;

  constructor(
    private readonly options: ApifyClientOptions,
    /** Optional injection point for tests — bypass the live actor and return a fixture. */
    private readonly runner: typeof runApifyActor = runApifyActor,
  ) {}

  async fetch(url: string): Promise<ListingSnapshot | null> {
    const item = await this.runner(url, this.options);
    if (!item) return null;
    return mapApifyItemToSnapshot(url, item);
  }
}

/**
 * Best-effort cost estimate per Apify run. Default actor charges per dataset item.
 * Real cost lands via Apify webhook on run-finished events; this is a budget approximation
 * for cost-tracker until that telemetry pipeline ships in v0.2.
 */
export const APIFY_COST_PER_RUN_USD = 0.004;
