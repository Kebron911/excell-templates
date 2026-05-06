import { test, expect } from '@playwright/test';

test.describe('Lodging tax — index + per-state', () => {
  test('index lists all 51 states', async ({ page }) => {
    await page.goto('/lodging-tax');
    await expect(page.getByRole('heading', { name: /lodging tax by state/i, level: 1 })).toBeVisible();

    // Spot-check a few states
    await expect(page.getByRole('link', { name: 'Texas' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'California' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'District of Columbia' })).toBeVisible();

    // Table should have 51 data rows
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(51);
  });

  test('Texas page loads and accepts subtotal change', async ({ page }) => {
    await page.goto('/lodging-tax/tx');

    await expect(page.getByRole('heading', { name: /texas lodging tax calculator/i, level: 1 })).toBeVisible();
    await expect(page.getByText(/Effective rate/i)).toBeVisible();
    await expect(page.getByText(/Guest total/i)).toBeVisible();

    await page.getByLabel('Booking subtotal').fill('2000');
    await page.waitForTimeout(300);
    await expect(page).toHaveURL(/sub=2000/);

    // Back-to-index link works
    await page.getByRole('link', { name: /all states/i }).click();
    await expect(page).toHaveURL(/\/lodging-tax$/);
  });

  test('per-state pages render the auto-template fallback for non-MDX states', async ({ page }) => {
    // AL has no hand-authored MDX -> falls back to template
    await page.goto('/lodging-tax/al');
    await expect(page.getByRole('heading', { name: /alabama lodging tax calculator/i, level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: /how alabama lodging tax works/i, level: 2 })).toBeVisible();
  });
});
