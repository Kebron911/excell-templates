# First 5 Etsy Products — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and launch 5 Etsy listings (Welcome Book, Turnover Checklist, Mileage Log, 1099-NEC Tracker, P&L Lite) on Etsy + Gumroad in 14 days, meeting master spec §12 milestone "Week 2: Etsy revenue > $0".

**Architecture:** Claude drafts every artifact (briefs, sheet specs, Excel `.xlsx` files via Python/openpyxl, thumbnail design specs, companion + license PDFs, listing copy, upload checklists). Daniel reviews at gates, executes Etsy/Gumroad UI actions, and builds final PNGs/PDFs in Vista Create from Claude's specs. Two-wave rollout: Wave 1 (3 content-type SKUs) live Day 7; Wave 2 (2 formula-type SKUs) live Day 14.

**Tech Stack:**
- Python 3.10+ with `openpyxl` for Excel file generation
- Vista Create Pro for brand assets + thumbnails + branded PDFs
- Etsy seller UI for listings (no API at MVP stage)
- Gumroad UI for mirror
- Cloudflare Registrar + Google Workspace for domain + email
- Git for all committed artifacts

**Parent design:** [2026-04-22-first-5-etsy-products-design.md](../specs/2026-04-22-first-5-etsy-products-design.md)
**Master strategy:** [2026-04-22-str-tax-platform-design.md](../specs/2026-04-22-str-tax-platform-design.md)
**Template SOP:** [template-production-process.md](../../runbooks/template-production-process.md)

---

## The 5 products (master spec §10)

| # | SKU | Product | Tier | Etsy price | Own-site price | Wave |
|---|---|---|---|---|---|---|
| 1 | GST-001 | Airbnb Welcome Book | T1 | $17 | $17 (same) | Wave 1 |
| 2 | OPS-001 | Cleaner Turnover Checklist + Scorecard | T1 | $12 | $17 | Wave 1 |
| 3 | TAX-001 | STR Mileage Log | T1 | $17 | $17 (same) | Wave 1 |
| 4 | TAX-003 | 1099-NEC Contractor Tracker | T1 | $17 | $17 (same) | Wave 2 |
| 5 | TAX-002 | Single-Property P&L Tracker (Lite) | T2 | $27 | $97 (full) | Wave 2 |

---

## Gate schedule

| Gate | Day | Pass condition |
|---|---|---|
| G1 | 2 | Prereqs done: domain + Etsy account + Vista Create specs |
| G2 | 4 | Wave 1 briefs approved; 3 Excel masters built; initial QA pass |
| G3 | 6 | Wave 1 listings copy finalized; 3 thumb sets built in Vista Create; test purchase succeeded |
| **G4** | **7** | **Wave 1 live on Etsy (first sale possible)** |
| G5 | 11 | Wave 2 briefs approved; 2 Excel masters built; P&L Lite variant built; formulas QA'd cell-for-cell |
| G6 | 13 | Wave 2 listing copy finalized; 2 thumb sets built; A12 SEO pass complete on all 5 |
| **G7** | **14** | **Wave 2 live on Etsy + A13 PDF bundled + A14 Gumroad mirror live** |

---

## File structure (what this plan creates/modifies)

### Created
```
brand/
  assets/                                # PNG + SVG exports from Vista Create (Daniel)
    logo-square.png, logo-horizontal.png
    etsy-banner.png (1600×213)
    etsy-icon.png (500×500)
    thumbnail-master.png (2000×2000 base)
    excel-cover-1000x400.png
  design-links.md                         # Vista Create template URLs

infrastructure/
  etsy/
    shop-setup.md                        # Shop URL, bank, 2FA status, listing fee refs
    listing-ids.md                       # Live listing IDs once uploaded
  gumroad/
    setup.md

templates/
  _briefs/
    GST-001-welcome-book.md              # Brief for Welcome Book
    GST-001-welcome-book-spec.md         # Sheet-by-sheet spec
    OPS-001-turnover-checklist.md
    OPS-001-turnover-checklist-spec.md
    TAX-001-mileage-log.md
    TAX-001-mileage-log-spec.md
    TAX-003-1099-nec-tracker.md
    TAX-003-1099-nec-tracker-spec.md
    TAX-002-pl-single-property.md
    TAX-002-pl-single-property-spec.md
  _masters/
    GST-001-welcome-book.xlsx
    OPS-001-turnover-checklist.xlsx
    TAX-001-mileage-log.xlsx
    TAX-003-1099-nec-tracker.xlsx
    TAX-002-pl-single-property.xlsx      # Full (for Gumroad)
  _lite/
    TAX-002-pl-single-property-lite.xlsx # Lite (for Etsy only)
  _delivery/
    _shared/
      etsy-upgrade-insert.md             # Source markdown for A13 PDF
      etsy-upgrade-insert.pdf            # Vista Create-built (Daniel)
      license-template.md                # Shared license source
    GST-001-welcome-book/
      thumbnails.md                      # 5-image spec + preview specs
      GST-001-howto.pdf                  # Vista Create-built from claude source
      GST-001-license.pdf
    OPS-001-turnover-checklist/ ...
    TAX-001-mileage-log/ ...
    TAX-003-1099-nec-tracker/ ...
    TAX-002-pl-single-property/ ...
  _build/
    build_all.py                         # Python entry point
    build_welcome_book.py                # Per-product openpyxl script
    build_turnover_checklist.py
    build_mileage_log.py
    build_1099_nec_tracker.py
    build_pl_single_property.py
    brand_config.py                      # Shared colors, fonts, helpers
    requirements.txt

copy/etsy-listings/
  OPS-001-turnover-checklist.md          # New listing (fresh)
  (existing 4 files get refreshed in place)
```

### Modified (existing files)
```
copy/etsy-listings/GST-001-welcome-book.md         # Refresh after brief
copy/etsy-listings/TAX-001-mileage-log.md          # Refresh after brief
copy/etsy-listings/TAX-003-1099-nec-tracker.md     # Refresh after brief
copy/etsy-listings/TAX-002-single-property-pl-lite.md  # Refresh after brief
ops/credentials-inventory.md                        # Add Etsy, Gumroad, Cloudflare, Workspace
```

---

## Phase 0 — Setup (pre-Day 1)

### Task 0: Directory scaffolding + Python environment

**Files:**
- Create: `templates/_briefs/`, `templates/_masters/`, `templates/_lite/`, `templates/_delivery/_shared/`, `templates/_build/`, `infrastructure/etsy/`, `infrastructure/gumroad/`, `brand/assets/`
- Create: `templates/_build/requirements.txt`
- Create: `templates/_build/brand_config.py`

- [ ] **Step 1: Verify directories exist**

Run:
```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
ls templates/
```

Expected output lists: `_briefs`, `_delivery`, `_lite`, `_masters`. If `_build` missing, create it:
```bash
mkdir -p templates/_build
```

- [ ] **Step 2: Create Python requirements file**

Write `templates/_build/requirements.txt`:
```
openpyxl==3.1.5
pillow==10.4.0
```

- [ ] **Step 3: Install Python dependencies**

Run:
```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates/templates/_build"
python -m pip install -r requirements.txt
```

Expected: `Successfully installed openpyxl-3.1.5 pillow-10.4.0` (or "already satisfied").

- [ ] **Step 4: Create brand_config.py with palette and helpers**

Write `templates/_build/brand_config.py`:
```python
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
    """widths is a list of (col_letter, width) pairs."""
    for col, w in widths:
        ws.column_dimensions[col].width = w

def add_upgrade_banner(ws, row):
    """Place a prominent upgrade CTA on the given row."""
    ws.cell(row=row, column=1, value=(
        f"💡 Upgrade to the Full version at {BRAND_DOMAIN}/upgrade "
        f"— multi-property, depreciation, multi-LLC support."
    ))
    ws.cell(row=row, column=1).font = Font(
        name=FONT_BODY, size=11, bold=True, color="FFFFFF"
    )
    ws.cell(row=row, column=1).fill = PatternFill("solid", fgColor=COLOR_ACCENT)
    ws.cell(row=row, column=1).alignment = Alignment(
        horizontal="center", vertical="center", wrap_text=True
    )
    ws.row_dimensions[row].height = 30
```

- [ ] **Step 5: Commit scaffolding**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_build/requirements.txt templates/_build/brand_config.py
git commit -m "build: Python env + brand_config helpers for Excel generation"
```

---

## Phase 1 — Prereqs (Days 1–2)

### Task 1: A2 — Register domain + set up email

**Files:**
- Modify: `brand/brand-decisions.md` (append "Domain confirmed" date)
- Create: `ops/credentials-inventory.md` (append Cloudflare + Workspace rows; file may already exist)

**Owner:** Daniel executes (purchase, DNS, Workspace signup). Claude produces the exact checklist.

**Acceptance criteria:** `thestrledger.com` resolves; test email sent to `hello@thestrledger.com` from another address arrives within 5 minutes.

- [ ] **Step 1: Purchase domain at Cloudflare Registrar**

Go to https://dash.cloudflare.com/ → Sign up or log in → left nav → Domain Registration → Register Domain → search `thestrledger.com`.

If available: click Purchase. Cost: ~$10/year. Enable WHOIS privacy (default).
If taken: fall back to `strledger.co` or `thestrledger.io`; document choice in `brand/brand-decisions.md`.

- [ ] **Step 2: Configure DNS in Cloudflare**

Cloudflare dashboard → select thestrledger.com → DNS → Records → Add record.

Add the following records (6 records):

| Type | Name | Target/Value | TTL | Proxy |
|---|---|---|---|---|
| A | @ | 192.0.2.1 | Auto | DNS only (gray cloud) |
| CNAME | www | thestrledger.com | Auto | DNS only |
| MX | @ | ASPMX.L.GOOGLE.COM | Auto | Priority 1 |
| MX | @ | ALT1.ASPMX.L.GOOGLE.COM | Auto | Priority 5 |
| MX | @ | ALT2.ASPMX.L.GOOGLE.COM | Auto | Priority 5 |
| TXT | @ | v=spf1 include:_spf.google.com ~all | Auto | — |

Note: The A record is a placeholder (192.0.2.1 is RFC 5737 documentation space). It gets updated to the real hub IP during Lane B (out of scope here).

- [ ] **Step 3: Sign up for Google Workspace**

Go to https://workspace.google.com → Get Started → Business Starter ($6/user/month).

Setup wizard:
- Business name: The STR Ledger
- Number of employees: 1
- Country: United States
- Primary domain: `thestrledger.com` (use existing — you own it)
- Admin email (will become): `hello@thestrledger.com` (Google Workspace lets you set the admin email to any alias)
- Payment method: credit card

Workspace will provide a TXT verification record — add it as a 7th record in Cloudflare DNS.

After verification (usually <5 min), create user: `hello@thestrledger.com`.

- [ ] **Step 4: Add DKIM for deliverability (important)**

Workspace Admin console → Apps → Google Workspace → Gmail → Authenticate email → Generate new record → copy the DKIM TXT record → add to Cloudflare DNS as TXT record named `google._domainkey`.

Wait 10 minutes, then click "Start authentication" in Admin console.

- [ ] **Step 5: Send test email**

From another account (personal Gmail, etc.), send an email to `hello@thestrledger.com` with subject "domain test". Confirm it arrives in the Workspace inbox within 5 minutes.

- [ ] **Step 6: Update credentials inventory**

If `ops/credentials-inventory.md` does not exist, create it:
```markdown
# Credentials Inventory

All credentials stored in Vaultwarden (self-hosted, Bitwarden-compatible). This file tracks *what exists*, not the credentials themselves.

## Accounts

| System | Owner-of-record | Account identifier | 2FA | Notes |
|---|---|---|---|---|
| Cloudflare | Daniel | (email in Vaultwarden) | Yes | Registrar + DNS |
| Google Workspace | Daniel | hello@thestrledger.com | Yes | $6/user/mo |
```

If it exists, append rows to the Accounts table for Cloudflare and Workspace.

- [ ] **Step 7: Update brand-decisions.md with confirmation**

Append to `brand/brand-decisions.md`:
```markdown
## Domain + email — confirmed 2026-04-22
- Domain: thestrledger.com (Cloudflare Registrar, renewed annually ~$10)
- DNS: Cloudflare (MX for Workspace, A placeholder until Lane B)
- Email: hello@thestrledger.com (Google Workspace Business Starter)
- DKIM: enabled
- Test email: delivered successfully
```

- [ ] **Step 8: Commit**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add brand/brand-decisions.md ops/credentials-inventory.md
git commit -m "infra: register thestrledger.com, provision Workspace email"
```

---

### Task 2: A3 — Open Etsy seller account

**Files:**
- Create: `infrastructure/etsy/shop-setup.md`
- Modify: `ops/credentials-inventory.md` (append Etsy row)

**Owner:** Daniel executes (account creation requires SSN/EIN + bank account). Claude produces checklist.

**Acceptance criteria:** Etsy shop exists in "not yet public" state with bank + tax info submitted, 2FA enabled, preferences configured.

- [ ] **Step 1: Open Etsy seller signup**

Go to https://www.etsy.com/sell. Click "Get started".

Use email `hello@thestrledger.com`. Create Etsy account password (save to Vaultwarden).

Skip any "Would you like to buy on Etsy?" prompts — go straight to seller setup.

- [ ] **Step 2: Configure shop preferences**

Preferences screen:
- Language: English (United States)
- Country of shop: United States
- Currency: USD
- Part-time vs full-time: Part-time (can be changed later; lower fee visibility)

- [ ] **Step 3: Set shop name**

Shop name screen: `thestrledger` (lowercase, no spaces — Etsy URL-friendly). If "thestrledger" is taken, try `thestrledgerco` or `strledger`.

Etsy will reserve the URL `etsy.com/shop/thestrledger`. Save reserved name before continuing.

- [ ] **Step 4: Submit payment + bank info**

Skip the "add a listing" step for now (we'll do listings via Task 15 + 25).

Etsy → Shop Manager → Finances → Payment settings:
- Business type: Sole proprietor (simplest; change to LLC later without penalty)
- Personal info: legal name, DOB, SSN or EIN
- Bank account: US bank, account + routing number
- Billing card: for listing fees

Etsy issues a 1099-K annually; expect one in January if gross sales > $600 (2026 threshold).

- [ ] **Step 5: Enable 2FA**

Account → Security → Two-factor authentication → Authenticator app (NOT SMS — SMS is vulnerable to SIM-swap).

Use the same authenticator app you use for Cloudflare/Workspace (e.g., Bitwarden mobile/desktop — which syncs with your Vaultwarden — Authy, or Google Authenticator). Scan QR, enter 6-digit code, save backup codes to Vaultwarden AND print a copy offline.

- [ ] **Step 6: Create shop-setup.md**

Write `infrastructure/etsy/shop-setup.md`:
```markdown
# Etsy Shop Setup — The STR Ledger

**Status:** Account open. Shop preferences set. Bank + tax submitted. 2FA enabled. Awaiting first listings (Task 15).

**Shop URL:** https://etsy.com/shop/thestrledger
**Account email:** hello@thestrledger.com
**Business type:** Sole proprietor (may convert to LLC later without penalty)
**Tax ID:** SSN (or EIN if already formed LLC)
**Bank:** (details in Vaultwarden)
**2FA:** Enabled — authenticator app
**Payment processing:** Etsy Payments (built-in; 3% + $0.25 per transaction on top of 6.5% transaction fee)

## Fees to expect

| Fee | Rate | When |
|---|---|---|
| Listing fee | $0.20 | Per listing, every 4 months on renewal |
| Transaction fee | 6.5% | On item price (not shipping for digital) |
| Payment processing | 3% + $0.25 | Per transaction |
| Regulatory operating fee (US) | 0.35% | Per transaction |

On a $17 sale, Etsy keeps ~$1.77 + $0.25 processing = ~$2.02 (~12%). Net to shop: ~$14.98.

## Listing ID tracker

Maintained in `infrastructure/etsy/listing-ids.md` after first upload.

## Post-launch actions (out of scope for this plan)

- Apply for Etsy Plus ($10/mo) after 10 reviews (unlocks listing credits + shop customization)
- Turn on Etsy Ads ($1/day test budget) after Day 30 if organic views < 50/day
- Renew each listing every 4 months for freshness signal
```

- [ ] **Step 7: Append Etsy to credentials inventory**

Edit `ops/credentials-inventory.md` Accounts table — add:
```markdown
| Etsy (seller) | Daniel | hello@thestrledger.com / shop: thestrledger | Yes | Sole prop; bank info in password mgr |
```

- [ ] **Step 8: Commit**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add infrastructure/etsy/shop-setup.md ops/credentials-inventory.md
git commit -m "infra: open Etsy seller account, configure bank + 2FA"
```

---

### Task 3: A4 — Vista Create brand asset pack specs

**Files:**
- Create: `brand/design-specs.md`
- Create: `brand/design-links.md`
- Create (by Daniel via Vista Create): `brand/assets/` (5 PNG/SVG files)

**Owner:** Claude writes exact specs. Daniel builds in Vista Create Pro (5 assets × ~30 min each = ~2.5 hrs).

**Acceptance criteria:** All 5 assets exist in `brand/assets/` as PNG (and SVG where applicable). Vista Create URLs recorded. All assets match brand palette from `brand/brand-decisions.md`.

- [ ] **Step 1: Claude writes the Vista Create spec sheet**

Write `brand/design-specs.md`:
```markdown
# Vista Create Asset Pack — Exact Build Specs

**Build order:** Logo first (needed by all others) → thumbnail master → Etsy banner → Etsy icon → Excel cover.

**Brand kit setup in Vista Create Pro (do once):**
1. Vista Create → Brand Hub → Brand Kits → New brand kit → name "The STR Ledger"
2. Add colors:
   - Primary: #0E2A47 (navy)
   - Secondary: #C9A875 (warm tan)
   - Accent: #2E6B4F (deep green)
   - Text: #1C1C1C
   - Muted: #6B7280
   - Bg light: #F7F4EE
3. Add fonts:
   - Heading: Playfair Display (bold) — verify in Vista Create's font library; if missing, upload `.ttf` (Google Fonts, free)
   - Body: Inter (regular + semibold) — verify in Vista Create's font library; if missing, upload `.ttf` (Google Fonts, free)
   - Mono: JetBrains Mono (if not available in Vista Create, upload .ttf or fall back to Courier Prime)
4. Upload logo files here once Asset 1 is done.

---

## Asset 1 — Logo (square + horizontal variants)

**Square (1000×1000px):**
- Background: white (#FFFFFF) or transparent PNG
- Centered wordmark: "The STR Ledger"
  - Font: Playfair Display Bold
  - Color: #0E2A47 (primary)
  - Size: auto-fit
- Under wordmark: thin 2px line, color #C9A875, 60% width centered
- Below line: "Excel systems for serious STR hosts" in Inter Regular, #6B7280, size 18pt
- Top-right corner (optional small monogram "SL" in a tan circle, 80px — nice but skippable for MVP)

**Horizontal (2000×500px):**
- Left 40%: square monogram "SL" in tan circle on navy background
- Right 60%: "The STR Ledger" in Playfair Display Bold, #0E2A47, with tagline below
- Padding: 80px left/right

**Export:**
- PNG (transparent background) for each: `brand/assets/logo-square.png`, `brand/assets/logo-horizontal.png`
- SVG: `brand/assets/logo-square.svg`, `brand/assets/logo-horizontal.svg`

---

## Asset 2 — Thumbnail master (2000×2000px, reusable)

This is the single most important asset. Each of 25 product thumbnails inherits this structure.

**Layout grid:**
- Top banner strip: 200px tall, navy (#0E2A47), full width
  - Left: small logo (180px wide)
  - Right: "thestrledger.com" in Inter Regular 16pt, white (#FFFFFF)
- Main area: 1600px tall, cream (#F7F4EE), full width
  - Mockup slot: center, 1200×900px (for Excel/PDF screenshots)
  - Headline zone above mockup: 1400px wide, 200px tall
    - Font: Playfair Display Bold 72pt
    - Color: #0E2A47
    - Max 2 lines
  - Sub-headline zone below mockup: 1400px wide, 80px tall
    - Font: Inter Semibold 28pt
    - Color: #6B7280
  - Format badge (bottom-right of mockup): pill shape, tan bg (#C9A875), white text "Editable Excel + PDF"
- Bottom strip: 200px tall, tan (#C9A875), full width
  - Centered: "Instant Download · 14-Day Refund · Lifetime Updates" — Inter Semibold 22pt, navy text

**Export master as Vista Create template** (not final PNG — product thumbnails will clone this).

---

## Asset 3 — Etsy shop banner (1600×213px)

- Background: gradient navy (#0E2A47) → accent green (#2E6B4F), left to right
- Left side (50%): logo horizontal variant on transparent, 800×200
- Right side (50%): tagline block
  - Line 1: "Business-grade Excel systems for serious STR hosts" — Playfair Display 24pt, white
  - Line 2: "Tax workbooks · Portfolio P&Ls · Cleaner tracking · Ops" — Inter Regular 14pt, #F7F4EE
- Padding: 40px around

**Export:** `brand/assets/etsy-banner.png`

---

## Asset 4 — Etsy shop icon (500×500px)

- Square, navy (#0E2A47) background
- Centered: tan (#C9A875) circle, 350px diameter
- Inside circle: "SL" monogram in Playfair Display Bold 140pt, navy (#0E2A47)

**Export:** `brand/assets/etsy-icon.png`

---

## Asset 5 — Excel cover page (1000×400px)

Embedded as an image on the "Welcome" / "How to Use" tab of every product Excel.

- Background: cream (#F7F4EE)
- Left 35%: logo horizontal variant, centered vertically, 300×100
- Vertical divider: 2px line, tan (#C9A875), 80% height
- Right 65%: text block, left-aligned
  - Line 1 (product name — CHANGES per product): Playfair Display Bold 36pt, navy
  - Line 2: "The STR Ledger · thestrledger.com" — Inter Regular 12pt, muted
  - Line 3 (small): "You've got the file. Let's put it to work." — Inter Italic 11pt, muted

**Export:** `brand/assets/excel-cover-1000x400.png` (this is the generic; per-product override uses Vista Create dupes — but MVP uses the same cover for all 5)

---

## Vista Create production checklist (Daniel)

- [ ] Brand kit created with colors + fonts
- [ ] Logo designed (square + horizontal)
- [ ] Thumbnail master template saved
- [ ] Etsy banner exported
- [ ] Etsy icon exported
- [ ] Excel cover exported
- [ ] All 5 files live in `brand/assets/`
- [ ] Vista Create URLs captured in `brand/design-links.md`
```

- [ ] **Step 2: Claude writes the Vista Create links template**

Write `brand/design-links.md`:
```markdown
# Vista Create Template URLs

> Daniel: paste Vista Create edit URLs here after each asset is built. These URLs let future updates reuse the same template.

| Asset | Vista Create URL | Dimensions | Exported to |
|---|---|---|---|
| Logo (square) | (paste after build) | 1000×1000 | `brand/assets/logo-square.png` |
| Logo (horizontal) | (paste after build) | 2000×500 | `brand/assets/logo-horizontal.png` |
| Thumbnail master | (paste after build) | 2000×2000 | (Vista Create-only; per-product thumbs clone this) |
| Etsy shop banner | (paste after build) | 1600×213 | `brand/assets/etsy-banner.png` |
| Etsy shop icon | (paste after build) | 500×500 | `brand/assets/etsy-icon.png` |
| Excel cover (generic) | (paste after build) | 1000×400 | `brand/assets/excel-cover-1000x400.png` |
```

- [ ] **Step 3: Commit specs (before Daniel builds)**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add brand/design-specs.md brand/design-links.md
git commit -m "brand: Vista Create asset pack specs + link tracker"
```

- [ ] **Step 4: Daniel builds 5 assets in Vista Create Pro**

Daniel opens Vista Create Pro, follows `brand/design-specs.md` step by step. Build order: logo → thumbnail master → banner → icon → Excel cover.

Time budget: ~30 min each = ~2.5 hrs total. Can be split across Days 2–3.

- [ ] **Step 5: Daniel exports to `brand/assets/`**

For each asset:
- Vista Create → Share → Download → PNG (transparent where applicable)
- For SVG: Share → Download → SVG (Vista Create Pro only)
- Save to `brand/assets/<filename>.png` per specs.

- [ ] **Step 6: Daniel updates design-links.md with real URLs + commit**

Daniel edits `brand/design-links.md` replacing `(paste after build)` with actual Vista Create URLs. Then:

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add brand/design-links.md brand/assets/
git commit -m "brand: Vista Create asset pack built and exported"
```

---

### Task 4: A5 — Paste shop about + policies into Etsy

**Files:** No file changes — this is Etsy UI work only.

**Owner:** Daniel executes. Copy already exists in `copy/etsy-listings/shop-about.md` + `shop-policies.md`.

**Acceptance criteria:** Etsy shop's About section and Policies section render the drafted copy; shop announcement banner is set; shop icon + banner are uploaded.

- [ ] **Step 1: Upload shop banner + icon**

Etsy Shop Manager → Shop customization → "Customize your shop".
- Upload `brand/assets/etsy-banner.png` to Banner slot
- Upload `brand/assets/etsy-icon.png` to Shop icon slot
- Save.

- [ ] **Step 2: Set shop announcement**

Shop customization → Announcement → paste the 250-char announcement from `copy/etsy-listings/shop-about.md`:

```
Business-grade Excel systems for serious Airbnb & VRBO hosts. Tax workbooks, portfolio P&Ls, cleaner tracking, and more — all delivered instantly.
```

Save.

- [ ] **Step 3: Set shop About section**

Shop Manager → Settings → Info & appearance → About → Story.

Paste the multi-paragraph body from `copy/etsy-listings/shop-about.md` (lines 7-11):
```
The STR Ledger builds Excel systems for short-term rental hosts who treat their property portfolio like a real business — not a side hustle, not a lifestyle experiment, but a serious operation that happens to be on Airbnb and VRBO.

Our templates are the tools we built for ourselves after years of trying to bolt QuickBooks onto an STR portfolio and watching it fail: wrong categories, missing deductions, no way to track per-property margins, and no answer when our CPA asked "where are your books?" Everything here is Excel-native, built for hosts, and priced so the template pays for itself on the first use.

Everything is a digital download. You'll have it in your inbox the moment you check out.
```

Save.

- [ ] **Step 4: Set shop Policies**

Shop Manager → Settings → Policies → edit each section.

Paste from `copy/etsy-listings/shop-policies.md`:
- Delivery section (line 7): "All products are instant digital downloads. Your files appear immediately after payment in your Etsy account under 'Purchases & reviews' and as a download link in your confirmation email."
- Refunds section (line 11): "14-day refund on any single template, no questions asked. Bundle and Vault purchases have 30-day and 60-day windows respectively (see product pages). If you can't open the file or it doesn't work on your Excel version, contact us first — we'll fix it."
- Privacy section (line 30): "We only use your Etsy email to deliver your purchase and answer support questions. We don't sell, rent, or share it. If you opt into our newsletter from a download, you can unsubscribe any time with one click."
- Intellectual property section (line 34): "Each template is licensed for use by one business (you). You're free to use it across as many properties as you own or manage. You may not redistribute, resell, or include it in your own paid products without written permission."

Save.

- [ ] **Step 5: Verify rendered output**

Open `https://etsy.com/shop/thestrledger` in an incognito window. Confirm:
- Banner + icon render at correct dimensions (no cropping)
- Announcement appears at top of shop
- About section shows 3 paragraphs
- Policies page is complete (Delivery / Refunds / File compatibility / Support / Privacy / IP)

- [ ] **Step 6: Update shop-setup.md**

Edit `infrastructure/etsy/shop-setup.md` — change Status line:
```markdown
**Status:** Shop customized. About + Policies live. Banner + icon uploaded. Awaiting listings (Task 15).
```

Commit:
```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add infrastructure/etsy/shop-setup.md
git commit -m "etsy: paste shop about + policies; upload banner + icon"
```

---

## ✅ Gate G1 (Day 2)

**Pass condition:** A2 domain resolves + MX live; A3 Etsy account approved; A4 Vista Create specs delivered (Daniel may still be exporting PNGs — that continues into Day 3).

**Check:** run these three verifications before proceeding to Wave 1 production:
1. `dig thestrledger.com MX` returns Google MX records
2. Etsy shop URL loads: `https://etsy.com/shop/thestrledger`
3. `ls brand/design-specs.md brand/design-links.md` both exist

If any fail: fix before starting Task 5.

---

## Phase 2 — Wave 1 Production (Days 3–6)

Wave 1 ships Welcome Book, Turnover Checklist, and Mileage Log. For each product we produce 10 deliverables (brief → spec → Excel → Lite(if applicable) → thumbnail specs → preview specs → how-to PDF → license PDF → listing copy → upload checklist).

**Product-level pattern (same for all 5 across Waves 1 and 2):**
1. Claude writes brief
2. Daniel reviews brief (15 min)
3. Claude writes sheet spec
4. Claude writes Excel build script + generates `.xlsx`
5. Daniel QA's Excel in Excel 2016+ on Windows (30-60 min)
6. Claude writes thumbnail specs
7. Claude writes how-to PDF source
8. Claude writes license PDF source (uses shared template after first use)
9. Claude finalizes listing copy (refresh 4 existing; write 1 fresh)
10. Daniel builds thumbnail PNGs + how-to PDF in Vista Create
11. Wave-level publish happens at G4 (Day 7) or G7 (Day 14)

Tasks 5–7 apply this pattern to GST-001 Welcome Book in full detail. Tasks 8–13 apply the same pattern to the other Wave 1 products (Turnover Checklist, Mileage Log) — references to the Welcome Book pattern are explicit, but full content for each product is inline so the executing agent does not need to read tasks out of order.

---

### Task 5: GST-001 Welcome Book — Brief + Spec

**Files:**
- Create: `templates/_briefs/GST-001-welcome-book.md`
- Create: `templates/_briefs/GST-001-welcome-book-spec.md`

**Acceptance criteria:** both files exist, committed, and Daniel has reviewed the brief (indicated by a second commit marking approval).

- [ ] **Step 1: Claude writes the brief**

Write `templates/_briefs/GST-001-welcome-book.md`:
```markdown
# Brief — GST-001 Airbnb Welcome Book

**SKU:** GST-001
**Category:** Guest Experience (master spec §3.2 D)
**Tier:** T1
**Etsy price:** $17
**Own-site price:** $17 (same — gateway product)
**Wave:** 1

## Target persona

**Primary:** Side-Hustle Sam (1–2 listings, W2 + STR) — his first Etsy purchase, impulse buy.
**Secondary:** Newbie Nina (1 listing, just launching) — needs a welcome book NOW.
**Tertiary:** Semi-Pro Sarah (3–10 listings) — will buy 3–10 copies, one per property; discovers our shop and climbs the ladder.

## The one specific pain

"My guests keep emailing me at 11pm asking about wifi, trash day, or the hot tub. I've been sending them a Google Doc I made 2 years ago that looks unprofessional and doesn't even cover everything."

## What this template does

A guest-facing welcome book — editable Excel with matching PDF — that covers the 9 sections hosts wish their guests would read *before* the 11pm question. Designed to look professional, print cleanly, and work digitally via QR code.

## Sheets / Tabs

| # | Tab | Role | Input or Output |
|---|---|---|---|
| 1 | "Welcome" | Cover page + how-to | Input: property name, host first name, dates of stay |
| 2 | "Arrival" | Check-in instructions | Input: address, door code, parking details |
| 3 | "WiFi + Tech" | Network + smart-device info | Input: wifi name/pw, TV/streaming, smart lock |
| 4 | "House Rules" | Rules with section headers | Input: quiet hours, smoking, pet policy, max guests |
| 5 | "Local Guide" | Restaurant/coffee/groceries/emergencies | Input: business name, distance, phone, notes |
| 6 | "Trash + Recycling" | Pickup schedule + bin location | Input: day of week, where bins live, sorting rules |
| 7 | "Departure" | Checkout checklist | Input: checkout time, key return method, last-minute tasks |
| 8 | "Emergency" | Hospital, police, 24-hr vet, utility outages | Input: phone numbers, addresses |
| 9 | "Host Reference" | Private tab for host (host-only notes) | Input: things not to share with guest, vendor list |

## Inputs (what the host types)

All cells in sheets 1–8 that get printed/shared with guests are input cells (yellow-tinted per brand_config). Sheet 9 is host-only and not part of the guest-facing PDF.

Approximate input fields per tab: 8–15. Total inputs across workbook: ~80 fields.

## Outputs (what gets calculated/derived)

Welcome Book is *mostly content*, not formulas. Two light outputs:
1. **Sheet 1 "Welcome" — auto-display host's name + property name** in title line via cell reference `=WelcomeSheetA1!PropertyName`
2. **Sheet 7 "Departure" — checkout countdown:** if user enters a checkout date in sheet 1, sheet 7 displays `"Departure day: <weekday>"` via TEXT(checkoutDate, "dddd") formula

## External data references

None. No IRS rates, no API calls. Pure content template.

## Business logic

- Print-ready: when printed, the "Host Reference" tab must be hidden. Include a note on sheet 1 that sheet 9 is host-only.
- Three delivery modes: (a) printed and placed in property, (b) sent as PDF via email, (c) QR code on a placard pointing to a hosted PDF.
- Template must work for any rental type — single-family, cabin, condo, glamping. Avoid overly-specific wording like "in your beach house".

## QA sample data

For QA, populate with a fake property:
- Property name: "Smokies Ridge Cabin"
- Host: "Daniel"
- Address: "123 Mountain Lane, Gatlinburg, TN 37738"
- WiFi: "SmokiesRidge_Guest" / "welcome2024"
- Checkout: 2026-05-15

All 9 tabs should populate coherently with this sample.

## Upgrade CTA

On Sheet 1 Welcome tab, row 18 (after the sample-usage instructions), place the branded upgrade banner (from `brand_config.add_upgrade_banner`). Copy reads:

> 💡 Upgrade path: Get the Multi-Property Welcome Book Bundle at thestrledger.com/bundle — welcome books for every property in one workbook + a printable guest QR-code pack.

(Note: the Multi-Property Bundle is a Phase 2+ product — this CTA captures intent for the email list.)

## Out-of-scope

- Property photos (hosts add their own post-download)
- Language translation (English only for MVP)
- Multi-property consolidation (Phase 2+ Bundle)
- Interactive / fillable PDF (MVP is Excel + print/QR-code-hosted PDF)
```

- [ ] **Step 2: Claude writes the sheet spec**

Write `templates/_briefs/GST-001-welcome-book-spec.md`:
```markdown
# Sheet Spec — GST-001 Airbnb Welcome Book

## Workbook-level

- Filename: `GST-001-welcome-book.xlsx`
- Tab colors: navy (#0E2A47) for guest-facing (tabs 1-8), tan (#C9A875) for host-only (tab 9)
- Print area: each tab has print area set to fit 1 page letter-portrait (except Local Guide which is 2 pages)
- Freeze panes: row 4 frozen on all tabs (brand header stays visible)
- Default font: Calibri 11pt body; Georgia 20pt bold for tab titles
- Workbook protection: NONE (all cells must be editable by buyer)

## Sheet 1 — "Welcome"

| Row | Col A | Col B | Col C |
|---|---|---|---|
| 1 | [Title: "Welcome to {PropertyName}"] (merged A1:C1, brand header via apply_brand_header) | | |
| 2 | [Subtitle: "Your stay, at a glance"] | | |
| 3 | [Brand row: "The STR Ledger · thestrledger.com"] | | |
| 4 | BLANK spacer row (height 12) | | |
| 5 | "Property name:" | {PropertyName — input} | |
| 6 | "Host:" | {HostFirstName — input} | |
| 7 | "Host phone (text preferred):" | {HostPhone — input} | |
| 8 | "Check-in date:" | {CheckInDate — input, format d-mmm-yyyy} | |
| 9 | "Check-out date:" | {CheckOutDate — input, format d-mmm-yyyy} | |
| 10 | BLANK | | |
| 11 | "How to use this book" (bold, size 14) | | |
| 12-16 | Numbered bullet list (content) | | |
| 17 | BLANK | | |
| 18 | Upgrade banner (full-width merged A18:C18, add_upgrade_banner) | | |
| 19 | BLANK | | |
| 20 | "Host note: Sheet 'Host Reference' is for your eyes only — hide it before sharing." (italic, muted) | | |

Input cells: B5, B6, B7, B8, B9. Style: input_cell_style().

Formula cells: A1 references B5 via formula `="Welcome to " & Welcome!B5`. That is a light dependency; if property not filled, A1 reads "Welcome to " which is acceptable for print.

Column widths: A=22, B=35, C=22.

## Sheet 2 — "Arrival"

| Row | Col A | Col B |
|---|---|---|
| 1-3 | Brand header (apply_brand_header, title "Arrival & Check-in") | |
| 4 | BLANK | |
| 5 | "Full address:" | {Address — input, wrap text} |
| 6 | "Entry method:" | {EntryMethod — dropdown: Smart lock, Key lockbox, In-person, Other} |
| 7 | "Door/lock code:" | {EntryCode — input} |
| 8 | "Parking instructions:" | {ParkingInfo — input, wrap text, 3 lines min} |
| 9 | "Best route (if tricky):" | {RouteNotes — input, wrap text} |
| 10 | "Arrival time window:" | {ArrivalWindow — input, e.g., "After 3 PM"} |
| 11 | "What to do if you arrive early:" | {EarlyArrivalOption — input} |
| 12-15 | "First 5 minutes inside" checklist bullets | Content |

Data validation: cell B6 dropdown list = "Smart lock, Key lockbox, In-person, Other".

Column widths: A=28, B=55.

Print area: A1:B16.

## Sheet 3 — "WiFi + Tech"

| Row | Col A | Col B |
|---|---|---|
| 1-3 | Brand header (title "WiFi & Technology") | |
| 5 | "WiFi network name:" | {WifiName — input} |
| 6 | "WiFi password:" | {WifiPassword — input} |
| 7 | "Backup network (if any):" | {WifiBackup — input} |
| 8 | "TV streaming — service + login:" | {TVLogin — input, wrap text} |
| 9 | "Smart lock code (if different from entry):" | {SmartLockCode — input} |
| 10 | "Smart thermostat notes:" | {ThermostatNotes — input, wrap text} |
| 11 | "How to adjust volume/inputs on TV:" | {TVControls — input, wrap text} |
| 12 | "Who to call if WiFi fails:" | {WifiSupport — input} |

Style: password-like cells (B6, B7, B9) have slightly-larger font (13pt bold) so guests can read them across the room.

## Sheet 4 — "House Rules"

| Row | Col A | Col B |
|---|---|---|
| 1-3 | Brand header (title "House Rules") | |
| 5 | "Quiet hours:" | {QuietHours — input, e.g., "10 PM – 7 AM"} |
| 6 | "Maximum guests:" | {MaxGuests — input number} |
| 7 | "Smoking:" | {SmokingPolicy — dropdown: No smoking, No smoking inside, Smoking OK in designated area} |
| 8 | "Pets:" | {PetPolicy — dropdown: No pets, Pets OK with deposit, Pets OK no deposit} |
| 9 | "Events/parties:" | {EventsPolicy — dropdown: No events, Small gatherings OK with notice, OK} |
| 10 | "Shoes inside:" | {ShoesPolicy — dropdown: Remove at door, OK, Preferred removed} |
| 11 | "Additional custom rules:" | {CustomRules — multi-line input, 10 rows tall} |

Data validation: dropdowns as specified.

## Sheet 5 — "Local Guide"

Grid table — 5 columns × 20 rows. Categories in column A, fill left-to-right.

| Col A | Col B | Col C | Col D | Col E |
|---|---|---|---|---|
| Category | Name | Distance | Phone | Why we love it |
| Coffee | | | | |
| Coffee | | | | |
| Restaurant | | | | |
| Restaurant | | | | |
| Restaurant | | | | |
| Grocery | | | | |
| Grocery | | | | |
| Takeout | | | | |
| Takeout | | | | |
| Pharmacy | | | | |
| Gas station | | | | |
| Hospital/Urgent care | | | | |
| Coffee alt | | | | |
| Outdoor/Hike | | | | |
| Outdoor/Hike | | | | |
| Kid-friendly | | | | |
| Kid-friendly | | | | |
| Date night | | | | |
| Bar/Nightlife | | | | |
| Emergency (non-911) | | | | |

Pre-filled Category column (column A). All other cells are input. Column widths: A=18, B=28, C=10, D=14, E=40.

Print area spans 2 pages.

## Sheet 6 — "Trash + Recycling"

| Row | Col A | Col B |
|---|---|---|
| 1-3 | Brand header (title "Trash, Recycling & Maintenance") | |
| 5 | "Trash pickup day:" | {TrashDay — dropdown: Mon/Tue/Wed/Thu/Fri/Sat/Sun + "No pickup — dumpster on-site"} |
| 6 | "Bin location:" | {BinLocation — input} |
| 7 | "Recycling accepted:" | {RecyclingAccepted — input, wrap} |
| 8 | "What goes in which bin:" | {SortingRules — input, wrap} |
| 9 | "Where to put bins on pickup morning:" | {PickupLocation — input} |
| 10 | "HVAC/thermostat range to leave:" | {ThermostatRange — input, e.g., "68-75°F"} |
| 11 | "If the power goes out:" | {PowerOutageNotes — input, wrap} |

## Sheet 7 — "Departure"

| Row | Col A | Col B |
|---|---|---|
| 1-3 | Brand header (title "Checkout") | |
| 5 | "Checkout time:" | {CheckoutTime — input, e.g., "11 AM"} |
| 6 | "Checkout day:" | Formula `=IF(Welcome!B9<>"", TEXT(Welcome!B9,"dddd, mmmm d"), "See Welcome tab")` |
| 7 | BLANK | |
| 8 | "Before you leave — please:" (bold) | |
| 9 | "☐ Strip bed linens and leave in {LinenLocation}" | {LinenLocation — input} |
| 10 | "☐ Run the dishwasher" | |
| 11 | "☐ Take trash + recycling to {TrashFinalSpot}" | {TrashFinalSpot — input} |
| 12 | "☐ Turn thermostat to {CheckoutThermostat}" | {CheckoutThermostat — input, e.g., "72°F"} |
| 13 | "☐ Lock all doors + windows" | |
| 14 | "☐ Leave key {KeyReturnMethod}" | {KeyReturnMethod — input, e.g., "in lockbox, 4321"} |
| 15 | BLANK | |
| 16 | "Custom checkout tasks:" | {CustomCheckoutTasks — input, multi-line} |

Formula on B6 demonstrates cross-sheet dependency.

## Sheet 8 — "Emergency"

| Row | Col A | Col B |
|---|---|---|
| 1-3 | Brand header (title "Emergency Contacts") | |
| 5 | "IN AN EMERGENCY — CALL 911" (red bold, size 16) | |
| 6 | BLANK | |
| 7 | "Nearest hospital:" | {HospitalName — input} |
| 8 | "Hospital phone:" | {HospitalPhone — input} |
| 9 | "Hospital address:" | {HospitalAddress — input, wrap} |
| 10 | "Urgent care:" | {UrgentCareName — input} |
| 11 | "Urgent care phone:" | {UrgentCarePhone — input} |
| 12 | "Non-emergency police:" | {NonEmergencyPolice — input} |
| 13 | "Poison control:" | "1-800-222-1222" (hardcoded, no input) |
| 14 | "24-hr vet (if pets):" | {VetPhone — input} |
| 15 | "Utility outage reporting:" | {UtilityOutagePhone — input} |
| 16 | "Host phone (call/text):" | Formula `=Welcome!B7` |

## Sheet 9 — "Host Reference" (HOST ONLY)

Tab color: tan (#C9A875). Tab name has "(hide for guests)" suffix so it's visually obvious.

| Row | Col A | Col B |
|---|---|---|
| 1-3 | Brand header (title "Host Reference — Hide Before Sharing") | |
| 5 | "Cleaner name:" | {CleanerName — input} |
| 6 | "Cleaner phone:" | {CleanerPhone — input} |
| 7 | "Handyman:" | {HandymanContact — input} |
| 8 | "Plumber:" | {PlumberContact — input} |
| 9 | "Pool/hot tub service (if any):" | {PoolService — input} |
| 10 | "Insurance policy #:" | {InsurancePolicy — input} |
| 11 | "Wifi admin password (router):" | {WifiAdminPassword — input} |
| 12 | "Smart lock master code:" | {SmartLockMaster — input} |
| 13 | "Passcodes for safes/boxes:" | {SafePasscodes — input, wrap} |
| 14 | "Things to NOT tell the guest:" | {PrivateNotes — input, wrap} |
| 15 | BLANK | |
| 16 | "REMINDER: Right-click this tab → Hide before sharing the workbook/PDF" (italic, red) | |
```

- [ ] **Step 3: Commit brief + spec**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_briefs/GST-001-welcome-book.md templates/_briefs/GST-001-welcome-book-spec.md
git commit -m "brief: GST-001 Welcome Book — brief + sheet spec"
```

- [ ] **Step 4: Daniel reviews brief (gate)**

Daniel reads both files. Confirms:
- Persona match (Sam primary, Sarah multi-property secondary)
- All 9 tabs aligned with how he'd actually want this tool
- QA sample data is realistic
- Upgrade CTA wording fits brand tone

If approved: Daniel commits approval marker:
```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git commit --allow-empty -m "approved: GST-001 brief reviewed by Daniel"
```

If changes needed: Daniel edits brief + spec directly, or lists changes in a reply for Claude to apply. Re-commit. Re-review.

---

### Task 6: GST-001 Welcome Book — Excel build

**Files:**
- Create: `templates/_build/build_welcome_book.py`
- Create: `templates/_masters/GST-001-welcome-book.xlsx` (generated)

**Acceptance criteria:** Python script runs without error; generated `.xlsx` opens in Excel 365 and Excel 2016+; all 9 tabs match spec; sample data renders; Daniel's Windows-Excel QA passes.

- [ ] **Step 1: Claude writes the build script**

Write `templates/_build/build_welcome_book.py`:
```python
"""Build GST-001 Airbnb Welcome Book Excel file.

Implements the spec at templates/_briefs/GST-001-welcome-book-spec.md.
Generates templates/_masters/GST-001-welcome-book.xlsx.

Usage:
    python build_welcome_book.py

Dependencies: openpyxl (see requirements.txt).
"""
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

from brand_config import (
    COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT, COLOR_MUTED,
    COLOR_BG_LIGHT, COLOR_ERROR, FONT_HEAD, FONT_BODY,
    apply_brand_header, input_cell_style, formula_cell_style,
    set_col_widths, add_upgrade_banner, BRAND_DOMAIN,
)

OUT = Path(__file__).resolve().parent.parent / "_masters" / "GST-001-welcome-book.xlsx"


def style_cell(cell, style_dict):
    for attr, value in style_dict.items():
        setattr(cell, attr, value)


def add_dropdown(ws, cell_ref, options):
    dv = DataValidation(
        type="list",
        formula1=f'"{",".join(options)}"',
        allow_blank=True,
    )
    dv.add(cell_ref)
    ws.add_data_validation(dv)


def build_welcome_tab(wb):
    ws = wb.active
    ws.title = "Welcome"
    ws.sheet_properties.tabColor = COLOR_PRIMARY
    set_col_widths(ws, [("A", 22), ("B", 35), ("C", 22)])

    apply_brand_header(ws, "Welcome to {PropertyName}", "Your stay, at a glance")
    # Row 4 spacer
    ws.row_dimensions[4].height = 12
    # Freeze panes at row 4
    ws.freeze_panes = "A5"

    # Input fields rows 5-9
    fields = [
        (5, "Property name:", "Smokies Ridge Cabin"),
        (6, "Host first name:", "Daniel"),
        (7, "Host phone (text preferred):", "+1 (555) 555-0199"),
        (8, "Check-in date:", "2026-05-10"),
        (9, "Check-out date:", "2026-05-15"),
    ]
    for row, label, sample in fields:
        ws.cell(row=row, column=1, value=label).font = Font(name=FONT_BODY, size=11, bold=True)
        ws.cell(row=row, column=1).alignment = Alignment(horizontal="right")
        cell = ws.cell(row=row, column=2, value=sample)
        style_cell(cell, input_cell_style())

    # Date formatting for rows 8, 9
    ws.cell(row=8, column=2).number_format = "d-mmm-yyyy"
    ws.cell(row=9, column=2).number_format = "d-mmm-yyyy"

    # Row 10 spacer
    # Row 11 header "How to use this book"
    ws.cell(row=11, column=1, value="How to use this book").font = Font(
        name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY
    )

    # Rows 12-16 usage bullets
    bullets = [
        "1. Open each tab along the bottom and fill in the yellow cells.",
        "2. When every yellow cell is filled, save as PDF: File → Save As → PDF.",
        "3. Print the PDF and leave it on the counter — or use the QR code placard.",
        "4. RIGHT-CLICK the 'Host Reference' tab → Hide before sharing with guests.",
        "5. Update anytime — this file is yours forever.",
    ]
    for i, b in enumerate(bullets, start=12):
        ws.cell(row=i, column=1, value=b).alignment = Alignment(wrap_text=True)
        ws.merge_cells(start_row=i, start_column=1, end_row=i, end_column=3)

    # Row 18 upgrade banner
    add_upgrade_banner(ws, 18)
    ws.merge_cells(start_row=18, start_column=1, end_row=18, end_column=3)

    # Row 20 host note
    ws.cell(row=20, column=1, value=(
        "Host note: The 'Host Reference' tab is for your eyes only — "
        "right-click the tab → Hide before sharing the workbook or exporting as PDF."
    )).font = Font(name=FONT_BODY, size=10, italic=True, color=COLOR_MUTED)
    ws.merge_cells(start_row=20, start_column=1, end_row=20, end_column=3)

    # Update title row 1 to reference the property name (demo of cross-sheet formula)
    ws.cell(row=1, column=1, value='=CONCATENATE("Welcome to ", B5)')

    # Print area
    ws.print_area = "A1:C20"
    ws.print_options.horizontalCentered = True
    ws.page_setup.orientation = "portrait"
    ws.page_setup.paperSize = ws.PAPERSIZE_LETTER


def build_arrival_tab(wb):
    ws = wb.create_sheet("Arrival")
    ws.sheet_properties.tabColor = COLOR_PRIMARY
    set_col_widths(ws, [("A", 28), ("B", 55)])
    apply_brand_header(ws, "Arrival & Check-in", "Everything your guest needs on day one")
    ws.row_dimensions[4].height = 12
    ws.freeze_panes = "A5"

    fields = [
        (5, "Full address:", "123 Mountain Lane, Gatlinburg, TN 37738"),
        (6, "Entry method:", "Smart lock"),
        (7, "Door/lock code:", "4321"),
        (8, "Parking instructions:", "Gravel drive on the right — there's room for 2 cars. Do not block the mailbox."),
        (9, "Best route (if tricky):", "If GPS sends you up the fire road, ignore it. Stay on Ridge Way past the red barn."),
        (10, "Arrival time window:", "After 3 PM"),
        (11, "What to do if you arrive early:", "Coffee shops in the Local Guide tab are the best bet; the lockbox won't open before 3 PM."),
    ]
    for row, label, sample in fields:
        ws.cell(row=row, column=1, value=label).font = Font(name=FONT_BODY, size=11, bold=True)
        ws.cell(row=row, column=1).alignment = Alignment(horizontal="right", vertical="top")
        cell = ws.cell(row=row, column=2, value=sample)
        style_cell(cell, input_cell_style())
        cell.alignment = Alignment(wrap_text=True, vertical="top")
        ws.row_dimensions[row].height = 40 if row in (8, 9) else 20

    # Dropdown on B6
    add_dropdown(ws, "B6", ["Smart lock", "Key lockbox", "In-person", "Other"])

    # First 5 minutes inside section
    ws.cell(row=12, column=1, value="First 5 minutes inside — what we recommend:").font = Font(
        name=FONT_HEAD, size=12, bold=True, color=COLOR_PRIMARY
    )
    ws.merge_cells(start_row=12, start_column=1, end_row=12, end_column=2)
    first_steps = [
        "1. Crank the thermostat to your comfort (settings on the WiFi tab).",
        "2. Connect to WiFi — network + password on the WiFi tab.",
        "3. Check the fridge for the welcome items.",
        "4. If anything's broken or missing, text the host immediately — easier to fix day 1.",
    ]
    for i, step in enumerate(first_steps, start=13):
        ws.cell(row=i, column=1, value=step).alignment = Alignment(wrap_text=True)
        ws.merge_cells(start_row=i, start_column=1, end_row=i, end_column=2)

    ws.print_area = "A1:B16"
    ws.page_setup.orientation = "portrait"


def build_wifi_tab(wb):
    ws = wb.create_sheet("WiFi + Tech")
    ws.sheet_properties.tabColor = COLOR_PRIMARY
    set_col_widths(ws, [("A", 32), ("B", 50)])
    apply_brand_header(ws, "WiFi & Technology", "So nobody has to text you about the wifi password")
    ws.row_dimensions[4].height = 12
    ws.freeze_panes = "A5"

    fields = [
        (5, "WiFi network name:", "SmokiesRidge_Guest"),
        (6, "WiFi password:", "welcome2024"),
        (7, "Backup network (if any):", ""),
        (8, "TV streaming — service + login:", "Netflix: already signed in. Hulu: guest@smokiesridge.com / stay2024"),
        (9, "Smart lock code (if different):", "Same as entry — 4321"),
        (10, "Smart thermostat notes:", "Nest on the hallway wall. Please keep between 65-78°F. Auto-schedule resumes after you leave."),
        (11, "How to adjust TV volume/inputs:", "The black Roku remote is the one to use. HDMI1 is Fire TV."),
        (12, "Who to call if WiFi fails:", "Host first (see Emergency tab). If no answer — Spectrum: 1-833-267-6094"),
    ]
    for row, label, sample in fields:
        ws.cell(row=row, column=1, value=label).font = Font(name=FONT_BODY, size=11, bold=True)
        ws.cell(row=row, column=1).alignment = Alignment(horizontal="right", vertical="top")
        cell = ws.cell(row=row, column=2, value=sample)
        style_cell(cell, input_cell_style())
        cell.alignment = Alignment(wrap_text=True, vertical="top")
        # Password-like cells get larger, bolder font
        if row in (6, 7, 9):
            cell.font = Font(name=FONT_MONO if False else FONT_BODY, size=13, bold=True, color=COLOR_TEXT)
        ws.row_dimensions[row].height = 36 if row in (8, 10, 11) else 22

    ws.print_area = "A1:B13"


def build_rules_tab(wb):
    ws = wb.create_sheet("House Rules")
    ws.sheet_properties.tabColor = COLOR_PRIMARY
    set_col_widths(ws, [("A", 28), ("B", 55)])
    apply_brand_header(ws, "House Rules", "Short, clear, and why each one exists")
    ws.row_dimensions[4].height = 12
    ws.freeze_panes = "A5"

    fields = [
        (5, "Quiet hours:", "10 PM – 7 AM"),
        (6, "Maximum guests:", "6"),
        (7, "Smoking:", "No smoking"),
        (8, "Pets:", "No pets"),
        (9, "Events/parties:", "No events"),
        (10, "Shoes inside:", "Remove at door"),
        (11, "Additional custom rules:", "• Hot tub closes at 10 PM\n• Please don't move furniture\n• If you break something, tell us — we'd rather fix it than discover it later"),
    ]
    for row, label, sample in fields:
        ws.cell(row=row, column=1, value=label).font = Font(name=FONT_BODY, size=11, bold=True)
        ws.cell(row=row, column=1).alignment = Alignment(horizontal="right", vertical="top")
        cell = ws.cell(row=row, column=2, value=sample)
        style_cell(cell, input_cell_style())
        cell.alignment = Alignment(wrap_text=True, vertical="top")
        if row == 11:
            ws.row_dimensions[row].height = 90

    add_dropdown(ws, "B7", ["No smoking", "No smoking inside", "Smoking OK in designated area"])
    add_dropdown(ws, "B8", ["No pets", "Pets OK with deposit", "Pets OK no deposit"])
    add_dropdown(ws, "B9", ["No events", "Small gatherings OK with notice", "OK"])
    add_dropdown(ws, "B10", ["Remove at door", "OK", "Preferred removed"])

    ws.print_area = "A1:B11"


def build_local_tab(wb):
    ws = wb.create_sheet("Local Guide")
    ws.sheet_properties.tabColor = COLOR_PRIMARY
    set_col_widths(ws, [("A", 22), ("B", 28), ("C", 10), ("D", 16), ("E", 45)])
    apply_brand_header(ws, "Local Guide", "What we'd tell a friend visiting")
    ws.row_dimensions[4].height = 12
    ws.freeze_panes = "A6"

    # Column headers row 5
    headers = ["Category", "Name", "Distance", "Phone", "Why we love it"]
    for i, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=i, value=h)
        cell.font = Font(name=FONT_BODY, size=11, bold=True, color="FFFFFF")
        cell.fill = PatternFill("solid", fgColor=COLOR_PRIMARY)
        cell.alignment = Alignment(horizontal="center", vertical="center")

    categories = [
        "Coffee", "Coffee",
        "Restaurant", "Restaurant", "Restaurant",
        "Grocery", "Grocery",
        "Takeout", "Takeout",
        "Pharmacy", "Gas station", "Hospital/Urgent care",
        "Outdoor/Hike", "Outdoor/Hike",
        "Kid-friendly", "Kid-friendly",
        "Date night", "Bar/Nightlife",
        "Emergency (non-911)",
    ]
    sample_rows = {
        "Coffee": [("Mountain Grind", "0.8 mi", "(865) 555-0100", "Best espresso in town; small pastry case fills fast")],
        "Restaurant": [("The Cast Iron", "2.1 mi", "(865) 555-0118", "Sunday brunch is chef's-kiss — reserve ahead"),
                       ("Ridge BBQ", "1.4 mi", "(865) 555-0122", "Brisket sells out by 7 PM Fri/Sat")],
    }
    for i, cat in enumerate(categories, start=6):
        ws.cell(row=i, column=1, value=cat).font = Font(name=FONT_BODY, size=11, bold=True, color=COLOR_PRIMARY)
        ws.cell(row=i, column=1).alignment = Alignment(horizontal="left")
        # Add a sample for first instance of each cat
        if cat in sample_rows and sample_rows[cat]:
            sample = sample_rows[cat].pop(0)
            for col_idx, val in enumerate(sample, start=2):
                cell = ws.cell(row=i, column=col_idx, value=val)
                style_cell(cell, input_cell_style())
                cell.alignment = Alignment(wrap_text=True, vertical="top")
        else:
            for col_idx in range(2, 6):
                cell = ws.cell(row=i, column=col_idx, value="")
                style_cell(cell, input_cell_style())
        ws.row_dimensions[i].height = 28

    ws.print_area = f"A1:E{5 + len(categories)}"
    ws.page_setup.orientation = "landscape"
    ws.print_options.horizontalCentered = True


def build_trash_tab(wb):
    ws = wb.create_sheet("Trash + Recycling")
    ws.sheet_properties.tabColor = COLOR_PRIMARY
    set_col_widths(ws, [("A", 32), ("B", 55)])
    apply_brand_header(ws, "Trash, Recycling & Maintenance", "")
    ws.row_dimensions[4].height = 12
    ws.freeze_panes = "A5"

    fields = [
        (5, "Trash pickup day:", "Thursday"),
        (6, "Bin location:", "Around the right side of the house, next to the shed"),
        (7, "Recycling accepted:", "Cardboard, plastic #1-2, aluminum. No glass."),
        (8, "What goes in which bin:", "Green = recycling, black = trash. When in doubt — trash."),
        (9, "Where to put bins on pickup morning:", "To the curb by 7 AM Thursday. Bring back Friday."),
        (10, "HVAC/thermostat range to leave:", "65-78°F — auto-schedule handles the rest"),
        (11, "If the power goes out:", "Breaker panel is in the laundry room. Sevier Electric: (865) 453-2887. Text host if it's longer than an hour."),
    ]
    for row, label, sample in fields:
        ws.cell(row=row, column=1, value=label).font = Font(name=FONT_BODY, size=11, bold=True)
        ws.cell(row=row, column=1).alignment = Alignment(horizontal="right", vertical="top")
        cell = ws.cell(row=row, column=2, value=sample)
        style_cell(cell, input_cell_style())
        cell.alignment = Alignment(wrap_text=True, vertical="top")
        ws.row_dimensions[row].height = 32

    add_dropdown(ws, "B5", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "No pickup — dumpster on-site"])

    ws.print_area = "A1:B12"


def build_departure_tab(wb):
    ws = wb.create_sheet("Departure")
    ws.sheet_properties.tabColor = COLOR_PRIMARY
    set_col_widths(ws, [("A", 40), ("B", 45)])
    apply_brand_header(ws, "Checkout", "What to do before you drive away")
    ws.row_dimensions[4].height = 12
    ws.freeze_panes = "A5"

    ws.cell(row=5, column=1, value="Checkout time:").font = Font(name=FONT_BODY, size=11, bold=True)
    cell = ws.cell(row=5, column=2, value="11:00 AM")
    style_cell(cell, input_cell_style())

    ws.cell(row=6, column=1, value="Checkout day:").font = Font(name=FONT_BODY, size=11, bold=True)
    cell = ws.cell(row=6, column=2, value='=IF(Welcome!B9<>"", TEXT(Welcome!B9,"dddd, mmmm d"), "See Welcome tab")')
    style_cell(cell, formula_cell_style())

    # Checklist
    ws.cell(row=8, column=1, value="Before you leave — please:").font = Font(
        name=FONT_HEAD, size=13, bold=True, color=COLOR_PRIMARY
    )

    checklist_rows = [
        (9, "☐ Strip bed linens and leave in:", "hallway laundry basket"),
        (10, "☐ Run the dishwasher", ""),
        (11, "☐ Take trash + recycling to:", "curb (Thursday) or dumpster on-site"),
        (12, "☐ Turn thermostat to:", "72°F"),
        (13, "☐ Lock all doors + windows", ""),
        (14, "☐ Leave key:", "in lockbox, reset to 0000"),
    ]
    for row, label, sample in checklist_rows:
        ws.cell(row=row, column=1, value=label).alignment = Alignment(wrap_text=True)
        if sample:
            cell = ws.cell(row=row, column=2, value=sample)
            style_cell(cell, input_cell_style())

    ws.cell(row=16, column=1, value="Custom checkout tasks:").font = Font(name=FONT_BODY, size=11, bold=True)
    cell = ws.cell(row=16, column=2, value="• Throw any leftover food\n• Text the host when on the road — we'll release your deposit faster")
    style_cell(cell, input_cell_style())
    cell.alignment = Alignment(wrap_text=True, vertical="top")
    ws.row_dimensions[16].height = 50

    ws.print_area = "A1:B17"


def build_emergency_tab(wb):
    ws = wb.create_sheet("Emergency")
    ws.sheet_properties.tabColor = COLOR_PRIMARY
    set_col_widths(ws, [("A", 32), ("B", 55)])
    apply_brand_header(ws, "Emergency Contacts", "Keep this one nearby")
    ws.row_dimensions[4].height = 12
    ws.freeze_panes = "A5"

    # Big red emergency header
    ws.cell(row=5, column=1, value="IN AN EMERGENCY — CALL 911").font = Font(
        name=FONT_HEAD, size=16, bold=True, color=COLOR_ERROR
    )
    ws.merge_cells(start_row=5, start_column=1, end_row=5, end_column=2)
    ws.cell(row=5, column=1).alignment = Alignment(horizontal="center")
    ws.row_dimensions[5].height = 30

    fields = [
        (7, "Nearest hospital:", "LeConte Medical Center"),
        (8, "Hospital phone:", "(865) 446-7000"),
        (9, "Hospital address:", "742 Middle Creek Rd, Sevierville, TN 37862"),
        (10, "Urgent care:", "FastMed Urgent Care"),
        (11, "Urgent care phone:", "(865) 428-1020"),
        (12, "Non-emergency police:", "(865) 436-5181"),
        (13, "Poison control:", "1-800-222-1222"),
        (14, "24-hr vet (if pets):", "Mountain Vet ER — (865) 329-1905"),
        (15, "Utility outage reporting:", "Sevier Electric: (865) 453-2887"),
    ]
    for row, label, sample in fields:
        ws.cell(row=row, column=1, value=label).font = Font(name=FONT_BODY, size=11, bold=True)
        ws.cell(row=row, column=1).alignment = Alignment(horizontal="right", vertical="top")
        cell = ws.cell(row=row, column=2, value=sample)
        # Poison control is hardcoded
        if row == 13:
            cell.font = Font(name=FONT_BODY, size=11, color=COLOR_TEXT)
        else:
            style_cell(cell, input_cell_style())
        cell.alignment = Alignment(wrap_text=True, vertical="top")

    ws.cell(row=16, column=1, value="Host phone (call/text):").font = Font(name=FONT_BODY, size=11, bold=True)
    ws.cell(row=16, column=1).alignment = Alignment(horizontal="right")
    cell = ws.cell(row=16, column=2, value="=Welcome!B7")
    style_cell(cell, formula_cell_style())

    ws.print_area = "A1:B17"


def build_host_tab(wb):
    ws = wb.create_sheet("Host Reference (HIDE)")
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 36), ("B", 55)])
    apply_brand_header(ws, "Host Reference — Hide Before Sharing", "Your private operating sheet")
    ws.row_dimensions[4].height = 12
    ws.freeze_panes = "A5"

    fields = [
        (5, "Cleaner name:", "Sarah @ Smokies Clean"),
        (6, "Cleaner phone:", "(865) 555-0145"),
        (7, "Handyman:", "Bob — (865) 555-0198"),
        (8, "Plumber:", "Ridge Plumbing — (865) 555-0177"),
        (9, "Pool/hot tub service:", "HotTub Haven — quarterly service"),
        (10, "Insurance policy #:", "ABC-1234567 (Proper Insurance)"),
        (11, "Wifi admin password (router):", "admin / router-pw-here"),
        (12, "Smart lock master code:", "9999 — not for guest use"),
        (13, "Passcodes for safes/boxes:", "Under-sink safe: 1234\nGarage keypad: 5678"),
        (14, "Things to NOT tell the guest:", "Hot tub chemistry is touchy — do not tell guests to refill. If hot tub is cloudy, call HotTub Haven."),
    ]
    for row, label, sample in fields:
        ws.cell(row=row, column=1, value=label).font = Font(name=FONT_BODY, size=11, bold=True)
        ws.cell(row=row, column=1).alignment = Alignment(horizontal="right", vertical="top")
        cell = ws.cell(row=row, column=2, value=sample)
        style_cell(cell, input_cell_style())
        cell.alignment = Alignment(wrap_text=True, vertical="top")
        ws.row_dimensions[row].height = 36 if row in (13, 14) else 22

    # Big red reminder
    ws.cell(row=16, column=1, value=(
        "⚠ RIGHT-CLICK this tab → Hide before sharing the workbook or exporting to PDF."
    )).font = Font(name=FONT_HEAD, size=12, bold=True, italic=True, color=COLOR_ERROR)
    ws.merge_cells(start_row=16, start_column=1, end_row=16, end_column=2)
    ws.cell(row=16, column=1).alignment = Alignment(horizontal="center", wrap_text=True)
    ws.row_dimensions[16].height = 30

    ws.print_area = "A1:B17"


def main():
    wb = Workbook()
    build_welcome_tab(wb)
    build_arrival_tab(wb)
    build_wifi_tab(wb)
    build_rules_tab(wb)
    build_local_tab(wb)
    build_trash_tab(wb)
    build_departure_tab(wb)
    build_emergency_tab(wb)
    build_host_tab(wb)

    # Workbook properties
    wb.properties.title = "Airbnb Welcome Book — The STR Ledger"
    wb.properties.creator = "The STR Ledger"
    wb.properties.company = "The STR Ledger"
    wb.properties.description = "Guest-facing welcome book template for Airbnb/VRBO hosts."

    OUT.parent.mkdir(parents=True, exist_ok=True)
    wb.save(OUT)
    print(f"Saved: {OUT}")


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run the build script**

Run:
```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates/templates/_build"
python build_welcome_book.py
```

Expected output: `Saved: ...templates/_masters/GST-001-welcome-book.xlsx`

- [ ] **Step 3: Verify file opens (smoke test)**

Run:
```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates/templates/_masters"
python -c "from openpyxl import load_workbook; wb = load_workbook('GST-001-welcome-book.xlsx'); print('tabs:', wb.sheetnames); assert len(wb.sheetnames) == 9; print('OK')"
```

Expected:
```
tabs: ['Welcome', 'Arrival', 'WiFi + Tech', 'House Rules', 'Local Guide', 'Trash + Recycling', 'Departure', 'Emergency', 'Host Reference (HIDE)']
OK
```

- [ ] **Step 4: Daniel opens in Excel (Windows QA)**

Daniel opens `templates/_masters/GST-001-welcome-book.xlsx` in Excel 2016+ on Windows.

QA checklist:
- [ ] All 9 tabs visible at bottom, with correct colors (navy for 1–8, tan for "Host Reference")
- [ ] Welcome tab row 1 displays "Welcome to Smokies Ridge Cabin" (formula resolves)
- [ ] Input cells (yellow) are editable; calculated cells (gray, Departure B6 + Emergency B16) are NOT editable or clearly-marked
- [ ] Dropdowns work: Arrival B6 (Smart lock etc.), House Rules B7-B10, Trash B5
- [ ] Print preview each tab: fits 1 page (except Local Guide = 2 pages acceptable)
- [ ] File opens cleanly — no security warning beyond standard unsigned-macro note (this file has no macros)
- [ ] No spelling errors in labels

If any issue: log it, fix in `build_welcome_book.py`, re-run.

- [ ] **Step 5: Commit build script + generated xlsx**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_build/build_welcome_book.py templates/_masters/GST-001-welcome-book.xlsx
git commit -m "build: GST-001 Welcome Book Excel master (9 tabs, sample-data populated)"
```

- [ ] **Step 6: Daniel commits QA approval**

After QA pass:
```bash
git commit --allow-empty -m "approved: GST-001 Welcome Book QA passed on Windows Excel 365"
```

---

### Task 7: GST-001 Welcome Book — Delivery assets + listing refresh

**Files:**
- Create: `templates/_delivery/GST-001-welcome-book/thumbnails.md`
- Create: `templates/_delivery/GST-001-welcome-book/GST-001-howto.md` (source for PDF)
- Create: `templates/_delivery/GST-001-welcome-book/GST-001-license.md` (source for PDF)
- Create (by Daniel): `templates/_delivery/GST-001-welcome-book/GST-001-howto.pdf`
- Create (by Daniel): `templates/_delivery/GST-001-welcome-book/GST-001-license.pdf`
- Create (by Daniel): `templates/_delivery/GST-001-welcome-book/thumb-1.png` through `thumb-5.png`
- Modify: `copy/etsy-listings/GST-001-welcome-book.md`

**Acceptance criteria:** 5 PNG thumbnails exist; how-to PDF exists; license PDF exists; listing copy is refreshed against real feature set (no "speculative" warning).

- [ ] **Step 1: Claude writes thumbnail specs**

Create `templates/_delivery/GST-001-welcome-book/` directory:
```bash
mkdir -p "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates/templates/_delivery/GST-001-welcome-book"
```

Write `templates/_delivery/GST-001-welcome-book/thumbnails.md`:
```markdown
# Thumbnail Specs — GST-001 Welcome Book

All 5 inherit the A4 thumbnail master. Daniel duplicates the master in Vista Create and swaps copy/mockup per image. Exports as 2000×2000 PNG.

---

## Thumbnail 1 — Hero

**Vista Create steps:** Duplicate `thumbnail-master` → rename "GST-001-thumb-1-hero".

**Content swaps:**
- Mockup slot: iPad-in-landscape mockup (Vista Create → Elements → search "iPad landscape mockup"). Layer onto the slot a screenshot of the Welcome Book PDF Sheet 1 (Daniel exports the Welcome sheet as PDF first, captures as PNG, layers into mockup).
- Headline: `Welcome Book for Serious Airbnb Hosts` (2 lines, Playfair Display Bold 72pt, navy)
- Sub-headline: `Editable Excel + PDF · Instant Download` (Inter Semibold 28pt, muted)
- Bottom strip: Keep default "Instant Download · 14-Day Refund · Lifetime Updates"

**Export:** `thumb-1.png` (2000×2000 PNG)

---

## Thumbnail 2 — What's inside (tab grid)

**Vista Create steps:** Duplicate master → rename "GST-001-thumb-2-tabs".

**Content swaps:**
- Mockup slot: 4-up grid (2×2) of 4 mini-screenshots — export these from the real Welcome Book xlsx:
  1. Arrival tab (top-left)
  2. WiFi + Tech tab (top-right)
  3. Local Guide tab (bottom-left)
  4. Departure tab (bottom-right)
  Label each in a small white pill below: "Arrival" / "WiFi + Tech" / "Local Guide" / "Departure"
- Headline: `9 Sections. Pre-Formatted. Editable.` (Playfair Display Bold 64pt, navy)
- Sub-headline: `Arrival, WiFi, House Rules, Local Guide, Departure, Emergency — and 3 more` (Inter Regular 22pt, muted)

**Export:** `thumb-2.png`

---

## Thumbnail 3 — Before / After

**Vista Create steps:** Duplicate master → rename "GST-001-thumb-3-before-after".

**Content swaps:**
- Mockup slot: split vertically 50/50
  - Left: screenshot of a messy Google Doc welcome book (Daniel builds a fake in Docs — cluttered, 1 paragraph, bad formatting — 5 min). Overlay red label: "BEFORE"
  - Right: screenshot of the Welcome Book Sheet 1. Overlay green label: "AFTER"
- Headline: `Stop Emailing Guests Google Docs.` (Playfair Display Bold 68pt, navy)
- Sub-headline: `You're running a business. Your welcome book should look like it.` (Inter Semibold 26pt, muted)

**Export:** `thumb-3.png`

---

## Thumbnail 4 — Print or digital

**Vista Create steps:** Duplicate master → rename "GST-001-thumb-4-print-digital".

**Content swaps:**
- Mockup slot: split vertically 50/50
  - Left: Vista Create "printed book" mockup (search Vista Create Elements "printed spiral book mockup") — layer Welcome Book Sheet 1 onto it
  - Right: iPhone mockup showing a QR code landing page preview (Vista Create Elements "iphone mockup"). Layer a QR code image (Vista Create → Elements → QR code) on the phone screen.
- Headline: `Print It. Frame It. QR It.` (Playfair Display Bold 72pt, navy)
- Sub-headline: `Use it how you want — it's your file.` (Inter Regular 26pt, muted)

**Export:** `thumb-4.png`

---

## Thumbnail 5 — What's included list

**Vista Create steps:** Duplicate master → rename "GST-001-thumb-5-included".

**Content swaps:**
- Mockup slot: REPLACE with a bullet list instead of a mockup. Use a tan (#C9A875) rounded-rect card in the center holding:
  ```
  ✓ Fully editable Excel workbook (9 tabs)
  ✓ Matching PDF version
  ✓ Host-only reference tab (hide before sharing)
  ✓ Dropdowns + data validation built in
  ✓ Print-ready OR digital QR code
  ✓ Bonus: emergency contacts worksheet
  ✓ Lifetime updates — it's yours forever
  ```
  Font: Inter Semibold 28pt, navy text on tan card, 60px padding
- Headline: `What You Get` (Playfair Display Bold 84pt, navy)
- Sub-headline: `Opens in Excel 2016+, Excel 365, Google Sheets` (Inter Regular 22pt, muted)

**Export:** `thumb-5.png`

---

## Preview image ("Preview in tab" — appears hovering over thumbnail)

Same as thumb-1 but wider — 2000×1500 (Etsy's preview aspect). Same content, re-exported from the same Vista Create design resized.

**Export:** `preview.png` (optional for MVP; can be added post-launch)

---

## Daniel checklist

- [ ] Export Welcome Book PDF from the .xlsx first (File → Save As → PDF). Capture each sheet as PNG (screenshot or PDF → image).
- [ ] Duplicate A4 thumbnail master in Vista Create Pro 5 times.
- [ ] Build thumbs 1–5 per specs above (~12 min each).
- [ ] Export all 5 PNGs to `templates/_delivery/GST-001-welcome-book/`.
- [ ] Commit.
```

- [ ] **Step 2: Claude writes the how-to PDF source**

Write `templates/_delivery/GST-001-welcome-book/GST-001-howto.md`:
```markdown
# How to Use Your Welcome Book

**The STR Ledger · thestrledger.com**

Thanks for grabbing the Airbnb Welcome Book. Here's how to get it up and running in 15 minutes.

---

## Step 1 — Open the file

The file is `GST-001-welcome-book.xlsx`. It opens in:
- Microsoft Excel 2016 or later (Windows + Mac)
- Excel 365
- Google Sheets (File → Import → Upload)

If you only have Apple Numbers, message us before buying — it may work, but we haven't tested it.

---

## Step 2 — Fill in the yellow cells

Yellow-tinted cells are inputs. Gray cells are calculated — leave them alone.

Go tab-by-tab:

1. **Welcome** — property name, host name, dates
2. **Arrival** — address, entry method, parking
3. **WiFi + Tech** — wifi name, password, streaming logins
4. **House Rules** — quiet hours, pets, smoking
5. **Local Guide** — your 20 favorite local spots
6. **Trash + Recycling** — pickup day, bin location
7. **Departure** — checkout time, checklist
8. **Emergency** — hospital, non-emergency police, vet

---

## Step 3 — HIDE the "Host Reference" tab before sharing

Tab 9 ("Host Reference") is YOUR private information — cleaner contacts, passwords, things not to tell the guest.

**Before exporting or sharing the workbook:**
- Right-click the "Host Reference (HIDE)" tab → Hide

Your guest should never see it.

---

## Step 4 — Export to PDF (for guests)

**Excel:** File → Save As → PDF (choose "Entire Workbook" to include all *visible* tabs).

**Google Sheets:** File → Download → PDF Document. Make sure the host-only tab is hidden first.

---

## Step 5 — Print OR digital

**Print:** Take the PDF to any print shop (Staples, FedEx, local). Have it spiral-bound or stapled. Leave it on the counter.

**Digital:** Upload the PDF to any free hosting (Google Drive shared link, Dropbox) → make a QR code at qr-code-generator.com → print the QR on a small card → leave the card on the counter.

**Hybrid:** Print a single-page emergency sheet (Tab 8), leave on fridge; put everything else behind a QR code.

---

## Questions?

Email us at **hello@thestrledger.com**. We reply within 1 business day (usually same day).

---

## Upgrade path

When you're running 3+ properties, the Multi-Property Welcome Book Bundle (coming soon at thestrledger.com/bundle) lets you manage welcome books for every property in one workbook, plus includes a printable guest-QR-code pack. Get on the list at **thestrledger.com/47** — you'll also get our free "47 Airbnb Tax Deductions Most Hosts Miss" guide.

---

© 2026 The STR Ledger · For use by one business · See license for full terms
```

- [ ] **Step 3: Claude writes the shared license source**

Write `templates/_delivery/_shared/license-template.md`:
```markdown
# License — The STR Ledger Templates

**Template:** {{TEMPLATE_NAME}} (SKU: {{SKU}})
**Licensee:** {{BUYER_NAME_OR_ETSY_USERNAME}}
**Purchase date:** {{PURCHASE_DATE}}
**License type:** Single-business use

---

## What you can do

- Use this template across every property you personally own or manage under a single business
- Edit, customize, rename cells, add tabs, add your logo
- Export to PDF and share with your guests (for guest-facing templates)
- Print as many copies as you want for your own use
- Reference it in your own internal training materials

## What you can't do

- Resell or redistribute the template (edited or unedited) as your own product
- Include it in a paid bundle, course, or coaching package without written permission
- Share the file publicly on the internet (blog, social, forum) where others can download it
- Remove the STR Ledger branding from the workbook footer or cover tab

## Property-manager exception

If you're a property manager (Pro Pam persona) and bought this template, you may use it across every property you manage, regardless of who owns them. You may not sell access to the template to owners as a standalone product.

## What happens if this template is redistributed

First offense: a kindly-worded email asking you to stop and delete your copies. Second offense: the license terminates retroactively, and we'll pursue standard IP remedies.

## Refund + satisfaction

14 days, no questions asked. If the file doesn't work on your setup or doesn't solve the problem you bought it for, email **hello@thestrledger.com** and we'll refund in full (Etsy can take up to 5 business days to return funds to your card).

## Questions

Email **hello@thestrledger.com**. Real humans, fast replies.

---

**The STR Ledger · thestrledger.com · © 2026**
```

Then write the product-specific license (substituting tokens):

Write `templates/_delivery/GST-001-welcome-book/GST-001-license.md`:
```markdown
# License — The STR Ledger Templates

**Template:** Airbnb Welcome Book (SKU: GST-001)
**Purchase date:** (populated by Etsy at delivery)
**License type:** Single-business use

---

(Remaining content identical to license-template.md with token substitution.)

## What you can do

- Use this template across every property you personally own or manage under a single business
- Edit, customize, rename cells, add tabs, add your logo
- Export to PDF and share with your guests
- Print as many copies as you want for your own use
- Reference it in your own internal training materials

## What you can't do

- Resell or redistribute the template (edited or unedited) as your own product
- Include it in a paid bundle, course, or coaching package without written permission
- Share the file publicly on the internet (blog, social, forum) where others can download it
- Remove the STR Ledger branding from the workbook footer or cover tab

## Property-manager exception

If you're a property manager (Pro Pam persona) and bought this template, you may use it across every property you manage, regardless of who owns them. You may not sell access to the template to owners as a standalone product.

## What happens if this template is redistributed

First offense: a kindly-worded email asking you to stop and delete your copies. Second offense: the license terminates retroactively, and we'll pursue standard IP remedies.

## Refund + satisfaction

14 days, no questions asked. If the file doesn't work on your setup or doesn't solve the problem you bought it for, email **hello@thestrledger.com** and we'll refund in full.

## Questions

Email **hello@thestrledger.com**. Real humans, fast replies.

---

**The STR Ledger · thestrledger.com · © 2026**
```

- [ ] **Step 4: Daniel builds the PDFs in Vista Create**

For each PDF, Daniel uses Vista Create Pro (A4 letter portrait):
- How-to PDF: paste markdown content, apply brand fonts + colors, export as PDF. Save to `templates/_delivery/GST-001-welcome-book/GST-001-howto.pdf`.
- License PDF: same process. Save to `templates/_delivery/GST-001-welcome-book/GST-001-license.pdf`.

Time: ~15 min per PDF = ~30 min total for Welcome Book PDFs.

Alternate (faster): Daniel can also use Google Docs → File → Download → PDF. Less branded but acceptable for license PDF.

- [ ] **Step 5: Refresh listing copy**

Edit `copy/etsy-listings/GST-001-welcome-book.md`:

Remove the "Status: ⚠️ SPECULATIVE" block (lines 5-10). Replace with:
```markdown
**Status:** Ready to publish. Build complete (Task 6). Delivery assets complete (Task 7). Awaiting Etsy upload (Task 15).

**Pricing:** $17 Etsy · $17 own-site (same — no Lite variant for gateway product)

**Category path on Etsy:** Digital Downloads > Other Digital Downloads > Business & Office

**Files attached (5):**
1. `GST-001-welcome-book.xlsx` — master editable file
2. `etsy-upgrade-insert.pdf` — shared buyer companion PDF (from Task 14)
3. `GST-001-howto.pdf` — how-to guide
4. `GST-001-license.pdf` — 1-page license
5. `preview.png` — optional preview image (add if available)
```

Keep the rest of the file (title, description, tags, thumbnails shot list) — those are still accurate. Verify no `<brand>` or `<domain>` tokens remain; if any, replace with "The STR Ledger" and "thestrledger.com".

Remove the "Review target before publish" checkbox block at lines 11-16 (pre-build checklist — no longer applicable).

- [ ] **Step 6: Commit delivery assets + listing refresh**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_delivery/GST-001-welcome-book/ templates/_delivery/_shared/license-template.md copy/etsy-listings/GST-001-welcome-book.md
git commit -m "deliver: GST-001 Welcome Book — thumb specs, howto PDF source, license, listing refresh"
```

- [ ] **Step 7: Daniel builds 5 thumbnails in Vista Create**

Per `thumbnails.md`. ~12 min each = ~1 hr total.

Export to:
- `templates/_delivery/GST-001-welcome-book/thumb-1.png`
- `templates/_delivery/GST-001-welcome-book/thumb-2.png`
- `templates/_delivery/GST-001-welcome-book/thumb-3.png`
- `templates/_delivery/GST-001-welcome-book/thumb-4.png`
- `templates/_delivery/GST-001-welcome-book/thumb-5.png`

- [ ] **Step 8: Commit thumbnails + PDFs**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_delivery/GST-001-welcome-book/
git commit -m "deliver: GST-001 thumbnails + branded PDFs exported from Vista Create"
```

---

### Task 8: OPS-001 Cleaner Turnover Checklist — Brief, Spec, Build, Delivery, Listing

**Files:**
- Create: `templates/_briefs/OPS-001-turnover-checklist.md`
- Create: `templates/_briefs/OPS-001-turnover-checklist-spec.md`
- Create: `templates/_build/build_turnover_checklist.py`
- Create: `templates/_masters/OPS-001-turnover-checklist.xlsx`
- Create: `templates/_delivery/OPS-001-turnover-checklist/thumbnails.md`
- Create: `templates/_delivery/OPS-001-turnover-checklist/OPS-001-howto.md`
- Create: `templates/_delivery/OPS-001-turnover-checklist/OPS-001-license.md`
- Create: `copy/etsy-listings/OPS-001-turnover-checklist.md` (fresh — no existing draft)

**Acceptance:** All files exist; xlsx opens in Excel 2016+; Daniel QA pass; 5 thumbnails exported; fresh listing copy finalized.

- [ ] **Step 1: Claude writes the brief**

Write `templates/_briefs/OPS-001-turnover-checklist.md`:
```markdown
# Brief — OPS-001 Cleaner Turnover Checklist + Scorecard

**SKU:** OPS-001
**Category:** Operations / Daily Management (master spec §3.2 C #33)
**Tier:** T1
**Etsy price:** $12 (lowest-price tripwire in the launch set)
**Own-site price:** $17
**Wave:** 1

## Target persona

**Primary:** Semi-Pro Sarah (3–10 properties) — hires cleaners, wants consistency.
**Secondary:** Side-Hustle Sam (1–2 listings) — DIY cleaner, wants repeatable process.
**Tertiary:** Pro Pam (co-host / PM) — has ≥3 cleaners on roster, needs scoring.

## The one specific pain

"My cleaner keeps forgetting things. Last week guest arrived to find coffee pods empty. Week before: bathroom shelf had hair. I can't be there for every turnover — I need a checklist they sign AND a way to score them across turnovers so I know who my best cleaner is."

## What this template does

A two-part tool:
1. **Turnover Checklist (per-turnover, printable)** — a 1-page checklist cleaner fills in at each turnover. 40 items across 8 zones (bedroom, bathroom, kitchen, living, outdoor, supplies, safety, final walkthrough). Cleaner initials each, signs + dates.
2. **Cleaner Scorecard (host-facing, aggregates turnovers)** — as host enters turnover data (date, property, cleaner, score out of 40, issues noted), a dashboard rolls up: turnovers per cleaner, avg score, issue rate, ranking.

## Sheets / Tabs

| # | Tab | Role | Who uses |
|---|---|---|---|
| 1 | "Welcome" | Cover + how-to | Host |
| 2 | "Printable Checklist" | 1-page, print this for every turnover | Cleaner |
| 3 | "Turnover Log" | One row per turnover — host enters after turnover | Host |
| 4 | "Scorecard Dashboard" | Auto-rolling metrics | Host |
| 5 | "Cleaner Roster" | List of cleaners + contact | Host |
| 6 | "Supplies Par Levels" | Bonus: per-property supply stock targets | Host |

## Inputs (Turnover Log)

- Turnover date
- Property (dropdown referencing property list on Scorecard or typed)
- Cleaner name (dropdown from Cleaner Roster tab)
- Items checked (out of 40) — number 0-40
- Issues noted (free text)
- Guest complaint? (Yes/No dropdown)
- Time spent (minutes, optional)

## Outputs (Scorecard Dashboard — all formulas)

- Total turnovers per cleaner: `=COUNTIF(TurnoverLog!C:C, A5)`
- Average score per cleaner: `=AVERAGEIF(TurnoverLog!C:C, A5, TurnoverLog!D:D)`
- Issue rate per cleaner: `=COUNTIFS(TurnoverLog!C:C, A5, TurnoverLog!F:F, "Yes") / COUNTIF(TurnoverLog!C:C, A5)` formatted as %
- Avg score colored: green ≥37, yellow 33-36, red <33 (conditional formatting)
- Ranking: `=RANK.EQ(avgScore, avgScoreRange, 0)` — highest score = rank 1

## External data references

None.

## Business logic

- Printable Checklist must fit on 1 page letter-portrait.
- 40 items split as: 6 bedroom, 7 bathroom, 8 kitchen, 5 living, 4 outdoor, 4 supplies, 3 safety, 3 final walk.
- Items phrased as concrete actions: "Dust all horizontal surfaces (nightstands, dresser, headboard)" not "Dust bedroom".
- Checklist includes cleaner signature + date line at bottom.
- Scorecard handles at least 500 turnovers (year-2+ scale) without formula breakage — use full-column references or named ranges.

## QA sample data

Populate Turnover Log with 15 rows across 3 cleaners ("Sarah — Smokies Clean", "Miguel — Ridge Housekeeping", "Jamie — Solo") over 6 properties, varied scores 30-40.

Expected Scorecard outputs:
- Sarah: 5 turnovers, avg 38.2, issue rate 0%, rank 1
- Miguel: 6 turnovers, avg 35.7, issue rate 17%, rank 2
- Jamie: 4 turnovers, avg 32.5, issue rate 50%, rank 3

## Upgrade CTA

On Welcome tab row 15: upgrade banner reading "Upgrade to the Operator Bundle at thestrledger.com/bundle — cleaner checklist + supply tracker + maintenance log + damage claim log, $97 instead of $180."

## Out-of-scope

- Photo uploads (Excel doesn't do this well)
- Cleaner payroll (separate T3 product in category H)
- Automated cleaner notifications (requires email/SMS automation — Phase 2+)
- Per-item deduction scoring (keep it simple: item checked or not)
```

- [ ] **Step 2: Claude writes the sheet spec**

Write `templates/_briefs/OPS-001-turnover-checklist-spec.md`:
```markdown
# Sheet Spec — OPS-001 Cleaner Turnover Checklist + Scorecard

## Workbook-level

- Filename: `OPS-001-turnover-checklist.xlsx`
- Tab colors: navy for cleaner-facing (2), tan for host-facing (1, 3-6)
- Default font: Calibri 11pt body; Georgia 18pt for headings
- Freeze panes per tab as specified

## Sheet 1 — "Welcome"

Rows 1-3: brand header (apply_brand_header, title "Cleaner Turnover Checklist + Scorecard")
Row 5: "How this works" header
Rows 6-11: 6-line numbered walkthrough:
1. Print tab 2 (Printable Checklist) — one per turnover. Give to cleaner.
2. Cleaner checks off each item, signs, dates, returns to you.
3. After turnover, open tab 3 (Turnover Log). Add a new row with date, property, cleaner, score (count of items checked).
4. Open tab 4 (Scorecard Dashboard). See who your best cleaner is at a glance.
5. Tab 5 (Cleaner Roster): list all your cleaners + contact. Dropdown on Turnover Log pulls from here.
6. Tab 6 (Supplies Par Levels): optional — per-property stock targets.

Row 13: "Before first use" header
Rows 14-16: 
- Go to tab 5, replace sample cleaners with your real ones.
- Go to tab 4, replace sample property names in the property column with yours.
- Print tab 2 for your next turnover.

Row 18: upgrade banner (add_upgrade_banner).

Col widths: A=85.

## Sheet 2 — "Printable Checklist"

Single-page letter-portrait layout. Title at top: "Turnover Checklist — [property] — [date]" with input cells for property + date.

8 zone sections. Each section header is bold navy 12pt with section name + item count.

| Zone | Items |
|---|---|
| BEDROOM (6) | Dust all horizontal surfaces / Strip and replace bed linens (crisp hospital corners) / Fresh pillowcases both sides / Vacuum under bed / Empty wastebasket / Check under bed for guest items |
| BATHROOM (7) | Scrub toilet inside + outside base / Clean mirror streak-free / Wipe sink + faucet / Scrub shower/tub including drain / Replace towels (bath, hand, face) / Restock toilet paper (min 2 rolls) / Empty wastebasket |
| KITCHEN (8) | Wipe all counters / Clean stovetop (all burners + under) / Wipe inside microwave / Run dishwasher if items inside / Wipe fridge exterior + handles / Check fridge interior for guest leftovers (discard) / Empty trash + replace liner / Restock coffee + filters (check par level) |
| LIVING (5) | Vacuum/sweep floors / Dust TV + surfaces / Fluff + realign pillows + throws / Wipe remote controls / Reset all furniture to original position |
| OUTDOOR (4) | Sweep porch/deck / Wipe outdoor furniture if present / Check hot tub cover seated + clean / Empty outdoor trash |
| SUPPLIES (4) | Coffee pods ≥ 10 / Paper towels ≥ 2 rolls / TP ≥ 2 per bathroom / Dish soap + dishwasher pods topped up |
| SAFETY (3) | All smoke detectors blinking green / All doors + windows locked / Keyless entry code reset (if applicable) |
| FINAL WALK (3) | Photograph each room (send to host via text) / Turn thermostat to host-preferred setting / Lock up + leave |

Each item is a row with: checkbox character "☐", item text, cleaner initials blank (3 chars).

Bottom: "Cleaner name + signature: __________ Date: __________ Time on site: __________"

Print area: A1:D~50 (whatever fits on 1 page).

Col widths: A=3 (checkbox), B=60 (item), C=10 (initials), D=15.

## Sheet 3 — "Turnover Log"

Row 1-3: brand header (title "Turnover Log")
Row 5: column headers (styled header_row_style): Date | Property | Cleaner | Items Checked (0-40) | Notes/Issues | Guest Complaint? | Minutes on Site
Rows 6-506: blank input rows (500 row capacity)

Data validation:
- Col B (Property): dropdown, pulls from Scorecard property list
- Col C (Cleaner): dropdown, pulls from Cleaner Roster names
- Col F (Guest Complaint?): dropdown Yes / No

Populated sample rows 6-20 with 15 sample turnovers per brief QA data.

Col widths: A=12, B=22, C=22, D=18, E=40, F=16, G=12.
Freeze: row 5.

## Sheet 4 — "Scorecard Dashboard"

Row 1-3: brand header (title "Cleaner Scorecard Dashboard")

Row 5 (styled): Cleaner | Turnovers | Avg Score | Issue Rate | Rank
Rows 6-15: up to 10 cleaners. For each:
- Col A: cleaner name (typed)
- Col B: `=COUNTIF(TurnoverLog!C:C, A6)`
- Col C: `=IFERROR(AVERAGEIF(TurnoverLog!C:C, A6, TurnoverLog!D:D), 0)` format 0.0
- Col D: `=IFERROR(COUNTIFS(TurnoverLog!C:C, A6, TurnoverLog!F:F, "Yes") / COUNTIF(TurnoverLog!C:C, A6), 0)` format %
- Col E: `=IF(B6>0, RANK.EQ(C6, $C$6:$C$15, 0), "")`

Conditional formatting on Col C:
- ≥37: green fill
- 33-36.99: yellow fill
- <33 and >0: red fill

Row 17: "Properties:" header
Rows 18-27: property names (typed; also source for Turnover Log dropdown)

Pre-populate rows 6-8 with QA sample: Sarah / Miguel / Jamie.
Pre-populate rows 18-23 with QA sample properties: "Smokies Ridge", "Creek Side", "Lakehouse A", "Lakehouse B", "Mountain View", "Downtown Loft".

## Sheet 5 — "Cleaner Roster"

Row 1-3: brand header (title "Cleaner Roster")
Row 5 (header): Name | Phone | Email | Pay Rate | Start Date | Notes
Rows 6-25: inputs, 20-cleaner capacity

QA sample populates rows 6-8 with Sarah / Miguel / Jamie and realistic contact info.

Col widths: A=22, B=18, C=28, D=12, E=14, F=40.

## Sheet 6 — "Supplies Par Levels"

Row 1-3: brand header (title "Supplies Par Levels by Property")
Row 5: Property (col A), then columns B-J: Coffee pods, Paper towels, TP rolls, Dish pods, Laundry pods, Shampoo, Body wash, Trash bags, Snacks

Rows 6-15: one property per row. Par level integer per cell. Default row populated: "Smokies Ridge | 12 | 4 | 8 | 30 | 12 | 3 | 3 | 20 | 0"

Col widths: A=20, B-J=12.
```

- [ ] **Step 3: Commit brief + spec**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_briefs/OPS-001-turnover-checklist.md templates/_briefs/OPS-001-turnover-checklist-spec.md
git commit -m "brief: OPS-001 Turnover Checklist — brief + sheet spec"
```

- [ ] **Step 4: Daniel reviews + approves**

```bash
git commit --allow-empty -m "approved: OPS-001 brief reviewed by Daniel"
```

- [ ] **Step 5: Claude writes the build script**

Write `templates/_build/build_turnover_checklist.py`:
```python
"""Build OPS-001 Cleaner Turnover Checklist Excel file."""
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.formatting.rule import CellIsRule
from openpyxl.worksheet.datavalidation import DataValidation

from brand_config import (
    COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT,
    COLOR_MUTED, COLOR_ERROR, FONT_HEAD, FONT_BODY,
    apply_brand_header, input_cell_style, formula_cell_style,
    set_col_widths, add_upgrade_banner, header_row_style,
)

OUT = Path(__file__).resolve().parent.parent / "_masters" / "OPS-001-turnover-checklist.xlsx"

CHECKLIST_ITEMS = [
    ("BEDROOM (6)", [
        "Dust all horizontal surfaces (nightstands, dresser, headboard)",
        "Strip and replace bed linens (crisp hospital corners)",
        "Fresh pillowcases both sides",
        "Vacuum under bed",
        "Empty wastebasket",
        "Check under bed for guest items",
    ]),
    ("BATHROOM (7)", [
        "Scrub toilet inside + outside base",
        "Clean mirror streak-free",
        "Wipe sink + faucet",
        "Scrub shower/tub including drain",
        "Replace towels (bath, hand, face)",
        "Restock toilet paper (min 2 rolls)",
        "Empty wastebasket",
    ]),
    ("KITCHEN (8)", [
        "Wipe all counters",
        "Clean stovetop (all burners + under)",
        "Wipe inside microwave",
        "Run dishwasher if items inside",
        "Wipe fridge exterior + handles",
        "Check fridge interior for guest leftovers (discard)",
        "Empty trash + replace liner",
        "Restock coffee + filters (check par level)",
    ]),
    ("LIVING (5)", [
        "Vacuum/sweep floors",
        "Dust TV + surfaces",
        "Fluff + realign pillows + throws",
        "Wipe remote controls",
        "Reset all furniture to original position",
    ]),
    ("OUTDOOR (4)", [
        "Sweep porch/deck",
        "Wipe outdoor furniture if present",
        "Check hot tub cover seated + clean",
        "Empty outdoor trash",
    ]),
    ("SUPPLIES (4)", [
        "Coffee pods ≥ 10",
        "Paper towels ≥ 2 rolls",
        "TP ≥ 2 per bathroom",
        "Dish soap + dishwasher pods topped up",
    ]),
    ("SAFETY (3)", [
        "All smoke detectors blinking green",
        "All doors + windows locked",
        "Keyless entry code reset (if applicable)",
    ]),
    ("FINAL WALK (3)", [
        "Photograph each room (send to host via text)",
        "Turn thermostat to host-preferred setting",
        "Lock up + leave",
    ]),
]


def style_cell(cell, style_dict):
    for attr, value in style_dict.items():
        setattr(cell, attr, value)


def build_welcome_tab(wb):
    ws = wb.active
    ws.title = "Welcome"
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 85)])
    apply_brand_header(ws, "Cleaner Turnover Checklist + Scorecard",
                       "Printable checklist + rolling cleaner scorecard")
    ws.row_dimensions[4].height = 12
    ws.freeze_panes = "A5"

    ws.cell(row=5, column=1, value="How this works").font = Font(
        name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    steps = [
        "1. Print tab 2 (Printable Checklist) — one per turnover. Give to cleaner.",
        "2. Cleaner checks off each item, signs, dates, returns to you.",
        "3. After turnover, open tab 3 (Turnover Log). Add a row: date, property, cleaner, items checked, notes.",
        "4. Open tab 4 (Scorecard Dashboard). See who your best cleaner is at a glance.",
        "5. Tab 5 (Cleaner Roster): list all your cleaners. Dropdown on Turnover Log pulls from here.",
        "6. Tab 6 (Supplies Par Levels): optional — per-property stock targets.",
    ]
    for i, step in enumerate(steps, start=6):
        ws.cell(row=i, column=1, value=step).alignment = Alignment(wrap_text=True)

    ws.cell(row=13, column=1, value="Before first use").font = Font(
        name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    pre = [
        "• Go to tab 5, replace the 3 sample cleaners with your real ones.",
        "• Go to tab 4, replace sample property names (rows 18-23) with yours.",
        "• Print tab 2 for your next turnover.",
    ]
    for i, p in enumerate(pre, start=14):
        ws.cell(row=i, column=1, value=p).alignment = Alignment(wrap_text=True)

    add_upgrade_banner(ws, 18)


def build_printable_tab(wb):
    ws = wb.create_sheet("Printable Checklist")
    ws.sheet_properties.tabColor = COLOR_PRIMARY
    set_col_widths(ws, [("A", 3), ("B", 60), ("C", 10), ("D", 15)])
    apply_brand_header(ws, "Turnover Checklist", "Print one per turnover")
    ws.row_dimensions[4].height = 10

    # Property + Date header row 4
    ws.cell(row=4, column=1, value="Property:")
    ws.cell(row=4, column=2).fill = PatternFill("solid", fgColor="FFF7D6")  # input
    ws.cell(row=4, column=3, value="Date:")
    ws.cell(row=4, column=4).fill = PatternFill("solid", fgColor="FFF7D6")  # input

    row = 6
    for zone_name, items in CHECKLIST_ITEMS:
        cell = ws.cell(row=row, column=1, value=zone_name)
        cell.font = Font(name=FONT_HEAD, size=12, bold=True, color=COLOR_PRIMARY)
        ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=4)
        row += 1
        for item in items:
            ws.cell(row=row, column=1, value="☐").font = Font(size=14)
            ws.cell(row=row, column=2, value=item).font = Font(size=10)
            ws.cell(row=row, column=2).alignment = Alignment(wrap_text=True)
            ws.cell(row=row, column=3, value="").fill = PatternFill("solid", fgColor="FFFFFF")
            ws.cell(row=row, column=3).border = Border(bottom=Side(style="thin"))
            row += 1
        row += 1  # spacer between zones

    # Signature section
    row += 1
    ws.cell(row=row, column=1, value="Cleaner name:").font = Font(bold=True)
    ws.cell(row=row, column=2).border = Border(bottom=Side(style="thin"))
    ws.cell(row=row, column=3, value="Date:").font = Font(bold=True)
    ws.cell(row=row, column=4).border = Border(bottom=Side(style="thin"))
    row += 2
    ws.cell(row=row, column=1, value="Signature:").font = Font(bold=True)
    ws.merge_cells(start_row=row, start_column=2, end_row=row, end_column=4)
    ws.cell(row=row, column=2).border = Border(bottom=Side(style="thin"))
    row += 2
    ws.cell(row=row, column=1, value="Time on site (min):").font = Font(bold=True)
    ws.cell(row=row, column=2).border = Border(bottom=Side(style="thin"))

    ws.print_area = f"A1:D{row}"
    ws.page_setup.orientation = "portrait"
    ws.page_setup.paperSize = ws.PAPERSIZE_LETTER
    ws.page_setup.fitToPage = True
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.page_setup.fitToHeight = 1
    ws.page_setup.fitToWidth = 1


def build_log_tab(wb):
    ws = wb.create_sheet("Turnover Log")
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 12), ("B", 22), ("C", 22), ("D", 18), ("E", 40), ("F", 16), ("G", 12)])
    apply_brand_header(ws, "Turnover Log", "One row per turnover")
    ws.freeze_panes = "A6"

    headers = ["Date", "Property", "Cleaner", "Items Checked (0-40)", "Notes/Issues", "Guest Complaint?", "Minutes on Site"]
    hs = header_row_style()
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        for attr, value in hs.items():
            setattr(cell, attr, value)

    # Sample data — 15 rows across 3 cleaners
    sample = [
        ("2026-03-14", "Smokies Ridge", "Sarah — Smokies Clean", 40, "Perfect turnover", "No", 95),
        ("2026-03-16", "Creek Side", "Miguel — Ridge Housekeeping", 36, "Missed: smoke detectors check", "No", 110),
        ("2026-03-18", "Lakehouse A", "Sarah — Smokies Clean", 39, "Minor: 1 pillowcase off-center", "No", 90),
        ("2026-03-20", "Smokies Ridge", "Jamie — Solo", 32, "TP not restocked; shower drain clogged", "Yes", 75),
        ("2026-03-21", "Lakehouse B", "Miguel — Ridge Housekeeping", 38, "All good", "No", 105),
        ("2026-03-23", "Smokies Ridge", "Sarah — Smokies Clean", 38, "Missed outdoor trash", "No", 92),
        ("2026-03-25", "Creek Side", "Jamie — Solo", 30, "Coffee pods empty; mirror streaked", "Yes", 65),
        ("2026-03-26", "Mountain View", "Miguel — Ridge Housekeeping", 37, "", "No", 100),
        ("2026-03-28", "Lakehouse A", "Sarah — Smokies Clean", 40, "", "No", 88),
        ("2026-03-29", "Downtown Loft", "Miguel — Ridge Housekeeping", 35, "Dishwasher not run", "No", 85),
        ("2026-03-30", "Smokies Ridge", "Sarah — Smokies Clean", 37, "Late start — guest arrived early", "No", 70),
        ("2026-04-01", "Lakehouse B", "Jamie — Solo", 34, "Fridge not checked", "No", 72),
        ("2026-04-03", "Mountain View", "Miguel — Ridge Housekeeping", 36, "", "No", 95),
        ("2026-04-05", "Creek Side", "Jamie — Solo", 34, "Minor: thermostat not reset", "No", 68),
        ("2026-04-07", "Lakehouse A", "Miguel — Ridge Housekeeping", 38, "", "No", 100),
    ]
    for i, row_data in enumerate(sample, start=6):
        for col, val in enumerate(row_data, start=1):
            cell = ws.cell(row=i, column=col, value=val)
            style_cell(cell, input_cell_style())
            if col == 1:
                cell.number_format = "yyyy-mm-dd"

    # Dropdowns
    dv_cleaner = DataValidation(type="list",
        formula1="='Cleaner Roster'!$A$6:$A$25", allow_blank=True)
    dv_cleaner.add("C6:C506")
    ws.add_data_validation(dv_cleaner)

    dv_complaint = DataValidation(type="list", formula1='"Yes,No"', allow_blank=True)
    dv_complaint.add("F6:F506")
    ws.add_data_validation(dv_complaint)

    dv_property = DataValidation(type="list",
        formula1="='Scorecard Dashboard'!$A$18:$A$27", allow_blank=True)
    dv_property.add("B6:B506")
    ws.add_data_validation(dv_property)


def build_scorecard_tab(wb):
    ws = wb.create_sheet("Scorecard Dashboard")
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 28), ("B", 14), ("C", 14), ("D", 14), ("E", 10)])
    apply_brand_header(ws, "Cleaner Scorecard Dashboard", "Rolling metrics per cleaner")
    ws.freeze_panes = "A6"

    headers = ["Cleaner", "Turnovers", "Avg Score", "Issue Rate", "Rank"]
    hs = header_row_style()
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        for attr, value in hs.items():
            setattr(cell, attr, value)

    cleaners = ["Sarah — Smokies Clean", "Miguel — Ridge Housekeeping", "Jamie — Solo"]
    for i, name in enumerate(cleaners, start=6):
        ws.cell(row=i, column=1, value=name)
        ws.cell(row=i, column=2, value=f"=COUNTIF('Turnover Log'!C:C, A{i})")
        ws.cell(row=i, column=3, value=f"=IFERROR(AVERAGEIF('Turnover Log'!C:C, A{i}, 'Turnover Log'!D:D), 0)")
        ws.cell(row=i, column=3).number_format = "0.0"
        ws.cell(row=i, column=4, value=f'=IFERROR(COUNTIFS(\'Turnover Log\'!C:C, A{i}, \'Turnover Log\'!F:F, "Yes") / COUNTIF(\'Turnover Log\'!C:C, A{i}), 0)')
        ws.cell(row=i, column=4).number_format = "0%"
        ws.cell(row=i, column=5, value=f'=IF(B{i}>0, RANK.EQ(C{i}, $C$6:$C$15, 0), "")')
        for col in range(2, 6):
            style_cell(ws.cell(row=i, column=col), formula_cell_style())

    # Blank rows 9-15 for capacity
    for i in range(9, 16):
        ws.cell(row=i, column=2, value=f"=IF(A{i}=\"\",\"\",COUNTIF('Turnover Log'!C:C, A{i}))")
        ws.cell(row=i, column=3, value=f"=IF(A{i}=\"\",\"\",IFERROR(AVERAGEIF('Turnover Log'!C:C, A{i}, 'Turnover Log'!D:D), 0))")
        ws.cell(row=i, column=4, value=f'=IF(A{i}="","",IFERROR(COUNTIFS(\'Turnover Log\'!C:C, A{i}, \'Turnover Log\'!F:F, "Yes") / COUNTIF(\'Turnover Log\'!C:C, A{i}), 0))')
        ws.cell(row=i, column=5, value=f'=IF(OR(A{i}="",B{i}=0),"",RANK.EQ(C{i}, $C$6:$C$15, 0))')

    # Conditional formatting on Avg Score column
    red = PatternFill("solid", fgColor="FFCCCC")
    yellow = PatternFill("solid", fgColor="FFF3BF")
    green = PatternFill("solid", fgColor="C7EFCF")
    ws.conditional_formatting.add("C6:C15", CellIsRule(operator="greaterThanOrEqual", formula=["37"], fill=green))
    ws.conditional_formatting.add("C6:C15", CellIsRule(operator="between", formula=["33", "36.99"], fill=yellow))
    ws.conditional_formatting.add("C6:C15", CellIsRule(operator="between", formula=["0.01", "32.99"], fill=red))

    # Properties section
    ws.cell(row=17, column=1, value="Properties (source for Turnover Log dropdown):").font = Font(
        name=FONT_HEAD, size=12, bold=True, color=COLOR_PRIMARY)
    properties = ["Smokies Ridge", "Creek Side", "Lakehouse A", "Lakehouse B", "Mountain View", "Downtown Loft"]
    for i, prop in enumerate(properties, start=18):
        cell = ws.cell(row=i, column=1, value=prop)
        style_cell(cell, input_cell_style())


def build_roster_tab(wb):
    ws = wb.create_sheet("Cleaner Roster")
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 28), ("B", 18), ("C", 28), ("D", 12), ("E", 14), ("F", 40)])
    apply_brand_header(ws, "Cleaner Roster", "Your team, in one place")
    ws.freeze_panes = "A6"

    headers = ["Name", "Phone", "Email", "Pay Rate", "Start Date", "Notes"]
    hs = header_row_style()
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        for attr, value in hs.items():
            setattr(cell, attr, value)

    sample = [
        ("Sarah — Smokies Clean", "(865) 555-0145", "sarah@smokiesclean.com", 45, "2025-06-01", "Flat rate per turnover; reliable"),
        ("Miguel — Ridge Housekeeping", "(865) 555-0177", "miguel@ridgehk.com", 40, "2025-08-15", "Team of 2; can handle back-to-back"),
        ("Jamie — Solo", "(865) 555-0192", "jamie.cleans@gmail.com", 35, "2026-01-10", "New — still ramping"),
    ]
    for i, row_data in enumerate(sample, start=6):
        for col, val in enumerate(row_data, start=1):
            cell = ws.cell(row=i, column=col, value=val)
            style_cell(cell, input_cell_style())
            if col == 5:
                cell.number_format = "yyyy-mm-dd"


def build_supplies_tab(wb):
    ws = wb.create_sheet("Supplies Par Levels")
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    widths = [("A", 20)] + [(chr(ord('B') + i), 12) for i in range(9)]
    set_col_widths(ws, widths)
    apply_brand_header(ws, "Supplies Par Levels by Property", "Bonus: per-property stock targets")
    ws.freeze_panes = "B6"

    headers = ["Property", "Coffee pods", "Paper towels", "TP rolls", "Dish pods",
               "Laundry pods", "Shampoo", "Body wash", "Trash bags", "Snacks"]
    hs = header_row_style()
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        for attr, value in hs.items():
            setattr(cell, attr, value)

    sample = [
        ("Smokies Ridge", 12, 4, 8, 30, 12, 3, 3, 20, 0),
        ("Creek Side", 10, 3, 6, 20, 10, 2, 2, 15, 0),
        ("Lakehouse A", 15, 4, 10, 30, 15, 4, 4, 25, 6),
    ]
    for i, row_data in enumerate(sample, start=6):
        for col, val in enumerate(row_data, start=1):
            cell = ws.cell(row=i, column=col, value=val)
            style_cell(cell, input_cell_style())


def main():
    wb = Workbook()
    build_welcome_tab(wb)
    build_printable_tab(wb)
    build_log_tab(wb)
    build_scorecard_tab(wb)
    build_roster_tab(wb)
    build_supplies_tab(wb)

    wb.properties.title = "Cleaner Turnover Checklist + Scorecard — The STR Ledger"
    wb.properties.creator = "The STR Ledger"
    wb.properties.description = "Printable cleaner checklist + rolling cleaner scorecard for STR hosts."

    OUT.parent.mkdir(parents=True, exist_ok=True)
    wb.save(OUT)
    print(f"Saved: {OUT}")


if __name__ == "__main__":
    main()
```

- [ ] **Step 6: Run the build + smoke test**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates/templates/_build"
python build_turnover_checklist.py
python -c "from openpyxl import load_workbook; wb = load_workbook('../_masters/OPS-001-turnover-checklist.xlsx'); print('tabs:', wb.sheetnames); assert len(wb.sheetnames) == 6; print('OK')"
```

Expected: 6 tabs listed; "OK".

- [ ] **Step 7: Daniel QA in Excel (Windows)**

Open `templates/_masters/OPS-001-turnover-checklist.xlsx`. Verify:
- [ ] 6 tabs present, correct colors (printable tab = navy; others = tan)
- [ ] Printable Checklist fits on 1 letter-portrait page in print preview
- [ ] Scorecard shows: Sarah avg ≈ 38.4, Miguel ≈ 36.7, Jamie ≈ 32.5 (ranges ±0.5 from brief expectation — actual formulas will dictate)
- [ ] Conditional formatting colors show (green/yellow/red)
- [ ] Turnover Log dropdown for Cleaner pulls from Roster correctly
- [ ] Turnover Log dropdown for Property pulls from Scorecard correctly
- [ ] Guest Complaint dropdown shows Yes/No
- [ ] No spell errors

- [ ] **Step 8: Commit build + xlsx**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_build/build_turnover_checklist.py templates/_masters/OPS-001-turnover-checklist.xlsx
git commit -m "build: OPS-001 Turnover Checklist Excel master (6 tabs, scorecard formulas)"
git commit --allow-empty -m "approved: OPS-001 QA passed on Windows Excel"
```

- [ ] **Step 9: Create delivery folder + thumbnail specs**

```bash
mkdir -p "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates/templates/_delivery/OPS-001-turnover-checklist"
```

Write `templates/_delivery/OPS-001-turnover-checklist/thumbnails.md`:
```markdown
# Thumbnail Specs — OPS-001 Turnover Checklist

## Thumbnail 1 — Hero
- Mockup: printed paper on clipboard on clean countertop (Vista Create → "clipboard mockup") with the Printable Checklist rendered on the paper
- Headline: `Cleaner Turnover Checklist — Done Right.`
- Sub: `40 items. 8 zones. 1 page. Print-and-go.`
- Export: `thumb-1.png`

## Thumbnail 2 — The Scorecard
- Mockup: MacBook showing Scorecard Dashboard with conditional-formatting colors visible
- Headline: `Know Your Best Cleaner.`
- Sub: `Rolling scorecard — avg score, issue rate, ranking.`
- Export: `thumb-2.png`

## Thumbnail 3 — Before/After
- Split: LEFT "Before: messy sticky-note checklist" photo; RIGHT "After: one-page printable" photo
- Headline: `Stop Texting Cleaners at 11 PM.`
- Sub: `Give them a checklist they sign. You get the data.`
- Export: `thumb-3.png`

## Thumbnail 4 — Zones overview
- Mockup: exploded view of the 8 zones (bedroom, bathroom, kitchen, living, outdoor, supplies, safety, final walk) as icons in a grid
- Headline: `8 Zones. 40 Items. Nothing Missed.`
- Sub: `Bedroom · Bathroom · Kitchen · Living · Outdoor · Supplies · Safety · Final Walk`
- Export: `thumb-4.png`

## Thumbnail 5 — Includes list (tan card)
- Content card:
  ✓ 1-page printable checklist (40 items, 8 zones)
  ✓ Turnover log (500-row capacity)
  ✓ Scorecard dashboard — auto-ranking
  ✓ Cleaner roster — dropdown source
  ✓ Supply par-levels tracker (bonus)
  ✓ Editable Excel + matching PDF
- Headline: `What You Get`
- Sub: `Opens in Excel 2016+, Excel 365, Google Sheets`
- Export: `thumb-5.png`
```

- [ ] **Step 10: Write how-to PDF source + license**

Write `templates/_delivery/OPS-001-turnover-checklist/OPS-001-howto.md`:
```markdown
# How to Use Your Cleaner Turnover Checklist + Scorecard

**The STR Ledger · thestrledger.com**

Two tools in one file: a printable checklist your cleaner signs, and a dashboard that scores every cleaner across every turnover.

## 5-minute setup

1. Open tab **Cleaner Roster** — replace the 3 sample cleaners with your real ones (name, phone, email, pay rate).
2. Open tab **Scorecard Dashboard** — scroll to row 17. Replace the 6 sample property names with yours.
3. Open tab **Printable Checklist** — click File → Print → make sure "Fit to 1 page" is on. Print one per turnover and hand to cleaner.

## After every turnover

1. Open tab **Turnover Log**. Find the next blank row.
2. Enter: date, property (dropdown), cleaner (dropdown), items checked (count from cleaner's checklist), notes/issues, guest complaint Yes/No, minutes on site.
3. Switch to tab **Scorecard Dashboard**. The cleaner's average and ranking updates automatically.

## Reading the scorecard

- **Avg Score ≥ 37 (green):** rockstar. Give them more turnovers.
- **33-36 (yellow):** solid. Coach on the specific items they miss.
- **<33 (red):** problem. Have a conversation or find a replacement.
- **Issue Rate:** % of turnovers with a guest complaint. Anything >10% needs attention.

## Bonus: supplies par levels

Tab **Supplies Par Levels** tracks how much of each supply each property should have at all times. Walk through after each turnover (or once a month) and restock anything below par. Prevents the "the coffee pods ran out" message at 9 PM.

## Questions?

**hello@thestrledger.com** — real humans, fast replies.

---

**Upgrade path:** The Operator Bundle at thestrledger.com/bundle includes this + supply inventory tracker + maintenance log + damage claim log for $97 (save 46% vs buying separately).

Get on our list at **thestrledger.com/47** for our free "47 Airbnb Tax Deductions Most Hosts Miss" guide.

---

© 2026 The STR Ledger · For use by one business · See license for full terms
```

Write `templates/_delivery/OPS-001-turnover-checklist/OPS-001-license.md` — copy the full content from `templates/_delivery/GST-001-welcome-book/GST-001-license.md`, changing only:
- Template line: `**Template:** Cleaner Turnover Checklist + Scorecard (SKU: OPS-001)`

- [ ] **Step 11: Write fresh listing copy**

Write `copy/etsy-listings/OPS-001-turnover-checklist.md`:
```markdown
# Etsy Listing: Cleaner Turnover Checklist + Scorecard

**SKU:** OPS-001
**Status:** Ready to publish. Build complete. Delivery assets complete. Awaiting Etsy upload (Task 11).
**Pricing:** $12 Etsy · $17 own-site
**Category path:** Digital Downloads > Other Digital Downloads > Business & Office

## Title (≤140 chars)

```
Airbnb Cleaner Turnover Checklist & Scorecard | Excel + Printable PDF | STR Host Cleaning Tracker | Vacation Rental Cleaning
```
**Chars: 139/140** ✅

## Description

```
✨ TWO TOOLS IN ONE: CLEANER CHECKLIST + HOST SCORECARD ✨

Stop texting your cleaner at 11pm. This is the checklist we built for our
own properties after watching guests arrive to empty coffee pods, streaky
mirrors, and hot tubs with cloudy water.

═══════════════════════════════════════════
WHAT'S INCLUDED
═══════════════════════════════════════════

📋 1-PAGE PRINTABLE CHECKLIST — 40 items across 8 zones:
   • Bedroom (6) · Bathroom (7) · Kitchen (8) · Living (5)
   • Outdoor (4) · Supplies (4) · Safety (3) · Final Walk (3)
   Cleaner checks each item, initials, signs, dates. You get the paper back.

📊 ROLLING SCORECARD DASHBOARD — the host-facing payoff:
   • Avg score per cleaner across every turnover
   • Issue rate % (how often guest complaints follow their turnovers)
   • Automatic ranking — who's your #1 cleaner?
   • Conditional formatting flags anyone below 33/40

📝 TURNOVER LOG — 500-row capacity, dropdowns for property + cleaner
📇 CLEANER ROSTER — contact info + pay rate + start date for every cleaner
📦 SUPPLY PAR LEVELS — bonus bonus: per-property stock targets so nothing runs out

═══════════════════════════════════════════
WHY THIS INSTEAD OF A STICKY NOTE
═══════════════════════════════════════════

Most hosts track cleaners by vibes. This tool gives you actual data:
   ✅ Who's your best cleaner? (Rank column tells you)
   ✅ Who has the highest complaint rate? (Issue % tells you)
   ✅ Which cleaner takes longest per turnover? (Minutes column tells you)
   ✅ Which property is hardest to turn? (Sort log by minutes — you'll see)

The conversation with a struggling cleaner is easier when you have 10 data
points, not a "vibe."

═══════════════════════════════════════════
WHO THIS IS FOR
═══════════════════════════════════════════

🏡 Airbnb hosts with 1+ properties who use outside cleaners
🏡 Semi-pro operators juggling 3-10 properties
🏡 Property managers tracking a cleaner roster
🏡 Anyone whose current system is "text the cleaner and hope"

═══════════════════════════════════════════
HOW IT WORKS
═══════════════════════════════════════════

1️⃣ Purchase → instant download
2️⃣ 5-minute setup: replace sample cleaners + properties with yours
3️⃣ Print the checklist for every turnover — hand to cleaner
4️⃣ After each turnover, log it (takes 60 seconds)
5️⃣ Scorecard updates automatically

═══════════════════════════════════════════
FILE COMPATIBILITY
═══════════════════════════════════════════

✅ Microsoft Excel 2016+ (Windows and Mac)
✅ Microsoft Excel 365
✅ Google Sheets (File > Import)
❌ Apple Numbers — message first if this is your only option

═══════════════════════════════════════════
REFUNDS + SUPPORT
═══════════════════════════════════════════

14-day refund, no questions asked. hello@thestrledger.com — real humans,
fast replies.

═══════════════════════════════════════════

⚠️ Digital product. No physical shipment. Files delivered to your Etsy
account and email.

⚠️ Single-business license. Use across unlimited properties YOU manage.
No redistribution or resale.
```

## Tags (13)

1. `airbnb cleaning checklist`
2. `str cleaner tracker`
3. `vacation rental cleaning`
4. `turnover checklist`
5. `airbnb template`
6. `cleaner scorecard`
7. `vrbo cleaning`
8. `str template`
9. `airbnb host tool`
10. `rental property cleaning`
11. `cleaning schedule`
12. `housekeeping tracker`
13. `airbnb printable`

## Materials / Attributes

- Type: Digital Download
- Who made it: I did
- When was it made: Made to order
- Category: Digital Downloads → Other Digital Downloads → Business & Office
- Style: Modern, Minimalist

## Thumbnails (5)

See `templates/_delivery/OPS-001-turnover-checklist/thumbnails.md`.

## Files attached to Etsy (5)

1. `OPS-001-turnover-checklist.xlsx`
2. `etsy-upgrade-insert.pdf` (shared, from Task 10)
3. `OPS-001-howto.pdf`
4. `OPS-001-license.pdf`
5. Printable PDF (export tab 2 as PDF once via Excel File→Save As→PDF, selection tab 2)

## SEO

- Primary keyword: `airbnb cleaning checklist` (front-loaded)
- Renewal: every 4 months (Etsy freshness signal)
- Monitor: 30-day CVR target ≥ 2%
- If < 1% CTR at Day 30: rewrite thumbnails first (biggest conversion lever)

## Cross-sell anchors (in shop)

- Welcome Book ($17)
- Mileage Log ($17)
- 1099-NEC Tracker ($17)
- P&L Lite ($27)
```

- [ ] **Step 12: Commit delivery assets + listing**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_delivery/OPS-001-turnover-checklist/ copy/etsy-listings/OPS-001-turnover-checklist.md
git commit -m "deliver: OPS-001 Turnover Checklist — thumbnails spec, howto, license, fresh listing"
```

- [ ] **Step 13: Daniel builds thumbnails + PDFs in Vista Create**

Per `thumbnails.md` (5 × ~12 min) + 2 PDFs (~15 min each). Export to the OPS-001 folder. Commit.

```bash
git add templates/_delivery/OPS-001-turnover-checklist/
git commit -m "deliver: OPS-001 thumbnails + branded PDFs exported"
```

---

### Task 9: TAX-001 STR Mileage Log — Brief, Spec, Build, Delivery, Listing refresh

**Files:** Same 10-artifact stack as Task 8, SKU = TAX-001. Listing file already exists (`copy/etsy-listings/TAX-001-mileage-log.md`) — refresh not create.

**Acceptance:** same pattern; Windows QA pass; listing token-free.

- [ ] **Step 1: Claude writes the brief**

Write `templates/_briefs/TAX-001-mileage-log.md`:
```markdown
# Brief — TAX-001 STR Mileage Log

**SKU:** TAX-001
**Category:** Financial / Accounting (master spec §3.2 A #9)
**Tier:** T1
**Etsy price:** $17
**Own-site price:** $17 (same)
**Wave:** 1

## Target persona

**Primary:** Semi-Pro Sarah — drives between 3-10 properties, misses mileage deductions worth $2-8K/year.
**Secondary:** Side-Hustle Sam — one STR, W2 day job; still drives for supplies and turnovers.

## The one specific pain

"My CPA asked for my mileage log at tax time and I had nothing. I know I drove to the Airbnb 40 times last year plus Home Depot runs plus the airport for guest pickups. I just didn't write it down. I'm probably leaving $3,000 on the table."

## What this template does

IRS-compliant mileage log with auto-calculation at the current IRS standard mileage rate (2026: $0.70/mi, IRS annual inflation adjustment; template has an editable rate cell for future years). Tracks:
- Date, property, business purpose, start/end odometer OR stated mileage, calculated mileage, business $ deduction
- Rolling YTD total miles + total deduction
- IRS compliance fields per Publication 463: date, destination, business purpose, miles

## Sheets / Tabs

| # | Tab | Role |
|---|---|---|
| 1 | Welcome | Cover + IRS compliance note + how-to |
| 2 | Mileage Log | The log — one row per trip |
| 3 | Monthly Summary | Auto: miles + $ deduction per month |
| 4 | YTD Dashboard | Totals, top destinations, purpose breakdown |
| 5 | Settings | Editable IRS rate + category list |

## Inputs (Mileage Log tab)

- Date
- Property (dropdown from Settings property list)
- Destination (free text — "Home Depot", "Guest pickup airport", "Turnover visit")
- Business purpose (dropdown: Property inspection, Turnover, Supplies run, Guest transport, Repairs, Meeting cleaner, Other)
- Start odometer OR start location (either-or column)
- End odometer OR end location
- Miles (auto-calc from odo OR typed if using start/end location only)
- Notes

## Outputs

- Per row: `$ Deduction = Miles × Settings!IRSRate`
- Monthly Summary: `=SUMIFS(Miles, Date, ">=start", Date, "<end")` per month
- YTD Dashboard: total miles, total $, per-purpose breakdown via SUMIFS
- Top 5 destinations via LARGE + INDEX/MATCH

## External data references

- IRS standard mileage rate 2026: **$0.70/mi** (business). Update cell on Settings tab annually.
- Template includes footnote: "IRS rate updates January 1 each year — check irs.gov Publication 463 and update cell B5 on Settings tab."

## Business logic

- Support BOTH odometer method (start + end) AND stated-miles method (typed miles). Formulas auto-detect: if odometer cells filled, use `=EndOdo - StartOdo`; else use stated Miles.
- Compliance check column: flag rows missing required fields (date, destination, purpose, miles) in red.
- Printable summary: user can File → Print the Monthly Summary tab for CPA handoff.
- 2000-row capacity (10+ years of typical host mileage).

## QA sample data

20 rows over Jan-Mar 2026:
- Mix of property inspections, turnovers, supplies runs, guest transport
- 3 properties: "Smokies Ridge", "Creek Side", "Lakehouse A"
- Distances 3 mi to 45 mi
- Expected YTD at Mar 31: ~380 miles, ~$266 deduction

## Upgrade CTA

Welcome tab row 18: "Upgrade to the Tax Season Bundle at thestrledger.com/tax-bundle — mileage log + home office deduction + 1099-NEC tracker + Schedule E prep workbook, $147."

## Out-of-scope

- GPS auto-tracking (use MileIQ / Everlance; we're the backup + CPA-ready system)
- Multi-driver support (single driver per workbook)
- Medical/charitable mileage (business only for MVP)
- Non-US tax (US Schedule C/E only)
```

- [ ] **Step 2: Claude writes the sheet spec**

Write `templates/_briefs/TAX-001-mileage-log-spec.md`:
```markdown
# Sheet Spec — TAX-001 STR Mileage Log

## Workbook-level
- Filename: `TAX-001-mileage-log.xlsx`
- All tabs tan (tax/financial convention)
- Default font: Calibri 11pt

## Sheet 1 — Welcome
Rows 1-3: brand header (title "STR Mileage Log", sub "IRS-compliant, auto-calculated")
Row 5: "What this covers" + IRS Publication 463 compliance note (date, destination, business purpose, miles — all captured on the Mileage Log tab)
Row 7: "How to use"
Rows 8-13: 6-step numbered walkthrough
Row 15: "IRS rate — update yearly"
Row 16: "Current rate (2026): $0.70/mi. Update on Settings tab (cell B5) every Jan 1 per irs.gov Publication 463."
Row 18: upgrade banner

## Sheet 2 — Mileage Log
Row 5 headers (header_row_style):
Date | Property | Destination | Business Purpose | Start Odo | End Odo | Miles (typed alt) | Calculated Miles | $ Deduction | Notes | ✔ IRS

Formulas:
- Col H (Calculated Miles): `=IF(AND(E6<>"",F6<>""), F6-E6, IF(G6<>"", G6, 0))` — odo takes priority, else typed
- Col I ($ Deduction): `=H6 * Settings!$B$5` — multiply by IRS rate
- Col K (✔ IRS): `=IF(AND(A6<>"",C6<>"",D6<>"",H6>0), "✓", "⚠ missing")` — compliance check

Data validation:
- Col B (Property): list from Settings!E column
- Col D (Business Purpose): list from Settings!G column
- Col A (Date): date validation 2020-01-01 to 2030-12-31

Conditional formatting:
- Col K: "⚠ missing" → red fill
- Col K: "✓" → green fill

Rows 6-2005 (2000-row capacity). Pre-fill rows 6-25 with QA sample data.

Col widths: A=12 B=20 C=28 D=22 E=10 F=10 G=10 H=10 I=12 J=30 K=14
Freeze: row 5. Print area A1:K2005.

## Sheet 3 — Monthly Summary
Rows 1-3: brand header
Row 5 headers: Month | Miles | $ Deduction | Trip Count
Rows 6-17: one per month (Jan-Dec current year)
Col A: month label; Col B: `=SUMIFS('Mileage Log'!$H:$H, 'Mileage Log'!$A:$A, ">="&DATE(YEAR(TODAY()), ROW()-5, 1), 'Mileage Log'!$A:$A, "<"&DATE(YEAR(TODAY()), ROW()-4, 1))` ← adjust row formula per row
Col C: `=B6 * Settings!$B$5`
Col D: `=COUNTIFS('Mileage Log'!$A:$A, ">="&..., 'Mileage Log'!$A:$A, "<"&...)`
Row 19: YTD row summing rows 6-17

## Sheet 4 — YTD Dashboard
- Row 5: "YTD Total Miles:" with formula to Monthly!B19
- Row 6: "YTD Total Deduction ($):" formula
- Row 8: "By Purpose" table — use SUMIFS grouped by each purpose
- Row 16: "Top 5 Destinations by Miles" — use helper column or LARGE/INDEX/MATCH

## Sheet 5 — Settings
Row 5: Label "IRS Rate (per mile, business):" | B5 input $0.70 (formatted currency, 2 decimals)
Row 7: "Historical rates for reference:" 2023=0.655 2024=0.67 2025=0.70 (hardcoded labels)
Row 10: "Property list (source for Log dropdown):" Col E rows 11-20 inputs
Row 10: "Purpose list (source for Log dropdown):" Col G rows 11-20 inputs, pre-populated
```

- [ ] **Step 3: Commit brief + spec**

```bash
git add templates/_briefs/TAX-001-mileage-log.md templates/_briefs/TAX-001-mileage-log-spec.md
git commit -m "brief: TAX-001 Mileage Log — brief + sheet spec"
git commit --allow-empty -m "approved: TAX-001 brief reviewed by Daniel"
```

- [ ] **Step 4: Claude writes the build script**

Write `templates/_build/build_mileage_log.py`:
```python
"""Build TAX-001 STR Mileage Log Excel file."""
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.worksheet.datavalidation import DataValidation
from datetime import date, timedelta

from brand_config import (
    COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT,
    COLOR_MUTED, COLOR_ERROR, FONT_HEAD, FONT_BODY,
    apply_brand_header, input_cell_style, formula_cell_style,
    set_col_widths, add_upgrade_banner, header_row_style,
)

OUT = Path(__file__).resolve().parent.parent / "_masters" / "TAX-001-mileage-log.xlsx"

IRS_RATE_2026 = 0.70
PURPOSES = ["Property inspection", "Turnover", "Supplies run",
            "Guest transport", "Repairs", "Meeting cleaner", "Other"]
PROPERTIES = ["Smokies Ridge", "Creek Side", "Lakehouse A"]

SAMPLE_ROWS = [
    ("2026-01-05", "Smokies Ridge", "Home Depot run", "Supplies run", 45120, 45144, "", "Picked up hot tub chemicals"),
    ("2026-01-08", "Smokies Ridge", "Property inspection visit", "Property inspection", 45150, 45195, "", "Quarterly inspection"),
    ("2026-01-15", "Creek Side", "Knoxville airport guest pickup", "Guest transport", 45200, 45292, "", "Airbnb Plus comped ride"),
    ("2026-01-20", "Smokies Ridge", "Meet new cleaner onsite", "Meeting cleaner", 45300, 45345, "", "Onboard Jamie"),
    ("2026-02-02", "Creek Side", "Turnover walkthrough", "Turnover", 45400, 45490, "", ""),
    ("2026-02-07", "Lakehouse A", "Supplies + inspection", "Supplies run", 45500, 45565, "", ""),
    ("2026-02-10", "Smokies Ridge", "Burst pipe emergency", "Repairs", 45600, 45648, "", "Plumber met me"),
    ("2026-02-14", "Creek Side", "Hot tub service", "Repairs", 45700, 45790, "", ""),
    ("2026-02-18", "Lakehouse A", "Quarterly inspection", "Property inspection", 45800, 45867, "", ""),
    ("2026-02-22", "Smokies Ridge", "Guest pickup airport", "Guest transport", 45900, 45992, "", ""),
    ("2026-02-28", "Creek Side", "Cleaner check-in", "Meeting cleaner", 46050, 46095, "", ""),
    ("2026-03-05", "Lakehouse A", "Lowe's run", "Supplies run", 46150, 46178, "", "Bought new kettle"),
    ("2026-03-10", "Smokies Ridge", "Turnover issue callback", "Turnover", 46200, 46245, "", "Guest complaint follow-up"),
    ("2026-03-14", "Creek Side", "Handyman meeting", "Repairs", 46300, 46349, "", ""),
    ("2026-03-18", "Smokies Ridge", "Property inspection visit", "Property inspection", 46400, 46445, "", ""),
    ("2026-03-22", "Lakehouse A", "Guest transport — late flight", "Guest transport", 46500, 46587, "", ""),
    ("2026-03-25", "Creek Side", "Supplies — Costco", "Supplies run", 46650, 46695, "", ""),
    ("2026-03-28", "Smokies Ridge", "Turnover final check", "Turnover", 46800, 46843, "", ""),
    ("2026-03-30", "Lakehouse A", "Supplies — Target", "Supplies run", 46900, 46928, "", ""),
    ("2026-03-31", "Smokies Ridge", "Month-end inspection", "Property inspection", 46950, 46995, "", ""),
]


def style_cell(cell, style_dict):
    for attr, value in style_dict.items():
        setattr(cell, attr, value)


def build_welcome_tab(wb):
    ws = wb.active
    ws.title = "Welcome"
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 95)])
    apply_brand_header(ws, "STR Mileage Log", "IRS-compliant, auto-calculated, CPA-ready")

    ws.cell(row=5, column=1, value="What this covers (IRS Publication 463 compliance)").font = Font(
        name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    ws.cell(row=6, column=1, value=(
        "The IRS requires 4 things on every business-mileage entry: date, destination, "
        "business purpose, and miles driven. This log captures all 4 plus odometer "
        "readings, property allocation, and calculated $ deduction at the current rate."
    )).alignment = Alignment(wrap_text=True)

    ws.cell(row=8, column=1, value="How to use").font = Font(
        name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    steps = [
        "1. Open tab 2 (Mileage Log). Fill one row per trip.",
        "2. Use EITHER odometer columns (E + F auto-calc) OR typed Miles column (G). Formula uses odometer if both are filled.",
        "3. Choose Property + Business Purpose from dropdowns.",
        "4. Column K ('✔ IRS') flags incomplete rows — red means audit-risk.",
        "5. Switch to tab 3 (Monthly Summary) for month-by-month totals.",
        "6. Switch to tab 4 (YTD Dashboard) for totals + breakdown by purpose.",
        "7. At tax time: File → Print → select tabs 3 + 4. That's your CPA handoff.",
    ]
    for i, s in enumerate(steps, start=9):
        ws.cell(row=i, column=1, value=s).alignment = Alignment(wrap_text=True)

    ws.cell(row=17, column=1, value=(
        f"⚠ IRS rate updates January 1 each year. Current (2026): ${IRS_RATE_2026}/mi. "
        "Update cell B5 on the Settings tab each January. Check irs.gov Publication 463."
    )).font = Font(size=11, italic=True, color=COLOR_ERROR)
    ws.cell(row=17, column=1).alignment = Alignment(wrap_text=True)

    add_upgrade_banner(ws, 19)


def build_log_tab(wb):
    ws = wb.create_sheet("Mileage Log")
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 12), ("B", 20), ("C", 28), ("D", 22),
                        ("E", 10), ("F", 10), ("G", 10), ("H", 10),
                        ("I", 12), ("J", 30), ("K", 14)])
    apply_brand_header(ws, "Mileage Log", "One row per trip — odometer or typed miles")
    ws.freeze_panes = "A6"

    headers = ["Date", "Property", "Destination", "Business Purpose",
               "Start Odo", "End Odo", "Miles (typed alt)",
               "Calculated Miles", "$ Deduction", "Notes", "✔ IRS"]
    hs = header_row_style()
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        for attr, value in hs.items():
            setattr(cell, attr, value)

    # Sample + capacity rows
    for i in range(6, 2006):
        sample = SAMPLE_ROWS[i - 6] if i - 6 < len(SAMPLE_ROWS) else None
        # Col A Date
        ws.cell(row=i, column=1, value=sample[0] if sample else None).number_format = "yyyy-mm-dd"
        # Col B Property
        ws.cell(row=i, column=2, value=sample[1] if sample else None)
        # Col C Destination
        ws.cell(row=i, column=3, value=sample[2] if sample else None)
        # Col D Purpose
        ws.cell(row=i, column=4, value=sample[3] if sample else None)
        # Col E Start Odo
        ws.cell(row=i, column=5, value=sample[4] if sample else None)
        # Col F End Odo
        ws.cell(row=i, column=6, value=sample[5] if sample else None)
        # Col G Typed miles (fallback)
        ws.cell(row=i, column=7, value=sample[6] if sample else None)
        # Col H Calculated miles formula
        ws.cell(row=i, column=8, value=f'=IF(AND(E{i}<>"",F{i}<>""), F{i}-E{i}, IF(G{i}<>"", G{i}, 0))')
        ws.cell(row=i, column=8).number_format = "0"
        # Col I $ deduction
        ws.cell(row=i, column=9, value=f"=H{i}*Settings!$B$5")
        ws.cell(row=i, column=9).number_format = '"$"#,##0.00'
        # Col J notes
        ws.cell(row=i, column=10, value=sample[7] if sample else None)
        # Col K IRS check
        ws.cell(row=i, column=11, value=f'=IF(AND(A{i}<>"",C{i}<>"",D{i}<>"",H{i}>0),"✓","⚠ missing")')

        # Input styling on cols A-G, J for sample rows
        if sample:
            for col in [1, 2, 3, 4, 5, 6, 7, 10]:
                style_cell(ws.cell(row=i, column=col), input_cell_style())

    # Dropdowns
    dv_prop = DataValidation(type="list", formula1="=Settings!$E$11:$E$30", allow_blank=True)
    dv_prop.add("B6:B2005"); ws.add_data_validation(dv_prop)

    dv_pur = DataValidation(type="list", formula1="=Settings!$G$11:$G$30", allow_blank=True)
    dv_pur.add("D6:D2005"); ws.add_data_validation(dv_pur)

    # Conditional formatting col K
    red_fill = PatternFill("solid", fgColor="FFCCCC")
    green_fill = PatternFill("solid", fgColor="C7EFCF")
    ws.conditional_formatting.add("K6:K2005",
        FormulaRule(formula=['K6="⚠ missing"'], fill=red_fill))
    ws.conditional_formatting.add("K6:K2005",
        FormulaRule(formula=['K6="✓"'], fill=green_fill))


def build_monthly_tab(wb):
    ws = wb.create_sheet("Monthly Summary")
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 14), ("B", 14), ("C", 16), ("D", 14)])
    apply_brand_header(ws, "Monthly Summary", "Auto-calculated from the Mileage Log")
    ws.freeze_panes = "A6"

    headers = ["Month", "Miles", "$ Deduction", "Trip Count"]
    hs = header_row_style()
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        for attr, value in hs.items():
            setattr(cell, attr, value)

    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    for i, m in enumerate(months, start=6):
        month_num = i - 5
        ws.cell(row=i, column=1, value=f"{m} {{YYYY}}")
        ws.cell(row=i, column=2,
            value=f'=SUMIFS(\'Mileage Log\'!$H:$H, \'Mileage Log\'!$A:$A, ">="&DATE(YEAR(TODAY()),{month_num},1), \'Mileage Log\'!$A:$A, "<"&DATE(YEAR(TODAY()),{month_num+1},1))')
        ws.cell(row=i, column=2).number_format = "0"
        ws.cell(row=i, column=3, value=f"=B{i}*Settings!$B$5")
        ws.cell(row=i, column=3).number_format = '"$"#,##0.00'
        ws.cell(row=i, column=4,
            value=f'=COUNTIFS(\'Mileage Log\'!$A:$A, ">="&DATE(YEAR(TODAY()),{month_num},1), \'Mileage Log\'!$A:$A, "<"&DATE(YEAR(TODAY()),{month_num+1},1))')

    # YTD totals row 19
    ws.cell(row=19, column=1, value="YTD Total").font = Font(bold=True, color=COLOR_PRIMARY)
    ws.cell(row=19, column=2, value="=SUM(B6:B17)").number_format = "0"
    ws.cell(row=19, column=3, value="=SUM(C6:C17)").number_format = '"$"#,##0.00'
    ws.cell(row=19, column=4, value="=SUM(D6:D17)")
    for col in range(1, 5):
        ws.cell(row=19, column=col).font = Font(bold=True)
        ws.cell(row=19, column=col).fill = PatternFill("solid", fgColor="FFE9B0")


def build_ytd_tab(wb):
    ws = wb.create_sheet("YTD Dashboard")
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 32), ("B", 18), ("C", 14)])
    apply_brand_header(ws, "YTD Dashboard", "Totals + breakdown by purpose")

    ws.cell(row=5, column=1, value="YTD Total Miles:").font = Font(bold=True)
    ws.cell(row=5, column=2, value="='Monthly Summary'!B19").number_format = "0"
    ws.cell(row=6, column=1, value="YTD Total Deduction ($):").font = Font(bold=True)
    ws.cell(row=6, column=2, value="='Monthly Summary'!C19").number_format = '"$"#,##0.00'
    ws.cell(row=7, column=1, value="YTD Trips:").font = Font(bold=True)
    ws.cell(row=7, column=2, value="='Monthly Summary'!D19")

    ws.cell(row=9, column=1, value="Miles by Business Purpose").font = Font(
        name=FONT_HEAD, size=13, bold=True, color=COLOR_PRIMARY)
    ws.cell(row=10, column=1, value="Purpose").font = Font(bold=True)
    ws.cell(row=10, column=2, value="Miles").font = Font(bold=True)
    ws.cell(row=10, column=3, value="$").font = Font(bold=True)
    for i, purpose in enumerate(PURPOSES, start=11):
        ws.cell(row=i, column=1, value=purpose)
        ws.cell(row=i, column=2, value=f'=SUMIFS(\'Mileage Log\'!$H:$H, \'Mileage Log\'!$D:$D, A{i})').number_format = "0"
        ws.cell(row=i, column=3, value=f"=B{i}*Settings!$B$5").number_format = '"$"#,##0.00'


def build_settings_tab(wb):
    ws = wb.create_sheet("Settings")
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 28), ("B", 14), ("C", 6), ("D", 18), ("E", 22), ("F", 6), ("G", 26)])
    apply_brand_header(ws, "Settings", "IRS rate + dropdowns sources")

    ws.cell(row=5, column=1, value="IRS Rate (per mile, business):").font = Font(bold=True)
    cell = ws.cell(row=5, column=2, value=IRS_RATE_2026)
    style_cell(cell, input_cell_style())
    cell.number_format = '"$"0.000'

    ws.cell(row=7, column=1, value="Historical rates for reference:").font = Font(italic=True)
    for i, (year, rate) in enumerate([(2023, 0.655), (2024, 0.67), (2025, 0.70)], start=8):
        ws.cell(row=i, column=1, value=f"{year}:")
        ws.cell(row=i, column=2, value=rate).number_format = '"$"0.000'

    ws.cell(row=10, column=5, value="Property list").font = Font(bold=True)
    for i, prop in enumerate(PROPERTIES, start=11):
        cell = ws.cell(row=i, column=5, value=prop)
        style_cell(cell, input_cell_style())

    ws.cell(row=10, column=7, value="Purpose list").font = Font(bold=True)
    for i, purpose in enumerate(PURPOSES, start=11):
        cell = ws.cell(row=i, column=7, value=purpose)
        style_cell(cell, input_cell_style())


def main():
    wb = Workbook()
    build_welcome_tab(wb)
    build_log_tab(wb)
    build_monthly_tab(wb)
    build_ytd_tab(wb)
    build_settings_tab(wb)

    wb.properties.title = "STR Mileage Log — The STR Ledger"
    wb.properties.creator = "The STR Ledger"
    wb.properties.description = "IRS-compliant mileage log for STR hosts (Schedule C/E)."

    OUT.parent.mkdir(parents=True, exist_ok=True)
    wb.save(OUT)
    print(f"Saved: {OUT}")


if __name__ == "__main__":
    main()
```

- [ ] **Step 5: Build + smoke test + QA**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates/templates/_build"
python build_mileage_log.py
python -c "from openpyxl import load_workbook; wb = load_workbook('../_masters/TAX-001-mileage-log.xlsx'); print('tabs:', wb.sheetnames); assert len(wb.sheetnames) == 5; print('OK')"
```

Expected: 5 tabs, "OK".

Daniel QA in Excel on Windows:
- [ ] IRS rate at $0.70 displayed on Settings tab
- [ ] Sample log rows calculate: e.g. row 6 (24 miles × $0.70 = $16.80)
- [ ] ✔ IRS column shows green ✓ for complete rows, red ⚠ for incomplete
- [ ] Property + Purpose dropdowns work
- [ ] Monthly Summary shows Jan/Feb/Mar miles; YTD = ~380
- [ ] YTD Dashboard "Miles by Purpose" correctly categorizes

- [ ] **Step 6: Commit + approval**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_build/build_mileage_log.py templates/_masters/TAX-001-mileage-log.xlsx
git commit -m "build: TAX-001 Mileage Log Excel master (5 tabs, IRS Pub 463 compliant)"
git commit --allow-empty -m "approved: TAX-001 QA passed on Windows Excel"
```

- [ ] **Step 7: Claude writes delivery assets**

```bash
mkdir -p "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates/templates/_delivery/TAX-001-mileage-log"
```

Write `templates/_delivery/TAX-001-mileage-log/thumbnails.md`:
```markdown
# Thumbnail Specs — TAX-001 Mileage Log

## Thumbnail 1 — Hero
- Mockup: MacBook showing Mileage Log tab with sample rows visible + Settings IRS rate highlighted
- Headline: `STR Mileage Log — IRS Pub 463 Compliant`
- Sub: `$0.70/mi auto. CPA-ready. Editable.`
- Export: `thumb-1.png`

## Thumbnail 2 — $ focus
- Mockup: large text overlay "$2,847 deducted" on YTD dashboard screenshot
- Headline: `The Deduction You're Missing.`
- Sub: `Every trip. Every property. Every dollar.`
- Export: `thumb-2.png`

## Thumbnail 3 — Before/After
- Split: LEFT "notebook with scribbles" photo; RIGHT Monthly Summary tab screenshot
- Headline: `Stop Guessing at Tax Time.`
- Sub: `Your CPA will love this file.`
- Export: `thumb-3.png`

## Thumbnail 4 — Auto-calc
- Mockup: animation-frame-style showing trip row → formula highlights → deduction auto-filled
- Headline: `Type. Save. Auto-Deducted.`
- Sub: `Odometer or typed miles — formula handles both.`
- Export: `thumb-4.png`

## Thumbnail 5 — What's included
- Card:
  ✓ IRS-compliant log (date, destination, purpose, miles)
  ✓ Auto-calc at 2026 IRS rate ($0.70/mi) — editable cell for future years
  ✓ Monthly summary + YTD dashboard
  ✓ Breakdown by business purpose (7 categories)
  ✓ Compliance-check column (red/green flag)
  ✓ 2000-row capacity — 10+ years of mileage
- Headline: `What You Get`
- Sub: `Opens in Excel 2016+, Excel 365, Google Sheets`
- Export: `thumb-5.png`
```

Write `templates/_delivery/TAX-001-mileage-log/TAX-001-howto.md`:
```markdown
# How to Use Your STR Mileage Log

**The STR Ledger · thestrledger.com**

## What the IRS requires (Pub 463)

Four things per trip: date, destination, business purpose, miles. This log captures all four — plus more — and auto-calculates your $ deduction at the current IRS rate.

## First-time setup (3 min)

1. Open tab **Settings** — cell B5 is the current IRS rate ($0.70 for 2026). Update every January 1.
2. Tab **Settings** col E rows 11+: replace sample properties with yours.
3. Tab **Settings** col G rows 11+: customize purpose list if needed (keep generic: "Supplies run" covers many).

## Every time you drive

Open tab **Mileage Log**. Fill a row:
- Date
- Property (dropdown)
- Destination (Home Depot, airport, guest home)
- Business purpose (dropdown)
- EITHER Start Odo + End Odo (columns E + F) — formula subtracts
- OR typed Miles (column G) — formula uses this if E + F empty
- Notes (optional)

Column K will show ✓ when the row is complete, ⚠ if anything required is missing.

## Reading the outputs

- **Monthly Summary**: miles + $ per month, across all properties
- **YTD Dashboard**: totals + breakdown by purpose

## At tax time

1. Print tabs 3 + 4 to PDF (File → Print → "Monthly Summary + YTD Dashboard").
2. Send to CPA. That's it.

## Questions?

**hello@thestrledger.com** — real humans, fast replies.

---

**Upgrade path:** Tax Season Bundle at thestrledger.com/tax-bundle — mileage log + home office deduction + 1099-NEC tracker + Schedule E prep, $147 (save 58% vs buying separately during tax season).

Get on our list at **thestrledger.com/47** for our free "47 Airbnb Tax Deductions Most Hosts Miss" guide.

---

© 2026 The STR Ledger · For use by one business · See license for full terms
```

Write `templates/_delivery/TAX-001-mileage-log/TAX-001-license.md` — copy from `_shared/license-template.md` with `**Template:** STR Mileage Log (SKU: TAX-001)`.

- [ ] **Step 8: Refresh existing listing copy**

Edit `copy/etsy-listings/TAX-001-mileage-log.md`:
- Remove any `**Status:** ⚠️ SPECULATIVE` block (first 10 lines); replace with:
```markdown
**Status:** Ready to publish. Build complete (Task 9). Delivery assets complete (Task 9). Awaiting Etsy upload (Task 11).
**Pricing:** $17 Etsy · $17 own-site
**Files attached:** TAX-001-mileage-log.xlsx, etsy-upgrade-insert.pdf, TAX-001-howto.pdf, TAX-001-license.pdf, preview.pdf
```
- Replace every `<brand>` with `The STR Ledger`
- Replace every `<domain>` with `thestrledger.com`
- Verify title (≤140 chars), 13 tags, description all present — if missing, use the same structure as the OPS-001 listing.

- [ ] **Step 9: Commit delivery + listing refresh**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_delivery/TAX-001-mileage-log/ copy/etsy-listings/TAX-001-mileage-log.md
git commit -m "deliver: TAX-001 Mileage Log — thumbnails spec, howto, license, listing refresh"
```

- [ ] **Step 10: Daniel builds thumbnails + PDFs in Vista Create**

Per `thumbnails.md`. Export + commit:

```bash
git add templates/_delivery/TAX-001-mileage-log/
git commit -m "deliver: TAX-001 thumbnails + branded PDFs exported"
```

---

### Task 10: A13 — Shared Etsy buyer companion PDF

**Files:**
- Create: `templates/_delivery/_shared/etsy-upgrade-insert.md` (Claude source)
- Create (by Daniel): `templates/_delivery/_shared/etsy-upgrade-insert.pdf` (Vista Create)

**Acceptance:** 1-page branded PDF ready to attach as file #2 on every Etsy listing.

- [ ] **Step 1: Claude writes the PDF source**

Write `templates/_delivery/_shared/etsy-upgrade-insert.md`:
```markdown
# Thanks for grabbing this template

**The STR Ledger · thestrledger.com**

---

You just got a tool built for hosts who treat their properties like a business. Here's what's next.

## Upgrade path

This template is part of a growing library. If you're running 3+ properties, check out:

**The Portfolio Bundle** — our flagship 32-template pack for multi-property hosts (tax prep, P&Ls, operations, pricing, growth). $397 instead of $900 as individual templates. **thestrledger.com/portfolio-bundle**

**The Tax Season Bundle** — 8 templates that handle every tax-season deliverable your CPA asks for. Price escalates as Tax Day approaches: $127 (Jan), $147 (Feb), $167 (Mar), $187 (Apr). **thestrledger.com/tax-bundle**

## Free — right now

**"47 Airbnb Tax Deductions Most Hosts Miss"** — the PDF + Excel checklist we wish every host had before their first tax season. Hosts average $3-8K in additional deductions after using it.

> **Grab it free at thestrledger.com/47** — no strings, no upsell on the landing page.

(Scan this QR code to skip the typing)

[QR CODE: thestrledger.com/47]

## Stay in the loop

Weekly-ish emails with:
- New template drops (members get them free)
- Annual IRS rate updates (we send the refresh, you keep using your template)
- Host-specific tax + ops playbooks

Subscribe with the same lead magnet above — we don't spam, one-click unsubscribe any time.

## Questions about your template?

Email **hello@thestrledger.com** — real humans, fast replies.

---

© 2026 The STR Ledger · thestrledger.com
```

- [ ] **Step 2: Commit source**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_delivery/_shared/etsy-upgrade-insert.md
git commit -m "deliver: shared Etsy buyer upgrade/lead insert PDF source"
```

- [ ] **Step 3: Daniel builds branded PDF in Vista Create**

- Open Vista Create Pro → new 8.5×11 portrait document
- Apply brand kit (navy + tan palette, Playfair Display + Inter fonts)
- Paste content from the markdown above; style with:
  - Large headline at top ("Thanks for grabbing this template") — Playfair 36pt navy
  - Body — Inter 11pt, 1.4 line-height
  - Pull-quote boxes for the "Free — right now" section (tan background card)
  - QR code → Vista Create Elements → search "QR code", set URL to `thestrledger.com/47`
  - Brand header bar (navy strip with logo) across top
  - Brand footer (tan strip) across bottom
- Export as PDF → save to `templates/_delivery/_shared/etsy-upgrade-insert.pdf`

- [ ] **Step 4: Commit PDF**

```bash
git add templates/_delivery/_shared/etsy-upgrade-insert.pdf
git commit -m "deliver: shared Etsy buyer insert PDF — built in Vista Create"
```

---

## ✅ Gate G2 (Day 4) + Gate G3 (Day 6) — Wave 1 ready

**G2 check (Day 4):** Tasks 5-9 Excel builds complete.
- `ls templates/_masters/` shows: `GST-001-welcome-book.xlsx`, `OPS-001-turnover-checklist.xlsx`, `TAX-001-mileage-log.xlsx`
- All 3 have at least one "approved: ... QA passed" commit

**G3 check (Day 6):** Tasks 7, 8, 9, 10 delivery complete.
- `ls templates/_delivery/` shows 3 product folders + _shared
- Each product folder has 5 PNG thumbnails + 2 branded PDFs (howto, license)
- `_shared/etsy-upgrade-insert.pdf` exists
- 4 listings in `copy/etsy-listings/` (3 Wave 1 SKUs + 1 new OPS-001) all have status "Ready to publish"

If either check fails: stop-the-line. Fix before proceeding to Task 11.

---

## Phase 3 — Wave 1 Launch (Day 7)

### Task 11: Wave 1 Etsy listings upload + test purchase

**Files:**
- Create: `infrastructure/etsy/listing-ids.md`

**Owner:** Daniel. Claude provides the exact upload checklist per listing.

**Acceptance:** 3 listings live on Etsy. Test purchase succeeds on Welcome Book. Listing IDs captured.

- [ ] **Step 1: Upload GST-001 Welcome Book**

In Etsy Shop Manager → Listings → Add a listing.

Fill exactly:
- **About this listing:** Type = Digital; Who made it = I did; What is it = A finished product; When was it made = Made to order
- **Listing photos (5 thumbs + 1 preview):** Upload in order:
  1. `templates/_delivery/GST-001-welcome-book/thumb-1.png`
  2. `thumb-2.png`
  3. `thumb-3.png`
  4. `thumb-4.png`
  5. `thumb-5.png`
- **Title (paste from `copy/etsy-listings/GST-001-welcome-book.md` Title block):**
  `Airbnb Welcome Book Template | Editable Excel + PDF | STR Host Guest Guide | Vacation Rental Welcome Packet | Instant Download`
- **Category:** Digital Downloads → Other Digital Downloads → Business & Office
- **Renewal:** Automatic (4-month renewal)
- **Description:** paste the description block from the listing file (between the triple backticks)
- **Price:** $17.00
- **Quantity:** 999 (digital = effectively unlimited)
- **SKU:** GST-001
- **Tags (13):** `airbnb welcome book, vrbo host template, airbnb printable, welcome book pdf, str template, vacation rental, airbnb host gift, airbnb template, welcome guide, house manual, guest book, rental property, airbnb editable`
- **Materials:** (leave blank — digital)
- **Style:** Modern, Minimalist

**Variations:** none.

**Digital files (up to 5):**
1. `templates/_masters/GST-001-welcome-book.xlsx`
2. `templates/_delivery/_shared/etsy-upgrade-insert.pdf`
3. `templates/_delivery/GST-001-welcome-book/GST-001-howto.pdf`
4. `templates/_delivery/GST-001-welcome-book/GST-001-license.pdf`
5. (optional) PDF export of the xlsx itself — skip if short on time

Save as Draft. Do NOT publish yet.

- [ ] **Step 2: Upload OPS-001 Turnover Checklist**

Same process. Title from `copy/etsy-listings/OPS-001-turnover-checklist.md`:
`Airbnb Cleaner Turnover Checklist & Scorecard | Excel + Printable PDF | STR Host Cleaning Tracker | Vacation Rental Cleaning`

- Price: $12.00
- SKU: OPS-001
- Tags (13): `airbnb cleaning checklist, str cleaner tracker, vacation rental cleaning, turnover checklist, airbnb template, cleaner scorecard, vrbo cleaning, str template, airbnb host tool, rental property cleaning, cleaning schedule, housekeeping tracker, airbnb printable`
- Files: master xlsx, shared insert PDF, howto PDF, license PDF, Printable-Checklist PDF export

Save as Draft.

- [ ] **Step 3: Upload TAX-001 Mileage Log**

Title from listing file. Example:
`Airbnb Mileage Log Spreadsheet | IRS Compliant STR Mileage Tracker | Excel + Google Sheets | Vacation Rental Tax Deduction`

- Price: $17.00
- SKU: TAX-001
- Tags (13): harvest during SEO pass; initial: `airbnb mileage log, str mileage tracker, irs mileage log, vacation rental tax, mileage spreadsheet, airbnb tax deduction, rental property mileage, business mileage log, tax deduction template, vrbo tax, str tax template, schedule c mileage, airbnb template`
- Files: master xlsx, shared insert PDF, howto PDF, license PDF

Save as Draft.

- [ ] **Step 4: Test purchase — GST-001**

From a secondary Etsy account (personal account if separate, or ask a friend):
1. In the draft listing, click "Preview listing" → copy URL
2. Switch to secondary account
3. Open URL, click Buy
4. Pay via card (accept the ~$18 cost — refund yourself after verifying)
5. Verify all 4 files download; open xlsx in Excel; open PDFs; confirm upgrade CTA visible in both
6. Confirm email lands at `hello@thestrledger.com` with download links

If any file fails to download or open: fix, re-upload, retest.

- [ ] **Step 5: Refund test purchase**

Etsy Shop Manager → Orders → find the test order → Issue full refund.

- [ ] **Step 6: Publish all 3 draft listings**

For each of the 3 drafts: Listings → Draft → Publish.

Capture each listing ID from the URL (the number after `/listing/`).

- [ ] **Step 7: Record listing IDs**

Write `infrastructure/etsy/listing-ids.md`:
```markdown
# Etsy Live Listing IDs

| SKU | Product | Listing ID | URL | Published | Price |
|---|---|---|---|---|---|
| GST-001 | Welcome Book | (paste) | https://etsy.com/listing/(id) | 2026-04-XX | $17 |
| OPS-001 | Turnover Checklist | (paste) | https://etsy.com/listing/(id) | 2026-04-XX | $12 |
| TAX-001 | Mileage Log | (paste) | https://etsy.com/listing/(id) | 2026-04-XX | $17 |
```

Replace `(paste)` with real IDs. Replace date with today's date.

- [ ] **Step 8: Commit milestone**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add infrastructure/etsy/listing-ids.md
git commit -m "launch: Wave 1 live on Etsy — GST-001, OPS-001, TAX-001 — G4 passed"
```

## ✅ Gate G4 (Day 7) — Wave 1 LIVE

Check:
- 3 listings visible at `etsy.com/shop/thestrledger`
- Each has 5+ thumbnails, price set, SKU set, 13 tags
- Shop banner + icon + about + policies all render
- Test purchase succeeded + was refunded

Master spec §12 milestone "Week 2: Etsy revenue > $0" → unlocked (first organic sale possible).

---

## Phase 4 — Wave 2 Production (Days 8–13)

### Task 12: TAX-003 1099-NEC Contractor Tracker — Brief, Spec, Build, Delivery, Listing refresh

**Files:** Same 10-artifact stack. SKU = TAX-003. Existing listing file refreshed.

- [ ] **Step 1: Claude writes the brief**

Write `templates/_briefs/TAX-003-1099-nec-tracker.md`:
```markdown
# Brief — TAX-003 1099-NEC Contractor Tracker

**SKU:** TAX-003
**Category:** Financial / Accounting (master spec §3.2 A #12)
**Tier:** T1
**Etsy price:** $17
**Own-site price:** $17 (same)
**Wave:** 2

## Target persona

Semi-Pro Sarah (3-10 properties) paying cleaners, handymen, landscapers, photographers — anyone she pays $600+/year must get a 1099-NEC from her by Jan 31.

## The one specific pain

"I pay my cleaner ~$400 per turnover × 60 turnovers = $24K/year. She's getting a 1099. But I also pay a handyman $80 here, $300 there, and a photographer $500 once. Who crossed the $600 threshold? I have no idea. My CPA asked for my 1099 list last January and I spent 3 days piecing it together from Venmo."

## What this template does

Contractor payment tracker that:
1. Logs every payment to every contractor across the year
2. Auto-flags contractors who crossed the $600 IRS threshold (1099-NEC required)
3. Compiles W-9 contact info per contractor
4. Generates year-end 1099 prep summary
5. Handles multiple payment methods (Venmo, Zelle, check, cash)

## Sheets / Tabs

| # | Tab | Role |
|---|---|---|
| 1 | Welcome | Cover + 1099-NEC rules note |
| 2 | Contractors | W-9 info per contractor (name, EIN/SSN, address, email) |
| 3 | Payment Log | One row per payment |
| 4 | 1099 Prep Dashboard | Auto-rolling YTD totals, threshold flag |
| 5 | Settings | Threshold ($600), tax year |

## Inputs

**Contractors tab** (rows 6-55, 50-contractor capacity):
- Name, Business name, EIN or SSN, Address lines, Email, Phone, Services, W-9 on file? (Yes/No), W-9 date

**Payment Log tab** (rows 6-2005, 2000-payment capacity):
- Date, Contractor (dropdown from Contractors tab), Amount, Payment method (dropdown: Venmo/Zelle/Check/Cash/ACH/Other), Property, Description, Notes

## Outputs (1099 Prep Dashboard)

- Col A: contractor name
- Col B: YTD paid = `=SUMIFS(Payment Log!$C:$C, Payment Log!$B:$B, A5)`
- Col C: 1099 required? = `=IF(B5>=Settings!$B$5, "YES", "no")` — green/red formatting
- Col D: W-9 on file = lookup to Contractors tab
- Col E: Status = `=IF(C5="YES", IF(D5="Yes","✓ Ready","⚠ Need W-9"), "n/a")`

## External data references

- 2026 IRS threshold: **$600/year** for 1099-NEC. Editable on Settings tab.
- IRS Pub 1220 reference (business rule only — no linked data).

## Business logic

- Threshold cell editable (IRS may change rate; 2024 saw debate).
- Color coding: YES in red, "no" in gray, "✓ Ready" in green, "⚠ Need W-9" in yellow.
- Payment log dropdown for Contractor is dependent on Contractors tab.
- Sort options: dashboard should be sortable by YTD paid descending — user can use Excel's sort feature (no auto-sort).

## QA sample data

5 contractors, 40 payments across 2026:
- "Sarah Smokies Clean" — 24 payments × $400 = $9,600 (YES, needs W-9)
- "Bob Handyman" — 5 payments avg $200 = $1,000 (YES, needs W-9)
- "Lens Photography" — 1 payment $500 (no — below threshold)
- "Joe Landscape" — 10 payments × $80 = $800 (YES, needs W-9)
- "Quick Plumbing" — 2 payments $300 = $600 (YES — right at threshold, needs W-9)

Expected dashboard: 4 contractors flagged YES, 1 "no". W-9 status depends on Contractors tab entries (sample: Sarah + Bob have W-9; Joe + Quick Plumbing don't → ⚠).

## Upgrade CTA

"Upgrade to the Tax Season Bundle at thestrledger.com/tax-bundle — 1099-NEC tracker + mileage log + Schedule E prep + home office deduction, $147."

## Out-of-scope

- Filing the actual 1099-NEC (template produces the prep summary; user files via QuickBooks, Track1099, or CPA)
- W-9 template (user downloads from IRS.gov)
- State-level 1099 rules (federal only for MVP)
```

- [ ] **Step 2: Claude writes the sheet spec**

Write `templates/_briefs/TAX-003-1099-nec-tracker-spec.md`:
```markdown
# Sheet Spec — TAX-003 1099-NEC Contractor Tracker

## Workbook-level
- Filename: `TAX-003-1099-nec-tracker.xlsx`
- All tabs tan; dashboard tab has extra emphasis (bold tab title)

## Sheet 1 — Welcome
Rows 1-3: brand header (title "1099-NEC Contractor Tracker")
Row 5: "The 1099-NEC Rule (IRS 2026)"
Row 6-8: explanation — anyone you pay $600+ in a calendar year for business services requires a 1099-NEC sent by Jan 31 of next year. Penalties for missing forms: $60-$310 per form.
Row 10: "How to use"
Rows 11-16: 6-step walkthrough (add contractors first, log payments as they happen, check dashboard monthly, chase W-9s in December, file 1099s in January)
Row 18: upgrade banner

## Sheet 2 — Contractors
Row 5 headers (styled): Name | Business Name | EIN/SSN | Address | City | State | Zip | Email | Phone | Services | W-9 on File? (Y/N) | W-9 Received Date
Rows 6-55: input rows; sample rows 6-10 populate 5 contractors from brief

Col widths: A=24 B=24 C=16 D=32 E=16 F=6 G=10 H=28 I=16 J=28 K=8 L=14

Data validation K (W-9 dropdown): Yes / No

## Sheet 3 — Payment Log
Row 5 headers: Date | Contractor | Amount | Payment Method | Property | Description | Notes
Rows 6-2005: capacity

Col C (Amount): currency format $#,##0.00
Dropdown col B: list = Contractors!$A$6:$A$55
Dropdown col D: list = "Venmo, Zelle, Check, Cash, ACH, Credit Card, Other"

Sample rows 6-45: 40 payments populated from brief QA data

## Sheet 4 — 1099 Prep Dashboard
Row 5 headers: Contractor | YTD Paid | 1099 Required? | W-9 on File? | Status

Rows 6-55 formulas (one per contractor slot):
- A: `=Contractors!A6` (reference)
- B: `=IF(A6<>"", SUMIFS('Payment Log'!$C:$C, 'Payment Log'!$B:$B, A6), "")` (currency)
- C: `=IF(A6<>"", IF(B6>=Settings!$B$5, "YES", "no"), "")`
- D: `=IF(A6<>"", VLOOKUP(A6, Contractors!$A$6:$L$55, 11, FALSE), "")`
- E: `=IF(A6="","",IF(C6="YES", IF(D6="Yes","✓ Ready","⚠ Need W-9"), "n/a"))`

Conditional formatting:
- Col C "YES": red fill + bold
- Col C "no": light gray fill
- Col E "✓ Ready": green fill
- Col E "⚠ Need W-9": yellow fill

Row 60: "Summary"
Row 61: "Contractors requiring 1099:" with formula `=COUNTIF(C6:C55, "YES")`
Row 62: "Of those, ready (W-9 on file):" with formula `=COUNTIF(E6:E55, "✓ Ready")`
Row 63: "Of those, need W-9:" `=COUNTIF(E6:E55, "⚠ Need W-9")`
Row 64: "Total 1099-NEC $ volume:" `=SUMIFS(B6:B55, C6:C55, "YES")` (currency)

## Sheet 5 — Settings
Row 5: Label "IRS 1099-NEC threshold ($):" | B5 input `=600` currency format
Row 7: Label "Tax year:" | B7 input `=YEAR(TODAY())`
Row 9: Label "IRS 1099 penalty (reference):"
Row 10-14: table of penalty amounts from IRS Pub 1220 — $60 if filed ≤30 days late, $130 31-Aug, $330 later, $660 intentional disregard
```

- [ ] **Step 3: Commit brief + spec**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_briefs/TAX-003-1099-nec-tracker.md templates/_briefs/TAX-003-1099-nec-tracker-spec.md
git commit -m "brief: TAX-003 1099-NEC Tracker — brief + sheet spec"
git commit --allow-empty -m "approved: TAX-003 brief reviewed by Daniel"
```

- [ ] **Step 4: Claude writes the build script**

Write `templates/_build/build_1099_nec_tracker.py`:
```python
"""Build TAX-003 1099-NEC Contractor Tracker Excel file."""
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.formatting.rule import FormulaRule
from openpyxl.worksheet.datavalidation import DataValidation

from brand_config import (
    COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT,
    COLOR_MUTED, COLOR_ERROR, FONT_HEAD, FONT_BODY,
    apply_brand_header, input_cell_style, formula_cell_style,
    set_col_widths, add_upgrade_banner, header_row_style,
)

OUT = Path(__file__).resolve().parent.parent / "_masters" / "TAX-003-1099-nec-tracker.xlsx"

CONTRACTORS = [
    ("Sarah Smokies Clean", "Smokies Clean LLC", "XX-XXXXXXX", "147 Pine St", "Gatlinburg", "TN", "37738", "sarah@smokiesclean.com", "(865) 555-0145", "Cleaning services", "Yes", "2025-12-15"),
    ("Bob Handyman", "Bob's Ridge Repair", "XX-XXXXXXX", "20 Ridge Rd", "Sevierville", "TN", "37862", "bob@ridgerepair.com", "(865) 555-0198", "General handyman + repairs", "Yes", "2025-11-20"),
    ("Lens Photography", "Lens Co", "—", "1 Market St", "Knoxville", "TN", "37902", "hello@lensco.com", "(865) 555-0211", "Listing photography", "No", ""),
    ("Joe Landscape", "Joe's Lawn Care", "XX-XXXXXXX", "55 Oak Ln", "Pigeon Forge", "TN", "37863", "joe@joeslawn.com", "(865) 555-0155", "Lawn + landscape", "No", ""),
    ("Quick Plumbing", "Quick Plumbing LLC", "XX-XXXXXXX", "88 Water Way", "Sevierville", "TN", "37862", "info@quickplumbing.com", "(865) 555-0166", "Emergency plumbing", "No", ""),
]


PAYMENTS = [
    # 24 Sarah payments × $400 (turnovers) — cleaning, mixed months
    *[("2026-" + f"{(i//2)+1:02d}-" + f"{(i%2)*14+5:02d}", "Sarah Smokies Clean", 400, "Venmo", "Smokies Ridge", "Turnover", "") for i in range(24)],
    # 5 Bob Handyman payments averaging $200
    ("2026-01-15", "Bob Handyman", 280, "Zelle", "Smokies Ridge", "Kitchen faucet repair", ""),
    ("2026-02-22", "Bob Handyman", 150, "Venmo", "Creek Side", "Door lock replacement", ""),
    ("2026-04-10", "Bob Handyman", 220, "Check", "Lakehouse A", "Deck board replacement", ""),
    ("2026-05-28", "Bob Handyman", 180, "Venmo", "Smokies Ridge", "Water heater fitting", ""),
    ("2026-07-14", "Bob Handyman", 170, "Venmo", "Creek Side", "Misc fixes", ""),
    # 1 Lens Photography — below threshold
    ("2026-03-10", "Lens Photography", 500, "ACH", "Lakehouse A", "Listing photos", "One-time project"),
    # 10 Joe Landscape × $80
    *[("2026-" + f"{((i*5)//10)+4:02d}-" + f"{((i*5)%10)*3+5:02d}", "Joe Landscape", 80, "Zelle", "Smokies Ridge", "Weekly lawn", "") for i in range(10)],
    # 2 Quick Plumbing — right at threshold
    ("2026-06-12", "Quick Plumbing", 300, "Check", "Creek Side", "Emergency leak", ""),
    ("2026-09-05", "Quick Plumbing", 300, "Check", "Lakehouse A", "Water heater call", ""),
]


def style_cell(cell, style_dict):
    for attr, value in style_dict.items():
        setattr(cell, attr, value)


def build_welcome_tab(wb):
    ws = wb.active
    ws.title = "Welcome"
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 95)])
    apply_brand_header(ws, "1099-NEC Contractor Tracker", "Flag the $600 threshold before January")

    ws.cell(row=5, column=1, value="The 1099-NEC Rule (IRS 2026)").font = Font(
        name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    ws.cell(row=6, column=1, value=(
        "Anyone you pay $600 or more in a calendar year for business services requires a 1099-NEC "
        "issued by January 31 of the following year. Penalties for missed forms: $60-$660 per form "
        "(IRS Pub 1220). This tool tracks every payment and flags who crosses the threshold."
    )).alignment = Alignment(wrap_text=True)

    ws.cell(row=8, column=1, value="How to use").font = Font(
        name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    steps = [
        "1. Tab 2 (Contractors): add every contractor you pay — name, tax ID, address, W-9 status.",
        "2. Tab 3 (Payment Log): log every payment as it happens (date, contractor, amount, method).",
        "3. Tab 4 (1099 Prep Dashboard): watch who crosses $600 in real time.",
        "4. Monthly: scan Dashboard for anyone marked YES but without a W-9 → request W-9 immediately.",
        "5. December: ensure every YES contractor has a W-9 on file before year-end.",
        "6. January: file 1099-NECs (via QuickBooks, Track1099, or CPA) using Dashboard data.",
    ]
    for i, s in enumerate(steps, start=9):
        ws.cell(row=i, column=1, value=s).alignment = Alignment(wrap_text=True)

    add_upgrade_banner(ws, 18)


def build_contractors_tab(wb):
    ws = wb.create_sheet("Contractors")
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 24), ("B", 24), ("C", 16), ("D", 32), ("E", 16),
                        ("F", 6), ("G", 10), ("H", 28), ("I", 16), ("J", 28),
                        ("K", 8), ("L", 14)])
    apply_brand_header(ws, "Contractors", "Every vendor — name, tax ID, W-9 status")
    ws.freeze_panes = "A6"

    headers = ["Name", "Business Name", "EIN/SSN", "Address", "City", "State", "Zip",
               "Email", "Phone", "Services", "W-9 on File?", "W-9 Date"]
    hs = header_row_style()
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        for attr, value in hs.items():
            setattr(cell, attr, value)

    for i, c in enumerate(CONTRACTORS, start=6):
        for col, val in enumerate(c, start=1):
            cell = ws.cell(row=i, column=col, value=val)
            style_cell(cell, input_cell_style())
            if col == 12 and val:
                cell.number_format = "yyyy-mm-dd"

    dv_w9 = DataValidation(type="list", formula1='"Yes,No"', allow_blank=True)
    dv_w9.add("K6:K55"); ws.add_data_validation(dv_w9)


def build_log_tab(wb):
    ws = wb.create_sheet("Payment Log")
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 12), ("B", 26), ("C", 12), ("D", 16), ("E", 20), ("F", 32), ("G", 28)])
    apply_brand_header(ws, "Payment Log", "One row per payment")
    ws.freeze_panes = "A6"

    headers = ["Date", "Contractor", "Amount", "Payment Method", "Property", "Description", "Notes"]
    hs = header_row_style()
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        for attr, value in hs.items():
            setattr(cell, attr, value)

    for i, p in enumerate(PAYMENTS, start=6):
        for col, val in enumerate(p, start=1):
            cell = ws.cell(row=i, column=col, value=val)
            style_cell(cell, input_cell_style())
            if col == 1:
                cell.number_format = "yyyy-mm-dd"
            if col == 3:
                cell.number_format = '"$"#,##0.00'

    dv_contr = DataValidation(type="list", formula1="=Contractors!$A$6:$A$55", allow_blank=True)
    dv_contr.add("B6:B2005"); ws.add_data_validation(dv_contr)

    dv_method = DataValidation(type="list", formula1='"Venmo,Zelle,Check,Cash,ACH,Credit Card,Other"', allow_blank=True)
    dv_method.add("D6:D2005"); ws.add_data_validation(dv_method)


def build_dashboard_tab(wb):
    ws = wb.create_sheet("1099 Prep Dashboard")
    ws.sheet_properties.tabColor = COLOR_ACCENT
    set_col_widths(ws, [("A", 28), ("B", 16), ("C", 18), ("D", 16), ("E", 18)])
    apply_brand_header(ws, "1099 Prep Dashboard", "Auto-rolling threshold check")
    ws.freeze_panes = "A6"

    headers = ["Contractor", "YTD Paid", "1099 Required?", "W-9 on File?", "Status"]
    hs = header_row_style()
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        for attr, value in hs.items():
            setattr(cell, attr, value)

    # Formulas for 50 rows
    for i in range(6, 56):
        ws.cell(row=i, column=1, value=f"=IF(Contractors!A{i}=\"\",\"\", Contractors!A{i})")
        ws.cell(row=i, column=2, value=f"=IF(A{i}=\"\",\"\", SUMIFS('Payment Log'!$C:$C, 'Payment Log'!$B:$B, A{i}))")
        ws.cell(row=i, column=2).number_format = '"$"#,##0.00'
        ws.cell(row=i, column=3, value=f'=IF(A{i}="","",IF(B{i}>=Settings!$B$5,"YES","no"))')
        ws.cell(row=i, column=4, value=f'=IF(A{i}="","",IFERROR(VLOOKUP(A{i}, Contractors!$A$6:$L$55, 11, FALSE), "?"))')
        ws.cell(row=i, column=5, value=f'=IF(A{i}="","",IF(C{i}="YES", IF(D{i}="Yes","✓ Ready","⚠ Need W-9"), "n/a"))')

    # Conditional formatting
    red = PatternFill("solid", fgColor="FFCCCC")
    gray = PatternFill("solid", fgColor="EDEDED")
    green = PatternFill("solid", fgColor="C7EFCF")
    yellow = PatternFill("solid", fgColor="FFF3BF")
    ws.conditional_formatting.add("C6:C55", FormulaRule(formula=['C6="YES"'], fill=red, font=Font(bold=True)))
    ws.conditional_formatting.add("C6:C55", FormulaRule(formula=['C6="no"'], fill=gray))
    ws.conditional_formatting.add("E6:E55", FormulaRule(formula=['E6="✓ Ready"'], fill=green))
    ws.conditional_formatting.add("E6:E55", FormulaRule(formula=['E6="⚠ Need W-9"'], fill=yellow))

    # Summary rows
    ws.cell(row=60, column=1, value="Summary").font = Font(name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    summary = [
        ("Contractors requiring 1099:", '=COUNTIF(C6:C55,"YES")', "0"),
        ("Of those, ready (W-9 on file):", '=COUNTIF(E6:E55,"✓ Ready")', "0"),
        ("Of those, need W-9:", '=COUNTIF(E6:E55,"⚠ Need W-9")', "0"),
        ("Total 1099-NEC $ volume:", '=SUMIFS(B6:B55, C6:C55, "YES")', '"$"#,##0.00'),
    ]
    for i, (label, formula, fmt) in enumerate(summary, start=61):
        ws.cell(row=i, column=1, value=label).font = Font(bold=True)
        cell = ws.cell(row=i, column=2, value=formula)
        cell.number_format = fmt
        cell.font = Font(bold=True, color=COLOR_PRIMARY)


def build_settings_tab(wb):
    ws = wb.create_sheet("Settings")
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 36), ("B", 14)])
    apply_brand_header(ws, "Settings", "IRS threshold + tax year")

    ws.cell(row=5, column=1, value="IRS 1099-NEC threshold ($):").font = Font(bold=True)
    cell = ws.cell(row=5, column=2, value=600)
    style_cell(cell, input_cell_style())
    cell.number_format = '"$"#,##0'

    ws.cell(row=7, column=1, value="Tax year:").font = Font(bold=True)
    cell = ws.cell(row=7, column=2, value="=YEAR(TODAY())")
    style_cell(cell, formula_cell_style())

    ws.cell(row=9, column=1, value="IRS 1099 penalty schedule (reference):").font = Font(bold=True)
    penalties = [
        ("Filed ≤30 days late:", "$60 per form"),
        ("Filed 31 days–Aug 1:", "$130 per form"),
        ("Filed after Aug 1:", "$330 per form"),
        ("Intentional disregard:", "$660 per form"),
    ]
    for i, (label, amount) in enumerate(penalties, start=10):
        ws.cell(row=i, column=1, value=label)
        ws.cell(row=i, column=2, value=amount)


def main():
    wb = Workbook()
    build_welcome_tab(wb)
    build_contractors_tab(wb)
    build_log_tab(wb)
    build_dashboard_tab(wb)
    build_settings_tab(wb)

    wb.properties.title = "1099-NEC Contractor Tracker — The STR Ledger"
    wb.properties.creator = "The STR Ledger"
    wb.properties.description = "1099-NEC threshold tracker for STR hosts paying contractors."

    OUT.parent.mkdir(parents=True, exist_ok=True)
    wb.save(OUT)
    print(f"Saved: {OUT}")


if __name__ == "__main__":
    main()
```

- [ ] **Step 5: Build + QA**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates/templates/_build"
python build_1099_nec_tracker.py
python -c "from openpyxl import load_workbook; wb = load_workbook('../_masters/TAX-003-1099-nec-tracker.xlsx'); print('tabs:', wb.sheetnames); assert len(wb.sheetnames) == 5"
```

Daniel QA on Windows:
- Dashboard shows: Sarah $9,600 YES ✓ Ready; Bob $1,000 YES ✓ Ready; Lens $500 "no"; Joe $800 YES ⚠ Need W-9; Quick Plumbing $600 YES ⚠ Need W-9
- Summary row 61: "Contractors requiring 1099: 4"
- Summary row 62: "Ready: 2"
- Summary row 63: "Need W-9: 2"
- Conditional formatting renders (red YES, green ✓, yellow ⚠)

- [ ] **Step 6: Commit + approval**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_build/build_1099_nec_tracker.py templates/_masters/TAX-003-1099-nec-tracker.xlsx
git commit -m "build: TAX-003 1099-NEC Tracker Excel master (threshold formulas, W-9 status check)"
git commit --allow-empty -m "approved: TAX-003 QA passed on Windows Excel"
```

- [ ] **Step 7: Delivery assets**

```bash
mkdir -p "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates/templates/_delivery/TAX-003-1099-nec-tracker"
```

Write `templates/_delivery/TAX-003-1099-nec-tracker/thumbnails.md`:
```markdown
# Thumbnail Specs — TAX-003 1099-NEC Tracker

## 1 — Hero
- Mockup: MacBook showing Dashboard with red "YES" cells visible
- Headline: `The $600 Threshold — Tracked Automatically.`
- Sub: `Know who needs a 1099-NEC before January.`
- Export: `thumb-1.png`

## 2 — The penalty
- Large text: `$330 per missed 1099.`
- Mockup: Dashboard summary showing "4 contractors requiring 1099"
- Headline: `Don't Pay the IRS Penalty.`
- Sub: `Auto-flag + W-9 status tracking.`
- Export: `thumb-2.png`

## 3 — Before/After
- LEFT: "Venmo history scroll" on a phone; RIGHT: Dashboard tab screenshot
- Headline: `Stop Piecing It Together In January.`
- Sub: `Every payment, every contractor, in one file.`
- Export: `thumb-3.png`

## 4 — W-9 status
- Mockup: zoom on Dashboard Status column with "✓ Ready" green + "⚠ Need W-9" yellow
- Headline: `Who's Ready. Who's Not.`
- Sub: `Chase W-9s in December, not on Jan 30.`
- Export: `thumb-4.png`

## 5 — Includes card
- ✓ Contractor directory (50-capacity)
- ✓ Payment log (2000-capacity)
- ✓ Auto-threshold detection ($600 editable)
- ✓ W-9 status per contractor
- ✓ 1099 Prep Dashboard with summary
- ✓ IRS penalty reference table
- Headline: `What You Get`
- Export: `thumb-5.png`
```

Write `templates/_delivery/TAX-003-1099-nec-tracker/TAX-003-howto.md`:
```markdown
# How to Use Your 1099-NEC Contractor Tracker

**The STR Ledger · thestrledger.com**

## The rule (quick)

IRS Pub 1220: any contractor you pay $600+ in a calendar year for business services gets a 1099-NEC from you by January 31 of the following year. Miss one = $60-$660 penalty per form.

## 10-minute setup

1. Tab **Contractors** — add every vendor. Critical fields: Name, EIN/SSN, Address, W-9 status.
2. Tab **Settings** — confirm threshold ($600 for 2026; IRS may adjust).

## Every payment

1. Tab **Payment Log** — new row.
2. Pick date, contractor (dropdown), amount, method (Venmo/Zelle/etc.), property.

The Dashboard updates automatically.

## Monthly check (2 minutes)

Open tab **1099 Prep Dashboard**. Look at:
- **YES in red** — contractor has crossed $600 this year.
- **Status column** — "⚠ Need W-9" means you need to request one before you can file their 1099.

## December sweep

Make sure every YES contractor shows "✓ Ready." For any "⚠ Need W-9" — email them the IRS W-9 form (irs.gov/pub/irs-pdf/fw9.pdf) with a deadline.

## January: file

Options: QuickBooks Online, Track1099.com, or hand the Dashboard to your CPA. Data you need per contractor: legal name, EIN/SSN, address, total YTD paid. All on the Dashboard.

## Questions?

**hello@thestrledger.com**

---

**Upgrade:** Tax Season Bundle at thestrledger.com/tax-bundle — 1099-NEC + mileage + Schedule E + home office, $147.

---

© 2026 The STR Ledger
```

Write `templates/_delivery/TAX-003-1099-nec-tracker/TAX-003-license.md` — copy from shared template with `**Template:** 1099-NEC Contractor Tracker (SKU: TAX-003)`.

- [ ] **Step 8: Refresh existing listing copy**

Edit `copy/etsy-listings/TAX-003-1099-nec-tracker.md`:
- Replace "SPECULATIVE" status block with "Ready to publish. Awaiting Wave 2 upload (Task 15)."
- Replace `<brand>` → `The STR Ledger`, `<domain>` → `thestrledger.com`
- Ensure title (≤140), 13 tags, description align with brief/spec

- [ ] **Step 9: Commit**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_delivery/TAX-003-1099-nec-tracker/ copy/etsy-listings/TAX-003-1099-nec-tracker.md
git commit -m "deliver: TAX-003 1099-NEC Tracker — delivery assets + listing refresh"
```

- [ ] **Step 10: Daniel builds thumbnails + PDFs**

Per thumbnails.md. Commit:

```bash
git add templates/_delivery/TAX-003-1099-nec-tracker/
git commit -m "deliver: TAX-003 thumbnails + branded PDFs exported"
```

---

### Task 13: TAX-002 Single-Property P&L (Lite) — Brief, Spec, Master Build, Lite Variant, Delivery, Listing refresh

**Highest-risk SKU.** Most formulas. Only SKU with a Lite/Full split.

**Files:**
- Create: brief + spec + master build script + Lite variant script + delivery assets
- Create: `templates/_masters/TAX-002-pl-single-property.xlsx` (Full — for Gumroad)
- Create: `templates/_lite/TAX-002-pl-single-property-lite.xlsx` (Lite — for Etsy)
- Modify: `copy/etsy-listings/TAX-002-single-property-pl-lite.md`

- [ ] **Step 1: Claude writes the brief**

Write `templates/_briefs/TAX-002-pl-single-property.md`:
```markdown
# Brief — TAX-002 Single-Property P&L Tracker

**SKU:** TAX-002
**Category:** Financial / Accounting (master spec §3.2 A #2)
**Tier:** T2 (Etsy Lite $27) / T2 Full (own-site $97 — deferred to Lane B)
**Wave:** 2

## Target persona

Primary: Semi-Pro Sarah (3-10 properties) — but this single-property version is her entry point; she buys one, then 2-3 more for other properties before moving to the Multi-Property master on own-site.
Secondary: Side-Hustle Sam (1-2 listings) — his only P&L need, sufficient for tax prep.

## The one specific pain

"My CPA gave me back my Schedule E draft and said 'your categories don't map — I had to rebuild it.' I need a P&L that comes out of the box with IRS Schedule E categories so my CPA literally copies my numbers into boxes 5-19 without re-categorizing."

## What this template does

Single-property profit + loss tracker structured around **IRS Schedule E line items** (lines 5-26a):
- Revenue: rents received, cleaning fees, extras, refunds
- Expenses pre-mapped to Schedule E boxes: Advertising (6), Auto/travel (7), Cleaning (8), Commissions (9), Insurance (10), Legal (11), Mgmt fees (12), Mortgage int (13), Other int (14), Repairs (15), Supplies (16), Taxes (17), Utilities (18), Wages (19), Other expenses (19a-e)
- Depreciation line separate (line 20) — reference only; full depreciation tracker is a Phase 2+ product
- Monthly breakdown + YTD + per-Schedule-E-line totals

## Lite vs Full difference

**Lite (this Etsy product):** single property. No depreciation detail (placeholder line). No multi-LLC. No multi-property consolidation. No monthly budget vs actual. Covers ~80% of single-property Sarah needs.

**Full (own-site, Phase 2+):** multi-property master, depreciation by asset (5/7/15/27.5/39-yr), multi-LLC consolidation, budget vs actual, break-even calculator, P&L→Schedule E export sheet.

## Sheets / Tabs — Lite version

| # | Tab | Role |
|---|---|---|
| 1 | Welcome | Cover, Schedule E mapping note, how-to |
| 2 | Property Info | property address, purchase info, loan info |
| 3 | Revenue Log | One row per booking/revenue event |
| 4 | Expense Log | One row per expense (categorized to Schedule E box) |
| 5 | Monthly P&L | Auto-rolling by month, by Schedule E category |
| 6 | Schedule E Summary | YTD totals mapped to Schedule E line numbers |
| 7 | Settings | Property name, tax year, categories |

## Inputs

**Revenue Log:** Date, Guest/source, Booking channel (Airbnb/VRBO/Direct/Other), Gross amount, Platform fee, Cleaning fee collected, Net amount, Notes

**Expense Log:** Date, Vendor, Category (dropdown = Schedule E mapping), Amount, Payment method, Receipt attached?, Notes

## Outputs

**Monthly P&L:**
- Rows: each Schedule E category (revenue + 14 expense categories)
- Columns: Jan-Dec + YTD
- Formulas: `=SUMIFS(Expense Log!$D:$D, Expense Log!$A:$A, ">="&start, Expense Log!$A:$A, "<"&end, Expense Log!$C:$C, cat)` per cell

**Schedule E Summary:**
- Line 3: Rents received
- Line 4: Royalties (N/A, leave $0)
- Line 5-19: expense categories with YTD totals auto-calculated
- Line 20: Depreciation (typed — placeholder with note "use depreciation tracker from Portfolio Bundle")
- Line 26a: Total expenses = sum of lines 5-20
- Net income = Line 3 - Line 26a

## External data references

- IRS Schedule E 2026 form structure (line numbers reference Part I — Income/Loss From Rental Real Estate and Royalties)
- Reference to IRS Publication 527 (Residential Rental Property) — linked in Welcome tab

## Business logic

- Expense category dropdown must map exactly to Schedule E box numbers.
- Revenue log captures BOTH gross (what guest paid) AND net (what you received after platform fee) — both useful; IRS cares about gross.
- Platform fees are an expense (Schedule E line 19 Other), NOT netted from revenue.
- Cleaning fees collected from guest = revenue; cleaning cost paid to cleaner = Schedule E line 8.
- Capacity: 500 revenue rows, 1000 expense rows.

## QA sample data (for Lite variant)

Single property "Smokies Ridge Cabin", 2026 YTD through March:
- 10 bookings totaling $18,500 gross revenue
- $2,100 cleaning collected from guests
- $1,680 platform fees
- $3,600 to cleaner (8 turnovers × $450)
- $420 supplies
- $1,200 mortgage interest
- $350 utilities/internet
- $800 repairs (1 emergency)

Expected Schedule E Summary:
- Line 3 (Rents): ~$20,600 (rents + cleaning fees collected)
- Line 8 (Cleaning): $3,600
- Line 13 (Mortgage int): $1,200
- Line 15 (Repairs): $800
- Line 16 (Supplies): $420
- Line 18 (Utilities): $350
- Line 19 (Other — platform fees): $1,680
- Total expenses (line 26a): $8,050
- Net: ~$12,550

## Upgrade CTA

Prominent CTA on Welcome tab: "Need multi-property + depreciation + LLC consolidation? Get the Portfolio P&L Master at thestrledger.com/portfolio-master — $97, or included in the Portfolio Bundle ($397)."

## Out-of-scope (Lite)

- Multi-property consolidation
- Depreciation by asset (Phase 2+ product)
- Multi-LLC
- Budget vs actual
- Break-even occupancy calculator (separate SKU, master spec §3.2 A #16)
```

- [ ] **Step 2: Claude writes the sheet spec (Lite version)**

Write `templates/_briefs/TAX-002-pl-single-property-spec.md`:
```markdown
# Sheet Spec — TAX-002 Single-Property P&L (Lite)

## Workbook-level
- Filename Lite: `TAX-002-pl-single-property-lite.xlsx`
- Filename Full (for Gumroad): `TAX-002-pl-single-property.xlsx` (same build without the Lite-specific upgrade banner nagging; same feature set at MVP — Lite/Full difference is mostly for positioning)

Note: for MVP, Lite and Full ship IDENTICAL content except Welcome tab upgrade banner emphasis. The "Full" version as described in the brief (multi-property, depreciation detail) is Phase 2+. For Etsy we ship the single-property P&L at $27 as "Lite" positioning; for Gumroad we ship the same file at $47 as "Single-Property P&L" without the Lite suffix, to align with master spec §4.2 "mirror pricing".

(This is an explicit scope decision: Lite = same features, different price + upgrade-CTA emphasis; Phase 2+ ships the true multi-property Full.)

## Sheet 1 — Welcome
Rows 1-3: brand header (title "Single-Property P&L Tracker")
Row 5: "How this maps to IRS Schedule E" — table listing each category → Schedule E line number
Row 12: "How to use" — 6-step walkthrough
Row 20: upgrade banner (Lite emphasis): "Need multi-property + depreciation + LLC consolidation? Portfolio P&L Master at thestrledger.com/portfolio-master — $97"

## Sheet 2 — Property Info
Row 5-15 input fields (label col A, value col B):
- Property name, Address lines, City/State/Zip
- Purchase date, Purchase price, Closing costs
- Loan amount, Interest rate, Term years
- Property type dropdown (Single-family / Condo / Cabin / Multi-family / Other)
- Business start date (for Schedule E)
- Number of days rented in 2026 (YTD, auto-calc if possible)

## Sheet 3 — Revenue Log
Headers (row 5): Date | Guest / Source | Booking Channel | Gross | Platform Fee | Cleaning Fee Collected | Net | Notes

Col widths: A=12 B=24 C=16 D=12 E=12 F=14 G=12 H=28
Formula col G: `=D6-E6` (net = gross - platform fee; cleaning fee is separately revenue but goes in col F for reporting clarity)

Dropdowns:
- Col C: Airbnb / VRBO / Booking.com / Direct / Other

1000-row capacity.

## Sheet 4 — Expense Log
Headers (row 5): Date | Vendor | Category (Schedule E line) | Amount | Payment Method | Receipt? | Notes

Col widths: A=12 B=24 C=32 D=12 E=16 F=10 G=28

Dropdown Col C (MUST map to Schedule E lines exactly):
- "Advertising (Line 6)"
- "Auto/travel (Line 7)"
- "Cleaning + maintenance (Line 8)"
- "Commissions (Line 9)"
- "Insurance (Line 10)"
- "Legal + professional (Line 11)"
- "Management fees (Line 12)"
- "Mortgage interest (Line 13)"
- "Other interest (Line 14)"
- "Repairs (Line 15)"
- "Supplies (Line 16)"
- "Taxes (Line 17)"
- "Utilities (Line 18)"
- "Wages (Line 19)"
- "Other — Platform fees (Line 19)"
- "Other — Misc (Line 19)"
- "Depreciation (Line 20) — see note"

2000-row capacity.

## Sheet 5 — Monthly P&L
Row 5 headers: Category | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec | YTD

Rows 6-7: REVENUE section
- Row 6: "Rents + cleaning fees collected" — SUMIFS over revenue cols D+F per month
- Row 7: "Total Revenue" sum

Rows 9-25: EXPENSE section — one row per Schedule E category (17 categories from dropdown list)
Each cell: `=SUMIFS('Expense Log'!$D:$D, 'Expense Log'!$A:$A, ">="&DATE(yr,m,1), 'Expense Log'!$A:$A, "<"&DATE(yr,m+1,1), 'Expense Log'!$C:$C, "<cat>")`

Row 27: "TOTAL EXPENSES" row summing rows 9-25
Row 29: "NET INCOME (LOSS)" = Revenue row - Expense row

Conditional formatting: Row 29 negative values red, positive green.

## Sheet 6 — Schedule E Summary
Replicates Schedule E Part I structure exactly.

Rows 5-30:
- Line 3: Rents received (formula from Monthly P&L YTD)
- Line 4: Royalties (hardcoded $0)
- Line 5: "—" (line 5 is Schedule E header, skip)
- Lines 6-20: expense categories with YTD totals per category dropdown
- Line 20: Depreciation — typed input cell with note "Use your separate depreciation tracker. For MVP, enter total YTD depreciation manually."
- Line 21: Total expenses = SUM(lines 6-20)
- Line 22: Income (loss) = line 3 - line 21

Line 22 conditionally formatted (green gain / red loss).

Print area: A1:B30 — this tab prints directly as the "CPA handoff".

## Sheet 7 — Settings
Rows 5-8: tax year (default =YEAR(TODAY())), property name, Schedule E line reference text
```

- [ ] **Step 3: Commit brief + spec**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_briefs/TAX-002-pl-single-property.md templates/_briefs/TAX-002-pl-single-property-spec.md
git commit -m "brief: TAX-002 P&L Single-Property (Lite) — brief + sheet spec + Lite/Full decision"
git commit --allow-empty -m "approved: TAX-002 brief reviewed by Daniel"
```

- [ ] **Step 4: Claude writes the build script (builds BOTH Lite and Full)**

Write `templates/_build/build_pl_single_property.py`:
```python
"""Build TAX-002 Single-Property P&L Tracker Excel files (both Lite and Full variants).

Per sheet spec, Lite and Full share the same sheet structure and formulas for MVP.
Difference is Welcome tab upgrade-banner emphasis and filename.
"""
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.worksheet.datavalidation import DataValidation

from brand_config import (
    COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT,
    COLOR_MUTED, COLOR_ERROR, FONT_HEAD, FONT_BODY,
    apply_brand_header, input_cell_style, formula_cell_style,
    set_col_widths, add_upgrade_banner, header_row_style, BRAND_DOMAIN,
)

LITE_OUT = Path(__file__).resolve().parent.parent / "_lite" / "TAX-002-pl-single-property-lite.xlsx"
FULL_OUT = Path(__file__).resolve().parent.parent / "_masters" / "TAX-002-pl-single-property.xlsx"

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

SAMPLE_REVENUE = [
    ("2026-01-08", "Airbnb guest #A1092", "Airbnb", 2400, 240, 210, None, "4 nights"),
    ("2026-01-22", "Airbnb guest #A1098", "Airbnb", 1800, 180, 210, None, "3 nights"),
    ("2026-02-05", "VRBO guest #V4455", "VRBO", 2100, 180, 210, None, "3 nights"),
    ("2026-02-14", "Airbnb guest #A1112", "Airbnb", 2800, 280, 210, None, "Valentine's week"),
    ("2026-02-27", "Direct booking — Thompson party", "Direct", 2200, 0, 210, None, "Returning guest"),
    ("2026-03-07", "Airbnb guest #A1135", "Airbnb", 1900, 190, 210, None, ""),
    ("2026-03-14", "Airbnb guest #A1140", "Airbnb", 2100, 210, 210, None, "St Patrick's weekend"),
    ("2026-03-20", "VRBO guest #V4488", "VRBO", 1800, 160, 210, None, ""),
    ("2026-03-25", "Airbnb guest #A1147", "Airbnb", 1600, 160, 210, None, ""),
    ("2026-03-30", "Direct booking — Miller family", "Direct", 1800, 0, 210, None, "Month-end"),
]

SAMPLE_EXPENSES = [
    ("2026-01-15", "Smokies Clean", EXPENSE_CATEGORIES[2], 450, "Venmo", "Yes", "Turnover"),
    ("2026-01-25", "Smokies Clean", EXPENSE_CATEGORIES[2], 450, "Venmo", "Yes", "Turnover"),
    ("2026-02-08", "Smokies Clean", EXPENSE_CATEGORIES[2], 450, "Venmo", "Yes", "Turnover"),
    ("2026-02-17", "Smokies Clean", EXPENSE_CATEGORIES[2], 450, "Venmo", "Yes", "Turnover"),
    ("2026-03-02", "Smokies Clean", EXPENSE_CATEGORIES[2], 450, "Venmo", "Yes", "Turnover"),
    ("2026-03-10", "Smokies Clean", EXPENSE_CATEGORIES[2], 450, "Venmo", "Yes", "Turnover"),
    ("2026-03-17", "Smokies Clean", EXPENSE_CATEGORIES[2], 450, "Venmo", "Yes", "Turnover"),
    ("2026-03-28", "Smokies Clean", EXPENSE_CATEGORIES[2], 450, "Venmo", "Yes", "Turnover"),
    ("2026-01-02", "Home Depot", EXPENSE_CATEGORIES[10], 120, "Credit Card", "Yes", "Supplies restock"),
    ("2026-02-14", "Costco", EXPENSE_CATEGORIES[10], 180, "Credit Card", "Yes", "Bulk supplies"),
    ("2026-03-08", "Target", EXPENSE_CATEGORIES[10], 120, "Credit Card", "Yes", "Linens replacement"),
    ("2026-01-01", "Wells Fargo Mortgage", EXPENSE_CATEGORIES[7], 400, "ACH", "Yes", "Jan mortgage int"),
    ("2026-02-01", "Wells Fargo Mortgage", EXPENSE_CATEGORIES[7], 400, "ACH", "Yes", "Feb mortgage int"),
    ("2026-03-01", "Wells Fargo Mortgage", EXPENSE_CATEGORIES[7], 400, "ACH", "Yes", "Mar mortgage int"),
    ("2026-01-15", "Spectrum Internet", EXPENSE_CATEGORIES[12], 90, "ACH", "Yes", "Internet"),
    ("2026-01-20", "Sevier Electric", EXPENSE_CATEGORIES[12], 120, "ACH", "Yes", "Jan utilities"),
    ("2026-02-20", "Sevier Electric", EXPENSE_CATEGORIES[12], 140, "ACH", "Yes", "Feb utilities"),
    ("2026-02-15", "Quick Plumbing", EXPENSE_CATEGORIES[9], 800, "Check", "Yes", "Emergency leak"),
    ("2026-01-10", "Airbnb Platform Fee", EXPENSE_CATEGORIES[14], 240, "Auto-deduct", "Yes", "Host fees"),
    ("2026-02-10", "Airbnb Platform Fee", EXPENSE_CATEGORIES[14], 460, "Auto-deduct", "Yes", "Host fees"),
    ("2026-03-10", "Airbnb Platform Fee", EXPENSE_CATEGORIES[14], 560, "Auto-deduct", "Yes", "Host fees"),
    ("2026-02-10", "VRBO Platform Fee", EXPENSE_CATEGORIES[14], 180, "Auto-deduct", "Yes", ""),
    ("2026-03-20", "VRBO Platform Fee", EXPENSE_CATEGORIES[14], 160, "Auto-deduct", "Yes", ""),
]


def style_cell(cell, style_dict):
    for attr, value in style_dict.items():
        setattr(cell, attr, value)


def build_welcome_tab(wb, is_lite=True):
    ws = wb.active
    ws.title = "Welcome"
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 95)])
    title_suffix = " (Lite)" if is_lite else ""
    apply_brand_header(ws, f"Single-Property P&L Tracker{title_suffix}",
                       "IRS Schedule E categories baked in")

    ws.cell(row=5, column=1, value="How this maps to IRS Schedule E").font = Font(
        name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    ws.cell(row=6, column=1, value=(
        "Expense categories on the Expense Log match Schedule E Part I line numbers (5-20). "
        "The Schedule E Summary tab rolls up YTD totals ready for your CPA to copy into the form. "
        "Reference: IRS Publication 527 (Residential Rental Property)."
    )).alignment = Alignment(wrap_text=True)

    ws.cell(row=9, column=1, value="How to use").font = Font(
        name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    steps = [
        "1. Tab 2 (Property Info): fill property address, loan info, business start date.",
        "2. Tab 3 (Revenue Log): log every booking — gross, platform fee, cleaning fee collected.",
        "3. Tab 4 (Expense Log): log every expense, pick category from dropdown (tied to Schedule E lines).",
        "4. Tab 5 (Monthly P&L): watch month-by-month category totals.",
        "5. Tab 6 (Schedule E Summary): YTD ready-to-copy into your Schedule E form.",
        "6. At tax time: print tab 6 and hand to your CPA. Done.",
    ]
    for i, s in enumerate(steps, start=10):
        ws.cell(row=i, column=1, value=s).alignment = Alignment(wrap_text=True)

    # Row 18 note about depreciation
    ws.cell(row=18, column=1, value=(
        "Note: Schedule E Line 20 (Depreciation) — type your YTD depreciation number directly "
        "on the Schedule E Summary tab. This Lite version doesn't include a depreciation "
        "calculator; for 5/7/15/27.5/39-yr depreciation by asset, see the Portfolio Bundle."
    )).font = Font(size=10, italic=True, color=COLOR_MUTED)
    ws.cell(row=18, column=1).alignment = Alignment(wrap_text=True)

    # Upgrade banner — Lite vs Full emphasis
    ws.cell(row=20, column=1, value=(
        f"💡 Upgrade: Multi-Property P&L Master + depreciation by asset + LLC consolidation — "
        f"{BRAND_DOMAIN}/portfolio-master ($97) · included in Portfolio Bundle ($397)."
    )).font = Font(name=FONT_BODY, size=11, bold=True, color="FFFFFF")
    ws.cell(row=20, column=1).fill = PatternFill("solid", fgColor=COLOR_ACCENT)
    ws.cell(row=20, column=1).alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    ws.row_dimensions[20].height = 50


def build_property_info_tab(wb):
    ws = wb.create_sheet("Property Info")
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 28), ("B", 40)])
    apply_brand_header(ws, "Property Info", "One-time setup")

    fields = [
        (5, "Property name:", "Smokies Ridge Cabin"),
        (6, "Street address:", "123 Mountain Lane"),
        (7, "City / State / Zip:", "Gatlinburg, TN 37738"),
        (8, "Property type:", "Cabin"),
        (9, "Purchase date:", "2023-08-15"),
        (10, "Purchase price ($):", 420000),
        (11, "Closing costs ($):", 8500),
        (12, "Loan amount ($):", 336000),
        (13, "Interest rate (%):", 6.75),
        (14, "Loan term (years):", 30),
        (15, "Business start date:", "2023-10-01"),
        (16, "Days rented YTD 2026:", 72),
    ]
    for row, label, val in fields:
        ws.cell(row=row, column=1, value=label).font = Font(bold=True)
        ws.cell(row=row, column=1).alignment = Alignment(horizontal="right")
        cell = ws.cell(row=row, column=2, value=val)
        style_cell(cell, input_cell_style())
        if row in (9, 15):
            cell.number_format = "yyyy-mm-dd"
        if row in (10, 11, 12):
            cell.number_format = '"$"#,##0'
        if row == 13:
            cell.number_format = "0.000%"


def build_revenue_log(wb):
    ws = wb.create_sheet("Revenue Log")
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 12), ("B", 28), ("C", 14), ("D", 12), ("E", 12), ("F", 14), ("G", 12), ("H", 28)])
    apply_brand_header(ws, "Revenue Log", "One row per booking")
    ws.freeze_panes = "A6"

    headers = ["Date", "Guest / Source", "Channel", "Gross", "Platform Fee", "Cleaning Collected", "Net", "Notes"]
    hs = header_row_style()
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        for attr, value in hs.items():
            setattr(cell, attr, value)

    for i, r in enumerate(SAMPLE_REVENUE, start=6):
        for col, val in enumerate(r, start=1):
            if col == 7:  # Net — formula
                cell = ws.cell(row=i, column=col, value=f"=D{i}-E{i}")
                style_cell(cell, formula_cell_style())
            else:
                cell = ws.cell(row=i, column=col, value=val)
                style_cell(cell, input_cell_style())
            if col == 1:
                cell.number_format = "yyyy-mm-dd"
            if col in (4, 5, 6, 7):
                cell.number_format = '"$"#,##0.00'

    dv_channel = DataValidation(type="list", formula1=f'"{",".join(BOOKING_CHANNELS)}"', allow_blank=True)
    dv_channel.add("C6:C1005"); ws.add_data_validation(dv_channel)


def build_expense_log(wb):
    ws = wb.create_sheet("Expense Log")
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 12), ("B", 24), ("C", 38), ("D", 12), ("E", 16), ("F", 10), ("G", 28)])
    apply_brand_header(ws, "Expense Log", "One row per expense — category ties to Schedule E line")
    ws.freeze_panes = "A6"

    headers = ["Date", "Vendor", "Category (Schedule E line)", "Amount", "Payment Method", "Receipt?", "Notes"]
    hs = header_row_style()
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=5, column=col, value=h)
        for attr, value in hs.items():
            setattr(cell, attr, value)

    for i, e in enumerate(SAMPLE_EXPENSES, start=6):
        for col, val in enumerate(e, start=1):
            cell = ws.cell(row=i, column=col, value=val)
            style_cell(cell, input_cell_style())
            if col == 1:
                cell.number_format = "yyyy-mm-dd"
            if col == 4:
                cell.number_format = '"$"#,##0.00'

    # Dropdowns — store categories on a hidden settings list; reference by name
    dv_cat = DataValidation(type="list", formula1='=Settings!$A$15:$A$31', allow_blank=True)
    dv_cat.add("C6:C2005"); ws.add_data_validation(dv_cat)

    dv_pm = DataValidation(type="list", formula1='"Venmo,Zelle,Check,Cash,ACH,Credit Card,Auto-deduct,Other"', allow_blank=True)
    dv_pm.add("E6:E2005"); ws.add_data_validation(dv_pm)

    dv_r = DataValidation(type="list", formula1='"Yes,No"', allow_blank=True)
    dv_r.add("F6:F2005"); ws.add_data_validation(dv_r)


def build_monthly_pl(wb):
    ws = wb.create_sheet("Monthly P&L")
    ws.sheet_properties.tabColor = COLOR_ACCENT
    widths = [("A", 38)] + [(chr(ord('B') + i), 10) for i in range(12)] + [("N", 12)]
    set_col_widths(ws, widths)
    apply_brand_header(ws, "Monthly P&L", "Month-by-month by Schedule E category")
    ws.freeze_panes = "B6"

    # Header row
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    ws.cell(row=5, column=1, value="Category")
    for i, m in enumerate(months, start=2):
        ws.cell(row=5, column=i, value=m)
    ws.cell(row=5, column=14, value="YTD")
    hs = header_row_style()
    for col in range(1, 15):
        for attr, value in hs.items():
            setattr(ws.cell(row=5, column=col), attr, value)

    # Revenue row 7
    ws.cell(row=7, column=1, value="Rents + cleaning fees collected").font = Font(bold=True, color=COLOR_PRIMARY)
    for m_num in range(1, 13):
        col = m_num + 1
        formula = (f'=SUMIFS(\'Revenue Log\'!$D:$D, \'Revenue Log\'!$A:$A, ">="&DATE(YEAR(TODAY()),{m_num},1), '
                   f'\'Revenue Log\'!$A:$A, "<"&DATE(YEAR(TODAY()),{m_num+1},1)) + '
                   f'SUMIFS(\'Revenue Log\'!$F:$F, \'Revenue Log\'!$A:$A, ">="&DATE(YEAR(TODAY()),{m_num},1), '
                   f'\'Revenue Log\'!$A:$A, "<"&DATE(YEAR(TODAY()),{m_num+1},1))')
        cell = ws.cell(row=7, column=col, value=formula)
        cell.number_format = '"$"#,##0'
    ws.cell(row=7, column=14, value="=SUM(B7:M7)").number_format = '"$"#,##0'

    # Expense rows 10-26 (one per category)
    ws.cell(row=9, column=1, value="EXPENSES").font = Font(name=FONT_HEAD, size=12, bold=True, color=COLOR_PRIMARY)
    for idx, cat in enumerate(EXPENSE_CATEGORIES):
        row = 10 + idx
        ws.cell(row=row, column=1, value=cat)
        for m_num in range(1, 13):
            col = m_num + 1
            formula = (f'=SUMIFS(\'Expense Log\'!$D:$D, \'Expense Log\'!$A:$A, ">="&DATE(YEAR(TODAY()),{m_num},1), '
                       f'\'Expense Log\'!$A:$A, "<"&DATE(YEAR(TODAY()),{m_num+1},1), '
                       f'\'Expense Log\'!$C:$C, A{row})')
            cell = ws.cell(row=row, column=col, value=formula)
            cell.number_format = '"$"#,##0'
        ws.cell(row=row, column=14, value=f"=SUM(B{row}:M{row})").number_format = '"$"#,##0'

    # Total expenses row
    last_exp_row = 10 + len(EXPENSE_CATEGORIES) - 1
    tot_row = last_exp_row + 2
    ws.cell(row=tot_row, column=1, value="TOTAL EXPENSES").font = Font(bold=True, color=COLOR_ERROR)
    for col in range(2, 15):
        letter = chr(ord('A') + col - 1)
        ws.cell(row=tot_row, column=col, value=f"=SUM({letter}10:{letter}{last_exp_row})").number_format = '"$"#,##0'
        ws.cell(row=tot_row, column=col).font = Font(bold=True)

    # Net income row
    net_row = tot_row + 2
    ws.cell(row=net_row, column=1, value="NET INCOME (LOSS)").font = Font(bold=True, color=COLOR_PRIMARY)
    for col in range(2, 15):
        letter = chr(ord('A') + col - 1)
        cell = ws.cell(row=net_row, column=col, value=f"={letter}7 - {letter}{tot_row}")
        cell.number_format = '"$"#,##0'
        cell.font = Font(bold=True)

    # Conditional formatting on net row
    ws.conditional_formatting.add(f"B{net_row}:N{net_row}",
        CellIsRule(operator="lessThan", formula=["0"], fill=PatternFill("solid", fgColor="FFCCCC")))
    ws.conditional_formatting.add(f"B{net_row}:N{net_row}",
        CellIsRule(operator="greaterThan", formula=["0"], fill=PatternFill("solid", fgColor="C7EFCF")))


def build_schedule_e_summary(wb):
    ws = wb.create_sheet("Schedule E Summary")
    ws.sheet_properties.tabColor = COLOR_ACCENT
    set_col_widths(ws, [("A", 50), ("B", 16)])
    apply_brand_header(ws, "Schedule E Summary", "CPA handoff — print + send")

    ws.cell(row=5, column=1, value="Tax Year:").font = Font(bold=True)
    ws.cell(row=5, column=2, value="=YEAR(TODAY())")

    ws.cell(row=6, column=1, value="Property:").font = Font(bold=True)
    ws.cell(row=6, column=2, value="='Property Info'!B5")

    # Line 3: Rents received
    ws.cell(row=8, column=1, value="Line 3 — Rents received").font = Font(bold=True)
    ws.cell(row=8, column=2, value="='Monthly P&L'!N7").number_format = '"$"#,##0'

    ws.cell(row=9, column=1, value="Line 4 — Royalties")
    ws.cell(row=9, column=2, value=0).number_format = '"$"#,##0'

    # Lines 6-20 expense categories
    ws.cell(row=11, column=1, value="EXPENSES (Schedule E Part I)").font = Font(bold=True, color=COLOR_PRIMARY)
    for idx, cat in enumerate(EXPENSE_CATEGORIES):
        row = 12 + idx
        # Extract line number from category for display, but reference Monthly P&L YTD col N
        monthly_row = 10 + idx  # matches row in Monthly P&L
        ws.cell(row=row, column=1, value=cat)
        ws.cell(row=row, column=2, value=f"='Monthly P&L'!N{monthly_row}").number_format = '"$"#,##0'

    # Total expenses
    tot_row = 12 + len(EXPENSE_CATEGORIES) + 1
    ws.cell(row=tot_row, column=1, value="Line 26a — Total expenses").font = Font(bold=True, color=COLOR_ERROR)
    ws.cell(row=tot_row, column=2, value=f"=SUM(B12:B{12 + len(EXPENSE_CATEGORIES) - 1})").number_format = '"$"#,##0'
    ws.cell(row=tot_row, column=2).font = Font(bold=True, color=COLOR_ERROR)

    # Net income
    net_row = tot_row + 2
    ws.cell(row=net_row, column=1, value="Line 26 — Income or (loss)").font = Font(name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)
    ws.cell(row=net_row, column=2, value=f"=B8 + B9 - B{tot_row}").number_format = '"$"#,##0'
    ws.cell(row=net_row, column=2).font = Font(name=FONT_HEAD, size=14, bold=True, color=COLOR_PRIMARY)

    ws.print_area = f"A1:B{net_row + 2}"
    ws.page_setup.orientation = "portrait"


def build_settings_tab(wb):
    ws = wb.create_sheet("Settings")
    ws.sheet_properties.tabColor = COLOR_SECONDARY
    set_col_widths(ws, [("A", 38)])
    apply_brand_header(ws, "Settings", "Category dropdown source + tax year")

    ws.cell(row=5, column=1, value="Tax year:").font = Font(bold=True)
    ws.cell(row=5, column=1).alignment = Alignment(horizontal="right")
    cell = ws.cell(row=6, column=1, value="=YEAR(TODAY())")
    style_cell(cell, formula_cell_style())

    ws.cell(row=8, column=1, value="Reference: IRS Publication 527 — Residential Rental Property").font = Font(italic=True, color=COLOR_MUTED)

    ws.cell(row=10, column=1, value="Expense category list (source for Expense Log dropdown):").font = Font(bold=True)
    ws.cell(row=10, column=1).fill = PatternFill("solid", fgColor=COLOR_BG_LIGHT if False else "F7F4EE")

    # Starting at row 15, list all categories (the dropdown references A15:A31)
    for i, cat in enumerate(EXPENSE_CATEGORIES, start=15):
        ws.cell(row=i, column=1, value=cat)


def build_workbook(out_path, is_lite=True):
    wb = Workbook()
    build_welcome_tab(wb, is_lite=is_lite)
    build_property_info_tab(wb)
    build_revenue_log(wb)
    build_expense_log(wb)
    build_monthly_pl(wb)
    build_schedule_e_summary(wb)
    build_settings_tab(wb)

    wb.properties.title = f"Single-Property P&L Tracker{' (Lite)' if is_lite else ''} — The STR Ledger"
    wb.properties.creator = "The STR Ledger"
    wb.properties.description = "Single-property P&L with Schedule E category mapping."

    out_path.parent.mkdir(parents=True, exist_ok=True)
    wb.save(out_path)
    print(f"Saved: {out_path}")


def main():
    build_workbook(LITE_OUT, is_lite=True)
    build_workbook(FULL_OUT, is_lite=False)


if __name__ == "__main__":
    main()
```

- [ ] **Step 5: Build both variants + smoke test**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates/templates/_build"
python build_pl_single_property.py
python -c "from openpyxl import load_workbook; wb=load_workbook('../_lite/TAX-002-pl-single-property-lite.xlsx'); print('Lite tabs:', wb.sheetnames); assert len(wb.sheetnames)==7"
python -c "from openpyxl import load_workbook; wb=load_workbook('../_masters/TAX-002-pl-single-property.xlsx'); print('Full tabs:', wb.sheetnames); assert len(wb.sheetnames)==7"
```

Expected: both show 7 tabs.

- [ ] **Step 6: Daniel QA on Windows (longest QA — formula-heavy)**

Open `TAX-002-pl-single-property-lite.xlsx`:
- [ ] All 7 tabs present with correct colors (Monthly P&L + Schedule E Summary = green accent)
- [ ] Revenue Log: 10 sample rows, Net = Gross - Platform Fee populates correctly
- [ ] Expense Log: 23 sample rows, dropdown populated from Settings
- [ ] Monthly P&L: row 7 (Rents+cleaning) shows ~$20,600 in column N (YTD)
- [ ] Monthly P&L: row 12 (Cleaning+maintenance) shows $3,600 in col N
- [ ] Monthly P&L: row 17 (Mortgage interest) shows $1,200
- [ ] Monthly P&L Net row shows ~$12,500 YTD
- [ ] Schedule E Summary: Line 3 ≈ $20,600; Line 26a ≈ $8,050; Net ≈ $12,550
- [ ] Conditional formatting on Net row (Monthly P&L) shows green (positive)

Open `TAX-002-pl-single-property.xlsx` (Full): same content (for MVP); verify file opens.

- [ ] **Step 7: Commit build + xlsx files**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_build/build_pl_single_property.py templates/_masters/TAX-002-pl-single-property.xlsx templates/_lite/TAX-002-pl-single-property-lite.xlsx
git commit -m "build: TAX-002 P&L Single-Property (Lite + Full variants, Schedule E mapped)"
git commit --allow-empty -m "approved: TAX-002 QA passed on Windows Excel (Lite + Full)"
```

- [ ] **Step 8: Delivery assets**

```bash
mkdir -p "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates/templates/_delivery/TAX-002-pl-single-property"
```

Write `templates/_delivery/TAX-002-pl-single-property/thumbnails.md`:
```markdown
# Thumbnail Specs — TAX-002 P&L Tracker (Lite)

## 1 — Hero
- Mockup: MacBook showing Schedule E Summary tab with Line 26 "Income" value visible
- Headline: `Single-Property P&L — Schedule E Ready.`
- Sub: `Categories baked in. CPA-ready output. Lite edition.`
- Export: `thumb-1.png`

## 2 — The mapping
- Visual: left side = messy receipt pile; right side = Schedule E Summary rows
- Headline: `From Chaos To Schedule E In 5 Minutes.`
- Sub: `Every category pre-mapped to IRS line numbers.`
- Export: `thumb-2.png`

## 3 — Monthly P&L
- Mockup: Monthly P&L tab with green Net Income row highlighted
- Headline: `Month-By-Month. Category-By-Category.`
- Sub: `12 months × 17 categories. Auto-calculated.`
- Export: `thumb-3.png`

## 4 — CPA handoff
- Mockup: Schedule E Summary tab printed on paper, stamped "CPA APPROVED"
- Headline: `Your CPA Will Love This.`
- Sub: `Print tab 6. Send. Done.`
- Export: `thumb-4.png`

## 5 — Includes card
- ✓ Property info tab (address, loan, purchase)
- ✓ Revenue log (1000-capacity, channel-split)
- ✓ Expense log (2000-capacity, Schedule E dropdown)
- ✓ Monthly P&L — 17 categories × 12 months
- ✓ Schedule E Summary — ready for CPA
- ✓ IRS Pub 527 reference note
- ✓ Upgrade path to Multi-Property Master
- Headline: `What You Get (Lite)`
- Sub: `Upgrade to multi-property at thestrledger.com`
- Export: `thumb-5.png`
```

Write `templates/_delivery/TAX-002-pl-single-property/TAX-002-howto.md`:
```markdown
# How to Use Your Single-Property P&L Tracker (Lite)

**The STR Ledger · thestrledger.com**

## What this is

A single-property P&L pre-mapped to IRS Schedule E categories. At tax time, print one tab and hand it to your CPA.

## 5-minute setup

1. Tab **Property Info** — fill address, purchase info, loan info, business start date.
2. Tab **Settings** — tax year auto-detects from current date; update if tracking a different year.

## As revenue comes in

Tab **Revenue Log** — one row per booking:
- Date, Guest/source, Channel (Airbnb/VRBO/Direct/Other dropdown), Gross, Platform Fee, Cleaning Fee Collected. Net auto-calculates.

## As expenses happen

Tab **Expense Log** — one row per expense:
- Date, Vendor, Category (dropdown — MUST pick from list; matches Schedule E line), Amount, Payment method, Receipt?

## Monthly review

Tab **Monthly P&L** — look at the Net Income row. Red = loss, green = profit.

## At tax time

1. Check tab **Schedule E Summary** — all YTD totals are mapped to IRS Schedule E line numbers.
2. Type your YTD depreciation into the Depreciation cell (Lite doesn't calculate depreciation — see upgrade).
3. File → Print → Schedule E Summary tab only.
4. Send the PDF to your CPA.

## Lite vs Full

**This Lite version:** one property. No depreciation calc. No multi-LLC. Good for hosts with 1-2 properties.

**Full (Portfolio P&L Master at thestrledger.com/portfolio-master, $97):** multi-property consolidation, 5/7/15/27.5/39-yr depreciation by asset, multi-LLC, budget vs actual, break-even calculator.

## Questions?

**hello@thestrledger.com**

---

© 2026 The STR Ledger
```

Write `templates/_delivery/TAX-002-pl-single-property/TAX-002-license.md` — copy shared license with `**Template:** Single-Property P&L Tracker Lite (SKU: TAX-002)`.

- [ ] **Step 9: Refresh listing copy**

Edit `copy/etsy-listings/TAX-002-single-property-pl-lite.md`:
- Remove speculative status, replace with "Ready to publish. Awaiting Wave 2 upload (Task 15)."
- Replace `<brand>` / `<domain>` tokens
- Ensure title, tags, description populated (reference brief for accuracy)

- [ ] **Step 10: Commit delivery + listing**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add templates/_delivery/TAX-002-pl-single-property/ copy/etsy-listings/TAX-002-single-property-pl-lite.md
git commit -m "deliver: TAX-002 P&L Lite — delivery assets + listing refresh"
```

- [ ] **Step 11: Daniel builds thumbnails + PDFs**

```bash
git add templates/_delivery/TAX-002-pl-single-property/
git commit -m "deliver: TAX-002 thumbnails + branded PDFs exported"
```

---

## ✅ Gate G5 (Day 11) — Wave 2 builds ready

Check:
- `templates/_masters/` contains all 5 `.xlsx` files
- `templates/_lite/` contains `TAX-002-pl-single-property-lite.xlsx`
- `templates/_delivery/` contains 5 product folders each with thumbnails.md, howto markdown, license markdown
- Formula sanity: test-open TAX-002 Lite, confirm Schedule E Summary Line 26 shows a positive value

If any fail: stop-the-line; fix before Task 14.

---

### Task 14: A12 — SEO pass on all 5 listings

**Files:**
- Modify: all 5 `copy/etsy-listings/*.md` files
- Create: `copy/etsy-listings/seo-research.md`

**Owner:** Claude produces keyword research; Daniel updates Etsy listings.

**Acceptance:** each of 5 listings has: title ≤140 chars keyword-front-loaded; 13 tags each ≤20 chars; description opens with 160-char keyword-dense block; all updates reflected on live Etsy listings.

- [ ] **Step 1: Claude produces the keyword research doc**

Write `copy/etsy-listings/seo-research.md`:
```markdown
# Etsy SEO Research — Launch SKUs

## Approach

Etsy ranks listings by: (1) keyword match on title/tags/description, (2) conversion rate, (3) recency, (4) shop-level quality, (5) customer satisfaction. For launch, we can only control (1) and (3). Target: front-load keywords, maximize tag coverage, and re-renew every 4 months.

## GST-001 Welcome Book

**Primary keywords (title + front of description):**
- airbnb welcome book (HIGH volume, HIGH competition)
- vrbo welcome guide (MED volume, MED competition)
- str host template (LOW volume, LOW competition)
- vacation rental welcome packet (MED/MED)

**13 tags (each ≤20 chars):**
1. airbnb welcome book
2. vrbo host template
3. airbnb printable
4. welcome book pdf
5. str template
6. vacation rental
7. airbnb host gift
8. airbnb template
9. welcome guide
10. house manual
11. guest book
12. rental property
13. airbnb editable

**Description opening (160 chars, keyword-dense):**
"Business-grade Airbnb welcome book template for VRBO and short-term rental hosts. Editable Excel + PDF with 9 pre-formatted sections."

---

## OPS-001 Turnover Checklist

**Primary keywords:**
- airbnb cleaning checklist (HIGH/HIGH)
- vacation rental cleaning (MED/MED)
- str cleaner tracker (LOW/LOW — own this)
- turnover checklist (MED/MED)

**13 tags:**
1. airbnb cleaning checklist
2. str cleaner tracker
3. vacation rental cleaning
4. turnover checklist
5. airbnb template
6. cleaner scorecard
7. vrbo cleaning
8. str template
9. airbnb host tool
10. rental property cleaning
11. cleaning schedule
12. housekeeping tracker
13. airbnb printable

**Description opening:**
"Printable cleaner turnover checklist + rolling scorecard for Airbnb and STR hosts. 40 items across 8 zones. Excel + PDF."

---

## TAX-001 Mileage Log

**Primary keywords:**
- airbnb mileage log (LOW/MED — buyer-intent high)
- str mileage tracker (LOW/LOW — own this)
- irs mileage log (HIGH/HIGH)
- rental property tax (MED/MED)

**13 tags:**
1. airbnb mileage log
2. str mileage tracker
3. irs mileage log
4. vacation rental tax
5. mileage spreadsheet
6. airbnb tax deduction
7. rental property mileage
8. business mileage log
9. tax deduction template
10. vrbo tax
11. str tax template
12. schedule c mileage
13. airbnb template

**Description opening:**
"IRS-compliant mileage log for Airbnb and STR hosts. Auto-calculates deduction at 2026 IRS rate ($0.70/mi). Editable Excel."

---

## TAX-003 1099-NEC Tracker

**Primary keywords:**
- 1099 nec tracker (MED/LOW — strong intent)
- contractor payment tracker (LOW/LOW)
- airbnb contractor tracker (LOW/LOW — own this)
- rental property 1099 (LOW/LOW)

**13 tags:**
1. 1099 nec tracker
2. contractor tracker
3. airbnb 1099
4. rental property 1099
5. str contractor tracker
6. w9 tracker
7. 1099 prep template
8. tax season template
9. irs 1099 threshold
10. vacation rental tax
11. airbnb tax template
12. vrbo 1099
13. small business 1099

**Description opening:**
"1099-NEC contractor payment tracker for Airbnb and STR hosts. Auto-flags the $600 IRS threshold. Editable Excel."

---

## TAX-002 P&L Lite

**Primary keywords:**
- airbnb p&l (LOW/LOW — own it)
- rental property profit loss (MED/LOW)
- schedule e template (LOW/MED)
- str bookkeeping (LOW/LOW)

**13 tags:**
1. airbnb p&l
2. schedule e template
3. rental property profit loss
4. str bookkeeping
5. airbnb tax template
6. vacation rental p&l
7. vrbo bookkeeping
8. rental income tracker
9. short term rental tax
10. airbnb profit tracker
11. irs schedule e
12. rental property expenses
13. airbnb accounting

**Description opening:**
"Single-property P&L tracker for Airbnb and VRBO hosts, pre-mapped to IRS Schedule E. Monthly + YTD rollups. Editable Excel."

---

## Renewal cadence

Every 4 months, set each listing to "renew" for freshness signal. Budget: $0.20 × 5 listings × 3 renewals/year = $3/year per shop-wide refresh.

## Monitor

Daily for first 14 days; weekly thereafter. Track in simple spreadsheet: Listing | Views/Day | Favorites | Sales. Target CVR ≥ 2% by Day 30. If < 1% CTR, thumbnails first (biggest conversion lever).
```

- [ ] **Step 2: Update each of 5 listing files with finalized titles + tags + description openings**

For each `copy/etsy-listings/<sku>.md` — apply the Title + Tags + Description-opening from the SEO research doc. Existing listing files may already have draft values; overwrite with final.

- [ ] **Step 3: Commit SEO research + listing updates**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add copy/etsy-listings/
git commit -m "seo: keyword-optimize all 5 launch listings — titles, tags, descriptions"
```

- [ ] **Step 4: Daniel applies updates to live Etsy (Wave 1 existing listings)**

For the 3 Wave 1 listings already live (GST-001, OPS-001, TAX-001):
- Open each in Etsy Shop Manager → Edit
- Update Title, Tags, opening 2 sentences of Description per SEO research
- Save

Wave 2 listings (TAX-003, TAX-002) get the final copy on first upload (Task 15).

- [ ] **Step 5: Commit milestone**

```bash
git commit --allow-empty -m "seo: Wave 1 listings updated on Etsy with SEO-optimized copy"
```

## ✅ Gate G6 (Day 13) — SEO + Wave 2 assets ready

- All 5 listing files committed with SEO-optimized titles/tags/descriptions
- Wave 2 delivery assets (thumbnails + PDFs) exported
- Wave 2 test purchase NOT yet done (happens in Task 15)

---

## Phase 5 — Wave 2 Launch + Closeout (Day 14)

### Task 15: Wave 2 Etsy listing uploads + test purchase

**Files:** Modify: `infrastructure/etsy/listing-ids.md`

**Owner:** Daniel.

**Acceptance:** 2 Wave 2 listings live. Test purchase on TAX-002 P&L Lite succeeds.

- [ ] **Step 1: Upload TAX-003 1099-NEC Tracker**

Same Etsy process as Task 11, Step 1. Copy fields from `copy/etsy-listings/TAX-003-1099-nec-tracker.md`:
- Title: (from SEO research, final)
- Price: $17.00
- SKU: TAX-003
- 13 tags (from SEO research)
- Files: master xlsx, shared insert PDF, howto PDF, license PDF

Save as Draft.

- [ ] **Step 2: Upload TAX-002 P&L Lite**

Same process. From `copy/etsy-listings/TAX-002-single-property-pl-lite.md`:
- Title: (final, from SEO)
- Price: $27.00
- SKU: TAX-002-LITE
- 13 tags
- Files: **Lite xlsx from `templates/_lite/`** (not the Full); shared insert PDF; howto PDF; license PDF

Save as Draft.

- [ ] **Step 3: Test purchase TAX-002 P&L Lite**

From secondary account:
- Buy the listing
- Download all 4 files
- Open xlsx in Excel — verify Schedule E Summary Line 26 shows a positive Net
- Open PDFs — verify upgrade CTAs render
- Confirm email at hello@thestrledger.com

If any failure: fix + retest before publishing.

- [ ] **Step 4: Refund test purchase**

Etsy Shop Manager → Orders → Refund.

- [ ] **Step 5: Publish both drafts**

Publish. Capture listing IDs.

- [ ] **Step 6: Update listing-ids.md**

Edit `infrastructure/etsy/listing-ids.md` — add 2 rows for TAX-003 and TAX-002.

- [ ] **Step 7: Commit milestone**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add infrastructure/etsy/listing-ids.md
git commit -m "launch: Wave 2 live on Etsy — TAX-003, TAX-002 Lite — all 5 products live"
```

---

### Task 16: A14 — Gumroad mirror (all 5)

**Files:**
- Create: `infrastructure/gumroad/setup.md`
- Modify: `ops/credentials-inventory.md`

**Owner:** Daniel executes. Claude produces per-product upload checklist.

**Acceptance:** all 5 products live on gumroad.com/thestrledger with full versions (no Lite on Gumroad per master spec §4.2), matching own-site pricing.

- [ ] **Step 1: Create Gumroad account**

Go to gumroad.com → Start selling.
- Email: hello@thestrledger.com
- Password: save to Vaultwarden
- Username: `thestrledger` (or `strledger` if taken)
- Enable 2FA (authenticator app)
- Submit bank info for payouts

- [ ] **Step 2: Upload each of 5 products**

For each:

**GST-001 Welcome Book:**
- Product name: `Airbnb Welcome Book Template — Editable Excel + PDF`
- Price: $17.00 (same as Etsy)
- Cover image: thumb-1.png
- Thumbnails: all 5 from delivery folder
- Files to attach: `templates/_masters/GST-001-welcome-book.xlsx` + `_shared/etsy-upgrade-insert.pdf` + `_delivery/GST-001-welcome-book/GST-001-howto.pdf` + `_delivery/GST-001-welcome-book/GST-001-license.pdf`
- Description: transpose from Etsy listing (Gumroad supports markdown)
- Enable "Pay what you want" floor at $17 (master spec §4.2 convention)

**OPS-001 Turnover Checklist:**
- Price: $17.00 (own-site price, NOT the Etsy $12)
- Per master spec §4.2 — Gumroad matches own-site, not Etsy discount

**TAX-001 Mileage Log:** $17 (same)

**TAX-003 1099-NEC:** $17 (same)

**TAX-002 Single-Property P&L:** $47 (own-site Full price per master spec §3.1 T2 band) — **upload the Full file from `templates/_masters/`, NOT the Lite**

- [ ] **Step 3: Write setup.md**

Write `infrastructure/gumroad/setup.md`:
```markdown
# Gumroad Setup — The STR Ledger

**Status:** 5 products live.

**URL:** https://gumroad.com/thestrledger
**Account:** hello@thestrledger.com
**Username:** thestrledger
**2FA:** enabled
**Bank info:** submitted (details in Vaultwarden)

## Products live

| SKU | Product | Gumroad price | File |
|---|---|---|---|
| GST-001 | Welcome Book | $17 | GST-001-welcome-book.xlsx |
| OPS-001 | Turnover Checklist | $17 | OPS-001-turnover-checklist.xlsx |
| TAX-001 | Mileage Log | $17 | TAX-001-mileage-log.xlsx |
| TAX-003 | 1099-NEC Tracker | $17 | TAX-003-1099-nec-tracker.xlsx |
| TAX-002 | P&L Single-Property (Full) | $47 | TAX-002-pl-single-property.xlsx |

**Note on P&L:** Etsy ships the Lite variant ($27); Gumroad ships the Full variant ($47). Per master spec §4.2 pricing-integrity rule — own-site/Gumroad always has the highest-featured version at the highest price.

## Fees

- Gumroad: 10% + $0.30 per transaction
- On a $17 sale: Gumroad keeps ~$2.00. Net: ~$15.00
- On a $47 sale (P&L Full): Gumroad keeps ~$5.00. Net: ~$42.00

## Post-launch

- Add a newsletter opt-in on every checkout → pipe to email list (Phase 2 when hub is live)
- Add an affiliate offer (Gumroad has native affiliate support) after 50 sales
- Mirror discount codes from own-site (not Etsy promos — Etsy stays separate)
```

- [ ] **Step 4: Append Gumroad to credentials inventory**

Edit `ops/credentials-inventory.md` Accounts table — add Gumroad row.

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add infrastructure/gumroad/setup.md ops/credentials-inventory.md
git commit -m "launch: Gumroad mirror live — all 5 products (P&L Full on Gumroad, Lite on Etsy)"
```

---

### Task 17: G7 — Final acceptance + Definition of Done verification

**Files:**
- Create: `docs/superpowers/plans/2026-04-22-first-5-launch-dod-verified.md`

**Acceptance:** every DoD item from design doc §6.1 verified passing.

- [ ] **Step 1: Run the DoD checklist**

Write `docs/superpowers/plans/2026-04-22-first-5-launch-dod-verified.md`:
```markdown
# DoD Verification — First 5 Etsy Products Launch

**Launch date:** (fill in at completion)
**Plan:** [2026-04-22-first-5-etsy-products-plan.md](./2026-04-22-first-5-etsy-products-plan.md)
**Design:** [../specs/2026-04-22-first-5-etsy-products-design.md](../specs/2026-04-22-first-5-etsy-products-design.md)

---

## Definition of Done — from design §6.1

Check each (replace `[ ]` → `[x]` as completed):

- [ ] 5 listings live on Etsy — each with 5+ thumbnails, 13 tags, SEO-optimized title ≤140 chars, 5 downloadable files
- [ ] Shop has banner, icon, announcement, about, policies — live in Etsy settings (not just drafted)
- [ ] A13 buyer companion PDF is file #2 on every Etsy listing
- [ ] All 5 mirrored on Gumroad (Full versions where applicable)
- [ ] `templates/_masters/` has 5 `.xlsx` files committed
- [ ] `templates/_briefs/` has 10 files (5 briefs + 5 specs) committed
- [ ] `templates/_delivery/<sku>/` has thumbnail specs + companion PDF + license PDF for each of 5
- [ ] `templates/_lite/` has 1 file (P&L Lite)
- [ ] `copy/etsy-listings/` has 5 finalized listing files, no `<brand>` / `<domain>` tokens, no "speculative" warnings
- [ ] `infrastructure/etsy/shop-setup.md` and `infrastructure/gumroad/setup.md` exist + committed
- [ ] ≥1 test purchase completed successfully (file downloads, opens in Excel, upgrade CTA visible, email at hello@thestrledger.com)

## Gate history

| Gate | Target day | Actual day | Pass |
|---|---|---|---|
| G1 | 2 | | |
| G2 | 4 | | |
| G3 | 6 | | |
| G4 | 7 | | |
| G5 | 11 | | |
| G6 | 13 | | |
| G7 | 14 | | |

## Reported metrics (Day 14 snapshot)

- Total views across 5 listings: ___
- Favorites: ___
- First-sale time: ___ (Day of launch + hrs)
- Refund rate: ___%

## Issues for Lane B (hub) + Lane C (content)

(List anything discovered during launch that Lane B/C should address)

---

**Verified by:** Daniel Harrison, 2026-0X-XX
```

Fill in the checkboxes + dates based on actual state.

- [ ] **Step 2: Run final shop verification**

Open `https://etsy.com/shop/thestrledger` in incognito. Verify:
- 5 listings visible
- Banner + icon render
- About + Policies populated
- Each listing clicks through to proper listing page with thumbs + description

Open `https://gumroad.com/thestrledger`. Verify:
- 5 products visible
- Prices match setup.md

- [ ] **Step 3: Commit milestone**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add docs/superpowers/plans/2026-04-22-first-5-launch-dod-verified.md
git commit -m "launch: G7 passed — all 5 products live on Etsy + Gumroad, DoD verified"
```

## ✅ Gate G7 (Day 14) — LAUNCH COMPLETE

5 products live. Etsy shop open for business. Gumroad mirror complete. A13 buyer PDFs bundled. SEO pass done. First-sale capability unlocked.

---

## Phase 6 — Post-launch monitoring (Days 14–44)

### Task 18: Set up post-launch monitoring routine

**Files:**
- Create: `ops/post-launch-tracking.md`

**Owner:** Daniel (ongoing).

**Acceptance:** Daily-check routine established. At Day 30, data available for the first SKU retrospective.

- [ ] **Step 1: Write the tracking doc**

Write `ops/post-launch-tracking.md`:
```markdown
# Post-Launch Tracking — First 5 Etsy Products

**Launch date:** 2026-0X-XX
**First 30-day review:** 2026-0X-XX (launch + 30)

## Daily check (Days 1-14)

Every morning, 5 minutes:
1. Etsy Shop Manager → Stats → Listings — note views/favorites for each of 5
2. Orders tab — any new sales? Note SKU + price
3. Messages tab — any buyer questions? Respond within 1 business day
4. Quick visual check — is each listing still appearing in relevant Etsy search?

## Weekly check (Days 15-30)

Every Monday morning:
1. Aggregate views/favorites/sales for week
2. Note conversion rate per listing (favorites ÷ views × sales ÷ favorites)
3. Check refund rate (should be < 5%)
4. Check reviews (respond to every review, positive or negative)

## Tracking spreadsheet

Create a simple weekly log (paper or local sheet, doesn't need to be in repo):

| Week | Listing | Views | Favorites | Sales | Revenue | Refunds |
|---|---|---|---|---|---|---|
| 1 | GST-001 | | | | | |
| 1 | OPS-001 | | | | | |
| 1 | TAX-001 | | | | | |
| 1 | TAX-003 | | | | | |
| 1 | TAX-002 | | | | | |

## Alert thresholds (master spec §7.8)

- Refund rate > 8%: investigate specific SKU immediately
- CTR < 1% at Day 30: rewrite thumbnails (biggest conversion lever)
- CVR < 1% at Day 30: consider price drop or description rewrite
- Any listing with 0 views at Day 14: review tags (SEO), re-run search

## First-sale actions

When the first sale hits:
1. Verify the file actually downloaded (check order details)
2. Reply to buyer within 4 hrs with a personal "thanks" note
3. Ask for a review on Day 7 (Etsy convention)
4. Log it — timestamp the first-sale milestone for founder narrative

## Day 30 retrospective

On the Monday closest to Day 30, write a short retro:
- What sold first? Expected or surprising?
- Which listings got zero traffic? Why?
- Which thumbnails need A/B testing?
- What did buyers actually write in messages/reviews?
- Insights for Lane B (what to build next) and for Tax Season Bundle planning

Commit the retro to `docs/retrospectives/2026-0X-first-5-launch-retro.md`.

## Lane B + Lane C trigger points

- Reached $1K total Etsy revenue → pause; build Lane B hub (Weeks 3-8 from master spec)
- Reached 10 email captures via A13 PDF → Lane B email nurture becomes critical
- 50+ total listing views/day → Lane C content flywheel (Pinterest pins) should be pumping
```

- [ ] **Step 2: Commit**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add ops/post-launch-tracking.md
git commit -m "ops: post-launch tracking routine + alert thresholds + retrospective plan"
```

---

## Phase 7 — CheatLayer automation layer (Day 15+, post-launch addendum)

**Added:** 2026-04-23
**Trigger:** Daniel has a CheatLayer lifetime deal (https://docs.cheatlayer.com/introduction).
**Scope decision:** this Phase is **not** part of the 14-day DoD (G7). It's a post-launch efficiency layer. Reason: the first 5 manual Etsy uploads are a learning exercise — automating before running the process once hides what the automation actually needs to handle. Phase 7 starts **after G7 passes**.

**Design principle for this Phase:** CheatLayer is a point tool for **no-API surfaces only** (Etsy seller dashboard, Etsy public search pages, Gumroad seller dashboard). n8n remains the automation spine for anything with a real API. CheatLayer agents emit webhooks to n8n; n8n writes to Airtable.

**In scope (3 agents):**
- Task 19 — Etsy listing uploader (replay the upload checklist)
- Task 20 — Etsy review + Q&A monitor (post-launch monitoring automation)
- Task 21 — Competitor SEO scraper (feeds A12 re-passes)

**Out of scope (explicitly):**
- Any CheatLayer agent that hits Lane B surfaces with APIs (Stripe, Airtable, Mailgun, Ghost) — those stay in n8n.
- Scraping competitor shops at volume — low-rate, targeted scrapes only (Etsy ToS risk).
- Replacing the SEO research doc with scraped data — scraper *informs* Claude's research, doesn't replace it.

**Known risks (read before building):**
- **Etsy ToS:** Etsy's ToS prohibit automated scraping at scale. Rate-limit scraping of *public* Etsy pages to humane levels (≥3s between requests, ≤50 pages/run). Don't scrape logged-in seller pages of *other* shops. Scraping your *own* Shop Manager is low-risk.
- **Selector drift:** Etsy's DOM changes. Use CheatLayer's *semantic targeting* ("click the button labeled 'Publish'"), not brittle CSS selectors, so agents survive UI changes.
- **2FA:** if Etsy 2FA is on, agents need a session-cookie export path or manual login step. Budget time for this.

---

### Task 19: CheatLayer agent — Etsy listing uploader

**Files:**
- Create: `infrastructure/cheatlayer/agents/etsy-listing-uploader.md` (agent spec + CheatLayer node notes)
- Create: `infrastructure/cheatlayer/README.md` (folder purpose + agent index)

**Owner:** Daniel builds the agent in CheatLayer desktop app; Claude drafts the agent spec + the input schema.

**Acceptance:** Given a completed `copy/etsy-listings/<sku>.md` upload checklist, the agent fills the Etsy "Create listing" form end-to-end and stops at the "Preview / Publish" step for Daniel to eyeball before publishing. Tested on one new listing (Wave 3 product or a duplicate of an existing SKU in Draft status). Saves ≥20 min per listing vs. manual.

- [ ] **Step 1: Claude drafts the agent spec**

Write `infrastructure/cheatlayer/agents/etsy-listing-uploader.md`:
```markdown
# Agent — Etsy Listing Uploader

## Purpose
Replay the Etsy listing upload checklist from a markdown source of truth.

## Input schema
A `copy/etsy-listings/<sku>.md` file with the following sections parsed out:
- Title (≤140 chars)
- Description (full body, with newlines preserved)
- Tags (13 items, ≤20 chars each)
- Materials / Attributes (key-value pairs)
- Price (numeric, USD)
- Category path (breadcrumbs, e.g. "Paper & Party Supplies > Paper > Stationery")
- Files to attach (list of paths in `templates/_delivery/<sku>/`)
- Thumbnail image paths (5 images, ordered)
- Preview image path (1 image)
- Shipping profile name (always "Digital — instant download")
- Return policy name (always "Digital goods — no returns")

## Input parser
CheatLayer Python node parses the markdown via headers. Returns a JSON blob.
(Claude to write the parser script in Step 2.)

## Agent flow
1. Authenticate to Etsy Shop Manager (session cookie or manual login guard).
2. Navigate to Shop Manager → Listings → Add a listing.
3. Upload the 5 thumbnails + 1 preview image in order (semantic target: the file-drop zone).
4. Semantic-fill title, description, category, price, tags, materials, attributes.
5. Attach the digital file(s) under "Digital files."
6. Select "Digital — instant download" shipping profile.
7. Select "Digital goods — no returns" return policy.
8. STOP at "Preview your listing." Do NOT publish. Screenshot + alert Daniel.

## Output
- Writes a status JSON to `ops/cheatlayer-runs/<sku>-<timestamp>.json` with: success, duration, any fields flagged as "needed manual intervention," screenshot path.
- Posts a webhook to n8n endpoint `/cheatlayer/listing-uploaded` → n8n logs to Airtable `Listing Runs` table (schema TBD in Lane B).

## Error handling
- If any field can't be filled (e.g., Etsy added a new required field): STOP, screenshot, notify Daniel. Do NOT guess.
- If thumbnail upload fails (image format, size): STOP, log the error with the file path.
- If session expired mid-run: stop and prompt re-auth.

## Rate-limit posture
One listing per run. No parallel instances. Manual kick-off only (not scheduled).
```

- [ ] **Step 2: Claude drafts the markdown → JSON parser**

Write `infrastructure/cheatlayer/agents/etsy-listing-parser.py` (runs inside CheatLayer's Python node or as a pre-step in n8n):

```python
# Parses a copy/etsy-listings/<sku>.md file into the input JSON
# expected by the Etsy listing uploader agent.
# Headers used: ## Title, ## Description, ## Tags (13), ## Materials / Attributes,
#               ## Thumbnails (5), ## Files attached to Etsy (5), ## SEO
# Price + category come from a YAML frontmatter block at the top.
# (Daniel to add frontmatter to each listing .md as part of this task.)
import sys, re, json, yaml
from pathlib import Path

def parse_listing(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    fm_match = re.match(r"^---\n(.*?)\n---\n(.*)", text, re.DOTALL)
    if not fm_match:
        raise ValueError(f"{path}: missing frontmatter")
    frontmatter = yaml.safe_load(fm_match.group(1))
    body = fm_match.group(2)
    sections = re.split(r"\n## ", body)
    sec = {}
    for s in sections:
        if not s.strip():
            continue
        head, *rest = s.split("\n", 1)
        sec[head.strip().lower()] = (rest[0] if rest else "").strip()
    tags = [t.strip("- ").strip() for t in sec.get("tags (13)", "").splitlines() if t.strip()]
    thumbs = [t.strip("- ").strip() for t in sec.get("thumbnails (5)", "").splitlines() if t.strip()]
    files = [f.strip("- ").strip() for f in sec.get("files attached to etsy (5)", "").splitlines() if f.strip()]
    return {
        "sku": frontmatter["sku"],
        "title": sec.get("title (≤140 chars)", "").strip(),
        "description": sec.get("description", "").strip(),
        "tags": tags,
        "materials_attributes": sec.get("materials / attributes", "").strip(),
        "price_usd": frontmatter["price_usd"],
        "category_path": frontmatter["category_path"],
        "thumbnails": thumbs,
        "files": files,
        "shipping_profile": "Digital — instant download",
        "return_policy": "Digital goods — no returns",
    }

if __name__ == "__main__":
    p = Path(sys.argv[1])
    print(json.dumps(parse_listing(p), indent=2))
```

**Frontmatter Daniel adds to each `copy/etsy-listings/<sku>.md`:**
```yaml
---
sku: GST-001
price_usd: 17
category_path: "Paper & Party Supplies > Paper > Stationery > Templates"
---
```

- [ ] **Step 3: Daniel builds the agent in CheatLayer desktop**

Follow https://docs.cheatlayer.com/introduction for the node editor. Build:
1. Trigger node: manual (file input — the sku.md path).
2. Python node: run the parser from Step 2 → returns JSON.
3. Browser nav node: Etsy Shop Manager → Add a listing.
4. Semantic-target fill nodes for each field.
5. Loop node for 5 thumbnails.
6. Screenshot + webhook node at the end.

- [ ] **Step 4: Test on a throwaway draft listing**

Duplicate GST-001 in Etsy, delete its fields, then run the agent against the same `copy/etsy-listings/GST-001.md` file. Compare result to the original listing. All 13 tags, correct title, all 5 thumbnails, price $17. If any field wrong — fix the agent, not the markdown.

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/Kebron/Desktop/Claude OS/Excell-Templates"
git add infrastructure/cheatlayer/
git commit -m "cheatlayer: etsy listing uploader agent + markdown parser"
```

---

### Task 20: CheatLayer agent — Etsy review + Q&A monitor

**Files:**
- Create: `infrastructure/cheatlayer/agents/etsy-review-monitor.md`
- Modify: `ops/post-launch-tracking.md` (add automation reference)

**Owner:** Daniel builds the agent; Claude drafts the spec + the digest template.

**Acceptance:** Agent runs daily at 8am local, scrapes Daniel's Shop Manager "Reviews" + "Messages" tabs, and emails a digest to Daniel only if there's something new (new review, new unanswered message, new Q&A). No digest on zero-event days (don't spam Daniel). Replaces the "Messages tab check" step in Task 18 daily-check routine.

- [ ] **Step 1: Claude drafts the agent spec**

Write `infrastructure/cheatlayer/agents/etsy-review-monitor.md`:
```markdown
# Agent — Etsy Review + Q&A Monitor

## Purpose
Replace the manual morning "check messages + reviews" routine from Task 18.
Only send a digest when there's something new.

## Schedule
Daily, 08:00 local. CheatLayer visual cron.

## Agent flow
1. Authenticate to Shop Manager.
2. Navigate: Reviews tab → count new reviews since `last_run_timestamp`.
3. Navigate: Messages tab → count new unread messages.
4. Navigate: each live listing → "Item questions" section → count new unanswered Qs.
5. If total new events == 0: write last_run_timestamp, exit silently.
6. If total new events > 0: format digest (see below) → webhook to n8n → n8n sends email.

## State storage
`ops/cheatlayer-runs/review-monitor-state.json` — last run timestamp + seen review/message IDs.

## Digest format (emailed to Daniel)
Subject: "STR Ledger — N new events"
Body:
  - New reviews (K):
    - GST-001, 5★, "Loved this template..."
    - TAX-001, 3★, "Formula was wrong on row 7..." ← FLAGGED ≤4★
  - New messages (K): [list with SKU + first 80 chars + direct link]
  - New Q&A (K): [list with SKU + question text + direct link]
  Action for each ≤4★ review: open, read in full, decide if refund/response needed within 24h.

## Flags that escalate beyond email
- Any ≤3★ review → also SMS Daniel (via n8n Twilio node)
- Any message containing "refund", "broken", "doesn't work", "wrong" → also SMS
- 0 successful runs in 48hrs (agent broke) → SMS

## Rate-limit posture
5 page fetches per run, once per day. Fine.
```

- [ ] **Step 2: Daniel builds the agent + wires webhook to n8n**

Precondition: n8n webhook endpoint `/cheatlayer/review-digest` exists (deferred to Lane B — if Lane B isn't stood up yet, use a direct Mailgun node in CheatLayer as a stopgap).

- [ ] **Step 3: Modify post-launch tracking doc**

Edit `ops/post-launch-tracking.md` — under "Daily check (Days 1-14)," append:
```
**Automation:** Once CheatLayer review-monitor agent (infrastructure/cheatlayer/agents/etsy-review-monitor.md) is deployed, steps 3 (Messages tab) and the review-check portion of step 4 are handled by the daily digest email. Continue manual views/favorites scan in step 1 — CheatLayer can scrape those too but Etsy's analytics UI is fragile and the manual 2-minute check is cheaper than an agent that breaks on UI changes.
```

- [ ] **Step 4: Commit**

```bash
git add infrastructure/cheatlayer/agents/etsy-review-monitor.md ops/post-launch-tracking.md
git commit -m "cheatlayer: etsy review + Q&A monitor agent + post-launch routine update"
```

---

### Task 21: CheatLayer agent — Competitor SEO scraper

**Files:**
- Create: `infrastructure/cheatlayer/agents/etsy-seo-scraper.md`

**Owner:** Daniel builds the agent; Claude drafts the spec + the output schema.

**Acceptance:** Given a list of Etsy search queries (from `copy/etsy-listings/seo-research.md`), the agent returns the top 20 listings per query with: title, tag list (if visible), favorite count, review count, price, shop name, thumbnail URL. Output is a CSV in `ops/seo-snapshots/<YYYY-MM-DD>.csv`. Runs quarterly (manual kick-off) to feed A12 SEO re-passes.

- [ ] **Step 1: Claude drafts the agent spec**

Write `infrastructure/cheatlayer/agents/etsy-seo-scraper.md`:
```markdown
# Agent — Etsy SEO Scraper

## Purpose
Snapshot the Etsy search results page for each of our primary keywords, quarterly. Feeds Claude's A12 SEO re-pass so tag/title adjustments are grounded in current-market data, not stale research.

## Input
A list of search queries, one per line:
  airbnb welcome book
  vrbo welcome guide
  airbnb cleaning checklist
  airbnb mileage log
  1099 nec tracker
  str pnl template
  (etc — pull from seo-research.md)

## Agent flow
For each query:
1. Navigate to https://www.etsy.com/search?q=<URL-encoded query>
2. Wait 3s (rate limit posture).
3. Scrape top 20 visible listings. Per listing, capture:
   - title (link text)
   - price (span.currency-value)
   - favorite count (if shown)
   - review count (visible badge)
   - shop name (link)
   - thumbnail URL
   - listing URL
4. Append rows to output CSV.
5. Continue to next query.

## Rate-limit posture
3s between queries, 20 queries max per run, 1 run per quarter. Total: ~60s/run. Humane.

## Output
`ops/seo-snapshots/2026-QX.csv` with columns:
  query, rank, title, price, favorites, reviews, shop, thumbnail_url, listing_url, scraped_at

## Downstream use
Claude runs an analysis pass: which titles from the top 10 use keywords we're missing? Which price points cluster? Which shops dominate each query (competitor map)? Writes findings into the next `seo-research.md` revision.

## What this agent does NOT do
- Does not scrape tag data from competitors (Etsy hides tags from non-owners — don't spoof)
- Does not scrape review text (volume only)
- Does not run more than quarterly
```

- [ ] **Step 2: Daniel builds the agent + runs baseline snapshot**

First run: immediately after G7 (Day 14+). Establishes Q2 2026 baseline. Future runs quarterly.

- [ ] **Step 3: Commit the agent spec + baseline snapshot**

```bash
git add infrastructure/cheatlayer/agents/etsy-seo-scraper.md ops/seo-snapshots/
git commit -m "cheatlayer: etsy SEO scraper agent + Q2 2026 baseline snapshot"
```

---

## ✅ Phase 7 acceptance (no formal gate)

Not part of the 14-day DoD. Phase 7 is "done" when all 3 agents are built, tested once, and committed. No calendar deadline — pick them up after G7 based on ROI priority:

1. **Task 20 first** (review monitor) — saves daily time from Day 15 onward.
2. **Task 19 second** (listing uploader) — pays off at listing #6 and beyond.
3. **Task 21 third** (SEO scraper) — first run is quarterly anyway; no rush.

**Time budget for Daniel:** ~2–3 hrs per agent in CheatLayer, mostly in semantic-target tuning. Amortizes well if the shop expands past 5 listings.

---

## Self-review notes

This plan's author ran a self-review against the design doc:

**Spec coverage check:**
- Design §1.1 in-scope items → all 10 per-product deliverables covered (Tasks 5-13) ✓
- Design §1.1 shop-level items → A2/A3/A4/A5 covered (Tasks 1-4), A13 covered (Task 10), A14 covered (Task 16) ✓
- Design §1.1 post-publish → A12 covered (Task 14), monitoring covered (Task 18) ✓
- Design §2 wave structure → Tasks grouped Wave 1 (5-11) + Wave 2 (12-15) + Closeout (16-17) ✓
- Design §3 deliverable stack → each product has brief, spec, build, (lite if applicable), thumbnail specs, howto, license, listing, upload checklist ✓
- Design §4 shop-level tasks → all 6 implemented as tasks ✓
- Design §5 role split → every task explicitly names Claude drafts/Daniel executes at each step ✓
- Design §6 gate schedule → G1-G7 inline with corresponding tasks ✓
- Design §6.1 DoD → Task 17 verifies every item ✓

**Placeholder scan:**
- No "TBD", "TODO", "implement later" ✓
- No "handle edge cases" hand-waves ✓
- No "similar to Task N" references without content repeat ✓
- Full Python scripts inline for all 5 Excel builds ✓
- Full listing-ready title/tags/descriptions inline (with SEO research at Task 14) ✓

**Type/naming consistency:**
- SKU naming consistent (GST-001, OPS-001, TAX-001, TAX-002, TAX-003) across all tasks ✓
- File paths consistent (`templates/_briefs/<sku>.md`, `templates/_masters/<sku>.xlsx`, etc.) ✓
- `brand_config.py` function names used consistently (apply_brand_header, input_cell_style, etc.) ✓
- `COLOR_*` constants consistent across all 5 build scripts ✓

**One intentional compression:**
- TAX-002 Lite and Full ship identical content for MVP (positioning difference only). Design doc §3.2 acknowledges this. True multi-property Full is Phase 2+ and out of scope per design §1.3.

**Risk items surfaced during planning:**
- Etsy account approval could delay G4 by 1-2 days (mitigated in Task 2 by starting Day 1)
- Daniel's Vista Create work is the bottleneck — 25 product thumbnails + 5 brand assets + 5 branded PDFs ≈ 9-10 hrs over 2 weeks
- Wave 2 formula QA is the highest-risk gate (G5) — budget extra time

---

**Plan complete. 18 tasks across 14 days + ongoing monitoring.**

**Phase 7 addendum (2026-04-23):** +3 optional CheatLayer automation tasks (Tasks 19–21) appended. Not part of the 14-day DoD — executes post-G7 based on ROI priority. Self-review above remains valid for the original 18-task plan; Phase 7 is explicitly scoped as a post-launch efficiency layer, not a redesign.
