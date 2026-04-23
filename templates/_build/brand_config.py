"""Shared brand config for The STR Ledger Excel templates.

Colors, fonts, and helper functions used across all product builds.
Single source of truth — if brand palette changes, update here only.
"""
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side, NamedStyle
from openpyxl.utils import get_column_letter

# --- Brand palette (from brand/brand-decisions.md) ---
BRAND_NAME = "The STR Ledger"
BRAND_DOMAIN = "thestrledger.com"
BRAND_EMAIL = "hello@thestrledger.com"

# Primary dark navy-blue, secondary warm tan, accent deep green
COLOR_PRIMARY = "0E2A47"      # navy
COLOR_SECONDARY = "C9A875"    # warm tan
COLOR_ACCENT = "2E6B4F"       # deep green
COLOR_TEXT = "1C1C1C"         # near-black
COLOR_MUTED = "6B7280"        # slate gray
COLOR_BG_LIGHT = "F7F4EE"     # cream
COLOR_ERROR = "B91C1C"        # red (for over-threshold warnings)

# --- Fonts ---
FONT_HEAD = "Georgia"         # serif for headings
FONT_BODY = "Calibri"         # sans for body (default Excel-safe)
FONT_MONO = "Consolas"

# --- Helper: apply branding to a worksheet ---
def apply_brand_header(ws, title, subtitle=""):
    """Place a branded title block on rows 1-3 of the worksheet."""
    ws["A1"] = title
    ws["A1"].font = Font(name=FONT_HEAD, size=20, bold=True, color=COLOR_PRIMARY)
    ws["A2"] = subtitle
    ws["A2"].font = Font(name=FONT_BODY, size=11, italic=True, color=COLOR_MUTED)
    ws["A3"] = f"{BRAND_NAME} · {BRAND_DOMAIN}"
    ws["A3"].font = Font(name=FONT_BODY, size=9, color=COLOR_MUTED)
    ws.row_dimensions[1].height = 28
    ws.row_dimensions[2].height = 18
    ws.row_dimensions[3].height = 14

def header_row_style():
    return {
        "font": Font(name=FONT_BODY, size=11, bold=True, color="FFFFFF"),
        "fill": PatternFill("solid", fgColor=COLOR_PRIMARY),
        "alignment": Alignment(horizontal="center", vertical="center"),
        "border": Border(
            left=Side(style="thin", color=COLOR_PRIMARY),
            right=Side(style="thin", color=COLOR_PRIMARY),
            top=Side(style="thin", color=COLOR_PRIMARY),
            bottom=Side(style="thin", color=COLOR_PRIMARY),
        ),
    }

def input_cell_style():
    """Yellow-tinted fill indicates a cell the user should edit."""
    return {
        "fill": PatternFill("solid", fgColor="FFF7D6"),
        "font": Font(name=FONT_BODY, size=11, color=COLOR_TEXT),
        "alignment": Alignment(horizontal="left", vertical="center"),
    }

def formula_cell_style():
    """Gray-tinted fill indicates a calculated cell (do not edit)."""
    return {
        "fill": PatternFill("solid", fgColor="EDEDED"),
        "font": Font(name=FONT_BODY, size=11, color=COLOR_TEXT, italic=True),
        "alignment": Alignment(horizontal="right", vertical="center"),
    }

def set_col_widths(ws, widths):
    """widths is a list of (col_letter_or_int, width) pairs.

    Accepts either a column letter ("A") or a 1-based integer index.
    """
    for col, w in widths:
        if isinstance(col, int):
            col = get_column_letter(col)
        ws.column_dimensions[col].width = w

def apply_style(cell, style_dict):
    """Apply a style dict (returned by the *_style() helpers below) to a cell.

    Callers: apply_style(ws.cell(row=5, column=1), input_cell_style())
    """
    for attr, value in style_dict.items():
        setattr(cell, attr, value)

def add_upgrade_banner(ws, row):
    """Place a prominent upgrade CTA on the given row."""
    cell = ws.cell(row=row, column=1, value=(
        f"💡 Upgrade to the Full version at {BRAND_DOMAIN}/upgrade "
        f"— multi-property, depreciation, multi-LLC support."
    ))
    cell.font = Font(name=FONT_BODY, size=11, bold=True, color="FFFFFF")
    cell.fill = PatternFill("solid", fgColor=COLOR_ACCENT)
    cell.alignment = Alignment(
        horizontal="center", vertical="center", wrap_text=True
    )
    ws.row_dimensions[row].height = 30
