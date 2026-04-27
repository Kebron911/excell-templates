# Brief — TAX-010 Cost Segregation DIY Workbook

**SKU:** TAX-010
**Category:** Financial / Accounting (master spec §3.2 A — Cost segregation tracker, T3 tier per platform-design.md:121)
**Tier:** T3
**Etsy price:** $47
**Wave:** 2 (Tax Season Bundle) + companion to Book Ch 7 (`/cap/07`)
**Mode:** Wizard (DEMO + BLANK)
**Campaign tagline:** Pull 5 years of depreciation into one. The IRS-acceptable DIY method.

## Target persona

**Primary:** Schedule E STR host who just acquired a property in the current tax year — purchased between $250K and $750K, default CPA depreciated everything at 27.5 years, host wants to reclassify components to 5/7/15-year MACRS and overlay bonus depreciation for a much larger Y1 deduction.

**Secondary:** Schedule E host who's owned a property 1–3 years and is exploring a Form 3115 retroactive cost-seg catch-up. Workbook does NOT compute the §481(a) catch-up — but produces the asset breakdown the CPA needs to file Form 3115.

## The one specific pain

"Our CPA depreciated my whole $480K Smokies cabin at 27.5 years for a $14,545/year deduction. I read about cost segregation and now I'm pretty sure I left $35K of Year-1 deductions on the table — but engineer-led studies cost $5K and my CPA won't do the breakdown. I need a defensible DIY method I can hand my CPA in 2 hours."

## What this template does

Walks the host through the DIY ("rule-of-thumb / self-segregated") cost segregation method that IRS accepts for properties under ~$750K acquisition cost when reasonable methodology is documented. Inputs:
- Total purchase price + capitalizable closing costs
- Land allocation (county-assessor ratio method by default)
- Itemized 5-year property (carpet, appliances, decorative lighting, window treatments, security cameras, smart locks, hot tub)
- Itemized 7-year property (furniture, electronics, kitchen equipment)
- Itemized 15-year property (driveway, landscaping, exterior lighting, fencing, deck/patio)

Computes:
- 27.5-year building basis (residual = total improvements − 5/7/15)
- Per-class Y1 deduction with bonus-depreciation overlay (rate from Settings — 40% for 2026, phasing down to 0% by 2028)
- 5-year MACRS schedule for accelerated portions (Y1–Y5)
- Naive 27.5-year baseline comparison ("you would have deducted $X — you're now deducting $Y")
- Tax savings at customer's marginal rate
- Form 4562 mirror (Parts I/II/III) for CPA hand-off

## Sheets / Tabs

| # | Tab | Role |
|---|---|---|
| 0 | Start | Wizard hero + 3-card (Y1 boost · audit-defense · CPA-ready) + Quick Start + Get Started + progress |
| 1 | Property Basics | Section 1 of 5 — purchase price, closing costs, address, placed-in-service date |
| 2 | Land Allocation | Section 2 of 5 — county-assessor ratio method, separates land from depreciable basis |
| 3 | 5-Year Property | Section 3 of 5 — itemized table (12 rows), suggested item list, $ amounts |
| 4 | 7-Year Property | Section 4 of 5 — itemized table (10 rows), furniture/electronics/kitchen |
| 5 | 15-Year Property | Section 5 of 5 — itemized table (10 rows), exterior land improvements |
| 6 | Y1 Summary & Schedule | Building residual + per-class Y1 with bonus + naive-baseline comparison + tax savings + 5-yr schedule |
| 7 | Form 4562 Mirror | Print-ready Parts I (§179, if any) / II (Bonus) / III (MACRS) for CPA |
| 8 | Launch | Big Y1 cards + audit-defense methodology box + Form 3115 retroactive decision card + print action |
| 9 | Settings | Active tax year · bonus depreciation % · marginal tax rate · MACRS Y1 percentages by class |

## Inputs

**Property Basics (5 fields):** Purchase price, closing/title costs (capitalizable), property address, placed-in-service date, Schedule E or C classification.

**Land Allocation (3 fields):** County tax assessor land value, county tax assessor improvements value (workbook computes the ratio), optional override % if customer disagrees with county.

**5-Year Property (12 rows × 2 fields):** Item description, dollar amount.

**7-Year Property (10 rows × 2 fields):** Item description, dollar amount.

**15-Year Property (10 rows × 2 fields):** Item description, dollar amount.

**Settings (5 fields):** Active tax year, bonus depreciation %, marginal tax rate, optional MACRS Y1 % overrides per class.

## Outputs

- **Per-class basis** (5-yr / 7-yr / 15-yr / 27.5-yr residual) — 4 cells, the heart of the workbook
- **Per-class Y1 deduction** = (cost × bonus %) + ((cost × (1 − bonus %)) × MACRS Y1 %)
- **Naive 27.5-yr baseline Y1** = improvements basis ÷ 27.5 (mid-month convention applied)
- **Accelerated Y1 total** vs naive baseline → "extra $X in Y1 deductions"
- **Y1 tax savings** = extra deduction × marginal rate
- **5-year MACRS schedule** — Y1 through Y5 row-by-row for the accelerated portions
- **Form 4562 mirror** — Parts I/II/III line items, print-ready
- **Audit-defense documentation block** — methodology disclosure ("DIY rule-of-thumb method, allocations based on [purchase docs / inspector report / industry benchmarks]"), per-asset support evidence checklist

## External tax references

- **IRC §168** — MACRS depreciation classes (5/7/15/27.5/39 yr)
- **IRC §168(k)** — bonus depreciation (40% in 2026, 20% in 2027, 0% in 2028)
- **IRS Pub 946** — How to Depreciate Property
- **Form 4562** — Depreciation and Amortization (Parts I/II/III)
- **Form 3115** — Application for Change in Accounting Method (out-of-scope for this workbook — referenced in Launch decision card only)
- **IRS Cost Segregation Audit Techniques Guide** — methodology IRS examiners use; this workbook's "Methodology Documentation" block mirrors the Guide's expected disclosures

## Business logic

### Per-class Y1 deduction formula
```
Y1 = (basis × bonus_pct) + (basis × (1 − bonus_pct) × MACRS_Y1_pct)
```

Where `MACRS_Y1_pct` defaults (half-year convention, 200% DB for 5/7-yr, 150% DB for 15-yr):
- 5-yr Y1 = 20.00%
- 7-yr Y1 = 14.29%
- 15-yr Y1 = 5.00%
- 27.5-yr Y1 = 1/27.5 (with mid-month convention applied = ~3.485% × month-fraction)

### Building residual
```
residual_27_5_basis = total_improvements − 5yr_total − 7yr_total − 15yr_total
```
where `total_improvements = total_basis − land`. Sanity check: residual must be ≥ 60% of improvements basis (a flag fires if 5/7/15 reclassification is implausibly high — common audit-defense trigger).

### Bonus depreciation — 5/7/15 only
Bonus depreciation applies to MACRS property with recovery period **≤ 20 years**. The 27.5-yr building residual gets standard MACRS only (no bonus).

### Land — never depreciable
Land basis is set aside permanently. Workbook makes this visible (greyed-out row in Y1 Summary) so the customer can confirm land was correctly excluded — common audit issue is improvers who mistakenly depreciate part of the land allocation.

### Naive baseline
The "naive" baseline (what the default CPA would have done) = `improvements_basis / 27.5` with mid-month convention. The "you saved $X" output compares accelerated Y1 to this naive number — the headline value of the entire workbook.

### Marginal tax rate
Single input on Settings. Y1 tax savings = `(accelerated_Y1 − naive_Y1) × marginal_rate`. Default = 24% (typical Schedule E STR host bracket).

### Sanity-check guardrails (audit defense)
1. **Implausibly high reclassification flag** — if (5yr + 7yr + 15yr) > 40% of improvements basis, fire a yellow warning ("⚠ DIY allocations above 35–40% of improvements typically warrant an engineer-led study to defend"). 25–35% is the typical defensible range for STRs.
2. **Land allocation flag** — if land < 10% or > 35% of total purchase, fire a yellow warning to confirm county-assessor ratio.
3. **Item-description requirement** — if a $ amount is entered without a description, the row's audit-defense rating drops. Vague descriptions ("misc fixtures") get the same warning treatment per [str-tax-context.md §audit-defense](.claude/skills/str-ledger-template/references/str-tax-context.md).

## QA sample data (DEMO) — Amanda's Smokies cabin

From [blog post 03-str-depreciation.md:135-157](../../copy/blog-posts/03-str-depreciation.md):

**Property:** Smokies Ridge Cabin — 1247 Wears Valley Rd, Sevierville TN
**Purchase:** $480,000 + $8,000 closing = $488,000 total basis
**Placed in service:** 2026-04-15

**Land allocation:** $80,000 (county ratio 16.4%)
**Improvements basis:** $408,000

**5-Year Property — $85,000 total (sample items):**
- Whole-home furniture package (3BR): $32,000
- Stainless appliance package (refrigerator, range, dishwasher, washer, dryer): $12,500
- Window treatments (custom blackouts × 9 windows): $4,200
- Decorative lighting + ceiling fans: $3,800
- Smart locks + Ring camera package: $2,200
- Hot tub (8-person, installed): $14,500
- Game room equipment (pool table + arcade): $9,800
- Smart TVs + mounts × 4: $4,500
- Initial linens + kitchenware package: $1,500

**7-Year Property — $0 (Amanda's example combined into 5-yr, but BLANK has 10 rows for hosts who want to break out furniture separately)**

**15-Year Property — $35,000 total (sample items):**
- Gravel driveway extension + parking pad: $9,500
- Landscaping (perennials, mulch beds, retaining wall): $7,200
- Exterior lighting (path + flood + accent): $4,800
- Privacy fence (back yard, 220 ft): $6,500
- Hot tub deck + stairs: $7,000

**27.5-Year Residual:** $408,000 − $85,000 − $0 − $35,000 = **$288,000**

(Blog post said $280K building; $8K diff is the closing-cost capitalization the blog skipped — this is a more rigorous number and we'll note in the methodology block.)

**Settings DEMO:** active year 2026, bonus 40%, marginal rate 24%.

**Expected outputs (computed with 2026 settings):**
- Naive Y1: $408,000 / 27.5 × (8.5/12 mid-month for April placed-in-service) ≈ **$10,514**
- Accelerated Y1:
  - 5-yr: $85,000 × 40% bonus + $51,000 × 20% MACRS = $34,000 + $10,200 = **$44,200**
  - 7-yr: $0
  - 15-yr: $35,000 × 40% bonus + $21,000 × 5% MACRS = $14,000 + $1,050 = **$15,050**
  - 27.5-yr residual: $288,000 × (8.5/12) / 27.5 ≈ **$7,418**
  - **Total accelerated Y1: $66,668**
- **Extra Y1 deduction vs naive: $66,668 − $10,514 ≈ $56,154**
- **Y1 tax savings @ 24%: ~$13,477**

(Higher than blog's $35K extra / $8.4K savings because 2026 bonus rate is 40% vs blog's example using 20%. The Y1 Summary tab includes a "Settings drives this — change bonus % to match your tax year" callout.)

## Out-of-scope

- **Engineer-led studies** — referenced in Launch as "When to hire" decision card, not built. Workbook is for DIY rule-of-thumb only.
- **Form 3115 §481(a) catch-up calc** — referenced in Launch decision card with "this is CPA territory" caveat. Customer hands the per-asset breakdown to their CPA who files 3115.
- **Multi-property** — single-property workbook. Multi-property cost-seg portfolio = future T3 or bundle SKU.
- **§179 election overlay** — TAX-009 Section 179 Planner is the dedicated tool. Cost-seg workbook computes bonus + MACRS only; if customer also wants §179, they run TAX-009 on the per-asset output.
- **Recapture on sale** — §1245/§1250 recapture isn't computed. Mentioned in Launch decision card as "future consideration when you sell."
- **Qualified Improvement Property (QIP)** — separate scope.
- **Personal-use vacation-home days** — workbook assumes 100% rental use. Vacation-home limitation is a separate audit-defense block in TAX-002 P&L Single Property.

## Upgrade CTA

Tax Season Bundle ($147) — TAX-001/002/003/009/010 + Schedule E workbook.

## Cross-references in the suite

- **TAX-009 Section 179 Planner** — companion for §179-elected assets (workbook references it in the 5-year property tab callout)
- **TAX-002 P&L Single Property** — vacation-home day limitation lives there
- **GST-001 Welcome Book** — orthogonal, but the Settings tab "Schedule E/C" classification mirrors the same dropdown used across the suite for consistency

## Audit-defense framing (non-negotiable)

Per the blog post's CPA-review note ([03-str-depreciation.md:20](../../copy/blog-posts/03-str-depreciation.md:20)) — cost segregation is the most legally-sensitive part of the suite. The Launch tab MUST include:

1. **Methodology disclosure block** — "I used the DIY rule-of-thumb method described in [IRS Cost Segregation ATG]. Allocations based on: [ ] purchase documents, [ ] appraisal, [ ] inspector estimates, [ ] industry benchmarks." Customer ticks the boxes that apply and signs/dates.
2. **Supporting documents checklist** — purchase agreement, settlement statement, inspector report, appraisal, photos of itemized 5/7/15-yr items, vendor invoices for any post-purchase improvements. Tickbox per row.
3. **"When to hire an engineer instead" decision card** — properties >$750K, multi-building, complex land improvements, or hosts in high audit-risk brackets (>$500K AGI) should pay for an engineer-led study.
4. **Form 3115 catch-up callout** — "Owned this property 1+ years and want to apply cost-seg retroactively? Form 3115 with §481(a) adjustment is the mechanism. CPA territory — this workbook does not compute the catch-up."
