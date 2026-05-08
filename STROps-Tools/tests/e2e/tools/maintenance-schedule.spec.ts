import { test, expect } from '@playwright/test';

test.describe('Maintenance schedule', () => {
  test('triggers PDF download', async ({ page }) => {
    await page.goto('/maintenance-schedule/');
    await expect(page.locator('h1')).toHaveText(/Maintenance Schedule/i);
    // Default form should produce events (HVAC enabled).
    await expect(page.locator('table tbody tr').first()).toBeVisible();
    const [pdf] = await Promise.all([
      page.waitForEvent('download', { timeout: 15_000 }),
      page.getByRole('button', { name: /Download schedule \(PDF\)/i }).click(),
    ]);
    expect(pdf.suggestedFilename()).toMatch(/^maintenance-schedule-.*\.pdf$/);
  });

  test('triggers .ics download', async ({ page }) => {
    await page.goto('/maintenance-schedule/');
    await expect(page.locator('table tbody tr').first()).toBeVisible();
    const [ics] = await Promise.all([
      page.waitForEvent('download', { timeout: 15_000 }),
      page.getByRole('button', { name: /Add to calendar \(\.ics\)/i }).click(),
    ]);
    expect(ics.suggestedFilename()).toMatch(/^maintenance-schedule-.*\.ics$/);
  });
});
