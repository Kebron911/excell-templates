import { test, expect } from '@playwright/test';
import { assertChrome, collectConsoleErrors } from './helpers';

// MDX-override slugs from src/content/maintenance/.
// Hits both the programmatic template and the narrative MDX wrapper.
const slugs = [
  'hvac-filter-change',
  'smoke-detector-test',
  'dryer-vent-clean',
  'gutter-clean',
  'mattress-flip',
];

for (const slug of slugs) {
  test(`maintenance/${slug} renders narrative + dynamic content`, async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const response = await page.goto(`/maintenance/${slug}/`);
    expect(response?.status()).toBe(200);
    // Title contains the lowercased task name (slug words are present in the
    // task's `name` field per data/tasks.json).
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/airbnb/i);
    await assertChrome(page);
    // Lead paragraph from the template references cadence in days.
    await expect(page.locator('p.lead')).toContainText(/days/i);
    // FAQ section exists (programmatic content piece).
    await expect(page.locator('article h2', { hasText: /faq/i })).toBeVisible();
    expect(errors, errors.join('\n')).toEqual([]);
  });
}
