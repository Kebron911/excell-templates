"""Render the "47 Airbnb Tax Deductions" hero-magnet PDF.

Multi-page Letter PDF. Cover + intro + 6 section pages + disclaimer.
Source-of-truth content lives in `deductions_47_data.py`.

Output: templates/_delivery/_shared/47-airbnb-tax-deductions.pdf

Re-run any time the data changes:
    python templates/_delivery/_shared/_build_47_deductions_pdf.py

⚠ DRAFT — DANIEL TAX-ACCURACY REVIEW REQUIRED BEFORE PUBLISH ⚠
"""

from __future__ import annotations

import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

# Make the data module importable when run as a script.
sys.path.insert(0, str(Path(__file__).resolve().parent))
from deductions_47_data import ENTRIES, SECTIONS, by_section  # noqa: E402

REPO = Path(__file__).resolve().parent.parent.parent.parent
OUT = REPO / "templates" / "_delivery" / "_shared" / "47-airbnb-tax-deductions.pdf"

NAVY = "#12304E"
PARCHMENT = "#F6EFE2"
PARCHMENT_ALT = "#EFE5D0"
GOLD = "#C9A24B"
GOLD_SOFT = "#F2E5C0"
GRAPHITE = "#2B2B2B"
MUTED = "#6B6B6B"


def _esc(s: str) -> str:
    """Minimal HTML-safe escape for entry copy."""
    return (s.replace("&", "&amp;")
             .replace("<", "&lt;")
             .replace(">", "&gt;"))


def _entry_html(entry: dict) -> str:
    flag = ('<span class="verify-flag" title="Daniel must verify this entry">'
             '⚠ verify</span>') if entry["verify"] else ""
    return f"""
<div class="entry">
  <div class="num">{entry['n']:02d}</div>
  <div class="body">
    <div class="title-row">
      <span class="title">{_esc(entry['name'])}</span>
      {flag}
    </div>
    <div class="meta">
      <span class="meta-line">{_esc(entry['line'])}</span>
      <span class="meta-sep">·</span>
      <span class="meta-ref">{_esc(entry['irs_ref'])}</span>
      <span class="meta-sep">·</span>
      <span class="meta-typical">{_esc(entry['typical'])}</span>
    </div>
    <div class="missed">{_esc(entry['missed_because'])}</div>
  </div>
</div>"""


def _section_html(name: str, intro: str, entries: list) -> str:
    rows = "\n".join(_entry_html(e) for e in entries)
    return f"""
<section class="section">
  <h2 class="section-title">{_esc(name)}</h2>
  <p class="section-intro">{_esc(intro)}</p>
  <div class="entries">
    {rows}
  </div>
</section>"""


def html_for_pdf() -> str:
    sections = []
    grouped = by_section()
    for name, intro in SECTIONS:
        entries = grouped.get(name, [])
        if not entries:
            continue
        sections.append(_section_html(name, intro, entries))
    flagged_count = sum(1 for e in ENTRIES if e["verify"])

    css = """
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
  padding: 0.7in 0.75in;
  page-break-after: always;
}
.page:last-of-type { page-break-after: auto; }
.brand-strip {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid rgba(18,48,78,0.18);
  padding-bottom: 14px;
  margin-bottom: 28px;
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
.brand-domain {
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 8pt;
  color: """ + NAVY + """;
  letter-spacing: 2.5px;
  text-transform: uppercase;
}

/* ===== COVER PAGE ===== */
.cover {
  background: """ + NAVY + """;
  color: """ + PARCHMENT + """;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.85in 0.85in;
  height: 11in;
}
.cover .brand-strip {
  border-bottom-color: rgba(246,239,226,0.25);
  padding-bottom: 14px;
}
.cover .brand-wordmark { color: """ + PARCHMENT + """; }
.cover .brand-domain { color: """ + PARCHMENT + """; }
.cover-eyebrow {
  font-size: 10pt;
  letter-spacing: 6px;
  font-weight: 600;
  text-transform: uppercase;
  color: """ + GOLD + """;
  margin-bottom: 18px;
}
.cover-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 500;
  font-size: 56pt;
  line-height: 1.05;
  letter-spacing: -1px;
  margin: 0 0 24px 0;
  color: """ + PARCHMENT + """;
}
.cover-title .gold { color: """ + GOLD + """; }
.cover-sub {
  font-size: 14pt;
  line-height: 1.5;
  color: """ + PARCHMENT + """;
  opacity: 0.92;
  max-width: 6.5in;
}
.cover-cta {
  margin-top: 36px;
  display: flex;
  align-items: center;
  gap: 24px;
}
.cover-cta-rule {
  width: 60px;
  height: 2px;
  background: """ + GOLD + """;
}
.cover-cta-text {
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 11pt;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: """ + GOLD + """;
}
.cover-footer {
  display: flex;
  justify-content: space-between;
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 8pt;
  color: rgba(246,239,226,0.65);
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

/* ===== INTRO PAGE ===== */
.intro h1 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 500;
  font-size: 30pt;
  color: """ + NAVY + """;
  margin: 8px 0 16px 0;
  letter-spacing: -0.5px;
}
.intro h1 .gold { color: """ + GOLD + """; }
.intro p {
  font-size: 11pt;
  line-height: 1.65;
  margin: 0 0 14px 0;
  max-width: 6.8in;
}
.intro strong { color: """ + NAVY + """; }
.intro .callout {
  margin: 22px 0;
  padding: 18px 24px;
  background: """ + GOLD_SOFT + """;
  border-left: 3px solid """ + GOLD + """;
  font-size: 10.5pt;
  line-height: 1.55;
  color: """ + NAVY + """;
}
.intro .how {
  margin-top: 28px;
}
.intro .how h3 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 500;
  font-size: 18pt;
  color: """ + NAVY + """;
  margin: 0 0 8px 0;
}
.intro .how ol {
  font-size: 10.5pt;
  line-height: 1.6;
  padding-left: 20px;
  margin: 0;
}
.intro .how ol li { margin-bottom: 6px; }

/* ===== SECTION PAGES ===== */
.section { padding-top: 4px; }
.section-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 500;
  font-size: 26pt;
  color: """ + NAVY + """;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}
.section-intro {
  font-size: 10.5pt;
  font-style: italic;
  color: """ + MUTED + """;
  margin: 0 0 22px 0;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(18,48,78,0.15);
}
.entries { display: block; }
.entry {
  display: flex;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(18,48,78,0.08);
  page-break-inside: avoid;
}
.entry:last-child { border-bottom: none; }
.entry .num {
  flex-shrink: 0;
  width: 36px;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 500;
  font-size: 22pt;
  color: """ + GOLD + """;
  line-height: 1;
  text-align: right;
  padding-top: 2px;
}
.entry .body { flex: 1; min-width: 0; }
.entry .title-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}
.entry .title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 500;
  font-size: 14pt;
  color: """ + NAVY + """;
  letter-spacing: -0.2px;
}
.entry .verify-flag {
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 7.5pt;
  font-weight: 600;
  color: """ + GOLD + """;
  letter-spacing: 1.5px;
  background: """ + GOLD_SOFT + """;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
}
.entry .meta {
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 7.5pt;
  letter-spacing: 0.5px;
  color: """ + MUTED + """;
  margin-bottom: 5px;
  text-transform: uppercase;
}
.entry .meta-line { color: """ + NAVY + """; font-weight: 600; }
.entry .meta-ref { color: """ + GRAPHITE + """; }
.entry .meta-typical {
  color: """ + GOLD + """;
  font-weight: 600;
  text-transform: none;
}
.entry .meta-sep { margin: 0 6px; color: rgba(43,43,43,0.35); }
.entry .missed {
  font-size: 10pt;
  line-height: 1.5;
  color: """ + GRAPHITE + """;
}

/* ===== CLOSING PAGE ===== */
.closing { padding-top: 14px; }
.closing h2 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 500;
  font-size: 28pt;
  color: """ + NAVY + """;
  margin: 0 0 14px 0;
  letter-spacing: -0.5px;
}
.closing p {
  font-size: 11pt;
  line-height: 1.65;
  margin: 0 0 12px 0;
  max-width: 6.8in;
}
.closing strong { color: """ + NAVY + """; }
.closing .cta-block {
  margin-top: 24px;
  background: """ + NAVY + """;
  color: """ + PARCHMENT + """;
  padding: 28px 32px;
  border-radius: 4px;
}
.closing .cta-block .eyebrow {
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 8pt;
  font-weight: 600;
  color: """ + GOLD + """;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.closing .cta-block .head {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 500;
  font-size: 20pt;
  margin-bottom: 10px;
}
.closing .cta-block .url {
  font-family: 'JetBrains Mono', Consolas, monospace;
  color: """ + GOLD + """;
  font-size: 12pt;
  letter-spacing: 1px;
}
.closing .disclaimer {
  margin-top: 26px;
  padding: 16px 20px;
  background: """ + PARCHMENT_ALT + """;
  border-left: 3px solid """ + GOLD + """;
  font-size: 9.5pt;
  line-height: 1.55;
  color: """ + GRAPHITE + """;
}
.closing .disclaimer strong { color: """ + NAVY + """; }
.closing .footer {
  margin-top: 32px;
  border-top: 1px solid rgba(18,48,78,0.18);
  padding-top: 14px;
  display: flex;
  justify-content: space-between;
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 8pt;
  color: """ + MUTED + """;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

/* shared brand strip on body pages */
.body-page .brand-strip { margin-bottom: 22px; }
"""

    sections_html = "\n".join(sections)

    return f"""<!doctype html>
<html><head><meta charset="utf-8">
<style>{css}</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="page cover">
  <div class="brand-strip">
    <div class="brand-wordmark"><span class="the">The</span>STR Ledger<span class="dot">.</span></div>
    <div class="brand-domain">thestrledger.com</div>
  </div>
  <div>
    <div class="cover-eyebrow">FREE FOR SERIOUS HOSTS</div>
    <h1 class="cover-title">47 Airbnb<br>Tax Deductions<br>Most Hosts Miss<span class="gold">.</span></h1>
    <p class="cover-sub">Every line item your CPA shouldn't have to ask you about — including the ones most hosts have never heard of. Built for short-term rental operators who'd rather keep their money than mail it to the IRS.</p>
    <div class="cover-cta">
      <div class="cover-cta-rule"></div>
      <div class="cover-cta-text">A guide from The STR Ledger</div>
    </div>
  </div>
  <div class="cover-footer">
    <span>thestrledger.com/47</span>
    <span>The STR Ledger · 2026 edition</span>
  </div>
</div>

<!-- INTRO PAGE -->
<div class="page body-page intro">
  <div class="brand-strip">
    <div class="brand-wordmark"><span class="the">The</span>STR Ledger<span class="dot">.</span></div>
    <div class="brand-domain">47 deductions · 2026 edition</div>
  </div>
  <h1>Two things sink most hosts at tax time<span class="gold">.</span></h1>
  <p><strong>First</strong>, hosts net cleaning and OTA fees against revenue, miscategorize a dozen expense rows, and hand their CPA a spreadsheet that doesn't roll up to Schedule E. The CPA bills three hours to clean it up.</p>
  <p><strong>Second</strong>, hosts skip depreciation. The single largest deduction available to a residential rental owner — and most don't take it because the math feels intimidating.</p>
  <p>This guide is the antidote to both. Forty-seven deductions, organized by category, each with the Schedule E line, the IRS reference, the typical dollar range, and the reason it gets missed. Use it as a year-end checklist with your CPA, or pair it with the companion Excel checklist (free at <strong>thestrledger.com/47</strong>) and capture deductions as they happen.</p>

  <div class="callout">
    <strong>Working draft.</strong> {flagged_count} of these 47 entries carry a <strong>⚠ verify</strong> flag — items where a current-year IRS rate, threshold, or rule must be confirmed against the IRS publication cited. The flag does not mean the deduction is wrong; it means the specific number on the page must be checked against this year's IRS publication before you act on it.
  </div>

  <div class="how">
    <h3>How to use this guide</h3>
    <ol>
      <li>Scan the section that matches what you'd want most: depreciation if you've never claimed it, advanced moves if your tax bill is too high.</li>
      <li>For each entry, check the Schedule E line and the IRS reference. Look up the current-year version of the cited publication on irs.gov.</li>
      <li>Open the companion Excel checklist. Mark each row "captured this year? Y/N" and log the dollar amount as you go.</li>
      <li>Hand the populated checklist to your CPA in March. Watch them ask fewer questions and bill less.</li>
    </ol>
  </div>
</div>

{sections_html}

<!-- CLOSING PAGE -->
<div class="page body-page closing">
  <div class="brand-strip">
    <div class="brand-wordmark"><span class="the">The</span>STR Ledger<span class="dot">.</span></div>
    <div class="brand-domain">47 deductions · closing</div>
  </div>
  <h2>Take this further<span style="color:{GOLD}">.</span></h2>
  <p>The 47 deductions in this guide are only the start. The biggest tax savings for a serious host come from doing one of two things well — depreciating the building correctly (or accelerating it via cost segregation) and structuring your activity to qualify for the STR loophole or the QBI safe harbor. Both require running the numbers, not just listing them.</p>
  <p>Our Excel templates run those numbers. The <strong>Single-Property P&amp;L Tracker</strong> ($27 Etsy / $47 own-site) auto-fills Schedule E Line 20 with straight-line depreciation. The <strong>STR Mileage Log</strong> ($17) handles Line 7. The <strong>1099-NEC Tracker</strong> ($17) catches threshold-crossing contractors before January.</p>

  <div class="cta-block">
    <div class="eyebrow">FULL TEMPLATE LIBRARY</div>
    <div class="head">Run your rentals before they run you.</div>
    <div class="url">→ thestrledger.com</div>
  </div>

  <div class="disclaimer">
    <strong>Important.</strong> General information for educational purposes — not tax advice. Tax law changes annually; the rates and thresholds in this guide must be confirmed against current-year IRS publications before you act on them. Consult your CPA for your specific situation. Canonical IRS references include Pub 527 (Residential Rental Property), Pub 463 (Travel/Gift/Car), Pub 535 (Business Expenses), Pub 946 (Depreciation), Pub 587 (Home Office), and Schedule E + Schedule C instructions.
  </div>

  <div class="footer">
    <span>hello@thestrledger.com</span>
    <span>The STR Ledger · &copy; 2026</span>
  </div>
</div>

</body></html>"""


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    html = html_for_pdf()
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_content(html, wait_until="load")
        page.wait_for_timeout(200)
        page.pdf(
            path=str(OUT),
            format="Letter",
            print_background=True,
            margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
        )
        browser.close()
    size_kb = OUT.stat().st_size / 1024
    print(f"Wrote {OUT.relative_to(REPO)}  ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
