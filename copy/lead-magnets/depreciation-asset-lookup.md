# Depreciation Asset Quick-Lookup — Lead Magnet (Blog 03 tie-in)

**SKU code:** `LM-004`
**Format:** Excel workbook (1 main tab + 1 reference tab), with PDF print-companion (2 pages)
**Funnel role:** Mini-magnet for blog post #3 (`str-depreciation`). Email-gated at `/free/depreciation-lookup`. Tag at capture: `lead-magnet:depreciation`.
**Build tool:** Excel + Vista Create (for PDF companion)
**Save locations (final assets):**
- `templates/_delivery/_shared/depreciation-lookup.xlsx`
- `templates/_delivery/_shared/depreciation-lookup-print.pdf`
**Companion product:** STR Depreciation Tracker (TAX-004, $27 Etsy / $47 Gumroad)

---

## Why this magnet exists

Depreciation is the most-misunderstood STR tax topic. Hosts know "27.5 years for the building" but don't know:
- A new dishwasher = **5-year** depreciation (not 27.5)
- Furniture = **7-year**
- Land improvements (driveway, fence, landscaping) = **15-year**
- Cost-segregation lets you accelerate big-ticket items

Mistake: depreciating a $3,000 fridge over 27.5 years (= ~$109/yr) when it should be 5 years (= $600/yr in deduction, $491/yr more). Multiplied across 50 STR assets, hosts lose **$5K–$15K/yr** in deductions they were legally entitled to.

This magnet gives them a one-tab lookup. The upsell is the full tracker that runs the math.

---

## Excel structure

### Tab 1 — Asset Lookup

| Column | Header | Example | Notes |
|--------|--------|---------|-------|
| A | Asset / Item | "Mattress (queen)" | User-entered |
| B | Category | "Furniture & fixtures" | Dropdown |
| C | MACRS class life | "7-year" | Lookup formula |
| D | Bonus depreciation eligible? | "Yes (2026: 40%)" | Lookup formula, updates by tax year |
| E | Section 179 eligible? | "Yes — up to limit" | Lookup formula |
| F | Cost-seg category if remodeled into building | "Personal property" | Notes |
| G | Notes / IRS reference | "Pub 946 Asset Class 57.0" | Lookup formula |

Pre-populated with 60 common STR assets. Below.

### Tab 2 — Category Reference

| MACRS class | Recovery period | What goes here (STR) |
|-------------|-----------------|----------------------|
| 5-year      | 5 years         | Appliances, computers, office equipment, automobiles (limited) |
| 7-year      | 7 years         | Furniture (beds, sofas, dressers, tables, lamps), most fixtures |
| 15-year     | 15 years        | Land improvements (driveway, fence, sidewalk, landscaping, exterior lighting), qualified improvement property |
| 27.5-year   | 27.5 years      | Residential rental real estate (the building shell) |
| 39-year     | 39 years        | Commercial real estate (NOT residential STR — use 27.5) |

### Pre-populated assets (60 rows)

**5-year:**
Refrigerator, dishwasher, washer, dryer, microwave, range/oven, smart TV, sound bar, garbage disposal, computers, tablets, printers, smart lock, smart thermostat, security camera system, router/mesh wifi system

**7-year:**
Queen mattress, king mattress, twin mattress, sofa, sectional, recliner, bed frame, dresser, nightstand, dining table, dining chairs, lamps (floor + table), area rugs, artwork (over $200), bar stools, coffee table, outdoor patio furniture, outdoor grill, lawn equipment (mower, blower), kitchen cookware sets >$200, decorative items >$200

**15-year:**
Asphalt driveway, concrete driveway, fence, retaining wall, landscaping (mature trees, sod, irrigation), exterior lighting, sidewalk, deck (free-standing — not attached), pool, hot tub (free-standing), shed

**27.5-year:**
Building shell, roof (without cost seg study), foundation, framing, plumbing system, electrical system, HVAC (without cost seg), windows (built-in), interior walls, doors (interior + exterior)

### Decision banner at top of Tab 1

> ⚠️ **Bonus depreciation phase-out (2026):** Bonus depreciation is 40% for 2026 assets placed in service. It drops to 20% in 2027 and 0% in 2028 unless Congress extends. If buying expensive STR assets, time the placed-in-service date strategically.

> ⚠️ **Section 179 cap (2026):** $1,160,000 limit, phases out after $2,890,000. STR hosts rarely hit this — generally available for most STR purchases.

---

## PDF Print Companion (2 pages)

### Page 1 — At-a-glance lookup table
Same content as Tab 2 (the class-life reference) plus the most-common 25 assets in a single-page reference.

### Page 2 — Decision box + CTA

**Box 1 — When to consider a cost segregation study**
- Property cost basis $500K+ → DIY won't move the needle enough; consider a $3K–$8K engineered study (ROI typically 5–10x in year 1).
- Property cost basis $200K–$500K → DIY/template-driven cost seg via TAX-006 worksheet is usually sufficient.
- Property cost basis <$200K → Stick to component-level classification using this lookup; don't pay for a study.

**Box 2 — The "year 1 placed in service" rule**
You can only deduct depreciation starting the year an asset is **placed in service** (= available for rental use, not "owned"). Buying a $3K fridge in December but installing it after the first guest in February means the depreciation starts in February, not December.

**Box 3 — Want the full tracker?**
This lookup tells you the class life. **TAX-004 STR Depreciation Tracker** auto-builds your Form 4562, handles MACRS half-year/mid-quarter conventions, runs cost-seg scenarios, and shows the year-by-year deduction schedule for every asset.

**→ Get TAX-004 for $27 at thestrledger.com/depreciation-tracker**

### Footer
*General educational information only. Cross-reference [IRS Publication 946](https://www.irs.gov/pub/irs-pdf/p946.pdf) and Form 4562 instructions. Confirm with a licensed CPA before filing.*

---

## Build checklist

- [ ] Excel: data validation dropdown on column B linking to Tab 2
- [ ] Excel: XLOOKUP formula on column C/D/E/G driven by column B
- [ ] Excel: Bonus % field as named cell `BonusPct2026 = 40%` so user can update yearly
- [ ] PDF: Vista Create, brand kit, QR to `thestrledger.com/depreciation-tracker`
- [ ] Test: enter "Mattress (queen)" → column C must auto-fill "7-year"
- [ ] Save Excel as `.xlsx` + sRGB PDF; both shipped in the email gate response

## Mini-magnet → product conversion target

- Opt-in CVR target: 25%+
- Upsell CTR to TAX-004 in nurture sequence: 6%+
- Sequence: `nurture-hero-magnet` email 4 pitches TAX-004 specifically
