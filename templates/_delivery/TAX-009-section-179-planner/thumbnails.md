# Thumbnail Specs — TAX-009 Section 179 Planner

All 5 clone the Task-3 thumbnail master (2000×2000, Vista Create). Reference: `brand/canva-specs.md` Asset 3.

## 1 — Hero
- Zone 3: MacBook mockup showing Election Per Asset tab — 5-row asset list with toggle column showing §179 / Bonus / MACRS selections, "Total §179 This Year" sum cell highlighted in Muted Gold
- Zone 2: `Front-Load This Year's Depreciation. Legally.` (Cormorant Medium 64pt, Harbor Navy)
- Zone 4: `Section 179 + Bonus depreciation — modeled per asset, this year.` (Inter Semibold 26pt)
- Export: `thumb-1.png`

## 2 — The 5-year vs now comparison
- Zone 3: two-column visual — LEFT column header "27.5-Year MACRS: $174/yr" in Graphite; RIGHT column header "Section 179: $6,000 this year" in Muted Gold (#C9A24B) — large arrow pointing right
- Zone 2: `Write It Off Now, Not Over 5 Years.` (Cormorant Medium 64pt)
- Zone 4: `The hot tub, the sofa, the smart locks — all eligible this year.` (Inter Semibold 26pt)
- Export: `thumb-2.png`

## 3 — Bonus depreciation phasedown
- Zone 3: bar chart (Vista Create element) showing bonus % by year: 2025=60%, 2026=40%, 2027=20%, 2028=0% — 2026 bar highlighted in Muted Gold
- Zone 2: `2026 Is 40%. 2028 Is Zero.` (Cormorant Medium 68pt)
- Zone 4: `Bonus depreciation is phasing out. The window is closing.` (Inter Semibold 26pt)
- Export: `thumb-3.png`

## 4 — Income limitation check
- Zone 3: MacBook mockup showing Income Limitation tab — "Business Income: $43,000" and "§179 Elected: $7,580" and "Income Limitation: ✓ Passes" — carryover row showing $0 (no carryover needed)
- Zone 2: `The Income Limit Matters.` (Cormorant Medium 72pt)
- Zone 4: `§179 can't exceed your business income. Workbook checks this automatically.` (Inter Semibold 22pt)
- Export: `thumb-4.png`

## 5 — What's included
- Zone 3: Clay Rose (#B5725E, 70% opacity) rounded card, 60px padding:
  ```
  ✓ Asset list — up to 15 assets, description + cost + date placed
  ✓ Per-asset toggle — §179 / Bonus Depreciation / MACRS
  ✓ Income limitation check — §179 ≤ business income (carryover auto-calc)
  ✓ Bonus depreciation — 40% in 2026, updated in Settings each year
  ✓ Vehicle §179 cap flag ($20,400 for GVWR > 6,000 lb)
  ✓ Print-ready Form 4562 mirror (Parts I & II)
  ```
  Inter Semibold 26pt, Harbor Navy
- Zone 2: `What You Get` (Cormorant Medium 84pt)
- Zone 4: `Opens in Excel 2016+, Excel 365, Google Sheets` (Inter Regular 22pt)
- Export: `thumb-5.png`

## Daniel checklist

- [ ] Export TAX-009 xlsx → PDF to capture Election Per Asset + Form 4562 Map tab screenshots
- [ ] Duplicate Task-3 thumbnail master in Vista Create 5×
- [ ] Build per specs above
- [ ] Export 5 PNGs to `templates/_delivery/TAX-009-section-179-planner/`
- [ ] Commit
