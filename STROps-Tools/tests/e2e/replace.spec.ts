import { test, expect } from '@playwright/test';
import { assertChrome, collectConsoleErrors } from './helpers';

// MDX-override slugs from src/content/replacement/.
const slugs = [
  'queen-mattress',
  'tv-55-inch',
  'sofa-3-seat',
  'sheets-queen-set',
  'smart-lock',
];

for (const slug of slugs) {
  test(`replace/${slug} renders narrative + cost data`, async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const response = await page.goto(`/replace/${slug}/`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/cost to replace/i);
    await assertChrome(page);
    // Lead paragraph from the template renders dollar cost range.
    await expect(page.locator('p.lead')).toContainText(/\$\d/);
    // FAQ section exists.
    await expect(page.locator('article h2', { hasText: /faq/i })).toBeVisible();
    expect(errors, errors.join('\n')).toEqual([]);
  });
}
