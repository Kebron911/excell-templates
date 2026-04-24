"""Build TAX-003 1099-NEC Contractor Tracker Excel file.

Implements templates/_briefs/TAX-003-1099-nec-tracker-spec.md.
Generates templates/_masters/TAX-003-1099-nec-tracker.xlsx.

Usage:
    python build_1099_nec_tracker.py

Dependencies: openpyxl (see requirements.txt).
"""
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.formatting.rule import FormulaRule
from openpyxl.worksheet.datavalidation import DataValidation

from brand_config import (
    COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT,
    COLOR_MUTED, COLOR_BG_LIGHT, COLOR_ERROR,
    FONT_HEAD, FONT_BODY, FONT_MONO,
    apply_brand_header, input_cell_style, formula_cell_style,
    header_row_style, set_col_widths, add_upgrade_banner, apply_style,
)

OUT = Path(__file__).resolve().parent.parent / "_masters" / "TAX-003-1099-nec-tracker.xlsx"

# --- Sample data ---

CONTRACTORS = [
    ("Sarah Smokies Clean",  "Smokies Clean LLC",  "XX-XXXXXXX", "147 Pine St",  "Gatlinburg",   "TN", "37738", "sarah@smokiesclean.com",  "(865) 555-0145", "Cleaning services",          "Yes", "2025-12-15"),
    ("Bob Handyman",         "Bob's Ridge Repair", "XX-XXXXXXX", "20 Ridge Rd",  "Sevierville",  "TN", "37862", "bob@ridgerepair.com",     "(865) 555-0198", "General handyman + repairs", "Yes", "2025-11-20"),
    ("Lens Photography",     "Lens Co",            "\u2014",     "1 Market St",  "Knoxville",    "TN", "37902", "hello@lensco.com",        "(865) 555-0211", "Listing photography",        "No",  ""),
    ("Joe Landscape",        "Joe's Lawn Care",    "XX-XXXXXXX", "55 Oak Ln",    "Pigeon Forge", "TN", "37863", "joe@joeslawn.com",        "(865) 555-0155", "Lawn + landscape",           "No",  ""),
    ("Quick Plumbing",       "Quick Plumbing LLC", "XX-XXXXXXX", "88 Water Way", "Sevierville",  "TN", "37862", "info@quickplumbing.com",  "(865) 555-0166", "Emergency plumbing",         "No",  ""),
]


def _build_payments():
    payments = []
    # Sarah — 24 turnovers, 2 per month Jan-Dec, $400 Venmo Smokies Ridge
    for month in range(1, 13):
        for day in (7, 21):
            payments.append((
                f"2026-{month:02d}-{day:02d}", "Sarah Smokies Clean", 400,
                "Venmo", "Smokies Ridge", "Turnover", ""
            ))
    # Bob — 5 payments
    payments += [
        ("2026-01-15", "Bob Handyman", 280, "Zelle", "Smokies Ridge", "Kitchen faucet repair",    ""),
        ("2026-02-22", "Bob Handyman", 150, "Venmo", "Creek Side",    "Door lock replacement",    ""),
        ("2026-04-10", "Bob Handyman", 220, "Check", "Lakehouse A",   "Deck board replacement",   ""),
        ("2026-05-28", "Bob Handyman", 180, "Venmo", "Smokies Ridge", "Water heater fitting",     ""),
        ("2026-07-14", "Bob Handyman", 170, "Venmo", "Creek Side",    "Misc fixes",               ""),
    ]
    # Lens — 1 payment below threshold
    payments.append(("2026-03-10", "Lens Photography", 500, "ACH", "Lakehouse A", "Listing photos", "One-time project"))
    # Joe — 10 weekly lawns @ $80 (Zelle, Smokies Ridge) across Apr-Sep
    joe_dates = [
        "2026-04-05", "2026-04-19", "2026-05-03", "2026-05-17", "2026-06-07",
        "2026-06-21", "2026-07-05", "2026-07-19", "2026-08-16", "2026-09-13",
    ]
    for d in joe_dates:
        payments.append((d, "Joe Landscape", 80, "Zelle", "Smokies Ridge", "Weekly lawn", ""))
    # Quick Plumbing — 2 payments summing to $600
    payments += [
        ("2026-06-12", "Quick Plumbing", 300, "Check", "Creek Side",  "Emergency leak",     ""),
        ("2026-09-05", "Quick Plumbing", 300, "Check", "Lakehouse A", "Water heater call",  ""),
    ]
    return payments


PAYMENTS = _build_payments()

PENALTIES = [
    ("Filed \u226430 days late:",    "$60 per form"),
    ("Filed 31 days\u2013Aug 1:",    "$130 per form"),
    ("Filed after Aug 1:",           "$330 per form"),
    ("Intentional disregard:",       "$660 per form"),
]


def add_dropdown(ws, cell_range, formula1):
    """Add a list data validation to the given cell range."""
    dv = DataValidation(type="list", formula1=formula1, allow_blank=True)
    dv.add(cell_range)
    ws.add_data_validation(dv)


# ---------------------------------------------------------------------------
# Sheet builders
# ---------------------------------------------------------------------------

def build_welcome_tab(wb):
    """Sheet 1 — Welcome (host-facing cover + instructions)."""
    ws = wb.active
    ws.title = "Welcome"
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "1099-NEC Contractor Tracker", "Close your year before April does.")

    ws.row_dimensions[4].height = 10

    # Row 5: IRS rule header
    hdr5 = ws.cell(row=5, column=1, value="The 1099-NEC Rule (IRS 2026)")
    hdr5.font = Font(name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    ws.row_dimensions[5].height = 22

    # Row 6: compliance paragraph
    para = ws.cell(
        row=6, column=1,
        value=(
            "Anyone you pay $600 or more in a calendar year for business services requires "
            "a 1099-NEC issued by January 31 of the following year. Penalties for missed forms: "
            "$60\u2013$660 per form (IRS Pub 1220). This tool tracks every payment and flags "
            "who crosses the threshold."
        ),
    )
    para.font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
    para.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    ws.row_dimensions[6].height = 46

    # Row 7: spacer
    ws.row_dimensions[7].height = 8

    # Row 8: "How to use" header
    hdr8 = ws.cell(row=8, column=1, value="How to use")
    hdr8.font = Font(name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    ws.row_dimensions[8].height = 22

    # Rows 9-14: 6 how-to steps
    steps = [
        (9,  "1. Tab 2 (Contractors): add every contractor you pay \u2014 name, tax ID, address, W-9 status."),
        (10, "2. Tab 3 (Payment Log): log every payment as it happens (date, contractor, amount, method)."),
        (11, "3. Tab 4 (1099 Prep Dashboard): watch who crosses $600 in real time."),
        (12, "4. Monthly: scan Dashboard for anyone marked YES without a W-9 \u2192 request W-9 immediately."),
        (13, "5. December: ensure every YES contractor has a W-9 on file before year-end."),
        (14, "6. January: file 1099-NECs (via QuickBooks, Track1099, or CPA) using Dashboard data."),
    ]
    for row, text in steps:
        cell = ws.cell(row=row, column=1, value=text)
        cell.font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
        cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        ws.row_dimensions[row].height = 20

    # Row 15-17: spacers
    ws.row_dimensions[15].height = 8
    ws.row_dimensions[16].height = 8
    ws.row_dimensions[17].height = 8

    # Row 18: upgrade banner
    add_upgrade_banner(ws, 18)

    # Col A width + freeze
    set_col_widths(ws, [("A", 95)])
    ws.freeze_panes = "A5"


def build_contractors_tab(wb):
    """Sheet 2 — Contractors (one row per contractor, W-9 tracking)."""
    ws = wb.create_sheet("Contractors")
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "Contractors", "Add every contractor you pay — name, tax ID, address, W-9 status.")

    ws.row_dimensions[4].height = 10

    # Col widths per spec: A=24 B=24 C=16 D=32 E=16 F=6 G=10 H=28 I=16 J=28 K=8 L=14
    set_col_widths(ws, [
        ("A", 24), ("B", 24), ("C", 16), ("D", 32), ("E", 16),
        ("F", 6),  ("G", 10), ("H", 28), ("I", 16), ("J", 28),
        ("K", 8),  ("L", 14),
    ])

    # Row 5: styled headers
    headers = [
        "Name", "Business Name", "EIN/SSN", "Address", "City",
        "State", "Zip", "Email", "Phone", "Services",
        "W-9 on File?", "W-9 Date",
    ]
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        apply_style(cell, header_row_style())
    ws.row_dimensions[5].height = 20

    # Rows 6-10: sample contractors
    for row_idx, contractor in enumerate(CONTRACTORS, start=6):
        for col_idx, value in enumerate(contractor, start=1):
            cell = ws.cell(row=row_idx, column=col_idx, value=value if value != "" else None)
            apply_style(cell, input_cell_style())
            # Col L (index 12): date format
            if col_idx == 12 and value:
                cell.number_format = "yyyy-mm-dd"
        ws.row_dimensions[row_idx].height = 16

    # Rows 11-55: blank capacity with input style
    for row_idx in range(11, 56):
        for col_idx in range(1, 13):
            cell = ws.cell(row=row_idx, column=col_idx)
            apply_style(cell, input_cell_style())
            if col_idx == 12:
                cell.number_format = "yyyy-mm-dd"
        ws.row_dimensions[row_idx].height = 16

    # Dropdown: K6:K55 — Yes/No
    add_dropdown(ws, "K6:K55", '"Yes,No"')

    # Freeze A6
    ws.freeze_panes = "A6"


def build_log_tab(wb):
    """Sheet 3 — Payment Log (one row per payment, 2000 capacity rows)."""
    ws = wb.create_sheet("Payment Log")
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "Payment Log", "Log every payment as it happens.")

    ws.row_dimensions[4].height = 10

    # Col widths: A=12 B=26 C=12 D=16 E=20 F=32 G=28
    set_col_widths(ws, [
        ("A", 12), ("B", 26), ("C", 12), ("D", 16),
        ("E", 20), ("F", 32), ("G", 28),
    ])

    # Row 5: styled headers
    headers = ["Date", "Contractor", "Amount", "Payment Method", "Property", "Description", "Notes"]
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        apply_style(cell, header_row_style())
    ws.row_dimensions[5].height = 20

    # Rows 6+: sample data then blank capacity
    for i, payment in enumerate(PAYMENTS, start=6):
        date_val, contractor, amount, method, prop, desc, notes = payment

        # Col A: date
        a = ws.cell(row=i, column=1, value=date_val)
        apply_style(a, input_cell_style())
        a.number_format = "yyyy-mm-dd"

        # Col B: contractor
        b = ws.cell(row=i, column=2, value=contractor)
        apply_style(b, input_cell_style())

        # Col C: amount
        c = ws.cell(row=i, column=3, value=amount)
        apply_style(c, input_cell_style())
        c.number_format = '"$"#,##0.00'

        # Col D: payment method
        d = ws.cell(row=i, column=4, value=method)
        apply_style(d, input_cell_style())

        # Col E: property
        e = ws.cell(row=i, column=5, value=prop)
        apply_style(e, input_cell_style())

        # Col F: description
        f = ws.cell(row=i, column=6, value=desc)
        apply_style(f, input_cell_style())

        # Col G: notes
        g = ws.cell(row=i, column=7, value=notes if notes else None)
        apply_style(g, input_cell_style())

        ws.row_dimensions[i].height = 16

    # Blank capacity rows (remaining up to 2005)
    last_data_row = len(PAYMENTS) + 5
    for row_idx in range(last_data_row + 1, 2006):
        for col_idx in range(1, 8):
            cell = ws.cell(row=row_idx, column=col_idx)
            apply_style(cell, input_cell_style())
            if col_idx == 1:
                cell.number_format = "yyyy-mm-dd"
            if col_idx == 3:
                cell.number_format = '"$"#,##0.00'

    # Dropdowns
    add_dropdown(ws, "B6:B2005", "=Contractors!$A$6:$A$55")
    add_dropdown(ws, "D6:D2005", '"Venmo,Zelle,Check,Cash,ACH,Credit Card,Other"')

    # Freeze A6
    ws.freeze_panes = "A6"


def build_dashboard_tab(wb):
    """Sheet 4 — 1099 Prep Dashboard (auto-calculated from other sheets)."""
    ws = wb.create_sheet("1099 Prep Dashboard")
    ws.sheet_properties.tabColor = COLOR_ACCENT

    apply_brand_header(ws, "1099 Prep Dashboard", "Watch who crosses $600 in real time.")

    ws.row_dimensions[4].height = 10

    # Col widths: A=28 B=16 C=18 D=16 E=18
    set_col_widths(ws, [
        ("A", 28), ("B", 16), ("C", 18), ("D", 16), ("E", 18),
    ])

    # Row 5: styled headers
    headers = ["Contractor", "YTD Paid", "1099 Required?", "W-9 on File?", "Status"]
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        apply_style(cell, header_row_style())
    ws.row_dimensions[5].height = 20

    # Rows 6-55: formula rows
    for i in range(6, 56):
        # Col A
        a = ws.cell(
            row=i, column=1,
            value=f'=IF(Contractors!A{i}="","",Contractors!A{i})',
        )
        apply_style(a, formula_cell_style())
        a.alignment = Alignment(horizontal="left", vertical="center")

        # Col B: SUMIFS
        b = ws.cell(
            row=i, column=2,
            value=(
                f'=IF(A{i}="","",'
                f'SUMIFS(\'Payment Log\'!$C:$C,\'Payment Log\'!$B:$B,A{i}))'
            ),
        )
        apply_style(b, formula_cell_style())
        b.number_format = '"$"#,##0.00'

        # Col C: 1099 required?
        c = ws.cell(
            row=i, column=3,
            value=(
                f'=IF(A{i}="","",'
                f'IF(B{i}>=Settings!$B$5,"YES","no"))'
            ),
        )
        apply_style(c, formula_cell_style())
        c.alignment = Alignment(horizontal="center", vertical="center")

        # Col D: W-9 on file via VLOOKUP
        d = ws.cell(
            row=i, column=4,
            value=(
                f'=IF(A{i}="","",'
                f'IFERROR(VLOOKUP(A{i},Contractors!$A$6:$L$55,11,FALSE),"?"))'
            ),
        )
        apply_style(d, formula_cell_style())
        d.alignment = Alignment(horizontal="center", vertical="center")

        # Col E: Status (nested IF)
        e = ws.cell(
            row=i, column=5,
            value=(
                f'=IF(A{i}="","",'
                f'IF(C{i}="YES",'
                f'IF(D{i}="Yes","\u2713 Ready","\u26a0 Need W-9"),'
                f'"n/a"))'
            ),
        )
        apply_style(e, formula_cell_style())
        e.alignment = Alignment(horizontal="center", vertical="center")

        ws.row_dimensions[i].height = 16

    # --- Conditional formatting ---

    # C column: YES = red, no = gray
    ws.conditional_formatting.add(
        "C6:C55",
        FormulaRule(
            formula=['C6="YES"'],
            fill=PatternFill("solid", fgColor="FFCCCC"),
            font=Font(bold=True),
        ),
    )
    ws.conditional_formatting.add(
        "C6:C55",
        FormulaRule(
            formula=['C6="no"'],
            fill=PatternFill("solid", fgColor="EDEDED"),
        ),
    )

    # E column: Ready = green, Need W-9 = yellow
    ws.conditional_formatting.add(
        "E6:E55",
        FormulaRule(
            formula=['E6="\u2713 Ready"'],
            fill=PatternFill("solid", fgColor="C7EFCF"),
        ),
    )
    ws.conditional_formatting.add(
        "E6:E55",
        FormulaRule(
            formula=['E6="\u26a0 Need W-9"'],
            fill=PatternFill("solid", fgColor="FFF3BF"),
        ),
    )

    # Row 59: spacer
    ws.row_dimensions[59].height = 8

    # Row 60: "Summary" section header
    hdr60 = ws.cell(row=60, column=1, value="Summary")
    hdr60.font = Font(name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    ws.row_dimensions[60].height = 22

    # Rows 61-64: summary stats
    summary_rows = [
        (61, "Contractors requiring 1099:", '=COUNTIF(C6:C55,"YES")', "0"),
        (62, "Of those, ready (W-9 on file):", '=COUNTIF(E6:E55,"\u2713 Ready")', "0"),
        (63, "Of those, need W-9:", '=COUNTIF(E6:E55,"\u26a0 Need W-9")', "0"),
        (64, "Total 1099-NEC $ volume:", '=SUMIFS(B6:B55,C6:C55,"YES")', '"$"#,##0.00'),
    ]
    for row_num, label, formula, num_fmt in summary_rows:
        a = ws.cell(row=row_num, column=1, value=label)
        a.font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT)
        a.alignment = Alignment(horizontal="left", vertical="center")

        b = ws.cell(row=row_num, column=2, value=formula)
        b.font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_PRIMARY)
        b.number_format = num_fmt
        b.alignment = Alignment(horizontal="right", vertical="center")

        ws.row_dimensions[row_num].height = 18

    # Freeze A6
    ws.freeze_panes = "A6"


def build_settings_tab(wb):
    """Sheet 5 — Settings (IRS threshold + reference data)."""
    ws = wb.create_sheet("Settings")
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "Settings", "IRS threshold + penalty reference")

    ws.row_dimensions[4].height = 10

    # Col widths: A=36 B=14
    set_col_widths(ws, [("A", 36), ("B", 14)])

    bold_right = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT)
    right_align = Alignment(horizontal="right", vertical="center")

    # Row 5: IRS threshold
    a5 = ws.cell(row=5, column=1, value="IRS 1099-NEC threshold ($):")
    a5.font = bold_right
    a5.alignment = right_align

    b5 = ws.cell(row=5, column=2, value=600)
    apply_style(b5, input_cell_style())
    b5.number_format = '"$"#,##0'
    ws.row_dimensions[5].height = 18

    # Row 6: spacer
    ws.row_dimensions[6].height = 8

    # Row 7: Tax year
    a7 = ws.cell(row=7, column=1, value="Tax year:")
    a7.font = bold_right
    a7.alignment = right_align

    b7 = ws.cell(row=7, column=2, value="=YEAR(TODAY())")
    apply_style(b7, formula_cell_style())
    ws.row_dimensions[7].height = 18

    # Row 8: spacer
    ws.row_dimensions[8].height = 8

    # Row 9: penalty schedule header
    a9 = ws.cell(row=9, column=1, value="IRS 1099 penalty schedule (reference):")
    a9.font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_PRIMARY)
    a9.alignment = Alignment(horizontal="left", vertical="center")
    ws.row_dimensions[9].height = 18

    # Rows 10-13: penalty data
    for i, (label, amount) in enumerate(PENALTIES, start=10):
        a = ws.cell(row=i, column=1, value=label)
        a.font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
        a.alignment = Alignment(horizontal="left", vertical="center")

        b = ws.cell(row=i, column=2, value=amount)
        b.font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
        b.alignment = Alignment(horizontal="left", vertical="center")

        ws.row_dimensions[i].height = 16


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def main():
    wb = Workbook()
    build_welcome_tab(wb)
    build_contractors_tab(wb)
    build_log_tab(wb)
    build_dashboard_tab(wb)
    build_settings_tab(wb)

    wb.properties.title = "1099-NEC Contractor Tracker \u2014 The STR Ledger"
    wb.properties.creator = "The STR Ledger"
    wb.properties.company = "The STR Ledger"
    wb.properties.description = "1099-NEC threshold tracker for STR hosts paying contractors."

    OUT.parent.mkdir(parents=True, exist_ok=True)
    wb.save(OUT)
    print(f"Saved: {OUT}")


if __name__ == "__main__":
    main()
