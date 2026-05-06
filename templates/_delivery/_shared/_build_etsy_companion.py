"""Build the A13 Etsy buyer companion PDF.

Single-page PDF attached as file #2 on every Etsy listing. Drives buyers to
the 47-deductions hero magnet (and, secondarily, the upgrade ladder).

Source copy: copy/lead-magnets/etsy-buyer-pdf.md
Output:      templates/_delivery/_shared/etsy-upgrade-insert.pdf

Re-run any time the brand or copy changes:
    python templates/_delivery/_shared/_build_etsy_companion.py
"""

from __future__ import annotations

import base64
import io
from pathlib import Path

import qrcode
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent.parent.parent
OUT = REPO / "templates" / "_delivery" / "_shared" / "etsy-upgrade-insert.pdf"

NAVY = "#12304E"
PARCHMENT = "#F6EFE2"
GOLD = "#C9A24B"
GRAPHITE = "#2B2B2B"

TARGET_URL = "https://thestrledger.com/47"


def qr_data_uri(payload: str, *, box_size: int = 12, border: int = 2) -> str:
    """Generate a deterministic QR code as a base64 PNG data URI."""
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=box_size,
        border=border,
    )
    qr.add_data(payload)
    qr.make(fit=True)
    img = qr.make_image(fill_color=NAVY, back_color=PARCHMENT).convert("RGB")
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


def html_for_companion() -> str:
    qr = qr_data_uri(TARGET_URL)
    return f"""<!doctype html>
<html><head><meta charset="utf-8">
<style>
  @page {{
    size: 8.5in 11in;
    margin: 0;
  }}
  html, body {{
    margin: 0;
    padding: 0;
    background: {PARCHMENT};
    color: {GRAPHITE};
    font-family: 'Inter', 'Segoe UI', sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}
  .page {{
    width: 8.5in;
    height: 11in;
    padding: 0.85in 0.85in;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}
  .top-strip {{
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }}
  .wordmark {{
    font-family: 'Cormorant Garamond', Georgia, serif;
    color: {NAVY};
    line-height: 1;
  }}
  .wordmark .the {{
    font-style: italic;
    font-weight: 400;
    font-size: 18pt;
    display: block;
  }}
  .wordmark .name {{
    font-weight: 500;
    font-size: 32pt;
    letter-spacing: -0.5px;
    margin-top: 4px;
  }}
  .wordmark .name .dot {{ color: {GOLD}; }}
  .domain {{
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 10pt;
    color: {NAVY};
    letter-spacing: 3px;
    text-transform: uppercase;
  }}
  .gold-rule {{
    width: 80px;
    height: 2px;
    background: {GOLD};
    margin: 32px 0 28px 0;
  }}
  h1 {{
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 500;
    font-size: 38pt;
    color: {NAVY};
    line-height: 1.1;
    letter-spacing: -0.5px;
    margin: 0 0 28px 0;
  }}
  h1 .gold {{ color: {GOLD}; }}
  .body {{
    font-size: 12pt;
    line-height: 1.65;
    color: {GRAPHITE};
    max-width: 100%;
  }}
  .body p {{ margin: 0 0 16px 0; }}
  .body strong {{ color: {NAVY}; }}
  .body a {{ color: {NAVY}; text-decoration: underline; text-decoration-color: {GOLD}; }}
  .cta-block {{
    margin-top: 28px;
    background: {NAVY};
    color: {PARCHMENT};
    padding: 36px 40px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 32px;
  }}
  .cta-text {{
    flex: 1;
  }}
  .cta-eyebrow {{
    font-size: 9pt;
    font-weight: 600;
    letter-spacing: 4px;
    color: {GOLD};
    text-transform: uppercase;
    margin-bottom: 10px;
  }}
  .cta-headline {{
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 500;
    font-size: 22pt;
    line-height: 1.15;
    margin-bottom: 12px;
  }}
  .cta-url {{
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 14pt;
    color: {GOLD};
    letter-spacing: 1px;
  }}
  .qr-wrap {{
    width: 145px;
    height: 145px;
    background: {PARCHMENT};
    padding: 10px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }}
  .qr-wrap img {{
    width: 100%;
    height: 100%;
    display: block;
  }}
  .secondary {{
    margin-top: 24px;
    font-size: 11pt;
    line-height: 1.55;
    color: {GRAPHITE};
  }}
  .secondary strong {{ color: {NAVY}; }}
  .footer {{
    margin-top: 24px;
    border-top: 1px solid rgba(18, 48, 78, 0.18);
    padding-top: 14px;
    display: flex;
    justify-content: space-between;
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 8pt;
    color: rgba(43, 43, 43, 0.7);
    letter-spacing: 1px;
    text-transform: uppercase;
  }}
</style>
</head>
<body>
  <div class="page">
    <div>
      <div class="top-strip">
        <div class="wordmark">
          <span class="the">The</span>
          <span class="name">STR Ledger<span class="dot">.</span></span>
        </div>
        <div class="domain">thestrledger.com</div>
      </div>

      <div class="gold-rule"></div>

      <h1>Thanks for grabbing your template<span class="gold">.</span></h1>

      <div class="body">
        <p>You just bought into a growing library built specifically for Airbnb and VRBO hosts who treat their portfolio like a real business — not a side hustle.</p>

        <p>Before tax season runs you over, do one thing: grab our free <strong>"47 Airbnb Tax Deductions Most Hosts Miss"</strong> guide. It's the PDF + Excel checklist every serious host needs before their CPA opens their books.</p>
      </div>

      <div class="cta-block">
        <div class="cta-text">
          <div class="cta-eyebrow">Free for Etsy buyers</div>
          <div class="cta-headline">47 Airbnb Tax Deductions Most Hosts Miss</div>
          <div class="cta-url">→ thestrledger.com/47</div>
        </div>
        <div class="qr-wrap">
          <img src="{qr}" alt="QR code to thestrledger.com/47">
        </div>
      </div>

      <div class="secondary">
        <p><strong>Need a fuller version of this template?</strong> Multi-property, depreciation by asset, LLC consolidation, and bonus tax tools live on the upgrade ladder at <strong>thestrledger.com/upgrade</strong>. Your Etsy purchase counts as credit toward any upgrade.</p>
      </div>
    </div>

    <div class="footer">
      <span>hello@thestrledger.com</span>
      <span>The STR Ledger · &copy; 2026</span>
    </div>
  </div>
</body>
</html>"""


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    html = html_for_companion()
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_content(html, wait_until="load")
        page.wait_for_timeout(150)
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
