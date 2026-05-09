import { test, expect } from '@playwright/test';

test.describe('RevPAR calculator', () => {
  test('loads, accepts revenue change, persists to URL', async ({ page }) => {
    await page.goto('/revpar-calculator');

    await expect(page.getByRole('heading', { name: /revpar calculator/i, level: 1 })).toBeVisible();
    await expect(page.getByText(/Occupancy/i).first()).toBeVisible();
    await expect(page.getByText(/RevPAR/i).first()).toBeVisible();

    await page.getByLabel('Revenue (period)').fill('5000');
    await page.waitForTimeout(300);
    await expect(page).toHaveURL(/rev=5000/);
  });

  test('seeds from URL on load', async ({ page }) => {
    await page.goto('/revpar-calculator?avail=31&booked=25&rev=5000');
    await expect(page.getByLabel('Nights available')).toHaveValue('31');
    await expect(page.getByLabel('Nights booked')).toHaveValue('25');
    await expect(page.getByLabel('Revenue (period)')).toHaveValue('5000');
  });
});
