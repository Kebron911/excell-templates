/**
 * JSON-LD pre-parse — Step 1 of the scrape pipeline.
 *
 * Airbnb and Vrbo both embed structured data via
 * `<script type="application/ld+json">`. When it's present and complete
 * we can skip the Apify spend entirely. When fields are missing the
 * orchestrator falls back to Apify.
 *
 * This module is intentionally browser-fetch only — no Playwright, no
 * cookies, no anti-bot evasion. If Airbnb returns a stripped HTML
 * shell (rare for room URLs, common for search pages), we return null.
 */

import * as cheerio from 'cheerio';
import type {
  ListingPhoto,
  ListingSnapshot,
  Platform,
  ScrapeProvider,
} from './types';

const USER_AGENT =
  'Mozilla/5.0 (compatible; ListingAuditBot/0.1; +https://listingaudit.tools)';

export function detectPlatform(url: string): Platform {
  try {
    const host = new URL(url).host.toLowerCase();
    if (host.endsWith('airbnb.com') || host.endsWith('airbnb.co.uk') || host.includes('airbnb.')) return 'airbnb';
    if (host.endsWith('vrbo.com') || host.includes('vrbo.')) return 'vrbo';
  } catch {
    return 'unknown';
  }
  return 'unknown';
}

export function extractListingId(url: string, platform: Platform): string | undefined {
  try {
    const u = new URL(url);
    if (platform === 'airbnb') {
      // /rooms/12345 or /rooms/plus/12345
      const match = u.pathname.match(/\/rooms\/(?:plus\/)?(\d+)/);
      return match?.[1];
    }
    if (platform === 'vrbo') {
      // /1234567 or /property/1234567 or similar
      const match = u.pathname.match(/\/(\d{6,})/);
      return match?.[1];
    }
  } catch {
    // fall through
  }
  return undefined;
}

interface JsonLdNode {
  '@type'?: string | string[];
  name?: string;
  description?: string;
  image?: string | string[] | { url?: string; caption?: string }[];
  address?: { addressLocality?: string; addressRegion?: string; addressCountry?: string };
  aggregateRating?: { ratingValue?: number | string; reviewCount?: number | string };
  review?: Array<{
    author?: { name?: string };
    datePublished?: string;
    reviewBody?: string;
    reviewRating?: { ratingValue?: number | string };
  }>;
  amenityFeature?: Array<{ name?: string } | string>;
  offers?: { price?: number | string; priceCurrency?: string };
}

/** Returns all JSON-LD nodes that look like a LodgingBusiness / LodgingReservation / Product. */
function selectListingNodes(nodes: JsonLdNode[]): JsonLdNode[] {
  const wanted = new Set([
    'LodgingBusiness',
    'BedAndBreakfast',
    'Hotel',
    'Hostel',
    'House',
    'Apartment',
    'VacationRental',
    'Accommodation',
    'Product',
    'Place',
  ]);
  return nodes.filter((n) => {
    const t = n['@type'];
    if (Array.isArray(t)) return t.some((x) => wanted.has(x));
    if (typeof t === 'string') return wanted.has(t);
    return false;
  });
}

function parseJsonLdBlocks(html: string): JsonLdNode[] {
  const $ = cheerio.load(html);
  const all: JsonLdNode[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text().trim();
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      // JSON-LD allows top-level @graph arrays. Flatten if present.
      if (Array.isArray(parsed)) all.push(...parsed);
      else if (parsed['@graph'] && Array.isArray(parsed['@graph'])) all.push(...parsed['@graph']);
      else all.push(parsed);
    } catch {
      // Bad JSON in one block — ignore, keep parsing the rest.
    }
  });
  return all;
}

function normalizeImages(value: JsonLdNode['image']): ListingPhoto[] {
  if (!value) return [];
  const list = Array.isArray(value) ? value : [value];
  return list
    .map((v, i): ListingPhoto | null => {
      if (typeof v === 'string') return { url: v, position: i };
      if (v && typeof v === 'object' && typeof v.url === 'string') {
        return { url: v.url, alt: v.caption, position: i };
      }
      return null;
    })
    .filter((p): p is ListingPhoto => p !== null);
}

function num(v: number | string | undefined): number | undefined {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim()) {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return undefined;
}

/** Merge multiple matching nodes into one, preferring populated fields. */
function mergeNodes(nodes: JsonLdNode[]): JsonLdNode {
  const out: JsonLdNode = {};
  for (const n of nodes) {
    for (const key of Object.keys(n) as (keyof JsonLdNode)[]) {
      if (out[key] == null && n[key] != null) {
        (out as any)[key] = n[key];
      }
    }
  }
  return out;
}

export interface JsonLdParseResult {
  snapshot: ListingSnapshot | null;
  /** True when the parse succeeded but key fields were missing — caller should fall back to Apify. */
  incomplete: boolean;
}

export function parseListingHtml(url: string, html: string): JsonLdParseResult {
  const platform = detectPlatform(url);
  const listingId = extractListingId(url, platform);
  const nodes = parseJsonLdBlocks(html);
  const listingNodes = selectListingNodes(nodes);
  if (listingNodes.length === 0) {
    return { snapshot: null, incomplete: true };
  }
  const node = mergeNodes(listingNodes);
  const photos = normalizeImages(node.image);
  const amenities =
    node.amenityFeature?.map((a) => (typeof a === 'string' ? a : (a.name ?? ''))).filter(Boolean) ?? [];
  const reviews =
    node.review?.map((r) => ({
      reviewer: r.author?.name,
      date: r.datePublished,
      rating: num(r.reviewRating?.ratingValue),
      text: (r.reviewBody ?? '').slice(0, 500),
    })) ?? [];

  const location = [node.address?.addressLocality, node.address?.addressRegion, node.address?.addressCountry]
    .filter(Boolean)
    .join(', ');

  const priceNum = num(node.offers?.price);
  const priceNight = priceNum != null ? Math.round(priceNum * 100) : undefined;

  const snapshot: ListingSnapshot = {
    platform,
    url,
    listingId,
    title: (node.name ?? '').trim(),
    description: (node.description ?? '').trim(),
    photos,
    amenities,
    reviewSnippets: reviews,
    priceNight,
    location: location || undefined,
    ratingAverage: num(node.aggregateRating?.ratingValue),
    reviewCount: num(node.aggregateRating?.reviewCount),
    fetchedAt: new Date().toISOString(),
    source: 'json-ld',
  };

  // "Incomplete" when ANY of these are missing — Apify can fill them in.
  const incomplete =
    !snapshot.title ||
    !snapshot.description ||
    snapshot.photos.length < 3 ||
    snapshot.amenities.length < 3;

  return { snapshot, incomplete };
}

export class JsonLdProvider implements ScrapeProvider {
  readonly name = 'json-ld' as const;

  async fetch(url: string): Promise<ListingSnapshot | null> {
    const res = await globalThis.fetch(url, {
      headers: { 'user-agent': USER_AGENT, accept: 'text/html,*/*' },
      redirect: 'follow',
    });
    if (!res.ok) return null;
    const html = await res.text();
    const { snapshot } = parseListingHtml(url, html);
    return snapshot;
  }
}
