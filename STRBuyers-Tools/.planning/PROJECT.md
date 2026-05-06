# strbuyers.tools — PROJECT

**Status:** Active
**Started:** 2026-05-05
**Owner:** Daniel Harrison
**Cluster position:** Acquisition (pre-buy) — first stop in the four-site STR cluster

---

## Mission

Free-tools website for prospective short-term rental investors making a buy decision. SEO traffic → **affiliate-led monetization** (lender + market-data + furniture vendors) + ad revenue + soft funnel into The STR Ledger.

**Position:** "Free tools for short-term rental investors."

**What this is not:** Not a property listing platform. Not a CRM. Not a competitor to AirDNA or Mashvisor — we link out to them via affiliate.

---

## Locked decisions

ADR-equivalent. Source: [design spec §4](../docs/superpowers/specs/2026-05-05-strbuyers-tools-design.md).

<decisions>

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Tech stack | **Astro 4.x, static output** — *inherits from strhost.tools* | Identical foundation across cluster |
| 2 | Brand relationship | **Sister sub-brand, finance-trust deeper-blue accent** | Distinct from strhost (editorial neutral), strops (utility green), strguests (hospitality warm) |
| 3 | City data | **Hand-compiled JSON, 200 top STR markets** | Mirrors strhost's state-tax pattern; annual review; no live data API at launch |
| 4 | Comp analyzer UX | **Paste-3-listings, no API** | User pastes ADR/occupancy/RevPAR; we compute averages, flag outliers. Differentiated from paywalled competitors |
| 5 | Affiliate infrastructure | **`<AffiliateBlock />` with click logging + UTM + FTC disclosure** | Affiliate is primary monetization — needs first-class component support |
| 6 | Calculator UX | **Live updates + URL state + print** — *inherits from strhost.tools* | Identical contract across cluster |
| 7 | Monetization density | **Affiliate-led, balanced ads** | 1–2 affiliate blocks per tool below results; ad slots same density as strhost |
| 8 | Click logging | **Node.js `/api/click` endpoint + MySQL on Hostinger** | Lightweight Express app (~50 LOC) for attribution; only server component |
| 9 | Deploy target | **Hostinger Business shared hosting** — *inherits from strhost.tools* | Same as cluster |
| 10 | CSS / type / test stack | **Tailwind + tokens + Vitest + Playwright + pnpm** — *inherits from strhost.tools* | Cluster parity |

</decisions>

---

## Cluster-shared contracts (inherited from strhost.tools)

These contracts are defined once in [STRHost-Tools/.planning/REQUIREMENTS.md](../../STRHost-Tools/.planning/REQUIREMENTS.md) and inherited verbatim:

- **Per-tool page template** — canonical 12-element layout (R2). strbuyers extends it with **AffiliateBlock** between "How it works" and email capture (becomes 14 elements).
- **Brand tokens** (R5) — palette, type stack, JetBrains Mono numerics. strbuyers swaps the accent to finance-trust deeper blue.
- **Calculator interaction model** (R3) — URL state, debounced replaceState, share+print, SSR defaults, no localStorage.
- **Monetization primitives** (R6) — AdSlot, EmailCaptureCard, STRLedgerCTA, FunnelBand, ClusterFunnelBlock. **strbuyers adds:** `<AffiliateBlock />`, `<DisclosureBanner />`.
- **SEO + analytics** (R7) — astro-seo, Satori OG, sitemap, JSON-LD builders, GA4 cross-domain, Plausible toggle.
- **Build, CI, deploy** (R8) — GitHub Actions → typecheck → vitest → playwright → build → FTP to Hostinger.

---

## Open questions (non-blocking for foundation)

| # | Question | Blocks |
|---|----------|--------|
| 1 | Domain — confirmed `strbuyers.tools`? | Phase 6 (deploy) |
| 2 | ESP — same as strhost.tools? (ConvertKit / Beehiiv / MailerLite / Mailchimp) | Phase 5 (lead magnet) |
| 3 | MySQL — Hostinger-bundled MySQL acceptable for click log? | Phase 4 (server) |
| 4 | First 10 affiliate vendors — confirm list (Visio, Kiavi, AirDNA, PriceLabs, Mashvisor, Stage by Hand, Minoan, …) | Phase 3 (affiliate registry) |

---

## Out of scope

- Live MLS / Zillow / Redfin data integration (Phase 2 maybe)
- City data beyond 200 launch markets
- Competing on head term "airbnb calculator" early
- User accounts, saved analyses, dashboards

---

## Bridge to The STR Ledger

```
strbuyers.tools  → Acquisition (pre-buy)             [you are here]
strhost.tools    → Math (analyzing)
strops.tools     → Operations (running)
strguests.tools  → Guest XP (optimizing)
thestrledger.com → Financial backbone (every stage)
```

Mechanics: soft footer mention via FunnelBand, contextual STR Ledger CTA per tool, email capture as bridge, GA4 cross-domain, ClusterFunnelBlock on every page.

---

## Source documents

- **Design spec:** [`docs/superpowers/specs/2026-05-05-strbuyers-tools-design.md`](../docs/superpowers/specs/2026-05-05-strbuyers-tools-design.md)
- **Implementation plan:** [`docs/superpowers/plans/2026-05-05-strbuyers-tools.md`](../docs/superpowers/plans/2026-05-05-strbuyers-tools.md) (36 atomic tasks)
- **Cluster reference:** [`STRHost-Tools/.planning/`](../../STRHost-Tools/.planning/) for shared contracts
