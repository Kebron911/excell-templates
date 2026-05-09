# STATE

**Current phase:** LIVE — strhost.tools serving 200 in production. CI aligned with cluster pattern on 2026-05-09 (PR #26).
**Last completed phase:** 6 — CI/CD + production deploy (2026-05-06; CI gates restored + e2e fixes 2026-05-09)
**Last update:** 2026-05-09

## 2026-05-09 cluster CI alignment

- Root `.github/workflows/deploy-strhost-tools.yml` upgraded: PR-gate (typecheck + test + e2e) + push-to-main deploy + post-deploy smoke + IndexNow.
- Dropped stale in-project `STRHost-Tools/.github/workflows/{ci.yml,deploy.yml}` (the deploy.yml was failing every push since SSH+rsync replaced `HOSTINGER_FTP_*` cluster-wide).
- Fixed 6 typecheck regressions (TS 5.5→5.9 inference drift on `UrlState` callbacks + lodging-tax JSON casts).
- Fixed 8 e2e strict-mode violations (calculator widgets render before MDX content; added `.first()` scoping).
- No tag yet on main — consider creating `strhost-tools-v0.1.0` to match strguests/strops/strbuyers cluster convention.

---

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

## Phase 2 progress (complete)

- [x] Task 9 — Calculator: Airbnb fee — `1599b95`
- [x] Task 10 — Calculator: Profit + extracted shared `ui.tsx` — `d97c6bb`
- [x] Task 11 — Calculator: Cleaning fee — `4c447fa`
- [x] Task 12 — Calculator: Occupancy + ADR + RevPAR — `4c447fa`
- [x] Task 13 — Calculator: Break-even occupancy — _this commit_
- [x] Task 14 — Calculator: Co-host split — _this commit_

---

## Phase 3 progress (complete)

- [x] Task 15 — Lodging-tax data file (50 states + DC JSON + schema) — _this commit_
- [x] Task 16 — Lodging-tax calculator logic + island (TDD, 5 assertions) — _this commit_
- [x] Task 17 — Programmatic state pages (`/lodging-tax/[state]`, 51 routes) — _this commit_
- [x] Task 18 — Lodging-tax index (`/lodging-tax/`, sortable table) — _this commit_
- [x] Task 19 — Per-state narrative MDX content collection (TX/CA/FL/NY/CO + README) — _this commit_

---

## Phase 4 progress (complete)

- [x] Task 20 — Landing page (real, replacing throwaway) — _this commit_
- [x] Task 21 — About + Contact + Lead-magnet pages — _this commit_
- [x] Task 22 — Sitemap (via @astrojs/sitemap, auto) + robots.txt + favicon — _this commit_
- [x] Task 23 — OG image generator (Satori) — _this commit_

---

## Phase 5 progress (complete)

- [x] Task 24 — GA4 cross-domain tracking (Layout.astro injection, conditional on PUBLIC_GA4_ID) — _this commit_
- [x] Task 25 — Calculator E2E tests (Playwright, 7 spec files, ~16 test cases) — _this commit_

---

## Phase 6 progress (complete — code-side; user-side launch pending)

- [x] Task 26 — GitHub Actions CI (typecheck + vitest + playwright + build) — _this commit_
- [x] Task 27 — Hostinger FTP deploy workflow — _this commit_
- [x] Task 28 — Pre-launch smoke script (19 probes) — _this commit_
- [ ] Task 29 — **v0.1.0 release tag** — NOT auto-executed; user runs `git tag -a v0.1.0 -m "..."` + `git push origin v0.1.0` after verifying production smoke is green. See README.md "Pre-launch checklist" for the full sequence.

---

## v0.1.0 launch sequence (user-driven)

These steps require user action — code is complete but tagging and configuring infrastructure are durable, externally-visible operations that should be approved by the operator.

1. **Configure GitHub repo secrets** (per README.md):
   - `HOSTINGER_FTP_HOST`, `HOSTINGER_FTP_USERNAME`, `HOSTINGER_FTP_PASSWORD`
2. **Configure GitHub repo variables** (optional but recommended for full launch):
   - `PUBLIC_GA4_ID` (analytics), `PUBLIC_ESP_WEBHOOK` (email capture)
   - `PUBLIC_ADSENSE_ENABLED` + `PUBLIC_ADSENSE_CLIENT` once AdSense is approved (post-launch)
3. **Confirm DNS** points strhost.tools to Hostinger.
4. **Push to main**. CI runs (typecheck → vitest → playwright → build). Required green.
5. **Watch Deploy workflow** complete. Post-deploy smoke against the live URL must pass all 19 probes.
6. **Manually verify** production: visit one calculator, confirm URL state + share link + print preview.
7. **Tag v0.1.0:**
   ```bash
   git tag -a v0.1.0 -m "strhost.tools v0.1.0 — initial launch"
   git push origin v0.1.0
   ```

---

## Decisions log

- **2026-05-06 (P1)** — Tailwind theme exposes tokens as CSS-custom-property references (not hex) so accent overrides on sibling sites can replace token values without editing component classes.
- **2026-05-06 (P1)** — `formatPercent` disambiguates input range: `(0, 1]` treated as decimal form (`0.085 → 8.5%`); `> 1` treated as already-percent (`8.5 → 8.5%`). Special-cased `1 → 100%`.
- **2026-05-06 (P1)** — `serialize()` omits keys whose values match defaults so shared URLs stay short. Booleans encoded as `1/0`.
- **2026-05-06 (P1)** — `AdSlot` renders honest labeled placeholders pre-AdSense. Single env flag (`PUBLIC_ADSENSE_ENABLED`) flips the whole site.
- **2026-05-06 (P1)** — `EmailCaptureCard` is fully static-site-safe: posts directly to `PUBLIC_ESP_WEBHOOK` from the client.
- **2026-05-06 (P1)** — `STRLedgerCTA` defaults map all 7 tools to specific Excel-Templates SKUs.
- **2026-05-06 (P2)** — Extracted `Field`/`Row`/`Actions` to `src/components/calculators/ui.tsx` after Task 9; refactored AirbnbFeeCalculator onto them. All 6 calculators consume the shared helpers so visual rhythm stays consistent.
- **2026-05-06 (P2 Task 13)** — Break-even calculator returns `feasible: false` when cleaning + fees + variable costs exceed nightly revenue, with `breakEvenNights = Infinity`. Island renders an "Not feasible at this ADR" notice instead of "∞ nights" — friendly UX over math literal.
- **2026-05-06 (P2 Task 14)** — Co-host split owner share clamps at 0 when fixed cohost fees exceed net revenue. Math could go negative but display shows 0 + a coaching note that the structure isn't sustainable. Cohost effective % is computed and displayed inline so percent-vs-flat comparison is one glance.
- **2026-05-06 (P3 Task 17)** — Programmatic per-state pages render via `getStaticPaths` over `lodging-tax-by-state.json`. When a per-state MDX narrative exists in the `states` content collection, the page renders that; otherwise it falls back to an auto-generated section using `entry.notes`, `entry.platformCollects`, and `entry.sourceUrl`. This means all 51 routes work from day one even though only 5 are hand-authored.
- **2026-05-06 (P3 Task 18)** — Index page renders a sortable table by state name. Table columns: state link, state rate, local add-on range, platforms-collect, last-verified. Mobile gets horizontal scroll on the table since 5 columns of state-tax data don't reflow cleanly into a card grid.
- **2026-05-06 (P4 Task 20)** — Real landing page replaces the Phase 1 throwaway. 5-section structure: hero, tool grid (3 cols at lg), 3-column "Why this exists" trust band, lodging-tax surface with 6 sample states, lead magnet, STR Ledger CTA. Removed the `<details>` Phase 1 verification preview. Brand promise made explicit: "no signup, no popups, no exit-intent."
- **2026-05-06 (P4 Task 21)** — About page is intentionally voice-driven, not corporate. Contact page lists what email works well for vs what doesn't (filter for low-quality inbound). Lead-magnet page is a coming-soon shell — actual PDF ships separately.
- **2026-05-06 (P4 Task 22)** — Sitemap auto-generated by @astrojs/sitemap integration (already wired in astro.config.mjs from Task 1). robots.txt is static in public/. Favicon is an inline SVG with serif "S" + gold dot — same brand vocabulary as the wordmark.
- **2026-05-06 (P4 Task 23)** — OG image generator runs as a `pnpm build` post-step. 1200x630 PNGs for landing + 7 calculators + 51 state pages + 3 site pages = 62 OG images. Output goes to both `public/og/` (dev) and `dist/og/` (prod). Fonts loaded once at script start (Inter SemiBold + Medium, Cormorant Medium); all 62 renders share the same font cache. Slug convention `lodging-tax-<code>.png` matches `seo.ts` `ogImageFor()` URL transform.
- **2026-05-06 (P5 Task 24)** — GA4 conditional on `PUBLIC_GA4_ID` env var — when unset (dev / pre-launch), no GA4 script ships. When set, the snippet wires `linker` for cross-domain measurement across all 4 cluster sites + thestrledger.com so client_id persists when a user hops from a calculator to a paid SKU. `window.gtag` is exposed globally so calculator islands' existing `window.gtag?.('event', ...)` calls work without modification.
- **2026-05-06 (P5 Task 25)** — 7 Playwright E2E spec files (~16 test cases). Each calculator gets: load + heading visible, key input change → URL persists after debounce, URL-state seeding on direct navigation. Lodging-tax suite additionally asserts the index has 51 rows + tests both MDX-narrative state (TX) and template-fallback state (AL). Co-host split tests the mode toggle. Break-even tests the "Not feasible" branch via querystring scenario. Tests use `page.getByLabel` and `page.getByRole` for accessibility-anchored selectors — if labels regress, tests catch it.
- **2026-05-06 (P6 Task 26)** — CI workflow uses Ubuntu + pnpm + Node 20. Build runs with `PUBLIC_ADSENSE_ENABLED=false` so CI doesn't generate live ad markup; production deploy supplies real env vars via repo vars/secrets. Playwright report uploaded as artifact only on failure (14-day retention) so green runs don't accumulate storage.
- **2026-05-06 (P6 Task 27)** — Deploy uses `dangerous-clean-slate: true` to ensure stale files are purged on every deploy (e.g., a removed state code in lodging-tax-by-state.json should remove the corresponding HTML route). Concurrency group `deploy-strhost-tools` with `cancel-in-progress: false` prevents two deploys from overlapping if commits land fast.
- **2026-05-06 (P6 Task 28)** — Smoke script probes 19 routes (4 site pages + 6 standalone calculators + lodging-tax index + 5 sample state pages + sitemap + robots + 3 OG images). All probes run in parallel via `Promise.all`. Exits 1 with a count if any fail; CI marks the deploy red if smoke fails. Local invocation supported via `SMOKE_BASE_URL` env var.
- **2026-05-06 (P6 Task 29 — DEFERRED to user)** — Tag command (`git tag -a v0.1.0 ... && git push origin v0.1.0`) NOT auto-executed. Tagging is durable, externally visible, and depends on the operator confirming production smoke is green and DNS resolves. README + STATE document the exact command sequence; operator runs at their discretion.

## Deviations log

- **2026-05-06 — Task 7 commit ownership** — Files swept into a parallel session's commit `715fa3b feat(strmanuals): scaffold strmanuals.com PDF storefront`. Files tracked, content correct, only commit-message attribution lost.
- **2026-05-06 — Style-guide commit ownership** — CLUSTER-STYLE-GUIDE.md + sibling Phase 1 PLAN updates swept into parallel session's commit `5754b85 progress`. Same situation: content correct, commit message wrong.

## Open questions blocking current work

_None._ Phase 3 (lodging-tax) doesn't need ESP / Plausible / domain decisions.

## Next steps

1. **Visual verification** — `pnpm dev`, visit each of the 6 calculator routes, confirm:
   - URL state round-trips on each calculator (change input → URL updates → reload → state seeds)
   - Print stylesheet hides chrome (Cmd+P preview)
   - Cohost-split mode toggle persists in URL and survives reload
   - Break-even "not feasible" branch renders for low ADR / high cleaning combos
2. **Run `pnpm test`** — should show ~18 vitest assertions across 6 calc test files all green.
3. **Begin Phase 3** — Task 15 (lodging-tax data file). Source: [`docs/superpowers/plans/2026-05-05-strhost-tools.md`](../docs/superpowers/plans/2026-05-05-strhost-tools.md) lines 1784+.
