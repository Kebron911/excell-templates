# Brief — GST-001 Airbnb Welcome Book

**SKU:** GST-001
**Category:** Guest Experience (master spec §3.2 D)
**Tier:** T1
**Etsy price:** $17
**Own-site price:** $17 (same — gateway product)
**Wave:** 1
**Tagline:** Welcome books that earn 5-stars.

## Target persona

**Primary:** Side-Hustle Sam (1–2 listings, W2 + STR) — his first Etsy purchase, impulse buy.
**Secondary:** Newbie Nina (1 listing, just launching) — needs a welcome book NOW.
**Tertiary:** Semi-Pro Sarah (3–10 listings) — will buy 3–10 copies, one per property; discovers our shop and climbs the ladder.

## The one specific pain

"My guests keep emailing me at 11pm asking about wifi, trash day, or the hot tub. I've been sending them a Google Doc I made 2 years ago that looks unprofessional and doesn't even cover everything."

## What this template does

A guest-facing welcome book — editable Excel with matching PDF — that covers the 9 sections hosts wish their guests would read *before* the 11pm question. Designed to look professional, print cleanly, and work digitally via QR code.

## Sheets / Tabs

| # | Tab | Role | Input or Output |
|---|---|---|---|
| 1 | "Welcome" | Cover page + how-to | Input: property name, host first name, dates of stay |
| 2 | "Arrival" | Check-in instructions | Input: address, door code, parking details |
| 3 | "WiFi + Tech" | Network + smart-device info | Input: wifi name/pw, TV/streaming, smart lock |
| 4 | "House Rules" | Rules with section headers | Input: quiet hours, smoking, pet policy, max guests |
| 5 | "Local Guide" | Restaurant/coffee/groceries/emergencies | Input: business name, distance, phone, notes |
| 6 | "Trash + Recycling" | Pickup schedule + bin location | Input: day of week, where bins live, sorting rules |
| 7 | "Departure" | Checkout checklist | Input: checkout time, key return method, last-minute tasks |
| 8 | "Emergency" | Hospital, police, 24-hr vet, utility outages | Input: phone numbers, addresses |
| 9 | "Host Reference" | Private tab for host (host-only notes) | Input: things not to share with guest, vendor list |

## Inputs (what the host types)

All cells in sheets 1–8 that get printed/shared with guests are input cells (yellow-tinted via `brand_config.input_cell_style()`). Sheet 9 is host-only and not part of the guest-facing PDF.

Approximate input fields per tab: 8–15. Total inputs across workbook: ~80 fields.

## Outputs (what gets calculated/derived)

Welcome Book is *mostly content*, not formulas. Two light outputs:

1. **Sheet 1 "Welcome" — auto-display host's name + property name** in the title row via cell reference `=CONCATENATE("Welcome to ", B5)`
2. **Sheet 7 "Departure" — checkout day weekday display:** if user enters a checkout date in sheet 1 B9, sheet 7 displays `"<weekday>, <month> <day>"` via `=IF(Welcome!B9<>"", TEXT(Welcome!B9,"dddd, mmmm d"), "See Welcome tab")`
3. **Sheet 8 "Emergency" — host phone pulled from Welcome tab** via `=Welcome!B7` so the guest doesn't have to flip back.

## External data references

None. No IRS rates, no API calls. Pure content template.

## Business logic

- Print-ready: when printed, the "Host Reference" tab must be hidden. Include a note on sheet 1 and on sheet 9 that sheet 9 is host-only.
- Three delivery modes: (a) printed and placed in property, (b) sent as PDF via email, (c) QR code on a placard pointing to a hosted PDF.
- Template must work for any rental type — single-family, cabin, condo, glamping. Avoid overly-specific wording like "in your beach house".
- No workbook protection — buyers must be able to edit every cell.

## QA sample data

For QA, populate with a fake property:
- Property name: "Smokies Ridge Cabin"
- Host: "Daniel"
- Host phone: "+1 (555) 555-0199"
- Address: "123 Mountain Lane, Gatlinburg, TN 37738"
- WiFi: "SmokiesRidge_Guest" / "welcome2024"
- Check-in: 2026-05-10
- Checkout: 2026-05-15

All 9 tabs should populate coherently with this sample.

## Upgrade CTA

On Sheet 1 Welcome tab, row 18 (after the sample-usage instructions), place the branded upgrade banner (from `brand_config.add_upgrade_banner`). Copy reads:

> 💡 Upgrade path: Get the Multi-Property Welcome Book Bundle at thestrledger.com/bundle — welcome books for every property in one workbook + a printable guest QR-code pack.

(Note: the Multi-Property Bundle is a Phase 2+ product — this CTA captures intent for the email list.)

## Out-of-scope

- Property photos (hosts add their own post-download)
- Language translation (English only for MVP)
- Multi-property consolidation (Phase 2+ Bundle)
- Interactive / fillable PDF (MVP is Excel + print/QR-code-hosted PDF)
