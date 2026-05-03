# Brief — GST-003 Pet Policy Document Builder

**SKU:** GST-003
**Catalog #:** 46 (master spec §3.2 D)
**Mode:** Wizard (fill once per property)
**Tier:** T0/T1 (Etsy gateway product, low-price)
**Fork from:** `build_welcome_book_v2.py` (wizard reference)
**Filenames:** `GST-003-pet-policy-document-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Short wizard producing a print/listing-ready pet policy. 4 sections, ~15 inputs total. Outputs a one-page document covering: pets allowed, weight/breed/count limits, fees, designated areas, damage rules, service-animal exception, behavior expectations.

## Tabs (6)
| # | Tab | Role |
|---|---|---|
| 1 | Start | Wizard hero + "build a pet policy in 5 minutes" |
| 2 | §1 Pet Eligibility | Pets allowed Y/N, max count, weight cap, breed restrictions, age requirement |
| 3 | §2 Fees + Deposits | Per-pet fee, refundable deposit, cleaning surcharge, damage deductible |
| 4 | §3 Property Rules | Allowed rooms, furniture/bed access, leash rule, alone time policy, waste disposal |
| 5 | §4 Service Animals + Liability | ADA service-animal callout, owner-liability statement, vaccination requirement |
| 6 | Launch | Readiness % + 📄 BUILD POLICY DOC button → Output tab |
| 7 | Policy Output | Print-ready policy, single page, brand-styled |

## §1 Pet Eligibility cards
- Pets allowed (Y/N)
- Max count (1-4)
- Per-pet weight cap (input lbs)
- Breed restrictions (free text or default list dropdown)
- Min age (e.g., "must be ≥1 year, fully house-trained")

## §2 Fees + Deposits
- Per-pet fee per stay ($)
- Refundable deposit ($)
- Per-night surcharge (optional)
- Damage deductible (host's threshold before charging)

## §3 Property Rules
- Allowed in main living spaces? (Y/N)
- Allowed on furniture / beds? (dropdown: Yes / No / Covered only)
- Pets alone in unit? (dropdown: Allowed / Crated only / Never)
- Outdoor leash required? (Y/N)
- Waste disposal expectation (free text)

## §4 Service Animals + Liability
- ADA service-animal exception text (boilerplate, not editable)
- Owner-liability statement (boilerplate)
- Vaccination requirement (Y/N)
- Documentation request (Y/N)

## Policy Output
Single page formatted with section headers, brand styling, footer. Customer prints + tapes inside cabin OR pastes into Airbnb listing.

## Sample data (DEMO)
Smokies Ridge Cabin: pets allowed, max 2 dogs ≤50lb, no aggressive breeds, $50/pet/stay, $200 refundable deposit, allowed everywhere except primary bedroom + on couch (covered only), no alone time longer than 4 hrs, leashed in common areas.

## Wizard floor
Same as wizard-mode.md. Smaller scope than house rules — 4 sections × 4 inputs each = 16 inputs total. Customer should finish in <3 minutes.
