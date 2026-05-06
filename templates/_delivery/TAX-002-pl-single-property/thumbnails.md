# Thumbnail Specs — TAX-002 Single-Property P&L Tracker

> **2026-05-03 — Spec revision.** Dropped "Lite edition" labels everywhere. The product is a complete single-property tracker — Lite framing on a tax product creates a refund magnet. Includes-card now lists 8 tabs (Depreciation tab added in 2026-05-03 brief revision).

Clone Task-3 thumbnail master. Reference: `brand/canva-specs.md` Asset 3.

## 1 — Hero
- Zone 3: MacBook mockup showing Schedule E Summary tab with Line 26 "Income or (loss)" value visible
- Zone 2: `Single-Property P&L — Schedule E Ready.` (Cormorant Medium 60pt Harbor Navy)
- Zone 4: `Categories baked in. Depreciation built in. CPA-ready output.` (Inter Semibold 22pt)
- Export: `thumb-1.png`

---

## 2 — From chaos to Schedule E
- Zone 3 split 50/50: LEFT messy receipt pile / generic spreadsheet; RIGHT Schedule E Summary rows screenshot
- Zone 2: `From Chaos To Schedule E In 5 Minutes.` (Cormorant Medium 56pt)
- Zone 4: `Every category pre-mapped to IRS line numbers.` (Inter Semibold 22pt)
- Export: `thumb-2.png`

---

## 3 — Monthly matrix
- Zone 3: Monthly P&L tab screenshot with green Net Income row highlighted
- Zone 2: `Month-By-Month. Category-By-Category.` (Cormorant Medium 60pt)
- Zone 4: `12 months × 17 categories. Auto-calculated.` (Inter Semibold 24pt)
- Export: `thumb-3.png`

---

## 4 — Depreciation built in
- Zone 3: Depreciation tab screenshot with B23 "Current-year depreciation" highlighted in gold pill — show a realistic value (e.g., `$12,832.73`)
- Zone 2: `The Deduction Most Hosts Skip.` (Cormorant Medium 64pt)
- Zone 4: `Built-in 27.5-yr depreciation. Auto-fills Schedule E Line 20.` (Inter Semibold 22pt)
- Bottom-corner stat callout (small Inter Regular 18pt, Graphite): `$400K property + $75K land = $11.8K/yr in depreciation. Don't leave it on the table.`
- Export: `thumb-4.png`

---

## 5 — Includes card (8 tabs)
- Zone 3: Clay Rose (70% opacity) rounded card containing:
  ```
  + Property Info — purchase, loan, in-service, personal-use
  + Revenue Log — 1,000-row capacity, channel-split
  + Expense Log — 2,000-row capacity, Schedule E dropdown
  + Monthly P&L — 17 categories × 12 months
  + Depreciation — 27.5-yr SL, mid-month, auto-fills Line 20
  + Schedule E Summary — CPA hand-off, audit-defense block
  + Settings — active tax year, Schedule E vs C, archive
  + Bonus: STR loophole + 14-day test + QBI safe-harbor flags
  ```
  Inter Semibold 24pt Harbor Navy
- Zone 2: `What You Get` (Cormorant Medium 78pt)
- Zone 4: `Multi-property + asset-by-asset depreciation? Portfolio Master ($97).` (Inter Regular 20pt)
- Export: `thumb-5.png`

---

## Daniel checklist

- [ ] Open the rebuilt DEMO at `templates/_masters/TAX-002-pl-single-property-DEMO.xlsx` and capture screenshots of:
  - Schedule E Summary tab (for hero #1)
  - Monthly P&L tab with Net Income row visible (for #3)
  - Depreciation tab with B23 visible (for #4)
- [ ] Duplicate thumbnail master 5× in Vista Create
- [ ] Build per specs (~12 min each)
- [ ] Export 5 PNGs to `templates/_delivery/TAX-002-pl-single-property/`
- [ ] Commit
