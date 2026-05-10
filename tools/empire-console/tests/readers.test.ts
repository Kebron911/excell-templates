/**
 * Reader smoke tests — every reader runs against the actual ops/ files.
 * Catches schema regressions on every CI run.
 *
 * Each test asserts:
 *   1. The reader resolves (no thrown errors on real seeded data)
 *   2. The shape includes the expected top-level fields
 *
 * For deeper unit tests (parsing edge cases), see schemas.test.ts.
 */
import { describe, it, expect } from 'vitest';

import { readAlerts } from '../src/lib/data/alerts';
import { readAssets } from '../src/lib/data/assets';
import { readAtlas } from '../src/lib/data/atlas';
import { readCalendar } from '../src/lib/data/calendar';
import { readClusterStatus } from '../src/lib/data/cluster';
import { readCompensation } from '../src/lib/data/compensation';
import { readCompetitors } from '../src/lib/data/competitors';
import { readVoice } from '../src/lib/data/customer-voice';
import { readDecisions } from '../src/lib/data/decisions';
import { readInbox } from '../src/lib/data/inbox';
import { readInfrastructure } from '../src/lib/data/infrastructure';
import { readNearMisses } from '../src/lib/data/near-misses';
import { readNetwork } from '../src/lib/data/network';
import { readNewsletter } from '../src/lib/data/newsletter';
import { readOnboarding } from '../src/lib/data/onboarding';
import { readBacklinksPipeline, readInfluencersPipeline, readPressPipeline } from '../src/lib/data/pipelines';
import { readProgress } from '../src/lib/data/progress';
import { readRisks } from '../src/lib/data/risks';
import { readRoadmap } from '../src/lib/data/roadmap';
import { readRunbooks } from '../src/lib/data/runbooks';
import { readTargets } from '../src/lib/data/targets';
import { readTimeLog } from '../src/lib/data/time-log';
import { readVendors } from '../src/lib/data/vendors';
import { readConsoleActions } from '../src/lib/data/console-actions';

describe('readers — smoke tests against seeded ops/', () => {
  it('readAlerts resolves with array', async () => {
    const r = await readAlerts(10);
    expect(Array.isArray(r)).toBe(true);
  });

  it('readAssets resolves with byType + grandTotal', async () => {
    const r = await readAssets();
    expect(r.byType).toBeDefined();
    expect(typeof r.grandTotal).toBe('number');
  });

  it('readAtlas resolves with sections + totals', async () => {
    const r = await readAtlas();
    expect(Array.isArray(r.sections)).toBe(true);
    expect(typeof r.totals.items).toBe('number');
  });

  it('readCalendar resolves with items + counts', async () => {
    const r = await readCalendar();
    expect(Array.isArray(r.items)).toBe(true);
    expect(typeof r.dueWithin7d).toBe('number');
  });

  it('readClusterStatus resolves with array', async () => {
    const r = await readClusterStatus();
    expect(Array.isArray(r)).toBe(true);
  });

  it('readCompensation resolves with cashTotal + runwayMonths or null', async () => {
    const r = await readCompensation();
    if (r) {
      expect(typeof r.cashTotal).toBe('number');
      expect(typeof r.runwayMonths).toBe('number');
    }
  });

  it('readCompetitors resolves with competitors array + byTier', async () => {
    const r = await readCompetitors();
    expect(Array.isArray(r.competitors)).toBe(true);
    expect(r.byTier).toBeDefined();
  });

  it('readVoice resolves with array', async () => {
    const r = await readVoice(10);
    expect(Array.isArray(r)).toBe(true);
  });

  it('readDecisions resolves with array', async () => {
    const r = await readDecisions(10);
    expect(Array.isArray(r)).toBe(true);
  });

  it('readInbox resolves with array', async () => {
    const r = await readInbox(10);
    expect(Array.isArray(r)).toBe(true);
  });

  it('readInfrastructure resolves with domains + counts', async () => {
    const r = await readInfrastructure();
    expect(Array.isArray(r.domains)).toBe(true);
    expect(typeof r.expiringSoon).toBe('number');
  });

  it('readNearMisses resolves with array', async () => {
    const r = await readNearMisses(10);
    expect(Array.isArray(r)).toBe(true);
  });

  it('readNetwork resolves with people + counts', async () => {
    const r = await readNetwork();
    expect(Array.isArray(r.people)).toBe(true);
    expect(typeof r.cold).toBe('number');
  });

  it('readNewsletter resolves with newsletters + sent', async () => {
    const r = await readNewsletter();
    expect(Array.isArray(r.newsletters)).toBe(true);
    expect(Array.isArray(r.sent)).toBe(true);
  });

  it('readOnboarding resolves with buyers + counts', async () => {
    const r = await readOnboarding();
    expect(Array.isArray(r.buyers)).toBe(true);
    expect(typeof r.total).toBe('number');
  });

  it('readBacklinksPipeline resolves with outreach + acquired', async () => {
    const r = await readBacklinksPipeline();
    expect(r.outreach).toBeDefined();
    expect(r.acquired).toBeDefined();
  });

  it('readInfluencersPipeline resolves with prospects + active', async () => {
    const r = await readInfluencersPipeline();
    expect(r.prospects).toBeDefined();
    expect(r.active).toBeDefined();
  });

  it('readPressPipeline resolves with podcasts + guestPosts', async () => {
    const r = await readPressPipeline();
    expect(r.podcasts).toBeDefined();
    expect(r.guestPosts).toBeDefined();
  });

  it('readProgress resolves with totals + nextActions', async () => {
    const r = await readProgress();
    expect(typeof r.totalChecked).toBe('number');
    expect(Array.isArray(r.nextActions)).toBe(true);
  });

  it('readRisks resolves with risks + tier counts', async () => {
    const r = await readRisks();
    expect(Array.isArray(r.risks)).toBe(true);
    expect(typeof r.critical).toBe('number');
  });

  it('readRoadmap resolves with now/next/later', async () => {
    const r = await readRoadmap();
    expect(Array.isArray(r.now)).toBe(true);
    expect(Array.isArray(r.next)).toBe(true);
    expect(Array.isArray(r.later)).toBe(true);
  });

  it('readRunbooks resolves with array', async () => {
    const r = await readRunbooks();
    expect(Array.isArray(r)).toBe(true);
  });

  it('readTargets resolves with month + quarter', async () => {
    const r = await readTargets();
    // Either may be null if YAML omits that period; assert structure tolerates both
    expect('month' in r).toBe(true);
    expect('quarter' in r).toBe(true);
  });

  it('readTimeLog resolves with weekTotalMinutes + recentEntries', async () => {
    const r = await readTimeLog();
    expect(typeof r.weekTotalMinutes).toBe('number');
    expect(Array.isArray(r.recentEntries)).toBe(true);
  });

  it('readVendors resolves with vendors + monthlyBurn', async () => {
    const r = await readVendors();
    expect(Array.isArray(r.vendors)).toBe(true);
    expect(typeof r.monthlyBurn).toBe('number');
  });

  it('readConsoleActions resolves with array', async () => {
    const r = await readConsoleActions(10);
    expect(Array.isArray(r)).toBe(true);
  });
});
