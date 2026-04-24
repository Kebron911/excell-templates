"""Build OPS-001 Cleaner Turnover Checklist + Scorecard Excel file.

Implements templates/_briefs/OPS-001-turnover-checklist-spec.md.
Generates templates/_masters/OPS-001-turnover-checklist.xlsx.

Usage:
    python build_turnover_checklist.py

Dependencies: openpyxl (see requirements.txt).
"""
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.formatting.rule import CellIsRule
from openpyxl.worksheet.datavalidation import DataValidation

from brand_config import (
    COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT,
    COLOR_MUTED, COLOR_BG_LIGHT, COLOR_ERROR,
    FONT_HEAD, FONT_BODY, FONT_MONO,
    apply_brand_header, input_cell_style, formula_cell_style,
    header_row_style, set_col_widths, add_upgrade_banner, apply_style,
)

OUT = Path(__file__).resolve().parent.parent / "_masters" / "OPS-001-turnover-checklist.xlsx"

# --- Sample / constant data ---

CHECKLIST_ITEMS = [
    ("BEDROOM (6)", [
        "Dust all horizontal surfaces (nightstands, dresser, headboard)",
        "Strip and replace bed linens (crisp hospital corners)",
        "Fresh pillowcases both sides",
        "Vacuum under bed",
        "Empty wastebasket",
        "Check under bed for guest items",
    ]),
    ("BATHROOM (7)", [
        "Scrub toilet inside + outside base",
        "Clean mirror streak-free",
        "Wipe sink + faucet",
        "Scrub shower/tub including drain",
        "Replace towels (bath, hand, face)",
        "Restock toilet paper (min 2 rolls)",
        "Empty wastebasket",
    ]),
    ("KITCHEN (8)", [
        "Wipe all counters",
        "Clean stovetop (all burners + under)",
        "Wipe inside microwave",
        "Run dishwasher if items inside",
        "Wipe fridge exterior + handles",
        "Check fridge interior for guest leftovers (discard)",
        "Empty trash + replace liner",
        "Restock coffee + filters (check par level)",
    ]),
    ("LIVING (5)", [
        "Vacuum/sweep floors",
        "Dust TV + surfaces",
        "Fluff + realign pillows + throws",
        "Wipe remote controls",
        "Reset all furniture to original position",
    ]),
    ("OUTDOOR (4)", [
        "Sweep porch/deck",
        "Wipe outdoor furniture if present",
        "Check hot tub cover seated + clean",
        "Empty outdoor trash",
    ]),
    ("SUPPLIES (4)", [
        "Coffee pods \u2265 10",
        "Paper towels \u2265 2 rolls",
        "TP \u2265 2 per bathroom",
        "Dish soap + dishwasher pods topped up",
    ]),
    ("SAFETY (3)", [
        "All smoke detectors blinking green",
        "All doors + windows locked",
        "Keyless entry code reset (if applicable)",
    ]),
    ("FINAL WALK (3)", [
        "Photograph each room (send to host via text)",
        "Turn thermostat to host-preferred setting",
        "Lock up + leave",
    ]),
]

# Turnover Log sample rows 6-20 (15 turnovers across 3 cleaners, 6 properties)
TURNOVER_LOG_SAMPLES = [
    ("2026-03-14", "Smokies Ridge",  "Sarah \u2014 Smokies Clean",          40, "Perfect turnover", "No", 95),
    ("2026-03-16", "Creek Side",     "Miguel \u2014 Ridge Housekeeping",    36, "Missed: smoke detectors check", "No", 110),
    ("2026-03-18", "Lakehouse A",    "Sarah \u2014 Smokies Clean",          39, "Minor: 1 pillowcase off-center", "No", 90),
    ("2026-03-20", "Smokies Ridge",  "Jamie \u2014 Solo",                   32, "TP not restocked; shower drain clogged", "Yes", 75),
    ("2026-03-21", "Lakehouse B",    "Miguel \u2014 Ridge Housekeeping",    38, "All good", "No", 105),
    ("2026-03-23", "Smokies Ridge",  "Sarah \u2014 Smokies Clean",          38, "Missed outdoor trash", "No", 92),
    ("2026-03-25", "Creek Side",     "Jamie \u2014 Solo",                   30, "Coffee pods empty; mirror streaked", "Yes", 65),
    ("2026-03-26", "Mountain View",  "Miguel \u2014 Ridge Housekeeping",    37, "", "No", 100),
    ("2026-03-28", "Lakehouse A",    "Sarah \u2014 Smokies Clean",          40, "", "No", 88),
    ("2026-03-29", "Downtown Loft",  "Miguel \u2014 Ridge Housekeeping",    35, "Dishwasher not run", "No", 85),
    ("2026-03-30", "Smokies Ridge",  "Sarah \u2014 Smokies Clean",          37, "Late start \u2014 guest arrived early", "No", 70),
    ("2026-04-01", "Lakehouse B",    "Jamie \u2014 Solo",                   34, "Fridge not checked", "No", 72),
    ("2026-04-03", "Mountain View",  "Miguel \u2014 Ridge Housekeeping",    36, "", "No", 95),
    ("2026-04-05", "Creek Side",     "Jamie \u2014 Solo",                   34, "Minor: thermostat not reset", "No", 68),
    ("2026-04-07", "Lakehouse A",    "Miguel \u2014 Ridge Housekeeping",    38, "", "No", 100),
]

CLEANER_ROSTER_SAMPLES = [
    ("Sarah \u2014 Smokies Clean",       "(865) 555-0145", "sarah@smokiesclean.com", 45, "2025-06-01", "Flat rate per turnover; reliable"),
    ("Miguel \u2014 Ridge Housekeeping", "(865) 555-0177", "miguel@ridgehk.com",      40, "2025-08-15", "Team of 2; can handle back-to-back"),
    ("Jamie \u2014 Solo",                "(865) 555-0192", "jamie.cleans@gmail.com",  35, "2026-01-10", "New \u2014 still ramping"),
]

PROPERTIES = ["Smokies Ridge", "Creek Side", "Lakehouse A", "Lakehouse B", "Mountain View", "Downtown Loft"]

SUPPLIES_SAMPLES = [
    ("Smokies Ridge", 12, 4,  8, 30, 12, 3, 3, 20, 0),
    ("Creek Side",    10, 3,  6, 20, 10, 2, 2, 15, 0),
    ("Lakehouse A",   15, 4, 10, 30, 15, 4, 4, 25, 6),
]


def add_dropdown(ws, cell_range, formula1):
    """Add a list data validation to the given cell range."""
    dv = DataValidation(type="list", formula1=formula1, allow_blank=True)
    dv.add(cell_range)
    ws.add_data_validation(dv)


def _thin_border_bottom():
    """Return a Border with only a thin bottom edge."""
    return Border(bottom=Side(style="thin", color="AAAAAA"))


def build_welcome_tab(wb):
    """Sheet 1 — Welcome (host-facing cover + instructions)."""
    ws = wb.active
    ws.title = "Welcome"
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "Cleaner Turnover Checklist + Scorecard", "Turnover chaos has a spreadsheet.")

    # Row 5: "How this works" header
    ws.row_dimensions[4].height = 10
    hdr5 = ws.cell(row=5, column=1, value="How this works")
    hdr5.font = Font(name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)

    # Rows 6-11: how-to bullets
    bullets = [
        (6,  "1. Print tab 2 (Printable Checklist) \u2014 one per turnover. Give to cleaner."),
        (7,  "2. Cleaner checks off each item, signs, dates, returns to you."),
        (8,  "3. After turnover, open tab 3 (Turnover Log). Add a row: date, property, cleaner, items checked, notes."),
        (9,  "4. Open tab 4 (Scorecard Dashboard). See who your best cleaner is at a glance."),
        (10, "5. Tab 5 (Cleaner Roster): list all your cleaners. Dropdown on Turnover Log pulls from here."),
        (11, "6. Tab 6 (Supplies Par Levels): optional \u2014 per-property stock targets."),
    ]
    for row, text in bullets:
        ws.cell(row=row, column=1, value=text).font = Font(
            name=FONT_BODY, size=11, color=COLOR_TEXT
        )

    # Row 13: "Before first use" header
    ws.row_dimensions[12].height = 10
    hdr13 = ws.cell(row=13, column=1, value="Before first use")
    hdr13.font = Font(name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)

    # Rows 14-16: setup bullets
    setup = [
        (14, "\u2022 Go to tab 5, replace the 3 sample cleaners with your real ones."),
        (15, "\u2022 Go to tab 4, replace sample property names (rows 18-23) with yours."),
        (16, "\u2022 Print tab 2 for your next turnover."),
    ]
    for row, text in setup:
        ws.cell(row=row, column=1, value=text).font = Font(
            name=FONT_BODY, size=11, color=COLOR_TEXT
        )

    # Row 17: spacer
    ws.row_dimensions[17].height = 10

    # Row 18: upgrade banner
    add_upgrade_banner(ws, 18)

    # Column widths + freeze
    set_col_widths(ws, [("A", 85)])
    ws.freeze_panes = "A5"


def build_printable_tab(wb):
    """Sheet 2 — Printable Checklist (cleaner-facing, fits 1 page)."""
    ws = wb.create_sheet("Printable Checklist")
    ws.sheet_properties.tabColor = COLOR_PRIMARY

    apply_brand_header(ws, "Turnover Checklist", "Print one per turnover")

    # Row 4: Property + Date inputs
    ws.row_dimensions[4].height = 20
    ws.cell(row=4, column=1, value="Property:").font = Font(
        name=FONT_BODY, size=10, bold=True, color=COLOR_TEXT
    )
    prop_cell = ws.cell(row=4, column=2, value="")
    apply_style(prop_cell, input_cell_style())

    ws.cell(row=4, column=3, value="Date:").font = Font(
        name=FONT_BODY, size=10, bold=True, color=COLOR_TEXT
    )
    date_cell = ws.cell(row=4, column=4, value="")
    apply_style(date_cell, input_cell_style())

    # Row 5: blank spacer before zones
    ws.row_dimensions[5].height = 8

    current_row = 6

    for zone_name, items in CHECKLIST_ITEMS:
        # Zone header row — merged A:D, Georgia 12pt bold primary
        ws.merge_cells(f"A{current_row}:D{current_row}")
        zone_cell = ws.cell(row=current_row, column=1, value=zone_name)
        zone_cell.font = Font(name=FONT_HEAD, size=12, bold=True, color=COLOR_PRIMARY)
        zone_cell.fill = PatternFill("solid", fgColor="F0EBE3")
        zone_cell.alignment = Alignment(horizontal="left", vertical="center")
        ws.row_dimensions[current_row].height = 18
        current_row += 1

        # Item rows
        for item in items:
            # Col A: checkbox symbol (size 14)
            chk = ws.cell(row=current_row, column=1, value="\u2610")
            chk.font = Font(name=FONT_BODY, size=14, color=COLOR_TEXT)
            chk.alignment = Alignment(horizontal="center", vertical="center")

            # Col B: item text (size 10, wrap)
            txt = ws.cell(row=current_row, column=2, value=item)
            txt.font = Font(name=FONT_BODY, size=10, color=COLOR_TEXT)
            txt.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

            # Col C: initials blank with thin bottom border
            init = ws.cell(row=current_row, column=3, value="")
            init.border = _thin_border_bottom()
            init.alignment = Alignment(horizontal="center", vertical="center")
            init.font = Font(name=FONT_BODY, size=10, color=COLOR_TEXT)

            # Col D: empty buffer
            ws.cell(row=current_row, column=4, value="")

            ws.row_dimensions[current_row].height = 16
            current_row += 1

        # Spacer row between zones
        ws.row_dimensions[current_row].height = 6
        current_row += 1

    # Signature block
    sig_start = current_row

    # "Cleaner name:" + input border
    ws.cell(row=current_row, column=1, value="Cleaner name:").font = Font(
        name=FONT_BODY, size=10, bold=True, color=COLOR_TEXT
    )
    cn_cell = ws.cell(row=current_row, column=2, value="")
    cn_cell.border = _thin_border_bottom()
    ws.row_dimensions[current_row].height = 18
    current_row += 1

    # "Date:" + input border
    ws.cell(row=current_row, column=1, value="Date:").font = Font(
        name=FONT_BODY, size=10, bold=True, color=COLOR_TEXT
    )
    d_cell = ws.cell(row=current_row, column=2, value="")
    d_cell.border = _thin_border_bottom()
    ws.row_dimensions[current_row].height = 18
    current_row += 1

    # Blank row
    ws.row_dimensions[current_row].height = 8
    current_row += 1

    # "Signature:" + merged B:D input border
    ws.cell(row=current_row, column=1, value="Signature:").font = Font(
        name=FONT_BODY, size=10, bold=True, color=COLOR_TEXT
    )
    ws.merge_cells(f"B{current_row}:D{current_row}")
    sig_cell = ws.cell(row=current_row, column=2, value="")
    sig_cell.border = _thin_border_bottom()
    ws.row_dimensions[current_row].height = 20
    current_row += 1

    # Blank row
    ws.row_dimensions[current_row].height = 8
    current_row += 1

    # "Time on site (min):" + input border
    ws.cell(row=current_row, column=1, value="Time on site (min):").font = Font(
        name=FONT_BODY, size=10, bold=True, color=COLOR_TEXT
    )
    t_cell = ws.cell(row=current_row, column=2, value="")
    t_cell.border = _thin_border_bottom()
    ws.row_dimensions[current_row].height = 18

    last_row = current_row

    # Print settings
    ws.print_area = f"A1:D{last_row}"
    ws.page_setup.orientation = "portrait"
    ws.page_setup.paperSize = 1  # Letter
    ws.page_setup.fitToPage = True
    ws.page_setup.fitToHeight = 1
    ws.page_setup.fitToWidth = 1

    # Col widths: A=3 (checkbox), B=60 (item), C=10 (initials), D=15 (buffer)
    set_col_widths(ws, [("A", 3), ("B", 60), ("C", 10), ("D", 15)])


def build_log_tab(wb):
    """Sheet 3 — Turnover Log (one row per turnover, host-facing)."""
    ws = wb.create_sheet("Turnover Log")
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "Turnover Log", "One row per turnover")

    ws.row_dimensions[4].height = 10

    # Row 5: styled headers
    headers = [
        "Date",
        "Property",
        "Cleaner",
        "Items Checked (0-40)",
        "Notes/Issues",
        "Guest Complaint?",
        "Minutes on Site",
    ]
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        apply_style(cell, header_row_style())
    ws.row_dimensions[5].height = 20

    # Col widths
    set_col_widths(ws, [
        ("A", 12), ("B", 22), ("C", 22), ("D", 18),
        ("E", 40), ("F", 16), ("G", 12),
    ])

    # Populate sample rows 6-20
    for i, row_data in enumerate(TURNOVER_LOG_SAMPLES):
        row = 6 + i
        date_val, prop, cleaner, items, notes, complaint, minutes = row_data
        values = [date_val, prop, cleaner, items, notes, complaint, minutes]
        for col, val in enumerate(values, start=1):
            cell = ws.cell(row=row, column=col, value=val)
            apply_style(cell, input_cell_style())
        # Format date column
        ws.cell(row=row, column=1).number_format = "yyyy-mm-dd"
        ws.row_dimensions[row].height = 16

    # Data validations (rows 6-506)
    add_dropdown(ws, "B6:B506", "='Scorecard Dashboard'!$A$18:$A$27")
    add_dropdown(ws, "C6:C506", "='Cleaner Roster'!$A$6:$A$25")
    add_dropdown(ws, "F6:F506", '"Yes,No"')

    # Freeze A6
    ws.freeze_panes = "A6"


def build_scorecard_tab(wb):
    """Sheet 4 — Scorecard Dashboard (rolling metrics per cleaner)."""
    ws = wb.create_sheet("Scorecard Dashboard")
    ws.sheet_properties.tabColor = COLOR_ACCENT

    apply_brand_header(ws, "Cleaner Scorecard Dashboard", "Rolling metrics per cleaner")

    ws.row_dimensions[4].height = 10

    # Row 5: styled headers
    headers = ["Cleaner", "Turnovers", "Avg Score", "Issue Rate", "Rank"]
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        apply_style(cell, header_row_style())
    ws.row_dimensions[5].height = 20

    # Col widths
    set_col_widths(ws, [("A", 28), ("B", 14), ("C", 14), ("D", 14), ("E", 10)])

    # Pre-populate cleaner names in rows 6-8
    for idx, roster_row in enumerate(CLEANER_ROSTER_SAMPLES):
        row = 6 + idx
        ws.cell(row=row, column=1, value=roster_row[0]).font = Font(
            name=FONT_BODY, size=11, color=COLOR_TEXT
        )

    # Formulas for rows 6-15
    for i in range(6, 16):
        # Col B: Turnovers
        b_cell = ws.cell(
            row=i, column=2,
            value=f'=IF(A{i}="","",COUNTIF(\'Turnover Log\'!C:C,A{i}))'
        )
        apply_style(b_cell, formula_cell_style())

        # Col C: Avg Score
        c_cell = ws.cell(
            row=i, column=3,
            value=f'=IF(A{i}="","",IFERROR(AVERAGEIF(\'Turnover Log\'!C:C,A{i},\'Turnover Log\'!D:D),0))'
        )
        apply_style(c_cell, formula_cell_style())
        c_cell.number_format = "0.0"

        # Col D: Issue Rate
        d_cell = ws.cell(
            row=i, column=4,
            value=f'=IF(A{i}="","",IFERROR(COUNTIFS(\'Turnover Log\'!C:C,A{i},\'Turnover Log\'!F:F,"Yes")/COUNTIF(\'Turnover Log\'!C:C,A{i}),0))'
        )
        apply_style(d_cell, formula_cell_style())
        d_cell.number_format = "0%"

        # Col E: Rank
        e_cell = ws.cell(
            row=i, column=5,
            value=f'=IF(OR(A{i}="",B{i}=0),"",RANK.EQ(C{i},$C$6:$C$15,0))'
        )
        apply_style(e_cell, formula_cell_style())

        ws.row_dimensions[i].height = 16

    # Conditional formatting on C6:C15
    # Green: avg score >= 37
    ws.conditional_formatting.add(
        "C6:C15",
        CellIsRule(
            operator="greaterThanOrEqual",
            formula=["37"],
            fill=PatternFill("solid", fgColor="C7EFCF"),
        ),
    )
    # Yellow: 33-36.99
    ws.conditional_formatting.add(
        "C6:C15",
        CellIsRule(
            operator="between",
            formula=["33", "36.99"],
            fill=PatternFill("solid", fgColor="FFF3BF"),
        ),
    )
    # Red: 0.01-32.99
    ws.conditional_formatting.add(
        "C6:C15",
        CellIsRule(
            operator="between",
            formula=["0.01", "32.99"],
            fill=PatternFill("solid", fgColor="FFCCCC"),
        ),
    )

    # Row 16: spacer
    ws.row_dimensions[16].height = 10

    # Row 17: "Properties (source for Turnover Log dropdown):" header
    prop_hdr = ws.cell(
        row=17, column=1,
        value="Properties (source for Turnover Log dropdown):"
    )
    prop_hdr.font = Font(name=FONT_HEAD, size=12, bold=True, color=COLOR_PRIMARY)
    ws.row_dimensions[17].height = 20

    # Rows 18-23: 6 sample properties (input style)
    for idx, prop in enumerate(PROPERTIES):
        row = 18 + idx
        cell = ws.cell(row=row, column=1, value=prop)
        apply_style(cell, input_cell_style())
        ws.row_dimensions[row].height = 16

    # Freeze A6
    ws.freeze_panes = "A6"


def build_roster_tab(wb):
    """Sheet 5 — Cleaner Roster (team contact list)."""
    ws = wb.create_sheet("Cleaner Roster")
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "Cleaner Roster", "Your team, in one place")

    ws.row_dimensions[4].height = 10

    # Row 5: headers
    headers = ["Name", "Phone", "Email", "Pay Rate", "Start Date", "Notes"]
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        apply_style(cell, header_row_style())
    ws.row_dimensions[5].height = 20

    # Col widths
    set_col_widths(ws, [
        ("A", 28), ("B", 18), ("C", 28),
        ("D", 12), ("E", 14), ("F", 40),
    ])

    # Rows 6-8: sample data
    for i, row_data in enumerate(CLEANER_ROSTER_SAMPLES):
        row = 6 + i
        name, phone, email, pay_rate, start_date, notes = row_data
        values = [name, phone, email, pay_rate, start_date, notes]
        for col, val in enumerate(values, start=1):
            cell = ws.cell(row=row, column=col, value=val)
            apply_style(cell, input_cell_style())
        # Pay rate: currency format
        ws.cell(row=row, column=4).number_format = '"$"#,##0'
        # Start date: date format
        ws.cell(row=row, column=5).number_format = "yyyy-mm-dd"
        ws.row_dimensions[row].height = 16

    # Freeze A6
    ws.freeze_panes = "A6"


def build_supplies_tab(wb):
    """Sheet 6 — Supplies Par Levels by Property (bonus tab)."""
    ws = wb.create_sheet("Supplies Par Levels")
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "Supplies Par Levels by Property", "Bonus: per-property stock targets")

    ws.row_dimensions[4].height = 10

    # Row 5: headers
    headers = [
        "Property", "Coffee pods", "Paper towels", "TP rolls",
        "Dish pods", "Laundry pods", "Shampoo", "Body wash",
        "Trash bags", "Snacks",
    ]
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        apply_style(cell, header_row_style())
    ws.row_dimensions[5].height = 20

    # Col widths: A=20, B-J=12
    widths = [("A", 20)] + [(chr(ord("B") + i), 12) for i in range(9)]
    set_col_widths(ws, widths)

    # Rows 6-8: sample data
    for i, row_data in enumerate(SUPPLIES_SAMPLES):
        row = 6 + i
        for col, val in enumerate(row_data, start=1):
            cell = ws.cell(row=row, column=col, value=val)
            apply_style(cell, input_cell_style())
        ws.row_dimensions[row].height = 16

    # Freeze B6 (freeze panes at B6 keeps row 5 headers and col A visible when scrolling)
    ws.freeze_panes = "B6"


def main():
    wb = Workbook()
    build_welcome_tab(wb)
    build_printable_tab(wb)
    build_log_tab(wb)
    build_scorecard_tab(wb)
    build_roster_tab(wb)
    build_supplies_tab(wb)

    wb.properties.title = "Cleaner Turnover Checklist + Scorecard \u2014 The STR Ledger"
    wb.properties.creator = "The STR Ledger"
    wb.properties.company = "The STR Ledger"
    wb.properties.description = "Printable cleaner checklist + rolling cleaner scorecard for STR hosts."

    OUT.parent.mkdir(parents=True, exist_ok=True)
    wb.save(OUT)
    print(f"Saved: {OUT}")


if __name__ == "__main__":
    main()
