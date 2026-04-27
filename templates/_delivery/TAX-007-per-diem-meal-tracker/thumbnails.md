# Thumbnail Specs — TAX-007 Per-Diem Meal Deduction Tracker

All 5 clone the Task-3 thumbnail master (2000×2000, Vista Create). Reference: `brand/canva-specs.md` Asset 3.

## 1 — Hero
- Zone 3: MacBook mockup showing Meals Log tab — rows of date/restaurant/purpose/amount/$-deductible columns, green "50%" and "100%" badges in the Deductible % column
- Zone 2: `Track Business Meals. Keep the Deduction.` (Cormorant Medium 68pt, Harbor Navy)
- Zone 4: `IRS Pub 463-compliant. 5 required fields per meal. Audit-ready.` (Inter Semibold 24pt)
- Export: `thumb-1.png`

## 2 — The lost receipts
- Zone 3: large text overlay `"$800 left on the table"` in Clay Rose (#B5725E) on a blurred restaurant-receipt background
- Zone 2: `Stop Losing Meal Deductions.` (Cormorant Medium 72pt)
- Zone 4: `Most STR hosts skip meals entirely. You qualify for more than you think.` (Inter Semibold 24pt)
- Export: `thumb-2.png`

## 3 — Actual vs per-diem
- Zone 3 split 50/50: LEFT pile of restaurant receipts photo; RIGHT Per-Diem Log tab screenshot showing standard daily GSA rate rows, no receipts needed
- Zone 2: `No Receipt? Use Per-Diem.` (Cormorant Medium 72pt)
- Zone 4: `GSA standard rates built in. $80/day high-cost, $59 standard.` (Inter Semibold 24pt)
- Export: `thumb-3.png`

## 4 — 50% vs 100% explainer
- Zone 3: two-tile visual — LEFT tile "50% Business Meal" (Harbor Navy bg, Inter Semibold); RIGHT tile "100% Employee Meal" (Muted Gold bg, Inter Semibold) — small TCJA callout below: "Entertainment: $0 (post-2017)"
- Zone 2: `Know What Rate Applies.` (Cormorant Medium 72pt)
- Zone 4: `50%. 80%. 100%. 0%. The workbook picks it by row.` (Inter Regular 26pt)
- Export: `thumb-4.png`

## 5 — What's included
- Zone 3: Clay Rose (#B5725E, 70% opacity) rounded card, 60px padding:
  ```
  ✓ Meals Log — date, amount, attendees, purpose, deductible %
  ✓ Per-Diem Log — GSA standard rates, no-receipt days
  ✓ Deductible % auto-applied (50% / 80% / 100% / 0%)
  ✓ Monthly summary + per-purpose donut chart
  ✓ Audit-defense fields: receipt kept, business purpose, attendees
  ✓ TCJA entertainment flag — 0% auto-applied when triggered
  ```
  Inter Semibold 26pt, Harbor Navy
- Zone 2: `What You Get` (Cormorant Medium 84pt)
- Zone 4: `Opens in Excel 2016+, Excel 365, Google Sheets` (Inter Regular 22pt)
- Export: `thumb-5.png`

## Daniel checklist

- [ ] Export TAX-007 xlsx → PDF to capture Meals Log + Per-Diem Log tab screenshots
- [ ] Duplicate Task-3 thumbnail master in Vista Create 5×
- [ ] Build per specs above
- [ ] Export 5 PNGs to `templates/_delivery/TAX-007-per-diem-meal-tracker/`
- [ ] Commit
