# Bundle Cross-Sell Sequence — Aspiring Host Bundle

**Bundle:** BUNDLE-02 Aspiring Host ($97 — saves $71 vs $168 à la carte)
**Trigger:** customer bought STR-001 / ACQ-001 / ACQ-002 / ACQ-003 individually
**Tag at entry:** `bundle-cross:aspiring-host`
**Sequence length:** 4 emails over 14 days
**Target conversion:** 10-15% of triggered list (pre-host buyers convert harder than mid-funnel; warmer cohort).

**Tokens:** same as BUNDLE-01 (`{{ first_name }}`, `{{ purchased_sku_name }}`, `{{ link_bundle }}`, `{{ bundle_credit_amount }}`)

**Suppression:**
- If customer is on `bundle-cross:portfolio` or `bundle-cross:pro-manager`, exit (those are higher-tier portfolios)
- If customer purchased Wave 1 SKUs (GST-001, OPS-001), they're past the aspiring stage — exit
- If customer is on the Welcome Book Magnet sequence, stack carefully — Aspiring sequence focuses on pre-purchase planning, Welcome Book on operating. They can run in parallel.

---

## Email 1 — Day 2 — Run all four scenarios

**Subject:** You ran one scenario. Here's the other three.

**Preheader:** The deal, the budget, the timeline, the no-money-down option — all four answer different questions.

```
{{ first_name | default: "Hey" }},

You picked up {{ purchased_sku_name }} a couple days back. Solid choice — it's one piece of the math an aspiring STR host actually needs to run.

The other three:

  · STR Deal Analyzer — does THIS specific property pencil? Cash-on-cash, DSCR, cap rate, BUY/WALK/NEGOTIATE.
  · Escape the W2 Planner — when can you quit? Replacement income, healthcare bridge, cash buffer.
  · Cost-to-Launch Calculator — what does the launch actually cost? 120 items, $3-8K of stuff buyers forget.
  · Rental Arbitrage Analyzer — is the no-money-down master-lease path actually viable for your situation?

Each one answers a different "should I?"

Bundled: $97. À la carte: $168. Save $71 (42% off — bigger than usual because pre-purchase buyers need a stronger anchor).

→ [Aspiring Host Bundle — $97]({{ link_bundle }})

Your ${{ bundle_credit_amount }} for {{ purchased_sku_name }} credits toward the bundle.

— Emily · The STR Ledger

P.S. If you're 6+ months out from buying, all four workbooks pay back time-spent in your decision. The lifetime-updates clause means if I improve any of them, you get the update automatically.
```

---

## Email 2 — Day 7 — The arbitrage question

**Subject:** "Could I just lease + sublet on Airbnb?"

**Preheader:** The question every aspiring STR host quietly asks themselves at least once.

```
{{ first_name | default: "Hey" }},

A question I get from aspiring STR investors more than any other:

> "What if I don't buy at all? Could I just rent a property, get the landlord's permission to Airbnb it, and skip the down payment?"

That's rental arbitrage. It works in some markets. Doesn't work in others. The math is real but tighter than buying.

Three things have to be true:

  1. The numbers pencil at lower margins (you're paying retail rent vs amortized mortgage)
  2. The lease lets you sublet (most don't — get it in writing)
  3. There's an MTR fallback if STR demand softens (can you cover lease at long-term rent?)

The Rental Arbitrage Analyzer (one of the 4 workbooks in the Aspiring Host Bundle) walks all three. Lease terms in, projected revenue in (STR mode), MTR fallback math, breakeven occupancy, lease-term ROI.

You don't have to commit to arbitrage to run the numbers. You DO have to run the numbers before you commit.

→ [Aspiring Host Bundle — $97 (includes the Arbitrage Analyzer)]({{ link_bundle }})

— Emily

P.S. Most W2 readers don't realize arbitrage is a path until they see the analyzer. Then they realize it's a path that doesn't work in their specific market. Either way — the workbook saves them from making the decision on vibes.
```

---

## Email 3 — Day 11 — Quit-date math

**Subject:** When can you actually quit?

**Preheader:** Not "soon." Not "when the cash flow is good." A specific date.

```
{{ first_name | default: "Hey" }},

The conversation aspiring STR investors have with their spouse — at some point, in some form — is the same:

> Spouse: "When can you quit your job?"
> Investor: "When the cash flow's good enough."
> Spouse: "What does that mean?"
> Investor: "Like... three properties? Maybe four?"
> Spouse: "When?"
> Investor: "..."

The Escape the W2 Planner (in the Aspiring Host Bundle) is the spreadsheet that ends that conversation with a specific date.

Inputs: current household monthly expenses, current W2 net pay, projected portfolio cash flow per acquisition cadence, healthcare bridge cost (this is the one most planners miss — if you're under 65, marketplace plans for a family of 4 are $1,800-3,000/mo).

Outputs: a year-month answer. Plus three stress tests (recession, vacancy, healthcare hike) so the conversation isn't built on best-case assumptions.

It's $47 individually. In the Aspiring Host Bundle ($97) you also get the Deal Analyzer, Cost-to-Launch, and Arbitrage Analyzer.

→ [Aspiring Host Bundle — $97]({{ link_bundle }})

— Emily

P.S. The healthcare bridge math is the one most planners skip. It changes the answer by 12-30 months for most W2-quitters. Worth running.
```

---

## Email 4 — Day 14 — Last note

**Subject:** Last note on the Aspiring Host Bundle

**Preheader:** Won't keep emailing. One last reminder.

```
{{ first_name | default: "Hey" }},

Last note on the bundle.

If you've been working through {{ purchased_sku_name }} and finding it useful, the other 3 workbooks complete the picture for the aspiring-investor decision.

→ [Aspiring Host Bundle — $97 (saves $71)]({{ link_bundle }})

If you're not ready, no problem. The à la carte SKUs stay available. I won't email you about this bundle again.

Different topic going out next week — a note about the one acquisition mistake first-year hosts make 70% of the time. Different sequence, different sender frequency. Watch for it.

Talk soon,
Emily · The STR Ledger

P.S. If you've already grabbed the bundle, IS will move you off this sequence by tomorrow morning. Sorry for the timing overlap.
```

---

## After sequence

- **Tags set:** `bundle-cross:aspiring-host:converted` OR `bundle-cross:aspiring-host:declined`
- **Next sequence trigger:** "first-acquisition-mistake-70pct" — sets up the path to First-Year Bundle once they actually buy
- **Suppression:** 12 months on this same bundle sequence

## Iteration log

- `2026-05-05` — Initial draft. Pre-host cohort warms slower than buyer cohort — sequence stays at 4 emails to give time without exhausting the list. Day 7 (arbitrage) and Day 11 (quit-date) are the two biggest emotional hooks for aspiring buyers; both are bundle-only SKUs by design.
