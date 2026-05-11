# strbuyers.tools — Blog roadmap

**Date:** 2026-05-11
**Status:** 2 of 8 originally-promised slugs published

---

## Why this file exists

The pre-Move-1 sitemap declared 8 `/blog/<slug>/` URLs that didn't exist as source
pages — every URL returned 404. Move 1 (commit `c9abb31`) added a sitemap filter
excluding `/blog/*` as a stopgap.

This roadmap turns the stopgap into a real publishing plan:

- 2 slugs **published** in `src/content/posts/` (the highest-revenue topics)
- 6 slugs **planned**, with a stub MDX **not** created (to avoid thin-content HCU risk)
- Sitemap filter removed (commit lands with this file) — sitemap now reflects only
  the 2 published posts + the index. The 6 planned slugs are intentionally absent
  from both the sitemap and the live site until their MDX ships.

---

## Published

| Slug | Category | Maps to | Status |
|---|---|---|---|
| `dscr-loan-vs-conventional-for-airbnb` | financing | /dscr-loan-calculator/ | published 2026-05-11 |
| `year-1-airbnb-startup-costs` | startup-costs | /year-1-cash-needs/ + /furnishing-budget-calculator/ | published 2026-05-11 |

---

## Planned

Slugs from the original sitemap promise. Each maps to a calculator on the
site and unlocks a piece of the SEO funnel. Recommended order:

| # | Slug | Category | Maps to | Why prioritize |
|---|---|---|---|---|
| 1 | `how-much-down-payment-for-airbnb` | financing | /down-payment-calculator/ | High volume, broad informational intent |
| 2 | `analyzing-airbnb-comps-before-you-buy` | underwriting | /comp-analyzer/ | Highest-intent buyer query |
| 3 | `cash-on-cash-return-good-numbers-for-strs` | underwriting | /cash-on-cash-calculator/ | Returns-benchmark search demand |
| 4 | `why-homeowners-insurance-wont-cover-your-airbnb` | insurance | (affiliate: Proper, Steadily) | Direct affiliate revenue |
| 5 | `reading-an-str-ordinance-before-you-buy` | regulation | /cities/ | Connects to 219-city corpus |
| 6 | `airbnb-furnishing-budget-realistic-ranges` | startup-costs | /furnishing-budget-calculator/ | Affiliate (Stage by Hand, Minoan) |

## Publishing standard

Each post should:

- 700–1,500 words
- Open with the 60-second answer
- Include at least one formula or table
- Link to 2+ calculators on the site
- End with "What this connects to" linking to related calculators and (when
  ready) other published posts
- Use one of the 6 categories defined in `src/content.config.ts`
- Frontmatter requires: title, description, datePublished, category, keyword,
  readMinutes, optional relatedTools

## Verification before publish

- `pnpm astro check` → 0 errors
- `pnpm astro build` → confirms slug appears in `dist/sitemap-0.xml`
- Manual smoke test of `/blog/<slug>/` route

When all 8 ship, this file can be archived.
