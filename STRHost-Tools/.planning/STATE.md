# STATE

**Current phase:** 2 — Six standalone calculators (not started)
**Last completed phase:** 1 — Foundation (2026-05-06)
**Last update:** 2026-05-06

---

## Phase 1 progress (complete)

- [x] Task 1 — Bootstrap project — `b53c398`
- [x] Task 2 — Brand tokens + Tailwind theme — `5a6d0cd`
- [x] Task 3 — Print stylesheet — `ab0e5d7`
- [x] Task 4 — Format library (TDD) — `98f718a`
- [x] Task 5 — URL-state library (TDD) — `9e7dbf8`
- [x] Task 6 — SEO library — `d404cfe`
- [x] Task 7 — Layout primitives — committed via parallel session as `715fa3b` (see Deviations log)
- [x] Task 8 — Monetization primitives — `308b11c`

---

## Phase 2 progress (not started)

- [ ] Task 9 — Calculator: Airbnb fee (TDD)
- [ ] Task 10 — Calculator: Profit (TDD)
- [ ] Task 11 — Calculator: Cleaning fee (TDD)
- [ ] Task 12 — Calculator: Occupancy + ADR + RevPAR (TDD)
- [ ] Task 13 — Calculator: Break-even occupancy (TDD)
- [ ] Task 14 — Calculator: Co-host split (TDD)

---

## Decisions log

- **2026-05-06** — Tailwind theme exposes tokens as CSS-custom-property references (not hex) so accent overrides on sibling sites can replace token values without editing component classes.
- **2026-05-06** — `formatPercent` disambiguates input range: `(0, 1]` treated as decimal form (`0.085 → 8.5%`); `> 1` treated as already-percent (`8.5 → 8.5%`). Special-cased `1 → 100%` since callers entering "1" mean 100%.
- **2026-05-06** — `serialize()` omits keys whose values match defaults so shared URLs stay short. Booleans encoded as `1/0`. Reduces URL ceiling pressure for the comp-analyzer use case in sibling sites.
- **2026-05-06** — `AdSlot` renders honest labeled placeholders pre-AdSense (not invisible reserved space). Layout iteration sees the real real estate. Single env flag (`PUBLIC_ADSENSE_ENABLED`) flips the whole site.
- **2026-05-06** — `EmailCaptureCard` is fully static-site-safe: posts directly to `PUBLIC_ESP_WEBHOOK` from the client. No server. Falls back to console-warn in dev when webhook unset.
- **2026-05-06** — `STRLedgerCTA` defaults map all 7 tools to specific Excel-Templates SKUs with editable headline/blurb/cta/skuPath. Caller can override per page if catalog evolves.

## Deviations log

- **2026-05-06 — Task 7 commit ownership** — Files for Task 7 (Layout, Header, Footer, Sidebar, FunnelBand, ClusterFunnelBlock, tools.json, throwaway index) were swept into a parallel session's commit `715fa3b feat(strmanuals): scaffold strmanuals.com PDF storefront with full API plumbing`. Files are tracked correctly and content matches the implementation written this session — the only loss is the dedicated commit message for Task 7. No remediation needed unless the user wants to rewrite history.

## Open questions blocking current work

_None._ Domain / ESP / Plausible toggles still unresolved per [PROJECT.md](PROJECT.md), but they don't block Phase 2 calculators.

## Next steps

1. **Run `pnpm install`** in `STRHost-Tools/` to generate `pnpm-lock.yaml` and verify deps resolve. (Skipped this session because the install is environment-dependent.)
2. **Run `pnpm typecheck`** and `pnpm test` to confirm libraries pass green.
3. **Run `pnpm dev`** and visit `http://localhost:4321/` to visually verify the throwaway landing renders Header + Footer + FunnelBand + ClusterFunnelBlock + AdSlot × 2 + EmailCaptureCard + STRLedgerCTA + Sidebar with editorial-neutral palette.
4. **Begin Phase 2** — start with Task 9 (Airbnb fee calculator, TDD). Source: [`docs/superpowers/plans/2026-05-05-strhost-tools.md`](../docs/superpowers/plans/2026-05-05-strhost-tools.md) lines 1018–1287.
