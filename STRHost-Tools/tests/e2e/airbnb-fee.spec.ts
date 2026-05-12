import { test, expect } from '@playwright/test';

test.describe('Airbnb fee calculator', () => {
  test('loads, accepts input, persists to URL, copies share link', async ({ page, context }) => {
    await page.goto('/airbnb-fee-calculator/');

    // Page renders
    await expect(page.getByRole('heading', { name: /airbnb fee calculator/i, level: 1 })).toBeVisible();

    // Result panel visible
    await expect(page.getByText(/Guest pays/i).first()).toBeVisible();
    await expect(page.getByText(/You receive/i).first()).toBeVisible();

    // Change nightly rate to 250 -> URL updates after debounce
    await page.getByLabel('Nightly rate').fill('250');
    await page.waitForTimeout(300); // 200ms debounce + headroom
    await expect(page).toHaveURL(/nightly=250/);

    // Share link copies current URL to clipboard
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByRole('button', { name: /copy share link/i }).click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain('nightly=250');
  });

  test('seeds from URL on load', async ({ page }) => {
    await page.goto('/airbnb-fee-calculator/?nightly=300&nights=5&cleaning=150');
    await expect(page.getByLabel('Nightly rate')).toHaveValue('300');
    await expect(page.getByLabel('Nights')).toHaveValue('5');
    await expect(page.getByLabel('Cleaning fee')).toHaveValue('150');
  });
});
