# Brief — TAX-012 Schedule C Tax Prep Workbook (active/material-participation STR)

**SKU:** TAX-012
**Catalog #:** 4 (master spec §3.2 A)
**Mode:** Wizard (fill once per tax year)
**Tier:** T3
**Fork from:** `build_schedule_e_tax_prep.py` (Schedule E sibling) + `build_welcome_book_v2.py` (wizard reference)
**Filenames:** `TAX-012-schedule-c-tax-prep-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Year-end checklist + summary workbook for STR hosts who file **Schedule C** (active business — substantial services or material participation triggering it). Mirrors the Schedule E sibling but adds: SE tax preview, hospitality-services worksheet, qualified-business-use vehicle test, and a callout that the customer should have material-participation hours documented.

**See [str-tax-context.md](../../.claude/skills/str-ledger-template/references/str-tax-context.md)** — Schedule C/E decision is the most consequential classification this customer makes. Workbook reinforces the line.

## Tabs (10)
| # | Tab | Role |
|---|---|---|
| 1 | Start | Wizard hero + "Are you sure Schedule C is right for you?" callout |
| 2 | §1 Eligibility Confirmation | 5 questions to verify Schedule C is correct (substantial services? material-participation hours?) |
| 3 | §2 Income | Gross rent, cleaning fees collected, platform service fees withheld, other income |
| 4 | §3 Operating Expenses | Standard Schedule C lines (advertising, insurance, supplies, utilities, repairs, etc.) |
| 5 | §4 Vehicle | Mileage method election, business miles, Form 4562 Part V check |
| 6 | §5 Home Office | Allocation method, sq ft, % business use |
| 7 | §6 Depreciation + Section 179 | Asset list, depreciation summary (lookup against TAX-013 if owned) |
| 8 | §7 Self-Employment Tax | Net SE income → SE tax preview (15.3% × 92.35%) |
| 9 | §8 Document Checklist | 30-item tax-document checklist for handing to CPA |
| 10 | Launch | Readiness % + Print-Packet button + summary table by Schedule C line |

## §1 Eligibility Confirmation
5 yes/no questions:
1. Do you provide substantial services during stays? (cleaning *during* stay, meals, concierge, etc.)
2. Do you meet the 100/500/most-active material-participation tests?
3. Have you already been filing Schedule C in prior years?
4. Has your CPA confirmed Schedule C is right for your circumstances?
5. Is this a hospitality business, not a passive rental?

If ≥3 N → red flag banner: "Confirm with your CPA. Schedule E may be more appropriate."

## §3 Operating Expenses (Schedule C lines)
12-column table (12 months) × ~22 expense categories matching Schedule C lines 8-27. Same matrix shape as TAX-002 P&L but mapped to Schedule C, not E.

## §7 Self-Employment Tax
- Net Schedule C profit (input or formula)
- × 92.35% = SE earnings subject to tax
- × 15.3% = SE tax liability (12.4% SS up to wage base + 2.9% Medicare unlimited)
- Half deductible on Form 1040 line 15

Live preview: "Estimated SE tax: $X. Your total federal liability with regular income tax may be $Y."

## §8 Document Checklist
30 items: 1099-K from platforms, 1099-NEC for contractors paid, mortgage 1098s, property tax bills, insurance dec pages, utility year-end summaries, mileage log totals, home office sq ft proof, prior-year Schedule C, S-corp K-1 if applicable, etc.

## Launch tab summary
Schedule C line-by-line totals (gross income, expenses by line, net profit, SE tax estimate). Print-ready handoff for CPA.

## Sample data (DEMO)
Smokies Ridge active host: $98K gross rent, $52K expenses, $46K net Schedule C profit, $6,500 SE tax preview.

## Settings
- B5 Active tax year
- B7 Property list
- B9 CPA contact info (name, email, phone)
