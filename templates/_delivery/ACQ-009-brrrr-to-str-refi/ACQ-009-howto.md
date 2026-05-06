# How to Use Your BRRRR-to-STR Refi Math

## What this workbook does

Models the BRRRR (Buy, Rehab, Rent, Refinance, Repeat) strategy specifically for STR. Computes ARV (after-repair value), refinance cash-out at 70-75% LTV, cash-left-in (or returned), DSCR after refi, and whether the deal repeats your capital. Solves: "did this BRRRR actually return all my cash?"

## First-time setup (15 min)

1. Open tab **Acquisition** — purchase price, closing costs, rehab budget (pull from ACQ-006 if you have it), holding costs during rehab.
2. Tab **ARV Estimation** — comparable-sales method (3 comps × per-bed/bath value) and stabilized-NOI method (cap rate × stabilized NOI). Workbook computes both, picks the conservative one.
3. Tab **Refinance Terms** — projected LTV (70-75% typical for DSCR refi), interest rate, term.
4. Tab **Stabilized Operations** — projected revenue + expenses post-rehab.

## Reading the outputs

- **Cash-Left-In (or Returned):** total cash invested − refinance proceeds. Goal: $0 or negative (you got all your cash back).
- **Post-Refi DSCR:** projected NOI ÷ new debt service. Must be ≥1.20 to qualify for the refi.
- **Capital-Recycled %:** how much of your original cash you can re-deploy into the next BRRRR.

## When to walk

- ARV doesn't support 70%+ LTV refi → cash stays trapped, BRRRR fails
- Post-refi DSCR <1.20 → can't get the refi, stuck with original financing
- Stabilized revenue assumptions too aggressive → reality check with comp data (ACQ-005 AirDNA Integrator)

## Questions?

**hello@thestrledger.com** — real humans, fast replies.

---

**Pair with:** ACQ-006 Rehab Budget + ROI (the rehab inputs), ACQ-001 STR Deal Analyzer (year-1 underwriting on stabilized), FIN-004 DSCR Tracker (post-refi DSCR validation).
