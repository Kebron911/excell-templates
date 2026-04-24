# Template Production Process (SOP)

Every Excel template goes through this exact process. Do not skip steps.

## 1. Brief (user-supplied)

User writes a one-page brief to `templates/_briefs/<SKU>.md` covering:

- Target persona (Sam / Sarah / Pam)
- One specific pain this solves (one sentence)
- Input fields (what the user types or pastes)
- Output fields (what gets calculated)
- Any formulas or logic (tax rates, lookups, conditional math)
- Any external data references (IRS rates, mileage rates, seasonal schedules)
- Screenshots or sketches if helpful
- Edge cases and "what could go wrong"

**Brief template (copy this when starting a new template):**

```markdown
# Brief: <Template Name>

## SKU
<CAT-NNN>  (e.g., TAX-001, OPS-002)

## Target persona
<Sam / Sarah / Pam — one primary>

## Pain statement (one sentence)
<"Sarah spends 6 hours each quarter categorizing deductible mileage because she..." >

## Expected tier / price
<T1 $17 / T2 $47 / T3 $147 / etc.>

## Inputs (what the user enters)
1. <Field name> — <type: text / number / date / dropdown> — <validation>
2. ...

## Outputs (what gets calculated)
1. <Field name> — <formula in plain English>
2. ...

## Tabs
1. <Cover / Branding>
2. <Main entry>
3. <Summary / Dashboard>
4. ...

## External data
<IRS rates, tax tables, mileage rates, etc. and where they come from>

## Success criteria
<How do I know this template actually solves the pain? What sample data gives what sample outputs?>

## Edge cases
- <Case 1>
- <Case 2>

## Known constraints
- <Excel version compatibility>
- <Google Sheets compatibility notes>
- <Anything else>
```

## 2. Spec

Claude drafts a Sheet-by-Sheet Spec to `templates/_briefs/<SKU>-spec.md`:

- Tab 1 name, purpose, field list, formulas, merged cells, colors
- Tab 2 name, purpose, ...
- Branding tab (welcome, how-to-use, upgrade CTA if Etsy-Lite)
- Print-ready tab where applicable (printable summary for tax filing, for example)
- Exact cell references for all formulas
- Data validation rules per input cell
- Conditional formatting rules

## 3. Build

Build the `.xlsx` file at `templates/_masters/<SKU>.xlsx`:

- Apply brand colors from `brand/brand-decisions.md`
- Lock formula cells (Protect Sheet with formula cells locked, input cells unlocked; no password — buyer can unprotect if they want to customize)
- Add data validation where inputs are bounded (dropdowns, date ranges, numeric limits)
- Test with sample data that matches the brief's expected outputs (copy sample data from the brief into a hidden "test" tab)
- Add conditional formatting where it aids the user (traffic-light thresholds, empty-cell warnings)
- Use named ranges for key formulas to keep them readable

**Claude's build role:** draft spec, generate formulas, list cell ranges. **Daniel's build role:** open Excel, execute the build, QA. Claude cannot reliably open/save .xlsx files across Excel versions — human hands required.

## 4. QA

- Open in Excel 2016+ on Windows
- Open in Excel 365 on Mac (or use Excel Online as proxy)
- Import into Google Sheets and note any broken formulas (usually lookups or array formulas)
- Verify all sample outputs match brief expectations
- Spell-check every cell label
- Test what happens when inputs are blank, zero, or extreme values
- Confirm protection is applied correctly (formula cells locked)
- Confirm file saves cleanly with no warnings

## 5. Lite variant (for Etsy only)

- Duplicate master to `templates/_lite/<SKU>-lite.xlsx`
- Remove 1–2 tabs that are "pro" features (multi-property rollup, advanced scenarios)
- Add prominent upgrade CTA on cover tab linking to own-site premium version
- CTA language: "Upgrade to the full multi-property version at yoursite.com/upgrade — your Etsy purchase applies as credit."
- Verify lite still delivers the core promise — not crippled, just narrower

## 6. Delivery assets

Create in `templates/_delivery/<SKU>/`:

- `thumbnail.png` (2000×2000 PNG from Vista Create master in Task A4)
- `preview-1.png` through `preview-5.png` — screenshots with marketing-angle overlays ("Save 4 hours/quarter", "Every deduction in one place")
- `companion.pdf` — 1-page how-to with upgrade CTA
- Description copy drafted to `copy/etsy-listings/<SKU>.md`

## 7. Publish

- Create Etsy listing with tags, title, description, thumbnails
- Mirror to Gumroad (same files, same description — Gumroad gets the Master, not the Lite)
- Add product row to Airtable Products table (populated via n8n Task B9 once that workflow is live)
- Schedule Pinterest pin announcement (via Creasquare — 3 pins per launch; Pinterest native as fallback)

## 8. Monitor

- First sale alert → verify the file actually opened for the buyer (follow up with a thank-you email that also asks)
- Track listing views / conversion weekly
- Iterate thumbnails after 50 views with <2% conversion
- Iterate title/description after 200 views with <1% conversion
- If refund rate exceeds 5%, investigate quality or expectation mismatch

## Role split per step

| Step | Daniel (user) | Claude |
|---|---|---|
| 1. Brief | ✅ writes | — (can ask clarifying questions) |
| 2. Spec | reviews + approves | ✅ drafts |
| 3. Build | ✅ executes in Excel | drafts spec-level instructions |
| 4. QA | ✅ cross-version testing | generates QA checklist |
| 5. Lite variant | ✅ executes | drafts changes list |
| 6. Delivery assets | reviews + approves | ✅ drafts thumbnails + copy |
| 7. Publish | executes (or Claude if APIs available) | ✅ drafts listings, mirrors via n8n |
| 8. Monitor | reviews metrics | ✅ analyzes + suggests iteration |

## Why Daniel handles Excel directly

Claude does not have reliable read/write access to binary `.xlsx` files across Excel versions. The build step must happen in real Excel with a human operator. Claude's role is to make that build as frictionless as possible — exact cell references, formula text, sample data, and validation rules — so the Excel work is pure mechanical execution, not design.

## SKU naming convention

`<CAT>-<NNN>` where `CAT` is 2–3 letters for category:

- `TAX` — tax and accounting (Financial category)
- `OPS` — operations
- `ACQ` — acquisition / underwriting
- `GST` — guest experience
- `PRC` — pricing / revenue management
- `MKT` — marketing / growth
- `LEG` — legal / compliance
- `TEAM` — team / co-hosting
- `STR` — strategic / exit planning
- `SPC` — specialty / sub-niche

Examples: `TAX-001` (Mileage Log), `OPS-001` (Turnover Checklist), `GST-001` (Welcome Book).

## Versioning

Semantic versioning on templates: `MAJOR.MINOR.PATCH`.

- MAJOR: breaking change (buyer needs to re-download and transfer data)
- MINOR: new tab or feature, backwards-compatible (buyer can re-download but old version still works)
- PATCH: bug fix, formula correction, typo

Every version bump: update changelog in Airtable Products row, trigger re-send email to buyers via n8n "Template Update" workflow (Phase 2).
