import { test, expect } from '@playwright/test';

test.describe('Restock calculator', () => {
  test('renders reorder table and exposes copy-to-clipboard action', async ({ page }) => {
    await page.goto('/restock-calculator/');
    await expect(page.locator('h1')).toHaveText(/Restock/i);
    // Reorder table populated from default items.
    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible();
    // Copy reorder list button is enabled (has at least one item).
    const copyBtn = page.getByRole('button', { name: /Copy reorder list/i });
    await expect(copyBtn).toBeEnabled();
  });
});
