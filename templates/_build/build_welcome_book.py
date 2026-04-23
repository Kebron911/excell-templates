"""Build GST-001 Airbnb Welcome Book Excel file.

Implements the spec at templates/_briefs/GST-001-welcome-book-spec.md.
Generates templates/_masters/GST-001-welcome-book.xlsx.

Usage:
    python build_welcome_book.py

Dependencies: openpyxl (see requirements.txt).
"""
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

from brand_config import (
    COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT, COLOR_MUTED,
    COLOR_BG_LIGHT, COLOR_ERROR, FONT_HEAD, FONT_BODY, FONT_MONO,
    apply_brand_header, input_cell_style, formula_cell_style,
    set_col_widths, add_upgrade_banner, apply_style,
    BRAND_DOMAIN,
)

OUT = Path(__file__).resolve().parent.parent / "_masters" / "GST-001-welcome-book.xlsx"


def add_dropdown(ws, cell_ref, options):
    """Helper — add an in-cell dropdown with the given options."""
    dv = DataValidation(
        type="list",
        formula1=f'"{",".join(options)}"',
        allow_blank=True,
    )
    dv.add(cell_ref)
    ws.add_data_validation(dv)


def build_welcome_tab(wb):
    """Sheet 1 — Welcome."""
    ws = wb.active
    ws.title = "Welcome"
    ws.sheet_properties.tabColor = COLOR_PRIMARY

    # Brand header — title uses a formula so it reflects property name from B5
    apply_brand_header(ws, '=CONCATENATE("Welcome to ", B5)', "Welcome books that earn 5-stars.")

    # Row 4: blank spacer
    ws.row_dimensions[4].height = 12

    # Rows 5-9: input cells
    labels = [
        (5, "Property name:", "Smokies Ridge Cabin"),
        (6, "Host first name:", "Daniel"),
        (7, "Host phone (text preferred):", "+1 (555) 555-0199"),
        (8, "Check-in date:", "2026-05-10"),
        (9, "Check-out date:", "2026-05-15"),
    ]
    for row, label, sample in labels:
        ws.cell(row=row, column=1, value=label).font = Font(
            name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT
        )
        cell = ws.cell(row=row, column=2, value=sample)
        apply_style(cell, input_cell_style())

    # Row 10: blank
    # Row 11: "How to use this book" header
    ws.cell(row=11, column=1, value="How to use this book").font = Font(
        name=FONT_BODY, size=14, bold=True, color=COLOR_PRIMARY
    )

    # Rows 12-16: how-to bullets
    bullets = [
        (12, "1. Open each tab along the bottom and fill in the yellow cells."),
        (13, "2. When every yellow cell is filled, save as PDF: File → Save As → PDF."),
        (14, "3. Print the PDF and leave it on the counter — or use the QR code placard."),
        (15, "4. RIGHT-CLICK the 'Host Reference' tab → Hide before sharing with guests."),
        (16, "5. Update anytime — this file is yours forever."),
    ]
    for row, text in bullets:
        ws.cell(row=row, column=1, value=text).font = Font(
            name=FONT_BODY, size=11, color=COLOR_TEXT
        )

    # Row 17: blank
    # Row 18: upgrade banner — merge A18:C18
    add_upgrade_banner(ws, 18)
    ws.merge_cells("A18:C18")

    # Row 19: blank
    # Row 20: host note — italic, muted
    note_cell = ws.cell(
        row=20,
        column=1,
        value="Host note: The 'Host Reference' tab is for your eyes only — right-click → Hide before sharing.",
    )
    note_cell.font = Font(name=FONT_BODY, size=10, italic=True, color=COLOR_MUTED)

    # Column widths
    set_col_widths(ws, [("A", 22), ("B", 35), ("C", 22)])

    # Print area, orientation, paper
    ws.print_area = "A1:C20"
    ws.page_setup.orientation = "portrait"
    ws.page_setup.paperSize = 1  # Letter

    # Freeze panes at A5
    ws.freeze_panes = "A5"


def build_arrival_tab(wb):
    """Sheet 2 — Arrival & Check-in."""
    ws = wb.create_sheet("Arrival")
    ws.sheet_properties.tabColor = COLOR_PRIMARY

    apply_brand_header(ws, "Arrival & Check-in", "Everything your guest needs on day one.")

    # Row 4 spacer
    ws.row_dimensions[4].height = 12

    # Input rows 5-11
    rows = [
        (5, "Full address:", "123 Mountain Lane, Gatlinburg, TN 37738", False),
        (6, "Entry method:", "Smart lock", False),
        (7, "Door/lock code:", "4321", False),
        (8, "Parking instructions:", "Gravel drive on the right — room for 2 cars. Do not block the mailbox.", True),
        (9, "Best route (if tricky):", "If GPS sends you up the fire road, ignore it. Stay on Ridge Way past the red barn.", True),
        (10, "Arrival time window:", "After 3 PM", False),
        (11, "What to do if you arrive early:", "Coffee shops in the Local Guide tab are the best bet; the lockbox won't open before 3 PM.", True),
    ]
    for row, label, sample, wrap in rows:
        ws.cell(row=row, column=1, value=label).font = Font(
            name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT
        )
        cell = ws.cell(row=row, column=2, value=sample)
        style = input_cell_style()
        if wrap:
            style["alignment"] = Alignment(horizontal="left", vertical="top", wrap_text=True)
            ws.row_dimensions[row].height = 40
        apply_style(cell, style)

    # Dropdown for B6
    add_dropdown(ws, "B6", ["Smart lock", "Key lockbox", "In-person", "Other"])

    # Row 12: "First 5 minutes" header — merged A12:B12
    ws.merge_cells("A12:B12")
    hdr = ws.cell(row=12, column=1, value="First 5 minutes inside — what we recommend:")
    hdr.font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_PRIMARY)

    # Rows 13-16: bullet recommendations — merged A:B
    bullets = [
        (13, "1. Crank the thermostat to your comfort (settings on the WiFi tab)."),
        (14, "2. Connect to WiFi — network + password on the WiFi tab."),
        (15, "3. Check the fridge for the welcome items."),
        (16, "4. If anything's broken or missing, text the host immediately — easier to fix day 1."),
    ]
    for row, text in bullets:
        ws.merge_cells(f"A{row}:B{row}")
        ws.cell(row=row, column=1, value=text).font = Font(
            name=FONT_BODY, size=11, color=COLOR_TEXT
        )

    set_col_widths(ws, [("A", 28), ("B", 55)])
    ws.print_area = "A1:B16"
    ws.page_setup.orientation = "portrait"
    ws.page_setup.paperSize = 1
    ws.freeze_panes = "A5"


def build_wifi_tab(wb):
    """Sheet 3 — WiFi & Technology."""
    ws = wb.create_sheet("WiFi + Tech")
    ws.sheet_properties.tabColor = COLOR_PRIMARY

    apply_brand_header(ws, "WiFi & Technology", "So nobody has to text you about the wifi password.")

    ws.row_dimensions[4].height = 12

    rows = [
        (5, "WiFi network name:", "SmokiesRidge_Guest", False),
        (6, "WiFi password:", "welcome2024", True),
        (7, "Backup network (if any):", "", True),
        (8, "TV streaming — service + login:", "Netflix: already signed in. Hulu: guest@smokiesridge.com / stay2024", False),
        (9, "Smart lock code (if different):", "Same as entry — 4321", True),
        (10, "Smart thermostat notes:", "Nest on the hallway wall. Please keep between 65-78°F. Auto-schedule resumes after you leave.", False),
        (11, "How to adjust TV volume/inputs:", "The black Roku remote is the one to use. HDMI1 is Fire TV.", False),
        (12, "Who to call if WiFi fails:", "Host first (see Emergency tab). If no answer — Spectrum: 1-833-267-6094", False),
    ]
    for row, label, sample, big_bold in rows:
        ws.cell(row=row, column=1, value=label).font = Font(
            name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT
        )
        cell = ws.cell(row=row, column=2, value=sample)
        style = input_cell_style()
        if big_bold:
            # Rows 6, 7, 9: 13pt bold (password-size)
            style["font"] = Font(name=FONT_BODY, size=13, bold=True, color=COLOR_TEXT)
        apply_style(cell, style)

    set_col_widths(ws, [("A", 32), ("B", 50)])
    ws.print_area = "A1:B13"
    ws.page_setup.orientation = "portrait"
    ws.page_setup.paperSize = 1
    ws.freeze_panes = "A5"


def build_rules_tab(wb):
    """Sheet 4 — House Rules."""
    ws = wb.create_sheet("House Rules")
    ws.sheet_properties.tabColor = COLOR_PRIMARY

    apply_brand_header(ws, "House Rules", "Short, clear, and why each one exists.")

    ws.row_dimensions[4].height = 12

    rows = [
        (5, "Quiet hours:", "10 PM – 7 AM"),
        (6, "Maximum guests:", 6),
        (7, "Smoking:", "No smoking"),
        (8, "Pets:", "No pets"),
        (9, "Events/parties:", "No events"),
        (10, "Shoes inside:", "Remove at door"),
        (11, "Additional custom rules:", "• Hot tub closes at 10 PM\n• Please don't move furniture\n• If you break something, tell us — we'd rather fix it than discover it later"),
    ]
    for row, label, sample in rows:
        ws.cell(row=row, column=1, value=label).font = Font(
            name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT
        )
        cell = ws.cell(row=row, column=2, value=sample)
        style = input_cell_style()
        if row == 11:
            style["alignment"] = Alignment(horizontal="left", vertical="top", wrap_text=True)
        apply_style(cell, style)

    # Dropdowns on B7-B10
    add_dropdown(ws, "B7", ["No smoking", "No smoking inside", "Smoking OK in designated area"])
    add_dropdown(ws, "B8", ["No pets", "Pets OK with deposit", "Pets OK no deposit"])
    add_dropdown(ws, "B9", ["No events", "Small gatherings OK with notice", "OK"])
    add_dropdown(ws, "B10", ["Remove at door", "OK", "Preferred removed"])

    # Row 11: wrap height 90
    ws.row_dimensions[11].height = 90

    set_col_widths(ws, [("A", 28), ("B", 55)])
    ws.print_area = "A1:B11"
    ws.page_setup.orientation = "portrait"
    ws.page_setup.paperSize = 1
    ws.freeze_panes = "A5"


def build_local_tab(wb):
    """Sheet 5 — Local Guide."""
    ws = wb.create_sheet("Local Guide")
    ws.sheet_properties.tabColor = COLOR_PRIMARY

    apply_brand_header(ws, "Local Guide", "What we'd tell a friend visiting.")

    ws.row_dimensions[4].height = 12

    # Row 5: header row
    from brand_config import header_row_style
    headers = ["Category", "Name", "Distance", "Phone", "Why we love it"]
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        apply_style(cell, header_row_style())

    # 20 categories in rows 6-25, col A
    categories = [
        "Coffee", "Coffee", "Restaurant", "Restaurant", "Restaurant",
        "Grocery", "Grocery", "Takeout", "Takeout", "Pharmacy",
        "Gas station", "Hospital/Urgent care", "Coffee alt", "Outdoor/Hike", "Outdoor/Hike",
        "Kid-friendly", "Kid-friendly", "Date night", "Bar/Nightlife", "Emergency (non-911)",
    ]
    for i, cat in enumerate(categories):
        row = 6 + i
        ws.cell(row=row, column=1, value=cat).font = Font(
            name=FONT_BODY, size=11, color=COLOR_TEXT
        )
        ws.row_dimensions[row].height = 28
        # Input cells B-E
        for col in range(2, 6):
            cell = ws.cell(row=row, column=col, value="")
            apply_style(cell, input_cell_style())

    # Sample populated rows:
    # Coffee row 1 (row 6): Mountain Grind
    ws.cell(row=6, column=2, value="Mountain Grind")
    ws.cell(row=6, column=3, value="0.8 mi")
    ws.cell(row=6, column=4, value="(865) 555-0100")
    ws.cell(row=6, column=5, value="Best espresso in town; small pastry case fills fast")

    # Restaurant row 1 (row 8): The Cast Iron
    ws.cell(row=8, column=2, value="The Cast Iron")
    ws.cell(row=8, column=3, value="2.1 mi")
    ws.cell(row=8, column=4, value="(865) 555-0118")
    ws.cell(row=8, column=5, value="Sunday brunch is chef's-kiss — reserve ahead")

    # Restaurant row 2 (row 9): Ridge BBQ
    ws.cell(row=9, column=2, value="Ridge BBQ")
    ws.cell(row=9, column=3, value="1.4 mi")
    ws.cell(row=9, column=4, value="(865) 555-0122")
    ws.cell(row=9, column=5, value="Brisket sells out by 7 PM Fri/Sat")

    set_col_widths(ws, [("A", 22), ("B", 28), ("C", 10), ("D", 16), ("E", 45)])
    ws.print_area = "A1:E25"
    ws.page_setup.orientation = "landscape"
    ws.page_setup.paperSize = 1
    ws.freeze_panes = "A6"


def build_trash_tab(wb):
    """Sheet 6 — Trash + Recycling."""
    ws = wb.create_sheet("Trash + Recycling")
    ws.sheet_properties.tabColor = COLOR_PRIMARY

    apply_brand_header(ws, "Trash, Recycling & Maintenance", "")

    ws.row_dimensions[4].height = 12

    rows = [
        (5, "Trash pickup day:", "Thursday", False),
        (6, "Bin location:", "Around the right side of the house, next to the shed", False),
        (7, "Recycling accepted:", "Cardboard, plastic #1-2, aluminum. No glass.", True),
        (8, "What goes in which bin:", "Green = recycling, black = trash. When in doubt — trash.", True),
        (9, "Where to put bins on pickup morning:", "To the curb by 7 AM Thursday. Bring back Friday.", False),
        (10, "HVAC/thermostat range to leave:", "65-78°F — auto-schedule handles the rest", False),
        (11, "If the power goes out:", "Breaker panel is in the laundry room. Sevier Electric: (865) 453-2887. Text host if it's longer than an hour.", True),
    ]
    for row, label, sample, wrap in rows:
        ws.cell(row=row, column=1, value=label).font = Font(
            name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT
        )
        cell = ws.cell(row=row, column=2, value=sample)
        style = input_cell_style()
        if wrap:
            style["alignment"] = Alignment(horizontal="left", vertical="top", wrap_text=True)
            ws.row_dimensions[row].height = 32
        apply_style(cell, style)

    # Dropdown for B5 — trash pickup day
    add_dropdown(ws, "B5", [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
        "Saturday", "Sunday", "No pickup — dumpster on-site",
    ])

    set_col_widths(ws, [("A", 32), ("B", 55)])
    ws.print_area = "A1:B12"
    ws.page_setup.orientation = "portrait"
    ws.page_setup.paperSize = 1
    ws.freeze_panes = "A5"


def build_departure_tab(wb):
    """Sheet 7 — Departure / Checkout."""
    ws = wb.create_sheet("Departure")
    ws.sheet_properties.tabColor = COLOR_PRIMARY

    apply_brand_header(ws, "Checkout", "What to do before you drive away.")

    ws.row_dimensions[4].height = 12

    # Row 5: checkout time input
    ws.cell(row=5, column=1, value="Checkout time:").font = Font(
        name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT
    )
    cell_b5 = ws.cell(row=5, column=2, value="11:00 AM")
    apply_style(cell_b5, input_cell_style())

    # Row 6: checkout day — formula cell
    ws.cell(row=6, column=1, value="Checkout day:").font = Font(
        name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT
    )
    cell_b6 = ws.cell(
        row=6, column=2,
        value='=IF(Welcome!B9<>"", TEXT(Welcome!B9,"dddd, mmmm d"), "See Welcome tab")',
    )
    apply_style(cell_b6, formula_cell_style())

    # Row 7: blank
    # Row 8: "Before you leave" header
    ws.cell(row=8, column=1, value="Before you leave — please:").font = Font(
        name=FONT_BODY, size=13, bold=True, color=COLOR_PRIMARY
    )

    # Rows 9-14: checklist items
    checklist = [
        (9, "☐ Strip bed linens and leave in:", "hallway laundry basket", True),
        (10, "☐ Run the dishwasher", None, False),
        (11, "☐ Take trash + recycling to:", "curb (Thursday) or dumpster on-site", True),
        (12, "☐ Turn thermostat to:", "72°F", True),
        (13, "☐ Lock all doors + windows", None, False),
        (14, "☐ Leave key:", "in lockbox, reset to 0000", True),
    ]
    for row, label, sample, has_input in checklist:
        ws.cell(row=row, column=1, value=label).font = Font(
            name=FONT_BODY, size=11, color=COLOR_TEXT
        )
        if has_input and sample is not None:
            cell = ws.cell(row=row, column=2, value=sample)
            apply_style(cell, input_cell_style())

    # Row 16: custom checkout tasks — input (wrap, height 50)
    ws.cell(row=16, column=1, value="Custom checkout tasks:").font = Font(
        name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT
    )
    cell_b16 = ws.cell(
        row=16, column=2,
        value="• Throw any leftover food\n• Text the host when on the road — we'll release your deposit faster",
    )
    style16 = input_cell_style()
    style16["alignment"] = Alignment(horizontal="left", vertical="top", wrap_text=True)
    apply_style(cell_b16, style16)
    ws.row_dimensions[16].height = 50

    set_col_widths(ws, [("A", 40), ("B", 45)])
    ws.print_area = "A1:B17"
    ws.page_setup.orientation = "portrait"
    ws.page_setup.paperSize = 1
    ws.freeze_panes = "A5"


def build_emergency_tab(wb):
    """Sheet 8 — Emergency Contacts."""
    ws = wb.create_sheet("Emergency")
    ws.sheet_properties.tabColor = COLOR_PRIMARY

    apply_brand_header(ws, "Emergency Contacts", "Keep this one nearby.")

    ws.row_dimensions[4].height = 12

    # Row 5: "IN AN EMERGENCY" — merged A5:B5, Georgia 16pt bold red, height 30
    ws.merge_cells("A5:B5")
    emergency_cell = ws.cell(row=5, column=1, value="IN AN EMERGENCY — CALL 911")
    emergency_cell.font = Font(name=FONT_HEAD, size=16, bold=True, color=COLOR_ERROR)
    emergency_cell.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[5].height = 30

    # Row 6: blank spacer
    ws.row_dimensions[6].height = 8

    # Rows 7-15: contact input rows
    contacts = [
        (7, "Nearest hospital:", "LeConte Medical Center", True),
        (8, "Hospital phone:", "(865) 446-7000", True),
        (9, "Hospital address:", "742 Middle Creek Rd, Sevierville, TN 37862", True),
        (10, "Urgent care:", "FastMed Urgent Care", True),
        (11, "Urgent care phone:", "(865) 428-1020", True),
        (12, "Non-emergency police:", "(865) 436-5181", True),
        (13, "Poison control:", "1-800-222-1222", False),  # hardcoded NOT input
        (14, "24-hr vet (if pets):", "Mountain Vet ER — (865) 329-1905", True),
        (15, "Utility outage reporting:", "Sevier Electric: (865) 453-2887", True),
    ]
    for row, label, sample, is_input in contacts:
        ws.cell(row=row, column=1, value=label).font = Font(
            name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT
        )
        cell = ws.cell(row=row, column=2, value=sample)
        if is_input:
            apply_style(cell, input_cell_style())
        else:
            # Hardcoded — no yellow fill, just plain styling
            cell.font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT)

    # Row 16: host phone — formula pulling from Welcome!B7
    ws.cell(row=16, column=1, value="Host phone (call/text):").font = Font(
        name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT
    )
    cell_b16 = ws.cell(row=16, column=2, value="=Welcome!B7")
    apply_style(cell_b16, formula_cell_style())

    set_col_widths(ws, [("A", 32), ("B", 55)])
    ws.print_area = "A1:B17"
    ws.page_setup.orientation = "portrait"
    ws.page_setup.paperSize = 1
    ws.freeze_panes = "A5"


def build_host_tab(wb):
    """Sheet 9 — Host Reference (HIDE)."""
    ws = wb.create_sheet("Host Reference (HIDE)")
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(
        ws,
        "Host Reference — Hide Before Sharing",
        "Your private operating sheet.",
    )

    ws.row_dimensions[4].height = 12

    # Rows 5-14: private input rows
    rows = [
        (5, "Cleaner name:", "Sarah @ Smokies Clean", False),
        (6, "Cleaner phone:", "(865) 555-0145", False),
        (7, "Handyman:", "Bob — (865) 555-0198", False),
        (8, "Plumber:", "Ridge Plumbing — (865) 555-0177", False),
        (9, "Pool/hot tub service:", "HotTub Haven — quarterly service", False),
        (10, "Insurance policy #:", "ABC-1234567 (Proper Insurance)", False),
        (11, "Wifi admin password (router):", "admin / router-pw-here", False),
        (12, "Smart lock master code:", "9999 — not for guest use", False),
        (13, "Passcodes for safes/boxes:", "Under-sink safe: 1234\nGarage keypad: 5678", True),
        (14, "Things to NOT tell the guest:", "Hot tub chemistry is touchy — do not tell guests to refill. If hot tub is cloudy, call HotTub Haven.", True),
    ]
    for row, label, sample, wrap in rows:
        ws.cell(row=row, column=1, value=label).font = Font(
            name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT
        )
        cell = ws.cell(row=row, column=2, value=sample)
        style = input_cell_style()
        if wrap:
            style["alignment"] = Alignment(horizontal="left", vertical="top", wrap_text=True)
            ws.row_dimensions[row].height = 36
        apply_style(cell, style)

    # Row 15: blank
    # Row 16: big red reminder — merged A16:B16, Georgia 12pt bold italic red, centered wrap, height 30
    ws.merge_cells("A16:B16")
    warn_cell = ws.cell(
        row=16,
        column=1,
        value="\u26a0 RIGHT-CLICK this tab \u2192 Hide before sharing the workbook or exporting to PDF.",
    )
    warn_cell.font = Font(
        name=FONT_HEAD, size=12, bold=True, italic=True, color=COLOR_ERROR
    )
    warn_cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    ws.row_dimensions[16].height = 30

    set_col_widths(ws, [("A", 36), ("B", 55)])
    ws.print_area = "A1:B17"
    ws.page_setup.orientation = "portrait"
    ws.page_setup.paperSize = 1
    ws.freeze_panes = "A5"


def main():
    wb = Workbook()
    build_welcome_tab(wb)
    build_arrival_tab(wb)
    build_wifi_tab(wb)
    build_rules_tab(wb)
    build_local_tab(wb)
    build_trash_tab(wb)
    build_departure_tab(wb)
    build_emergency_tab(wb)
    build_host_tab(wb)

    wb.properties.title = "Airbnb Welcome Book — The STR Ledger"
    wb.properties.creator = "The STR Ledger"
    wb.properties.company = "The STR Ledger"
    wb.properties.description = "Guest-facing welcome book template for Airbnb/VRBO hosts."

    OUT.parent.mkdir(parents=True, exist_ok=True)
    wb.save(OUT)
    print(f"Saved: {OUT}")


if __name__ == "__main__":
    main()
