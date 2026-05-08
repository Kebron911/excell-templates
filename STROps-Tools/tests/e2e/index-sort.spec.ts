import { test, expect } from '@playwright/test';

/**
 * Index page smokes — assert the sortable React island actually re-orders
 * rows when a column header is clicked. Both `/maintenance/` and `/replace/`
 * mount the same pattern (MaintenanceIndex / ReplacementIndex from
 * `src/components/programmatic/`) with `client:load` directive.
 */

test.describe('Maintenance index sort', () => {
  test('clicking a header changes row order', async ({ page }) => {
    await page.goto('/maintenance/');
    await expect(page.locator('h1')).toContainText('Maintenance');

    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible();

    // Snapshot first task name before sort.
    const firstBefore = (await rows.first().locator('td').first().textContent())?.trim() ?? '';
    expect(firstBefore.length).toBeGreaterThan(0);

    // Click the Cadence header (sortable th in the index island).
    await page.getByRole('columnheader', { name: /Cadence/i }).click();

    // After the click the order changes (default sort is name asc; cadence asc
    // is a different ordering). Allow the island a tick to re-render.
    await page.waitForTimeout(150);
    const firstAfter = (await rows.first().locator('td').first().textContent())?.trim() ?? '';
    expect(firstAfter.length).toBeGreaterThan(0);
    expect(firstAfter).not.toEqual(firstBefore);
  });
});

test.describe('Replace index sort', () => {
  test('clicking a header changes row order', async ({ page }) => {
    await page.goto('/replace/');
    await expect(page.locator('h1')).toContainText('Replacement');

    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible();

    const firstBefore = (await rows.first().locator('td').first().textContent())?.trim() ?? '';
    expect(firstBefore.length).toBeGreaterThan(0);

    // Default sort is name asc; click "Low" (cost-low column header) to re-sort.
    await page.getByRole('columnheader', { name: /^Low/i }).click();

    await page.waitForTimeout(150);
    const firstAfter = (await rows.first().locator('td').first().textContent())?.trim() ?? '';
    expect(firstAfter.length).toBeGreaterThan(0);
    expect(firstAfter).not.toEqual(firstBefore);
  });
});
