#!/usr/bin/env tsx
/**
 * pnpm validate:drift
 *
 * Three-bucket drift check between the dashboard registry and reality.
 * Exits non-zero if any 'bad' finding exists (structural drift or fully
 * missing brief fields). Warnings and info findings are reported but do
 * not fail CI.
 *
 * Wired into the validate chain so PRs that rename folders or drop fields
 * fail before merge.
 */

import { readDrift } from '../src/lib/data/drift.js';

const STRICT = process.argv.includes('--strict'); // treat warnings as failures too

async function main() {
  const report = await readDrift();
  const { findings, totals } = report;

  console.log(`validate-drift · ${findings.length} findings`);
  console.log('');
  console.log(`  structural: ${totals.structural.bad} bad · ${totals.structural.warn} warn · ${totals.structural.info} info`);
  console.log(`  conventions: ${totals.conventions.bad} bad · ${totals.conventions.warn} warn · ${totals.conventions.info} info`);
  console.log(`  process:     ${totals.process.bad} bad · ${totals.process.warn} warn · ${totals.process.info} info`);
  console.log('');

  if (findings.length === 0) {
    console.log('No drift detected.');
    return;
  }

  const byBucket = {
    structural: findings.filter((f) => f.bucket === 'structural'),
    conventions: findings.filter((f) => f.bucket === 'conventions'),
    process: findings.filter((f) => f.bucket === 'process'),
  };

  for (const bucket of ['structural', 'conventions', 'process'] as const) {
    if (byBucket[bucket].length === 0) continue;
    console.log(`── ${bucket} ──`);
    for (const f of byBucket[bucket]) {
      const marker = f.severity === 'bad' ? '✗' : f.severity === 'warn' ? '⚠' : 'ℹ';
      console.log(`  ${marker} [${f.severity}] ${f.ref}`);
      console.log(`      ${f.message}`);
      if (f.hint) console.log(`      hint: ${f.hint}`);
    }
    console.log('');
  }

  const failCount = STRICT ? totals.bad + totals.warn : totals.bad;
  if (failCount > 0) {
    const level = STRICT ? 'bad + warn' : 'bad';
    console.error(`validate-drift FAILED: ${failCount} ${level} finding(s).`);
    process.exit(1);
  }

  console.log(`validate-drift passed (${totals.bad} bad). Warnings and info findings ignored — run with --strict to fail on warnings.`);
}

main().catch((err) => {
  console.error('validate-drift crashed:', err);
  process.exit(2);
});
