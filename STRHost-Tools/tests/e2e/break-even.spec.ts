import { test, expect } from '@playwright/test';

test.describe('Break-even calculator', () => {
  test('loads with feasible defaults, shows break-even occupancy', async ({ page }) => {
    await page.goto('/break-even-calculator');

    await expect(page.getByRole('heading', { name: /break-even occupancy calculator/i, level: 1 })).toBeVisible();
    await expect(page.getByText(/Break-even nights/i).first()).toBeVisible();
    await expect(page.getByText(/Break-even occupancy/i).first()).toBeVisible();
  });

  test('flags infeasible scenario when ADR is too low', async ({ page }) => {
    // ADR 50, cleaning 200 -> net per night = 50*0.97 - 200 = -151.5; not feasible
    await page.goto('/break-even-calculator?adr=50&clean=200');
    await expect(page.getByText(/Not feasible at this ADR/i).first()).toBeVisible();
  });

  test('persists ADR change to URL', async ({ page }) => {
    await page.goto('/break-even-calculator');
    await page.getByLabel('ADR (avg nightly rate)').fill('250');
    await page.waitForTimeout(300);
    await expect(page).toHaveURL(/adr=250/);
  });
});
