import { expect, type Page } from '@playwright/test';

/**
 * Asserts the canonical chrome is present on the page (header, footer,
 * funnel band) and that no uncaught console errors fired during load.
 *
 * Usage:
 *   const errors = collectConsoleErrors(page);
 *   await page.goto(route);
 *   await assertChrome(page);
 *   expect(errors).toEqual([]);
 */
export async function assertChrome(page: Page): Promise<void> {
  await expect(page.locator('header.site-header')).toBeVisible();
  await expect(page.locator('footer.site-footer')).toBeVisible();
  await expect(page.locator('.funnel-band')).toBeVisible();
}

/**
 * Collects uncaught console errors. Returns the live array — read it after
 * navigation has settled. Filters known-noisy benign messages (favicon 404 in
 * preview, etc.).
 */
export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    // Browsers log a generic 'Failed to load resource' line for any 404. The
    // canonical chrome assertion is what proves the page rendered; resource
    // 404s in preview (missing OG images, etc.) are not regressions for a
    // smoke test.
    if (/Failed to load resource/i.test(text)) return;
    errors.push(text);
  });
  page.on('pageerror', (err) => {
    errors.push(err.message);
  });
  return errors;
}
