# strhost.tools — REQUIREMENTS

Derived from [design spec](../docs/superpowers/specs/2026-05-05-strhost-tools-design.md). Each requirement is verifiable post-execution.

---

## R1 — Seven calculators ship

Each calculator is a hydrated TSX island with pure logic in `src/lib/calc/<tool>.ts`. Math is 100% unit-tested in isolation.

| ID | Tool | Primary keyword | Route |
|----|------|-----------------|-------|
| R1.1 | Airbnb fee calculator | "airbnb fee calculator" | `/airbnb-fee-calculator` |
| R1.2 | STR profitability calculator | "airbnb profit calculator" | `/profit-calculator` |
| R1.3 | Cleaning fee calculator | "airbnb cleaning fee calculator" | `/cleaning-fee-calculator` |
| R1.4 | Occupancy + ADR + RevPAR | "revpar calculator" | `/revpar-calculator` |
| R1.5 | Break-even occupancy | "airbnb break even calculator" | `/break-even-calculator` |
| R1.6 | Co-host split | "airbnb cohost split" | `/cohost-split-calculator` |
| R1.7 | Lodging tax (50 state pages) | "airbnb lodging tax [state]" | `/lodging-tax/[state]` |

**Verification:** Each calculator returns correct math for golden-input cases (Vitest) and renders without error in Chromium (Playwright smoke).

---

## R2 — Per-tool page template

Every calculator page renders the canonical 12-element layout: H1+lede, calculator (above fold), in-content ad, "How it works", inline email capture, "How to use", FAQ, STR Ledger CTA, footer ad, related calculators, FunnelBand, footer.

**Verification:** DOM presence test per calculator page confirms all 12 sections render in order.

---

## R3 — URL state + share + print

- Inputs serialize to URL params; on input change, `history.replaceState` after 200ms debounce
- On page load, parse params and seed inputs (fall back to per-tool defaults)
- Defaults rendered server-side so first paint is useful pre-JS and indexable
- "Copy share link" button writes current URL to clipboard
- "Print" button calls `window.print()`; `print.css` hides chrome/ads, keeps inputs+results+footer

**Verification:** Playwright test confirms URL updates on input, params re-seed inputs on reload, print stylesheet hides chrome.

---

## R4 — 50-state lodging-tax system

- Data source: `src/data/lodging-tax-by-state.json` (state code → name, stateRate, platformCollects, localAddOnRange, sourceUrl, lastVerified, notes)
- 50 programmatic pages via `getStaticPaths` over the JSON
- Per-state narrative MDX in `src/content/states/<state>.mdx`
- Index page at `/lodging-tax/` is a sortable 50-row table
- Annual-review script flags entries with `lastVerified` older than 12 months

**Verification:** Build produces 50 `/lodging-tax/<state>/` HTML files; index lists all 50; audit script outputs status for each.

---

## R5 — Brand layer

- Tokens ported from `Excel-Templates/design-system/colors_and_type.css` into `src/styles/tokens.css`
- Tailwind theme extends from tokens
- Type stack: Inter (UI/body/headings), Cormorant Garamond (landing H1, blog headings, state narrative h2 only), JetBrains Mono (every number, all calculator I/O)
- Wordmark: "strhost.tools" set in Inter Tight Semibold
- Numbers use `font-variant-numeric: tabular-nums`

**Verification:** Computed styles on a calculator result match token values; visual snapshot matches reference.

---

## R6 — Monetization layer

- `<AdSlot location="in-content" />` and `<AdSlot location="footer" />` — pre-AdSense renders transparent placeholder; one config flag swaps to live `<ins class="adsbygoogle">`
- `<EmailCaptureCard magnet="..." />` inline, content-styled, posts to ESP API directly from client; UTM-tagged by tool slug
- `<STRLedgerCTA tool="..." />` one per page, deep-links with `?utm_source=strhost-tools&utm_medium=cta&utm_content=<tool>`
- `<FunnelBand />` thin co-branded band above footer
- **Forbidden:** popups, exit-intent, sticky ads, repeated CTAs

**Verification:** Each component renders, AdSlot config flag flips behavior, UTM tags correct, no popup/sticky element exists.

---

## R7 — SEO + analytics

- `astro-seo` per page, canonical URL set
- Per-page OG images generated at build via Satori → `public/og/<route>.png`
- `sitemap.xml` via `@astrojs/sitemap`; `robots.txt` static
- JSON-LD: `Organization` (site-wide), `WebApplication` (per tool), `FAQPage` (per tool), `Article` (per blog)
- GA4 with cross-domain measurement to thestrledger.com
- Custom events: `calculator_input_changed`, `share_link_copied`, `print_triggered`, `email_captured`, `str_ledger_cta_clicked`, `state_selected`
- Plausible as optional secondary (config toggle)

**Verification:** Lighthouse SEO ≥ 95 on each calculator; OG image files exist for each route; JSON-LD validates.

---

## R8 — Build, CI, deploy

- GitHub Actions: typecheck → vitest → playwright smoke → build → deploy
- Deploy preview per PR
- Production deploy gated on green CI
- FTP deploy to Hostinger Business shared hosting; Hostinger CDN bundled

**Verification:** Push to `main` produces a deployed dist on Hostinger; CI workflow visible green; deploy preview URL works.

---

## R9 — Performance

- Calculator islands hydrate `client:load` only (no eager bundle for non-calculator pages)
- First paint of calculator page renders SSR defaults; no blank state pre-JS
- Lighthouse Performance ≥ 90 on a calculator page (mobile)

**Verification:** Lighthouse mobile run on each tool page.

---

## R10 — Accessibility

- All calculator inputs have associated labels
- Color contrast ≥ AA on body text and number outputs
- Tab order linear and logical; focus rings visible
- `aria-live="polite"` on calculator result region

**Verification:** axe-core run via Playwright on each calculator page; zero serious violations.
