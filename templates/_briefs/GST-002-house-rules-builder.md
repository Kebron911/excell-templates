# Brief — GST-002 House Rules Builder

**SKU:** GST-002
**Catalog #:** 43 (master spec §3.2 D)
**Mode:** Wizard (fill once per property)
**Tier:** T1
**Fork from:** `build_welcome_book_v2.py` (wizard reference — section_header_band, build_input_tab pattern)
**Filenames:** `GST-002-house-rules-builder-DEMO.xlsx` + `-BLANK.xlsx`

## What it does
Wizard that walks the host through 6 sections of house rules and outputs a printable, listing-ready rules document. Avoids the "blank textarea on Airbnb" problem — most hosts list 4 generic rules; this product produces 25-40 specific, defensible rules organized by topic.

## Tabs (8)
| # | Tab | Role |
|---|---|---|
| 1 | Start | 6-zone wizard hero (per wizard-mode.md) |
| 2 | §1 Property + Capacity | Address, capacity, sleeping arrangements, parking |
| 3 | §2 Quiet Hours + Parties | Hours, gatherings, guest-of-guest policy, music limits |
| 4 | §3 Smoking + Substances | Smoking, vaping, weed, alcohol; designated areas if any |
| 5 | §4 Pets | Pet policy (links to GST-003 if pets allowed), service-animal exception |
| 6 | §5 Damage + Liability | Furniture moving, pool/hot tub rules, fireplace rules, kids policy |
| 7 | §6 Check-out + Penalties | Check-out time, late-checkout fee, missing-item fee, smoking violation fee |
| 8 | Launch | Readiness % + 📄 PRINT-READY RULES DOC button → Rules Output tab |
| 9 | Rules Output | Single page, formatted for print/copy-paste to listing platform |

## Section input pattern (per `build_input_tab` skeleton)
Each input section is a list of `Card` objects with question + input cell. Use `section_header_band()` for the header band.

Sample cards for §2 Quiet Hours:
- Card 1: "Quiet hours" — start time / end time inputs
- Card 2: "Parties" — dropdown (No parties / Small gatherings ≤ <input> people / Yes / Custom)
- Card 3: "Guests of guests" — checkbox + count input
- Card 4: "Outdoor music after dark" — Y/N + decibel limit if Y

Total ~30 input cells across 6 sections.

## Rules Output tab
Auto-generates a print-ready bullet list pulling from inputs. Formula-driven concatenation: `="• Quiet hours " & TEXT(QuietStart,"h:mm AM/PM") & " to " & TEXT(QuietEnd,"h:mm AM/PM")`.

Sections grouped under headers (Quiet Hours • Parties • Smoking • Pets • Damage • Check-out & Fees). Print area set, fits 1-2 pages.

## Sample data (DEMO)
Smokies Ridge Cabin, 4BR 3BA, sleeps 10. Realistic quiet hours 10pm-8am, no parties, no smoking inside, $250 smoking fine, pets allowed (max 2 dogs <50lb, $50/pet/stay), check-out 10am, $50 late fee.

## Output deliverable
Customer copies the Rules Output tab into Airbnb / VRBO / Booking listing's house-rules field, OR prints it for the property's binder.

## Wizard floor (per wizard-mode.md)
- Start tab: hero / what-you'll-build / quick-start / get-started button / progress dashboard / footer
- Each input tab: section_header_band + cards + secondary nav
- Launch tab: completion % / red flags / status / primary "📄 BUILD RULES DOC" button (links to Rules Output)
