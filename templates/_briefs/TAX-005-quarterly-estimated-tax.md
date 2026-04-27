# Brief — TAX-005 Quarterly Estimated Tax Calculator

**SKU:** TAX-005
**Category:** Financial / Accounting (master spec §3.2 A #13)
**Tier:** T2
**Etsy price:** $27
**Wave:** 2 (Tax Season Bundle)
**Mode:** Operational (matrix — 4 quarters × line items)
**Campaign tagline:** Stop guessing what you owe.

## Target persona

**Primary:** Semi-Pro Sarah — Schedule C or material-participation E filer with no W-2 withholding to cover SE + income tax. Got hit with an underpayment penalty in 2025.
**Secondary:** Pro Pam — multi-property portfolio with co-host distributions; spouse W-2 may or may not cover.

## The one specific pain

"I underpaid quarterly estimateds by $4,200 in 2025 and the IRS hit me with a $186 underpayment penalty + interest. I want a workbook that tells me what to send each quarter — not in April when the year is already over."

## What this template does

Tracks YTD income and expenses by quarter (Q1: Jan-Mar 31, Q2: Apr-May 31, Q3: Jun-Aug 31, Q4: Sep-Dec 31 — IRS unequal calendar) and projects:
- **Annualized estimated tax** based on YTD profit
- **Safe-harbor tax** based on prior-year AGI ($110% if AGI > $150K, $100% otherwise)
- **Required quarterly payment** = MIN of the two methods
- **Cumulative cushion** vs IRS Form 1040-ES voucher threshold

Mirrors **Form 1040-ES** structure. Customer hands the quarterly $ to their CPA or pays directly via IRS Direct Pay.

## Sheets / Tabs

| # | Tab | Role |
|---|---|---|
| 0 | Start | Operational hero + activity cards + primary "Update YTD" button + quarter status |
| 1 | Quarterly P&L | 4-column matrix (Q1-Q4) × ~24 income/expense lines |
| 2 | Estimated Tax | 1040-ES worksheet logic, two methods + safe harbor |
| 3 | Payment Schedule | 4 vouchers — due dates, amounts, paid Y/N, method (EFTPS / DirectPay / mail) |
| 4 | Settings | Active tax year · filing status · prior-year AGI/tax · brackets reference |

## Inputs (Quarterly P&L tab)

**Income lines (4):** Gross rents (4 quarters), Cleaning fees collected (4Q), Other income (4Q), Less refunds/chargebacks (4Q).

**Expense lines (~20):** All Schedule E/C expense lines (advertising, auto/travel, cleaning, commissions, insurance, legal, mgmt fees, mortgage interest, repairs, supplies, taxes, utilities, depreciation, home office, other) × 4 quarters.

**Settings:** Active tax year, filing status (Single / MFJ / HoH / MFS), prior-year AGI, prior-year total tax, this-year withholding from spouse W-2 (if any), Schedule classification (E or C — drives whether SE tax applies).

## Outputs

- Net profit per quarter (income − expenses) — **Quarterly P&L** tab
- Annualized projection (per IRS 1040-ES Annualized Income Installment method)
- Safe-harbor tax = max(prior-year tax × 1.10 if AGI > $150K, else × 1.00)
- Required quarterly payment = (lesser of two methods − YTD withholding) ÷ remaining quarters
- 4 voucher amounts on **Payment Schedule** with IRS due dates: Apr 15, Jun 15, Sep 15, Jan 15
- Underpayment-risk flag (red) if YTD paid is below YTD required

## External tax references

- **IRS Form 1040-ES (2026)** — voucher structure, safe-harbor rules
- **IRC §6654** — underpayment penalty
- **Pub 505** — Tax Withholding & Estimated Tax (annualized installment method)

## Business logic

- IRS quarterly periods are **NOT** calendar quarters — Q1 = Jan 1-Mar 31, Q2 = Apr 1-May 31, Q3 = Jun 1-Aug 31, Q4 = Sep 1-Dec 31. Document this on Settings.
- Safe-harbor election: 100% of prior-year tax (or 110% if prior AGI > $150K). Apply this exact rule.
- SE tax = 15.3% on 92.35% of net SE income (Schedule C only). Driven by Settings classification dropdown.
- Income tax = bracket-stack math at filing-status brackets. Use 2026 brackets (single/MFJ).
- Payments tracked on Payment Schedule; running cumulative paid feeds the underpayment-risk flag.
- All YTD aggregations driven by `Settings!$B$5` (active tax year) — do NOT use YEAR(TODAY()) per str-tax-context.

## QA sample data (single workbook with sample rows; no DEMO/BLANK split needed)

Sarah's STR portfolio — Q1 net $7,200, Q2 net $11,400, Q3 net $14,600, Q4 net $9,800 → annualized net $43K. Filing MFJ, prior-year AGI $148K, prior-year tax $14,200. Spouse W-2 covers $2,000/quarter. Expected required quarterly: ~$2,840.

## Out-of-scope

- Multi-state estimated tax (federal only — state goes to TAX-011 future SKU)
- AMT (alternative minimum tax) — flag risk only, don't compute
- Form 2210 underpayment-penalty calculation (this is a forward-looking tool, not a back-fill)
- Quarterly state estimateds

## Upgrade CTA

"Upgrade to the Tax Season Bundle ($147) — Schedule E + Schedule C + Mileage + 1099 + Home Office + Section 179 + Quarterly Estimateds + Per-Diem."
