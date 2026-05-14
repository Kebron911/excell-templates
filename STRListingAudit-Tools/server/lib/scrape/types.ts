/**
 * Normalized representation of a short-term-rental listing.
 *
 * Whether the data came from a JSON-LD pre-parse or a managed Apify scrape,
 * downstream scoring code only ever sees this shape.
 *
 * Fields marked optional are best-effort — Airbnb's public DOM doesn't always
 * surface them, and scoring code MUST treat absence as "skip this signal",
 * never as "zero this signal".
 */

export type Platform = 'airbnb' | 'vrbo' | 'unknown';

export interface ListingPhoto {
  /** Full-size photo URL (CDN or scraped). */
  url: string;
  /** Alt text or aria-label, if any — used by photos-dimension scoring. */
  alt?: string;
  /** Position in the listing's photo carousel (0 = cover). */
  position?: number;
  /** Aspect ratio (width / height), if discoverable. */
  aspect?: number;
}

export interface ListingReviewSnippet {
  /** Reviewer first name or initial; never a full name. */
  reviewer?: string;
  /** ISO date, if available. */
  date?: string;
  /** 1-5 numeric rating, if available. */
  rating?: number;
  /** First ~500 chars of the review body. Truncated for token budget. */
  text: string;
}

export interface ListingSnapshot {
  /** Where the listing was fetched from. */
  platform: Platform;
  /** Canonical listing URL (the user-pasted URL after normalization). */
  url: string;
  /** Platform-internal listing id (Airbnb room id, Vrbo property id) if discoverable. */
  listingId?: string;
  /** Listing title as displayed on the platform. */
  title: string;
  /** Full description body, with line breaks preserved. */
  description: string;
  /** All photos, ordered. */
  photos: ListingPhoto[];
  /** Amenities surfaced by the platform — strings as they appear, not normalized. */
  amenities: string[];
  /** Recent reviews (last ~12 if available). */
  reviewSnippets: ListingReviewSnippet[];
  /** Nightly rate as displayed, in cents (e.g. 14500 for $145). USD assumed for v0.1. */
  priceNight?: number;
  /** Cleaning fee in cents. */
  cleaningFee?: number;
  /** Minimum stay in nights. */
  minNights?: number;
  /** Human-readable location string (e.g. "Austin, Texas, United States"). */
  location?: string;
  /** Star rating average (0-5). */
  ratingAverage?: number;
  /** Total review count on the listing. */
  reviewCount?: number;
  /** When this snapshot was fetched. */
  fetchedAt: string;
  /** Source pipeline used — useful for cost attribution and debugging. */
  source: 'json-ld' | 'apify' | 'hybrid';
}

/**
 * A scrape provider's raw output before normalization.
 *
 * The orchestrator decides which provider to call; each provider is
 * responsible for mapping its native shape to `ListingSnapshot`.
 */
export interface ScrapeProvider {
  readonly name: 'json-ld' | 'apify';
  fetch(url: string): Promise<ListingSnapshot | null>;
}

/**
 * Returned by the orchestrator. The `cost` field lets the audit pipeline
 * persist apify_cost_usd to audit_runs without re-asking the provider.
 */
export interface ScrapeResult {
  snapshot: ListingSnapshot;
  costUsd: number;
}
