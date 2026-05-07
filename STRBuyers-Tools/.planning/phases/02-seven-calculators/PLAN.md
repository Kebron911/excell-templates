# Phase 2 — Seven Calculators — PLAN

**Status:** active · **Started:** 2026-05-06

## Goal
Seven pre-purchase calculators live, each TDD'd, AffiliateBlock wired with vendor matchups, URL state + format helpers driving every input.

## Pattern (every calculator)
1. Pure math at `src/lib/calc/<slug>.ts` — typed inputs/outputs, no DOM
2. Vitest at `tests/calc/<slug>.test.ts` — TDD
3. React island at `src/components/calculators/<Name>Calculator.tsx` — uses shared `ui.tsx`, URL state via `parse + createDebouncedReplaceState`, fires `gtag('calculator_input_changed')`
4. Astro page at `src/pages/<slug>.astro` — Layout + tool + AffiliateBlock + Sidebar + AdSlot + EmailCaptureCard + STRLedgerCTA + ClusterFunnelBlock
5. MDX at `src/content/tools/<slug>.mdx` — How-it-works, How-to-use, FAQ
6. JSON-LD WebApplication + FAQPage in head

## Tasks

### T9 — Affiliate registry expansion
Already partially seeded in Phase 1. Confirm vendor IDs cover the per-tool mappings used below.

### T10 — Loan-types data
`src/data/loan-types.json` — 4 entries with min-down %, eligibility note (used by Down Payment calculator).

### T11 — DSCR calculator
Inputs: monthlyRent, monthlyPITIA (principal + interest + taxes + insurance + assoc/HOA).
Output: ratio + lender-tier label (≥1.25 strong · 1.00–1.24 qualifying · <1.00 short).
AffiliateBlock: visio, kiavi.

### T12 — Down Payment calculator
Inputs: purchasePrice, loanType (selector → loan-types.json).
Output: downPayment$, loanAmount, monthly P&I estimate (rate placeholder 7%).
AffiliateBlock: visio, kiavi.

### T13 — Comp Analyzer
Inputs: 3× {nightlyRate, occupancyPct, cleaningFee}.
Output: per-listing annual gross, average, spread (max-min%).
URL-encodes 3 listings into a single share link.
AffiliateBlock: airdna, pricelabs.

### T14 — Market Score
Inputs: medianADR, occupancyPct, regulationStatus (allowed/restrictive/banned), saturationTier (low/medium/high).
Output: 0–100 score + qualitative label (strong/marginal/avoid).
AffiliateBlock: airdna.

### T15 — Cash-on-Cash
Inputs: annualCashFlow, totalCashInvested.
Output: CoC% + benchmark commentary (10%+ strong, 6–10% solid, <6% revisit).
AffiliateBlock: visio, airdna.

### T16 — Year-1 Cash Needs
Inputs: purchasePrice, downPaymentPct, closingCostsPct, furnishingBudget, reserveMonths, monthlyExpenseEstimate.
Output: total Year-1 cash needs broken down.
AffiliateBlock: proper, stage.

### T17 — Furnishing Budget
Inputs: bedrooms (1–4+), tier (basic/mid/luxury).
Output: budget by category (living, bedroom, kitchen, bath, decor, contingency).
AffiliateBlock: stage.

## Acceptance
- 9 commits (T9 + T10 + 7 calculators) atomic.
- `pnpm typecheck` clean.
- `pnpm test` green for all 7 calc libs.
- `pnpm build` produces 7 calculator HTML pages + sitemap entries.
- Each page: AffiliateBlock visible, AdSlot rendered, STRLedgerCTA UTMed to that tool, Sidebar shows the other 6 calculators.

## Out of scope
- City pages (Phase 3)
- /api/click endpoint (Phase 4)
- OG image generation (Phase 4)
- Real lender-rate API integration
