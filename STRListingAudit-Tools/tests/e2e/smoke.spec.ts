/**
 * E2E smoke — runs against the Astro preview build.
 *
 * No API mocking. The AuditForm submit path is asserted only at the
 * client-validation layer (no real POST to /api/audit since the API
 * server isn't started in CI). Full audit pipeline E2E with mocked
 * Apify+Anthropic lands in Phase 4b once the email-gated PDF surface
 * needs end-to-end verification.
 */

import { test, expect } from '@playwright/test';

test('landing page renders with hero + audit form + FAQ', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Audit any listing in 30 seconds');
  await expect(page.locator('#audit-url')).toBeVisible();
  await expect(page.getByRole('button', { name: /Audit listing/i })).toBeVisible();
  await expect(page.getByText('FAQ')).toBeVisible();
});

test('audit form client-validates a bad URL', async ({ page }) => {
  await page.goto('/');
  const input = page.locator('#audit-url');
  await input.fill('https://example.com/not-a-listing');
  await page.locator('#audit-submit').click();
  await expect(page.locator('#audit-error')).toContainText(/Airbnb or Vrbo/i);
});

test('about page renders the methodology', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('grade your listing');
  await expect(page.getByText('Title (0–100)')).toBeVisible();
  await expect(page.getByText('Reviews (0–100)')).toBeVisible();
});

test('city directory and a city page render', async ({ page }) => {
  await page.goto('/audit/cities/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Audit your listing by city');
  await page.getByRole('link', { name: /Austin/i }).first().click();
  await expect(page.url()).toContain('/audit/cities/austin');
  await expect(page.locator('#audit-url')).toBeVisible();
});

test('blog index renders with all 5 posts', async ({ page }) => {
  await page.goto('/blog/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Short reads');
  const posts = page.locator('li a');
  await expect(posts).toHaveCount(5);
});

test('robots.txt + sitemap reachable', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain('Sitemap');
  const sitemap = await request.get('/sitemap-index.xml');
  expect(sitemap.ok()).toBe(true);
});

test('GA4 gate-off — no gtag snippet when PUBLIC_GA4_ID is unset', async ({ page }) => {
  await page.goto('/');
  const html = await page.content();
  // CI build runs with no PUBLIC_GA4_ID secret; the gtag injection in
  // @str/ui-chrome/Layout.astro is env-gated and should be absent.
  expect(html).not.toContain('https://www.googletagmanager.com/gtag/js');
});
