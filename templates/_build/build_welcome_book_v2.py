"""Build GST-001 Airbnb Welcome Book v2 — wizard-style tool.

Ships two files in the same Etsy download:
- GST-001-welcome-book-DEMO.xlsx (all 80 inputs filled, sample property)
- GST-001-welcome-book-BLANK.xlsx (all inputs cleared)

Implements the design at:
  docs/superpowers/specs/2026-04-23-welcome-book-v2-tool-redesign.md

12 tabs:
  0  Start            — hero + 3-card + quickstart + Get Started + progress
  1  Property         — identity inputs (8 fields)
  2  Arrival          — address, entry, parking (7 fields + 4 static bullets)
  3  WiFi + Tech      — network, streaming, smart devices (8 fields)
  4  House Rules      — policies with 4 dropdowns (7 fields)
  5  Local Guide      — 20-row table x 4 input cols (80 fields)
  6  Trash            — pickup + maintenance (7 fields)
  7  Departure        — checkout checklist (6 fields + formula)
  8  Emergency        — 911 block + contacts (9 fields + 1 hardcoded + 1 formula)
  9  Review & Print   — readiness dashboard + pseudo-button + 3-page live preview
  10 Bonus            — pre-written Airbnb listing copy (200 words)
  11 × Host Notes     — private host-only, quarantined with red warning

Usage:
    python build_welcome_book_v2.py
    # generates BOTH DEMO and BLANK files
"""
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.worksheet.page import PageMargins
from openpyxl.worksheet.pagebreak import Break
from openpyxl.utils import get_column_letter

from brand_config import (
    # Constants
    COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT, COLOR_MUTED,
    COLOR_BG_LIGHT, COLOR_ERROR,
    COLOR_NAVY_TINT, COLOR_NAVY_SHADE, COLOR_PARCHMENT_ALT, COLOR_GOLD_SOFT,
    FONT_HEAD, FONT_BODY, FONT_MONO,
    BRAND_NAME, BRAND_DOMAIN, BRAND_EMAIL,
    # Existing helpers
    input_cell_style, formula_cell_style, header_row_style,
    set_col_widths, apply_style,
    # v2 helpers (Task 1)
    pseudo_button, card_header, card_body_fill, section_header_band,
)

BASE = Path(__file__).resolve().parent.parent
DEMO_OUT = BASE / "_masters" / "GST-001-welcome-book-DEMO.xlsx"
BLANK_OUT = BASE / "_masters" / "GST-001-welcome-book-BLANK.xlsx"

# --- Tab names (used for navigation + tabColor) ---

TAB_NAMES = [
    "Start",              # 0
    "Property",           # 1
    "Arrival",            # 2
    "WiFi + Tech",        # 3
    "House Rules",        # 4
    "Local Guide",        # 5
    "Trash",              # 6
    "Departure",          # 7
    "Emergency",          # 8
    "Review & Print",     # 9
    "Bonus",              # 10
    "× Host Notes",       # 11
]

# Input counts per section (for progress formula)
SECTION_INPUT_COUNTS = {
    "Property": 8,
    "Arrival": 7,
    "WiFi + Tech": 8,
    "House Rules": 7,
    "Local Guide": 80,   # 20 rows × 4 cols
    "Trash": 7,
    "Departure": 6,
    "Emergency": 9,
}
TOTAL_INPUTS = sum(SECTION_INPUT_COUNTS.values())  # 132

# --- Sample data (DEMO variant) ---

SAMPLE = {
    "Property": {
        "name": "Smokies Ridge Cabin",
        "host": "Daniel",
        "host_phone": "+1 (555) 555-0199",
        "check_in": "2026-05-10",
        "check_out": "2026-05-15",
        "property_type": "Cabin",
        "max_guests": 6,
        "address": "123 Mountain Lane, Gatlinburg, TN 37738",
    },
    "Arrival": {
        "address": "123 Mountain Lane, Gatlinburg, TN 37738",
        "entry_method": "Smart lock",
        "door_code": "4321",
        "parking": "Gravel drive on the right — there's room for 2 cars. Do not block the mailbox.",
        "route": "If GPS sends you up the fire road, ignore it. Stay on Ridge Way past the red barn.",
        "arrival_window": "After 3 PM",
        "early_option": "Coffee shops in the Local Guide tab are the best bet; the lockbox won't open before 3 PM.",
    },
    "WiFi": {
        "ssid": "SmokiesRidge_Guest",
        "password": "welcome2024",
        "backup_ssid": "",
        "tv_streaming": "Netflix: already signed in. Hulu: guest@smokiesridge.com / stay2024",
        "smart_lock_note": "Same as entry — 4321",
        "thermostat": "Nest on the hallway wall. Please keep between 65-78°F. Auto-schedule resumes after you leave.",
        "tv_controls": "The black Roku remote is the one to use. HDMI1 is Fire TV.",
        "wifi_support": "Host first (see Emergency tab). If no answer — Spectrum: 1-833-267-6094",
    },
    "Rules": {
        "quiet_hours": "10 PM – 7 AM",
        "max_guests": 6,
        "smoking": "No smoking",
        "pets": "No pets",
        "events": "No events",
        "shoes": "Remove at door",
        "custom_rules": "• Hot tub closes at 10 PM\n• Please don't move furniture\n• If you break something, tell us — we'd rather fix it than discover it later",
    },
    # Local Guide samples — category + first-of-each-row values (blank rows marked "")
    "Local": [
        ("Coffee", "Mountain Grind", "0.8 mi", "(865) 555-0100", "Best espresso in town; small pastry case fills fast"),
        ("Coffee", "", "", "", ""),
        ("Restaurant", "The Cast Iron", "2.1 mi", "(865) 555-0118", "Sunday brunch is chef's-kiss — reserve ahead"),
        ("Restaurant", "Ridge BBQ", "1.4 mi", "(865) 555-0122", "Brisket sells out by 7 PM Fri/Sat"),
        ("Restaurant", "", "", "", ""),
        ("Grocery", "Food City", "2.8 mi", "(865) 555-0133", "Open until 10 PM"),
        ("Grocery", "", "", "", ""),
        ("Takeout", "Smoky Pizza Co", "1.9 mi", "(865) 555-0144", "Delivers to the cabin"),
        ("Takeout", "", "", "", ""),
        ("Pharmacy", "Walgreens", "3.5 mi", "(865) 555-0155", "24-hr location"),
        ("Gas station", "Shell on Hwy 321", "0.5 mi", "", "Cheapest in the valley"),
        ("Hospital/Urgent care", "LeConte Medical Center", "8.1 mi", "(865) 446-7000", "ER 24/7"),
        ("Coffee alt", "", "", "", ""),
        ("Outdoor/Hike", "Cades Cove Loop", "14 mi", "", "11-mile scenic loop; allow 3 hrs"),
        ("Outdoor/Hike", "", "", "", ""),
        ("Kid-friendly", "Dollywood", "9 mi", "(865) 428-9488", "Worth a full day"),
        ("Kid-friendly", "", "", "", ""),
        ("Date night", "The Wine Cellar", "6.2 mi", "(865) 555-0166", "Prix fixe Thu/Fri/Sat"),
        ("Bar/Nightlife", "Mill & Main", "2.4 mi", "(865) 555-0177", "Live music Fri/Sat after 9"),
        ("Emergency (non-911)", "Sevier County Sheriff", "", "(865) 436-5181", "Non-emergency line"),
    ],
    "Trash": {
        "pickup_day": "Thursday",
        "bin_location": "Around the right side of the house, next to the shed",
        "recycling_accepted": "Cardboard, plastic #1-2, aluminum. No glass.",
        "sorting_rules": "Green = recycling, black = trash. When in doubt — trash.",
        "pickup_location": "To the curb by 7 AM Thursday. Bring back Friday.",
        "thermostat_range": "65-78°F — auto-schedule handles the rest",
        "power_outage": "Breaker panel is in the laundry room. Sevier Electric: (865) 453-2887. Text host if it's longer than an hour.",
    },
    "Departure": {
        "checkout_time": "11:00 AM",
        "linen_location": "hallway laundry basket",
        "trash_spot": "curb (Thursday) or dumpster on-site",
        "thermostat_setting": "72°F",
        "key_return": "in lockbox, reset to 0000",
        "custom_tasks": "• Throw any leftover food\n• Text the host when on the road — we'll release your deposit faster",
    },
    "Emergency": {
        "hospital_name": "LeConte Medical Center",
        "hospital_phone": "(865) 446-7000",
        "hospital_address": "742 Middle Creek Rd, Sevierville, TN 37862",
        "urgent_care_name": "FastMed Urgent Care",
        "urgent_care_phone": "(865) 428-1020",
        "police_non_emergency": "(865) 436-5181",
        "vet": "Mountain Vet ER — (865) 329-1905",
        "utility": "Sevier Electric: (865) 453-2887",
    },
    "Host": {
        "cleaner_name": "Sarah @ Smokies Clean",
        "cleaner_phone": "(865) 555-0145",
        "handyman": "Bob — (865) 555-0198",
        "plumber": "Ridge Plumbing — (865) 555-0177",
        "pool_service": "HotTub Haven — quarterly service",
        "insurance": "ABC-1234567 (Proper Insurance)",
        "wifi_admin": "admin / router-pw-here",
        "smart_lock_master": "9999 — not for guest use",
        "safe_codes": "Under-sink safe: 1234\nGarage keypad: 5678",
        "private_notes": "Hot tub chemistry is touchy — do not tell guests to refill. If hot tub is cloudy, call HotTub Haven.",
    },
}


def add_dropdown(ws, cell_range, options):
    """Add an in-cell dropdown with the given list of options."""
    dv = DataValidation(
        type="list",
        formula1=f'"{",".join(options)}"',
        allow_blank=True,
    )
    dv.add(cell_range)
    ws.add_data_validation(dv)


def _sample_or_blank(variant, value):
    """Return value if variant='demo', else empty string."""
    return value if variant == "demo" else ""


# --- Per-tab builders (stubs; filled in Tasks 3-8) ---

def build_start_tab(wb, variant):
    """Tab 0 — Start.

    Zones:
      1. Hero band (rows 1-8, navy)
      2. What you'll build — 3-card grid (rows 10-20)
      3. Quick Start card (rows 22-28, parchment-alt)
      4. Get Started full-width button (rows 30-33)
      5. Progress dashboard (rows 35-46)
      6. Footer (rows 48-52)
    """
    ws = wb.active
    ws.title = TAB_NAMES[0]
    ws.sheet_properties.tabColor = COLOR_PRIMARY

    # Columns A:L = 8 units each
    set_col_widths(ws, [(get_column_letter(c), 8) for c in range(1, 13)])

    # --- ZONE 1: HERO BAND (rows 1-8, navy) ---
    navy_fill = PatternFill("solid", fgColor=COLOR_PRIMARY)
    for r in range(1, 9):
        ws.row_dimensions[r].height = 22
        for c in range(1, 13):
            ws.cell(row=r, column=c).fill = navy_fill

    # Row 2: small brand name top-left
    ws.merge_cells("A2:F2")
    c = ws["A2"]
    c.value = f"{BRAND_NAME}"
    c.font = Font(name=FONT_HEAD, size=14, color="F6EFE2")
    c.alignment = Alignment(horizontal="left", vertical="center", indent=2)

    # Row 4: big title
    ws.merge_cells("A4:L4")
    c = ws["A4"]
    c.value = "Welcome Book"
    c.font = Font(name=FONT_HEAD, size=36, bold=True, color="F6EFE2")
    c.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[4].height = 48

    # Row 5: subtitle (campaign tagline for guest-experience SKUs)
    ws.merge_cells("A5:L5")
    c = ws["A5"]
    c.value = "Welcome books that earn 5-stars."
    c.font = Font(name=FONT_HEAD, size=14, italic=True, color=COLOR_ACCENT)
    c.alignment = Alignment(horizontal="center", vertical="center")

    # Row 7: tiny SKU tag
    ws.merge_cells("A7:L7")
    c = ws["A7"]
    c.value = "GST-001 · v2.0"
    c.font = Font(name=FONT_MONO, size=9, color=COLOR_ACCENT)
    c.alignment = Alignment(horizontal="center", vertical="center")

    # --- ZONE 2: WHAT YOU'LL BUILD (rows 10-20, parchment) ---
    parchment_fill = PatternFill("solid", fgColor=COLOR_BG_LIGHT)
    for r in range(10, 21):
        for c in range(1, 13):
            ws.cell(row=r, column=c).fill = parchment_fill

    # Row 11: section heading
    ws.merge_cells("A11:L11")
    c = ws["A11"]
    c.value = "What you'll build in the next 15 minutes"
    c.font = Font(name=FONT_HEAD, size=16, bold=True, color=COLOR_PRIMARY)
    c.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[11].height = 28

    # Rows 13-18: 3 cards, cols A-D / E-H / I-L
    cards = [
        ("📖 PRINT", "Spiral-bound binder for the kitchen counter."),
        ("📱 QR CODE", "Scan on arrival — view on the guest's phone."),
        ("✉ EMAIL PDF", "Send ahead of check-in. One page, every tab."),
    ]
    col_groups = [("A", "D"), ("E", "H"), ("I", "L")]
    for idx, (title, desc) in enumerate(cards):
        first, last = col_groups[idx]
        # Card header (row 13)
        ws.merge_cells(f"{first}13:{last}13")
        c = ws[f"{first}13"]
        c.value = title
        c.font = Font(name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
        c.alignment = Alignment(horizontal="center", vertical="center")
        c.border = Border(top=Side(style="medium", color=COLOR_ACCENT))
        # Card body (rows 14-18)
        ws.merge_cells(f"{first}14:{last}18")
        c = ws[f"{first}14"]
        c.value = desc
        c.font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
        c.alignment = Alignment(horizontal="center", vertical="center",
                                 wrap_text=True)
    for r in range(13, 19):
        ws.row_dimensions[r].height = 22

    # --- ZONE 3: QUICK START CARD (rows 22-28) ---
    qs_fill = PatternFill("solid", fgColor=COLOR_PARCHMENT_ALT)
    for r in range(22, 29):
        for c in range(1, 13):
            ws.cell(row=r, column=c).fill = qs_fill

    ws.merge_cells("A23:L23")
    c = ws["A23"]
    c.value = "Quick Start — be done in 5 minutes"
    c.font = Font(name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    c.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[23].height = 24

    quickstart_items = [
        "① Property name + host phone",
        "② WiFi network + password",
        "③ Trash pickup day",
        "④ Checkout time",
        "⑤ Hospital + 911 note",
    ]
    for i, item in enumerate(quickstart_items):
        row = 24 + i if i < 3 else 24 + (i - 3)  # 2 cols of items
        col = "B" if i < 3 else "H"
        col_end = "F" if i < 3 else "L"
        ws.merge_cells(f"{col}{row}:{col_end}{row}")
        c = ws[f"{col}{row}"]
        c.value = item
        c.font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
        c.alignment = Alignment(horizontal="left", vertical="center", indent=1)

    # --- ZONE 4: GET STARTED BUTTON (rows 30-33) ---
    pseudo_button(ws, "A30", "L33",
                   "GET STARTED — FILL YOUR PROPERTY INFO  →",
                   "'Property'!A5", variant="primary")
    for r in range(30, 34):
        ws.row_dimensions[r].height = 22

    # --- ZONE 5: PROGRESS DASHBOARD (rows 35-46) ---
    ws.merge_cells("A36:F36")
    c = ws["A36"]
    c.value = "Progress:"
    c.font = Font(name=FONT_HEAD, size=12, bold=True, color=COLOR_PRIMARY)
    c.alignment = Alignment(horizontal="left", vertical="center", indent=1)

    # Overall completion % formula
    ws.merge_cells("G36:L36")
    c = ws["G36"]
    # Build COUNTA sum over all 8 input-tab ranges
    ranges = [
        "'Property'!B5:B12",    # 8 fields
        "'Arrival'!B5:B11",     # 7 fields
        "'WiFi + Tech'!B5:B12", # 8 fields
        "'House Rules'!B5:B11", # 7 fields
        "'Local Guide'!B6:E25", # 80 cells (20 rows × 4 cols)
        "'Trash'!B5:B11",       # 7 fields
        "'Departure'!B5:B10",   # 6 fields
        "'Emergency'!B5:B13",   # 9 fields
    ]
    counta_sum = " + ".join(f"COUNTA({r})" for r in ranges)
    c.value = f"=TEXT(({counta_sum})/{TOTAL_INPUTS}, \"0%\") & \" complete\""
    c.font = Font(name=FONT_HEAD, size=14, bold=True, color=COLOR_ACCENT)
    c.alignment = Alignment(horizontal="right", vertical="center", indent=1)

    # Per-section status rows 38-45
    section_rows = [
        ("① Property Info",   "Property",    "B5:B12",   8),
        ("② Arrival",          "Arrival",     "B5:B11",   7),
        ("③ WiFi + Tech",      "WiFi + Tech", "B5:B12",   8),
        ("④ House Rules",      "House Rules", "B5:B11",   7),
        ("⑤ Local Guide",      "Local Guide", "B6:E25",  80),
        ("⑥ Trash",            "Trash",       "B5:B11",   7),
        ("⑦ Departure",        "Departure",   "B5:B10",   6),
        ("⑧ Emergency",        "Emergency",   "B5:B13",   9),
    ]
    for i, (label, tab, range_, total) in enumerate(section_rows):
        r = 38 + i
        ws.row_dimensions[r].height = 18
        # Label (cols A-F)
        ws.merge_cells(f"A{r}:F{r}")
        c = ws[f"A{r}"]
        c.value = label
        c.font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
        c.alignment = Alignment(horizontal="left", vertical="center", indent=2)
        # Status (cols G-J) — formula
        ws.merge_cells(f"G{r}:J{r}")
        c = ws[f"G{r}"]
        c.value = (
            f'=IF(COUNTA(\'{tab}\'!{range_})={total},"✅ Done",'
            f'IF(COUNTA(\'{tab}\'!{range_})=0,"⏳ Empty",'
            f'"⏳ "&COUNTA(\'{tab}\'!{range_})&" of {total}"))'
        )
        c.font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
        c.alignment = Alignment(horizontal="left", vertical="center")
        # Arrow hyperlink (cols K-L)
        ws.merge_cells(f"K{r}:L{r}")
        c = ws[f"K{r}"]
        c.value = f'=HYPERLINK("#\'{tab}\'!A5","→ go")'
        c.font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_ACCENT)
        c.alignment = Alignment(horizontal="right", vertical="center", indent=1)

    # --- ZONE 6: FOOTER (rows 48-52) ---
    # Row 49: gold thin-rule divider
    gold_side = Side(style="thin", color=COLOR_ACCENT)
    for c in range(1, 13):
        ws.cell(row=49, column=c).border = Border(top=gold_side)

    # Row 50: contact
    ws.merge_cells("A50:L50")
    c = ws["A50"]
    c.value = f"Questions? {BRAND_EMAIL}"
    c.font = Font(name=FONT_BODY, size=10, color=COLOR_MUTED)
    c.alignment = Alignment(horizontal="center", vertical="center")

    # Row 51: version + updates promise
    ws.merge_cells("A51:L51")
    c = ws["A51"]
    c.value = "Free updates forever · v2.0 · Released 2026-05"
    c.font = Font(name=FONT_BODY, size=10, italic=True, color=COLOR_ACCENT)
    c.alignment = Alignment(horizontal="center", vertical="center")

    # Print area: Start tab can be printed as cover sheet
    ws.print_area = "A1:L52"
    ws.page_setup.orientation = ws.ORIENTATION_PORTRAIT
    ws.page_setup.paperSize = ws.PAPERSIZE_LETTER
    ws.page_setup.fitToPage = True
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.page_setup.fitToHeight = 1
    ws.page_setup.fitToWidth = 1
    ws.page_margins = PageMargins(left=0.5, right=0.5, top=0.5, bottom=0.5)


def build_property_tab(wb, variant):
    """Tab 1 — Property. Implemented in Task 5."""
    ws = wb.create_sheet(TAB_NAMES[1])
    ws.sheet_properties.tabColor = COLOR_BG_LIGHT


def build_arrival_tab(wb, variant):
    """Tab 2 — Arrival. Implemented in Task 5."""
    ws = wb.create_sheet(TAB_NAMES[2])
    ws.sheet_properties.tabColor = COLOR_BG_LIGHT


def build_wifi_tab(wb, variant):
    """Tab 3 — WiFi. Implemented in Task 5."""
    ws = wb.create_sheet(TAB_NAMES[3])
    ws.sheet_properties.tabColor = COLOR_BG_LIGHT


def build_rules_tab(wb, variant):
    """Tab 4 — House Rules. Implemented in Task 5."""
    ws = wb.create_sheet(TAB_NAMES[4])
    ws.sheet_properties.tabColor = COLOR_BG_LIGHT


def build_local_tab(wb, variant):
    """Tab 5 — Local Guide. Implemented in Task 5."""
    ws = wb.create_sheet(TAB_NAMES[5])
    ws.sheet_properties.tabColor = COLOR_BG_LIGHT


def build_trash_tab(wb, variant):
    """Tab 6 — Trash. Implemented in Task 5."""
    ws = wb.create_sheet(TAB_NAMES[6])
    ws.sheet_properties.tabColor = COLOR_BG_LIGHT


def build_departure_tab(wb, variant):
    """Tab 7 — Departure. Implemented in Task 5."""
    ws = wb.create_sheet(TAB_NAMES[7])
    ws.sheet_properties.tabColor = COLOR_BG_LIGHT


def build_emergency_tab(wb, variant):
    """Tab 8 — Emergency. Implemented in Task 5."""
    ws = wb.create_sheet(TAB_NAMES[8])
    ws.sheet_properties.tabColor = COLOR_BG_LIGHT


def build_review_print_tab(wb, variant):
    """Tab 9 — Review & Print. Implemented in Task 6."""
    ws = wb.create_sheet(TAB_NAMES[9])
    ws.sheet_properties.tabColor = COLOR_ACCENT


def build_bonus_tab(wb, variant):
    """Tab 10 — Bonus: Listing Copy. Implemented in Task 7."""
    ws = wb.create_sheet(TAB_NAMES[10])
    ws.sheet_properties.tabColor = COLOR_GOLD_SOFT


def build_host_notes_tab(wb, variant):
    """Tab 11 — × Host Notes. Implemented in Task 8."""
    ws = wb.create_sheet(TAB_NAMES[11])
    ws.sheet_properties.tabColor = COLOR_SECONDARY


def build_workbook(out_path, variant):
    """Build a workbook with all 12 tabs.

    Args:
        out_path: pathlib.Path where the .xlsx will be saved
        variant: "demo" (filled with SAMPLE) or "blank" (all inputs empty)
    """
    assert variant in ("demo", "blank"), f"Unknown variant: {variant}"

    wb = Workbook()
    build_start_tab(wb, variant)
    build_property_tab(wb, variant)
    build_arrival_tab(wb, variant)
    build_wifi_tab(wb, variant)
    build_rules_tab(wb, variant)
    build_local_tab(wb, variant)
    build_trash_tab(wb, variant)
    build_departure_tab(wb, variant)
    build_emergency_tab(wb, variant)
    build_review_print_tab(wb, variant)
    build_bonus_tab(wb, variant)
    build_host_notes_tab(wb, variant)

    suffix = " (DEMO)" if variant == "demo" else ""
    wb.properties.title = f"Airbnb Welcome Book{suffix} — The STR Ledger"
    wb.properties.creator = BRAND_NAME
    wb.properties.company = BRAND_NAME
    wb.properties.description = (
        "Guest-facing welcome book tool for Airbnb/VRBO hosts — wizard UI, "
        "card-grouped inputs, live 3-page PDF preview."
    )

    out_path.parent.mkdir(parents=True, exist_ok=True)
    wb.save(out_path)
    print(f"Saved: {out_path}")


def main():
    build_workbook(DEMO_OUT, variant="demo")
    build_workbook(BLANK_OUT, variant="blank")


if __name__ == "__main__":
    main()
