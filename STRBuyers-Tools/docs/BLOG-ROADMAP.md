# strbuyers.tools — Blog roadmap

**Date:** 2026-05-12
**Status:** 8 of 8 originally-promised slugs published — roadmap complete

---

## Why this file exists (historical)

The pre-Move-1 sitemap declared 8 `/blog/<slug>/` URLs that didn't exist
as source pages — every URL returned 404. Move 1 (commit `c9abb31`)
filtered `/blog/*` out of the sitemap as a stopgap. The 2026-05-11 blog
scaffold commit (`deea901`) added the index/[slug] pages + content
collection + 2 seed posts. **This commit** (the one accompanying this
file update) finishes the original 8-slug promise.

---

## Published

| Slug | Category | Maps to |
|---|---|---|
| `dscr-loan-vs-conventional-for-airbnb` | financing | /dscr-loan-calculator/ |
| `year-1-airbnb-startup-costs` | startup-costs | /year-1-cash-needs/ + /furnishing-budget-calculator/ |
| `how-much-down-payment-for-airbnb` | financing | /down-payment-calculator/ |
| `analyzing-airbnb-comps-before-you-buy` | underwriting | /comp-analyzer/ |
| `cash-on-cash-return-good-numbers-for-strs` | underwriting | /cash-on-cash-calculator/ |
| `why-homeowners-insurance-wont-cover-your-airbnb` | insurance | (affiliate: Proper, Steadily) |
| `reading-an-str-ordinance-before-you-buy` | regulation | /cities/ + /market-score/ |
| `airbnb-furnishing-budget-realistic-ranges` | startup-costs | /furnishing-budget-calculator/ |

All 8 emit `Article` + `BreadcrumbList` JSON-LD via the [slug].astro
route. All link to relevant calculators in the body and a "What this
connects to" closer.

---

## Publishing standard (unchanged)

- 700–1,500 words
- Open with the 60-second answer
- Include at least one formula or table
- Link to 2+ calculators on the site
- End with "What this connects to" linking to related calculators and
  other published posts
- Use one of the 6 categories defined in `src/content.config.ts`
- Frontmatter requires: title, description, datePublished, category,
  keyword, readMinutes, optional relatedTools

## Future expansion ideas

Topics worth writing if the calculator catalog grows:

- **"STR cash-flow vs long-term rental: when each wins"** — for buyers
  choosing between rental strategies on the same property.
- **"Why your AirDNA Property Earnings Report is optimistic"** — the
  comp-method post's natural follow-up; data integrity for buyers.
- **"What your CPA needs to know about the STR loophole before you
  buy"** — bridges to thestrledger.com's TAX-001 / TAX-002.
- **"Acquisition pace: buying STRs back-to-back vs. spacing them"** —
  reserves + DSCR-tier interaction.
- **"How AirCover and your insurance fight at the same claim"** —
  follow-up to the homeowners-won't-cover post.

These are optional and not on a sitemap promise. No filter changes
needed when they ship.
