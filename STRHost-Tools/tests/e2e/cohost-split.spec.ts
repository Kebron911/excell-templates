import { test, expect } from '@playwright/test';

test.describe('Co-host split calculator', () => {
  test('loads in percent mode, shows split rows', async ({ page }) => {
    await page.goto('/cohost-split-calculator');

    await expect(page.getByRole('heading', { name: /co-host split calculator/i, level: 1 })).toBeVisible();
    await expect(page.getByText(/Cohost share/i).first()).toBeVisible();
    await expect(page.getByText(/Owner share/i).first()).toBeVisible();
  });

  test('toggles to flat mode and persists in URL', async ({ page }) => {
    await page.goto('/cohost-split-calculator');

    // Click "Flat fees" toggle button
    await page.getByRole('button', { name: /flat fees/i }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveURL(/mode=flat/);

    // Flat-mode-specific fields should now be visible
    await expect(page.getByLabel('Per-booking fee')).toBeVisible();
    await expect(page.getByLabel('Per-night fee')).toBeVisible();
  });

  test('seeds from URL on load (flat mode + custom fees)', async ({ page }) => {
    await page.goto('/cohost-split-calculator?mode=flat&fee=75&pn=8');
    await expect(page.getByLabel('Per-booking fee')).toHaveValue('75');
    await expect(page.getByLabel('Per-night fee')).toHaveValue('8');
  });
});
