"""Render the STR Ledger brand asset pack from canonical SVG sources.

Outputs PNG variants at target dimensions for Etsy, web, and Excel use.
Uses Playwright (headless Chromium) so SVG fonts/layout render identically
to a real browser. Run with the repo root as the working directory.

Source SVGs:  design-system/assets/
Output:       brand/assets/
"""

from __future__ import annotations

import io
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "design-system" / "assets"
OUT = REPO / "brand" / "assets"
OUT.mkdir(parents=True, exist_ok=True)

NAVY = "#12304E"
PARCHMENT = "#F6EFE2"
GOLD = "#C9A24B"


def _wrap_svg(svg_text: str, width: int, height: int, background: str | None = None) -> str:
    """Inline SVG inside an HTML page sized to exact pixel dimensions."""
    bg = f"background:{background};" if background else ""
    return f"""<!doctype html><html><head><meta charset="utf-8">
<style>
  html,body{{margin:0;padding:0;{bg}}}
  body{{width:{width}px;height:{height}px;display:block;}}
  svg{{display:block;width:{width}px;height:{height}px;}}
</style></head><body>{svg_text}</body></html>"""


def _render_html_to_png(html: str, width: int, height: int, out_path: Path,
                         page, transparent: bool = False) -> None:
    page.set_viewport_size({"width": width, "height": height})
    page.set_content(html, wait_until="load")
    # Tiny settle for font swap
    page.wait_for_timeout(150)
    png = page.screenshot(
        full_page=False,
        omit_background=transparent,
        clip={"x": 0, "y": 0, "width": width, "height": height},
    )
    out_path.write_bytes(png)
    print(f"  -> {out_path.relative_to(REPO)}  ({width}x{height})")


def render_from_svg(name: str, src_filename: str, width: int, height: int,
                     page, background: str | None = None,
                     transparent: bool = False) -> None:
    src = (SRC / src_filename).read_text(encoding="utf-8")
    html = _wrap_svg(src, width, height, background=background)
    _render_html_to_png(html, width, height, OUT / name, page, transparent=transparent)


def render_etsy_banner(page) -> None:
    """1600x213 navy banner — wordmark left, gold rule, tagline right."""
    svg = f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 213" width="1600" height="213">
  <rect width="1600" height="213" fill="{NAVY}"/>
  <!-- Wordmark zone, left -->
  <text x="64" y="115" font-family="Cormorant Garamond, Georgia, serif"
        font-style="italic" font-weight="400" font-size="34"
        fill="{PARCHMENT}">The</text>
  <text x="64" y="170" font-family="Cormorant Garamond, Georgia, serif"
        font-weight="500" font-size="78" fill="{PARCHMENT}"
        letter-spacing="-1.5">STR Ledger<tspan fill="{GOLD}">.</tspan></text>
  <!-- Gold vertical rule -->
  <line x1="660" y1="60" x2="660" y2="153" stroke="{GOLD}" stroke-width="1.5"/>
  <!-- Tagline zone, right -->
  <text x="700" y="100" font-family="Inter, sans-serif" font-weight="600"
        font-size="22" fill="{PARCHMENT}" letter-spacing="2">RUN YOUR RENTALS</text>
  <text x="700" y="135" font-family="Inter, sans-serif" font-weight="600"
        font-size="22" fill="{PARCHMENT}" letter-spacing="2">BEFORE THEY RUN YOU.</text>
  <text x="700" y="170" font-family="Inter, sans-serif" font-weight="400"
        font-size="13" fill="{GOLD}" letter-spacing="3">THESTRLEDGER.COM</text>
</svg>"""
    html = _wrap_svg(svg, 1600, 213)
    _render_html_to_png(html, 1600, 213, OUT / "etsy-banner-1600x213.png", page)


def render_excel_cover(page) -> None:
    """1000x400 two-band cover — navy top with wordmark, parchment bottom."""
    svg = f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 400" width="1000" height="400">
  <rect width="1000" height="200" fill="{NAVY}"/>
  <rect y="200" width="1000" height="200" fill="{PARCHMENT}"/>
  <!-- Wordmark in top band -->
  <text x="500" y="95" text-anchor="middle"
        font-family="Cormorant Garamond, Georgia, serif"
        font-style="italic" font-weight="400" font-size="32"
        fill="{PARCHMENT}">The</text>
  <text x="500" y="170" text-anchor="middle"
        font-family="Cormorant Garamond, Georgia, serif"
        font-weight="500" font-size="72" fill="{PARCHMENT}"
        letter-spacing="-1">STR Ledger<tspan fill="{GOLD}">.</tspan></text>
  <!-- Gold rule between bands -->
  <line x1="0" y1="200" x2="1000" y2="200" stroke="{GOLD}" stroke-width="2"/>
  <!-- Tagline in bottom band -->
  <text x="500" y="270" text-anchor="middle" font-family="Inter, sans-serif"
        font-weight="500" font-size="16" fill="{NAVY}" letter-spacing="3">
    RUN YOUR RENTALS BEFORE THEY RUN YOU
  </text>
  <line x1="450" y1="295" x2="550" y2="295" stroke="{GOLD}" stroke-width="1.5"/>
  <text x="500" y="340" text-anchor="middle" font-family="Inter, sans-serif"
        font-weight="400" font-size="12" fill="{NAVY}" letter-spacing="4">
    THESTRLEDGER.COM
  </text>
</svg>"""
    html = _wrap_svg(svg, 1000, 400)
    _render_html_to_png(html, 1000, 400, OUT / "excel-cover-1000x400.png", page)


THUMBNAIL_DEFAULTS = {
    "category": "STR TEMPLATE",
    "headline": "[Product Headline]",
    "sub_headline": "Formula-tight. Schedule E-ready. Built for 3–10 properties.",
    "badge_primary": "EXCEL + GOOGLE SHEETS",
    "badge_secondary": "INSTANT DOWNLOAD",
    "trust_line": "Instant Download · 14-Day Refund · Lifetime Updates",
}


CLAY_ROSE = "#B5725E"


def _includes_card_svg(items: list[str]) -> str:
    """Render Zone 3 (1200x900 at x=400 y=490) as an includes-card.

    Clay Rose title bar + parchment-alt body with checkmark bullets.
    Up to 8 items render cleanly; longer lists truncate.
    """
    items = items[:8]
    n = len(items)
    # Card frame
    parts = [
        f'<rect x="400" y="490" width="1200" height="900" rx="20" '
        f'fill="#FAF4E6" stroke="{CLAY_ROSE}" stroke-width="3"/>',
        # Title bar
        f'<path d="M 400 510 L 400 580 L 1600 580 L 1600 510 '
        f'A 20 20 0 0 0 1580 490 L 420 490 A 20 20 0 0 0 400 510 Z" '
        f'fill="{CLAY_ROSE}"/>',
        f'<text x="1000" y="548" text-anchor="middle" '
        f'font-family="Inter, sans-serif" font-weight="600" font-size="28" '
        f'fill="{PARCHMENT}" letter-spacing="6">WHAT\'S INCLUDED</text>',
    ]
    # Bullet rows — evenly spaced from y=660 to y=1340
    if n > 0:
        top, bottom = 660, 1340
        step = (bottom - top) / max(n - 1, 1) if n > 1 else 0
        for i, item in enumerate(items):
            y = int(top + i * step)
            # Escape HTML-special chars conservatively (text only).
            safe = (item.replace("&", "&amp;")
                          .replace("<", "&lt;").replace(">", "&gt;"))
            parts.append(
                f'<g transform="translate(490, {y - 22})">'
                f'  <circle cx="0" cy="22" r="20" fill="{GOLD}"/>'
                f'  <path d="M -10 22 L -3 30 L 12 14" stroke="{NAVY}" '
                f'stroke-width="4" fill="none" stroke-linecap="round" '
                f'stroke-linejoin="round"/>'
                f'</g>'
                f'<text x="540" y="{y + 8}" font-family="Inter, sans-serif" '
                f'font-weight="500" font-size="32" fill="{NAVY}">{safe}</text>'
            )
    return "\n    ".join(parts)


def thumbnail_svg(*, category: str, headline: str, sub_headline: str,
                   badge_primary: str, badge_secondary: str = "INSTANT DOWNLOAD",
                   trust_line: str = THUMBNAIL_DEFAULTS["trust_line"],
                   includes: list[str] | None = None) -> str:
    """Build the 2000x2000 thumbnail composition as inline SVG.

    Zone map per brand/canva-specs.md §Asset 3.
    Per-product thumbnails swap headline/sub_headline/badge only.
    """
    # Headline word wrap: split into 2 lines if >22 chars, else single line.
    # Category sits at y=235; headline starts well below to avoid overlap.
    if len(headline) > 22:
        words = headline.split()
        midpoint = (len(words) + 1) // 2
        line1 = " ".join(words[:midpoint])
        line2 = " ".join(words[midpoint:])
        headline_block = (
            f'<text x="1000" y="288" text-anchor="middle" '
            f'font-family="Cormorant Garamond, Georgia, serif" font-weight="500" '
            f'font-size="44" fill="{NAVY}" letter-spacing="-0.5">{line1}</text>'
            f'<text x="1000" y="338" text-anchor="middle" '
            f'font-family="Cormorant Garamond, Georgia, serif" font-weight="500" '
            f'font-size="44" fill="{NAVY}" letter-spacing="-0.5">{line2}</text>'
        )
    else:
        headline_block = (
            f'<text x="1000" y="320" text-anchor="middle" '
            f'font-family="Cormorant Garamond, Georgia, serif" font-weight="500" '
            f'font-size="58" fill="{NAVY}" letter-spacing="-0.5">{headline}</text>'
        )

    # Mockup zone (Zone 3): either the workbook preview (default for hero
    # thumbnails) or an includes-card (when `includes` is provided — used for
    # thumbnail #5 across the catalog).
    if includes is not None:
        mockup = _includes_card_svg(includes)
    else:
        mockup = f"""
    <!-- Mockup frame: laptop-screen styling -->
    <rect x="400" y="490" width="1200" height="900" rx="14" fill="#FFFFFF"
          stroke="#D8C9A8" stroke-width="2"/>
    <!-- Window chrome bar -->
    <rect x="400" y="490" width="1200" height="40" rx="14" fill="#EFE5D0"/>
    <rect x="400" y="510" width="1200" height="20" fill="#EFE5D0"/>
    <circle cx="425" cy="510" r="6" fill="#D86A6A"/>
    <circle cx="450" cy="510" r="6" fill="#E0B66B"/>
    <circle cx="475" cy="510" r="6" fill="#7AB87A"/>
    <!-- Header row (Excel-ish) -->
    <rect x="400" y="530" width="1200" height="80" fill="{NAVY}"/>
    <text x="1000" y="582" text-anchor="middle" font-family="Inter, sans-serif"
          font-weight="600" font-size="22" fill="{PARCHMENT}" letter-spacing="2">
      THE STR LEDGER  ·  WORKBOOK PREVIEW
    </text>
    <!-- Column headers -->
    <rect x="400" y="610" width="1200" height="50" fill="#F6EFE2"/>
    <text x="445" y="643" font-family="Inter, sans-serif" font-weight="600"
          font-size="18" fill="{NAVY}" letter-spacing="1">DATE</text>
    <text x="650" y="643" font-family="Inter, sans-serif" font-weight="600"
          font-size="18" fill="{NAVY}" letter-spacing="1">DESCRIPTION</text>
    <text x="1080" y="643" font-family="Inter, sans-serif" font-weight="600"
          font-size="18" fill="{NAVY}" letter-spacing="1">CATEGORY</text>
    <text x="1340" y="643" font-family="Inter, sans-serif" font-weight="600"
          font-size="18" fill="{NAVY}" letter-spacing="1">AMOUNT</text>
    <text x="1520" y="643" font-family="Inter, sans-serif" font-weight="600"
          font-size="18" fill="{NAVY}" letter-spacing="1">YTD</text>
    <!-- Data rows -->""" + "".join(
        f"""
    <rect x="400" y="{660 + i * 64}" width="1200" height="64"
          fill="{'#FFFFFF' if i % 2 == 0 else '#FAF4E6'}"/>
    <text x="445" y="{700 + i * 64}" font-family="Inter, sans-serif" font-size="18"
          fill="#2B2B2B">{date}</text>
    <text x="650" y="{700 + i * 64}" font-family="Inter, sans-serif" font-size="18"
          fill="#2B2B2B">{desc}</text>
    <rect x="1070" y="{678 + i * 64}" width="180" height="28" rx="14"
          fill="{'#EFE5D0' if cat_color == 'parchment' else '#F2E5C0'}"/>
    <text x="1160" y="{697 + i * 64}" text-anchor="middle"
          font-family="Inter, sans-serif" font-weight="600" font-size="14"
          fill="{NAVY}" letter-spacing="1">{cat}</text>
    <text x="1340" y="{700 + i * 64}" font-family="JetBrains Mono, monospace"
          font-size="18" fill="{NAVY}">{amt}</text>
    <text x="1520" y="{700 + i * 64}" font-family="JetBrains Mono, monospace"
          font-weight="600" font-size="18" fill="{NAVY}">{ytd}</text>"""
        for i, (date, desc, cat, cat_color, amt, ytd) in enumerate([
            ("01/04", "Cleaning – HostHelpers Co.",      "OPS",   "parchment", "  $185.00",  " $185.00"),
            ("01/07", "Stripe payout (4 nights)",        "REV",   "gold",      "$1,420.00",  "$1,605.00"),
            ("01/11", "Mileage – supply run (38 mi)",    "TAX",   "gold",      "   $26.60",  "$1,631.60"),
            ("01/15", "Furniture replacement",            "CAPEX", "parchment", "  $402.00",  "$2,033.60"),
            ("01/18", "Stripe payout (3 nights)",        "REV",   "gold",      "$1,065.00",  "$3,098.60"),
            ("01/22", "Insurance – Q1 premium",          "INS",   "parchment", "  $312.00",  "$3,410.60"),
            ("01/25", "Schedule E export ✓",              "TAX",   "gold",      "        —",  "       —"),
            ("01/29", "Cleaning – Sparkle Crew",          "OPS",   "parchment", "  $165.00",  "$3,575.60"),
            ("02/02", "Quarterly tax deposit",            "TAX",   "gold",      "  $850.00",  "$4,425.60"),
        ])
    ) + f"""
    <!-- Footer summary bar -->
    <rect x="400" y="1320" width="1200" height="70" fill="{NAVY}"/>
    <text x="445" y="1364" font-family="Inter, sans-serif" font-weight="600"
          font-size="18" fill="{PARCHMENT}" letter-spacing="2">NET CASH FLOW · YTD</text>
    <text x="1555" y="1364" text-anchor="end" font-family="JetBrains Mono, monospace"
          font-weight="700" font-size="22" fill="{GOLD}">$4,425.60</text>"""

    return f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000"
     width="2000" height="2000">
  <!-- Base canvas -->
  <rect width="2000" height="2000" fill="{PARCHMENT}"/>

  <!-- ZONE 1 — Top strip (navy, brand) -->
  <rect width="2000" height="200" fill="{NAVY}"/>
  <text x="80" y="118" font-family="Cormorant Garamond, Georgia, serif"
        font-style="italic" font-weight="400" font-size="36" fill="{PARCHMENT}">The</text>
  <text x="80" y="170" font-family="Cormorant Garamond, Georgia, serif"
        font-weight="500" font-size="58" fill="{PARCHMENT}" letter-spacing="-1">
    STR Ledger<tspan fill="{GOLD}">.</tspan>
  </text>
  <text x="1920" y="120" text-anchor="end" font-family="JetBrains Mono, Consolas, monospace"
        font-weight="400" font-size="20" fill="{PARCHMENT}" letter-spacing="3">
    THESTRLEDGER.COM
  </text>

  <!-- ZONE 2 — Headline -->
  <text x="1000" y="240" text-anchor="middle" font-family="Inter, sans-serif"
        font-weight="500" font-size="18" fill="{GOLD}" letter-spacing="6">{category}</text>
  {headline_block}
  <rect x="970" y="368" width="60" height="3" fill="{GOLD}"/>

  <!-- ZONE 3 — Mockup -->
  {mockup}

  <!-- ZONE 4 — Sub-headline -->
  <text x="1000" y="1590" text-anchor="middle" font-family="Inter, sans-serif"
        font-weight="400" font-size="30" fill="#2B2B2B">{sub_headline}</text>

  <!-- ZONE 5 — Format badges -->
  <rect x="700" y="1670" width="380" height="72" rx="36" fill="{GOLD}"/>
  <text x="890" y="1716" text-anchor="middle" font-family="Inter, sans-serif"
        font-weight="600" font-size="20" fill="{NAVY}" letter-spacing="2">{badge_primary}</text>
  <rect x="1110" y="1670" width="240" height="72" rx="36"
        fill="none" stroke="{GOLD}" stroke-width="2"/>
  <text x="1230" y="1716" text-anchor="middle" font-family="Inter, sans-serif"
        font-weight="600" font-size="18" fill="{GOLD}" letter-spacing="2">{badge_secondary}</text>

  <!-- ZONE 6 — Bottom strip (gold CTA) -->
  <rect y="1760" width="2000" height="240" fill="{GOLD}"/>
  <text x="1000" y="1900" text-anchor="middle" font-family="Inter, sans-serif"
        font-weight="600" font-size="32" fill="{NAVY}" letter-spacing="1">{trust_line}</text>
</svg>"""


def render_thumbnail(out_path: Path, page, **kwargs) -> None:
    """Render a single 2000x2000 thumbnail. Pass override fields as kwargs."""
    fields = {**THUMBNAIL_DEFAULTS, **kwargs}
    svg = thumbnail_svg(**fields)
    html = _wrap_svg(svg, 2000, 2000)
    _render_html_to_png(html, 2000, 2000, out_path, page)


def build_favicon_ico() -> None:
    """Bundle multi-size ICO from the rendered favicon PNGs."""
    sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    images = []
    for w, h in sizes:
        path = OUT / f"favicon-{w}.png"
        if path.exists():
            images.append(Image.open(path).convert("RGBA"))
    if images:
        ico_path = OUT / "favicon.ico"
        images[0].save(ico_path, format="ICO",
                        sizes=[(im.width, im.height) for im in images])
        print(f"  -> {ico_path.relative_to(REPO)}  (multi-size)")


def main() -> None:
    print(f"Rendering brand asset pack -> {OUT.relative_to(REPO)}")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(device_scale_factor=1)
        page = context.new_page()

        print("Logos (square + horizontal variants)")
        # Square variants - monogram on transparent + navy bg
        render_from_svg("logo-square-transparent.png", "monogram-filled.svg",
                         1000, 1000, page, transparent=True)
        render_from_svg("logo-square-navy-bg.png", "monogram-filled.svg",
                         1000, 1000, page, background=NAVY)
        render_from_svg("logo-square-outline.png", "monogram-outline.svg",
                         1000, 1000, page, transparent=True)

        # Horizontal wordmarks
        render_from_svg("logo-horizontal-parchment-bg.png", "wordmark-on-parchment.svg",
                         1000, 400, page)
        render_from_svg("logo-horizontal-navy-bg.png", "wordmark-on-navy.svg",
                         1000, 400, page)

        print("Etsy shop assets")
        # Etsy shop icon (500x500 from monogram, transparent bg outside circle)
        render_from_svg("etsy-shop-icon-500.png", "monogram-filled.svg",
                         500, 500, page, transparent=True)
        render_etsy_banner(page)

        print("Excel cover header")
        render_excel_cover(page)

        print("Thumbnail master (2000x2000) — placeholder content")
        render_thumbnail(
            OUT / "thumbnail-master-2000x2000.png", page,
            category="STR TEMPLATE",
            headline="Product Headline Goes Here",
            sub_headline="Sub-headline / one-line value prop swaps per product.",
            badge_primary="EXCEL + GOOGLE SHEETS",
        )

        print("Per-SKU hero thumbnails (Wave 1 + Wave 2)")
        from thumbnail_configs import LAUNCH_WAVE, PHASE_2
        for sku, cfg in LAUNCH_WAVE.items():
            out_dir = REPO / "templates" / "_delivery" / sku
            out_dir.mkdir(parents=True, exist_ok=True)
            render_thumbnail(out_dir / "thumb-1.png", page, **cfg)

        print("Per-SKU hero thumbnails (Phase 2)")
        for sku, cfg in PHASE_2.items():
            out_dir = REPO / "templates" / "_delivery" / sku
            out_dir.mkdir(parents=True, exist_ok=True)
            render_thumbnail(out_dir / "thumb-1.png", page, **cfg)

        print("Per-SKU hero thumbnails (TAX block: TAX-004..TAX-013)")
        from thumbnail_configs import TAX_BLOCK, PHASE_3, INCLUDES_CARDS
        for sku, cfg in TAX_BLOCK.items():
            out_dir = REPO / "templates" / "_delivery" / sku
            out_dir.mkdir(parents=True, exist_ok=True)
            render_thumbnail(out_dir / "thumb-1.png", page, **cfg)

        print("Per-SKU hero thumbnails (Phase 3 — ACQ-004..008, OPS-002..005, LGL-001)")
        for sku, cfg in PHASE_3.items():
            out_dir = REPO / "templates" / "_delivery" / sku
            out_dir.mkdir(parents=True, exist_ok=True)
            render_thumbnail(out_dir / "thumb-1.png", page, **cfg)

        print("Per-SKU hero thumbnails (Phase 4 — FIN-003..005, GST-002..003, REV-002..004, MKT-002..003)")
        from thumbnail_configs import PHASE_4
        for sku, cfg in PHASE_4.items():
            out_dir = REPO / "templates" / "_delivery" / sku
            out_dir.mkdir(parents=True, exist_ok=True)
            render_thumbnail(out_dir / "thumb-1.png", page, **cfg)

        print("Per-SKU hero thumbnails (Phase 5 — ACQ-009..011, LGL-002, OPS-006, PAM-001/002, REV-005, STR-002/003)")
        from thumbnail_configs import PHASE_5
        for sku, cfg in PHASE_5.items():
            out_dir = REPO / "templates" / "_delivery" / sku
            out_dir.mkdir(parents=True, exist_ok=True)
            render_thumbnail(out_dir / "thumb-1.png", page, **cfg)

        print("Per-SKU hero thumbnails (Phase 6 — final 13: ACQ-012, FIN-002/006/007, LGL-003/004, OPS-007/008, PAM-003/004, REV-006, SPC-001/002)")
        from thumbnail_configs import PHASE_6
        for sku, cfg in PHASE_6.items():
            out_dir = REPO / "templates" / "_delivery" / sku
            out_dir.mkdir(parents=True, exist_ok=True)
            render_thumbnail(out_dir / "thumb-1.png", page, **cfg)

        print("Per-SKU includes-card thumbnails (#5)")
        # Hero copy spans all six waves — full 65-SKU catalog.
        all_hero_cfg = {**LAUNCH_WAVE, **PHASE_2, **TAX_BLOCK, **PHASE_3, **PHASE_4, **PHASE_5, **PHASE_6}
        for sku, items in INCLUDES_CARDS.items():
            out_dir = REPO / "templates" / "_delivery" / sku
            out_dir.mkdir(parents=True, exist_ok=True)
            base = all_hero_cfg[sku]
            render_thumbnail(
                out_dir / "thumb-5.png", page,
                category=base["category"],
                headline="What You Get",
                sub_headline=base["sub_headline"],
                badge_primary=base["badge_primary"],
                includes=items,
            )

        print("Favicons")
        for size in [16, 32, 48, 64, 180, 192, 512]:
            render_from_svg(f"favicon-{size}.png", "favicon.svg",
                             size, size, page, transparent=True)

        browser.close()

    build_favicon_ico()
    print("Done.")


if __name__ == "__main__":
    main()
