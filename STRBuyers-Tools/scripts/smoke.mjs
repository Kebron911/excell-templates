#!/usr/bin/env node
/**
 * Pre-launch smoke test — runs against the deployed strbuyers.tools site.
 *
 * Hits the same 7 launch-blocking URLs validated at v0.1.0 launch
 * (see .planning/phases/06-deploy/SMOKE.md). Plain Node + fetch, no
 * deps, exits non-zero on the first failed assertion so CI fails the
 * deploy job.
 *
 * Configure target URL via SMOKE_BASE_URL env (defaults to prod).
 */

const BASE = (process.env.SMOKE_BASE_URL || 'https://strbuyers.tools').replace(/\/$/, '');
const TIMEOUT_MS = 15_000;

const checks = [
  { path: '/', contains: 'STR Buyers', contentType: 'text/html' },
  { path: '/dscr-loan-calculator/', contains: 'DSCR', contentType: 'text/html' },
  { path: '/cities/', contains: 'Cities', contentType: 'text/html' },
  { path: '/cities/austin-tx/', contains: 'Austin', contentType: 'text/html' },
  { path: '/disclosures/', contains: 'Disclosure', contentType: 'text/html' },
  { path: '/sitemap-index.xml', contains: '<sitemapindex', contentType: 'xml' },
  { path: '/robots.txt', contains: 'Sitemap:', contentType: 'text/plain' },
];

function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, {
    signal: controller.signal,
    redirect: 'follow',
    headers: { 'User-Agent': 'strbuyers-smoke/0.1.0' },
  }).finally(() => clearTimeout(timer));
}

async function runCheck(check) {
  const url = `${BASE}${check.path}`;
  const errors = [];
  let res;
  try {
    res = await fetchWithTimeout(url, TIMEOUT_MS);
  } catch (err) {
    return { url, ok: false, errors: [`fetch failed: ${err.message}`] };
  }

  if (res.status !== 200) {
    errors.push(`expected HTTP 200, got ${res.status}`);
  }

  if (check.contentType) {
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (!ct.includes(check.contentType.toLowerCase())) {
      errors.push(`expected Content-Type to include "${check.contentType}", got "${ct}"`);
    }
  }

  if (check.contains) {
    const body = await res.text().catch(() => '');
    if (!body.toLowerCase().includes(check.contains.toLowerCase())) {
      errors.push(`expected body to contain "${check.contains}"`);
    }
  }

  return { url, ok: errors.length === 0, errors };
}

async function main() {
  console.log(`Smoke target: ${BASE}\n`);
  let failed = 0;
  for (const check of checks) {
    const result = await runCheck(check);
    if (result.ok) {
      console.log(`PASS  ${result.url}`);
    } else {
      failed += 1;
      console.error(`FAIL  ${result.url}`);
      for (const e of result.errors) {
        console.error(`        - ${e}`);
      }
    }
  }
  console.log(`\n${checks.length - failed}/${checks.length} checks passed.`);
  if (failed > 0) {
    console.error(`Smoke failed: ${failed} check(s) did not pass.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Smoke harness crashed:', err);
  process.exit(2);
});
