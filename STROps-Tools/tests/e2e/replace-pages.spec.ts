import { test, expect } from '@playwright/test';

// 5 sample slugs: queen-mattress + 55in-tv have MDX (long-form narrative);
// the others are programmatic-only. AffiliateCard renders on every page.
const SAMPLE_SLUGS = [
  'queen-mattress',
  '55in-tv',
  'king-mattress',
  'sofa',
  'nightstand',
];

test.describe('Replace programmatic pages', () => {
  for (const slug of SAMPLE_SLUGS) {
    test(`/replace/${slug} renders heading + price tiers + AffiliateCard`, async ({ page }) => {
      await page.goto(`/replace/${slug}/`);
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      const heading = await h1.textContent();
      expect(heading?.trim().length ?? 0).toBeGreaterThan(0);
      // Cost-tier card heading exists.
      await expect(page.getByText('Mid (recommended)', { exact: false })).toBeVisible();
      // Lede contains a dollar range.
      const lede = page.locator('p.text-lead').first();
      await expect(lede).toContainText('$');
      // AffiliateCard renders (every replacement page maps a vendor by category).
      await expect(page.locator('aside.affiliate-card')).toBeVisible();
      await expect(page.locator('a[data-affiliate-link]').first()).toBeVisible();
    });
  }
});
