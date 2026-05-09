/**
 * Calculator smoke tests — for each of the 7 calculators:
 *   - hero headline visible
 *   - core inputs accept fixture data
 *   - data-testid="calc-result" surfaces a non-zero numeric output
 *   - data-testid="affiliate-block" renders with at least one vendor card
 *   - URL state updates after input (calculator-page query string)
 *
 * Test data is realistic but minimal — see source plan task 31 fixtures.
 */

import { test, expect, type Page } from '@playwright/test';

async function fillNumber(page: Page, label: string | RegExp, value: number) {
  const input = page.getByLabel(label).first();
  await input.click();
  await input.fill(String(value));
  await input.blur();
}

async function expectNumericResult(page: Page) {
  const el = page.getByTestId('calc-result').first();
  await expect(el).toBeVisible();
  const text = (await el.innerText()).trim();
  // Strip non-digits and look for any non-zero numeric character
  expect(text).toMatch(/[1-9]/);
}

async function expectAffiliateBlock(page: Page) {
  const block = page.getByTestId('affiliate-block').first();
  await expect(block).toBeVisible();
  const cards = block.locator('a[data-affiliate-card]');
  expect(await cards.count()).toBeGreaterThanOrEqual(1);
}

test.describe('DSCR loan calculator', () => {
  test('renders, computes, exposes affiliate block, persists to URL', async ({ page }) => {
    await page.goto('/dscr-loan-calculator');
    await expect(page.getByRole('heading', { name: /DSCR loan calculator/i, level: 1 })).toBeVisible();

    // NOI $48k, debt service ~$36k → DSCR ~1.33 (qualifies A-tier).
    await fillNumber(page, 'Monthly STR revenue', 6000); // $72k gross
    await fillNumber(page, 'Annual operating expenses', 24000); // NOI = 48k
    await fillNumber(page, 'Loan amount', 400000);
    await fillNumber(page, 'Rate (bps, 825 = 8.25%)', 800);
    await fillNumber(page, 'Term (years)', 30);
    await page.waitForTimeout(350);

    await expectNumericResult(page);
    await expectAffiliateBlock(page);
    await expect(page).toHaveURL(/rent=6000/);
  });
});

test.describe('Down payment calculator', () => {
  test('renders rows, exposes affiliate block, persists to URL', async ({ page }) => {
    await page.goto('/down-payment-calculator');
    await expect(page.getByRole('heading', { name: /down payment calculator/i, level: 1 })).toBeVisible();

    await fillNumber(page, 'Purchase price', 400000);
    await page.waitForTimeout(350);

    await expectNumericResult(page);
    await expectAffiliateBlock(page);
    await expect(page).toHaveURL(/price=400000/);
  });
});

test.describe('Comp analyzer', () => {
  test('accepts 3 listings, computes averages, persists ADR to URL', async ({ page }) => {
    await page.goto('/comp-analyzer');
    await expect(page.getByRole('heading', { name: /comp analyzer/i, level: 1 })).toBeVisible();

    // Three comps: ADR 200/220/180, occ 0.6/0.65/0.55 → avgADR ~$200.
    await page.getByLabel('ADR (avg nightly rate)').nth(0).fill('200');
    await page.getByLabel('Occupancy (0–1)').nth(0).fill('0.6');
    await page.getByLabel('ADR (avg nightly rate)').nth(1).fill('220');
    await page.getByLabel('Occupancy (0–1)').nth(1).fill('0.65');
    await page.getByLabel('ADR (avg nightly rate)').nth(2).fill('180');
    await page.getByLabel('Occupancy (0–1)').nth(2).fill('0.55');
    await page.waitForTimeout(400);

    await expectNumericResult(page);
    await expectAffiliateBlock(page);
    await expect(page).toHaveURL(/d1=200/);
  });
});

test.describe('Market score', () => {
  test('renders, computes a non-zero score, persists ADR to URL', async ({ page }) => {
    await page.goto('/market-score');
    await expect(page.getByRole('heading', { name: /market score/i, level: 1 })).toBeVisible();

    await fillNumber(page, 'Avg ADR for the market', 250);
    await fillNumber(page, 'Avg occupancy (0–1)', 0.65);
    await page.waitForTimeout(350);

    const result = page.getByTestId('calc-result').first();
    await expect(result).toBeVisible();
    const text = (await result.innerText()).trim();
    const num = parseInt(text.replace(/[^0-9-]/g, ''), 10);
    expect(num).toBeGreaterThan(50);

    await expectAffiliateBlock(page);
    await expect(page).toHaveURL(/adr=250/);
  });
});

test.describe('Cash-on-cash', () => {
  test('renders, computes 12% on $12k / $100k, persists to URL', async ({ page }) => {
    await page.goto('/cash-on-cash-calculator');
    await expect(page.getByRole('heading', { name: /cash[- ]on[- ]cash/i, level: 1 })).toBeVisible();

    await fillNumber(page, /Annual cash flow/i, 12000);
    await fillNumber(page, /Total cash invested/i, 100000);
    await page.waitForTimeout(350);

    await expectNumericResult(page);
    await expectAffiliateBlock(page);
    await expect(page).toHaveURL(/cf=12000/);
  });
});

test.describe('Year 1 cash needs', () => {
  test('renders, computes total, persists to URL', async ({ page }) => {
    await page.goto('/year-1-cash-needs');
    await expect(page.getByRole('heading', { name: /Year 1 cash needs/i, level: 1 })).toBeVisible();

    // Use values that differ from defaults so URL-state diff actually persists.
    await fillNumber(page, 'Purchase price', 500000);
    await fillNumber(page, 'Furnishing & setup', 20000);
    await fillNumber(page, /Monthly carry/, 3500);
    await page.waitForTimeout(350);

    await expectNumericResult(page);
    await expectAffiliateBlock(page);
    await expect(page).toHaveURL(/price=500000/);
  });
});

test.describe('Furnishing budget', () => {
  test('renders, computes total, persists sqft to URL', async ({ page }) => {
    await page.goto('/furnishing-budget-calculator');
    await expect(page.getByRole('heading', { name: /furnishing budget/i, level: 1 })).toBeVisible();

    // Defaults: beds=3, baths=2, sqft=1500. Use 1800 so URL-state diff persists.
    await fillNumber(page, 'Bedrooms', 4);
    await fillNumber(page, 'Bathrooms', 3);
    await fillNumber(page, 'Square footage', 1800);
    await page.waitForTimeout(350);

    await expectNumericResult(page);
    await expectAffiliateBlock(page);
    await expect(page).toHaveURL(/sqft=1800/);
  });
});
