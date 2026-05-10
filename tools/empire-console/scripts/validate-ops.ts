#!/usr/bin/env tsx
/**
 * pnpm validate:ops
 *
 * Runs every reader against every YAML/NDJSON in ops/ and reports parse failures.
 * Exits non-zero if any source is malformed — wire into CI to catch breakage early.
 */

import { readAlerts } from '../src/lib/data/alerts.js';
import { readAssets } from '../src/lib/data/assets.js';
import { readAtlas } from '../src/lib/data/atlas.js';
import { readCalendar } from '../src/lib/data/calendar.js';
import { readClusterStatus } from '../src/lib/data/cluster.js';
import { readCompensation } from '../src/lib/data/compensation.js';
import { readCompetitors } from '../src/lib/data/competitors.js';
import { readVoice } from '../src/lib/data/customer-voice.js';
import { readDecisions } from '../src/lib/data/decisions.js';
import { readInbox } from '../src/lib/data/inbox.js';
import { readInfrastructure } from '../src/lib/data/infrastructure.js';
import { readNearMisses } from '../src/lib/data/near-misses.js';
import { readNetwork } from '../src/lib/data/network.js';
import { readNewsletter } from '../src/lib/data/newsletter.js';
import { readOnboarding } from '../src/lib/data/onboarding.js';
import { readBacklinksPipeline, readInfluencersPipeline, readPressPipeline } from '../src/lib/data/pipelines.js';
import { readProgress } from '../src/lib/data/progress.js';
import { readRisks } from '../src/lib/data/risks.js';
import { readRoadmap } from '../src/lib/data/roadmap.js';
import { readRunbooks } from '../src/lib/data/runbooks.js';
import { readTargets } from '../src/lib/data/targets.js';
import { readTimeLog } from '../src/lib/data/time-log.js';
import { readVendors } from '../src/lib/data/vendors.js';
import { listSites } from '../src/lib/data/site-atlas.js';

interface Check { name: string; run: () => Promise<unknown>; }

const checks: Check[] = [
  { name: 'alerts',           run: () => readAlerts(10) },
  { name: 'assets',           run: () => readAssets() },
  { name: 'atlas',            run: () => readAtlas() },
  { name: 'calendar',         run: () => readCalendar() },
  { name: 'cluster',          run: () => readClusterStatus() },
  { name: 'compensation',     run: () => readCompensation() },
  { name: 'competitors',      run: () => readCompetitors() },
  { name: 'customer-voice',   run: () => readVoice(10) },
  { name: 'decisions',        run: () => readDecisions(10) },
  { name: 'inbox',            run: () => readInbox(10) },
  { name: 'infrastructure',   run: () => readInfrastructure() },
  { name: 'near-misses',      run: () => readNearMisses(10) },
  { name: 'network',          run: () => readNetwork() },
  { name: 'newsletter',       run: () => readNewsletter() },
  { name: 'onboarding',       run: () => readOnboarding() },
  { name: 'pipelines/backlinks',   run: () => readBacklinksPipeline() },
  { name: 'pipelines/influencers', run: () => readInfluencersPipeline() },
  { name: 'pipelines/press',       run: () => readPressPipeline() },
  { name: 'progress',         run: () => readProgress() },
  { name: 'risks',            run: () => readRisks() },
  { name: 'roadmap',          run: () => readRoadmap() },
  { name: 'runbooks',         run: () => readRunbooks() },
  { name: 'targets',          run: () => readTargets() },
  { name: 'time-log',         run: () => readTimeLog() },
  { name: 'vendors',          run: () => readVendors() },
  { name: 'atlas/sites/*',    run: () => listSites() },
];

async function main() {
  console.log(`validate-ops · running ${checks.length} reader checks…`);
  console.log('');
  let passed = 0;
  const failures: { name: string; error: string }[] = [];

  for (const check of checks) {
    try {
      await check.run();
      console.log(`  ✓ ${check.name}`);
      passed++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`  ✗ ${check.name}`);
      console.log(`      ${msg.split('\n')[0]}`);
      failures.push({ name: check.name, error: msg });
    }
  }

  console.log('');
  console.log(`Passed: ${passed}/${checks.length}`);

  if (failures.length > 0) {
    console.log('');
    console.log('Failures:');
    for (const f of failures) {
      console.log(`  ${f.name}:`);
      console.log(f.error.split('\n').map((l) => '    ' + l).join('\n'));
    }
    process.exit(1);
  }

  console.log('All ops sources valid.');
}

main().catch((err) => {
  console.error('validate-ops crashed:', err);
  process.exit(2);
});
