import { test, expect } from '@playwright/test';

test.describe('Linen par calculator', () => {
  test('renders sheet/towel counts and updates on input change', async ({ page }) => {
    await page.goto('/linen-par/');
    await expect(page.locator('h1')).toHaveText(/Linen Par/i);
    // Sheets section heading.
    await expect(page.getByText('Sheets', { exact: true })).toBeVisible();
    await expect(page.getByText('Towels', { exact: true })).toBeVisible();
    // Change bedrooms; numbers should update.
    const bedrooms = page.locator('input[type="number"]').first();
    await bedrooms.fill('5');
    await page.waitForTimeout(300);
    // The "total sheet sets" line still renders (no NaN) — pull a font-mono number.
    const totalSheets = page.locator('span.num.text-navy.text-h3').first();
    await expect(totalSheets).toBeVisible();
    const text = (await totalSheets.textContent())?.trim() ?? '';
    expect(Number(text)).toBeGreaterThan(0);
  });
});
