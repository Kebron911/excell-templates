#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { loadCatalog } from '@str/catalog';
import { checkCannibalization, renderMarkdownReport, summarize } from '../cannibalization.js';

function main(): void {
  const { catalog } = loadCatalog();
  const report = checkCannibalization(catalog);
  const summary = summarize(report);

  const failOnHigh = process.argv.includes('--fail-on-high');
  const outFile = process.argv.find((a) => a.startsWith('--out='))?.slice(6);

  console.log(`Scanned ${report.scannedTools} tools`);
  console.log(`  high:   ${summary.high}`);
  console.log(`  medium: ${summary.medium}`);
  console.log(`  low:    ${summary.low}`);

  for (const c of summary.highConflicts) {
    console.log(`HIGH ${c.toolA} ⇆ ${c.toolB} — ${c.sharedKeywords.join(', ')}`);
  }

  if (outFile) {
    writeFileSync(outFile, renderMarkdownReport(report));
    console.log(`report → ${outFile}`);
  }

  if (failOnHigh && summary.high > 0) {
    console.error(`FAIL: ${summary.high} HIGH-severity cannibalization conflict(s)`);
    process.exit(1);
  }
}

main();
