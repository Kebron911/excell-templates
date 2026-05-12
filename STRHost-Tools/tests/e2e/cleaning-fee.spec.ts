import { test, expect } from '@playwright/test';

test.describe('Cleaning fee calculator', () => {
  test('loads, accepts hours change, persists to URL', async ({ page }) => {
    await page.goto('/cleaning-fee-calculator/');

    await expect(page.getByRole('heading', { name: /cleaning fee calculator/i, level: 1 })).toBeVisible();
    await expect(page.getByText(/Recommended cleaning fee/i).first()).toBeVisible();

    await page.getByLabel('Hours per turnover').fill('5');
    await page.waitForTimeout(300);
    await expect(page).toHaveURL(/hr=5/);
  });

  test('seeds from URL on load', async ({ page }) => {
    await page.goto('/cleaning-fee-calculator/?hr=6&rate=30');
    await expect(page.getByLabel('Hours per turnover')).toHaveValue('6');
    await expect(page.getByLabel('Hourly rate')).toHaveValue('30');
  });
});
