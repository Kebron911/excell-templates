/**
 * Cities directory smoke tests — /cities renders ≥ 10 cards, sort + filter +
 * search interactions all work.
 */

import { test, expect, type Page } from '@playwright/test';

function cards(page: Page) {
  // Each city card is an <a href="/cities/{slug}"> inside the cities list.
  return page.locator('section.cities-index a[href^="/cities/"]');
}

test.describe('/cities index page', () => {
  test('renders at least 10 city cards on initial load', async ({ page }) => {
    await page.goto('/cities/');
    await expect(page.getByRole('heading', { name: /STR markets directory/i, level: 1 })).toBeVisible();
    expect(await cards(page).count()).toBeGreaterThanOrEqual(10);
  });

  test('ADR sort puts higher ADR cards above lower ones', async ({ page }) => {
    await page.goto('/cities/');
    await page.locator('select#cities-sort').selectOption('adr');
    await page.waitForTimeout(150);

    const adrCells = page.locator('section.cities-index a[href^="/cities/"]').locator('p:has-text("$")').first();
    await expect(adrCells).toBeVisible();

    // Read ADR text from the first and the fifth card.
    const all = cards(page);
    const firstAdr = await all.nth(0).innerText();
    const fifthAdr = await all.nth(4).innerText();

    const parseAdr = (txt: string): number => {
      const m = txt.match(/\$([\d,]+)/g) ?? [];
      // ADR is the first $ value on each card under the "ADR" label.
      const first = m[0]?.replace(/[^0-9]/g, '') ?? '0';
      return Number(first);
    };

    const a1 = parseAdr(firstAdr);
    const a5 = parseAdr(fifthAdr);
    expect(a1).toBeGreaterThanOrEqual(a5);
  });

  test('Banned regulation filter narrows the list to banned-only', async ({ page }) => {
    await page.goto('/cities/');
    const before = await cards(page).count();
    expect(before).toBeGreaterThan(0);

    await page.getByRole('button', { name: 'Banned', exact: true }).click();
    await page.waitForTimeout(150);

    const after = await cards(page).count();
    expect(after).toBeLessThan(before);

    // Every visible card carries the "Banned" badge.
    const remaining = cards(page);
    const total = await remaining.count();
    for (let i = 0; i < total; i++) {
      await expect(remaining.nth(i)).toContainText(/Banned/i);
    }
  });

  test('Search "tex" narrows to Texas cities only', async ({ page }) => {
    await page.goto('/cities/');
    await page.locator('input#cities-search').fill('tex');
    await page.waitForTimeout(200);

    const remaining = cards(page);
    const total = await remaining.count();
    expect(total).toBeGreaterThan(0);
    for (let i = 0; i < total; i++) {
      await expect(remaining.nth(i)).toContainText(/Texas|TX/i);
    }
  });
});
