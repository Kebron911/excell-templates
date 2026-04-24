# Sheet Spec — GST-001 Airbnb Welcome Book

## Workbook-level

- Filename: `GST-001-welcome-book.xlsx`
- Tab colors: Harbor Navy `COLOR_PRIMARY` for guest-facing (tabs 1-8), Clay Rose `COLOR_SECONDARY` for host-only (tab 9) — actual hex values sourced from `brand_config.py`, not hardcoded in the build script
- Print area: each tab has print area set to fit 1 page letter-portrait (except Local Guide which is 2 pages)
- Freeze panes: row 4 frozen on each tab (brand header rows 1–3 stay visible)
- Default font: Calibri 11pt body (FONT_BODY from brand_config); Georgia 20pt bold for tab titles (FONT_HEAD)
- Workbook protection: NONE (every cell must be editable by buyer)

## Sheet 1 — "Welcome"

Brand header rows 1–3 via `apply_brand_header(ws, '=CONCATENATE("Welcome to ", B5)', "Welcome books that earn 5-stars.")` — note: the title cell uses a formula so row 1 reflects the property name once B5 is filled.

| Row | Col A | Col B | Col C |
|---|---|---|---|
| 4 | (blank spacer, height 12) | | |
| 5 | "Property name:" | {PropertyName input — "Smokies Ridge Cabin"} | |
| 6 | "Host first name:" | {HostFirstName input — "Daniel"} | |
| 7 | "Host phone (text preferred):" | {HostPhone input — "+1 (555) 555-0199"} | |
| 8 | "Check-in date:" | {CheckInDate input — 2026-05-10, format d-mmm-yyyy} | |
| 9 | "Check-out date:" | {CheckOutDate input — 2026-05-15, format d-mmm-yyyy} | |
| 10 | (blank) | | |
| 11 | "How to use this book" (bold, size 14, primary color) | | |
| 12 | "1. Open each tab along the bottom and fill in the yellow cells." | | |
| 13 | "2. When every yellow cell is filled, save as PDF: File → Save As → PDF." | | |
| 14 | "3. Print the PDF and leave it on the counter — or use the QR code placard." | | |
| 15 | "4. RIGHT-CLICK the 'Host Reference' tab → Hide before sharing with guests." | | |
| 16 | "5. Update anytime — this file is yours forever." | | |
| 17 | (blank) | | |
| 18 | Upgrade banner (merge A18:C18, via `add_upgrade_banner`) | | |
| 19 | (blank) | | |
| 20 | "Host note: The 'Host Reference' tab is for your eyes only — right-click → Hide before sharing." (italic, muted) | | |

Input cells: B5, B6, B7, B8, B9. Style via `apply_style(cell, input_cell_style())`.
Cross-tab dependencies: row 1 formula `=CONCATENATE("Welcome to ", B5)`; Emergency tab row 16 pulls host phone via `=Welcome!B7`.

Column widths: A=22, B=35, C=22.
Print area: A1:C20. Orientation: portrait. Paper: Letter.
Freeze panes: A5.

## Sheet 2 — "Arrival"

Brand header rows 1–3 ("Arrival & Check-in" / "Everything your guest needs on day one").

| Row | Col A | Col B |
|---|---|---|
| 5 | "Full address:" | input — "123 Mountain Lane, Gatlinburg, TN 37738" |
| 6 | "Entry method:" | input + DROPDOWN (Smart lock / Key lockbox / In-person / Other) — sample: "Smart lock" |
| 7 | "Door/lock code:" | input — "4321" |
| 8 | "Parking instructions:" | input (wrap text) — "Gravel drive on the right — room for 2 cars. Do not block the mailbox." |
| 9 | "Best route (if tricky):" | input (wrap text) — "If GPS sends you up the fire road, ignore it. Stay on Ridge Way past the red barn." |
| 10 | "Arrival time window:" | input — "After 3 PM" |
| 11 | "What to do if you arrive early:" | input (wrap text) — "Coffee shops in the Local Guide tab are the best bet; the lockbox won't open before 3 PM." |

Row 12: "First 5 minutes inside — what we recommend:" header (bold, primary color, merged A12:B12).
Rows 13-16: 4 recommendation bullets merged A:B:
- "1. Crank the thermostat to your comfort (settings on the WiFi tab)."
- "2. Connect to WiFi — network + password on the WiFi tab."
- "3. Check the fridge for the welcome items."
- "4. If anything's broken or missing, text the host immediately — easier to fix day 1."

Data validation: cell B6 dropdown list = "Smart lock,Key lockbox,In-person,Other".
Column widths: A=28, B=55. Row heights 20 default, 40 for rows 8 + 9 (wrap).
Freeze panes: A5.
Print area: A1:B16. Orientation: portrait.

## Sheet 3 — "WiFi + Tech"

Brand header ("WiFi & Technology" / "So nobody has to text you about the wifi password").

| Row | Col A | Col B |
|---|---|---|
| 5 | "WiFi network name:" | input — "SmokiesRidge_Guest" |
| 6 | "WiFi password:" | input (13pt bold) — "welcome2024" |
| 7 | "Backup network (if any):" | input (13pt bold) — blank |
| 8 | "TV streaming — service + login:" | input (wrap) — "Netflix: already signed in. Hulu: guest@smokiesridge.com / stay2024" |
| 9 | "Smart lock code (if different):" | input (13pt bold) — "Same as entry — 4321" |
| 10 | "Smart thermostat notes:" | input (wrap) — "Nest on the hallway wall. Please keep between 65-78°F. Auto-schedule resumes after you leave." |
| 11 | "How to adjust TV volume/inputs:" | input (wrap) — "The black Roku remote is the one to use. HDMI1 is Fire TV." |
| 12 | "Who to call if WiFi fails:" | input — "Host first (see Emergency tab). If no answer — Spectrum: 1-833-267-6094" |

Column widths: A=32, B=50.
Print area: A1:B13. Freeze: A5.

## Sheet 4 — "House Rules"

Brand header ("House Rules" / "Short, clear, and why each one exists").

| Row | Col A | Col B |
|---|---|---|
| 5 | "Quiet hours:" | input — "10 PM – 7 AM" |
| 6 | "Maximum guests:" | input (number) — 6 |
| 7 | "Smoking:" | input + DROPDOWN (No smoking / No smoking inside / Smoking OK in designated area) — "No smoking" |
| 8 | "Pets:" | input + DROPDOWN (No pets / Pets OK with deposit / Pets OK no deposit) — "No pets" |
| 9 | "Events/parties:" | input + DROPDOWN (No events / Small gatherings OK with notice / OK) — "No events" |
| 10 | "Shoes inside:" | input + DROPDOWN (Remove at door / OK / Preferred removed) — "Remove at door" |
| 11 | "Additional custom rules:" | input (wrap, 10 rows tall) — "• Hot tub closes at 10 PM\n• Please don't move furniture\n• If you break something, tell us — we'd rather fix it than discover it later" |

Column widths: A=28, B=55. Row 11 height: 90 (wrap).
Freeze: A5. Print area: A1:B11.

## Sheet 5 — "Local Guide"

Brand header ("Local Guide" / "What we'd tell a friend visiting").

Row 5 headers (header_row_style): Category | Name | Distance | Phone | Why we love it

Rows 6-25: 20 categories pre-filled in col A, blank inputs in cols B-E. Sample rows populate Coffee × 2, Restaurant × 3, others blank.

Category column pre-fills (rows 6-25 in order):
Coffee, Coffee, Restaurant, Restaurant, Restaurant, Grocery, Grocery, Takeout, Takeout, Pharmacy, Gas station, Hospital/Urgent care, Coffee alt, Outdoor/Hike, Outdoor/Hike, Kid-friendly, Kid-friendly, Date night, Bar/Nightlife, Emergency (non-911)

Sample populated:
- Coffee / Mountain Grind / 0.8 mi / (865) 555-0100 / "Best espresso in town; small pastry case fills fast"
- Restaurant / The Cast Iron / 2.1 mi / (865) 555-0118 / "Sunday brunch is chef's-kiss — reserve ahead"
- Restaurant / Ridge BBQ / 1.4 mi / (865) 555-0122 / "Brisket sells out by 7 PM Fri/Sat"

Col widths: A=22, B=28, C=10, D=16, E=45. Row heights 28. Page orientation: landscape (2 pages).
Freeze: A6.

## Sheet 6 — "Trash + Recycling"

Brand header ("Trash, Recycling & Maintenance").

| Row | Col A | Col B |
|---|---|---|
| 5 | "Trash pickup day:" | input + DROPDOWN (Monday/Tuesday/Wednesday/Thursday/Friday/Saturday/Sunday/No pickup — dumpster on-site) — "Thursday" |
| 6 | "Bin location:" | input — "Around the right side of the house, next to the shed" |
| 7 | "Recycling accepted:" | input (wrap) — "Cardboard, plastic #1-2, aluminum. No glass." |
| 8 | "What goes in which bin:" | input (wrap) — "Green = recycling, black = trash. When in doubt — trash." |
| 9 | "Where to put bins on pickup morning:" | input — "To the curb by 7 AM Thursday. Bring back Friday." |
| 10 | "HVAC/thermostat range to leave:" | input — "65-78°F — auto-schedule handles the rest" |
| 11 | "If the power goes out:" | input (wrap) — "Breaker panel is in the laundry room. Sevier Electric: (865) 453-2887. Text host if it's longer than an hour." |

Col widths: A=32, B=55. Row heights 32 for wrap rows.
Freeze: A5. Print area: A1:B12.

## Sheet 7 — "Departure"

Brand header ("Checkout" / "What to do before you drive away").

| Row | Col A | Col B |
|---|---|---|
| 5 | "Checkout time:" | input — "11:00 AM" |
| 6 | "Checkout day:" | FORMULA `=IF(Welcome!B9<>"", TEXT(Welcome!B9,"dddd, mmmm d"), "See Welcome tab")` — gray/formula style |
| 8 | "Before you leave — please:" | (bold, size 13, primary) |
| 9 | "☐ Strip bed linens and leave in:" | input — "hallway laundry basket" |
| 10 | "☐ Run the dishwasher" | (no input — static checkbox) |
| 11 | "☐ Take trash + recycling to:" | input — "curb (Thursday) or dumpster on-site" |
| 12 | "☐ Turn thermostat to:" | input — "72°F" |
| 13 | "☐ Lock all doors + windows" | (no input) |
| 14 | "☐ Leave key:" | input — "in lockbox, reset to 0000" |
| 16 | "Custom checkout tasks:" | input (wrap, row height 50) — "• Throw any leftover food\n• Text the host when on the road — we'll release your deposit faster" |

Col widths: A=40, B=45. Freeze: A5. Print area: A1:B17.

## Sheet 8 — "Emergency"

Brand header ("Emergency Contacts" / "Keep this one nearby").

Row 5: "IN AN EMERGENCY — CALL 911" merged A5:B5, Georgia 16pt bold, `COLOR_ERROR` red, centered. Row height 30.

| Row | Col A | Col B |
|---|---|---|
| 7 | "Nearest hospital:" | input — "LeConte Medical Center" |
| 8 | "Hospital phone:" | input — "(865) 446-7000" |
| 9 | "Hospital address:" | input (wrap) — "742 Middle Creek Rd, Sevierville, TN 37862" |
| 10 | "Urgent care:" | input — "FastMed Urgent Care" |
| 11 | "Urgent care phone:" | input — "(865) 428-1020" |
| 12 | "Non-emergency police:" | input — "(865) 436-5181" |
| 13 | "Poison control:" | hardcoded (NOT input) — "1-800-222-1222" |
| 14 | "24-hr vet (if pets):" | input — "Mountain Vet ER — (865) 329-1905" |
| 15 | "Utility outage reporting:" | input — "Sevier Electric: (865) 453-2887" |
| 16 | "Host phone (call/text):" | FORMULA `=Welcome!B7` — gray/formula style |

Col widths: A=32, B=55. Freeze: A5. Print area: A1:B17.

## Sheet 9 — "Host Reference (HIDE)"

Tab color: Clay Rose `COLOR_SECONDARY`. Tab name ends with "(HIDE)" so it's visually obvious.

Brand header ("Host Reference — Hide Before Sharing" / "Your private operating sheet").

| Row | Col A | Col B |
|---|---|---|
| 5 | "Cleaner name:" | input — "Sarah @ Smokies Clean" |
| 6 | "Cleaner phone:" | input — "(865) 555-0145" |
| 7 | "Handyman:" | input — "Bob — (865) 555-0198" |
| 8 | "Plumber:" | input — "Ridge Plumbing — (865) 555-0177" |
| 9 | "Pool/hot tub service:" | input — "HotTub Haven — quarterly service" |
| 10 | "Insurance policy #:" | input — "ABC-1234567 (Proper Insurance)" |
| 11 | "Wifi admin password (router):" | input — "admin / router-pw-here" |
| 12 | "Smart lock master code:" | input — "9999 — not for guest use" |
| 13 | "Passcodes for safes/boxes:" | input (wrap, h=36) — "Under-sink safe: 1234\nGarage keypad: 5678" |
| 14 | "Things to NOT tell the guest:" | input (wrap, h=36) — "Hot tub chemistry is touchy — do not tell guests to refill. If hot tub is cloudy, call HotTub Haven." |

Row 16: big red reminder merged A16:B16 — "⚠ RIGHT-CLICK this tab → Hide before sharing the workbook or exporting to PDF." — Georgia 12pt bold italic, `COLOR_ERROR`, centered + wrap. Height 30.

Col widths: A=36, B=55. Freeze: A5. Print area: A1:B17.
