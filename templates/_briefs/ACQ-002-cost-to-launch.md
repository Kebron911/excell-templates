# Brief — ACQ-002 Cost-to-Launch Calculator

**SKU:** ACQ-002
**Category:** Acquisition / Underwriting (master spec §3.2 B #31)
**Tier:** T1
**Etsy price:** $27 (hero conversion product for Newbie Nina)
**Own-site price:** $27 (same — gateway)
**Wave:** 3 (build order #9 of the next 12)
**Campaign tagline:** Run your rentals before they run you.

## Target persona

**Primary:** Newbie Nina (0-1 properties, just launching) — THE persona this product targets. $27 impulse buy.
**Secondary:** Side-Hustle Sam contemplating property #2 — different math, same template.
**Tertiary:** Aspiring arbitrage operator (subset of #70 prospects) — uses the furnishing line-items.

## The one specific pain

"I have $40K saved. I want to buy/launch my first STR. What's my all-in number including the stuff I'm forgetting? Every blog post says something different. Every TikTok says $5K. Every podcast says $50K."

## What this template does

A cost-to-launch wizard that:
1. Takes Nina from zero to a defensible all-in budget in 30 minutes
2. **Pre-populates ~120 line items** in a room-by-room furnishing checklist (saves 200 trips to Amazon)
3. Provides **3 finish-quality columns** (low / mid / high) with realistic price ranges per item
4. Includes a **"Did you forget?" sidebar** flagging the items Nina would miss (LLC, insurance binder, smoke/CO detectors per code, fire extinguisher, first aid, security cams, professional photos)
5. Hard-requires a **90-day operating reserve** — the runway calculation that's the difference between "launched" and "sustained"
6. Outputs Y1 ROI projection

## Sheets / Tabs (6)

| # | Tab | Role |
|---|---|---|
| 1 | Start | All-in total + reassurance ("typical 2BR cabin $32-58K") |
| 2 | Acquisition | Down pmt, closing, inspection, appraisal, legal |
| 3 | Furnish & Setup | Pre-populated 120-item room-by-room checklist (low/mid/high) |
| 4 | Launch Costs | Photos, listing, permits, LLC, insurance, software, marketing |
| 5 | 90-Day Reserve | Operating runway buffer |
| 6 | Total + Y1 ROI | All-in + first-year revenue projection + payback |

## Inputs

**Acquisition (rows 8-18):**
Purchase price ($), Down payment % (default 25%), Loan rate %, Closing costs $ (default 2-3% of purchase), Inspection $, Appraisal $, Title insurance $, Legal/attorney $, Loan origination fee $, Other due-diligence $.

**Furnish & Setup (the marquee tab):**
~120 pre-populated line items across 8 zones, with low/mid/high price columns.

Zones + sample item count:
- Bedroom (×N bedrooms): mattress, frame, headboard, sheet sets, comforter, pillows, lamps, blackout curtains, dresser, closet system, hangers, mirror, art, rug — ~15 items × N bedrooms
- Bathroom (×N): towel sets, bath mats, shower curtain, soap dispensers, trash bin, toilet brush, plunger, toilet paper holder, hooks, art, scale — ~12 items × N
- Kitchen: dishes (set of 8), glasses, mugs, silverware, cookware (5-pc set), bakeware (3-pc), knives, cutting boards, mixing bowls, measuring tools, can opener, corkscrew, coffee maker, toaster, microwave (or check w/ rental), kettle, blender, food storage, dish towels, oven mitts, paper towel holder, trash + recycling bins — ~25 items
- Living: sofa, accent chairs (×2), coffee table, end tables, lamps, TV, TV stand, throw blankets, throw pillows, art, rug, books/decor, board games — ~15 items
- Outdoor: patio set (table + chairs), umbrella, grill, fire pit (if allowed), outdoor lighting, weather-resistant decor, hammock — ~8 items
- Tech / Smart-home: smart lock, doorbell camera, smart thermostat, WiFi router/extender, streaming devices (×N TVs), Bluetooth speaker — ~7 items
- Safety + supplies: smoke detector (×rooms per code), CO detector, fire extinguisher, first aid kit, emergency flashlight, evacuation map, guest WiFi card — ~8 items
- Linens + amenities: extra sheet sets, extra towels, beach/pool towels (if applicable), welcome basket items, toiletry starter kit — ~10 items

**Launch Costs (rows 8-25):**
Professional photos, Airbnb listing fee (typically $0), VRBO listing fee, permit fees, business license, LLC formation, EIN registration, insurance binder + first-year premium, PMS software setup, dynamic pricing tool setup, accounting software, marketing/photos branding, signage, dropbox/lockbox.

**90-Day Reserve (rows 8-15):**
Mortgage P&I × 3, Utilities × 3, Insurance × 3 (or annual / 4), Cleaning reserve, Maintenance reserve, Marketing reserve, Software subscriptions × 3, Other × 3.

## Outputs

**Furnish & Setup totals:**
- Total at low quality: SUM of low column
- Total at mid quality: SUM of mid column
- Total at high quality: SUM of high column
- Selected total: based on user's selection per item (default mid; user can override per item)

**Total + Y1 ROI:**
- Total all-in = Acquisition + Furnish + Launch + Reserve
- Cash invested (excludes mortgage principal) = down pmt + closing + furnish + launch + reserve
- Y1 revenue projection: simple input (ADR × occ × available nights)
- Y1 net: revenue - operating costs (linked to FIN-002-style cost line if user enters)
- Y1 cash-on-cash %
- Payback period (months) = cash invested / monthly Y1 net (if positive)
- Break-even occupancy: simple formula (mirrors FIN-002 logic, simplified)

**Start tab:**
- Reassurance line: "Typical 2BR cabin all-in: $32K-$58K (mid finish) — your number is below." (italic muted, calming voice per §6.1)
- "YOUR LAUNCH BUDGET: $XX,XXX" Georgia 28pt bold gold
- "90-day reserve: $X,XXX"
- "Y1 break-even occupancy: XX%"
- Alert if Cash invested > 80% of input "Available cash" → "⚠ You're starting with thin reserves. Consider scaling back finish quality on Furnish tab." (warm, not scolding)

**"Did you forget?" sidebar (Furnish & Setup tab right side):**
Sticky list visible during scroll:
- LLC formation? ✓/✗ (link to row)
- Insurance binder? ✓/✗
- Smoke detectors per code? ✓/✗
- CO detectors per code? ✓/✗
- Fire extinguisher? ✓/✗
- First aid kit? ✓/✗
- Security cameras (exterior only — Airbnb prohibits interior)? ✓/✗
- Professional photos? ✓/✗
- Pet supplies (if pet-friendly)? ✓/✗

Each item linked to its row in the workbook.

## External data references

- Typical price ranges sourced from Amazon/Wayfair/Costco bulk-buy benchmarks (cited as "approximate ranges as of <date>")
- IRS startup cost rules (briefly mentioned for tax-prep handoff): pre-startup costs vs. operating costs distinction (Pub 535)

## Business logic

- **Reassurance voice on Start tab.** Nina opens this terrified. Lead with the typical-range so the actual number doesn't feel scary in isolation. §6.1 "calm authority" applies.
- **Pre-populated line items are the magic.** Saves Nina 200 trips to Amazon. Realistic ranges (a "low" mattress is $250, "high" is $1,200 — both real Amazon-tier prices, NOT designer pricing).
- **Per-item finish-quality override.** Default mid; user can pick low for the headboard but high for the mattress. Persistent column = the chosen value.
- **90-day reserve is non-negotiable.** Most Newbie Nina failures = launching without runway. Workbook treats reserve as required, not optional. Big red flag if missing.
- **3 finish-quality columns** prevents the "designer trap" where buyers spend $80K furnishing a $300K cabin.
- Capacity: 1 property per workbook (this is a wizard).

## QA sample data

Smokies Ridge Cabin scenario:
- 2BR/2BA cabin, purchase $385K, 25% down ($96,250), closing $9K, inspection $400, legal $1,200
- Furnishing mid: ~$28,400 across 120 items
- Launch costs: $4,800 (photos $1,200, LLC $400, insurance $1,800, software setup $400, etc.)
- 90-day reserve: $5,400

Total all-in: ~$145K. Cash invested (excl mortgage): ~$48K.
Y1 revenue projection (Y1 occ 45%, ADR $245): ~$45K
Y1 net: ~$8K
Y1 cash-on-cash: ~17%
Payback: ~6 years (mortgage paydown contributes more)

## Upgrade CTA

Start tab: "Validate the deal numbers before you sign? Get the STR Deal Analyzer (ACQ-001) at thestrledger.com — $47, includes stress test."

Start tab: "Joining the email list = first launch checklist + 47 deduction guide free."

## Out-of-scope

- Live Amazon pricing API (manual price ranges)
- Specific brand recommendations (we're not a curated affiliate site — keep it neutral)
- International (USD only, US property/permit assumptions)
- Mid-term-rental setup variations (covered in #70)
- Construction / rehab costs beyond minor cosmetic (#24 Rehab Budget separate SKU)

---

## Implementation spec (v2.2)

### Workbook-level
- Filenames: `ACQ-002-cost-to-launch-DEMO.xlsx` + `-BLANK.xlsx`
- Mode: Wizard
- Tab colors: Start = `COLOR_PRIMARY`; Acquisition/Furnish/Launch/Reserve = `COLOR_SECONDARY`; Total + Y1 ROI = `COLOR_ACCENT`
- SKU tag "ACQ-002 · v1.0"

### Sheet 1 — Start
`apply_brand_header(ws, "Cost-to-Launch Calculator", "The all-in number — including what you'd forget.")`.

Reassurance row 7: italic muted "Typical 2BR cabin: $32K-$58K mid finish · 1BR condo: $18K-$28K · 4BR luxury: $90K-$160K"

Row 9: "YOUR LAUNCH BUDGET" Georgia 14pt bold; Row 10: $XXX,XXX 36pt bold gold.

Rows 12-14: 90-day reserve / Y1 break-even occ / Y1 net projection.

Row 16: alert if cash > available cash input (not provided in MVP — flag for v2).

### Sheet 3 — Furnish & Setup (the marquee tab)
Cols: A=zone, B=item, C=low $, D=mid $, E=high $, F=selected $, G=quantity, H=line total. Approx 130 rows of pre-populated content.

Zone banners (gold-soft fill) with zone subtotal rows.

Right sidebar (cols J-K) "Did you forget?" sticky checklist linked back to specific rows.

Row totals at bottom: low total / mid total / high total / selected total.

### Sheet 6 — Total + Y1 ROI
Tab color `COLOR_ACCENT`. Layout:
- Top: Total all-in summary (4 rows: acquisition + furnish + launch + reserve = total)
- Middle: Cash invested calculation
- Bottom: Y1 ROI inputs (ADR / Y1 occ / available nights) + outputs (Y1 revenue / Y1 net / cash-on-cash / payback / break-even occ)

Print area portrait letter — handoff to financing partner / spouse.
