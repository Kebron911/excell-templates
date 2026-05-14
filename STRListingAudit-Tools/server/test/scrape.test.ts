/**
 * Phase 2 scrape-layer tests. All offline against fixtures — no network calls.
 *
 *   - parseListingHtml: JSON-LD parse + completeness flagging
 *   - mapApifyItemToSnapshot: shape mapper
 *   - fetchListingSnapshot: orchestrator behavior (jsonld-only / apify-fallback / merge)
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { parseListingHtml, detectPlatform, extractListingId } from '../lib/scrape/jsonld';
import { mapApifyItemToSnapshot } from '../lib/scrape/apify';
import { fetchListingSnapshot } from '../lib/scrape/index';
import type { ScrapeProvider, ListingSnapshot } from '../lib/scrape/types';

const here = dirname(fileURLToPath(import.meta.url));
const fixturesDir = resolve(here, 'fixtures');
const readFixture = (name: string) => readFileSync(resolve(fixturesDir, name), 'utf-8');

describe('detectPlatform', () => {
  it('detects airbnb urls', () => {
    expect(detectPlatform('https://www.airbnb.com/rooms/12345')).toBe('airbnb');
    expect(detectPlatform('https://airbnb.co.uk/rooms/abc')).toBe('airbnb');
  });
  it('detects vrbo urls', () => {
    expect(detectPlatform('https://www.vrbo.com/1234567')).toBe('vrbo');
  });
  it('returns unknown for everything else', () => {
    expect(detectPlatform('https://example.com/foo')).toBe('unknown');
    expect(detectPlatform('not a url')).toBe('unknown');
  });
});

describe('extractListingId', () => {
  it('extracts airbnb numeric room id', () => {
    expect(extractListingId('https://www.airbnb.com/rooms/4242', 'airbnb')).toBe('4242');
    expect(extractListingId('https://www.airbnb.com/rooms/plus/9001', 'airbnb')).toBe('9001');
  });
  it('extracts vrbo numeric id', () => {
    expect(extractListingId('https://www.vrbo.com/8675309', 'vrbo')).toBe('8675309');
  });
});

describe('parseListingHtml', () => {
  it('parses complete Airbnb JSON-LD into a full snapshot', () => {
    const html = readFixture('airbnb-complete.html');
    const { snapshot, incomplete } = parseListingHtml(
      'https://www.airbnb.com/rooms/12345',
      html,
    );
    expect(snapshot).not.toBeNull();
    expect(incomplete).toBe(false);
    expect(snapshot!.platform).toBe('airbnb');
    expect(snapshot!.listingId).toBe('12345');
    expect(snapshot!.title).toContain('East Austin');
    expect(snapshot!.photos.length).toBeGreaterThanOrEqual(7);
    expect(snapshot!.amenities).toEqual(
      expect.arrayContaining(['Wifi', 'Free parking', 'Workspace']),
    );
    expect(snapshot!.reviewSnippets.length).toBeGreaterThan(0);
    expect(snapshot!.location).toMatch(/Austin/);
    expect(snapshot!.priceNight).toBe(14500); // $145 in cents
    expect(snapshot!.source).toBe('json-ld');
  });

  it('flags incomplete when key fields are missing', () => {
    const html = readFixture('airbnb-partial.html');
    const { snapshot, incomplete } = parseListingHtml(
      'https://www.airbnb.com/rooms/9999',
      html,
    );
    expect(snapshot).not.toBeNull();
    expect(incomplete).toBe(true); // only 1 photo, no amenities
    expect(snapshot!.title).toBeTruthy();
  });

  it('returns null snapshot when no JSON-LD is present', () => {
    const html = readFixture('airbnb-no-jsonld.html');
    const { snapshot, incomplete } = parseListingHtml(
      'https://www.airbnb.com/rooms/000',
      html,
    );
    expect(snapshot).toBeNull();
    expect(incomplete).toBe(true);
  });

  it('parses Vrbo JSON-LD with @graph wrapper', () => {
    const html = readFixture('vrbo-complete.html');
    const { snapshot, incomplete } = parseListingHtml(
      'https://www.vrbo.com/1234567',
      html,
    );
    expect(snapshot).not.toBeNull();
    expect(incomplete).toBe(false);
    expect(snapshot!.platform).toBe('vrbo');
    expect(snapshot!.photos[0].alt).toBe('Ocean view from balcony');
    expect(snapshot!.amenities).toContain('Hot tub');
    expect(snapshot!.priceNight).toBe(32500);
  });
});

describe('mapApifyItemToSnapshot', () => {
  it('maps a raw Apify Airbnb dataset item to ListingSnapshot', () => {
    const item = JSON.parse(readFixture('apify-airbnb-result.json'));
    const snap = mapApifyItemToSnapshot('https://www.airbnb.com/rooms/55555', item);
    expect(snap.title).toMatch(/A-Frame/);
    expect(snap.photos.length).toBe(7);
    expect(snap.photos[0].aspect).toBe(1.5);
    expect(snap.amenities).toContain('Hot tub');
    expect(snap.priceNight).toBe(21500);
    expect(snap.cleaningFee).toBe(9500);
    expect(snap.minNights).toBe(2);
    expect(snap.location).toBe('Asheville, North Carolina, United States');
    expect(snap.ratingAverage).toBe(4.89);
    expect(snap.reviewCount).toBe(247);
    expect(snap.source).toBe('apify');
  });
});

/** Stub ScrapeProvider that returns whatever you hand it. */
class StubProvider implements ScrapeProvider {
  readonly name: 'json-ld' | 'apify';
  constructor(name: 'json-ld' | 'apify', private result: ListingSnapshot | null) {
    this.name = name;
  }
  async fetch(): Promise<ListingSnapshot | null> {
    return this.result;
  }
}

function snapshotFromHtml(file: string, url: string): ListingSnapshot | null {
  const html = readFixture(file);
  return parseListingHtml(url, html).snapshot;
}

describe('fetchListingSnapshot orchestrator', () => {
  it('returns json-ld snapshot when it is complete and skips apify', async () => {
    const jsonLd = new StubProvider(
      'json-ld',
      snapshotFromHtml('airbnb-complete.html', 'https://www.airbnb.com/rooms/12345'),
    );
    const apify = new StubProvider('apify', null);
    const result = await fetchListingSnapshot('https://www.airbnb.com/rooms/12345', {
      jsonLdProvider: jsonLd as any,
      apifyProvider: apify as any,
    });
    expect(result.costUsd).toBe(0);
    expect(result.snapshot.source).toBe('json-ld');
  });

  it('falls back to apify when json-ld is incomplete', async () => {
    const apifyItem = JSON.parse(readFixture('apify-airbnb-result.json'));
    const apifySnap = mapApifyItemToSnapshot(
      'https://www.airbnb.com/rooms/55555',
      apifyItem,
    );
    const jsonLd = new StubProvider(
      'json-ld',
      snapshotFromHtml('airbnb-partial.html', 'https://www.airbnb.com/rooms/55555'),
    );
    const apify = new StubProvider('apify', apifySnap);
    const result = await fetchListingSnapshot('https://www.airbnb.com/rooms/55555', {
      jsonLdProvider: jsonLd as any,
      apifyProvider: apify as any,
    });
    expect(result.costUsd).toBeGreaterThan(0);
    expect(result.snapshot.source).toBe('hybrid');
    // Apify wins on populated fields, JSON-LD fills gaps it had.
    expect(result.snapshot.title).toMatch(/A-Frame/);
  });

  it('throws when both providers fail entirely', async () => {
    const jsonLd = new StubProvider('json-ld', null);
    const apify = new StubProvider('apify', null);
    await expect(
      fetchListingSnapshot('https://www.airbnb.com/rooms/abc', {
        jsonLdProvider: jsonLd as any,
        apifyProvider: apify as any,
      }),
    ).rejects.toThrow(/scrape_failed/);
  });

  it('throws when apify is unconfigured and json-ld returns nothing', async () => {
    const jsonLd = new StubProvider('json-ld', null);
    await expect(
      fetchListingSnapshot('https://www.airbnb.com/rooms/abc', {
        jsonLdProvider: jsonLd as any,
      }),
    ).rejects.toThrow(/scrape_failed/);
  });

  it('returns hybrid-marked partial when apify is unconfigured but json-ld had partial data', async () => {
    const jsonLd = new StubProvider(
      'json-ld',
      snapshotFromHtml('airbnb-partial.html', 'https://www.airbnb.com/rooms/55555'),
    );
    const result = await fetchListingSnapshot('https://www.airbnb.com/rooms/55555', {
      jsonLdProvider: jsonLd as any,
    });
    expect(result.costUsd).toBe(0);
    expect(result.snapshot.source).toBe('hybrid');
  });
});
