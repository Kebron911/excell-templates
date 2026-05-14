# listingaudit.tools — PROJECT

**Status:** Active
**Started:** 2026-05-14
**Owner:** Daniel Harrison
**Cluster position:** Diagnostic / Optimization — fifth STR site in the empire, sister to strguests (Guest XP), strhost (math), strbuyers (acquisition), strops (operations).

---

## Mission

Free top-of-funnel diagnostic tool for short-term rental hosts. Paste an Airbnb or Vrbo listing URL → instant 0-100 scorecard across 5 dimensions (title, description, photos, amenities, reviews) + top 5 prioritized fixes. Free → email-gated PDF → paid tier (v0.2+). Distribution is viral-first via shareable scorecard images.

**Position:** "Paste your URL — see what's costing you bookings."

**What this is not:** Not a PMS. Not a calculator. Not a content site. Not a directory. Single-purpose audit tool; everything that isn't "paste URL → instant scorecard" belongs on a sister site.

---

## Locked decisions

ADR-equivalent. Source: [plan](../../../../../../../.claude/plans/use-superpowers-to-design-zany-hinton.md).

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Stack & repo | **Astro 6.x in the existing empire pnpm monorepo** | Reuses `@str/ui-chrome`, `@str/email-gate`, Express+MySQL pattern, Hostinger deploy. ~2 phases saved over a Next.js standalone. |
| 2 | Domain | **listingaudit.tools** (own domain, deployed alongside siblings) | Concentrated brand + SEO authority for "airbnb audit" queries. |
| 3 | v0.1 scope | **Free scorecard + email-gated PDF** | Paid tier, white-label, affiliate directory all deferred to v0.2. Thin slice validates the viral funnel first. |
| 4 | Scraping | **Apify Airbnb actor (managed) + JSON-LD pre-parse fallback** | $0.001–0.005/audit. No Playwright on Hostinger shared hosting. Apify maintains anti-bot. |
| 5 | AI provider | **Anthropic Claude — Sonnet 4.5 synth + Haiku 4.5 per-dim, with prompt caching** | Brief specifies Claude. Caching is the budget linchpin (target < $0.10 / audit). |
| 6 | Photos in v0.1 | **Metadata-only score** (count, aspect, cover-photo presence, alt-text hints) | Vision API calls deferred to v0.2 paid tier to protect the $0.10 budget. |
| 7 | Pricing dimension in v0.1 | **Deferred to v0.2** | Requires PriceLabs / AirDNA-equivalent integration. v0.1 ships 5 dims: title, description, photos (metadata), amenities, reviews. |
| 8 | Result page | **MySQL-backed dynamic `/audit/[id]`, share image via Satori+sharp once at audit completion** | Enables viral metrics + affiliate links from the share view. Same pattern as strguests `generation_logs`. |
| 9 | Rate limits | **3 anon/hr (IP-hashed) → 20/day after email verify** | Matches `STRGuests-Tools/server/lib/rate-limit.ts` and the shared `rate_limits` table. Tool slug `audit-listing`. |
| 10 | Brand accent | **Diagnostic teal (#0E7C8C)** | Distinct from strguests terracotta, strhost finance-blue. Reads as "measurement / analytical / trustworthy". |
| 11 | CSS / type / test stack | **Tailwind + tokens + Vitest + Playwright + pnpm** — *inherits from cluster* | Cluster parity. |
| 12 | Deploy target | **Hostinger Business shared hosting** — *inherits from cluster* | Shared `STR_SSH_KEY`. Express server bound to :3002 (strguests has :3001). |

---

## Cluster-shared contracts (inherited from strguests / strhost)

- **Per-page layout** — Same `@str/ui-chrome` Layout + Header + Footer + FunnelBand pattern. The audit-tool-specific surfaces are `/`, `/audit/[id]`, `/audit/cities/[slug]`, `/about`, `/contact`, `/privacy`.
- **Brand tokens** — Navy / parchment / gold base inherited. Accent swapped to diagnostic teal.
- **Monetization primitives** — `@str/email-gate` EmailGate for the full-PDF email gate. `@str/ui-funnel` STRLedgerCTA + ClusterFunnelBlock for cross-site funneling.
- **SEO + analytics** — `astro-seo`, Satori OG, sitemap, JSON-LD, GA4 cross-domain (already includes listingaudit.tools in `Layout.astro` linker config — verify in Phase 6).
- **Build / CI / deploy** — `pnpm -w` workspace, GitHub Actions deploy fork from strguests, post-deploy smoke script.

---

## Open questions (non-blocking for Phase 1)

| # | Question | Blocks |
|---|----------|--------|
| 1 | Apify actor — `tri_angle/airbnb-scraper` vs `dtrungtin/airbnb-scraper` vs ScrapingBee? | Phase 2 |
| 2 | Anthropic API key — single empire key or audit-tool-specific? | Phase 3 |
| 3 | Hostinger MySQL — same instance as strguests (separate schema) or new instance? | Phase 1 deploy |
| 4 | Domain DNS — `listingaudit.tools` registered? Hostinger or Cloudflare? | Phase 6 |
| 5 | Vrbo scraping — Apify Vrbo actor or JSON-LD only? | Phase 2 |
| 6 | Cross-empire footer — does `@str/ui-chrome/Footer.astro` need a `listingaudit.tools` row? | Phase 5 |

---

## Out of scope for v0.1 (parking lot for v0.2+)

- Paid tier (Stripe wiring, deep competitive analysis, AI-rewritten title/description, AI-rewritten headlines, photo retake shot list)
- Photo vision audit (cover quality, sequencing, missing shot types via vision API)
- Pricing dimension with PriceLabs / AirDNA market comp
- Affiliate directory of photographers / copywriters / stagers by city
- White-label tier ($99/mo) for STR coaches with custom logo + exportable client reports
- TikTok / YouTube "I audited 100 listings" video production
- Multi-listing portfolio audits for property managers
- Real-time streaming UI for in-progress audits (poll for v0.1 is fine)

---

## Bridge to The STR Ledger

```
strbuyers.tools     → Acquisition (pre-buy)
strhost.tools       → Math (analyzing)
listingaudit.tools  → Diagnostic (optimizing — pre-listing & post-listing)   [you are here]
strguests.tools     → Guest XP (operating — post-booking)
strops.tools        → Operations (running)
thestrledger.com    → Financial backbone (every stage)
```

Audit Tool users are ~95% active hosts → highest-LTV cross-sell back into strguests. Funnel touchpoints:
- Email nurture day-3: STRGuests-Tools promo
- Result page footer cross-link: "Now optimize the guest experience → strguests.tools"
- Shared cluster footer / empire band (already in `@str/ui-chrome`)

---

## Source documents

- **Plan + design spec:** [.claude/plans/use-superpowers-to-design-zany-hinton.md](../../../../../../../.claude/plans/use-superpowers-to-design-zany-hinton.md)
- **Cluster reference:** [STRGuests-Tools/.planning/](../../STRGuests-Tools/.planning/) — closest sibling pattern
- **Brief (original):** captured in the plan file Context section
