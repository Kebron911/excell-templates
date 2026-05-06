# strbuyers.tools — Design Spec

**Status:** Draft for review
**Date:** 2026-05-05
**Owner:** Daniel Harrison
**Cluster:** Acquisition (pre-buy) — first stop in the host lifecycle
**Sibling specs:** strhost.tools, strops.tools, strguests.tools, Excel-Templates (The STR Ledger)

---

## 1. Purpose & positioning

**strbuyers.tools** is a free-tools website for people researching whether to buy a short-term rental property. It is the highest-intent surface in the entire STR niche — someone running a DSCR calculator is buying within 90 days.

**Position:** "Free tools for STR property buyers."

**Business model:** SEO + ad revenue + **high-ticket affiliate revenue** (DSCR lenders $200–500/lead, STR data software, insurance, furniture). Affiliate is primary; ads secondary.

**What this site is not:**

- Not generic real-estate calculators (specifically STR-focused)
- Not a SaaS — no databases, no auth, no user accounts
- Not a lead-gen funnel that hides results behind a form (results are free; affiliate happens *after* value)

---

## 2. Launch cluster — 7 calculators

| # | Tool | Primary keyword | Why this one |
|---|------|-----------------|--------------|
| 1 | STR mortgage qualifier (DSCR) | "dscr loan calculator str" | Pre-buy financial gate; lender affiliate $200–500/lead |
| 2 | Down payment calculator (by loan type) | "airbnb down payment calculator" | Multi-loan-type comparison: conventional, DSCR, second home, FHA |
| 3 | Comp analyzer (paste 3 listings) | "airbnb comp analyzer" | Differentiated UX; no API needed; viral potential |
| 4 | Market score tool | "is airbnb profitable in [city]" | 200+ programmatic city pages |
| 5 | Cash-on-cash return calculator | "airbnb cash on cash" | Finance CPM; ROI projection |
| 6 | Year 1 cash needs calculator | "airbnb startup cost calculator" | Underserved; high-specificity long-tail |
| 7 | Furnishing budget calculator | "airbnb furnishing budget" | Furniture affiliate (Stage by Hand, Minoan) |

Each tool's sidebar/footer links to the other six.

---

## 3. Site architecture

```
/                             → Landing (lists all tools)
/dscr-calculator
/down-payment-calculator
/comp-analyzer
/market-score
/cash-on-cash-calculator
/year-1-cash-needs
/furnishing-budget
/cities/                      → Index of 200+ markets
/cities/[city]                → 200+ programmatic pages
/blog/[slug]                  → Supporting MDX content
/about
/contact
/get-the-pdf                  → Lead magnet landing
/disclosures                  → FTC affiliate disclosure
```

---

## 4. Decisions log (resolved)

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Tech stack | **Astro 4.x, static output** | Inherits from strhost.tools |
| 2 | Brand relationship | **Sister sub-brand with finance-trust accent** | Same palette family as STR Ledger; distinct accent (deeper blue) signals "money/buying" vs strhost.tools' editorial neutral |
| 3 | City data | **Hand-compiled JSON, 200 top STR markets** | Mirror state-tax pattern; annual review; no live data API at launch |
| 4 | Comp analyzer UX | **Paste-3-listings, no API** | User pastes ADR/occupancy/RevPAR from any source; we compute averages and flag outliers. Differentiated from competitors who hide behind paywalls. |
| 5 | Affiliate infrastructure | **`<AffiliateBlock />` with click logging + UTM + FTC disclosure** | Affiliate is primary monetization; needs first-class component support |
| 6 | Calculator UX | **Live updates + URL state + print** | Inherits from strhost.tools |
| 7 | Monetization density | **Affiliate-led, balanced ads** | 1–2 affiliate blocks per tool below results; ad slots same density as strhost.tools |

---

## 5. Tech & repo

- **Astro 4.x**, static output
- **TypeScript** for calculator logic
- **Tailwind** for styling; tokens shared with strhost.tools
- **Vitest** for calculator unit tests
- **Playwright** for one smoke test per calculator
- **pnpm** workspace inside `STRBuyers-Tools/`
- **Deploy target:** Hostinger Business shared hosting (already provisioned). Static `dist/` deployed via Git push or FTP. Click-logging Node.js endpoint colocated. Bundled Cloudflare CDN enabled.

---

## 6. Project layout (deltas from strhost.tools)

```
STRBuyers-Tools/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── dscr-calculator.astro
│   │   ├── down-payment-calculator.astro
│   │   ├── comp-analyzer.astro
│   │   ├── market-score.astro
│   │   ├── cash-on-cash-calculator.astro
│   │   ├── year-1-cash-needs.astro
│   │   ├── furnishing-budget.astro
│   │   ├── cities/
│   │   │   ├── index.astro
│   │   │   └── [city].astro
│   │   ├── disclosures.astro            # FTC affiliate disclosure
│   │   ├── blog/[...slug].astro
│   │   ├── about.astro, contact.astro, get-the-pdf.astro
│   ├── components/
│   │   ├── chrome/
│   │   ├── ui/
│   │   ├── ads/
│   │   ├── affiliate/                   # AffiliateBlock, DisclosureBanner, VendorCard
│   │   ├── funnel/                      # EmailCaptureCard, STRLedgerCTA, ClusterFunnelBlock
│   │   └── calculators/
│   ├── lib/
│   │   ├── calc/                        # Pure functions (DSCR, down-payment, COC, etc.)
│   │   ├── affiliate/                   # Link builders, click tracking, UTM
│   │   ├── url-state.ts, format.ts, seo.ts
│   ├── content/
│   │   ├── blog/, tools/, cities/       # Per-city narrative MDX
│   ├── data/
│   │   ├── cities.json                  # 200 entries
│   │   ├── tools.json
│   │   ├── affiliates.json              # Vendor registry: id, url, payout, network, disclosure
│   │   └── loan-types.json              # DSCR/conventional/second-home/FHA params
│   ├── styles/, og/
├── public/
├── tests/
├── astro.config.mjs, etc.
```

---

## 7. Per-tool page template (canonical layout)

The brief's seven content sections are preserved. Full render order — content + monetization + chrome:

1. **H1 + 2-sentence lede**
2. **The calculator** (above the fold)
3. *In-content ad slot*
4. **"How it works"** (≈300 words, the math/formulas)
5. ***AffiliateBlock — matched products*** *(NEW for this cluster: vendor cards with FTC disclosure inline; ~140px tall)*
6. *Email-capture card*
7. **"How to use this calculator"**
8. **FAQ** (5–7 questions, FAQPage schema)
9. *Contextual STR Ledger CTA*
10. *Footer ad slot*
11. **Related calculators**
12. *Cluster funnel block — links to strhost.tools, strops.tools, strguests.tools*
13. *Funnel band — "Built by The STR Ledger →"*
14. *Footer*

**Word-count target:** 1,500–2,000 words across bolded sections.

**Schema.org:** `WebApplication` + `FAQPage` per tool.

---

## 8. Calculator interaction model

Same as strhost.tools (live updates + URL state + print). Cluster-specific notes:

- **DSCR calculator** — outputs DSCR ratio + lender-tier thresholds (e.g., "qualifies for Visio's 1.0+ DSCR program") — these tier labels link to the matched lender's affiliate URL.
- **Comp analyzer** — accepts 3 pasted listings; outputs averages, std-dev, and flags outliers. URL state encodes the 3 listings as compressed params (still shareable).
- **Market score tool** — input city → fetches from `cities.json` at build time → renders score card. Pre-rendered for the 200 cities; on `/market-score` standalone page, falls back to a search-and-redirect UX.

---

## 9. City page system

**Data shape — `src/data/cities.json` (excerpt):**

```json
{
  "austin-tx": {
    "name": "Austin",
    "state": "TX",
    "regulationStatus": "restricted",
    "regulationNotes": "Type 2 STR licensing required; capped citywide.",
    "avgADR": 245,
    "occupancyEstimate": 0.62,
    "saturationTier": "high",
    "saturationListings": 11200,
    "sourceUrls": ["https://..."],
    "lastVerified": "2026-05-05"
  }
}
```

- Per-city narrative copy lives in `src/content/cities/<slug>.mdx`
- `[city].astro` runs `getStaticPaths` over JSON
- Index page `/cities/` is a sortable table (by saturation, regulation, ADR)
- Annual review process via `lastVerified` audit script

**Data sourcing:** Public-domain compilation from city ordinances + AirDNA's free public data tiers + manual research. **Open question:** licensing path — see §13.

---

## 10. Monetization layer

**Affiliate (primary):**

- **`<AffiliateBlock vendor="visio" tool="dscr-calculator" />`** — renders 1–3 vendor cards with FTC disclosure label, click tracking endpoint, UTM tagging. Vendor data lives in `data/affiliates.json`.
- **Per-tool vendor matchups (default config):**
  - DSCR calculator → Visio, Kiavi
  - Down payment / cash-on-cash → DSCR lenders + STR insurance
  - Comp analyzer / market score → AirDNA, PriceLabs, Mashvisor
  - Year 1 cash needs → STR insurance + furniture
  - Furnishing budget → Stage by Hand, Minoan
- **FTC disclosure** — visible disclosure inline on every page that contains an AffiliateBlock; full `/disclosures` page linked from footer.
- Click logging via lightweight `/api/click` Node.js endpoint on Hostinger writing to MySQL for attribution. Single shared Node app can serve `/api/click` for this site (ESM, ~50 LOC).

**Email capture:**

- `<EmailCaptureCard magnet="str-buyers-due-diligence-checklist-2026" />`
- Lead magnet: "STR Buyer Due-Diligence Checklist 2026" (PDF). Stub at launch.

**STR Ledger funnel:**

- `<STRLedgerCTA tool="dscr-calculator" />` — copy varies by tool; deep-links to matching SKU on thestrledger.com.

**Cross-cluster funnel:**

- `<ClusterFunnelBlock currentCluster="acquisition" />` — links to strhost.tools, strops.tools, strguests.tools with one-line value prop each.

**Ads:**

- Same `<AdSlot location="in-content" />` and `<AdSlot location="footer" />` pattern as strhost.tools. AdSense flag flips post-approval.

**Forbidden:** popups, exit-intent, sticky ads, repeated CTAs.

---

## 11. Brand layer

- Tokens shared with strhost.tools and Excel-Templates
- **Accent color:** finance-trust deeper blue (vs strhost.tools' editorial neutral) — signals "buying decision"
- Type stack identical: Inter primary, Cormorant accent, JetBrains Mono numbers
- Wordmark: "strbuyers.tools" in Inter Tight Semibold
- Co-branded "Built by The STR Ledger" lockup in funnel band

---

## 12. SEO + analytics layer

Same stack as strhost.tools:

- `astro-seo`, per-page Satori OG images, sitemap, robots
- JSON-LD: `Organization`, `WebApplication` per tool, `FAQPage` per page, `Article` per post, **`Place` per city page** (city schema)
- GA4 with cross-domain measurement to thestrledger.com **and the other three tool sites** (cluster attribution)
- Custom events: standard set + `affiliate_click`, `affiliate_impression`, `vendor_match_shown`, `cluster_link_clicked`

---

## 13. Open questions — pending user decision

1. **Domain** — confirmed `strbuyers.tools`?
2. **Affiliate vendors** — which to prioritize for sign-up first?
   - Lenders: Visio, Kiavi, Lima One?
   - Insurance: Proper, Steadily?
   - Software: AirDNA, PriceLabs, Mashvisor?
   - Furniture: Stage by Hand, Minoan?
3. **City data licensing** — public-domain compilation acceptable, or pursue AirDNA partnership for richer datasets?
4. **ESP** — same as strhost.tools? (assumed yes, unify across clusters)
5. ~~**Click logging endpoint**~~ → **Resolved 2026-05-05: Node.js endpoint on Hostinger writing to MySQL** (included in Business plan).

---

## 14. Build, deploy, ops

- CI: GitHub Actions
- Deploy preview per PR
- Hostinger Business shared hosting. Static Astro `dist/` deployed via Git push or FTP to subdomain directory.
- One Node.js endpoint (Hostinger Apps) serves `/api/click` and writes to MySQL.
- Bundled Cloudflare CDN enabled for cache + TTFB
- Domain registration: confirm before deploy

---

## 15. Distribution plan

- BiggerPockets forum (acquisition audience lives there)
- Reddit: r/AirBnB_hosts, r/realestateinvesting, r/AirBnB, r/StrInvesting
- DSCR-loan Twitter/X (active community)
- Outreach to STR-investing YouTubers — free embeddable DSCR calculator (Phase 2)
- Pinterest pins for "Is Airbnb profitable in [city]" pages

---

## 16. Defensibility moves

1. **200+ city pages** — programmatic, hard to copy at scale
2. **Embeddable DSCR + comp tools** (Phase 2) — STR-investor blogs love calculator embeds
3. **Annual data report** — "STR Acquisition Market Report 2026" → press + lender partnerships
4. **Lead magnet PDF** — Buyer Due-Diligence Checklist
5. **First to integrate** new DSCR programs as they launch → news traffic

---

## 17. Out of scope (Phase 2+)

- Live AirDNA API integration
- Lender pre-qual form (deeper integration with lender APIs)
- Embeddable widgets
- Cities beyond 200
- Real PDF lead magnet (stub at launch)
- Saved-search / city-watchlist features (would require accounts — explicitly out)

---

## 18. Bridge to The STR Ledger + cluster

```
strbuyers.tools  → Acquisition (pre-buy)         [you are here]
strhost.tools    → Math (analyzing)
strops.tools     → Operations (running)
strguests.tools  → Guest XP (optimizing)
thestrledger.com → Financial backbone (every stage)
```

Every page renders `<ClusterFunnelBlock />` linking the other three tool sites + a `<STRLedgerCTA />` for the financial backbone product.
