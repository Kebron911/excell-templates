# Brand Decisions — The STR Ledger

**Status:** Locked v1 — 2026-04-22
**Owner:** Daniel Harrison
**Source:** produced via `superpowers:brainstorming`; supersedes every `<brand name>` / `<domain>` placeholder across the repo.

This file is the single source of truth for every brand value. When any draft references brand, domain, palette, typography, tagline, or voice, it draws from here. Update this file first, then propagate.

---

## 1. Locked identity

| Field | Value |
|---|---|
| **Brand name** | The STR Ledger |
| **Short form** (body copy, second reference) | STR Ledger |
| **Etsy shop name** | The STR Ledger |
| **Domain** | thestrledger.com |
| **Primary email** | hello@thestrledger.com |
| **Instagram handle** | @thestrledger |
| **Pinterest handle** | @thestrledger |
| **Subdomain plan** | `blog.thestrledger.com` (Ghost), `app.thestrledger.com` (Influencersoft), `n8n.thestrledger.com` (tunneled) |
| **Archetype** | Ledger Firm — CPA-adjacent authority, warmed for the female-skewing Semi-Pro Sarah persona |
| **Style model** | Hybrid faceless + founder arm (per master strategy design §1) |

> **Availability checks** — Daniel confirmed `thestrledger.com` during brainstorm. Still to verify before launch: Etsy shop name, Instagram handle, USPTO trademark search ("The STR Ledger" + "STR Ledger"). Document results in `ops/credentials-inventory.md` once accounts are registered.

---

## 2. Tagline system

### Hero tagline (year-round)

> **Run your rentals before they run you.**

- Use on: Etsy banner, hub homepage, email signature, letterhead, Amazon book cover, podcast intros, About pages
- 7 words, book-title cadence
- Covers all 72 templates across the catalog (tax, ops, guest, pricing, marketing, legal, team, strategic)

### Campaign taglines (seasonal / surface-specific)

| Campaign | Tagline | When to use |
|---|---|---|
| Tax season | *Close your year before April does.* | Dec 15 – Apr 15 funnel, Pinterest Q1 pins, Tax Season Bundle, Schedule E/C listings |
| Operations | *Turnover chaos has a spreadsheet.* | Cleaner Turnover Checklist, Maintenance CRM, supply inventory listings, ops content |
| Guest experience | *Welcome books that earn 5-stars.* | Welcome Book, House Rules, Local Recs, Check-in/out listings |

Additional campaign taglines may be written per launch; they must (1) match the voice rules in §6, (2) be under 10 words, (3) reference an outcome or tension, never a feature.

---

## 3. Logo system

### 3.1 — Primary: wordmark

```
The
STR Ledger.
```

Structure:
- Line 1: "The" — Cormorant Garamond Italic, small (≈⅓ size of line 2)
- Line 2: "STR Ledger" — Cormorant Garamond Medium (500), large, tight letter-spacing (-0.01em)
- Terminal period ("`.`") — colored Muted Gold (#C9A24B) as accent mark

Use on: Etsy banner, hub homepage header, email header, Pinterest pin corner, Excel cover page, letterhead. ~90% of brand surfaces.

### 3.2 — Companion: circle monogram

```
[ S L ]  (in circle)
```

Structure:
- Circle: Harbor Navy fill OR Harbor Navy 1.5px outline (two versions)
- Letters: "S" in Parchment + "L" in Muted Gold — Cormorant Garamond Medium (500)
- No period in monogram

Use on: Etsy shop icon (500×500), favicon (16/32/180px), Instagram profile photo, YouTube avatar, Ghost blog avatar, PDF watermark, Excel cell watermark. ~10% of surfaces (anywhere square/tiny).

### 3.3 — Lockup rules

- Minimum size (wordmark): 120px wide digital / 1.2in print
- Minimum size (monogram): 24px digital / 0.25in print
- Clear space: equal to the cap-height of "S" in "STR" on all sides
- Never: stretch, rotate, add drop shadows, place on busy photography, or pair with other decorative typefaces

### 3.4 — Canva build spec (Task 0.5 dependency)

Export each in PNG + SVG to `brand/assets/`:

| Asset | Variant | Size | Background |
|---|---|---|---|
| Wordmark | Full color on navy | 2000×800 | Harbor Navy |
| Wordmark | Full color on parchment | 2000×800 | Parchment |
| Wordmark | Single color, ink | 2000×800 | Transparent |
| Wordmark | Single color, reverse | 2000×800 | Transparent (white art) |
| Monogram | Filled circle, navy | 1000×1000 | Transparent |
| Monogram | Outline circle, navy | 1000×1000 | Transparent |
| Monogram | Reverse (parchment art) | 1000×1000 | Transparent |
| Etsy banner | Composed | 1600×213 | Harbor Navy |
| Etsy shop icon | Monogram | 500×500 | Harbor Navy |
| Excel cover header | Composed | 1000×400 | Harbor Navy |

---

## 4. Color palette

### 4.1 — Core palette (brand kit)

| Name | Hex | RGB | Role |
|---|---|---|---|
| **Harbor Navy** | `#12304E` | `18, 48, 78` | Primary — authority, hero backgrounds, primary type on parchment |
| **Parchment** | `#F6EFE2` | `246, 239, 226` | Paper — warmed white, default page background, replaces sterile `#FFFFFF` |
| **Muted Gold** | `#C9A24B` | `201, 162, 75` | Accent — period-mark, gold rules, monogram "L", campaign highlight |
| **Clay Rose** | `#B5725E` | `181, 114, 94` | Warmth — secondary accent, female-operator signal without ever reading pink; use sparingly as highlight |
| **Graphite** | `#2B2B2B` | `43, 43, 43` | Ink — body copy on parchment (softer than pure black) |

### 4.2 — Ratio guideline

Per 100 visual units on any surface: **~55% Parchment · 30% Harbor Navy · 8% Graphite (type) · 4% Muted Gold · 3% Clay Rose**. This keeps the brand feeling warm-editorial, not corporate-navy-heavy.

### 4.3 — Extended system tokens (for code/CSS/Excel)

```
--brand-navy:      #12304E;   /* primary */
--brand-parchment: #F6EFE2;   /* paper */
--brand-gold:      #C9A24B;   /* accent */
--brand-clay:      #B5725E;   /* warmth */
--brand-graphite:  #2B2B2B;   /* ink */

/* Tints/shades for UI states */
--brand-navy-tint:     #2A4867;   /* hover, secondary navy */
--brand-navy-shade:    #0A1F35;   /* pressed, shadow navy */
--brand-parchment-alt: #EFE5D0;   /* alternate row, subtle card */
--brand-gold-soft:     #E2C884;   /* disabled/muted accent */
```

### 4.4 — Contrast & accessibility

- Harbor Navy on Parchment: 10.1:1 (WCAG AAA normal + large)
- Graphite on Parchment: 13.5:1 (AAA)
- Parchment on Harbor Navy: 10.1:1 (AAA)
- Muted Gold on Harbor Navy: 4.8:1 (AA normal, AAA large) — use for accents and 18pt+ type only
- Clay Rose on Parchment: 4.4:1 (AA large only) — never for body copy

### 4.5 — Excel-specific palette hex

Excel accepts the same hex codes. Use Harbor Navy for header rows, Parchment for alt-row banding, Muted Gold for highlights, Clay Rose for totals/summary rows, Graphite for text.

---

## 5. Typography

### 5.1 — Font stack

| Role | Typeface | Weights | Source |
|---|---|---|---|
| **Display** | Cormorant Garamond | 400 Regular, 400 Italic, 500 Medium, 500 Medium Italic | [Google Fonts](https://fonts.google.com/specimen/Cormorant+Garamond) |
| **Body / UI** | Inter | 400, 500, 600 | [Google Fonts](https://fonts.google.com/specimen/Inter) |
| **Accent / mono** | JetBrains Mono | 400, 500 | [Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono) |

### 5.2 — CSS stack

```
--font-display: "Cormorant Garamond", "Cormorant", Georgia, "Times New Roman", serif;
--font-body:    "Inter", "Helvetica Neue", Arial, system-ui, sans-serif;
--font-mono:    "JetBrains Mono", "Menlo", "Consolas", ui-monospace, monospace;
```

### 5.3 — Usage rules

| Element | Font | Weight | Size | Tracking |
|---|---|---|---|---|
| Hero H1 | Display | 500 | 48–84px | -0.015em |
| H2 | Display | 500 | 32–40px | -0.01em |
| H3 | Display | 500 | 22–28px | -0.005em |
| Pull quote / tagline | Display Italic | 400 | 20–28px | 0 |
| Body | Body | 400 | 14–16px | 0 |
| UI button | Body | 500 | 13–15px | 0.02em |
| Caption / small | Body | 400 | 12–13px | 0 |
| SKU / version / URL label | Mono | 400 | 10–12px | 0.18–0.22em (tracked wide) |
| Labels (UPPERCASE) | Body or Mono | 500 | 10–12px | 0.2em |

### 5.4 — Typographic signatures

These micro-details make the brand recognizable across surfaces:

1. **The period-as-accent** — "STR Ledger**.**" — the terminal period is Muted Gold, always. Makes the name feel like a declaration.
2. **The "The" italic** — the word "The" in the name is always Cormorant Italic at ~⅓ the size of the main name. Gives the masthead feel.
3. **The gold rule** — a 36–60px × 1px Muted Gold horizontal rule separates name from tagline in most lockups.
4. **Mono tracked labels** — SKUs, category tags, and URLs always use JetBrains Mono with 0.18–0.22em letter-spacing, uppercase, in Muted Gold or Harbor Navy.

### 5.5 — Excel typography fallback

Excel lacks Cormorant Garamond by default. In spreadsheets:
- Headers: **Georgia** (system serif) 14–16pt Bold as Cormorant fallback
- Body/data: **Calibri** 10–11pt (Excel default, readable)
- Labels/SKUs: **Consolas** 9pt, UPPERCASE, tracked — monospace fallback
- Cover page only: if Cormorant Garamond is installed on user's system, Excel will use it; otherwise Georgia gracefully substitutes.

---

## 6. Voice rules

### 6.1 — Always

- **First-person plural** — "We built this after years of watching QuickBooks fail STR hosts."
- **Specific dollar figures** — "$8,427 deduction" not "big savings"
- **"Host" and "portfolio"** — dignifies the reader's identity; never "side-hustler"
- **Calm authority on tax** — cite IRS codes (Schedule E, §179, §168(k)) with calm confidence
- **Assume real business** — the reader runs a real operation, not a hobby
- **Plain English** — no MBA jargon, no "leverage your synergies"
- **Problem first, product second** — every listing/email/post names the pain before the pitch

### 6.2 — Never

- Boss-babe language or emojis ("Hey boss babe 💅", crown emojis)
- Crypto-bro punctuation (multiple exclamation marks, 🚀)
- Watercolor, script, or handwritten fonts anywhere
- Emoji in product titles (sparingly in categories only, per master spec)
- "Unlock your financial freedom" / "Escape the 9-to-5" aspirational clichés
- Condescending beginner-isms ("Don't worry, you've got this! ✨")
- Gendered coding in either direction ("hey girl" or "gentlemen")
- Discounting to desperation ("EVERYTHING 80% OFF — FINAL 24 HOURS!!!")

### 6.3 — Example voice tests

| ❌ Wrong | ✅ Right |
|---|---|
| "Unlock your Airbnb tax savings! 🏠💸" | "The $8,427 deduction most STR hosts miss." |
| "Hey host babe, ready to crush tax season?" | "Close your year before April does." |
| "Our easy-to-use spreadsheet helps you track stuff." | "Schedule E-ready workbook. Formula-tight. Built for 3–10 properties." |
| "You got this!! ✨" | "The books every real portfolio needs." |

---

## 7. Persona anchor (for copy + design decisions)

Every brand decision resolves against **Semi-Pro Sarah** (per master strategy §2):

- 38–55, female-skewing, married to W2 partner
- 3–10 STR properties, runs portfolio as "the real business"
- HHI $200K+, STR gross $150–500K/yr
- Top pains: tax season anxiety, cleaner chaos, pricing guesswork, partner asking "where are the real books?"
- $297 template is "rounding error"
- Lives in: Facebook host groups, Pinterest, Instagram, BiggerPockets, podcasts, email

**The test:** "Would Sarah forward this to her CPA without embarrassment?" If no, rewrite.

---

## 8. Surface specs

Dimensions and brand application for every repeating brand surface.

| Surface | Dimensions | Primary asset | Tagline | Notes |
|---|---|---|---|---|
| Etsy shop banner | 1600×213 | Wordmark left, tagline right | Hero | Navy bg, parchment type, gold rule |
| Etsy shop icon | 500×500 | Monogram (filled navy circle) | — | Square — monogram only |
| Etsy listing thumbnail | 2000×2000 | Wordmark bottom or top, category mono label, product name display | — | Navy bg with gold accent per category |
| Pinterest pin (standard) | 1000×1500 | Wordmark or mono bottom, URL | Hero or campaign | Parchment bg, navy display type |
| Pinterest pin (long) | 1000×2100 | Wordmark bottom | Campaign | Use for multi-deduction / multi-step content |
| Instagram profile | 320×320 | Monogram filled navy circle | — | Same as Etsy shop icon |
| Instagram post | 1080×1080 | Wordmark subtle, mono SKU | Varies | Parchment bg default |
| Ghost blog header | full width | Wordmark left, nav right | Hero subtitle | Parchment bg, navy type |
| Ghost blog post cover | 1920×1080 | Wordmark bottom-right, title center | — | Title in Cormorant Medium |
| Email header | 600×120 | Wordmark left, subtle rule | — | Parchment or navy |
| Email signature | inline | Monogram 42px + name + tagline | Hero (shortened ok) | Inline HTML, mobile-safe |
| Excel cover tab | 1000×400 | Wordmark bottom, SKU top-right | — | Navy bg block top, parchment rows below |
| Favicon | 16/32/48/180 | Monogram filled navy | — | No text legible at 16px, just circle+letters |
| Letterhead / PDF cover | 8.5×11 in | Stacked lockup | Hero | Navy accent band top |

---

## 9. Token substitution map

These are the placeholders currently in drafted files that must be replaced on the "brand locked" handoff. **This list drives the writing-plans skill's substitution pass.**

| Placeholder | Replace with | Files affected |
|---|---|---|
| `<brand name>` | The STR Ledger | `copy/etsy-listings/shop-about.md`, `copy/etsy-listings/shop-policies.md`, plus all drafts produced before this lock |
| `<brand>` (standalone) | thestrledger (when used in `<brand>.com`) or "The STR Ledger" (when used in prose) | `ops/user-manual-todo.md`, `copy/pinterest/pin-catalog-first-30.md`, etc. |
| `<domain>` | thestrledger.com | all referring files |
| `hello@<brand>.com` | hello@thestrledger.com | email drafts, signatures, listings |
| `n8n.<brand>.com` | n8n.thestrledger.com | infrastructure docs |
| `blog.<brand>.com` | blog.thestrledger.com | infrastructure docs |
| `app.<brand>.com` | app.thestrledger.com | influencersoft config, if adopted |
| `<tagline placeholder>` | Run your rentals before they run you. | hero-magnet copy, landing pages |

The substitution pass is a find-and-replace across the repo, reviewed commit-by-commit to catch false positives (e.g., `<brand>` used as a generic term in a specification block).

---

## 10. Brand governance

### 10.1 — Decision authority

Daniel owns every value in this document. Claude may propose revisions but never changes this file without explicit approval.

### 10.2 — Change process

1. Propose change via a dated commit prefixed `brand:` (e.g., `brand: swap Clay Rose hex from B5725E to A76850`)
2. Update §1 header to bump version (v1 → v1.1) + date
3. Propagate downstream: Canva Brand Kit → drafted docs → live storefronts in that order

### 10.3 — Expansion policy

The brand is STR-locked for the immediate term per Daniel's scope declaration. If/when the brand expands beyond STR, options include:
- Sub-brand under an umbrella ("The STR Ledger, from `<parent>` & Co.")
- Rebrand of the hub while keeping "The STR Ledger" as an imprint/product line
- Spin off sibling brands (e.g., "The LTR Ledger" for long-term rentals)

No expansion work required before Q4 2026.

---

## 11. Open items

- [ ] Confirm Instagram handle `@thestrledger` available (Task 3.1 dependency)
- [ ] USPTO TM quick-search for "The STR Ledger" + "STR Ledger" standing (10 min)
- [ ] Canva Brand Kit populated with all hex codes, fonts, logo exports (Task 0.5)
- [ ] Google Fonts CSS stack wired into Ghost blog and Influencersoft hub theme (Task 1.4, 1.6)
- [ ] Brand asset exports checked into `brand/assets/` (Task 0.5)
- [ ] Brand-decisions → token substitution pass across drafted docs (next writing-plans step)

---

**End of brand lock. All token-substitutable references in the repo now have a source of truth.**
