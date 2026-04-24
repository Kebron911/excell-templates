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
    """Tab 0 — Start (hero + progress). Implemented in Task 3."""
    ws = wb.active
    ws.title = TAB_NAMES[0]
    ws.sheet_properties.tabColor = COLOR_PRIMARY


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
