---
name: str-ledger-design
description: Use this skill to generate well-branded interfaces and assets for The STR Ledger — an editorial-finance brand that sells Excel workbooks and operational systems for Airbnb/VRBO hosts. Contains palette, typography (Cormorant Garamond + Inter + JetBrains Mono), logo components, voice rules, and UI kits for the marketing site and the flagship workbook. Good for landing pages, product pages, blog posts, email captures, Etsy listings, Pinterest pins, and Excel-style workbook mocks.
user-invocable: true
---

# The STR Ledger — design skill

Read `README.md` first — it holds the content fundamentals, visual foundations, iconography rules, and index to every other file. Then explore:

- `colors_and_type.css` — drop this into any HTML prototype and you get the full token set (colors, type, radii, shadows, spacing).
- `fonts/` — Cormorant Garamond (display, italic "The"), Inter (body + UI), JetBrains Mono (eyebrows, SKUs, stats).
- `ui_kits/web/components/atoms.jsx` — Wordmark, Monogram, GoldRule, Eyebrow, Button, Header, Footer. These are the primitives. Reuse, don't redraw.
- `ui_kits/web/` — the four canonical web surfaces (home, product, blog, landing). Start from the nearest match and edit.
- `ui_kits/excel/` — the workbook look. Use when mocking any spreadsheet-flavored surface.
- `preview/` — one HTML card per design decision. Good for "what does a button look like?" "what's the heading scale?"
- `../brand/brand-decisions.md` — the locked single source of truth (v1.1). If this skill and the spec disagree, the spec wins.

## The four signatures (always present on brand)

1. **Italic "The"** before "STR Ledger" — Cormorant Garamond italic 400.
2. **Gold period** at the end of every display headline — `color: var(--brand-gold)`.
3. **48px gold rule** (`<GoldRule/>`) under headlines to separate eyebrow from body.
4. **Tracked uppercase mono** for eyebrows, SKUs, category labels — `letter-spacing: 0.22em`.

If you ship a piece without at least three of these, it's not on brand.

## The Sarah test

Every copy and design choice resolves against Semi-Pro Sarah — 38–55, runs 3–10 STR properties, HHI $200K+, treats rentals as a real business. The test: *"Would Sarah forward this to her CPA without embarrassment?"* If no, rewrite.

## Output format

If the user asks for visual artifacts (slides, mocks, throwaway prototypes), write standalone HTML files that link `colors_and_type.css` and load the atoms via `<script type="text/babel" src=".../atoms.jsx">`. Copy assets out of this folder into the project that consumes them — don't reference across projects.

If the user is working on production code, lift the tokens from `colors_and_type.css` and the component patterns from the JSX files. Adapt to their framework.

## If the user gives you no direction

Ask what they want to build. Likely answers: a landing page, a product page, a blog post template, a Pinterest pin, an email, an Etsy listing mockup, an Excel-style preview, a pitch slide. Then ask three clarifying questions — audience, surface, any copy already written — and then build. Always start by opening the nearest match in `ui_kits/` or `preview/` and adapting, rather than designing from scratch.
