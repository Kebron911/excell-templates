"""Build bundle delivery packages.

For each bundle defined in bundles_config.py, produces:
  - <slug>-blank.zip   — all BLANK xlsx files in the bundle
  - <slug>-demo.zip    — all DEMO xlsx files in the bundle
  - <slug>-howto.pdf   — concatenated per-SKU howto PDFs
  - <slug>-readme.pdf  — branded cover sheet listing bundle contents

Outputs live in `templates/_delivery/_bundles/<slug>/`.

Re-run any time bundle composition or per-SKU artifacts change:
    python templates/_delivery/_bundles/_build_bundles.py
"""

from __future__ import annotations

import sys
import zipfile
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from bundles_config import BUNDLES, SKU_PRICES, alacarte_total, savings  # noqa: E402

DELIVERY = REPO / "templates" / "_delivery"
BUNDLES_DIR = DELIVERY / "_bundles"
MASTERS = REPO / "templates" / "_masters"

NAVY = "#12304E"
PARCHMENT = "#F6EFE2"
PARCHMENT_ALT = "#EFE5D0"
GOLD = "#C9A24B"
GOLD_SOFT = "#F2E5C0"
GRAPHITE = "#2B2B2B"
MUTED = "#6B7280"


# ---------------------------------------------------------------------------
# ZIP packaging
# ---------------------------------------------------------------------------

def build_zip(bundle: dict, kind: str, out_path: Path) -> int:
    """Create a ZIP of either BLANK or DEMO xlsx files for the bundle.

    Returns count of files added.
    """
    assert kind in ("BLANK", "DEMO")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for sku in bundle["skus"]:
            dir_name, _name, _price = SKU_PRICES[sku]
            xlsx = MASTERS / f"{dir_name}-{kind}.xlsx"
            if not xlsx.exists():
                raise FileNotFoundError(f"Missing {kind} xlsx for {sku}: {xlsx}")
            # Store in zip with simple filename (no parent path)
            zf.write(xlsx, arcname=xlsx.name)
            count += 1
    return count


# ---------------------------------------------------------------------------
# Howto PDF merge
# ---------------------------------------------------------------------------

def merge_howto_pdfs(bundle: dict, out_path: Path) -> int:
    """Concatenate per-SKU howto PDFs into one bundle-level howto PDF.

    Returns page count of merged PDF.
    """
    writer = PdfWriter()
    pages = 0
    for sku in bundle["skus"]:
        dir_name, _name, _price = SKU_PRICES[sku]
        howto = DELIVERY / dir_name / f"{sku}-howto.pdf"
        if not howto.exists():
            raise FileNotFoundError(f"Missing howto PDF for {sku}: {howto}")
        reader = PdfReader(howto)
        for p in reader.pages:
            writer.add_page(p)
            pages += 1
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("wb") as f:
        writer.write(f)
    return pages


# ---------------------------------------------------------------------------
# README PDF — branded cover sheet listing bundle contents
# ---------------------------------------------------------------------------

def _readme_html(bundle: dict) -> str:
    skus_rows = []
    for sku in bundle["skus"]:
        dir_name, name, price = SKU_PRICES[sku]
        skus_rows.append(
            f'<tr><td class="sku">{sku}</td>'
            f'<td class="name">{name}</td>'
            f'<td class="price">${price}</td></tr>'
        )
    rows_html = "\n      ".join(skus_rows)

    alacarte = alacarte_total(bundle)
    save_dollars, save_pct = savings(bundle)

    surprise_block = ""
    if bundle.get("surprise_sku"):
        sku = bundle["surprise_sku"]
        _dir, name, _price = SKU_PRICES[sku]
        surprise_block = (
            f'<div class="surprise"><strong>The surprise include:</strong> '
            f'{name} ({sku}). Per the bundle strategy: most buyers in this '
            f'persona don\'t realize they need it until they\'re using it.</div>'
        )

    future_block = ""
    if bundle.get("future_price"):
        future = ", ".join(bundle["future_skus_to_add"])
        future_block = (
            f'<div class="future"><strong>Lifetime updates include future SKUs.</strong> '
            f'When the following ship, they\'re added to your bundle automatically: '
            f'{future}. Bundle list price will rise from ${bundle["price"]} to '
            f'${bundle["future_price"]} at that point — your purchase is grandfathered.</div>'
        )

    return f"""<!doctype html>
<html><head><meta charset="utf-8">
<style>
  @page {{ size: 8.5in 11in; margin: 0; }}
  * {{ box-sizing: border-box; }}
  html, body {{
    margin: 0; padding: 0;
    background: {PARCHMENT};
    color: {GRAPHITE};
    font-family: 'Inter', 'Segoe UI', sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}
  .page {{ width: 8.5in; min-height: 11in; padding: 0.7in 0.85in; }}
  .brand-strip {{
    display: flex; justify-content: space-between; align-items: baseline;
    border-bottom: 1px solid rgba(18,48,78,0.18);
    padding-bottom: 14px; margin-bottom: 24px;
  }}
  .brand-wordmark {{
    font-family: 'Cormorant Garamond', Georgia, serif;
    color: {NAVY}; font-weight: 500; font-size: 16pt; letter-spacing: -0.5px;
  }}
  .brand-wordmark .the {{ font-style: italic; font-weight: 400; font-size: 11pt; margin-right: 4px; }}
  .brand-wordmark .dot {{ color: {GOLD}; }}
  .brand-doc-meta {{
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 8pt; color: {NAVY}; letter-spacing: 2.5px; text-transform: uppercase;
  }}
  h1.title {{
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 500; font-size: 32pt; color: {NAVY};
    margin: 8px 0 6px 0; letter-spacing: -0.5px; line-height: 1.1;
  }}
  h1 .gold {{ color: {GOLD}; }}
  .tagline {{
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic; font-size: 14pt; color: {NAVY};
    margin: 0 0 22px 0; padding-bottom: 18px;
    border-bottom: 1px solid rgba(18,48,78,0.10);
  }}
  .price-card {{
    background: {NAVY}; color: {PARCHMENT};
    padding: 22px 28px; border-radius: 4px; margin: 18px 0;
    display: flex; justify-content: space-around; gap: 24px;
  }}
  .price-card .col {{ text-align: center; }}
  .price-card .label {{
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 8pt; color: {GOLD}; letter-spacing: 3px;
    text-transform: uppercase; margin-bottom: 6px;
  }}
  .price-card .value {{
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 500; font-size: 26pt; line-height: 1;
  }}
  .price-card .value.save {{ color: {GOLD}; }}
  h2 {{
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 500; font-size: 18pt; color: {NAVY};
    margin: 26px 0 10px 0;
  }}
  table.sku-list {{
    width: 100%; border-collapse: collapse; margin: 0 0 16px 0;
    font-size: 10.5pt;
  }}
  table.sku-list th, table.sku-list td {{
    padding: 8px 10px; text-align: left;
    border-bottom: 1px solid rgba(18,48,78,0.10);
  }}
  table.sku-list th {{
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 8pt; letter-spacing: 1.5px;
    text-transform: uppercase; color: {NAVY};
    background: {PARCHMENT_ALT};
  }}
  table.sku-list td.sku {{
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 9pt; color: {NAVY}; font-weight: 600;
    width: 70px;
  }}
  table.sku-list td.name {{ color: {GRAPHITE}; }}
  table.sku-list td.price {{
    font-family: 'JetBrains Mono', Consolas, monospace;
    text-align: right; color: {GOLD}; font-weight: 600;
    width: 60px;
  }}
  .surprise, .future {{
    background: {GOLD_SOFT}; border-left: 3px solid {GOLD};
    padding: 12px 18px; margin: 14px 0;
    font-size: 10pt; line-height: 1.55; color: {NAVY};
  }}
  .future {{ background: {PARCHMENT_ALT}; }}
  .body-copy {{
    font-size: 10.5pt; line-height: 1.6;
    margin: 0 0 12px 0;
  }}
  .body-copy strong {{ color: {NAVY}; }}
  .footer {{
    margin-top: 28px; padding-top: 14px;
    border-top: 1px solid rgba(18,48,78,0.18);
    display: flex; justify-content: space-between;
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 8pt; color: {MUTED};
    letter-spacing: 1.5px; text-transform: uppercase;
  }}
</style>
</head>
<body>
<div class="page">
  <div class="brand-strip">
    <div class="brand-wordmark"><span class="the">The</span>STR Ledger<span class="dot">.</span></div>
    <div class="brand-doc-meta">{bundle['code']} · BUNDLE README</div>
  </div>
  <h1 class="title">{bundle['name']}<span class="gold">.</span></h1>
  <div class="tagline">{bundle['tagline']}</div>

  <div class="price-card">
    <div class="col">
      <div class="label">À LA CARTE</div>
      <div class="value">${alacarte}</div>
    </div>
    <div class="col">
      <div class="label">BUNDLE PRICE</div>
      <div class="value">${bundle['price']}</div>
    </div>
    <div class="col">
      <div class="label">YOU SAVE</div>
      <div class="value save">${save_dollars}<br><span style="font-size:11pt">({save_pct:.0f}%)</span></div>
    </div>
  </div>

  <h2>What's inside</h2>
  <table class="sku-list">
    <thead>
      <tr><th>SKU</th><th>Workbook</th><th style="text-align:right">À la carte</th></tr>
    </thead>
    <tbody>
      {rows_html}
    </tbody>
  </table>

  {surprise_block}
  {future_block}

  <h2>How to use this bundle</h2>
  <p class="body-copy">
    1. Open the BLANK ZIP — start a fresh copy of any workbook for your data.<br>
    2. Open the DEMO ZIP — pre-filled examples to learn from before clearing and using.<br>
    3. Read the bundled how-to PDF for step-by-step usage of every workbook in the bundle.<br>
    4. Refer to the individual license PDF for terms (single-business use across all workbooks in this bundle).
  </p>

  <h2>Updates + support</h2>
  <p class="body-copy">
    Lifetime updates included. When any workbook in the bundle gets a new version,
    you'll receive it automatically via the email used at purchase. Questions:
    <strong>hello@thestrledger.com</strong> — real humans, fast replies.
  </p>

  <div class="footer">
    <span>hello@thestrledger.com</span>
    <span>The STR Ledger · &copy; 2026</span>
  </div>
</div>
</body></html>"""


def render_readme_pdf(bundle: dict, out_path: Path, page) -> None:
    html = _readme_html(bundle)
    page.set_content(html, wait_until="load")
    page.wait_for_timeout(150)
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
    print(f"Building {len(BUNDLES)} bundle delivery packages...")
    print()
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        for bundle in BUNDLES:
            slug_dir = BUNDLES_DIR / f"{bundle['code']}-{bundle['slug']}"
            slug_dir.mkdir(parents=True, exist_ok=True)
            base = bundle["slug"]

            # 1. BLANK + DEMO ZIPs
            blank_zip = slug_dir / f"{base}-blank.zip"
            demo_zip = slug_dir / f"{base}-demo.zip"
            n_blank = build_zip(bundle, "BLANK", blank_zip)
            n_demo = build_zip(bundle, "DEMO", demo_zip)

            # 2. Merged howto PDF
            howto_pdf = slug_dir / f"{base}-howto.pdf"
            n_pages = merge_howto_pdfs(bundle, howto_pdf)

            # 3. README PDF
            readme_pdf = slug_dir / f"{base}-readme.pdf"
            render_readme_pdf(bundle, readme_pdf, page)

            print(f"  {bundle['code']}  {bundle['name']}")
            print(f"    -> {blank_zip.relative_to(REPO)}  ({n_blank} files)")
            print(f"    -> {demo_zip.relative_to(REPO)}  ({n_demo} files)")
            print(f"    -> {howto_pdf.relative_to(REPO)}  ({n_pages} pages)")
            print(f"    -> {readme_pdf.relative_to(REPO)}")
            print()

        browser.close()

    print("Done.")


if __name__ == "__main__":
    main()
