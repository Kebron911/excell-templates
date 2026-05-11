#!/usr/bin/env node
/**
 * Pre-launch smoke test — runs against the deployed thestrledger.com.
 *
 * Mirrors STRBuyers-Tools/scripts/smoke.mjs. Hits the launch-blocking
 * URLs that prove every critical surface returns 200 with the right
 * content. Used by:
 *   - GitHub Actions deploy job (post-deploy verification)
 *   - scripts/deploy.ps1 (final stage of the deploy)
 *   - manual: `SMOKE_BASE_URL=https://thestrledger.com node scripts/smoke.mjs`
 *
 * Exits non-zero on the first failed assertion so CI fails the deploy.
 * Plain Node + fetch, no deps.
 */

const BASE = (process.env.SMOKE_BASE_URL || 'https://thestrledger.com').replace(/\/$/, '');
const TIMEOUT_MS = 15_000;

const checks = [
  { path: '/',                            contains: 'STR Ledger',  contentType: 'text/html' },
  { path: '/products/',                   contains: 'workbook',    contentType: 'text/html' },
  { path: '/products/TAX-001/',           contains: 'Mileage Log', contentType: 'text/html' },
  { path: '/products/TAX-004/',           contains: 'Schedule E',  contentType: 'text/html' },
  { path: '/products/ACQ-001/',           contains: 'Deal Analyzer', contentType: 'text/html' },
  { path: '/free/47-deductions/',         contains: 'deduction',   contentType: 'text/html' },
  { path: '/about/',                      contains: 'STR Ledger',  contentType: 'text/html' },
  { path: '/contact/',                    contains: 'hello@',      contentType: 'text/html' },
  { path: '/disclosures/',                contains: 'disclosure',  contentType: 'text/html' },
  { path: '/sitemap-index.xml',           contains: '<sitemapindex', contentType: 'xml' },
  { path: '/robots.txt',                  contains: 'Sitemap:',    contentType: 'text/plain' },
];

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'strledger-smoke/0.1.0' },
    });
  } finally {
    clearTimeout(timer);
  }
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
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.toLowerCase().includes(check.contentType)) {
      errors.push(`expected content-type ~"${check.contentType}", got "${ct}"`);
    }
  }

  if (check.contains) {
    const body = await res.text();
    if (!body.includes(check.contains)) {
      errors.push(`body did not include "${check.contains}"`);
    }
  }

  return { url, ok: errors.length === 0, errors };
}

async function main() {
  console.log(`Smoke testing ${BASE}`);
  console.log('');

  let pass = 0;
  let fail = 0;
  for (const check of checks) {
    const r = await runCheck(check);
    if (r.ok) {
      pass += 1;
      console.log(`  OK    ${r.url}`);
    } else {
      fail += 1;
      console.log(`  FAIL  ${r.url}`);
      for (const e of r.errors) console.log(`        - ${e}`);
    }
  }

  console.log('');
  console.log(`${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('smoke runner crashed:', err);
  process.exit(2);
});
