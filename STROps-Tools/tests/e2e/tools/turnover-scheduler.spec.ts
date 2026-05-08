import { test, expect } from '@playwright/test';

test.describe('Turnover scheduler', () => {
  test('renders defaults and reflects edits in URL', async ({ page }) => {
    await page.goto('/turnover-scheduler/');
    await expect(page.locator('h1')).toHaveText(/Turnover Scheduler/i);
    // Default rows produce 2 turnovers (3 bookings on p1).
    const turnoverRows = page.locator('table tbody tr');
    await expect(turnoverRows.first()).toBeVisible();
    // Edit turnoverHours; URL should reflect non-default after debounce.
    const hours = page.locator('input[type="number"]').first();
    await hours.fill('12');
    await page.waitForTimeout(350);
    await expect(page).toHaveURL(/turnoverHours=12/);
  });
});
