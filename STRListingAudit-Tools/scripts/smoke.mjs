#!/usr/bin/env node
/**
 * Post-deploy smoke. Plain Node + native fetch, zero deps. Asserts
 * content-type + body substring on the routes that absolutely must work.
 *
 * Exits non-zero on any failure so the deploy workflow surfaces it.
 *
 * Override base URLs:
 *   SMOKE_BASE_URL=https://staging.listingaudit.tools \
 *   SMOKE_API_BASE_URL=https://api.staging.listingaudit.tools \
 *   node scripts/smoke.mjs
 */

const BASE = process.env.SMOKE_BASE_URL ?? 'https://listingaudit.tools';
const API_BASE = process.env.SMOKE_API_BASE_URL ?? 'https://api.listingaudit.tools';

const checks = [
  {
    name: 'landing returns HTML with the H1',
    url: '/',
    contentType: 'text/html',
    body: 'Audit any listing in 30 seconds',
  },
  {
    name: 'about page renders',
    url: '/about/',
    contentType: 'text/html',
    body: 'How the scoring works',
  },
  {
    name: 'cities directory renders',
    url: '/audit/cities/',
    contentType: 'text/html',
    body: 'Audit your listing by city',
  },
  {
    name: 'austin city page renders',
    url: '/audit/cities/austin/',
    contentType: 'text/html',
    body: 'Austin',
  },
  {
    name: 'blog index renders',
    url: '/blog/',
    contentType: 'text/html',
    body: 'Playbooks',
  },
  {
    name: 'sitemap is served',
    url: '/sitemap-index.xml',
    contentType: 'xml',
    body: '<sitemap',
  },
  {
    name: 'robots.txt is served',
    url: '/robots.txt',
    contentType: 'text/plain',
    body: 'Sitemap',
  },
  {
    name: 'api health',
    base: API_BASE,
    url: '/api/health',
    contentType: 'application/json',
    body: '"ok"',
  },
];

let failures = 0;
for (const check of checks) {
  const url = `${check.base ?? BASE}${check.url}`;
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'listingaudit-smoke/0.1' } });
    if (!res.ok) {
      console.error(`✗ ${check.name} — ${res.status} ${res.statusText} (${url})`);
      failures += 1;
      continue;
    }
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes(check.contentType)) {
      console.error(`✗ ${check.name} — content-type ${ct} did not include ${check.contentType} (${url})`);
      failures += 1;
      continue;
    }
    const body = await res.text();
    if (!body.includes(check.body)) {
      console.error(`✗ ${check.name} — body did not include "${check.body}" (${url})`);
      failures += 1;
      continue;
    }
    console.log(`✓ ${check.name}`);
  } catch (err) {
    console.error(`✗ ${check.name} — fetch error: ${err.message ?? err}`);
    failures += 1;
  }
}

if (failures > 0) {
  console.error(`\n${failures} smoke check(s) failed.`);
  process.exit(1);
}
console.log('\nAll smoke checks passed.');
