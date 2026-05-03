# Pinterest — PAM-001 Owner Reporting Dashboard (4 pins)

**Design spec:**
- Dimensions: 1000 × 1500 (Pinterest standard vertical)
- File format: PNG, <10MB
- Title font: Cormorant Garamond Medium 500, ≥60pt, tracking -0.01em
- Body / supporting line: Inter 400, 24-32pt
- Brand colors: Parchment `#F6EFE2` background default; Harbor Navy `#12304E` display type; Muted Gold `#C9A24B` for period-mark and 48px gold rule; Clay Rose `#B5725E` accents only
- Wordmark in lower-right corner at ~140px wide; URL set in JetBrains Mono uppercase, 12pt, tracked 0.20em
- Italic "The" before "STR Ledger" wordmark; gold period after every display headline; gold rule under the headline

**Style variants legend:**
- **Tip-list** — bulleted promise + headline
- **Quote-card** — bold claim + subtle supporting line
- **Infographic** — visual breakdown (table preview, fee model grid)
- **Before/after** — split visual (chaos / clean) with overlay

**A/B brand split (active per brand-decisions §6.4 through 2026-06-23):**
- **Variant A (control — §6.1 warning/solution voice):** names the failure or risk first, then the resolution
- **Variant B (challenger — upbeat outcome voice):** leads with the clean outcome or confident next step
- 2 pins each, alternating

**Voice note (B2B):** PAM-001 sells to property managers, not first-time hosts. Pin copy stays editorial-finance but skews more peer-to-peer professional. No beginner-isms. Specific dollar figures stay in.

---

| # | Pin title (on image) | Style | Variant | URL | Board | Pin description (SEO caption) |
|---|---|---|---|---|---|---|
| 1 | The Month-End Excel Ritual That Costs You $4,800 a Year. | Quote-card | A (control) | `thestrledger.com/products/owner-reporting-dashboard` | Hosting Like a Business | Property managers running 8-10 STRs for other owners typically spend 4 hours per month rebuilding custom owner statements in Excel. At $100 of your time per hour, that is $4,800 a year — and the workbook that ends it is $197. White-label owner statements with your logo, five fee models, withholding tracking, year-end 1099-MISC worksheet. For STR co-hosts and property managers. #propertymanager #airbnbcohost #strmanager #vacationrentalmanager #shorttermrental |
| 2 | Owner Statements Your Owners Forward to Their CPAs. | Before/after | B (challenger) | `thestrledger.com/products/owner-reporting-dashboard` | STR Templates & Tools | White-label, 1-page, printable — your logo at the top, no other branding anywhere. Generates from a single booking log and a single expense log. Five fee models (flat, % revenue, % net, hybrid base + performance bonus, other). Withholding-month field recovers every Pam-paid expense automatically. For property managers and co-hosts running 5-50 STRs. $197 one-time. #propertymanagement #airbnbcohost #strtemplate #ownerreport |
| 3 | Five Fee Models. One Tab. Hybrid Base + Bonus, Calculated. | Infographic | A (control) | `thestrledger.com/products/owner-reporting-dashboard` | Short-Term Rental Business | The fee structure that wins property managers in the STR industry — base fee plus a performance bonus when occupancy clears a threshold — is also the fee structure that breaks most templates. This workbook handles all five common fee models per property. Plus % of revenue, % of net, flat, and "other" for tiered or compound arrangements. Owner Reporting Dashboard, $197. #propertymanagement #managementfees #airbnbcohost #strbusiness #vacationrentalmanagement |
| 4 | Every $620 Reimbursement, Captured. None Forgotten. | Tip-list | B (challenger) | `thestrledger.com/products/owner-reporting-dashboard` | Hosting Like a Business | Pam-paid expenses — HVAC, linens, plumbing — recover automatically through a withholding-month field on the Expense Log. The right cost hits the right owner statement in the right month. The leak that costs property managers $200-$600 a year in forgotten reimbursements, closed. White-label owner statements included. $197. #propertymanager #strbusiness #airbnbcohost #vacationrentalmanagement |

---

## Production notes

- Pin 1 (Quote-card, A): Cormorant 78pt headline. Single math line below: "4 hrs/mo × $100/hr × 12 = $4,800" in Inter Mono 28pt with a gold rule above. Background full Parchment.
- Pin 2 (Before/after, B): Top half = a generic property-management logo (placeholder mark) over the Owner Statement print preview, in full color, on Parchment. Bottom half = a chaotic Excel grid in muted greyscale on Parchment-alt. Headline overlays the seam in Cormorant 64pt.
- Pin 3 (Infographic, A): 5-row mini-table of fee models, each row with a navy bullet and a gold formula snippet to the right. Headline 56pt above. Mono "5 MODELS · ONE TAB" in tracked uppercase below the table.
- Pin 4 (Tip-list, B): Three-bullet list (Pam-paid flag / withholding-month / auto-statement deduction). Each bullet a small Clay Rose dot. Cormorant headline 64pt at top.

All four pins must include: italic "The" before "STR Ledger" in wordmark; gold period after the display headline; 48px gold rule under headline; URL in JetBrains Mono lower-right.
