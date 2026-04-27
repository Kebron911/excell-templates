# Brief — TAX-006 Home Office Deduction Allocator

**SKU:** TAX-006
**Category:** Financial / Accounting (master spec §3.2 A #11)
**Tier:** T2
**Etsy price:** $27
**Wave:** 2 (Tax Season Bundle)
**Mode:** Wizard (DEMO + BLANK)
**Campaign tagline:** Make your laundry room pay you back.

## Target persona

**Primary:** Semi-Pro Sarah — runs 3-10 STRs from a dedicated home office (or a corner of a room used regularly + exclusively). Misses ~$2-4K/year in deduction because she doesn't know how to compute it.
**Secondary:** Side-Hustle Sam — one STR, full-time W-2 day job; wants the simplified $5/sqft option.

## The one specific pain

"I run my STR business from a 110-sqft spare room. My CPA said 'you can take a home office deduction' last year but never did the math. I have no idea if it's the simplified method ($5/sqft) or actual method or what the cutoff is."

## What this template does

Wizard that walks through both home-office deduction methods (Simplified Option vs Actual-Expense Method, IRC §280A), captures all required IRS exclusivity tests, and outputs a print-ready Form 8829 mapping (or simplified-method line for Schedule E/C).

Tied directly to the STR loophole / tax-home rules: a qualified home office is what makes residence-to-STR mileage **deductible business travel** (Mileage Log v2.3 logic) instead of non-deductible commuting.

## Sheets / Tabs

| # | Tab | Role |
|---|---|---|
| 0 | Start | Wizard hero + 3-card + Quick Start + Get Started + progress |
| 1 | Eligibility | Regular + exclusive use test, principal place of business test |
| 2 | Space Allocation | Home sqft, office sqft, business-use % computation |
| 3 | Method Election | Simplified vs Actual decision (with side-by-side comparison) |
| 4 | Actual Expenses | Direct + indirect expenses (utilities, insurance, repairs, mortgage int., depreciation) |
| 5 | STR Routing | How the deduction lands on Schedule E vs Schedule C |
| 6 | Form 8829 Map | Auto-built mirror of Form 8829 lines 1-36 |
| 7 | Launch | Deduction summary card + print packet |
| 8 | Settings | Active tax year + classification |

## Inputs

**Eligibility (5 fields):**
- Office space used regularly? (Y/N)
- Office space used exclusively for business? (Y/N)
- Office is principal place of business? (Y/N)
- Storage of inventory/samples? (Y/N — alternative qualifying use)
- Day-care use? (N expected for STR; maintained for completeness)

**Space Allocation (4 fields):**
- Total home sqft
- Office sqft (regular + exclusive)
- Optional: # rooms in home, # rooms used for business (alt method)

**Method Election (1 field + computed comparison):**
- Method: Simplified ($5/sqft, 300 sqft cap = $1,500 max) vs Actual

**Actual Expenses (10-12 fields, only if Actual method):**
- Direct expenses (100% deductible — only-the-office cost)
- Indirect: utilities (electric, gas, water, internet), insurance, repairs (whole-house), real estate taxes, mortgage interest, casualty losses, depreciation (basis × business-use %)

**STR Routing (1 field):**
- Schedule E vs Schedule C (drives which form line the deduction maps to)

## Outputs

- **Simplified deduction** = MIN(office_sqft, 300) × $5
- **Actual deduction** = direct + (indirect × business-use %) + depreciation
- **Recommended method** — auto-flag the higher of the two (with caveat about future-year flexibility)
- **Form 8829 Part I-IV mapping** — print-ready
- **Schedule routing** — Schedule E Line 18a (other) or Schedule C Line 30
- **Form 4562 cross-reference** — depreciation amount feeds Form 4562 Part III if Actual method

## External tax references

- **IRC §280A** — Business use of home (eligibility, exclusivity)
- **Form 8829** — Expenses for Business Use of Your Home
- **Pub 587** — Business Use of Your Home (decision logic, examples)
- **Rev. Proc. 2013-13** — Simplified Option ($5/sqft, 300 sqft cap)

## Business logic

- Both methods require the regular + exclusive use test (no exception).
- "Principal place of business" test: most important business activity OR substantial admin/management activity AND no other fixed location for those activities. Most STR managers qualify.
- Actual-method depreciation locks the home into Section 1250 recapture if/when the home is sold (callout on Method Election tab).
- Simplified method: NO depreciation, NO recapture. Often the better choice for hosts who plan to sell within 5 years.
- Simplified method does NOT allow loss carryover; Actual method DOES.
- Year-to-year flexibility: customer can switch methods annually (no election lock).

## QA sample data (DEMO)

Sarah's home: 2,400 sqft total, 110 sqft dedicated office. Method = Actual. Annual indirect: utilities $4,200, insurance $1,840, repairs $620, mortgage int $9,800, real-estate taxes $4,800. Annual direct: $0. Home-office basis $312,000 (building only), 39-yr straight-line. Expected actual deduction: ~$985.

Simplified comparison: 110 × $5 = $550 (Sarah's actual is higher → recommend Actual).

## Out-of-scope

- Day-care home use (different ratio rules — out of scope for STR)
- Multiple home offices in different homes
- 100% home-as-business (storage of inventory rule complications)
- Casualty losses (rare; documented as out-of-scope on Eligibility tab)

## Upgrade CTA

Tax Season Bundle ($147).
