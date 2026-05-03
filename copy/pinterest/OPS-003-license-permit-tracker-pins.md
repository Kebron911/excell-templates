# Pinterest Pin Set — OPS-003 License/Permit Tracker

**Design spec**
- Dimensions: 1000 × 1500 (Pinterest standard vertical)
- File format: PNG, <10MB
- Title font ≥ 60pt — readable at thumbnail size
- Brand colors only: Harbor Navy `#12304E`, Parchment `#F6EFE2`, Muted Gold `#C9A24B`, Clay Rose `#B5725E`, Graphite `#2B2B2B`
- Wordmark or monogram bottom-right (small, subtle), URL `thestrledger.com` mono-tracked above logo
- Italic "The" + gold period on every wordmark instance
- 48px gold rule under every headline
- Eyebrow: tracked uppercase mono, Muted Gold

**Style variants legend** — Tip-list · Quote-card · Infographic · Question · Before/after

**A/B brand split (per brand-decisions.md §6.4, active through 2026-06-23)**
- **Variant A (control / warning voice):** names the failure first, then the resolution
- **Variant B (challenger / upbeat voice):** leads with the clean outcome, calm authority, no hype
- Two pins each, alternating. Same design, same destination URL — only headline + first description line differ.

---

## Pin set

| # | Pin title (on image) | Style | Variant | URL | Board | Pin description (SEO caption) |
|---|---|---|---|---|---|---|
| 1 | $750 fine + 30-day suspension. Cost of one missed renewal. | Quote-card | A (control) | thestrledger.com/products/license-permit-tracker | STR Tax Tips | Operating an STR with an expired permit is the single most expensive mistake in this business. Nashville: $750 fine plus 30-day operating suspension. Austin: $2,000. Multi-city hosts forget renewals because there is no central calendar — Knox County mails a tax bill once a year, Asheville sends an email, Joshua Tree mails paper. This tracker is the alarm clock. #airbnb #shorttermrental #strpermit #vacationrental #strcompliance |
| 2 | The permit calendar that opens once a quarter. | Tip-list | B (challenger) | thestrledger.com/products/license-permit-tracker | Hosting Like a Business | Six tabs. Permits Register, Renewal Calendar, Permit Discovery for the top 15 STR cities, Filing Log, Settings, and a Start tab that tells you what is red today. Days-to-renewal countdown auto-bands red, gold, parchment. For hosts with 3 to 10 properties across 2 to 5 cities. Excel + Google Sheets. #strpermit #airbnbhost #vacationrental #shorttermrental #strbusiness |
| 3 | Top 15 STR cities — typical permit stack reference. | Infographic | A (control) | thestrledger.com/products/license-permit-tracker | Short-Term Rental Business | Adding a new market is the riskiest move in this business — list before the permit clears and a cease-and-desist letter shows up 45 days later. Permit Discovery covers Nashville, Gatlinburg, Austin, Asheville, Phoenix, Orlando, Joshua Tree, Hilton Head, Myrtle Beach, San Diego, Denver, Savannah, Outer Banks, Miami, New Orleans, Big Bear. Typical stack, fees, renewal cadence, "as of" stamp. Verify locally — rules change. #strregulation #airbnbpermit #vacationrental #strinvesting #shorttermrental |
| 4 | One spreadsheet. Every city. Every renewal. | Before/after | B (challenger) | thestrledger.com/products/license-permit-tracker | STR Templates & Tools | Stop tracking permits in your head. The Renewal Calendar sorts every permit by days-to-renewal — EXPIRED above the line, RENEW NOW under 30 days in red, UPCOMING in gold. Conditional formatting handles the urgency banding. The Start tab tells you what to do today. $47, lifetime updates. #strpermit #airbnbtemplate #vacationrental #shorttermrental #strops |

---

## Hashtag strategy

Five max per pin. Always include `#strpermit` or `#strregulation` + `#airbnb` or `#shorttermrental` + topic-specific (`#strcompliance`, `#vacationrental`, `#strops`). Never `#money`, `#hustle`, or any guru-adjacent tag.

## Board targets

- **STR Tax Tips** — primary for compliance/penalty pins
- **Short-Term Rental Business** — primary for analytical/reference pins
- **Hosting Like a Business** — secondary, ops framing
- **STR Templates & Tools** — secondary, product-feature pins

## Tracking

Log pin-level performance weekly in `ops/pinterest-ab-test.md`. Pin ID, variant (A/B), campaign (operations), impressions, outbound clicks, saves, outbound CTR. Decision date 2026-06-23 per brand-decisions.md §6.4.
