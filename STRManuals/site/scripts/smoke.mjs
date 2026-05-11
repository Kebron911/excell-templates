#!/usr/bin/env node
/**
 * Post-deploy smoke test for strmanuals.com.
 *
 * Hits a curated set of critical paths and asserts each one returns
 * HTTP 200 plus an expected substring. Stdlib-only, exits non-zero on
 * the first failed assertion so CI fails the deploy job.
 *
 * Configure target URL via SMOKE_BASE_URL env (defaults to prod).
 */

const BASE = (process.env.SMOKE_BASE_URL || 'https://strmanuals.com').replace(/\/$/, '');
const TIMEOUT_MS = 15_000;

const checks = [
  { path: '/', contains: 'strmanuals' },
  { path: '/manuals/tax-01/', contains: 'Tax Loophole' },
  { path: '/manuals/tax-02/', contains: 'Material Participation' },
  { path: '/manuals/rev-01/', contains: 'Bookings Down' },
  { path: '/manuals/rev-02/', contains: 'Direct Bookings' },
  { path: '/manuals/lgl-01/', contains: 'Permit' },
  { path: '/bundle/', contains: 'bundle' },
  { path: '/free/', contains: 'Tax Loophole Explainer' },
  { path: '/about/', contains: 'about' },
  { path: '/privacy/', contains: 'Privacy' },
  { path: '/terms/', contains: 'Terms' },
  { path: '/refund/', contains: 'efund' },
  { path: '/disclosures/', contains: 'isclosure' },
  { path: '/thank-you/', contains: 'hank' },
  { path: '/robots.txt', contains: 'Sitemap:' },
  { path: '/sitemap-index.xml', contains: '<sitemapindex' },
];

// Ensure Buy buttons resolve to live Stripe payment links — the single
// most important assertion. If this fails, customers can't pay.
const linkCheck = {
  path: '/manuals/tax-01/',
  pattern: /href="https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+"/,
};

let failures = 0;

async function fetchWithTimeout(url) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctl.signal, redirect: 'follow' });
    const text = await res.text();
    return { status: res.status, text };
  } finally {
    clearTimeout(t);
  }
}

for (const c of checks) {
  const url = BASE + c.path;
  try {
    const { status, text } = await fetchWithTimeout(url);
    if (status !== 200) {
      console.error(`FAIL ${url} → ${status}`);
      failures++;
      continue;
    }
    if (c.contains && !text.toLowerCase().includes(c.contains.toLowerCase())) {
      console.error(`FAIL ${url} → 200 but missing "${c.contains}"`);
      failures++;
      continue;
    }
    console.log(`OK   ${url}`);
  } catch (e) {
    console.error(`FAIL ${url} → ${e.message}`);
    failures++;
  }
}

try {
  const { status, text } = await fetchWithTimeout(BASE + linkCheck.path);
  if (status !== 200 || !linkCheck.pattern.test(text)) {
    console.error(`FAIL ${BASE}${linkCheck.path} → Buy button missing Stripe payment link`);
    failures++;
  } else {
    console.log(`OK   ${BASE}${linkCheck.path} → Buy button wired to Stripe`);
  }
} catch (e) {
  console.error(`FAIL link check → ${e.message}`);
  failures++;
}

if (failures > 0) {
  console.error(`\n${failures} smoke check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length + 1} smoke checks passed against ${BASE}`);
