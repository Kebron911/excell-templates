"""Build TAX-001 STR Mileage Log Excel file.

Implements templates/_briefs/TAX-001-mileage-log-spec.md.
Generates templates/_masters/TAX-001-mileage-log.xlsx.

Usage:
    python build_mileage_log.py

Dependencies: openpyxl (see requirements.txt).
"""
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.formatting.rule import FormulaRule
from openpyxl.worksheet.datavalidation import DataValidation

from brand_config import (
    COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT,
    COLOR_MUTED, COLOR_BG_LIGHT, COLOR_ERROR,
    FONT_HEAD, FONT_BODY, FONT_MONO,
    apply_brand_header, input_cell_style, formula_cell_style,
    header_row_style, set_col_widths, add_upgrade_banner, apply_style,
)

OUT = Path(__file__).resolve().parent.parent / "_masters" / "TAX-001-mileage-log.xlsx"

# --- Constants ---

IRS_RATE_2026 = 0.70

PURPOSES = [
    "Property inspection",
    "Turnover",
    "Supplies run",
    "Guest transport",
    "Repairs",
    "Meeting cleaner",
    "Other",
]

PROPERTIES = ["Smokies Ridge", "Creek Side", "Lakehouse A"]

# Sample rows 6-25 — 20 trips Jan-Mar 2026
# Tuple: (date, property, destination, purpose, start_odo, end_odo, typed_miles_or_empty, notes)
MILEAGE_SAMPLES = [
    ("2026-01-05", "Smokies Ridge", "Home Depot run",                        "Supplies run",        45120, 45144, "", "Hot tub chemicals"),
    ("2026-01-08", "Smokies Ridge", "Property inspection visit",             "Property inspection", 45150, 45195, "", "Quarterly inspection"),
    ("2026-01-15", "Creek Side",    "Knoxville airport guest pickup",        "Guest transport",     45200, 45292, "", "Airbnb Plus comped ride"),
    ("2026-01-20", "Smokies Ridge", "Meet new cleaner onsite",               "Meeting cleaner",     45300, 45345, "", "Onboard Jamie"),
    ("2026-02-02", "Creek Side",    "Turnover walkthrough",                  "Turnover",            45400, 45490, "", ""),
    ("2026-02-07", "Lakehouse A",   "Supplies + inspection",                 "Supplies run",        45500, 45565, "", ""),
    ("2026-02-10", "Smokies Ridge", "Burst pipe emergency",                  "Repairs",             45600, 45648, "", "Plumber met me"),
    ("2026-02-14", "Creek Side",    "Hot tub service",                       "Repairs",             45700, 45790, "", ""),
    ("2026-02-18", "Lakehouse A",   "Quarterly inspection",                  "Property inspection", 45800, 45867, "", ""),
    ("2026-02-22", "Smokies Ridge", "Guest pickup airport",                  "Guest transport",     45900, 45992, "", ""),
    ("2026-02-28", "Creek Side",    "Cleaner check-in",                      "Meeting cleaner",     46050, 46095, "", ""),
    ("2026-03-05", "Lakehouse A",   "Lowe's run",                            "Supplies run",        46150, 46178, "", "Bought new kettle"),
    ("2026-03-10", "Smokies Ridge", "Turnover issue callback",               "Turnover",            46200, 46245, "", "Guest complaint follow-up"),
    ("2026-03-14", "Creek Side",    "Handyman meeting",                      "Repairs",             46300, 46349, "", ""),
    ("2026-03-18", "Smokies Ridge", "Property inspection visit",             "Property inspection", 46400, 46445, "", ""),
    ("2026-03-22", "Lakehouse A",   "Guest transport \u2014 late flight",    "Guest transport",     46500, 46587, "", ""),
    ("2026-03-25", "Creek Side",    "Supplies \u2014 Costco",                "Supplies run",        46650, 46695, "", ""),
    ("2026-03-28", "Smokies Ridge", "Turnover final check",                  "Turnover",            46800, 46843, "", ""),
    ("2026-03-30", "Lakehouse A",   "Supplies \u2014 Target",                "Supplies run",        46900, 46928, "", ""),
    ("2026-03-31", "Smokies Ridge", "Month-end inspection",                  "Property inspection", 46950, 46995, "", ""),
]

MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def add_dropdown(ws, cell_range, formula1):
    """Add a list data validation to the given cell range."""
    dv = DataValidation(type="list", formula1=formula1, allow_blank=True)
    dv.add(cell_range)
    ws.add_data_validation(dv)


def build_welcome_tab(wb):
    """Sheet 1 — Welcome (host-facing cover + instructions)."""
    ws = wb.active
    ws.title = "Welcome"
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "STR Mileage Log", "Close your year before April does.")

    ws.row_dimensions[4].height = 10

    # Row 5: IRS compliance header
    hdr5 = ws.cell(row=5, column=1, value="What this covers (IRS Publication 463 compliance)")
    hdr5.font = Font(name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    ws.row_dimensions[5].height = 22

    # Row 6: compliance paragraph
    para = ws.cell(
        row=6, column=1,
        value=(
            "The IRS requires 4 things on every business-mileage entry: date, destination, "
            "business purpose, and miles driven. This log captures all 4 plus odometer readings, "
            "property allocation, and calculated $ deduction at the current rate."
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

    # Rows 9-15: 7 how-to steps
    steps = [
        (9,  "1. Open tab 2 (Mileage Log). Fill one row per trip."),
        (10, "2. Use EITHER odometer columns (E + F auto-calc) OR typed Miles column (G). Formula uses odometer if both are filled."),
        (11, "3. Choose Property + Business Purpose from dropdowns."),
        (12, "4. Column K ('\u2714 IRS') flags incomplete rows \u2014 red means audit-risk."),
        (13, "5. Switch to tab 3 (Monthly Summary) for month-by-month totals."),
        (14, "6. Switch to tab 4 (YTD Dashboard) for totals + breakdown by purpose."),
        (15, "7. At tax time: File \u2192 Print \u2192 select tabs 3 + 4. That\u2019s your CPA handoff."),
    ]
    for row, text in steps:
        cell = ws.cell(row=row, column=1, value=text)
        cell.font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
        cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        ws.row_dimensions[row].height = 20

    # Row 16: spacer
    ws.row_dimensions[16].height = 8

    # Row 17: IRS rate warning
    warn = ws.cell(
        row=17, column=1,
        value=(
            f"\u26a0 IRS rate updates January 1 each year. Current (2026): ${IRS_RATE_2026}/mi. "
            "Update cell B5 on the Settings tab each January. Check irs.gov Publication 463."
        ),
    )
    warn.font = Font(name=FONT_BODY, size=11, italic=True, color=COLOR_ERROR)
    warn.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    ws.row_dimensions[17].height = 36

    # Row 18: spacer
    ws.row_dimensions[18].height = 8

    # Row 19: upgrade banner
    add_upgrade_banner(ws, 19)

    # Col A width + freeze
    set_col_widths(ws, [("A", 95)])
    ws.freeze_panes = "A5"


def build_log_tab(wb):
    """Sheet 2 — Mileage Log (one row per trip, 2000 capacity rows)."""
    ws = wb.create_sheet("Mileage Log")
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "Mileage Log", "One row per trip \u2014 odometer or typed miles")

    ws.row_dimensions[4].height = 10

    # Row 5: styled headers
    headers = [
        "Date",
        "Property",
        "Destination",
        "Business Purpose",
        "Start Odo",
        "End Odo",
        "Miles (typed alt)",
        "Calculated Miles",
        "$ Deduction",
        "Notes",
        "\u2714 IRS",
    ]
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        apply_style(cell, header_row_style())
    ws.row_dimensions[5].height = 20

    # Col widths: A=12 B=20 C=28 D=22 E=10 F=10 G=10 H=10 I=12 J=30 K=14
    set_col_widths(ws, [
        ("A", 12), ("B", 20), ("C", 28), ("D", 22),
        ("E", 10), ("F", 10), ("G", 10), ("H", 10),
        ("I", 12), ("J", 30), ("K", 14),
    ])

    # Rows 6-2005: formulas on every row; sample data on rows 6-25
    for i in range(6, 2006):
        sample_idx = i - 6
        sample = MILEAGE_SAMPLES[sample_idx] if sample_idx < len(MILEAGE_SAMPLES) else None

        if sample:
            date_val, prop, dest, purpose, start_odo, end_odo, typed_miles, notes = sample

            # Col A: date
            a = ws.cell(row=i, column=1, value=date_val)
            apply_style(a, input_cell_style())
            a.number_format = "yyyy-mm-dd"

            # Col B: property
            b = ws.cell(row=i, column=2, value=prop)
            apply_style(b, input_cell_style())

            # Col C: destination
            c = ws.cell(row=i, column=3, value=dest)
            apply_style(c, input_cell_style())

            # Col D: purpose
            d = ws.cell(row=i, column=4, value=purpose)
            apply_style(d, input_cell_style())

            # Col E: start odometer
            e = ws.cell(row=i, column=5, value=start_odo)
            apply_style(e, input_cell_style())

            # Col F: end odometer
            f = ws.cell(row=i, column=6, value=end_odo)
            apply_style(f, input_cell_style())

            # Col G: typed miles (empty in most samples)
            g_val = typed_miles if typed_miles != "" else None
            g = ws.cell(row=i, column=7, value=g_val)
            apply_style(g, input_cell_style())

            # Col J: notes
            j = ws.cell(row=i, column=10, value=notes if notes else None)
            apply_style(j, input_cell_style())

        # Col H: calculated miles formula — ALL rows 6-2005
        h_cell = ws.cell(
            row=i, column=8,
            value=f"=IF(AND(E{i}<>\"\",F{i}<>\"\"), F{i}-E{i}, IF(G{i}<>\"\", G{i}, 0))",
        )
        h_cell.number_format = "0"
        if sample:
            apply_style(h_cell, formula_cell_style())

        # Col I: deduction formula — ALL rows 6-2005
        i_cell = ws.cell(
            row=i, column=9,
            value=f"=H{i}*Settings!$B$5",
        )
        i_cell.number_format = '"$"#,##0.00'
        if sample:
            apply_style(i_cell, formula_cell_style())

        # Col K: IRS completeness check — ALL rows 6-2005
        k_cell = ws.cell(
            row=i, column=11,
            value=f'=IF(AND(A{i}<>"",C{i}<>"",D{i}<>"",H{i}>0),"\u2713","\u26a0 missing")',
        )
        if sample:
            apply_style(k_cell, formula_cell_style())

        if sample:
            ws.row_dimensions[i].height = 16

    # Dropdowns
    add_dropdown(ws, "B6:B2005", "=Settings!$E$11:$E$30")
    add_dropdown(ws, "D6:D2005", "=Settings!$G$11:$G$30")

    # Conditional formatting on K6:K2005
    ws.conditional_formatting.add(
        "K6:K2005",
        FormulaRule(
            formula=['K6="\u26a0 missing"'],
            fill=PatternFill("solid", fgColor="FFCCCC"),
        ),
    )
    ws.conditional_formatting.add(
        "K6:K2005",
        FormulaRule(
            formula=['K6="\u2713"'],
            fill=PatternFill("solid", fgColor="C7EFCF"),
        ),
    )

    # Freeze A6
    ws.freeze_panes = "A6"


def build_monthly_tab(wb):
    """Sheet 3 — Monthly Summary (auto-calculated from Mileage Log)."""
    ws = wb.create_sheet("Monthly Summary")
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "Monthly Summary", "Auto-calculated from the Mileage Log")

    ws.row_dimensions[4].height = 10

    # Row 5: styled headers
    headers = ["Month", "Miles", "$ Deduction", "Trip Count"]
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        apply_style(cell, header_row_style())
    ws.row_dimensions[5].height = 20

    # Col widths: 14/14/16/14
    set_col_widths(ws, [("A", 14), ("B", 14), ("C", 16), ("D", 14)])

    # Rows 6-17: one per month
    for i in range(6, 18):
        month_num = i - 5  # row 6 = Jan = 1, row 17 = Dec = 12
        next_month = month_num + 1

        # Col A: month label
        ws.cell(row=i, column=1, value=MONTHS[month_num - 1]).font = Font(
            name=FONT_BODY, size=11, color=COLOR_TEXT
        )

        # Col B: miles SUMIFS
        # Handle December: next month wraps to Jan of next year via DATE overflow trick
        if month_num < 12:
            b_formula = (
                f"=SUMIFS('Mileage Log'!$H:$H,"
                f"'Mileage Log'!$A:$A,\">=\"&DATE(YEAR(TODAY()),{month_num},1),"
                f"'Mileage Log'!$A:$A,\"<\"&DATE(YEAR(TODAY()),{next_month},1))"
            )
        else:
            # December: upper bound = Jan 1 next year
            b_formula = (
                f"=SUMIFS('Mileage Log'!$H:$H,"
                f"'Mileage Log'!$A:$A,\">=\"&DATE(YEAR(TODAY()),{month_num},1),"
                f"'Mileage Log'!$A:$A,\"<\"&DATE(YEAR(TODAY())+1,1,1))"
            )
        b_cell = ws.cell(row=i, column=2, value=b_formula)
        apply_style(b_cell, formula_cell_style())
        b_cell.number_format = "0"

        # Col C: deduction
        c_cell = ws.cell(row=i, column=3, value=f"=B{i}*Settings!$B$5")
        apply_style(c_cell, formula_cell_style())
        c_cell.number_format = '"$"#,##0.00'

        # Col D: trip count COUNTIFS
        if month_num < 12:
            d_formula = (
                f"=COUNTIFS('Mileage Log'!$A:$A,\">=\"&DATE(YEAR(TODAY()),{month_num},1),"
                f"'Mileage Log'!$A:$A,\"<\"&DATE(YEAR(TODAY()),{next_month},1))"
            )
        else:
            d_formula = (
                f"=COUNTIFS('Mileage Log'!$A:$A,\">=\"&DATE(YEAR(TODAY()),{month_num},1),"
                f"'Mileage Log'!$A:$A,\"<\"&DATE(YEAR(TODAY())+1,1,1))"
            )
        d_cell = ws.cell(row=i, column=4, value=d_formula)
        apply_style(d_cell, formula_cell_style())

        ws.row_dimensions[i].height = 16

    # Row 18: spacer
    ws.row_dimensions[18].height = 8

    # Row 19: YTD totals
    ytd_gold = PatternFill("solid", fgColor="FFE9B0")
    ytd_font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT)

    a19 = ws.cell(row=19, column=1, value="YTD Total")
    a19.font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_PRIMARY)
    a19.fill = ytd_gold

    b19 = ws.cell(row=19, column=2, value="=SUM(B6:B17)")
    b19.font = ytd_font
    b19.fill = ytd_gold
    b19.number_format = "0"

    c19 = ws.cell(row=19, column=3, value="=SUM(C6:C17)")
    c19.font = ytd_font
    c19.fill = ytd_gold
    c19.number_format = '"$"#,##0.00'

    d19 = ws.cell(row=19, column=4, value="=SUM(D6:D17)")
    d19.font = ytd_font
    d19.fill = ytd_gold

    ws.row_dimensions[19].height = 20

    # Freeze A6
    ws.freeze_panes = "A6"


def build_ytd_tab(wb):
    """Sheet 4 — YTD Dashboard (totals + breakdown by purpose)."""
    ws = wb.create_sheet("YTD Dashboard")
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "YTD Dashboard", "Totals + breakdown by purpose")

    ws.row_dimensions[4].height = 10

    # Col widths: A=32 B=18 C=14
    set_col_widths(ws, [("A", 32), ("B", 18), ("C", 14)])

    bold_font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT)

    # Row 5: YTD Total Miles
    ws.cell(row=5, column=1, value="YTD Total Miles:").font = bold_font
    b5 = ws.cell(row=5, column=2, value="='Monthly Summary'!B19")
    apply_style(b5, formula_cell_style())
    b5.number_format = "0"
    ws.row_dimensions[5].height = 16

    # Row 6: YTD Total Deduction
    ws.cell(row=6, column=1, value="YTD Total Deduction ($):").font = bold_font
    b6 = ws.cell(row=6, column=2, value="='Monthly Summary'!C19")
    apply_style(b6, formula_cell_style())
    b6.number_format = '"$"#,##0.00'
    ws.row_dimensions[6].height = 16

    # Row 7: YTD Trips
    ws.cell(row=7, column=1, value="YTD Trips:").font = bold_font
    b7 = ws.cell(row=7, column=2, value="='Monthly Summary'!D19")
    apply_style(b7, formula_cell_style())
    ws.row_dimensions[7].height = 16

    # Row 8: spacer
    ws.row_dimensions[8].height = 10

    # Row 9: "Miles by Business Purpose" section header
    hdr9 = ws.cell(row=9, column=1, value="Miles by Business Purpose")
    hdr9.font = Font(name=FONT_HEAD, size=13, bold=True, color=COLOR_PRIMARY)
    ws.row_dimensions[9].height = 20

    # Row 10: column headers
    for col, h in enumerate(["Purpose", "Miles", "$"], start=1):
        cell = ws.cell(row=10, column=col, value=h)
        apply_style(cell, header_row_style())
    ws.row_dimensions[10].height = 18

    # Rows 11-17: one per purpose
    for idx, purpose in enumerate(PURPOSES, start=11):
        ws.cell(row=idx, column=1, value=purpose).font = Font(
            name=FONT_BODY, size=11, color=COLOR_TEXT
        )

        b_cell = ws.cell(
            row=idx, column=2,
            value=f"=SUMIFS('Mileage Log'!$H:$H,'Mileage Log'!$D:$D,A{idx})",
        )
        apply_style(b_cell, formula_cell_style())
        b_cell.number_format = "0"

        c_cell = ws.cell(row=idx, column=3, value=f"=B{idx}*Settings!$B$5")
        apply_style(c_cell, formula_cell_style())
        c_cell.number_format = '"$"#,##0.00'

        ws.row_dimensions[idx].height = 16


def build_settings_tab(wb):
    """Sheet 5 — Settings (IRS rate + dropdown source lists)."""
    ws = wb.create_sheet("Settings")
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "Settings", "IRS rate + dropdowns sources")

    ws.row_dimensions[4].height = 10

    # Col widths: 28/14/6/18/22/6/26
    set_col_widths(ws, [
        ("A", 28), ("B", 14), ("C", 6), ("D", 18),
        ("E", 22), ("F", 6), ("G", 26),
    ])

    bold_right = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT)

    # Row 5: IRS rate label + input cell
    a5 = ws.cell(row=5, column=1, value="IRS Rate (per mile, business):")
    a5.font = bold_right
    a5.alignment = Alignment(horizontal="right", vertical="center")

    b5 = ws.cell(row=5, column=2, value=IRS_RATE_2026)
    apply_style(b5, input_cell_style())
    b5.number_format = '"$"0.000'
    ws.row_dimensions[5].height = 18

    # Row 6: spacer
    ws.row_dimensions[6].height = 8

    # Row 7: historical rates header
    hist_hdr = ws.cell(row=7, column=1, value="Historical rates for reference:")
    hist_hdr.font = Font(name=FONT_BODY, size=11, italic=True, color=COLOR_MUTED)
    ws.row_dimensions[7].height = 16

    # Row 8: 2023 rate
    ws.cell(row=8, column=1, value="2023:").font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
    r8 = ws.cell(row=8, column=2, value=0.655)
    r8.number_format = '"$"0.000'
    r8.font = Font(name=FONT_BODY, size=11, color=COLOR_MUTED)
    ws.row_dimensions[8].height = 16

    # Row 9: 2024 rate
    ws.cell(row=9, column=1, value="2024:").font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
    r9 = ws.cell(row=9, column=2, value=0.67)
    r9.number_format = '"$"0.000'
    r9.font = Font(name=FONT_BODY, size=11, color=COLOR_MUTED)
    ws.row_dimensions[9].height = 16

    # Row 10: 2025 rate + column headers for lists
    ws.cell(row=10, column=1, value="2025:").font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
    r10 = ws.cell(row=10, column=2, value=0.70)
    r10.number_format = '"$"0.000'
    r10.font = Font(name=FONT_BODY, size=11, color=COLOR_MUTED)
    ws.row_dimensions[10].height = 16

    # Col E header: "Property list"
    e10 = ws.cell(row=10, column=5, value="Property list")
    e10.font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_PRIMARY)

    # Col G header: "Purpose list"
    g10 = ws.cell(row=10, column=7, value="Purpose list")
    g10.font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_PRIMARY)

    # Rows 11+: property list in col E
    for idx, prop in enumerate(PROPERTIES, start=11):
        cell = ws.cell(row=idx, column=5, value=prop)
        apply_style(cell, input_cell_style())
        ws.row_dimensions[idx].height = 16

    # Rows 11+: purpose list in col G
    for idx, purpose in enumerate(PURPOSES, start=11):
        cell = ws.cell(row=idx, column=7, value=purpose)
        apply_style(cell, input_cell_style())
        ws.row_dimensions[idx].height = 16


def main():
    wb = Workbook()
    build_welcome_tab(wb)
    build_log_tab(wb)
    build_monthly_tab(wb)
    build_ytd_tab(wb)
    build_settings_tab(wb)

    wb.properties.title = "STR Mileage Log \u2014 The STR Ledger"
    wb.properties.creator = "The STR Ledger"
    wb.properties.company = "The STR Ledger"
    wb.properties.description = "IRS-compliant mileage log for STR hosts (Schedule C/E)."

    OUT.parent.mkdir(parents=True, exist_ok=True)
    wb.save(OUT)
    print(f"Saved: {OUT}")


if __name__ == "__main__":
    main()
