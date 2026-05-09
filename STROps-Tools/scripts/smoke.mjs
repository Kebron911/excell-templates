#!/usr/bin/env node
/**
 * Pre-launch smoke test — runs against the deployed site.
 *
 * Hits a curated set of critical paths and asserts each one returns
 * HTTP 200 plus an expected substring (or content-type). Plain Node,
 * no deps beyond stdlib, so it works as a post-deploy CI step without
 * touching the project's package graph.
 *
 * Configure target URL via SMOKE_BASE_URL env (defaults to prod).
 * Exits non-zero on the first failed assertion so CI fails the deploy
 * job — surfacing a broken production deploy immediately.
 */

const BASE = (process.env.SMOKE_BASE_URL || 'https://strops.tools').replace(/\/$/, '');
const TIMEOUT_MS = 15_000;

/**
 * Each check declares:
 *   path         — appended to BASE
 *   contains     — case-insensitive substring expected in the body
 *   contentType  — substring of the Content-Type header expected
 *
 * Either contains OR contentType (or both) may be specified per check.
 */
const checks = [
  {
    path: '/',
    contains: 'strops.tools',
    contentType: 'text/html',
  },
  {
    path: '/turnover-scheduler/',
    contains: 'turnover-scheduler',
    contentType: 'text/html',
  },
  {
    path: '/maintenance/hvac-filter-change/',
    contains: 'hvac-filter-change',
    contentType: 'text/html',
  },
  {
    path: '/replace/queen-mattress/',
    contains: 'queen-mattress',
    contentType: 'text/html',
  },
  {
    path: '/get-the-cleaner-sop/',
    contains: 'cleaner',
    contentType: 'text/html',
  },
  {
    path: '/og/turnover-scheduler.png',
    contentType: 'image/png',
  },
];

function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, {
    signal: controller.signal,
    redirect: 'follow',
    headers: { 'User-Agent': 'strops-smoke/0.1.0' },
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
