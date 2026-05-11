import { test, expect } from '@playwright/test';

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'house-rules', path: '/house-rules-pdf' },
  { name: 'check-in', path: '/check-in-instructions' },
  { name: 'wifi-sign', path: '/wifi-sign' },
  { name: 'welcome-book', path: '/welcome-book' },
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
