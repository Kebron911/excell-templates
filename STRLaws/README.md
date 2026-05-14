# STRLaws — `strlaws.com`

National US short-term-rental regulation database. Programmatic SEO across all 50 states and (at maturity) 500+ cities. AI-driven scrape → extract → diff → publish → alert pipeline.

Part of the STR empire (`Excel-Templates/`). Sister sites: `STRBuyers-Tools`, `STRGuests-Tools`, `STRHost-Tools`, `STROps-Tools`, `STRManuals/site`, `STRLedger`.

## Quick Start

```bash
# From repo root
pnpm install

# Inside STRLaws/
cp .env.example .env.local
# Fill in DB creds + API keys

pnpm db:migrate           # apply MySQL schema
pnpm db:seed              # seed 50 launch cities + state records
pnpm dev                  # Astro dev server on http://localhost:4321
pnpm server:dev           # Express API on http://localhost:3001
pnpm test                 # Vitest unit + integration
pnpm e2e                  # Playwright E2E (requires dev server)
```

## URL Structure

- `/` — national overview + state index + recent-change feed
- `/[state]` — state summary + sortable city table
- `/[state]/[city]` — city deep-dive (permit, tax, occupancy, ban status)
- `/[state]/[city]/history` — change log
- `/alerts` — premium subscription landing
- `/blog/` — auto-generated regulation-change posts
- `/api/v1/*` — premium REST API
- `/legal/sources` — methodology / E-E-A-T page
- `/admin/review` — internal review queue (token-auth)

## Architecture

```
┌───────────────────────────────────────────────────────────────┐
│  Astro static site (Hostinger)                                │
│  ↑ build-time queries → MySQL → render programmatic pages     │
└───────────────────────────────────────────────────────────────┘
                       ▲                        ▲
                       │                        │
┌──────────────────────┴─────────┐  ┌───────────┴──────────────┐
│  Express API server            │  │  n8n workflows           │
│  (Hostinger Node host)         │  │  (Hostinger n8n)         │
│  - alert signup                │  │  - scrape-city-sources   │
│  - Stripe webhook              │◀─┤  - extract-ordinance     │
│  - /api/v1 (premium)           │  │  - detect-changes        │
│  - /admin/review               │  │  - auto-publish          │
└────────────────────────────────┘  │  - dispatch-alerts       │
                       ▲             └──────────────────────────┘
                       │
                ┌──────┴────────┐
                │  MySQL        │
                │  (Hostinger)  │
                └───────────────┘
```

## Phase Plan

| Phase | Weeks | Deliverable |
|---|---|---|
| 1 | 1 | Foundation: scaffold + schema + 50-city seed + empire shell |
| 2 | 2 | Static templates + SEO surface (schema, OG, sitemap, Lighthouse ≥95) |
| 3 | 3–4 | AI extraction (Claude + tiered scrape + review_queue + admin) |
| 4 | 5 | Diff engine + auto-publish + blog |
| 5 | 6–7 | Alerts (Influencersoft + Resend) + signup UX |
| 6 | 8–12 | Stripe + premium API + scale to 500 + launch |

See [docs/superpowers/specs/2026-05-14-strlaws-design.md](../docs/superpowers/specs/2026-05-14-strlaws-design.md) for the full spec.

## Conventions

- Database: MySQL (empire parity). `mysql2/promise` driver.
- AI: Anthropic SDK only. Prompt caching mandatory on every call.
- Slugs: lowercase kebab-case full names (`utah`, `salt-lake-city`).
- Schema markup: every city + state page ships JSON-LD. Validated in CI.
- Internal linking: 5 geographic neighbors + 3 regulation-similar per city.
- Confidence < 0.85 → review_queue, never published.
- Per-snapshot AI cost ceiling: $0.05.

## What This Site Does NOT Do

- Listing audits → use `STRBuyers-Tools`
- ROI calculators → use `STRHost-Tools`
- Welcome books / guest PDFs → use `STRGuests-Tools`
- Operational checklists → use `STROps-Tools`
- Pricing/yield data → use `STRHost-Tools`

Topical authority requires focus. Don't add scope creep.
