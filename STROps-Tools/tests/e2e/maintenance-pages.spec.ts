import { test, expect } from '@playwright/test';

const SAMPLE_SLUGS = [
  'hvac-filter-change',
  'ac-tune-up',
  'smoke-detector-test',
  'furnace-tune-up',
  'mini-split-clean',
];

test.describe('Maintenance programmatic pages', () => {
  for (const slug of SAMPLE_SLUGS) {
    test(`/maintenance/${slug} renders`, async ({ page }) => {
      await page.goto(`/maintenance/${slug}/`);
      // h1 exists, non-empty
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      const heading = await h1.textContent();
      expect(heading?.trim().length ?? 0).toBeGreaterThan(0);
      // Back-link to /maintenance/ index
      await expect(page.locator('a[href="/maintenance/"]').first()).toBeVisible();
    });
  }
});
