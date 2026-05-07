/**
 * Per-page smoke tests. One test per generator + landing + templates index.
 * Each test verifies:
 *   - 200 OK
 *   - the h1 heading is visible
 *   - no console errors (filtered against the rate-limit-status fetch warning,
 *     which is expected in dev because the Express server isn't running)
 */

import { test, expect, Page } from '@playwright/test';

const ALLOWED_CONSOLE_PATTERNS: RegExp[] = [
  /AiRateLimitNotice.*status fetch failed/, // expected when Express isn't reachable
  /verify-email.*confirm failed/,
  /Generation budget unavailable/,
];

function setupConsoleErrorCollector(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error' && msg.type() !== 'warning') return;
    const text = msg.text();
    if (ALLOWED_CONSOLE_PATTERNS.some((rx) => rx.test(text))) return;
    errors.push(`[${msg.type()}] ${text}`);
  });
  page.on('pageerror', (err) => {
    errors.push(`[pageerror] ${err.message}`);
  });
  return errors;
}

const PAGES: Array<{ path: string; h1: RegExp }> = [
  { path: '/', h1: /Free tools for hosts/i },
  { path: '/house-rules-pdf', h1: /House Rules PDF Generator/i },
  { path: '/welcome-book', h1: /Welcome Book/i },
  { path: '/wifi-sign', h1: /Wi-?Fi Sign/i },
  { path: '/check-in-instructions', h1: /Check-?in Instructions/i },
  { path: '/listing-description', h1: /Listing Description/i },
  { path: '/review-response', h1: /Review Response/i },
  { path: '/guest-messages', h1: /Guest Message/i },
  { path: '/templates/', h1: /Airbnb Message Templates/i },
  { path: '/about', h1: /Free generators/i },
  { path: '/contact', h1: /hello@strguests\.tools/i },
];

for (const { path, h1 } of PAGES) {
  test(`smoke: ${path}`, async ({ page }) => {
    const errors = setupConsoleErrorCollector(page);
    const res = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(res?.status(), `status for ${path}`).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('h1').first()).toHaveText(h1);
    expect(errors, `console errors on ${path}: ${errors.join(' | ')}`).toEqual([]);
  });
}

test('listing description form is interactive', async ({ page }) => {
  await page.goto('/listing-description', { waitUntil: 'networkidle' });
  // Form fields are present
  await expect(page.getByPlaceholder(/cabin, beach house/i)).toBeVisible();
  // The Generate button exists
  await expect(page.getByRole('button', { name: /Generate listing/i })).toBeVisible();
});

test('review response form has the 5-star segmented control', async ({ page }) => {
  await page.goto('/review-response', { waitUntil: 'networkidle' });
  for (const n of [1, 2, 3, 4, 5]) {
    await expect(page.getByRole('radio', { name: `${n}★` })).toBeVisible();
  }
});

test('message generator exposes all 8 message types', async ({ page }) => {
  await page.goto('/guest-messages', { waitUntil: 'networkidle' });
  for (const label of [
    /Booking confirmation/i,
    /Pre-arrival/i,
    /Mid-stay/i,
    /Post-checkout/i,
    /Late checkout/i,
    /Noise complaint/i,
    /Broken item/i,
    /Refund request/i,
  ]) {
    await expect(page.getByRole('radio', { name: label })).toBeVisible();
  }
});

test('templates index lists multiple scenarios', async ({ page }) => {
  await page.goto('/templates/', { waitUntil: 'networkidle' });
  // At least 10 scenario links rendered (we ship 26; conservative threshold)
  const links = await page.locator('a[href^="/templates/"][href$="/"]').count();
  expect(links).toBeGreaterThanOrEqual(10);
});
