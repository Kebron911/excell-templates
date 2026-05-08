import { test, expect } from '@playwright/test';

const TOOL_NAMES = [
  'Turnover scheduler',
  'Cleaner dispatch',
  'Smart lock codes',
  'Linen par',
  'Restock',
  'Damage cost',
  'Maintenance',
];

const MAGNETS = [
  /Cleaner SOP/i,
  /Supply Par-Level/i,
  /Maintenance Checklist/i,
];

test.describe('Landing page', () => {
  test('renders 7-tool grid + lead-magnet teasers + cluster funnel', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Free tools for active short-term rental operators');

    // Scope to <main> — header nav also lists tool names inside a hidden
    // dropdown, so a page-wide getByText surfaces hidden nodes first.
    const main = page.locator('main');
    for (const name of TOOL_NAMES) {
      await expect(main.getByText(name, { exact: false }).first()).toBeVisible();
    }

    for (const m of MAGNETS) {
      await expect(main.getByText(m).first()).toBeVisible();
    }

    // ClusterFunnelBlock — sister-cluster footer block lists the four sites.
    await expect(page.getByText('strhost.tools', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('strguests.tools', { exact: false }).first()).toBeVisible();
  });
});
