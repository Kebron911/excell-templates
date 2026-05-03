# The STR Ledger — Design System

> *Run your rentals before they run you.*

This is the working design system for **The STR Ledger**, a brand that sells business-grade Excel financial and operational systems for short-term rental (Airbnb/VRBO) hosts. The brand voice is **CPA-adjacent authority, warmed for a female-skewing semi-pro operator** ("Semi-Pro Sarah" — 3–10 properties, HHI $200K+, treats her portfolio like a real business).

**Live at:** [thestrledger.com](https://thestrledger.com) (planned — not yet live at time of system build)

---

## Company / product context

The STR Ledger is a multi-storefront product catalog (Etsy, Gumroad, and a forthcoming hub at `thestrledger.com`) wrapped around a **tax-and-financial beachhead** for STR hosts. The brand ships:

- **Excel templates** — mileage logs, Schedule E workbooks, depreciation trackers, 1099-NEC trackers, per-property P&L workbooks, cleaner turnover checklists, guest welcome books (65 SKUs planned).
- **A blog** at `blog.thestrledger.com` (Ghost) — SEO-driven posts like "47 Airbnb Tax Deductions Most Hosts Miss."
- **An email-nurture funnel** — lead magnet → $17 tripwire (Mileage Log) → $97 core (Schedule E Workbook) → $147–$297 bundles.
- **A social/Pinterest ecosystem** — 30-pin launch catalog, Instagram at `@thestrledger`, Facebook group ("Inner Circle").

The persona is **Semi-Pro Sarah**, 38–55, married to a W-2 partner, runs 3–10 STR properties as a real business. Every brand decision resolves against her: *"Would Sarah forward this to her CPA without embarrassment?"*

### Surfaces this system must cover

1. **Marketing web** — `thestrledger.com` hub homepage, product pages, lead-magnet landing page.
2. **Blog** — Ghost-themed long-form posts at `blog.thestrledger.com`.
3. **Etsy storefront** — shop banner, shop icon, listing thumbnails (2000×2000).
4. **Email** — hero nurture sequence (9 emails, Day 0–21), broadcast template.
5. **Pinterest** — 1000×1500 pin templates in 5 variant styles.
6. **Excel templates** — cover pages, tab banners, cell watermarks.

### Sources used to build this system

All sourced from the private repo **`Kebron911/excell-templates`** on GitHub. Key files:

- [`../brand/brand-decisions.md`](../brand/brand-decisions.md) — **the locked single source of truth** (v1.1 — lives in the repo root, not duplicated here). Palette, type, logo system, voice rules, persona, surface specs.
- `copy/etsy-listings/*` — 5 full Etsy listing drafts, shop About, shop policies.
- `copy/email-sequences/nurture-hero-magnet.md` — 9-email Day-0-to-Day-21 sequence, full scripts.
- `copy/blog-posts/*` — three draft long-form posts (tax deductions, Schedule E, depreciation).
- `copy/pinterest/pin-catalog-first-30.md` — 30-pin launch catalog with style variants.
- `copy/lead-magnets/etsy-buyer-pdf.md` — Etsy-companion PDF spec.
- `docs/superpowers/specs/2026-04-22-str-tax-platform-design.md` — master strategy (not directly design-relevant).

No imagery, logo exports, or font files existed in the source repo at time of import — they were in a `../brand/assets/` folder pending Task 0.5 (Vista Create produce-and-export; the repo switched from Canva to Vista Create in `brand/canva-specs.md`). **This design system therefore builds the logo, monogram, and brand marks in HTML/SVG/CSS, rather than importing pre-rendered files.** See `assets/` and the Brand card group in preview. When the Vista Create exports land in `../brand/assets/`, they supersede these code renders.

---

## Content fundamentals

The brand voice is **editorial, numbers-first, warm but professional**. Copy reads like a good CPA writing to a respected client — not a Shopify course marketer writing to a beginner.

### Principles (from `../brand/brand-decisions.md` §6)

- **First-person plural** — *"We built this after years of watching QuickBooks fail STR hosts."*
- **Specific dollar figures** — *"$8,427 deduction"* not *"big savings"*.
- **"Host" and "portfolio"** — never *"side-hustler"*. Dignifies the reader's identity.
- **Calm authority on tax** — IRS codes (Schedule E, §179, §168(k)) cited confidently, without apology.
- **Assume a real business** — the reader runs a real operation, not a hobby. Don't over-explain.
- **Plain English** — no MBA jargon, no "leverage your synergies."
- **Problem first, product second** — every listing, email, or post names the pain before the pitch.

### Hard nos

- No emoji as punctuation. Emoji never appear in product titles or headlines. (Etsy listing bodies use them sparingly as category markers — 📊, 💵, 🚗 — never in a .com or blog surface.)
- No boss-babe language, crown emoji, "hey host babe."
- No rocket emoji, multiple exclamation marks, or crypto-bro punctuation.
- No watercolor, script, or handwritten fonts anywhere.
- No aspirational clichés — *"Unlock your financial freedom,"* *"Escape the 9-to-5."*
- No condescending beginner-isms — *"Don't worry, you've got this!"*
- No discounting-to-desperation — *"EVERYTHING 80% OFF — FINAL 24 HOURS!!!"*

### Casing, grammar, pronouns

- **Sentence case** for most headlines and section labels. Title Case is reserved for brand name (*The STR Ledger*) and formal document titles.
- **UPPERCASE with tracked mono** for SKU labels, category tags, URLs, and eyebrows — *TAX-001*, *SCHEDULE E • $97*.
- **"We" for the brand, "you" or "the host" for the reader** — first-person plural for us, second-person singular for them.
- **Oxford comma on.** Em-dashes welcome (tight, no spaces — like this).
- **Contractions yes** — reads human, not legal.
- **Numerals for money and metrics** — *$8,427*, *70¢/mile*, *3–10 properties*. Spell out small quantities only when narrative — *"four years of hosting"*.

### Voice tests (✅ right / ❌ wrong)

| ❌ Wrong | ✅ Right |
|---|---|
| "Unlock your Airbnb tax savings! 🏠💸" | "The $8,427 deduction most STR hosts miss." |
| "Hey host babe, ready to crush tax season?" | "Close your year before April does." |
| "Our easy-to-use spreadsheet helps you track stuff." | "Schedule E-ready workbook. Formula-tight. Built for 3–10 properties." |
| "You got this!! ✨" | "The books every real portfolio needs." |

### Signature phrases & taglines

- **Hero tagline:** *Run your rentals before they run you.* — year-round, all surfaces.
- **Tax season:** *Close your year before April does.* — Dec 15–Apr 15.
- **Operations:** *Turnover chaos has a spreadsheet.* — ops listings.
- **Guest experience:** *Welcome books that earn 5-stars.* — guest-facing listings.

All campaign taglines must (1) match the voice rules, (2) stay under 10 words, (3) name an outcome or tension — never a feature.

---

## Visual foundations

The system is **editorial, warm, and understated-confident** — closer to a hospitality-industry trade journal than a SaaS dashboard. It reads like paper: warmed cream backgrounds, deep navy ink, a single tick of gold. Never sterile white.

### Palette

The five-color palette is used at a strict ratio — **~55% Parchment · 30% Harbor Navy · 8% Graphite · 4% Muted Gold · 3% Clay Rose**. This keeps the brand feeling warm-editorial, not navy-heavy or gold-flashy.

| Name | Hex | Role |
|---|---|---|
| **Harbor Navy** | `#12304E` | Primary — authority, hero backgrounds, body-text-on-parchment |
| **Parchment** | `#F6EFE2` | Default page background — a warmed cream that replaces sterile `#FFFFFF` |
| **Muted Gold** | `#C9A24B` | Accent — the period-mark, gold rules, SKU labels |
| **Clay Rose** | `#B5725E` | Warmth — secondary accent; female-operator signal without ever reading pink |
| **Graphite** | `#2B2B2B` | Ink — body copy (softer than pure black) |

Clay Rose is used at 3% max — a single subhead tint, a highlighted total row, a campaign badge. It never dominates.

### Typography

Three families, three jobs. Never introduce a fourth.

- **Cormorant Garamond** — display serif. Hero headlines, section titles, pull quotes, the brand wordmark. Medium (500) for titles; Italic (400) for "The" in the masthead, tagline, and pull quotes.
- **Inter** — body sans. All long-form copy, UI labels, buttons. 400 for body, 500 for UI/buttons, 600 for emphasized body or small section titles.
- **JetBrains Mono** — accent mono. SKU labels, URLs, tracked eyebrows, tiny version strings. Always UPPERCASE with 0.18–0.22em letter-spacing.

See the `Type` card group in preview for full specimens.

### Typographic signatures

Four micro-details make the brand recognizable anywhere:

1. **The period-as-accent.** The terminal period after *"STR Ledger**.**"* is Muted Gold, always. Makes the name feel like a declaration.
2. **The italic "The".** The word *The* in the name is always Cormorant Italic at ~⅓ the size of the main name. Gives the masthead feel.
3. **The gold rule.** A 36–60px × 1px Muted Gold horizontal rule separates name from tagline in most lockups, and is a reusable decorative element (eyebrow dividers, section breaks).
4. **Tracked mono labels.** SKUs, category tags, and URLs are always JetBrains Mono, UPPERCASE, 0.18–0.22em tracking, in Muted Gold or Harbor Navy.

### Backgrounds

- **Parchment (`#F6EFE2`) is the default.** Never pure white. Full-bleed pages use parchment or navy, not both layered.
- **Harbor Navy hero bands** — full-width navy sections are used for heroes, section starters, and "statement" blocks. About 30% of vertical real estate on any hub page.
- **Parchment alt (`#EFE5D0`)** — slightly deeper paper for alternating rows, subtle cards, table banding.
- **No gradients** — not bluish-purple, not navy-to-gold. The palette is flat. The only "gradient" permitted is a subtle protection scrim (navy 0% → navy 60%) over photography for legibility.
- **No repeating patterns or textures.** The system is editorial-clean, not decorative.
- **Imagery** — when photography is used (e.g., Ghost blog covers, Pinterest pins), it skews **warm, natural-light, muted-saturation**. No cool/teal grading, no grain, no duotones. Think "daylight in a well-appointed cabin," not "startup stock photo."

### Spacing

8-point scale with one half-step (4px) and two oversized steps (96/128) for editorial breathing room. See the `Spacing` card group in preview.

### Layout

- **Asymmetric editorial grids** are preferred over centered SaaS layouts. Two-column with uneven weights, generous margins.
- **Generous margins.** 96–128px section padding at desktop; never cramped.
- **Gold rule as structural device** — separating eyebrow from headline, headline from body, name from tagline. Short (36–60px) and horizontal; never full-width as a section divider.
- **Mono labels above headlines** — the eyebrow pattern is `MONO LABEL — TRACKED`, then display headline, then short gold rule, then body.

### Corners & borders

Editorial, not chat-app.

- **Default radius: `0px`** (square corners). Cards, hero blocks, image containers — all square by default.
- **2px** on buttons and inputs — subtle softening.
- **4px** on small content cards where a square feels brutalist.
- **Pills (999px)** only for tag chips and the monogram circle.
- **Hairline borders** use `#E7DCC2` (parchment-deep) on parchment, or 1px `rgba(246,239,226,0.15)` on navy. Avoid heavy 2px borders.

### Shadows

Minimal. The system leans on type contrast and white-space, not elevation.

- **Card shadow** — `0 1px 2px rgba(10,31,53,.06), 0 1px 1px rgba(10,31,53,.04)`. Whisper-thin.
- **Lifted** — used on modals and focus-overlays only: `0 8px 24px -8px rgba(10,31,53,.20), 0 2px 6px rgba(10,31,53,.08)`.
- **Focus ring** — 3px `rgba(201,162,75,.45)` gold glow on interactive focus.
- **No inner shadows** on surfaces. No drop-shadows on type.

### Interaction states

- **Hover on primary (navy) buttons:** brighten to Navy Tint `#2A4867`; cursor: pointer. No translate, no scale.
- **Hover on ghost buttons and links:** underline appears or thickens; text shifts to Navy Tint.
- **Press:** darken to Navy Shade `#0A1F35`; no scale-down. Desktop only — press states are subtle.
- **Focus:** 3px Muted Gold glow ring on any keyboard-focused element.
- **Disabled:** 40% opacity, no pointer events. Disabled gold uses `--brand-gold-soft`.
- **Hover on cards:** gold rule appears under the title, or a 1.5px gold border lights up on one edge — never a shadow increase.

### Motion

- **Durations:** `120ms` fast (hover tint), `200ms` standard (menu/dropdown), `360ms` slow (panel reveal). Never above 400ms.
- **Easing:** `cubic-bezier(0.2, 0.6, 0.2, 1)` for most things (standard). No bounces. No elastic.
- **Fades over slides.** Opacity + a 4–8px Y-translate. No dramatic sweep-ins.
- **No parallax, no skeuomorphic animation, no decorative loops.** The brand has the confidence to not perform.

### Transparency & blur

- **Used rarely.** Transparency appears in one place — the protection scrim (`rgba(18,48,78, 0→0.6)`) over hero photography.
- **No backdrop-filter blur.** No frosted-glass UI. The brand is paper, not glass.

### Cards

The default card is a **parchment-alt rectangle with a hairline border, no shadow, no radius** (or 4px max). Typical contents: eyebrow label, title in Cormorant 500, short gold rule, two-line body, optional link with gold underline. Cards earn their presence through content hierarchy, not chrome.

For product cards specifically: 4px radius, subtle card shadow, 1px parchment-deep border, 32px inner padding, SKU label in gold mono at top-right, Cormorant 500 title, Inter 14 body.

### Fixed elements

- **Header** — 64–80px tall. Parchment background with a 1px hairline bottom. Wordmark left, nav right. Goes navy on scroll past 120px (smooth fade).
- **Footer** — Harbor Navy, 96px top/bottom padding, four columns at desktop. Monogram top-left, gold hairline above copyright.

---

## Iconography

The brand uses iconography **sparingly and purposefully**. Icons are a supporting language — they never carry meaning on their own, and they never appear decoratively. The visual load is carried by typography, photography, and the gold accent.

### Icon system

**Lucide icons** — stroke-only, 1.5px stroke weight, rounded line caps — are the chosen system. Reasons:

1. The brand repo did not ship a custom icon font or SVG sprite; we had to pick one.
2. Lucide's aesthetic (thin stroke, rounded caps, minimal ornament) matches the editorial feel of Cormorant + Inter. It reads as a drawing tool, not a UI chrome.
3. Available as a CDN-addressable package, which keeps templates lightweight.

> **Flag — icon substitution.** The STR Ledger brand doc does not specify an icon system. Lucide is my substitution, matched to voice. If you have a preference (Heroicons outlined, Tabler, Phosphor Light, or a custom set), tell me and I'll swap globally.

**Usage spec:**

- Stroke color matches surrounding text. Navy icons on parchment, parchment icons on navy, gold icons only when paired with gold-typed text (SKU row, accent bullets).
- 1.5px stroke at 24px base size. Scale proportionally — stroke never goes below 1px visually.
- 16px is the floor for inline UI icons. 20px for body-integrated. 24px for nav and card icons. 32px+ for feature blocks.
- Icons are never filled. If an icon only exists as a fill style, we don't use it.
- Icons pair with a label. Icon-only affordances are reserved for nav (hamburger, close, search) and utility bars (cart, settings, download).

**Delivery:** Lucide is loaded via CDN (`https://unpkg.com/lucide@latest`) and used inline via `<i data-lucide="icon-name">` or rendered as raw SVG. See any UI kit `index.html` for examples.

### Emoji

**Emoji are not a brand system.** They do not appear on:

- The `.com` hub, blog, Pinterest pins, email headers, Excel templates, or Instagram captions outside of fun story-post exceptions.
- Any product titles (Etsy included).
- Any headline, subhead, or CTA.

**Emoji do appear, controlled, in Etsy listing bodies only** — as section markers: 📊 WHAT'S INCLUDED, 💵 WHY IT PAYS FOR ITSELF, 🚗 WHO IT'S FOR, ❌ WHAT'S NOT INCLUDED. This is an Etsy-ecosystem convention (Etsy buyers expect visual scannability in listing text) that the brand doc explicitly permits for listings. It is a narrow, ring-fenced use.

### Unicode & decorative marks

- **Em-dash (—)** is the brand's punctuation signature. Tight, no spaces.
- **Center dots (·)** separate metadata runs (*"$17 · Excel · Instant download"*).
- **En-dash (–)** for numeric ranges — *"3–10 properties."*
- **Gold terminal period** (see Signatures above) — the only permitted color-on-glyph treatment.

### Logos & marks

The logo system is built in HTML/SVG/CSS as a set of reusable components — **no PNG/SVG exports existed in the source repo at build time.** See `assets/` for placeholder SVGs, and `ui_kits/web/components/Wordmark.jsx` + `Monogram.jsx` for the real implementations.

- **Primary wordmark** — stacked *The / STR Ledger.* — Cormorant Italic small "The" + Cormorant Medium "STR Ledger" + gold terminal period.
- **Circle monogram** — `[S L]` in a navy filled or outlined circle. S in parchment, L in gold. Used for favicons, avatars, Etsy shop icons.
- **Lockup rules** — min 120px wide (wordmark) / 24px (monogram). Clear space = cap-height of "S" in "STR". Never rotate, stretch, drop-shadow, or pair with other decorative typefaces.

> **Flag — logo assets missing.** The official Canva-produced PNG/SVG exports (listed in brand-decisions §3.4) are not yet in the repo. This system ships a code-only rendering that matches the spec exactly. When Daniel's Canva exports land, drop them into `assets/` and they will supersede the code renders.

---

## Index — what's in this system

```
README.md                       ← you are here
SKILL.md                        ← Claude Code / Agent Skills entry point
colors_and_type.css             ← all design tokens + semantic element styles
assets/
  wordmark-on-parchment.svg     ← primary wordmark, rendered
  wordmark-on-navy.svg          ← reverse wordmark, rendered
  monogram-filled.svg           ← navy-filled circle monogram
  monogram-outline.svg          ← navy-outlined circle monogram
  favicon.svg                   ← 32×32 favicon
  spreadsheet-hero.svg          ← generic placeholder illustration
preview/                        ← Design System tab cards (one per sub-concept)
ui_kits/
  web/                          ← thestrledger.com hub + product + blog
  etsy/                         ← Etsy shop banner + listing thumbnails
  excel/                        ← Excel cover pages + tab banners
  pinterest/                    ← 5 pin templates (1000×1500)
../brand/brand-decisions.md     ← locked brand doc v1.1 (repo root — single source of truth)
```

### Font file note

Cormorant Garamond, Inter, and JetBrains Mono are loaded from Google Fonts via `@import` in `colors_and_type.css`. There are no local `.ttf` or `.woff2` files in `fonts/` — the brand spec explicitly lists Google Fonts as the source. If you're building an offline surface (Canva, Excel, print) that can't hit the CDN, grab them directly from Google Fonts and save locally.

> **Flag — no font substitutions were needed.** All three families are Google-hosted. Excel has its own fallback stack (Georgia / Calibri / Consolas) documented in `../brand/brand-decisions.md` §5.5.

### UI kits

- `ui_kits/web/` — the `thestrledger.com` hub. Homepage, product page, blog post page, lead-magnet landing. See its README for details.
- `ui_kits/etsy/` — shop banner (1600×213), shop icon (500×500), listing thumbnail (2000×2000), Etsy storefront mockup.
- `ui_kits/excel/` — Excel template cover pages, tab headers, summary-row styling. Documented in-kit.

No slides were requested or provided, so no `slides/` folder is created.

---

## How to use this system

- **Starting a new surface?** Read this README, then read `../brand/brand-decisions.md`. Then open the UI kit closest to your surface (web / etsy / excel) and copy its patterns.
- **Need a color or a type token?** `colors_and_type.css` has every var. Import it at the top of any HTML file. All components in the UI kits already depend on it.
- **Need a logo?** Use the `Wordmark` or `Monogram` component from `ui_kits/web/components/` — they're pure SVG/CSS and drop in anywhere.
- **Writing copy?** Re-read the Content Fundamentals section. Run the Sarah test: *"Would she forward this to her CPA without embarrassment?"* If no, rewrite.

---

## Index — what's in this folder

Root-level files:

- **`README.md`** — this document. Start here.
- **`SKILL.md`** — Agent-Skill entry point. Read this if you're dispatching an agent on this system.
- **`colors_and_type.css`** — all CSS variables. Import in any prototype. Defines brand palette, semantic tokens, type stack, radii, shadows, spacing.
- **`fonts/`** — webfont files (Cormorant Garamond, Inter, JetBrains Mono — sourced from Google Fonts as substitutes; see caveats).
- **`assets/`** — brand marks (logo SVGs referenced from components) and illustrations. The locked spec lives at `../brand/brand-decisions.md`.
- **`../brand/`** — the single-source-of-truth spec lives at the repo root (not duplicated here). `brand-decisions.md` v1.1 is authoritative; `canva-specs.md` holds Vista Create build specs.
- **`../copy/`** — marketing copy (Etsy listings, email sequences, blog posts, Pinterest catalog) at the repo root — read for tone reference.

UI kits:

- **`ui_kits/web/`** — `thestrledger.com` hub. Homepage, product detail, blog post, lead-magnet landing. Shared atoms in `components/atoms.jsx`.
- **`ui_kits/excel/`** — The 2025 Ledger workbook preview. Branded Excel chrome with Schedule E / deductions / depreciation tabs.
- **`ui_kits/etsy/`** — Etsy storefront. Shop homepage (7 listings) + listing detail (TAX-001). Etsy chrome recreated with brand-styled thumbnails.
- **`ui_kits/pinterest/`** — Five 1000×1500 pin templates (Big Number / List Promise / Quote / Comparison / Stacked Words) in a Pinterest-feed gallery.

Preview cards:

- **`preview/`** — all Design System tab cards, one HTML file per card, registered by group (Type / Colors / Spacing / Components / Brand).

---

## Caveats & next steps

- **No Vista Create-exported logo files** were in the source repo (the brand moved from Canva to Vista Create — see `../brand/canva-specs.md`). The code-rendered marks in `assets/` and `ui_kits/` are faithful to the spec but will be superseded by the official exports once Daniel ships Task 0.5 into `../brand/assets/`.
- **No production screenshots of `thestrledger.com` exist** — the site is not live at time of build. The web UI kit is a from-spec hi-fi recreation of the brand in action, not a fidelity copy of a live site. Iterate with Daniel as the site gets real.
- **Excel template files (`.xlsx`)** were not in the source repo. The `ui_kits/excel/` kit is a browser-rendered mockup of what an Excel cover page *should* look like, not an actual `.xlsx`.
- **Iconography is a stated substitution** — Lucide picked on my own judgment. Swap if you have a preference.
