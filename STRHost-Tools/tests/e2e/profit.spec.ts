import { test, expect } from '@playwright/test';

test.describe('Profit calculator', () => {
  test('loads, accepts ADR change, persists to URL', async ({ page }) => {
    await page.goto('/profit-calculator');

    await expect(page.getByRole('heading', { name: /profit calculator/i, level: 1 })).toBeVisible();
    await expect(page.getByText(/Net profit/i).first()).toBeVisible();
    await expect(page.getByText(/Profit margin/i).first()).toBeVisible();

    // ADR -> 250
    await page.getByLabel('ADR (avg nightly rate)').fill('250');
    await page.waitForTimeout(300);
    await expect(page).toHaveURL(/adr=250/);
  });

  test('seeds from URL on load', async ({ page }) => {
    await page.goto('/profit-calculator?adr=300&nights=22');
    await expect(page.getByLabel('ADR (avg nightly rate)')).toHaveValue('300');
    await expect(page.getByLabel('Nights booked')).toHaveValue('22');
  });
});
