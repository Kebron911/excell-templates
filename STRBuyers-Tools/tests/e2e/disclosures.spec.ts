/**
 * /disclosures smoke test — confirms FTC-required surfaces render.
 */

import { test, expect } from '@playwright/test';

test('/disclosures renders editorial-independence + 4 vendor categories', async ({ page }) => {
  await page.goto('/disclosures/');

  // Page heading.
  await expect(page.getByRole('heading', { name: /affiliate disclosures/i, level: 1 })).toBeVisible();

  // The "Editorial independence" section heading.
  await expect(page.getByRole('heading', { name: /editorial independence/i })).toBeVisible();

  // All four vendor category labels visible.
  await expect(page.getByText(/DSCR lenders/i).first()).toBeVisible();
  await expect(page.getByText(/STR data & analytics/i).first()).toBeVisible();
  await expect(page.getByText(/STR insurance/i).first()).toBeVisible();
  await expect(page.getByText(/Furniture & staging/i).first()).toBeVisible();
});
