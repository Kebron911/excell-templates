# strops.tools — PROJECT

**Status:** Active
**Started:** 2026-05-05
**Owner:** Daniel Harrison
**Cluster position:** Operations (running) — third stop in the four-site STR cluster

---

## Mission

Free-tools website for active short-term rental operators — turnover, dispatch, smart-lock codes, par levels, restock, damage cost lookup, maintenance schedules. **Email-list-first** monetization (3 lead magnets) + soft affiliate (smart locks, noise monitors, PMS, cleaning marketplaces) + ad revenue + soft funnel into The STR Ledger.

**Position:** "Free tools for active short-term rental operators."

**What this is not:** Not a property-management SaaS. Not a CRM. Not a replacement for OwnerRez/Hostfully/Hospitable — it complements them.

---

## Locked decisions

ADR-equivalent. Source: [design spec §4](../docs/superpowers/specs/2026-05-05-strops-tools-design.md).

<decisions>

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Tech stack | **Astro 4.x, static output** — *inherits from strhost.tools* | Identical foundation across cluster |
| 2 | Brand relationship | **Sister sub-brand, ops-utility green-gray accent** | Operational, not flashy |
| 3 | Programmatic data | **`tasks.json` (~30 maintenance) + `items.json` (~50 replacements)** | Hand-compiled, annual review, mirrors strhost state-tax pattern |
| 4 | PDF generation | **Browser-side `pdf-lib`** | Cleaner SOP, dispatch sheet, maintenance schedule, .ics export — no server required |
| 5 | Lead magnets | **Three at launch** | Cleaner SOP / Maintenance Checklist / Supply Par-Level Sheet — each tool matched to its magnet |
| 6 | Calculator UX | **Live updates + URL state + print** — *inherits from strhost.tools* | Identical contract across cluster |
| 7 | Monetization density | **Email-first, balanced ads, soft affiliate** | Ops audience is sophisticated; hard sells tank trust. Affiliate placements only after value |
| 8 | Deploy target | **Hostinger Business shared hosting** — *inherits from strhost.tools* | Same as cluster |
| 9 | CSS / type / test stack | **Tailwind + tokens + Vitest + Playwright + pnpm** — *inherits from strhost.tools* | Cluster parity |

</decisions>

---

## Cluster-shared contracts (inherited from strhost.tools)

These contracts are defined once in [STRHost-Tools/.planning/REQUIREMENTS.md](../../STRHost-Tools/.planning/REQUIREMENTS.md) and inherited verbatim:

- **Per-tool page template** — canonical 12-element layout (R2). strops extends with **Download PDF button** between calculator and in-content ad (~13 elements; PDF-producing tools only).
- **Brand tokens** (R5) — palette, type stack, JetBrains Mono numerics. strops swaps the accent to ops-utility green-gray.
- **Calculator/generator interaction model** (R3) — URL state, debounced replaceState, share+print, SSR defaults.
- **Monetization primitives** (R6) — AdSlot, EmailCaptureCard, STRLedgerCTA, FunnelBand, ClusterFunnelBlock. **strops adds:** `<AffiliateCard />` (soft, after value) and `<PdfDownloadButton />`.
- **SEO + analytics** (R7) — astro-seo, Satori OG, sitemap, JSON-LD builders, GA4 cross-domain.
- **Build, CI, deploy** (R8) — GitHub Actions → typecheck → vitest → playwright → build → FTP to Hostinger.

---

## Open questions (non-blocking for foundation)

| # | Question | Blocks |
|---|----------|--------|
| 1 | Domain — confirmed `strops.tools`? | Phase 6 (deploy) |
| 2 | ESP — same as strhost.tools? | Phase 4 (lead magnets) |
| 3 | First 5 affiliate vendors — confirm (August/Schlage/RemoteLock, Minut/NoiseAware, Hostfully/Hospitable/OwnerRez, TurnoverBnB/Turno) | Phase 4 (lead magnets + soft affiliate placement) |

---

## Out of scope (Phase 2+)

- Booking calendar integrations (no API auth at launch)
- Multi-user roles / team accounts
- Real-time price scraping
- Mobile app
- Competing on head term "airbnb cleaning" early

---

## Bridge to The STR Ledger

```
strbuyers.tools  → Acquisition (pre-buy)
strhost.tools    → Math (analyzing)
strops.tools     → Operations (running)              [you are here]
strguests.tools  → Guest XP (optimizing)
thestrledger.com → Financial backbone (every stage)
```

Operations CTAs lean toward "Track these costs in The STR Ledger" SKUs (cleaning fees, maintenance reserves, supply par-level cash needs).

---

## Source documents

- **Design spec:** [`docs/superpowers/specs/2026-05-05-strops-tools-design.md`](../docs/superpowers/specs/2026-05-05-strops-tools-design.md)
- **Implementation plan:** [`docs/superpowers/plans/2026-05-05-strops-tools.md`](../docs/superpowers/plans/2026-05-05-strops-tools.md) (36 atomic tasks)
- **Cluster reference:** [`STRHost-Tools/.planning/`](../../STRHost-Tools/.planning/) for shared contracts
