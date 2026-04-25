"""Bundle the dev renderer (HTML + CSS + JS + fonts + demo JSON) into a
single self-contained welcome-book-renderer.html file.

Usage:
    python build-renderer.py

Outputs:
    welcome-book-renderer.html
"""
from pathlib import Path
import base64
import json
import sys

BASE = Path(__file__).resolve().parent
ASSETS = BASE / "_assets"
OUT = BASE / "welcome-book-renderer.html"


def read(path, binary=False):
    mode = "rb" if binary else "r"
    encoding = None if binary else "utf-8"
    return path.read_bytes() if binary else path.read_text(encoding=encoding)


def font_face_block():
    fonts = [
        ("Cormorant Garamond", 500, "normal", "cormorant-500.woff2"),
        ("Cormorant Garamond", 500, "italic", "cormorant-500-italic.woff2"),
        ("Inter",              400, "normal", "inter-400.woff2"),
        ("Inter",              500, "normal", "inter-500.woff2"),
        ("JetBrains Mono",     400, "normal", "jetbrainsmono-400.woff2"),
    ]
    out = []
    for family, weight, style, fname in fonts:
        path = ASSETS / "fonts" / fname
        if not path.exists():
            print(f"WARN: missing font {fname}; skipping", file=sys.stderr)
            continue
        b64 = base64.b64encode(path.read_bytes()).decode("ascii")
        out.append(f"""@font-face {{
  font-family: "{family}";
  font-weight: {weight};
  font-style: {style};
  src: url(data:font/woff2;base64,{b64}) format("woff2");
  font-display: swap;
}}""")
    return "\n".join(out)


def build():
    css_bits = [
        font_face_block(),
        read(ASSETS / "renderer.css"),
        read(ASSETS / "themes" / "magazine.css"),
        read(ASSETS / "themes" / "editorial.css"),
        read(ASSETS / "themes" / "hotel.css"),
    ]
    css = "\n\n".join(css_bits)

    sheetjs = read(ASSETS / "sheetjs.min.js")
    qrcode_js = read(ASSETS / "qrcode.min.js")
    renderer_js = read(ASSETS / "renderer.js")

    # Demo JSON embedded as a <script type="application/json"> block
    demo_raw = read(ASSETS / "demo-data.json")

    # Patch renderer.js: change fetch("demo-data.json") to read from embedded JSON
    renderer_js_patched = renderer_js.replace(
        'async function loadDemoData(url, onDataReady) {',
        'async function loadDemoData(url, onDataReady) {\n'
        '  if (url === "demo-data.json") {\n'
        '    const el = document.getElementById("embedded-demo");\n'
        '    if (el) { onDataReady(parseDemoData(JSON.parse(el.textContent)), '
        '"demo-data.json (embedded)"); return; }\n'
        '  }'
    )

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1200">
<title>Welcome Book Renderer — The STR Ledger</title>
<style>
{css}
</style>
</head>
<body>
<div id="app"></div>
<script type="application/json" id="embedded-demo">
{demo_raw}
</script>
<script>
{sheetjs}
</script>
<script>
{qrcode_js}
</script>
<script>
{renderer_js_patched}
</script>
</body>
</html>
"""
    OUT.write_text(html, encoding="utf-8")
    size_kb = OUT.stat().st_size / 1024
    print(f"Wrote {OUT.name} — {size_kb:.0f}KB")
    if size_kb > 1500:
        print(f"WARN: file exceeds 1.5MB target")
        sys.exit(2)


if __name__ == "__main__":
    build()
