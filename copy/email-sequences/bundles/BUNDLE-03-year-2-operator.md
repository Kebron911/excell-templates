# Bundle Cross-Sell Sequence — Year-2 Operator Bundle

**Bundle:** BUNDLE-03 Year-2 Operator ($147 — saves $41 vs $188 à la carte)
**Trigger:** customer bought FIN-001 / REV-001 / MKT-001 / OPS-002 individually
**Tag at entry:** `bundle-cross:year-2-operator`
**Sequence length:** 3 emails over 10 days
**Target conversion:** 12-18% — this cohort is operator-mode, knows what optimization means, converts faster than first-year or pre-host.

**Tokens:** standard (`{{ first_name }}`, `{{ purchased_sku_name }}`, `{{ link_bundle }}`, `{{ bundle_credit_amount }}`)

**Suppression:**
- If on `bundle-cross:portfolio` (higher tier) — exit
- If purchase trigger was a Wave 1 SKU (early-launch buyer) — wait 60 days post-purchase before starting this sequence (they're still ramping up)

---

## Email 1 — Day 3 — Three more levers an experienced host actually controls

**Subject:** The three other levers a Year-2 host actually controls

**Preheader:** You bought one. Here's the other three. They compose into a system.

```
{{ first_name | default: "Hey" }},

You picked up {{ purchased_sku_name }}. Year-2 territory.

The other three workbooks at this tier:

  · RevPAR Dashboard — your three numbers (RevPAR, ADR, occupancy) per property and portfolio-wide. Quarter-over-quarter momentum. WINNING / MIXED / LOSING per property.
  · Cleaning Fee Optimizer — three pricing strategies side-by-side. Most hosts are leaving $1.5-4.5K/yr on the table without knowing it.
  · Listing SEO Audit — 25 ranking criteria scored, prioritized fix list.
  · Damage Claim + AirCover Log — average host recovers 30-40% of claims because evidence isn't structured. With a structured packet it's 60-80%.

Bundled: $147. À la carte: $188. Save $41.

→ [Year-2 Operator Bundle — $147]({{ link_bundle }})

Your ${{ bundle_credit_amount }} purchase of {{ purchased_sku_name }} credits toward the bundle.

— Emily · The STR Ledger

P.S. The 22% bundle savings is smaller than the First-Year Bundle (30%) — by design. Year-2 buyers want most of these workbooks individually, so the discount is the kicker not the headline.
```

---

## Email 2 — Day 7 — The recovery rate gap

**Subject:** Why most hosts only recover 35% of damage claims

**Preheader:** The evidence isn't structured. Here's how to fix that.

```
{{ first_name | default: "Hey" }},

A specific Year-2 number that surprises most hosts:

> Average AirCover claim recovery rate, across hosts who file: 30-40%.
> With a structured per-incident log + claim-ready packet: 60-80%.

That's the difference between the workbook and not.

The gap isn't because Airbnb's stingy. It's that hosts file claims with: a few photos, a vague description, and an estimated repair cost. AirCover's adjuster (or your dwelling carrier's adjuster) low-balls because the evidence is low-quality.

The Damage Claim Log (in the Year-2 Operator Bundle) is the structured version: pre-stay vs post-stay photo comparison (you have walkthrough photos at every check-in, right?), itemized damage with replacement costs, supporting documentation links. The Claim Packet tab is print-ready.

For a host filing 2-3 claims/year averaging $1,800 each: lifting recovery from 35% to 65% = $1,620/yr difference. Workbook is $37 individually. Bundle (4 workbooks) is $147.

→ [Year-2 Operator Bundle — $147]({{ link_bundle }})

— Emily

P.S. Most operators undervalue claim documentation until the first $4K loss they don't recover. The bundle pays for itself on the first prevented denial.
```

---

## Email 3 — Day 10 — Last note + the SEO audit

**Subject:** Last note + the listing-rank lever most hosts ignore

**Preheader:** 25 criteria. Each one ranked by impact.

```
{{ first_name | default: "Hey" }},

Last note on the bundle.

If you're using {{ purchased_sku_name }} and finding it useful, the other three workbooks compose into the same Year-2 operating system. Particularly:

The **Listing SEO Audit**. 25 criteria scored, prioritized fix list ranked by estimated rank lift. Most Year-2 operators have an 8-10/25 score and don't know it. A 14-day rewrite to 18+/25 typically lifts bookings by 12-25%.

You won't get there from intuition. The criteria are specific: keyword density in title (3 sub-criteria), photo composition (5), description (3), amenities (3), pricing rules (3), calendar hygiene (3), host signals (3), search-rank levers (2). Each maps to a fix.

The bundle is $147 (4 workbooks). À la carte is $188.

→ [Year-2 Operator Bundle — $147]({{ link_bundle }})

If now's not the time, no problem. Won't email about this bundle again. Different topic next week — a note about pricing-tool ROI (paid tools work for some hosts, not others; the math).

Talk soon,
Emily · The STR Ledger

P.S. If you bought the bundle already, IS will catch up overnight and move you off this sequence.
```

---

## After sequence

- **Tags set:** `bundle-cross:year-2-operator:converted` OR `:declined`
- **Next sequence trigger:** "pricing-tool-roi" — REV-006 cross-sell + general nurture
- **Suppression:** 12 months on this bundle

## Iteration log

- `2026-05-05` — Initial draft. Shorter sequence (3 emails) than first-year (4) because Year-2 cohort converts faster + has shorter attention for marketing email. Day-7 email (recovery rate) is the most-converting hook based on operator-pattern data.
