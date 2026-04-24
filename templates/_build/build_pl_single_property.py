"""Build TAX-002 Single-Property P&L Tracker Excel files.

Generates BOTH Lite (Etsy) and Full (Gumroad) variants from shared code.
Per spec: Lite and Full share 7-tab structure at MVP; difference is Welcome-
tab upgrade-banner emphasis + filename.

Implements templates/_briefs/TAX-002-pl-single-property-spec.md.
"""
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.formatting.rule import CellIsRule
from openpyxl.worksheet.datavalidation import DataValidation

from brand_config import (
    COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT,
    COLOR_MUTED, COLOR_BG_LIGHT, COLOR_ERROR,
    FONT_HEAD, FONT_BODY, FONT_MONO,
    apply_brand_header, input_cell_style, formula_cell_style,
    header_row_style, set_col_widths, add_upgrade_banner, apply_style,
    BRAND_DOMAIN,
)

BASE = Path(__file__).resolve().parent.parent
LITE_OUT = BASE / "_lite" / "TAX-002-pl-single-property-lite.xlsx"
FULL_OUT = BASE / "_masters" / "TAX-002-pl-single-property.xlsx"

# --- 17 Schedule E expense categories ---

EXPENSE_CATEGORIES = [
    "Advertising (Line 6)",
    "Auto/travel (Line 7)",
    "Cleaning + maintenance (Line 8)",
    "Commissions (Line 9)",
    "Insurance (Line 10)",
    "Legal + professional (Line 11)",
    "Management fees (Line 12)",
    "Mortgage interest (Line 13)",
    "Other interest (Line 14)",
    "Repairs (Line 15)",
    "Supplies (Line 16)",
    "Taxes (Line 17)",
    "Utilities (Line 18)",
    "Wages (Line 19)",
    "Other — Platform fees (Line 19)",
    "Other — Misc (Line 19)",
    "Depreciation (Line 20) — see note",
]

BOOKING_CHANNELS = ["Airbnb", "VRBO", "Booking.com", "Direct", "Other"]

# 10 sample bookings Jan-Mar 2026
SAMPLE_REVENUE = [
    ("2026-01-08", "Airbnb guest #A1092",       "Airbnb", 2400, 240, 210, "4 nights"),
    ("2026-01-22", "Airbnb guest #A1098",       "Airbnb", 1800, 180, 210, "3 nights"),
    ("2026-02-05", "VRBO guest #V4455",         "VRBO",   2100, 180, 210, "3 nights"),
    ("2026-02-14", "Airbnb guest #A1112",       "Airbnb", 2800, 280, 210, "Valentine's week"),
    ("2026-02-27", "Direct booking — Thompson", "Direct", 2200,   0, 210, "Returning guest"),
    ("2026-03-07", "Airbnb guest #A1135",       "Airbnb", 1900, 190, 210, ""),
    ("2026-03-14", "Airbnb guest #A1140",       "Airbnb", 2100, 210, 210, "St Patrick's weekend"),
    ("2026-03-20", "VRBO guest #V4488",         "VRBO",   1800, 160, 210, ""),
    ("2026-03-25", "Airbnb guest #A1147",       "Airbnb", 1600, 160, 210, ""),
    ("2026-03-30", "Direct booking — Miller",   "Direct", 1800,   0, 210, "Month-end"),
]

# 23 sample expenses
SAMPLE_EXPENSES = [
    # 8 cleanings
    ("2026-01-15", "Smokies Clean",       EXPENSE_CATEGORIES[2],  450, "Venmo",       "Yes", "Turnover"),
    ("2026-01-25", "Smokies Clean",       EXPENSE_CATEGORIES[2],  450, "Venmo",       "Yes", "Turnover"),
    ("2026-02-08", "Smokies Clean",       EXPENSE_CATEGORIES[2],  450, "Venmo",       "Yes", "Turnover"),
    ("2026-02-17", "Smokies Clean",       EXPENSE_CATEGORIES[2],  450, "Venmo",       "Yes", "Turnover"),
    ("2026-03-02", "Smokies Clean",       EXPENSE_CATEGORIES[2],  450, "Venmo",       "Yes", "Turnover"),
    ("2026-03-10", "Smokies Clean",       EXPENSE_CATEGORIES[2],  450, "Venmo",       "Yes", "Turnover"),
    ("2026-03-17", "Smokies Clean",       EXPENSE_CATEGORIES[2],  450, "Venmo",       "Yes", "Turnover"),
    ("2026-03-28", "Smokies Clean",       EXPENSE_CATEGORIES[2],  450, "Venmo",       "Yes", "Turnover"),
    # 3 supplies
    ("2026-01-02", "Home Depot",          EXPENSE_CATEGORIES[10], 120, "Credit Card", "Yes", "Supplies restock"),
    ("2026-02-14", "Costco",              EXPENSE_CATEGORIES[10], 180, "Credit Card", "Yes", "Bulk supplies"),
    ("2026-03-08", "Target",              EXPENSE_CATEGORIES[10], 120, "Credit Card", "Yes", "Linens replacement"),
    # 3 mortgage interest
    ("2026-01-01", "Wells Fargo",         EXPENSE_CATEGORIES[7],  400, "ACH",         "Yes", "Jan mortgage int"),
    ("2026-02-01", "Wells Fargo",         EXPENSE_CATEGORIES[7],  400, "ACH",         "Yes", "Feb mortgage int"),
    ("2026-03-01", "Wells Fargo",         EXPENSE_CATEGORIES[7],  400, "ACH",         "Yes", "Mar mortgage int"),
    # utilities: 1 internet + 2 electric
    ("2026-01-15", "Spectrum",            EXPENSE_CATEGORIES[12],  90, "ACH",         "Yes", "Internet"),
    ("2026-01-20", "Sevier Electric",     EXPENSE_CATEGORIES[12], 120, "ACH",         "Yes", "Jan utilities"),
    ("2026-02-20", "Sevier Electric",     EXPENSE_CATEGORIES[12], 140, "ACH",         "Yes", "Feb utilities"),
    # 1 repair
    ("2026-02-15", "Quick Plumbing",      EXPENSE_CATEGORIES[9],  800, "Check",       "Yes", "Emergency leak"),
    # 5 platform fees
    ("2026-01-10", "Airbnb Platform Fee", EXPENSE_CATEGORIES[14], 240, "Auto-deduct", "Yes", "Host fees"),
    ("2026-02-10", "Airbnb Platform Fee", EXPENSE_CATEGORIES[14], 460, "Auto-deduct", "Yes", "Host fees"),
    ("2026-03-10", "Airbnb Platform Fee", EXPENSE_CATEGORIES[14], 560, "Auto-deduct", "Yes", "Host fees"),
    ("2026-02-10", "VRBO Platform Fee",   EXPENSE_CATEGORIES[14], 180, "Auto-deduct", "Yes", ""),
    ("2026-03-20", "VRBO Platform Fee",   EXPENSE_CATEGORIES[14], 160, "Auto-deduct", "Yes", ""),
]


def add_dropdown(ws, cell_range, formula1):
    dv = DataValidation(type="list", formula1=formula1, allow_blank=True)
    dv.add(cell_range)
    ws.add_data_validation(dv)


# ---------------------------------------------------------------------------
# Sheet builders
# ---------------------------------------------------------------------------

def build_welcome_tab(wb, is_lite):
    """Sheet 1 — Welcome (cover + Schedule E intro + how-to steps)."""
    ws = wb.active
    ws.title = "Welcome"
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    title_suffix = " (Lite)" if is_lite else ""
    apply_brand_header(
        ws,
        f"Single-Property P&L Tracker{title_suffix}",
        "Close your year before April does.",
    )

    ws.row_dimensions[4].height = 10

    # Row 5: Schedule E header
    hdr5 = ws.cell(row=5, column=1, value="How this maps to IRS Schedule E")
    hdr5.font = Font(name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    ws.row_dimensions[5].height = 22

    # Row 6: Schedule E intro paragraph
    para6 = ws.cell(
        row=6, column=1,
        value=(
            "Expense categories on the Expense Log match Schedule E Part I line numbers (5-20). "
            "The Schedule E Summary tab rolls up YTD totals ready for your CPA to copy into the form. "
            "Reference: IRS Publication 527 (Residential Rental Property)."
        ),
    )
    para6.font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
    para6.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    ws.row_dimensions[6].height = 50

    # Row 7-8: spacers
    ws.row_dimensions[7].height = 8
    ws.row_dimensions[8].height = 8

    # Row 9: How to use header
    hdr9 = ws.cell(row=9, column=1, value="How to use")
    hdr9.font = Font(name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    ws.row_dimensions[9].height = 22

    # Rows 10-15: 6 how-to steps
    steps = [
        (10, "1. Property Info tab: fill in your property details (address, purchase price, loan info)."),
        (11, "2. Revenue Log tab: log every booking — date, guest, channel, gross amount, fees."),
        (12, "3. Expense Log tab: enter every expense and pick the Schedule E category from the dropdown."),
        (13, "4. Monthly P&L tab: automatic SUMIFS roll-up by month — no manual math required."),
        (14, "5. Schedule E Summary tab: YTD totals mapped to IRS line numbers — share with your CPA."),
        (15, "6. Settings tab: verify the expense category list matches Schedule E Part I lines 6-20."),
    ]
    for row_num, text in steps:
        cell = ws.cell(row=row_num, column=1, value=text)
        cell.font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
        cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        ws.row_dimensions[row_num].height = 20

    # Rows 16-17: spacers
    ws.row_dimensions[16].height = 8
    ws.row_dimensions[17].height = 8

    # Row 18: depreciation note (italic muted)
    note18 = ws.cell(
        row=18, column=1,
        value=(
            "Note: Schedule E Line 20 (Depreciation) — type your YTD depreciation number directly on the "
            "Schedule E Summary tab. This Lite version doesn't include a depreciation calculator; for "
            "5/7/15/27.5/39-yr depreciation by asset, see the Portfolio Bundle."
        ),
    )
    note18.font = Font(name=FONT_BODY, size=10, italic=True, color=COLOR_MUTED)
    note18.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    ws.row_dimensions[18].height = 36

    # Row 19: spacer
    ws.row_dimensions[19].height = 8

    # Row 20: upgrade banner — differs by is_lite
    if is_lite:
        banner_text = (
            f"\U0001f4a1 Upgrade: Multi-Property P&L Master + depreciation by asset + LLC consolidation "
            f"— {BRAND_DOMAIN}/portfolio-master ($97) \u00b7 included in Portfolio Bundle ($397)."
        )
    else:
        banner_text = (
            f"\U0001f4a1 Get the Portfolio Bundle at {BRAND_DOMAIN}/portfolio-bundle "
            f"— 32 templates for multi-property hosts, $397 instead of $900."
        )

    banner = ws.cell(row=20, column=1, value=banner_text)
    banner.font = Font(name=FONT_BODY, size=11, bold=True, color="FFFFFF")
    banner.fill = PatternFill("solid", fgColor=COLOR_ACCENT)
    banner.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    ws.row_dimensions[20].height = 50

    # Col A width + freeze
    set_col_widths(ws, [("A", 95)])
    ws.freeze_panes = "A5"


def build_property_info_tab(wb):
    """Sheet 2 — Property Info (12 labeled input rows)."""
    ws = wb.create_sheet("Property Info")
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "Property Info", "Enter your rental property details.")

    ws.row_dimensions[4].height = 10

    set_col_widths(ws, [("A", 28), ("B", 40)])

    bold_right = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT)
    right_align = Alignment(horizontal="right", vertical="center")

    # (row, label, sample_value, number_format_or_None)
    rows_data = [
        (5,  "Property name:",        "Smokies Ridge Cabin",  None),
        (6,  "Street address:",       "123 Mountain Lane",    None),
        (7,  "City / State / Zip:",   "Gatlinburg, TN 37738", None),
        (8,  "Property type:",        "Cabin",                None),
        (9,  "Purchase date:",        "2023-08-15",           "yyyy-mm-dd"),
        (10, "Purchase price ($):",   420000,                 '"$"#,##0'),
        (11, "Closing costs ($):",    8500,                   '"$"#,##0'),
        (12, "Loan amount ($):",      336000,                 '"$"#,##0'),
        (13, "Interest rate (%):",    0.0675,                 "0.000%"),
        (14, "Loan term (years):",    30,                     None),
        (15, "Business start date:",  "2023-10-01",           "yyyy-mm-dd"),
        (16, "Days rented YTD 2026:", 72,                     None),
    ]

    for row_num, label, value, fmt in rows_data:
        a = ws.cell(row=row_num, column=1, value=label)
        a.font = bold_right
        a.alignment = right_align
        ws.row_dimensions[row_num].height = 18

        b = ws.cell(row=row_num, column=2, value=value)
        apply_style(b, input_cell_style())
        if fmt:
            b.number_format = fmt


def build_revenue_log(wb):
    """Sheet 3 — Revenue Log (10 sample bookings + 1000-row capacity)."""
    ws = wb.create_sheet("Revenue Log")
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "Revenue Log", "Log every booking — date, guest, channel, gross, fees.")

    ws.row_dimensions[4].height = 10

    set_col_widths(ws, [
        ("A", 12), ("B", 28), ("C", 14), ("D", 12),
        ("E", 12), ("F", 14), ("G", 12), ("H", 28),
    ])

    # Row 5: styled headers
    headers = [
        "Date", "Guest / Source", "Channel", "Gross",
        "Platform Fee", "Cleaning Collected", "Net", "Notes",
    ]
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        apply_style(cell, header_row_style())
    ws.row_dimensions[5].height = 20

    # Rows 6-15: sample revenue data
    for i, r in enumerate(SAMPLE_REVENUE, start=6):
        date_val, guest, channel, gross, platform_fee, cleaning, notes = r

        a = ws.cell(row=i, column=1, value=date_val)
        apply_style(a, input_cell_style())
        a.number_format = "yyyy-mm-dd"

        b = ws.cell(row=i, column=2, value=guest)
        apply_style(b, input_cell_style())

        c = ws.cell(row=i, column=3, value=channel)
        apply_style(c, input_cell_style())

        d = ws.cell(row=i, column=4, value=gross)
        apply_style(d, input_cell_style())
        d.number_format = '"$"#,##0.00'

        e = ws.cell(row=i, column=5, value=platform_fee)
        apply_style(e, input_cell_style())
        e.number_format = '"$"#,##0.00'

        f = ws.cell(row=i, column=6, value=cleaning)
        apply_style(f, input_cell_style())
        f.number_format = '"$"#,##0.00'

        # Col G: Net formula
        g = ws.cell(row=i, column=7, value=f"=D{i}-E{i}")
        apply_style(g, formula_cell_style())
        g.number_format = '"$"#,##0.00'

        h = ws.cell(row=i, column=8, value=notes if notes else None)
        apply_style(h, input_cell_style())

        ws.row_dimensions[i].height = 16

    # Blank capacity rows 16-1005
    last_data_row = len(SAMPLE_REVENUE) + 5
    for row_idx in range(last_data_row + 1, 1006):
        for col_idx in range(1, 9):
            cell = ws.cell(row=row_idx, column=col_idx)
            apply_style(cell, input_cell_style())
            if col_idx == 1:
                cell.number_format = "yyyy-mm-dd"
            if col_idx in (4, 5, 6):
                cell.number_format = '"$"#,##0.00'
        # Net formula for capacity rows
        g = ws.cell(row=row_idx, column=7, value=f"=D{row_idx}-E{row_idx}")
        apply_style(g, formula_cell_style())
        g.number_format = '"$"#,##0.00'

    # Channel dropdown C6:C1005
    add_dropdown(ws, "C6:C1005", '"Airbnb,VRBO,Booking.com,Direct,Other"')

    ws.freeze_panes = "A6"


def build_expense_log(wb):
    """Sheet 4 — Expense Log (23 sample expenses + 2000-row capacity)."""
    ws = wb.create_sheet("Expense Log")
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "Expense Log", "Enter every expense with the matching Schedule E category.")

    ws.row_dimensions[4].height = 10

    set_col_widths(ws, [
        ("A", 12), ("B", 24), ("C", 38), ("D", 12),
        ("E", 16), ("F", 10), ("G", 28),
    ])

    # Row 5: styled headers
    headers = [
        "Date", "Vendor", "Category (Schedule E line)",
        "Amount", "Payment Method", "Receipt?", "Notes",
    ]
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        apply_style(cell, header_row_style())
    ws.row_dimensions[5].height = 20

    # Rows 6-28: sample expense data
    for i, e in enumerate(SAMPLE_EXPENSES, start=6):
        date_val, vendor, category, amount, method, receipt, notes = e

        a = ws.cell(row=i, column=1, value=date_val)
        apply_style(a, input_cell_style())
        a.number_format = "yyyy-mm-dd"

        b = ws.cell(row=i, column=2, value=vendor)
        apply_style(b, input_cell_style())

        c = ws.cell(row=i, column=3, value=category)
        apply_style(c, input_cell_style())

        d = ws.cell(row=i, column=4, value=amount)
        apply_style(d, input_cell_style())
        d.number_format = '"$"#,##0.00'

        e_cell = ws.cell(row=i, column=5, value=method)
        apply_style(e_cell, input_cell_style())

        f = ws.cell(row=i, column=6, value=receipt)
        apply_style(f, input_cell_style())

        g = ws.cell(row=i, column=7, value=notes if notes else None)
        apply_style(g, input_cell_style())

        ws.row_dimensions[i].height = 16

    # Blank capacity rows 29-2005
    last_data_row = len(SAMPLE_EXPENSES) + 5
    for row_idx in range(last_data_row + 1, 2006):
        for col_idx in range(1, 8):
            cell = ws.cell(row=row_idx, column=col_idx)
            apply_style(cell, input_cell_style())
            if col_idx == 1:
                cell.number_format = "yyyy-mm-dd"
            if col_idx == 4:
                cell.number_format = '"$"#,##0.00'

    # Dropdowns
    add_dropdown(ws, "C6:C2005", "=Settings!$A$15:$A$31")
    add_dropdown(ws, "E6:E2005", '"Venmo,Zelle,Check,Cash,ACH,Credit Card,Auto-deduct,Other"')
    add_dropdown(ws, "F6:F2005", '"Yes,No"')

    ws.freeze_panes = "A6"


def build_monthly_pl(wb):
    """Sheet 5 — Monthly P&L (SUMIFS grids, 17 expense category rows)."""
    ws = wb.create_sheet("Monthly P&L")
    ws.sheet_properties.tabColor = COLOR_ACCENT

    apply_brand_header(ws, "Monthly P&L", "Automatic monthly roll-up — no manual math required.")

    ws.row_dimensions[4].height = 10

    # Col widths: A=38, B-M=10, N=12
    col_widths = [("A", 38)] + [(chr(ord("B") + i), 10) for i in range(12)] + [("N", 12)]
    set_col_widths(ws, col_widths)

    # Row 5: styled headers
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    headers = ["Category"] + month_names + ["YTD"]
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        apply_style(cell, header_row_style())
    ws.row_dimensions[5].height = 20

    # Row 6: spacer
    ws.row_dimensions[6].height = 8

    # Row 7: Revenue — "Rents + cleaning fees collected"
    rev_label = ws.cell(row=7, column=1, value="Rents + cleaning fees collected")
    rev_label.font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_PRIMARY)
    rev_label.alignment = Alignment(horizontal="left", vertical="center")
    ws.row_dimensions[7].height = 18

    for m in range(1, 13):
        col = m + 1  # B=2 for Jan, M=13 for Dec
        if m < 12:
            end_month = m + 1
            end_year_expr = "YEAR(TODAY())"
        else:
            # December: end = Jan next year; simplest: DATE(YEAR(TODAY())+1,1,1)
            end_month = 1
            end_year_expr = "YEAR(TODAY())+1"

        formula = (
            f"=SUMIFS('Revenue Log'!$D:$D,"
            f"'Revenue Log'!$A:$A,\">=\"&DATE(YEAR(TODAY()),{m},1),"
            f"'Revenue Log'!$A:$A,\"<\"&DATE({end_year_expr},{end_month},1))"
            f"+SUMIFS('Revenue Log'!$F:$F,"
            f"'Revenue Log'!$A:$A,\">=\"&DATE(YEAR(TODAY()),{m},1),"
            f"'Revenue Log'!$A:$A,\"<\"&DATE({end_year_expr},{end_month},1))"
        )
        cell = ws.cell(row=7, column=col, value=formula)
        apply_style(cell, formula_cell_style())
        cell.number_format = '"$"#,##0'

    # YTD for revenue
    ytd_rev = ws.cell(row=7, column=14, value="=SUM(B7:M7)")
    apply_style(ytd_rev, formula_cell_style())
    ytd_rev.number_format = '"$"#,##0'
    ytd_rev.font = Font(name=FONT_BODY, size=11, bold=True, italic=True, color=COLOR_PRIMARY)

    # Row 8: spacer
    ws.row_dimensions[8].height = 8

    # Row 9: EXPENSES header
    exp_hdr = ws.cell(row=9, column=1, value="EXPENSES")
    exp_hdr.font = Font(name=FONT_HEAD, size=12, bold=True, color=COLOR_PRIMARY)
    ws.row_dimensions[9].height = 20

    # Rows 10-26: one row per expense category
    for idx, cat in enumerate(EXPENSE_CATEGORIES):
        row = 10 + idx
        # Col A: category label
        a = ws.cell(row=row, column=1, value=cat)
        a.font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
        a.alignment = Alignment(horizontal="left", vertical="center")
        ws.row_dimensions[row].height = 16

        for m in range(1, 13):
            col = m + 1
            if m < 12:
                end_month = m + 1
                end_year_expr = "YEAR(TODAY())"
            else:
                end_month = 1
                end_year_expr = "YEAR(TODAY())+1"

            formula = (
                f"=SUMIFS('Expense Log'!$D:$D,"
                f"'Expense Log'!$A:$A,\">=\"&DATE(YEAR(TODAY()),{m},1),"
                f"'Expense Log'!$A:$A,\"<\"&DATE({end_year_expr},{end_month},1),"
                f"'Expense Log'!$C:$C,A{row})"
            )
            cell = ws.cell(row=row, column=col, value=formula)
            apply_style(cell, formula_cell_style())
            cell.number_format = '"$"#,##0'

        # Col N: YTD sum
        ytd = ws.cell(row=row, column=14, value=f"=SUM(B{row}:M{row})")
        apply_style(ytd, formula_cell_style())
        ytd.number_format = '"$"#,##0'

    last_exp_row = 10 + len(EXPENSE_CATEGORIES) - 1  # = 26
    tot_row = last_exp_row + 2                         # = 28

    # Row 27: spacer
    ws.row_dimensions[last_exp_row + 1].height = 8

    # Row 28: TOTAL EXPENSES
    from openpyxl.utils import get_column_letter
    tot_label = ws.cell(row=tot_row, column=1, value="TOTAL EXPENSES")
    tot_label.font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_ERROR)
    tot_label.alignment = Alignment(horizontal="left", vertical="center")
    ws.row_dimensions[tot_row].height = 20

    for col in range(2, 15):  # B=2 through N=14
        col_letter = get_column_letter(col)
        cell = ws.cell(row=tot_row, column=col, value=f"=SUM({col_letter}10:{col_letter}26)")
        apply_style(cell, formula_cell_style())
        cell.number_format = '"$"#,##0'
        cell.font = Font(name=FONT_BODY, size=11, bold=True, italic=True, color=COLOR_ERROR)

    net_row = tot_row + 2  # = 30

    # Row 29: spacer
    ws.row_dimensions[tot_row + 1].height = 8

    # Row 30: NET INCOME (LOSS)
    net_label = ws.cell(row=net_row, column=1, value="NET INCOME (LOSS)")
    net_label.font = Font(name=FONT_HEAD, size=13, bold=True, color=COLOR_PRIMARY)
    net_label.alignment = Alignment(horizontal="left", vertical="center")
    ws.row_dimensions[net_row].height = 22

    for col in range(2, 15):  # B through N
        col_letter = get_column_letter(col)
        cell = ws.cell(row=net_row, column=col, value=f"={col_letter}7-{col_letter}{tot_row}")
        apply_style(cell, formula_cell_style())
        cell.number_format = '"$"#,##0'
        cell.font = Font(name=FONT_BODY, size=11, bold=True, italic=True, color=COLOR_PRIMARY)

    # Conditional formatting on net row B30:N30
    ws.conditional_formatting.add(
        f"B{net_row}:N{net_row}",
        CellIsRule(
            operator="lessThan",
            formula=["0"],
            fill=PatternFill("solid", fgColor="FFCCCC"),
        ),
    )
    ws.conditional_formatting.add(
        f"B{net_row}:N{net_row}",
        CellIsRule(
            operator="greaterThan",
            formula=["0"],
            fill=PatternFill("solid", fgColor="C7EFCF"),
        ),
    )

    ws.freeze_panes = "B6"


def build_schedule_e_summary(wb):
    """Sheet 6 — Schedule E Summary (IRS line-mapped YTD totals)."""
    ws = wb.create_sheet("Schedule E Summary")
    ws.sheet_properties.tabColor = COLOR_ACCENT

    apply_brand_header(ws, "Schedule E Summary", "IRS Part I line-number-mapped totals — share with your CPA.")

    ws.row_dimensions[4].height = 10

    set_col_widths(ws, [("A", 50), ("B", 16)])

    bold_body = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT)
    right_align = Alignment(horizontal="right", vertical="center")
    left_align = Alignment(horizontal="left", vertical="center")

    # Row 5: Tax Year
    a5 = ws.cell(row=5, column=1, value="Tax Year:")
    a5.font = bold_body
    a5.alignment = left_align
    b5 = ws.cell(row=5, column=2, value="=YEAR(TODAY())")
    apply_style(b5, formula_cell_style())
    ws.row_dimensions[5].height = 18

    # Row 6: Property
    a6 = ws.cell(row=6, column=1, value="Property:")
    a6.font = bold_body
    a6.alignment = left_align
    b6 = ws.cell(row=6, column=2, value="='Property Info'!B5")
    apply_style(b6, formula_cell_style())
    ws.row_dimensions[6].height = 18

    # Row 7: spacer
    ws.row_dimensions[7].height = 8

    # Row 8: Line 3 — Rents received
    a8 = ws.cell(row=8, column=1, value="Line 3 — Rents received")
    a8.font = bold_body
    a8.alignment = left_align
    b8 = ws.cell(row=8, column=2, value="='Monthly P&L'!N7")
    apply_style(b8, formula_cell_style())
    b8.number_format = '"$"#,##0'
    b8.font = Font(name=FONT_BODY, size=11, bold=True, italic=True, color=COLOR_TEXT)
    ws.row_dimensions[8].height = 18

    # Row 9: Line 4 — Royalties (0)
    a9 = ws.cell(row=9, column=1, value="Line 4 — Royalties")
    a9.font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
    a9.alignment = left_align
    b9 = ws.cell(row=9, column=2, value=0)
    apply_style(b9, input_cell_style())
    b9.number_format = '"$"#,##0'
    ws.row_dimensions[9].height = 18

    # Row 10: spacer
    ws.row_dimensions[10].height = 8

    # Row 11: EXPENSES header
    hdr11 = ws.cell(row=11, column=1, value="EXPENSES (Schedule E Part I)")
    hdr11.font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_PRIMARY)
    hdr11.alignment = left_align
    ws.row_dimensions[11].height = 20

    # Rows 12-28: one row per expense category (17 categories)
    for idx, cat in enumerate(EXPENSE_CATEGORIES):
        row = 12 + idx
        monthly_row = 10 + idx  # rows 10-26 on Monthly P&L

        a = ws.cell(row=row, column=1, value=cat)
        a.font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
        a.alignment = left_align

        b = ws.cell(row=row, column=2, value=f"='Monthly P&L'!N{monthly_row}")
        apply_style(b, formula_cell_style())
        b.number_format = '"$"#,##0'
        ws.row_dimensions[row].height = 16

    last_cat_row = 12 + len(EXPENSE_CATEGORIES) - 1  # = 28
    tot_row = last_cat_row + 2                         # = 30

    # Row 29: spacer
    ws.row_dimensions[last_cat_row + 1].height = 8

    # Row 30: Line 26a — Total expenses
    a30 = ws.cell(row=tot_row, column=1, value="Line 26a — Total expenses")
    a30.font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_ERROR)
    a30.alignment = left_align
    b30 = ws.cell(row=tot_row, column=2, value=f"=SUM(B12:B{last_cat_row})")
    apply_style(b30, formula_cell_style())
    b30.number_format = '"$"#,##0'
    b30.font = Font(name=FONT_BODY, size=11, bold=True, italic=True, color=COLOR_ERROR)
    ws.row_dimensions[tot_row].height = 20

    net_row = tot_row + 2  # = 32

    # Row 31: spacer
    ws.row_dimensions[tot_row + 1].height = 8

    # Row 32: Line 26 — Income or (loss)
    a32 = ws.cell(row=net_row, column=1, value="Line 26 — Income or (loss)")
    a32.font = Font(name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    a32.alignment = left_align
    b32 = ws.cell(row=net_row, column=2, value=f"=B8+B9-B{tot_row}")
    apply_style(b32, formula_cell_style())
    b32.number_format = '"$"#,##0'
    b32.font = Font(name=FONT_HEAD, size=14, bold=True, italic=True, color=COLOR_PRIMARY)
    ws.row_dimensions[net_row].height = 26

    # Print area and orientation
    ws.print_area = f"A1:B{net_row + 2}"
    ws.page_setup.orientation = "portrait"


def build_settings_tab(wb):
    """Sheet 7 — Settings (expense category source list + tax reference)."""
    ws = wb.create_sheet("Settings")
    ws.sheet_properties.tabColor = COLOR_SECONDARY

    apply_brand_header(ws, "Settings", "Expense category list and tax reference data.")

    ws.row_dimensions[4].height = 10

    set_col_widths(ws, [("A", 38)])

    bold_right = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_TEXT)
    right_align = Alignment(horizontal="right", vertical="center")

    # Row 5: Tax year label
    a5 = ws.cell(row=5, column=1, value="Tax year:")
    a5.font = bold_right
    a5.alignment = right_align
    ws.row_dimensions[5].height = 18

    # Row 6: Tax year formula
    b6 = ws.cell(row=6, column=1, value="=YEAR(TODAY())")
    apply_style(b6, formula_cell_style())
    ws.row_dimensions[6].height = 18

    # Row 7: spacer
    ws.row_dimensions[7].height = 8

    # Row 8: IRS reference note
    ref8 = ws.cell(
        row=8, column=1,
        value="Reference: IRS Publication 527 — Residential Rental Property",
    )
    ref8.font = Font(name=FONT_BODY, size=10, italic=True, color=COLOR_MUTED)
    ref8.alignment = Alignment(horizontal="left", vertical="center")
    ws.row_dimensions[8].height = 18

    # Row 9: spacer
    ws.row_dimensions[9].height = 8

    # Row 10: Category list header
    hdr10 = ws.cell(
        row=10, column=1,
        value="Expense category list (source for Expense Log dropdown):",
    )
    hdr10.font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_PRIMARY)
    hdr10.alignment = Alignment(horizontal="left", vertical="center")
    ws.row_dimensions[10].height = 18

    # Rows 11-14: spacers
    for r in range(11, 15):
        ws.row_dimensions[r].height = 8

    # Rows 15-31: the 17 expense categories
    for idx, cat in enumerate(EXPENSE_CATEGORIES):
        row = 15 + idx
        cell = ws.cell(row=row, column=1, value=cat)
        cell.font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
        cell.alignment = Alignment(horizontal="left", vertical="center")
        ws.row_dimensions[row].height = 16


# ---------------------------------------------------------------------------
# Main build function (shared by Lite + Full)
# ---------------------------------------------------------------------------

def build_workbook(out_path, is_lite):
    wb = Workbook()
    build_welcome_tab(wb, is_lite=is_lite)
    build_property_info_tab(wb)
    build_revenue_log(wb)
    build_expense_log(wb)
    build_monthly_pl(wb)
    build_schedule_e_summary(wb)
    build_settings_tab(wb)

    suffix = " (Lite)" if is_lite else ""
    wb.properties.title = f"Single-Property P&L Tracker{suffix} — The STR Ledger"
    wb.properties.creator = "The STR Ledger"
    wb.properties.company = "The STR Ledger"
    wb.properties.description = "Single-property P&L with Schedule E category mapping."

    out_path.parent.mkdir(parents=True, exist_ok=True)
    wb.save(out_path)
    print(f"Saved: {out_path}")


def main():
    build_workbook(LITE_OUT, is_lite=True)
    build_workbook(FULL_OUT, is_lite=False)


if __name__ == "__main__":
    main()
