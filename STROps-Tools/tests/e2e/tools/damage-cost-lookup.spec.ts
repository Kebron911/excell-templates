import { test, expect } from '@playwright/test';

test.describe('Damage cost lookup', () => {
  test('search filters rows', async ({ page }) => {
    await page.goto('/damage-cost-lookup/');
    await expect(page.locator('h1')).toHaveText(/Damage Cost/i);
    // Initial: many rows present.
    const initial = await page.locator('table tbody tr').count();
    expect(initial).toBeGreaterThan(5);
    // Search for "mattress" — fewer rows, all matching.
    await page.locator('input[placeholder*="mattress"]').fill('mattress');
    // Filter is sync (useMemo) so rows update on next paint.
    await expect(page.locator('table tbody tr').first()).toBeVisible();
    const filtered = page.locator('table tbody tr');
    const filteredCount = await filtered.count();
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThan(initial);
    // Every visible row name contains "mattress" (case-insensitive).
    const names = await filtered.locator('td').first().allTextContents();
    for (const n of names) {
      expect(n.toLowerCase()).toContain('mattress');
    }
  });
});
