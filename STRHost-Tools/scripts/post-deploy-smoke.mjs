#!/usr/bin/env node
/**
 * Post-deploy smoke check. Hits every critical route on the deployed site
 * and asserts each returns 200. Intended to run after FTP deploy via the
 * GitHub Actions workflow, but can also be run locally:
 *
 *   SMOKE_BASE_URL=https://strhost.tools node scripts/post-deploy-smoke.mjs
 *
 * Exits 0 if all probes pass; exits 1 with a count of failures otherwise.
 * The pre-launch checklist runs this against the live URL one final time
 * before tagging v0.1.0.
 */

const BASE = (process.env.SMOKE_BASE_URL || 'https://strhost.tools').replace(/\/$/, '');

const routes = [
  // Landing + chrome
  '/',
  '/about',
  '/contact',
  '/get-the-pdf',

  // 6 standalone calculators
  '/airbnb-fee-calculator',
  '/profit-calculator',
  '/cleaning-fee-calculator',
  '/revpar-calculator',
  '/break-even-calculator',
  '/cohost-split-calculator',

  // Lodging-tax surface
  '/lodging-tax',
  '/lodging-tax/tx',
  '/lodging-tax/ca',
  '/lodging-tax/fl',
  '/lodging-tax/ny',
  '/lodging-tax/co',

  // SEO surface
  '/sitemap-index.xml',
  '/robots.txt',
];

const ogProbes = [
  '/og/index.png',
  '/og/airbnb-fee-calculator.png',
  '/og/lodging-tax-tx.png',
];

const allProbes = [...routes, ...ogProbes];

async function probe(path) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, { redirect: 'follow' });
    const ok = res.status === 200;
    console.log(`${ok ? '✓' : '✗'} ${res.status}  ${url}`);
    return ok;
  } catch (err) {
    console.log(`✗ ERR  ${url}  -- ${err.message}`);
    return false;
  }
}

console.log(`\nSmoke: ${BASE}  (${allProbes.length} probes)\n`);

const results = await Promise.all(allProbes.map(probe));
const failures = results.filter((ok) => !ok).length;

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'}: ${results.length - failures}/${results.length} green`);

if (failures > 0) {
  console.error(`\n${failures} probes failed. Smoke aborted.`);
  process.exit(1);
}
