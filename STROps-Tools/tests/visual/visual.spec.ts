import { test, expect } from '@playwright/test';

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'turnover', path: '/turnover-scheduler' },
  { name: 'cleaner-dispatch', path: '/cleaner-dispatch' },
  { name: 'maintenance-task', path: '/maintenance/dryer-vent-clean/' },
  { name: 'blog-post', path: '/blog/airbnb-turnover-gap/' },
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
