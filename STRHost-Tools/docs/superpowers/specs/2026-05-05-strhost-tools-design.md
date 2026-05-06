# strhost.tools — Design Spec

**Status:** Draft for review
**Date:** 2026-05-05
**Owner:** Daniel Harrison
**Cluster:** Math (analyzing) — second stop in the host lifecycle
**Sibling specs:** strbuyers.tools, strops.tools, strguests.tools, Excel-Templates (The STR Ledger)

---

## 1. Purpose & positioning

**strhost.tools** is a free-tools website for short-term rental hosts. It is a calculator site, not a SaaS, not a blog. Tools are the primary product; content is supporting matter.

**Position:** "Free tools for short-term rental hosts."

**Business model:** SEO traffic → ad revenue (AdSense, finance-adjacent CPM) + soft funnel into The STR Ledger (Excel-Templates SKUs).

**What this site is not:**

- Not a SaaS — no databases, no auth, no user accounts, no dashboards
- Not a blog-first property — blog supports tools, not the reverse
- Not a competitor to The STR Ledger — sister property, soft funnel only

---

## 2. Launch cluster — 7 calculators

| # | Tool | Primary keyword | Why this one |
|---|------|-----------------|--------------|
| 1 | Airbnb fee calculator | "airbnb fee calculator" | Highest STR-related search volume; gateway tool |
| 2 | STR profitability calculator | "airbnb profit calculator" | Finance CPM; high-intent buyers |
| 3 | Cleaning fee calculator | "airbnb cleaning fee calculator" | Underserved; hosts genuinely don't know |
| 4 | Occupancy + ADR + RevPAR calculator | "revpar calculator" | 3-in-1; hospitality terminology = SEO moat |
| 5 | Break-even occupancy calculator | "airbnb break even calculator" | Connects to #2; high intent |
| 6 | Co-host split calculator | "airbnb cohost split" | Almost zero competition |
| 7 | Lodging tax calculator (by state) | "airbnb lodging tax [state]" | 50 programmatic landing pages; long-tail moat |

Each tool's sidebar/footer links to the other six.

---

## 3. Site architecture

```
/                            → Landing (lists all tools)
/airbnb-fee-calculator
/profit-calculator
/cleaning-fee-calculator
/revpar-calculator
/break-even-calculator
/cohost-split-calculator
/lodging-tax/                → Index of 50 states
/lodging-tax/[state]         → 50 programmatic pages
/blog/[slug]                 → Supporting MDX content
/about
/contact
/get-the-pdf                 → Lead magnet landing
```

---

## 4. Decisions log (resolved)

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Tech stack | **Astro 4.x, static output** | Built for content + interactive islands; first-class programmatic routes for the 50 state pages; OG image generation via Satori; embed widgets ship as standalone bundles later |
| 2 | Brand relationship | **Sister sub-brand** | Same palette as The STR Ledger; Inter promoted to primary, Cormorant Garamond demoted to accent; JetBrains Mono for all numbers; co-branded "Built by The STR Ledger" footer band |
| 3 | State tax data | **Hand-compiled JSON, state-level only, with disclaimer** | One-time research effort, annual review; honest, defensible, won't break; city-county overrides deferred to Phase 2 |
| 4 | Embed widgets | **Defer to Phase 2** | Architect calculators as self-contained Astro islands so widget extraction is mechanical later; ship the 7 calculators + 50 state pages first |
| 5 | Calculator UX | **Live updates + URL state + print** | URL params encode every input; results are shareable, bookmarkable, indexable; server-rendered defaults so first paint is useful pre-JS; `@media print` for PDF/save |
| 6 | Monetization density | **Balanced** | One in-content ad after "How it works"; one footer ad before related calculators; one inline email-capture card; one contextual STR Ledger CTA below FAQ; co-branded footer band; **zero popups, zero exit-intent, zero sticky ads** |

---

## 5. Tech & repo

- **Astro 4.x**, static output, no SSR runtime
- **TypeScript** for calculator logic; Astro components for chrome
- **Tailwind** for styling; tokens mirror Excel-Templates' `colors_and_type.css`
- **Vitest** for calculator unit tests
- **Playwright** for one smoke test per calculator
- **pnpm** workspace inside `STRHost-Tools/`
- **Deploy target:** Hostinger Business shared hosting (already provisioned). Static `dist/` deployed via Git push or FTP. Bundled Cloudflare CDN enabled for cache + TTFB.

---

## 6. Project layout

```
STRHost-Tools/
├── src/
│   ├── pages/
│   │   ├── index.astro                      # Landing
│   │   ├── airbnb-fee-calculator.astro
│   │   ├── profit-calculator.astro
│   │   ├── cleaning-fee-calculator.astro
│   │   ├── revpar-calculator.astro
│   │   ├── break-even-calculator.astro
│   │   ├── cohost-split-calculator.astro
│   │   ├── lodging-tax/
│   │   │   ├── index.astro                  # 50-state index
│   │   │   └── [state].astro                # getStaticPaths from JSON
│   │   ├── blog/[...slug].astro             # MDX content collection
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   └── get-the-pdf.astro                # Lead magnet landing
│   ├── components/
│   │   ├── chrome/         # Header, Footer, Sidebar, FunnelBand
│   │   ├── ui/             # Button, Input, Card, FAQ (atoms)
│   │   ├── ads/            # AdSlot (renders or no-ops pre-approval)
│   │   ├── funnel/         # EmailCaptureCard, STRLedgerCTA
│   │   └── calculators/    # One island per calculator (.tsx, hydrated)
│   ├── lib/
│   │   ├── calc/           # Pure functions per calculator (unit-tested)
│   │   ├── url-state.ts    # Parse/serialize URL params, debounced replaceState
│   │   ├── format.ts       # Currency, percent, monospace numerals
│   │   └── seo.ts          # Schema.org JSON-LD builders
│   ├── content/
│   │   ├── blog/           # MDX posts
│   │   ├── tools/          # Per-tool copy (intro, how-it-works, FAQ) as MDX
│   │   └── states/         # Per-state lodging-tax narrative MDX
│   ├── data/
│   │   ├── lodging-tax-by-state.json
│   │   └── tools.json      # SKU registry for cross-links + sitemap
│   ├── styles/
│   │   ├── tokens.css      # Ported from Excel-Templates colors_and_type.css
│   │   └── print.css
│   └── og/                 # Satori-based OG image generator
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └── pdf/                # Lead-magnet PDFs
├── tests/
│   ├── calc/               # Vitest unit tests
│   └── e2e/                # Playwright smoke
├── astro.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 7. Per-tool page template (canonical layout)

The brief specifies seven content sections: H1 + lede, calculator, "How it works," "How to use," FAQ, related calculators, with a 1,500–2,000 word target. The full render order — content sections interleaved with monetization slots and chrome — is:

1. **H1 + 2-sentence lede** — what it does, who it's for
2. **The calculator** (above the fold) — hydrated island
3. *In-content ad slot* — only after value has been delivered
4. **"How it works"** (≈300 words) — formulas, definitions, where rates come from
5. *Email-capture card* — inline, content-styled, ~80px tall (no popup)
6. **"How to use this calculator"** — numbered steps
7. **FAQ** — 5–7 questions, marked up with `FAQPage` schema
8. *Contextual STR Ledger CTA* — one button, copy varies by tool
9. *Footer ad slot* — before related calculators
10. **Related calculators** — cards linking to the other 6 (sidebar on desktop, footer cards on mobile)
11. *Funnel band* — thin co-branded "Built by The STR Ledger →"
12. *Footer* — nav, social, legal, last-updated date

**Bold** = content section (counts toward word-count target). *Italic* = monetization or chrome (does not count).

**Word-count target:** 1,500–2,000 words per page across the bolded sections (lede + "How it works" + "How to use" + FAQ + related-card copy).

**Schema.org:** `WebApplication` (per tool) + `FAQPage` (per page).

---

## 8. Calculator interaction model

- One TSX component per calculator under `src/components/calculators/`, hydrated with `client:load`
- Pure logic in `src/lib/calc/<tool>.ts` — input record → result record
- **Calculator components contain no math.** They bind inputs, call the pure function, render results. Math is 100% unit-testable in isolation.
- URL state via `lib/url-state.ts`:
  - On input change, debounce 200ms, call `history.replaceState` with new params
  - On page load, parse URL params and seed inputs (fall back to per-tool sensible defaults)
  - Defaults are also rendered server-side, so first paint is useful and indexable pre-JS
- Numbers render in JetBrains Mono with `font-variant-numeric: tabular-nums`; currency formatted via `Intl.NumberFormat`
- Two action buttons under every calculator: **Copy share link** (clipboard) and **Print** (`window.print`); `print.css` hides chrome and ads, keeps inputs + results + footer
- No localStorage, no accounts, no save state

---

## 9. State-tax page system

**Data shape — `src/data/lodging-tax-by-state.json`:**

```json
{
  "tx": {
    "name": "Texas",
    "stateRate": 0.06,
    "platformCollects": ["airbnb", "vrbo"],
    "localAddOnRange": [0, 0.085],
    "sourceUrl": "https://comptroller.texas.gov/...",
    "lastVerified": "2026-05-05",
    "notes": "Texas Hotel Occupancy Tax. Cities/counties may add up to 8.5%."
  }
}
```

- Per-state narrative copy lives in `src/content/states/<state>.mdx` (frontmatter pulls JSON entry by code)
- `[state].astro` runs `getStaticPaths` over JSON; renders the standard tool template + a state-specific calculator island that pre-loads that state's rate, disclaimer, and source link
- Index page `/lodging-tax/` is a sortable table of all 50 states (clickable rows → state pages)
- Annual review process: a `lastVerified` audit script flags entries older than 12 months

---

## 10. Monetization layer

- **`<AdSlot location="in-content" />` and `<AdSlot location="footer" />`** — pre-AdSense approval, render transparent placeholders with `data-ad-slot` attributes; post-approval, swap in `<ins class="adsbygoogle">` markup. **One config flag flips the whole site.**
- **`<EmailCaptureCard magnet="str-host-income-report-2026" />`** — inline, content-styled, posts to ESP API directly from client (Astro stays static). UTM-tagged by tool slug.
- **`<STRLedgerCTA tool="profit-calculator" />`** — one per page, copy varies by tool, deep-links to matching SKU on thestrledger.com with `?utm_source=strhost-tools&utm_medium=cta&utm_content=<tool>`.
- **`<FunnelBand />`** — thin co-branded band above footer, "Built by The STR Ledger →"
- **Forbidden:** popups, exit-intent, sticky ads, repeated CTAs

---

## 11. Brand layer

- Tokens ported from Excel-Templates `design-system/colors_and_type.css` into `tokens.css` + Tailwind theme
- **Type stack:**
  - **Inter** — primary UI, body, headings on tool pages
  - **Cormorant Garamond** — H1 on landing, blog post headings, state-page narrative h2s only
  - **JetBrains Mono** — every number on every page; all calculator I/O; code blocks
- **Wordmark:** "strhost.tools" set in Inter Tight Semibold (own variant; not the STR Ledger lockup)
- **Color:** identical palette to The STR Ledger; calculator surfaces use lighter neutrals so numbers pop
- **Co-branded lockup:** "Built by The STR Ledger" for the FunnelBand, sourced from Excel-Templates' brand assets

---

## 12. SEO + analytics layer

- `astro-seo` for `<head>` + canonical
- Per-page **OG images** generated at build via Satori (`src/og/build.ts`) into `public/og/<route>.png`
- `sitemap.xml` via `@astrojs/sitemap`
- `robots.txt` static, points at sitemap
- **JSON-LD:** `Organization` (site-wide), `WebApplication` (per tool), `FAQPage` (per tool), `Article` (per blog post)
- **Internal linking:** every tool sidebar links to the other 6; every state page links back to `/lodging-tax/` index and the main lodging-tax calculator
- **GA4** with cross-domain measurement enabled to thestrledger.com
- **Custom events:** `calculator_input_changed` (debounced), `share_link_copied`, `print_triggered`, `email_captured`, `str_ledger_cta_clicked`, `state_selected`
- **Plausible** as an optional privacy-friendly secondary (one config toggle)

---

## 13. Open questions — pending user decision

These do **not** block writing the implementation plan, but should be answered before the plan executes:

1. **Domain** — confirmed `strhost.tools`, or still under consideration?
2. **ESP** — which email service powers the lead-magnet form? (ConvertKit, Beehiiv, MailerLite, Mailchimp, other?) Should match Excel-Templates' IS import flow if that already exists.
3. ~~**Hosting**~~ → **Resolved 2026-05-05: Hostinger Business shared hosting** (already provisioned). Bundled Cloudflare CDN enabled. Performance signal monitoring on launch — if Core Web Vitals regress, edge hosting is the upgrade path.
4. **Analytics** — GA4 only, or GA4 + Plausible?

---

## 14. Build, deploy, ops

- CI: GitHub Actions — typecheck, vitest, playwright smoke, build
- Deploy preview per PR
- Production deploy gated on green CI
- Domain registration status: confirm before deploy

---

## 15. Distribution plan (per brief; tracked separately from implementation)

- Reddit: r/airbnb_hosts, r/AirBnB, r/realestateinvesting (answer first, link second)
- Facebook STR host groups
- BiggerPockets forum
- Twitter/X "I built a free X calculator" launches
- Outreach to 20 STR bloggers/YouTubers for embed widgets (Phase 2)

---

## 16. Defensibility moves

1. **State tax pages** — programmatic, hard to copy at scale (this spec)
2. **Embeddable widgets** — every embed = backlink (Phase 2)
3. **Annual data report** — "STR Host Income Report 2026" → press + backlinks (also serves as lead magnet)
4. **Lead magnet PDF** → email list → recurring traffic (this spec)
5. **First to update** when Airbnb changes fees → news traffic (operational, post-launch)

---

## 17. Out of scope (explicitly skipping)

- Embed widgets (Phase 2)
- City/county-level tax overrides (Phase 2)
- Mobile app
- User accounts, saved calculations, dashboards, charts
- Blog content beyond ~3 launch posts
- Real PDF lead magnet (stub at launch; full report is a separate content effort)
- Competing on the head term "airbnb calculator" early — target long-tail first

---

## 18. Bridge to The STR Ledger + cluster

```
strbuyers.tools  → Acquisition (pre-buy)
strhost.tools    → Math (analyzing)              [you are here]
strops.tools     → Operations (running)
strguests.tools  → Guest XP (optimizing)
thestrledger.com → Financial backbone (every stage)
```

Mechanics:

1. Soft footer mention via `<FunnelBand />`
2. One contextual `<STRLedgerCTA />` per relevant tool, below the fold, after value delivered
3. Email capture as the bridge — lead magnet → list → nurture into STR Ledger SKUs
4. GA4 cross-domain analytics across all five properties for cluster attribution
5. **`<ClusterFunnelBlock currentCluster="math" />`** on every page — links to strbuyers, strops, strguests
6. Shared blog content allowed; host on whichever domain has stronger SEO authority over time

**Build order (per the strategic recommendation):**

1. **strhost.tools** — Math first (already planned)
2. **strguests.tools** — Guest XP second (fastest to ship, social distribution, low competition)
3. **strops.tools** — Operations third (email list + recurring traffic)
4. **strbuyers.tools** — Acquisition last (highest revenue but most competition + data costs)
