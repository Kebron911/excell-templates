import { test, expect } from '@playwright/test';

test.describe('Cleaner dispatch', () => {
  test('renders default assignments and triggers PDF download', async ({ page }) => {
    await page.goto('/cleaner-dispatch/');
    await expect(page.locator('h1')).toHaveText(/Cleaner Dispatch/i);
    // Default turnovers + cleaners produce assignments.
    await expect(page.locator('table tbody tr').first()).toBeVisible();
    // Click PDF download — Playwright captures the download event.
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15_000 }),
      page.getByRole('button', { name: /Download dispatch sheet/i }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/^dispatch-.*\.pdf$/);
  });
});
