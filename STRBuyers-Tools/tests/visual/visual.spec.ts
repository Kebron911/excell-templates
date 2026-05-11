import { test, expect } from '@playwright/test';

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'cash-on-cash', path: '/cash-on-cash-calculator' },
  { name: 'comp-analyzer', path: '/comp-analyzer' },
  { name: 'cities-index', path: '/cities/' },
  { name: 'city-detail', path: '/cities/asheville-nc/' },
];

for (const page of PAGES) {
  test(`visual: ${page.name}`, async ({ page: pwPage }) => {
    await pwPage.goto(page.path);
    await pwPage.waitForLoadState('networkidle');
    await expect(pwPage).toHaveScreenshot(`${page.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.001,
    });
  });
}
