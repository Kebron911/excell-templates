import { test, expect } from '@playwright/test';

test.describe('Smart lock codes', () => {
  test('renders deterministic code for fixed booking + secret', async ({ page }) => {
    // Pre-load URL state so the form posts hydrate to the test scenario.
    // Computed expected: HMAC-SHA-256("B-1001", "test-secret-e2e") mod 10^6 = "915559"
    const params = new URLSearchParams({
      secret: 'test-secret-e2e',
      digits: '6',
      bookings: 'B-1001',
    });
    await page.goto(`/smart-lock-codes/?${params.toString()}`);
    await expect(page.locator('h1')).toHaveText(/Smart Lock/i);
    // Wait for async crypto.subtle compute to populate the table.
    const codeCell = page.locator('table tbody tr td.font-mono.num').first();
    await expect(codeCell).toHaveText('915559', { timeout: 10_000 });
  });
});
