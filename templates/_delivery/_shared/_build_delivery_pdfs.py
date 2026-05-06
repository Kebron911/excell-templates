"""Render branded license + howto PDFs for every SKU.

Both file types share one brand template (header + footer + page styles).
- License PDF: parameterized by SKU code + name. Same body text for every SKU.
  Output: templates/_delivery/<sku>/<sku-prefix>-license.pdf
- Howto PDF: rendered from each SKU's existing howto.md. Markdown body is
  converted to HTML and wrapped in the brand template.
  Output: templates/_delivery/<sku>/<sku-prefix>-howto.pdf

A shared license without SKU-specific header is also rendered to
`templates/_delivery/_shared/license.pdf` for any future SKU not in the
catalog yet.

Re-run any time the brand template or a howto.md changes:
    python templates/_delivery/_shared/_build_delivery_pdfs.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

import markdown as md
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent.parent.parent
DELIVERY = REPO / "templates" / "_delivery"
SHARED = DELIVERY / "_shared"

NAVY = "#12304E"
PARCHMENT = "#F6EFE2"
PARCHMENT_ALT = "#EFE5D0"
GOLD = "#C9A24B"
GOLD_SOFT = "#F2E5C0"
GRAPHITE = "#2B2B2B"
MUTED = "#6B7280"


# Catalog of SKUs that should get license + howto PDFs generated.
# Howto PDFs are produced only when a corresponding howto.md exists.
# Map SKU directory name → (sku_code, display name, file_prefix).
# The file_prefix is the short SKU id used for filename: e.g., "TAX-001".
SKU_CATALOG = [
    # Launch wave
    ("GST-001-welcome-book",                "GST-001", "Airbnb Welcome Book"),
    ("OPS-001-turnover-checklist",          "OPS-001", "Cleaner Turnover Checklist"),
    ("TAX-001-mileage-log",                 "TAX-001", "STR Mileage Log"),
    ("TAX-002-pl-single-property",          "TAX-002", "Single-Property P&L Tracker"),
    ("TAX-003-1099-nec-tracker",            "TAX-003", "1099-NEC Contractor Tracker"),
    # Phase 2
    ("ACQ-001-str-deal-analyzer",           "ACQ-001", "STR Deal Analyzer"),
    ("ACQ-002-cost-to-launch",              "ACQ-002", "Cost-to-Launch Calculator"),
    ("ACQ-003-rental-arbitrage-analyzer",   "ACQ-003", "Rental Arbitrage Analyzer"),
    ("FIN-001-revpar-dashboard",            "FIN-001", "RevPAR · ADR · Occupancy Dashboard"),
    ("MKT-001-listing-seo-audit",           "MKT-001", "Listing SEO Audit"),
    ("REV-001-cleaning-fee-optimizer",      "REV-001", "Cleaning Fee Optimizer"),
    ("STR-001-escape-the-w2-planner",       "STR-001", "Escape the W2 Planner"),
    # TAX block
    ("TAX-004-schedule-e-tax-prep",         "TAX-004", "Schedule E Tax-Prep Workbook"),
    ("TAX-005-quarterly-estimated-tax",     "TAX-005", "Quarterly Estimated Tax Calculator"),
    ("TAX-006-home-office-allocator",       "TAX-006", "Home Office Deduction Allocator"),
    ("TAX-007-per-diem-meal-tracker",       "TAX-007", "Per-Diem Meal Tracker"),
    ("TAX-008-self-employment-tax",         "TAX-008", "Self-Employment Tax Calculator"),
    ("TAX-009-section-179-planner",         "TAX-009", "Section 179 Planner"),
    ("TAX-010-cost-segregation-diy",        "TAX-010", "Cost Segregation DIY Workbook"),
    ("TAX-011-multi-property-master-pl",    "TAX-011", "Multi-Property Master P&L"),
    ("TAX-012-schedule-c-tax-prep",         "TAX-012", "Schedule C Tax Prep — Active STR"),
    ("TAX-013-depreciation-tracker",        "TAX-013", "Depreciation Tracker"),
    # Phase 3 — round out acquisition + operations + first legal beachhead.
    ("ACQ-004-3-property-side-by-side",     "ACQ-004", "3-Property Side-by-Side Comparison"),
    ("ACQ-005-airdna-data-integrator",      "ACQ-005", "AirDNA Data Integrator"),
    ("ACQ-006-rehab-budget-roi",            "ACQ-006", "Rehab Budget + ROI Projection"),
    ("ACQ-007-furniture-setup-budget",      "ACQ-007", "Furniture / Setup Budget"),
    ("ACQ-008-5-year-pro-forma",            "ACQ-008", "5-Year Pro Forma Builder"),
    ("OPS-002-damage-claim-aircover-log",   "OPS-002", "Damage Claim + AirCover Log"),
    ("OPS-003-license-permit-tracker",      "OPS-003", "License / Permit / STR-Reg Tracker"),
    ("OPS-004-cleaning-cost-per-turnover",  "OPS-004", "Cleaning Cost per Turnover Tracker"),
    ("OPS-005-supply-inventory-par-level",  "OPS-005", "Supply Inventory + Par-Level Restock"),
    ("LGL-001-str-license-renewal-calendar", "LGL-001", "STR License Renewal Calendar"),
    # Phase 4 — round out FIN, GST, REV, MKT tiers.
    ("FIN-003-12-month-cash-flow-forecaster", "FIN-003", "12-Month Rolling Cash Flow Forecaster"),
    ("FIN-004-dscr-tracker",                  "FIN-004", "DSCR Tracker"),
    ("FIN-005-yoy-comparison-workbook",       "FIN-005", "Year-Over-Year P&L Comparison"),
    ("GST-002-house-rules-builder",           "GST-002", "House Rules Builder"),
    ("GST-003-pet-policy-document",           "GST-003", "Pet Policy Document"),
    ("REV-002-dynamic-pricing-calculator",    "REV-002", "Dynamic Pricing Calculator"),
    ("REV-003-competitor-rate-tracker",       "REV-003", "Competitor Rate Tracker"),
    ("REV-004-min-night-stay-optimizer",      "REV-004", "Minimum-Night-Stay Optimizer"),
    ("MKT-002-review-response-tracker",       "MKT-002", "Review Response Tracker"),
    ("MKT-003-referral-source-repeat-guest-crm", "MKT-003", "Referral + Repeat Guest CRM"),
    # Phase 5 — round out ACQ, LGL, OPS, PAM, REV, STR tiers.
    ("ACQ-009-brrrr-to-str-refi",          "ACQ-009", "BRRRR-to-STR Refi Math"),
    ("ACQ-010-seller-finance-offer",       "ACQ-010", "Seller-Finance Offer Calculator"),
    ("ACQ-011-1031-exchange-tracker",      "ACQ-011", "1031 Exchange Tracker"),
    ("LGL-002-tot-filing-calendar",        "LGL-002", "Transient Occupancy Tax Filing Calendar"),
    ("OPS-006-maintenance-log-vendor-crm", "OPS-006", "Maintenance Log + Vendor CRM"),
    ("PAM-001-owner-reporting-dashboard",  "PAM-001", "Owner Reporting Dashboard"),
    ("PAM-002-cleaner-crm-payroll",        "PAM-002", "Cleaner CRM + Payroll"),
    ("REV-005-holiday-event-pricing-calendar", "REV-005", "Holiday + Event Pricing Calendar"),
    ("STR-002-portfolio-valuation-model",  "STR-002", "Portfolio Valuation Model"),
    ("STR-003-refi-or-sell-decision-matrix", "STR-003", "Refi-or-Sell Decision Matrix"),
    # Phase 6 — final 13 SKUs. Closes the 65-SKU catalog.
    ("ACQ-012-str-vs-ltr-yield-comparison", "ACQ-012", "STR vs LTR Yield Comparison"),
    ("FIN-002-break-even-occupancy",        "FIN-002", "Break-even Occupancy Calculator"),
    ("FIN-006-multi-entity-consolidated-pl", "FIN-006", "Multi-Entity Consolidated P&L"),
    ("FIN-007-partnership-distribution-tracker", "FIN-007", "Partnership Distribution Tracker"),
    ("LGL-003-guest-screening-log",         "LGL-003", "Guest Screening Log + Ban List"),
    ("LGL-004-insurance-claim-log",         "LGL-004", "Insurance Claim Log"),
    ("OPS-007-utility-usage-tracker",       "OPS-007", "Utility Usage + Trend Tracker"),
    ("OPS-008-insurance-policy-tracker",    "OPS-008", "Insurance Policy Tracker"),
    ("PAM-003-commission-split-calculator", "PAM-003", "Commission / Split Calculator"),
    ("PAM-004-multi-owner-consolidated-reporting", "PAM-004", "Multi-Owner Consolidated Reporting"),
    ("REV-006-pricing-tool-roi-comparison", "REV-006", "Pricing Tool ROI Comparison"),
    ("SPC-001-glamping-unique-stay-pl",     "SPC-001", "Glamping / Unique-Stay P&L"),
    ("SPC-002-corporate-housing-travel-nurse-tracker", "SPC-002", "Corporate Housing / Travel-Nurse Tracker"),
]


SHARED_CSS = """
@page { size: 8.5in 11in; margin: 0; }
* { box-sizing: border-box; }
html, body {
  margin: 0; padding: 0;
  background: """ + PARCHMENT + """;
  color: """ + GRAPHITE + """;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.page {
  width: 8.5in;
  min-height: 11in;
  padding: 0.7in 0.85in;
}
.brand-strip {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid rgba(18,48,78,0.18);
  padding-bottom: 14px;
  margin-bottom: 24px;
}
.brand-wordmark {
  font-family: 'Cormorant Garamond', Georgia, serif;
  color: """ + NAVY + """;
  font-weight: 500;
  font-size: 16pt;
  letter-spacing: -0.5px;
}
.brand-wordmark .the {
  font-style: italic;
  font-weight: 400;
  font-size: 11pt;
  margin-right: 4px;
}
.brand-wordmark .dot { color: """ + GOLD + """; }
.brand-doc-meta {
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 8pt;
  color: """ + NAVY + """;
  letter-spacing: 2.5px;
  text-transform: uppercase;
}
.doc-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 500;
  font-size: 30pt;
  color: """ + NAVY + """;
  margin: 8px 0 6px 0;
  letter-spacing: -0.5px;
  line-height: 1.1;
}
.doc-title .gold { color: """ + GOLD + """; }
.doc-subtitle {
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 9pt;
  color: """ + MUTED + """;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 22px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(18,48,78,0.10);
}
.body h1, .body h2, .body h3 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 500;
  color: """ + NAVY + """;
  letter-spacing: -0.3px;
  line-height: 1.2;
}
.body h1 { font-size: 22pt; margin: 24px 0 10px; }
.body h2 { font-size: 16pt; margin: 22px 0 8px; }
.body h3 { font-size: 13pt; margin: 18px 0 6px; }
.body p, .body li {
  font-size: 11pt;
  line-height: 1.6;
  color: """ + GRAPHITE + """;
  margin: 0 0 10px 0;
}
.body strong { color: """ + NAVY + """; }
.body em { font-style: italic; color: """ + GRAPHITE + """; }
.body ul, .body ol {
  margin: 4px 0 14px 0;
  padding-left: 22px;
}
.body li { margin-bottom: 4px; }
.body code {
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 9.5pt;
  background: """ + PARCHMENT_ALT + """;
  padding: 1px 5px;
  border-radius: 2px;
  color: """ + NAVY + """;
}
.body hr {
  border: none;
  border-top: 1px solid rgba(18,48,78,0.18);
  margin: 22px 0;
}
.body a {
  color: """ + NAVY + """;
  text-decoration: underline;
  text-decoration-color: """ + GOLD + """;
}
.callout {
  background: """ + GOLD_SOFT + """;
  border-left: 3px solid """ + GOLD + """;
  padding: 14px 18px;
  margin: 18px 0;
  font-size: 10.5pt;
  line-height: 1.55;
  color: """ + NAVY + """;
}
.body :first-child { margin-top: 0; }
.body :last-child { margin-bottom: 0; }
"""


def _brand_page_html(*, doc_kind: str, sku_code: str | None, doc_title: str,
                     subtitle_meta: str, body_html: str) -> str:
    """Wrap body content in the shared brand template."""
    sku_chip = f"{sku_code} · " if sku_code else ""
    return f"""<!doctype html>
<html><head><meta charset="utf-8">
<style>{SHARED_CSS}</style>
</head>
<body>
<div class="page">
  <div class="brand-strip">
    <div class="brand-wordmark"><span class="the">The</span>STR Ledger<span class="dot">.</span></div>
    <div class="brand-doc-meta">{sku_chip}{doc_kind}</div>
  </div>
  <h1 class="doc-title">{doc_title}</h1>
  <div class="doc-subtitle">{subtitle_meta}</div>
  <div class="body">
    {body_html}
  </div>
</div>
</body></html>"""


# ---------------------------------------------------------------------------
# License renderer
# ---------------------------------------------------------------------------

LICENSE_BODY_TEMPLATE = """
<h2>What you can do</h2>
<ul>
  <li>Use this template across every property you personally own or manage under a single business</li>
  <li>Edit, customize, rename cells, add tabs, add your logo</li>
  <li>Export to PDF and share with your guests (for guest-facing templates)</li>
  <li>Print as many copies as you want for your own use</li>
  <li>Reference it in your own internal training materials</li>
</ul>

<h2>What you can't do</h2>
<ul>
  <li>Resell or redistribute the template (edited or unedited) as your own product</li>
  <li>Include it in a paid bundle, course, or coaching package without written permission</li>
  <li>Share the file publicly on the internet (blog, social, forum) where others can download it</li>
  <li>Remove The STR Ledger branding from the workbook footer or cover tab</li>
</ul>

<h2>Property-manager exception</h2>
<p>If you're a property manager (co-host or PM) and bought this template, you may use it across every property you manage, regardless of who owns them. You may not sell access to the template to owners as a standalone product.</p>

<h2>What happens if this template is redistributed</h2>
<p>First offense: a kindly-worded email asking you to stop and delete your copies. Second offense: the license terminates retroactively, and we'll pursue standard IP remedies.</p>

<div class="callout">
<strong>Refund + satisfaction.</strong> 14 days, no questions asked. If the file doesn't work on your setup or doesn't solve the problem you bought it for, email <strong>hello@thestrledger.com</strong> and we'll refund in full. Etsy can take up to 5 business days to return funds to your card.
</div>

<h2>Questions</h2>
<p>Email <strong>hello@thestrledger.com</strong>. Real humans, fast replies.</p>
"""


def render_license_pdf(*, page, sku_code: str | None, sku_name: str,
                        out_path: Path) -> None:
    """Render a per-SKU (or shared) license PDF to out_path."""
    if sku_code:
        title = f"License<span class=\"gold\">.</span>"
        subtitle = (f"Template: {sku_name} (SKU: {sku_code}) · License type: "
                     f"single-business use")
    else:
        title = f"License<span class=\"gold\">.</span>"
        subtitle = ("All templates · License type: single-business use · "
                     "See the buyer's order receipt for the SKU and purchase date")
    html = _brand_page_html(
        doc_kind="LICENSE",
        sku_code=sku_code,
        doc_title=title,
        subtitle_meta=subtitle,
        body_html=LICENSE_BODY_TEMPLATE,
    )
    page.set_content(html, wait_until="load")
    page.wait_for_timeout(120)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    page.pdf(
        path=str(out_path),
        format="Letter",
        print_background=True,
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
    )


# ---------------------------------------------------------------------------
# Howto renderer (markdown-driven)
# ---------------------------------------------------------------------------

def _strip_md_brand_lines(md_text: str) -> str:
    """Remove duplicate brand strip lines from raw howto markdown.

    Existing howto files include a "**The STR Ledger · thestrledger.com**"
    line right under the H1 — the PDF template already shows the brand,
    so we strip these to avoid double-headers.
    """
    lines = md_text.splitlines()
    cleaned: list[str] = []
    for line in lines:
        s = line.strip()
        if s == "**The STR Ledger · thestrledger.com**":
            continue
        # Final "© 2026 ..." colophon line — template renders one already.
        if s.startswith("© 2026 The STR Ledger"):
            continue
        cleaned.append(line)
    return "\n".join(cleaned)


def _normalize_list_spacing(md_text: str) -> str:
    """Inject a blank line before any bullet/ordered list start that
    doesn't already have one.

    Several existing howto.md files put a list directly under a paragraph
    without the required blank line. python-markdown then renders the
    list inline ("- foo - bar - baz" on one line) instead of as a real
    list. Pre-processing fixes this without editing every source file.
    """
    out_lines: list[str] = []
    prev_blank = True  # Treat start-of-file as if preceded by a blank.
    bullet_re = re.compile(r"^\s*([-*+]\s|\d+\.\s)")
    in_code = False
    for line in md_text.splitlines():
        if line.strip().startswith("```"):
            in_code = not in_code
            out_lines.append(line)
            prev_blank = False
            continue
        if not in_code and bullet_re.match(line) and not prev_blank:
            out_lines.append("")  # blank line before list
        out_lines.append(line)
        prev_blank = (line.strip() == "")
    return "\n".join(out_lines)


def _split_first_h1(md_text: str) -> tuple[str, str]:
    """Return (title_text, remaining_md). First "# Title" line becomes
    the doc title; everything else flows into the body."""
    m = re.match(r"^\s*#\s+(.+?)\s*$", md_text, re.MULTILINE)
    if not m:
        return ("", md_text)
    title = m.group(1).strip()
    rest = md_text[m.end():].lstrip("\n")
    return (title, rest)


def render_howto_pdf(*, page, sku_code: str, sku_name: str,
                      md_path: Path, out_path: Path) -> None:
    raw = md_path.read_text(encoding="utf-8")
    raw = _strip_md_brand_lines(raw)
    raw = _normalize_list_spacing(raw)
    title, body_md = _split_first_h1(raw)
    if not title:
        title = f"How to use your {sku_name}"

    body_html = md.markdown(body_md, extensions=["extra", "sane_lists"])
    subtitle = f"SKU {sku_code} · {sku_name}"

    html = _brand_page_html(
        doc_kind="HOW TO USE",
        sku_code=sku_code,
        doc_title=title,
        subtitle_meta=subtitle,
        body_html=body_html,
    )
    page.set_content(html, wait_until="load")
    page.wait_for_timeout(120)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    page.pdf(
        path=str(out_path),
        format="Letter",
        print_background=True,
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
    )


# ---------------------------------------------------------------------------
# Driver
# ---------------------------------------------------------------------------

def main() -> None:
    license_count = 0
    howto_count = 0
    skipped_howto: list[str] = []

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Shared (catalog-wide) license PDF — one in _shared/.
        shared_license = SHARED / "license.pdf"
        render_license_pdf(
            page=page, sku_code=None, sku_name="The STR Ledger Templates",
            out_path=shared_license,
        )
        print(f"  -> {shared_license.relative_to(REPO)}  (shared)")

        for dir_name, sku_code, sku_name in SKU_CATALOG:
            sku_dir = DELIVERY / dir_name
            if not sku_dir.exists():
                sku_dir.mkdir(parents=True, exist_ok=True)

            # License PDF — always renders.
            license_pdf = sku_dir / f"{sku_code}-license.pdf"
            render_license_pdf(
                page=page, sku_code=sku_code, sku_name=sku_name,
                out_path=license_pdf,
            )
            license_count += 1
            print(f"  -> {license_pdf.relative_to(REPO)}")

            # Howto PDF — only when source markdown exists.
            md_path = sku_dir / f"{sku_code}-howto.md"
            if md_path.exists():
                howto_pdf = sku_dir / f"{sku_code}-howto.pdf"
                render_howto_pdf(
                    page=page, sku_code=sku_code, sku_name=sku_name,
                    md_path=md_path, out_path=howto_pdf,
                )
                howto_count += 1
                print(f"  -> {howto_pdf.relative_to(REPO)}")
            else:
                skipped_howto.append(sku_code)

        browser.close()

    print()
    print(f"Rendered: 1 shared license + {license_count} per-SKU licenses + "
           f"{howto_count} howto PDFs.")
    if skipped_howto:
        print(f"Howto markdown missing for {len(skipped_howto)} SKUs: "
               f"{', '.join(skipped_howto)} — these still need source content.")


if __name__ == "__main__":
    main()
