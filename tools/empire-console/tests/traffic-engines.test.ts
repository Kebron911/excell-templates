/**
 * Traffic Engines (W41-W45) data-loader unit tests.
 *
 * Tests the parsing edge cases that the smoke tests in readers.test.ts don't cover:
 *   - YAML schema-line skip in citations (it's a top-level comment field)
 *   - Stale detection at 90 days for citations
 *   - NDJSON schema-line skip for social-answers + customer-embeds
 *   - Malformed line tolerance
 *   - Empty/missing file → empty report
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { readCitations } from '../src/lib/data/citations';
import { readSocialAnswers } from '../src/lib/data/social-answers';
import { readCustomerEmbeds } from '../src/lib/data/customer-embeds';
import { readPinterest } from '../src/lib/data/pinterest';
import { readIndexNow } from '../src/lib/data/indexnow';

// Helper: swap paths to point at a temp file, restore on teardown.
async function withTempPaths<T>(
  overrides: Partial<Record<'citations' | 'socialAnswers' | 'customerEmbeds' | 'pinterest' | 'indexnow', string>>,
  fn: () => Promise<T>,
): Promise<T> {
  const paths = await import('../src/lib/paths');
  const top = paths.paths as unknown as Record<string, string>;
  const cache = paths.paths.cache as unknown as Record<string, string>;
  const original: Record<string, string> = {};
  for (const key of Object.keys(overrides) as (keyof typeof overrides)[]) {
    if (key === 'pinterest' || key === 'indexnow') {
      original[key] = cache[key];
      cache[key] = overrides[key] as string;
    } else {
      original[key] = top[key];
      top[key] = overrides[key] as string;
    }
  }
  try {
    return await fn();
  } finally {
    for (const key of Object.keys(original) as (keyof typeof overrides)[]) {
      if (key === 'pinterest' || key === 'indexnow') {
        cache[key] = original[key];
      } else {
        top[key] = original[key];
      }
    }
  }
}

let dir: string;
afterEach(async () => {
  if (dir) await rm(dir, { recursive: true, force: true });
});

describe('citations loader', () => {
  it('flags live entries with last_refresh > 90d as stale', async () => {
    dir = await mkdtemp(join(tmpdir(), 'cit-'));
    const file = join(dir, 'citations.yaml');
    const oldDate = new Date(Date.now() - 100 * 86_400_000).toISOString().slice(0, 10);
    const freshDate = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10);
    await writeFile(file, `
citations:
  - platform: Crunchbase
    tier: T1
    url: https://crunchbase.com/org/strledger
    state: live
    last_refresh: ${oldDate}
    bio_version: "1"
  - platform: LinkedIn
    tier: T1
    url: https://linkedin.com/company/strledger
    state: live
    last_refresh: ${freshDate}
    bio_version: "1"
  - platform: G2
    tier: T1
    url: ""
    state: pending
    last_refresh: null
`);
    const r = await withTempPaths({ citations: file }, () => readCitations());
    expect(r.counts.total).toBe(3);
    expect(r.counts.live).toBe(1);   // LinkedIn only — Crunchbase auto-flipped to stale
    expect(r.counts.stale).toBe(1);  // Crunchbase
    expect(r.counts.pending).toBe(1);
  });

  it('returns empty report when file missing', async () => {
    const r = await withTempPaths({ citations: '/nonexistent/path/citations.yaml' }, () => readCitations());
    expect(r.counts.total).toBe(0);
    expect(r.byTier.T1).toEqual([]);
  });

  it('handles malformed YAML gracefully', async () => {
    dir = await mkdtemp(join(tmpdir(), 'cit-bad-'));
    const file = join(dir, 'citations.yaml');
    await writeFile(file, 'citations: this is not a list\n  - unindented broken');
    const r = await withTempPaths({ citations: file }, () => readCitations());
    expect(r.counts.total).toBe(0);
  });
});

describe('social-answers loader', () => {
  it('skips the _schema line and parses real rows', async () => {
    dir = await mkdtemp(join(tmpdir(), 'sa-'));
    const file = join(dir, 'social-answers.ndjson');
    const today = new Date().toISOString();
    const eightDaysAgo = new Date(Date.now() - 8 * 86_400_000).toISOString();
    await writeFile(file, [
      '{"_schema":"comment line should be ignored"}',
      JSON.stringify({ surfaced_at: today, platform: 'reddit', subreddit_or_topic: 'r/AirBnBHosts', question_url: 'https://reddit.com/x', answered: true, answer_url: 'https://reddit.com/y', posted_at: today, est_visits: 12 }),
      JSON.stringify({ surfaced_at: eightDaysAgo, platform: 'hn', subreddit_or_topic: 'airbnb-tax', question_url: 'https://news.ycombinator.com/item?id=1', answered: false, est_visits: 0 }),
      '', // blank line — should skip
      '{this is not valid json}', // malformed — should skip
    ].join('\n'));

    const r = await withTempPaths({ socialAnswers: file }, () => readSocialAnswers());
    expect(r.rows.length).toBe(2);
    expect(r.surfaced7d).toBe(1);
    expect(r.surfaced30d).toBe(2);
    expect(r.answered7d).toBe(1);
    expect(r.estVisits30d).toBe(12);
    expect(r.byPlatform.reddit).toBe(1);
    expect(r.byPlatform.hn).toBe(1);
  });

  it('computes conversion rate safely when surfaced7d=0', async () => {
    dir = await mkdtemp(join(tmpdir(), 'sa-zero-'));
    const file = join(dir, 'social-answers.ndjson');
    await writeFile(file, '{"_schema":"only schema, no real rows"}\n');
    const r = await withTempPaths({ socialAnswers: file }, () => readSocialAnswers());
    expect(r.surfaced7d).toBe(0);
    expect(r.conversionRate7d).toBe(0); // no division-by-zero NaN
  });
});

describe('customer-embeds loader', () => {
  it('splits active vs lost embeds correctly', async () => {
    dir = await mkdtemp(join(tmpdir(), 'ce-'));
    const file = join(dir, 'customer-embeds.ndjson');
    await writeFile(file, [
      '{"_schema":"schema comment"}',
      JSON.stringify({ detected_at: '2026-01-01T00:00:00Z', embedder_domain: 'a.com', still_present: true, referrer_visits_30d: 25 }),
      JSON.stringify({ detected_at: '2026-02-01T00:00:00Z', embedder_domain: 'b.com', still_present: false, referrer_visits_30d: 5 }),
      JSON.stringify({ detected_at: '2026-03-01T00:00:00Z', embedder_domain: 'c.com', still_present: true, referrer_visits_30d: 40 }),
    ].join('\n'));

    const r = await withTempPaths({ customerEmbeds: file }, () => readCustomerEmbeds());
    expect(r.rows.length).toBe(3);
    expect(r.active.length).toBe(2);
    expect(r.lost.length).toBe(1);
    expect(r.totalReferrerVisits30d).toBe(65); // active only: 25 + 40
  });
});

describe('pinterest + indexnow cache loaders', () => {
  it('pinterest returns isCacheReady=false when file missing', async () => {
    const r = await withTempPaths({ pinterest: '/nonexistent/pinterest.json' }, () => readPinterest());
    expect(r.isCacheReady).toBe(false);
    expect(r.pins_published_7d).toBe(0);
    expect(r.top_pins).toEqual([]);
  });

  it('pinterest parses well-formed cache', async () => {
    dir = await mkdtemp(join(tmpdir(), 'pin-'));
    const file = join(dir, 'pinterest.json');
    await writeFile(file, JSON.stringify({
      generatedAt: '2026-05-11T00:00:00Z',
      pins_published_7d: 50,
      pins_published_30d: 200,
      impressions_30d: 12000,
      outbound_clicks_30d: 240,
      ctr_30d: 0.02,
      top_pins: [
        { pin_id: 'p1', title: 'Test', impressions_30d: 500, saves_30d: 30, outbound_clicks_30d: 40 },
      ],
    }));
    const r = await withTempPaths({ pinterest: file }, () => readPinterest());
    expect(r.isCacheReady).toBe(true);
    expect(r.pins_published_7d).toBe(50);
    expect(r.top_pins.length).toBe(1);
    expect(r.top_pins[0].pin_id).toBe('p1');
  });

  it('indexnow returns isCacheReady=false when file missing', async () => {
    const r = await withTempPaths({ indexnow: '/nonexistent/indexnow.json' }, () => readIndexNow());
    expect(r.isCacheReady).toBe(false);
    expect(r.submissions_24h).toBe(0);
  });

  it('indexnow parses well-formed cache with submissions', async () => {
    dir = await mkdtemp(join(tmpdir(), 'idx-'));
    const file = join(dir, 'indexnow.json');
    await writeFile(file, JSON.stringify({
      generatedAt: '2026-05-11T00:00:00Z',
      submissions_24h: 5,
      submissions_7d: 28,
      errors_7d: 1,
      last_submission_at: '2026-05-11T06:00:00Z',
      recent_submissions: [
        { url: 'https://thestrledger.com/x', submitted_at: '2026-05-11T06:00:00Z',
          gsc_status: 200, bing_status: 202, yandex_status: 200, pinterest_status: 200, success_count: 4 },
      ],
    }));
    const r = await withTempPaths({ indexnow: file }, () => readIndexNow());
    expect(r.isCacheReady).toBe(true);
    expect(r.submissions_24h).toBe(5);
    expect(r.errors_7d).toBe(1);
    expect(r.recent_submissions.length).toBe(1);
  });

  it('indexnow tolerates non-numeric status values', async () => {
    dir = await mkdtemp(join(tmpdir(), 'idx-str-'));
    const file = join(dir, 'indexnow.json');
    await writeFile(file, JSON.stringify({
      submissions_24h: 1,
      submissions_7d: 1,
      errors_7d: 0,
      last_submission_at: null,
      recent_submissions: [
        { url: 'https://thestrledger.com/y', submitted_at: '2026-05-11T06:00:00Z',
          gsc_status: 'skipped', bing_status: 200, yandex_status: 200, pinterest_status: 'skipped', success_count: 2 },
      ],
    }));
    const r = await withTempPaths({ indexnow: file }, () => readIndexNow());
    expect(r.isCacheReady).toBe(true);
    expect(r.recent_submissions[0].gsc_status).toBe('skipped');
  });
});
