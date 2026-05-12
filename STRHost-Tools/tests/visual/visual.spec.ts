import { test, expect } from '@playwright/test';

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'profit', path: '/profit-calculator' },
  { name: 'revpar', path: '/revpar-calculator' },
  { name: 'cohost', path: '/cohost-split-calculator' },
  { name: 'lodging-tax-state', path: '/lodging-tax/ca/' },
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
