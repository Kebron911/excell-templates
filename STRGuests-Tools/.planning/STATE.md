# STATE

**Current phase:** 2 — Seven generators (PDF + AI)
**Current task:** Not yet started (Task 11: PDF generator #1 — house rules)
**Last update:** 2026-05-06

---

## Phase 1 progress (complete)

- [x] Task 1 — Bootstrap dual-target repo (Astro static + Express)
- [x] Task 2 — Brand tokens with hospitality-warm accent
- [x] Task 3 — Print stylesheet
- [x] Task 4 — Layout primitives
- [x] Task 5 — Monetization primitives (incl. PdfDownloadButton, PinterestPinButton, AiRateLimitNotice)
- [x] Task 6 — URL-state library (TDD)
- [x] Task 7 — Format library (TDD)
- [x] Task 8 — SEO library
- [x] Task 9 — PDF library base (brand header/footer)
- [x] Task 10 — Express server skeleton + MySQL pool + schema migration

---

## Decisions log (Phase 1)

- **Accent palette = terracotta (#C8684C primary).** Reads as "hospitable / warm / welcoming" without sliding into orange or kitsch. 50/100/500/700/900 ramp exposed as `colors.accent.*` in Tailwind + shipped as CSS custom properties (`--accent-500` etc.) so non-Tailwind contexts (PDF, OG image) consume the same tokens.
- **Tailwind utility approach for accent.** Used `text-[color:var(--accent-500)]` arbitrary-value form rather than minting `text-terracotta-500` aliases — avoids drift if the accent ever moves and keeps CSS tokens as single source of truth.
- **Wordmark hierarchy: Brand-name primary + .tld trailing.** Per Cluster Style Guide §1. Cormorant Garamond medium @ 28px reads as editorial-finance + welcoming. Eyebrow + main rejected variant explicitly avoided.
- **Generator-vs-calculator naming.** All component classes / labels / data-* attrs renamed `calculator` → `generator` (`.surface-gen`, `.related-generators`, `.generator-page`, `.generator-preview`).
- **Soft email-gate is non-negotiable.** PdfDownloadButton triggers download FIRST, then opens the email modal. "Skip and download" copy ships verbatim; modal closes on Escape. PDF arrives no matter what.
- **Pinterest pin pipeline split for Phase 1.** PinterestPinButton dispatches a `strguests:pin-ready` CustomEvent and opens the Pinterest intent with the page URL. Real `/api/pin-host` upload + uploaded-URL intent lands in Phase 5 Task 28.
- **Rate-limit UI reads as guidance.** AiRateLimitNotice displays "X of Y generations remaining" rather than red error styling; the verify-email CTA only appears when the visitor is at ≤ 2 unverified generations.
- **MySQL schema choices.** `ip_hash` (sha256(IP+IP_HASH_SALT)) instead of raw IPs; `prompt_hash` instead of raw prompt content in `generation_logs` — keeps log table small + privacy-respecting; utf8mb4_unicode_ci across the board.
- **db.query parameterization is enforced at compile + runtime.** No string-concat path; tests assert via mocked `mysql2/promise` AND a source-scan regex.
- **`@` alias must use `fileURLToPath(new URL('./src', import.meta.url))`** in both vitest.config.ts and astro.config.mjs (cluster-style-guide §10) — the naive `.pathname` approach breaks on Windows.
- **`/api/click` endpoint is NOT in this project.** strhost/strbuyers have it; strguests doesn't (no affiliate click tracking — strguests monetizes via PDF + AI generators + email list, not affiliate hops).

## Deviations log (Phase 1)

_None._ Plan was followed verbatim.

## Open questions blocking Phase 2 / Phase 3

- **OpenAI API key** — needed to wire Task 16 (AI generator endpoint) against the real API. Stub-only OK for Phase 2 PDF tools; must resolve before Phase 3.
- **MySQL on Hostinger Business** — Task 10 schema is in place but the `pnpm db:migrate` run against a real Hostinger Business MySQL instance is unverified. Must confirm sufficient connection-pool quota before Phase 3 server deploy (Task 33).
- **Cleaner SOP / welcome book authorship.** Master-template content is open: host-authored, Daniel-authored, or AI-drafted-then-edited? Affects Phase 5 Task 30 lead-magnet PDF.

## Cluster sequencing

Per the strategic build order: strhost.tools first (✅ Phase 6 complete), **strguests.tools second (Phase 1 ✅)**, strops.tools third, strbuyers.tools fourth.

## Phase 1 verification (run before Phase 2)

```bash
pnpm install
pnpm typecheck    # astro check + tsc + server tsconfig — zero errors
pnpm test         # vitest: format, url-state, pdf/base, server/db
pnpm dev &        # Astro on :4321
pnpm server:dev & # Express on :3001
curl http://localhost:3001/api/health    # {"status":"ok",...}
```

Visit `http://localhost:4321/` once a throwaway landing route exists (Phase 2 Task 11).
