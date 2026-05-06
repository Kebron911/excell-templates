# Bundle Cross-Sell Sequence — Portfolio Bundle

**Bundle:** BUNDLE-04 Portfolio ($397 — saves ~$196 vs ~$593 à la carte) · own-site only
**Trigger:** customer bought TAX-011 individually OR ≥3 individual SKUs in 90 days (signals portfolio operator)
**Tag at entry:** `bundle-cross:portfolio`
**Sequence length:** 3 emails over 14 days
**Target conversion:** 8-12% — premium-tier conversion is lower; sequence emphasizes value of integration not discount.

**Tokens:** standard plus `{{ skus_owned_list }}` (comma-separated list of SKUs already purchased — used to credit toward bundle)

**Suppression:**
- If on `bundle-cross:pro-manager` (different buyer cohort — B2B), exit
- If customer is a known property manager (PAM-001 buyer), exit — Pro Manager Bundle is for them
- If customer hasn't bought TAX-011 yet AND has only 1-2 individual SKUs, exit — they're not portfolio-ready

---

## Email 1 — Day 5 — Fourteen workbooks is an operating system

**Subject:** Fourteen workbooks. One operating system. $397.

**Preheader:** When you scale past one property, individual workbooks stop being the right unit.

```
{{ first_name | default: "Hey" }},

You're past the single-property stage. The signal — you've bought {{ skus_owned_list }}, which means you're operating across multiple workbooks already, manually.

The Portfolio Bundle is the integrated alternative.

  · 14 Excel workbooks
  · ~$593 à la carte
  · $397 bundled (33% off)
  · Lifetime updates on every workbook in the bundle

What's in it:

  Multi-Property Master P&L (TAX-011) · RevPAR Dashboard · Deal Analyzer (Full) · Damage Claim + AirCover Log · License/Permit Tracker · Cleaning Fee Optimizer · Listing SEO Audit · Break-Even Occupancy · Cost-to-Launch Calculator · Escape the W2 Planner · Single-Property P&L Tracker · Schedule E Tax-Prep Workbook · Welcome Book · Cleaner Turnover Checklist

The 14 share conventions — same tab structures, same cell-format rules, same upgrade paths. They flow data into each other. Your existing purchases credit toward the bundle.

→ [Portfolio Bundle — $397]({{ link_bundle }})

— Emily · The STR Ledger

P.S. The bundle is own-site only (not on Etsy). Etsy's price-anchor doesn't serve a $397 SKU; direct-buyers in the Portfolio cohort don't shop on Etsy anyway.
```

---

## Email 2 — Day 9 — The hidden value isn't the savings

**Subject:** The portfolio bundle's real value isn't the 33% off

**Preheader:** It's the consistency of conventions. You don't see it until you've integrated them.

```
{{ first_name | default: "Hey" }},

Most pitches for a 14-product bundle lead with the dollar savings. $196 off. 33% discount.

That math is true. It's not the actual reason serious portfolio operators buy.

The actual reason: every workbook in the bundle uses the same conventions. Same tab structures. Same cell formatting. Same dropdown sources. Same Schedule E line mappings. Same Settings-tab pattern. Same active-tax-year cell.

Which means:

  · The Multi-Property P&L pulls cost basis from the Single-Property P&L automatically
  · The Depreciation Tracker reads in-service dates from Property Info tabs identically across all 14
  · The Cleaning Fee Optimizer reads turnover-cost from the Cleaning Cost Tracker without reformatting
  · The 1099-NEC Tracker pulls vendor payments from the Maintenance Log without column-mapping work

À la carte you get 14 workbooks with subtle inconsistencies that compound into reconciliation work. Bundled, you get 14 workbooks that compose into one operating system — every quarter saves you 4-8 hours of formatting + reconciliation that shouldn't exist.

The savings are real. The integration is the actual reason.

→ [Portfolio Bundle — $397]({{ link_bundle }})

— Emily

P.S. If you've already integrated the workbooks you own and aren't running into the reconciliation problem: ignore this. The bundle is for operators where the manual reconciliation has started to bite.
```

---

## Email 3 — Day 14 — Last note

**Subject:** Last Portfolio Bundle note

**Preheader:** Won't keep emailing about this. One last reminder.

```
{{ first_name | default: "Hey" }},

Last note on the Portfolio Bundle.

You've already paid for {{ skus_owned_list }}. The credit applies toward $397. The remaining workbooks are the rest of the multi-property stack.

→ [Portfolio Bundle — $397 (with your credit applied)]({{ link_bundle }})

If you're not ready, no problem. The à la carte SKUs stay available individually. Won't email about this bundle again.

Different topic next week — a note about depreciation acceleration via cost segregation. Different sequence, different sender frequency.

Talk soon,
Emily · The STR Ledger

P.S. The Portfolio Bundle includes Schedule E Tax-Prep + the Multi-Property Master P&L + the Single-Property P&L. If you handle your own taxes (not via CPA), those three together cut tax-prep time roughly 80% vs. running them separately. Worth the bundle on tax time alone.
```

---

## After sequence

- **Tags set:** `bundle-cross:portfolio:converted` OR `:declined`
- **Next sequence trigger:** "cost-seg-acceleration" — TAX-010 cross-sell for portfolio operators
- **Suppression:** 12 months on this bundle

## Iteration log

- `2026-05-05` — Initial draft. Email 2 (the integration-value pitch) is the differentiator. Most premium-bundle sequences pitch on discount; this one pitches on convention-consistency, which Portfolio buyers care about more than the dollar savings.
