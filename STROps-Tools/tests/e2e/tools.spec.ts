import { test, expect } from '@playwright/test';
import { assertChrome, collectConsoleErrors } from './helpers';

const tools = [
  '/turnover-scheduler/',
  '/cleaner-dispatch/',
  '/smart-lock-codes/',
  '/linen-par-calculator/',
  '/restock-calculator/',
  '/damage-cost-lookup/',
  '/maintenance-schedule/',
];

for (const route of tools) {
  test(`tool ${route} renders chrome + calculator shell`, async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await assertChrome(page);
    await expect(page.locator('.calculator-shell')).toBeVisible();
    expect(errors, errors.join('\n')).toEqual([]);
  });
}

test('turnover-scheduler updates URL on input', async ({ page }) => {
  await page.goto('/turnover-scheduler/');
  // Wait for hydration — the calculator shell mounts via client:load.
  await expect(page.locator('.calculator-shell')).toBeVisible();
  await page
    .locator('input[type="number"]')
    .first()
    .fill('6');
  await page.waitForFunction(() => /turnoverHours.*6|6.*turnoverHours/.test(window.location.search), null, {
    timeout: 5000,
  });
  // Result table renders.
  await expect(page.locator('table').first()).toBeVisible();
});

test('cleaner-dispatch shows dispatch table after hydration', async ({ page }) => {
  await page.goto('/cleaner-dispatch/');
  await expect(page.locator('.calculator-shell')).toBeVisible();
  await expect(page.getByRole('button', { name: /download dispatch sheet/i })).toBeVisible();
  // Default state seeds 2 turnovers, so the assignment table should render rows.
  const rows = page.locator('.calculator-shell table tbody tr');
  await expect(rows.first()).toBeVisible();
});

test('smart-lock-codes is deterministic across reload', async ({ page }) => {
  await page.goto('/smart-lock-codes/?secret=test-secret&digits=6&bookings=B-1');
  await expect(page.locator('.calculator-shell')).toBeVisible();
  const codeCell = page.locator('table tbody tr td.mono.num').first();
  await expect(codeCell).toBeVisible();
  const code1 = (await codeCell.textContent())?.trim();
  await page.reload();
  await expect(page.locator('.calculator-shell')).toBeVisible();
  const code2 = (await page.locator('table tbody tr td.mono.num').first().textContent())?.trim();
  expect(code1).toBeTruthy();
  expect(code1).toBe(code2);
});

test('linen-par-calculator updates result on input', async ({ page }) => {
  await page.goto('/linen-par-calculator/');
  await expect(page.locator('.calculator-shell')).toBeVisible();
  // Default: 3 bedrooms × 3 sets/bed = 9 sheet sets.
  await expect(page.locator('.calculator-shell .num.font-semibold').first()).toContainText(/\d/);
  await page.locator('input[type="number"]').first().fill('5');
  await page.waitForFunction(() => /bedrooms.*5|5.*bedrooms/.test(window.location.search), null, {
    timeout: 5000,
  });
});

test('restock-calculator renders item totals', async ({ page }) => {
  await page.goto('/restock-calculator/');
  await expect(page.locator('.calculator-shell')).toBeVisible();
  // Default seeds 4 items → 4 result rows.
  const rows = page.locator('.calculator-shell table tbody tr');
  await expect(rows).toHaveCount(4);
});

test('damage-cost-lookup row click navigates to /replace/[item]', async ({ page }) => {
  await page.goto('/damage-cost-lookup/');
  await expect(page.locator('.calculator-shell')).toBeVisible();
  await page.getByText(/queen mattress/i).first().click();
  await expect(page).toHaveURL(/\/replace\/queen-mattress\/?$/);
});

test('maintenance-schedule shows download buttons', async ({ page }) => {
  await page.goto('/maintenance-schedule/');
  await expect(page.locator('.calculator-shell')).toBeVisible();
  await expect(page.getByRole('button', { name: /download schedule/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /download calendar/i })).toBeVisible();
});
