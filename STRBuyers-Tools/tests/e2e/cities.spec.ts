/**
 * City page smoke tests for the 5 sample cities that have MDX in-depth content
 * (austin-tx, nashville-tn, gatlinburg-tn, joshua-tree-ca, park-city-ut).
 *
 * Each test confirms:
 *   - city name renders in the hero
 *   - market score badge visible
 *   - regulation status callout visible
 *   - "Run a Market Score on this city" CTA carries `?city={slug}`
 *   - in-depth analysis MDX content renders
 *   - ClusterFunnelBlock visible
 */

import { test, expect } from '@playwright/test';

const CITIES = [
  { slug: 'austin-tx', name: 'Austin' },
  { slug: 'nashville-tn', name: 'Nashville' },
  { slug: 'gatlinburg-tn', name: 'Gatlinburg' },
  { slug: 'joshua-tree-ca', name: 'Joshua Tree' },
  { slug: 'park-city-ut', name: 'Park City' },
];

for (const city of CITIES) {
  test.describe(`/cities/${city.slug}`, () => {
    test(`renders hero, score badge, regulation callout, CTA, MDX, cluster funnel`, async ({ page }) => {
      await page.goto(`/cities/${city.slug}`);

      // Hero — h1 contains the city name.
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(city.name);

      // Market score badge — text "Score 12/100 · Strong/Mixed/Weak"
      await expect(page.getByText(/Score \d+\/100/i)).toBeVisible();

      // Regulation callout — "Regulation status — {label}" heading inside the aside.
      await expect(page.getByText(/Regulation status —/i).first()).toBeVisible();

      // CTA carries ?city={slug}.
      const cta = page.getByRole('link', { name: new RegExp(`Run a Market Score on ${city.name}`, 'i') });
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute('href', new RegExp(`/market-score\\?city=${city.slug}$`));

      // MDX in-depth content — the 5 sample cities have an "In-depth analysis" section.
      await expect(page.getByRole('heading', { name: /in-depth analysis/i, level: 2 })).toBeVisible();

      // ClusterFunnelBlock.
      await expect(page.getByTestId('cluster-funnel-block')).toBeVisible();
    });
  });
}
