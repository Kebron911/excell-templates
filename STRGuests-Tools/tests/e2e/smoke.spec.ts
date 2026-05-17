import { test, expect } from '@playwright/test';

/**
 * Phase 6 Task 33 — baseline E2E smokes.
 *
 * Per-page test: hits the route, asserts a 200 (no soft-fail to 404), and
 * checks a unique h1 phrase so we catch routing accidents (e.g. wifi-sign
 * silently aliasing to index). Programmatic-template page is included to
 * lock the dynamic route generator.
 */

const PAGES: Array<{ path: string; h1: RegExp }> = [
  { path: '/', h1: /Free tools for hosts to delight guests/ },
  { path: '/house-rules-pdf/', h1: /House Rules PDF Generator/ },
  { path: '/welcome-book/', h1: /Welcome Book Builder/ },
  { path: '/wifi-sign/', h1: /Wi-Fi Sign Generator/ },
  { path: '/check-in-instructions/', h1: /Check-in Instructions PDF/ },
  { path: '/templates/', h1: /Airbnb Message Templates/ },
  { path: '/about/', h1: /Free generators\. No upsell/ },
  { path: '/contact/', h1: /hello@strguests\.tools/ },
  { path: '/get-the-templates/', h1: /Guest Message Template Pack/ },
];

for (const { path, h1 } of PAGES) {
  test(`page loads: ${path}`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status(), `HTTP for ${path}`).toBe(200);
    await expect(page.locator('h1').first()).toContainText(h1);
  });
}

test('a programmatic template page renders with title metadata', async ({ page }) => {
  // Pick any built template slug — the templates index is the source of truth.
  await page.goto('/templates/');
  const firstLink = page.locator('a[href^="/templates/"]').filter({ hasNot: page.locator('[href$="/templates/"]') }).first();
  const href = await firstLink.getAttribute('href');
  expect(href, 'expected at least one programmatic template link').toBeTruthy();

  const response = await page.goto(href!);
  expect(response?.status()).toBe(200);
  // Programmatic pages all use the same template, so just ensure title isn't empty
  // and the template-specific kicker shows up.
  await expect(page).toHaveTitle(/strguests\.tools/);
  await expect(page.locator('h1').first()).not.toBeEmpty();
});

test('cluster cross-links are present on the home page', async ({ page }) => {
  await page.goto('/');
  // Three sister tool sites live in <ClusterFunnelBlock /> (FunnelBand),
  // The STR Ledger lives in the navy footer. Both surfaces must carry the
  // link — losing either silently breaks attribution.
  for (const domain of ['strhost.tools', 'strbuyers.tools', 'strops.tools', 'thestrledger.com']) {
    await expect(
      page.locator(`a[href*="${domain}"]`),
      `expected at least one link to ${domain}`
    ).not.toHaveCount(0);
  }
});

test('robots.txt and sitemap-index.xml are reachable', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Sitemap:');

  const sitemap = await request.get('/sitemap-index.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain('<sitemapindex');
});

test('GA4 snippet renders when PUBLIC_GA4_ID is set at build time', async ({ page }) => {
  // GA4 is now permanently wired across the cluster (see deploy-strguests-tools.yml
  // — secret STRGUESTS_GA4_ID is written to .env before build). The original gate-
  // off assertion is no longer correct. Instead we read STRGuests-Tools/.env (the
  // file the deploy workflow writes) at test time to determine whether GA4 should
  // be in the HTML, and assert accordingly. This works for both CI (writes .env)
  // and local dev (typically has no .env or no PUBLIC_GA4_ID).
  const fs = await import('node:fs');
  const path = await import('node:path');
  let buildGa4Id: string | undefined;
  try {
    const env = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf8');
    const match = env.match(/^PUBLIC_GA4_ID=(G-[A-Z0-9]+)\s*$/m);
    if (match) buildGa4Id = match[1];
  } catch {
    // .env absent — local dev without GA4 wiring. Skip rather than fail.
  }

  await page.goto('/');
  const html = await page.content();

  if (buildGa4Id) {
    expect(html).toContain('googletagmanager.com/gtag/js');
    expect(html).toContain(buildGa4Id);
  } else {
    expect(html).not.toContain('googletagmanager.com/gtag/js');
  }
});
