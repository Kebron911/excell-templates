# Sheet Spec — GST-001 Airbnb Welcome Book (v2.1 flattened layout)

## Workbook-level

- Filename: `GST-001-welcome-book.xlsx` (shipped as two files: `-DEMO.xlsx` + `-BLANK.xlsx`)
- Tab colors: Harbor Navy `COLOR_PRIMARY` for guest-facing (tabs 1-8), Clay Rose `COLOR_SECONDARY` for host-only (× Host Notes tab)
- Print area: each input tab has print area set to fit 1 page letter-portrait (except Local Guide which is 2 pages landscape)
- Layout on input tabs (v2.1):
  - Rows 1-5 : navy section header band (title, subtitle, back/next buttons)
  - Row 6    : instruction strip (parchment, italic)
  - Row 7    : single section banner (gold-soft fill, shows the tab title)
  - Rows 8+  : labels in col A, inputs merged B:L, flattened — no per-card header banners. Card groupings are indicated only by a thin gold top-border "tick" on the first row of each subsequent card.
- Freeze panes: A8 (rows 1-7 stay visible) on all input tabs
- Default font: Calibri 11pt body (FONT_BODY); Georgia bold for titles (FONT_HEAD)
- Workbook protection: NONE (every cell must be editable by buyer)

## Sheet — "Property" (Section 1 of 8)

Title band: "Property Info" / "Who you are and where they're staying."
Row 7 section banner: "PROPERTY INFO"

| Row | Col A (label) | Col B:L (input, merged) |
|---|---|---|
| 8  | "Property name:" | input — "Smokies Ridge Cabin" |
| 9  | "Host first name:" | input — "Daniel" |
| 10 | "Host phone (text preferred):" | input — "+1 (555) 555-0199" |
| 11 | "Check-in date:" | input — "2026-05-10" |
| 12 | "Check-out date:" | input — "2026-05-15" |
| 13 | "Property type:" | input + DROPDOWN (Single-family / Cabin / Condo / Apartment / Multi-family / Glamping / Other) |
| 14 | "Max guests:" | input (number) — 6 |
| 15 | "Full address:" | input — "123 Mountain Lane, Gatlinburg, TN 37738" |
| 16 | static note: "First time? Go to Start → Quick Start for the 5-minute path." (full-width merged) | |

Input range for COUNTA/progress: `B8:B15` (8 fields).
Cross-tab dependencies: `Departure!B9` pulls check-in date via `Property!B11`; `Emergency!B17` pulls host phone via `Property!B10`; Launch tab preview pulls Property!B8 (name), B9 (host), B10 (phone), B11 (check-in), B12 (check-out).

## Sheet — "Arrival" (Section 2 of 8)

Title band: "Arrival & Check-in" / "Everything your guest needs on day one."
Row 7 section banner: "ARRIVAL & CHECK-IN"

| Row | Col A (label) | Col B:L (input, merged) |
|---|---|---|
| 8  | "Full address:" | input — "123 Mountain Lane, Gatlinburg, TN 37738" |
| 9  | "Entry method:" | input + DROPDOWN (Smart lock / Key lockbox / In-person / Other) |
| 10 | "Door/lock code:" | input — "4321" |
| 11 | "Parking instructions:" | input (wrap, row height 36) |
| 12 | "Best route (if tricky):" | input (wrap, row height 36) |
| 13 | "Arrival time window:" | input — "After 3 PM" |
| 14 | "If you arrive early:" | input (wrap, row height 36) |
| 15 | static: "1. Crank the thermostat to your comfort — WiFi tab has controls." | |
| 16 | static: "2. Connect to WiFi — network + password on the WiFi tab." | |
| 17 | static: "3. Check the fridge for welcome items." | |
| 18 | static: "4. If anything's broken, text the host immediately." | |

Input range for progress: `B8:B14` (7 fields). Dropdown on B9.

## Sheet — "WiFi + Tech" (Section 3 of 8)

Title band: "WiFi & Technology" / "So nobody has to text you about the wifi password."
Row 7 section banner: "WIFI & TECHNOLOGY"

| Row | Col A (label) | Col B:L (input, merged) |
|---|---|---|
| 8  | "WiFi network name:" | input — "SmokiesRidge_Guest" |
| 9  | "WiFi password:" | input — "welcome2024" |
| 10 | "Backup network (if any):" | input — blank |
| 11 | "TV streaming — service + login:" | input (wrap, row height 36) |
| 12 | "How to adjust TV volume/inputs:" | input (wrap, row height 36) |
| 13 | "Smart lock code (if different):" | input |
| 14 | "Smart thermostat notes:" | input (wrap, row height 36) |
| 15 | "Who to call if WiFi fails:" | input (wrap, row height 36) |

Input range for progress: `B8:B15` (8 fields). Cross-tab: Launch preview pulls B8 (network) + B9 (password) at 16pt bold.

## Sheet — "House Rules" (Section 4 of 8)

Title band: "House Rules" / "Short, clear, and why each one exists."
Row 7 section banner: "HOUSE RULES"

| Row | Col A (label) | Col B:L (input, merged) |
|---|---|---|
| 8  | "Quiet hours:" | input — "10 PM – 7 AM" |
| 9  | "Maximum guests:" | input (number) — 6 |
| 10 | "Smoking:" | input + DROPDOWN (No smoking / No smoking inside / Smoking OK in designated area) |
| 11 | "Pets:" | input + DROPDOWN (No pets / Pets OK with deposit / Pets OK no deposit) |
| 12 | "Events/parties:" | input + DROPDOWN (No events / Small gatherings OK with notice / OK) |
| 13 | "Shoes inside:" | input + DROPDOWN (Remove at door / OK / Preferred removed) |
| 14 | "Your rules (one per line):" | input (wrap, row height 90) |

Input range for progress: `B8:B14` (7 fields). Dropdowns on B10/B11/B12/B13.

## Sheet — "Local Guide" (Section 5 of 8)

Title band: "Local Guide" / "What we'd tell a friend visiting."
Custom wide-table layout (not the generic flattened card template).

Row 9 column headers: Category | Name | Distance | Phone | Why we love it
Rows 10-29: 20 categories pre-filled in col A, blank inputs in cols B-E (80 cells total).

Category column pre-fills (rows 10-29 in order):
Coffee, Coffee, Restaurant, Restaurant, Restaurant, Grocery, Grocery, Takeout, Takeout, Pharmacy, Gas station, Hospital/Urgent care, Coffee alt, Outdoor/Hike, Outdoor/Hike, Kid-friendly, Kid-friendly, Date night, Bar/Nightlife, Emergency (non-911)

Sample populated (DEMO):
- Coffee / Mountain Grind / 0.8 mi / (865) 555-0100 / "Best espresso in town…"
- Restaurant / The Cast Iron / 2.1 mi / (865) 555-0118 / "Sunday brunch is chef's-kiss…"
- Restaurant / Ridge BBQ / 1.4 mi / (865) 555-0122 / "Brisket sells out by 7 PM Fri/Sat"

Input range for progress: `B10:E29` (80 cells). Col widths: A=22, B=28, C=10, D=16, E=45. Row heights 28. Landscape (2 pages). Freeze: A8.

## Sheet — "Trash" (Section 6 of 8)

Title band: "Trash, Recycling & Maintenance" / "The stuff nobody likes to ask about."
Row 7 section banner: "TRASH, RECYCLING & MAINTENANCE"

| Row | Col A (label) | Col B:L (input, merged) |
|---|---|---|
| 8  | "Trash pickup day:" | input + DROPDOWN (Mon–Sun / No pickup — dumpster on-site) |
| 9  | "Bin location:" | input |
| 10 | "Recycling accepted:" | input (wrap) |
| 11 | "What goes in which bin:" | input (wrap) |
| 12 | "Where to put bins on pickup morning:" | input (wrap, row height 36) |
| 13 | "HVAC/thermostat range to leave:" | input |
| 14 | "If the power goes out:" | input (wrap, row height 36) |

Input range for progress: `B8:B14` (7 fields). Dropdown on B8.

## Sheet — "Departure" (Section 7 of 8)

Title band: "Checkout" / "What to do before you drive away."
Row 7 section banner: "CHECKOUT"

| Row | Col A (label) | Col B:L (input, merged) |
|---|---|---|
| 8  | "Checkout time:" | input — "11:00 AM" |
| 9  | "Checkout day:" | FORMULA `=IF(Property!B11<>"", TEXT(Property!B11,"dddd, mmmm d"), "See Property tab")` (formula style) |
| 10 | "☐ Strip bed linens and leave in:" | input — "hallway laundry basket" |
| 11 | "☐ Take trash + recycling to:" | input — "curb (Thursday) or dumpster on-site" |
| 12 | "☐ Turn thermostat to:" | input — "72°F" |
| 13 | "☐ Leave key:" | input — "in lockbox, reset to 0000" |
| 14 | static: "☐ Run the dishwasher" | |
| 15 | static: "☐ Lock all doors + windows" | |
| 16 | "Your tasks (one per line):" | input (wrap, row height 60) — custom checkout tasks |

Input range for progress (6 fields): `B8:B13` — counts B8 (time input) + B9 (formula) + B10-B13 (4 checklist inputs). B16 (custom tasks) is intentionally NOT part of the counted range because rows 14-15 are static-text rows (merged A:L) that land between the checklist and the custom tasks input.

## Sheet — "Emergency" (Section 8 of 8)

Title band: "Emergency Contacts" / "Keep this one nearby."
Row 6 : instruction strip ("911 first. Then the contacts below.")
Row 7 : big red "IN AN EMERGENCY — CALL 911" block (merged A7:L7, 22pt bold red, red border)

| Row | Col A (label) | Col B:L (input, merged) |
|---|---|---|
| 8  | "Nearest hospital:" | input — "LeConte Medical Center" |
| 9  | "Hospital phone:" | input — "(865) 446-7000" |
| 10 | "Hospital address:" | input — "742 Middle Creek Rd, Sevierville, TN 37862" |
| 11 | "Urgent care:" | input — "FastMed Urgent Care" |
| 12 | "Urgent care phone:" | input — "(865) 428-1020" |
| 13 | "Non-emergency police:" | input — "(865) 436-5181" |
| 14 | "Poison control:" | hardcoded (NOT input) — "1-800-222-1222" |
| 15 | "24-hr vet (if pets):" | input — "Mountain Vet ER — (865) 329-1905" |
| 16 | "Utility outage reporting:" | input — "Sevier Electric: (865) 453-2887" |
| 17 | "Host phone (call/text):" | FORMULA `=Property!B10` (formula style) |

Input range for progress (9 fields): `B8:B16` — counts all filled cells including the hardcoded poison control at B14. B17 (host phone formula) is intentionally NOT in the counted range.

## Sheet — "× Host Notes"

Tab color: Clay Rose `COLOR_SECONDARY`. Tab name starts with "× " for visual contrast.
Quarantined with big red "⚠ PRIVATE — HIDE BEFORE SHARING" banner across rows 1-2. Print area forced to A1:A1 to protect against accidental printing.

Input fields cover: cleaner, handyman, plumber, pool service, insurance, WiFi admin, smart-lock master, safe codes, private notes. Uses its own card-with-header layout (NOT the flattened layout) because it's a private host tool, not a buyer-facing input wizard.
