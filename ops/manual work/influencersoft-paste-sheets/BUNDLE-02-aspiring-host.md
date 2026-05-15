# Paste Sheet — BUNDLE-02-aspiring-host

> **Auto-generated from:** `copy\email-sequences\bundles\BUNDLE-02-aspiring-host.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.
> **Token format:** IS `{$xxx}` (NOT Liquid `{{ xxx }}`). Built-ins → `{$name}`. Custom fields → `{$leadExfield[N]}`.

> ⚠️ **4 of 4 email(s) need manual rewrite before pasting.** See per-email TODOs below.

## IS UI setup

1. **`Campaigns → Sequences → Add sequence`** — NOT `Tasks → Processes`. Sequences is the correct module for trigger-based email drips. (Founder explicitly warns against Process for this use case — gotchas.md #27.)
2. **Sequence name:** `BUNDLE-02-aspiring-host`
3. **Trigger node:** `Tag applied` → tag = `bundle-cross:aspiring-host`
   - Toggle ON: "Perform only once for an object"
   - Entry filter: `Tags | Doesn't match | do-not-email` (+ `refund-filed`, `unsubscribed` as additional rows)
4. **Add 4 Send email node(s)** below in order. Per-email config follows.
5. **End of process** node at the end.
6. **Save and Activate.**

Repeat for kill-switch: separate small Sequence triggered by `Tag applied = do-not-email` → Remove from list `STR Ledger — Contacts` → End of process. (Built once, applies to every sequence.)

---

### Email 1 of 4 — Run all four scenarios

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_bundle`, `bundle_credit_amount`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E1 - Day 2 - Run all four scenarios`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `2 d 0 hrs 0 min`

**Subject (paste):**

~~~
You ran one scenario. Here's the other three.
~~~

**Preheader (paste):**

~~~
The deal, the budget, the timeline, the no-money-down option — all four answer different questions.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-02-aspiring-host EMAIL 1 -----8<-----

{$name},

You picked up {$leadExfield[2]} a couple days back. Solid choice — it's one piece of the math an aspiring STR host actually needs to run.

The other three:

  · STR Deal Analyzer — does THIS specific property pencil? Cash-on-cash, DSCR, cap rate, BUY/WALK/NEGOTIATE.
  · Escape the W2 Planner — when can you quit? Replacement income, healthcare bridge, cash buffer.
  · Cost-to-Launch Calculator — what does the launch actually cost? 120 items, $3-8K of stuff buyers forget.
  · Rental Arbitrage Analyzer — is the no-money-down master-lease path actually viable for your situation?

Each one answers a different "should I?"

Bundled: $97. À la carte: $168. Save $71 (42% off — bigger than usual because pre-purchase buyers need a stronger anchor).

→ [Aspiring Host Bundle — $97]({{ link_bundle }})

Your ${{ bundle_credit_amount }} for {$leadExfield[2]} credits toward the bundle.

— Emily · The STR Ledger

P.S. If you're 6+ months out from buying, all four workbooks pay back time-spent in your decision. The lifetime-updates clause means if I improve any of them, you get the update automatically.

-----8<----- END EMAIL 1 -----8<-----

### Email 2 of 4 — The arbitrage question

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_bundle`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E2 - Day 7 - The arbitrage question`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `5 d 0 hrs 0 min`

**Subject (paste):**

~~~
"Could I just lease + sublet on Airbnb?"
~~~

**Preheader (paste):**

~~~
The question every aspiring STR host quietly asks themselves at least once.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-02-aspiring-host EMAIL 2 -----8<-----

{$name},

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

-----8<----- END EMAIL 2 -----8<-----

### Email 3 of 4 — Quit-date math

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_bundle`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E3 - Day 11 - Quit-date math`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `4 d 0 hrs 0 min`

**Subject (paste):**

~~~
When can you actually quit?
~~~

**Preheader (paste):**

~~~
Not "soon." Not "when the cash flow is good." A specific date.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-02-aspiring-host EMAIL 3 -----8<-----

{$name},

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

-----8<----- END EMAIL 3 -----8<-----

### Email 4 of 4 — Last note

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_bundle`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E4 - Day 14 - Last note`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `3 d 0 hrs 0 min`

**Subject (paste):**

~~~
Last note on the Aspiring Host Bundle
~~~

**Preheader (paste):**

~~~
Won't keep emailing. One last reminder.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-02-aspiring-host EMAIL 4 -----8<-----

{$name},

Last note on the bundle.

If you've been working through {$leadExfield[2]} and finding it useful, the other 3 workbooks complete the picture for the aspiring-investor decision.

→ [Aspiring Host Bundle — $97 (saves $71)]({{ link_bundle }})

If you're not ready, no problem. The à la carte SKUs stay available. I won't email you about this bundle again.

Different topic going out next week — a note about the one acquisition mistake first-year hosts make 70% of the time. Different sequence, different sender frequency. Watch for it.

Talk soon,
Emily · The STR Ledger

P.S. If you've already grabbed the bundle, IS will move you off this sequence by tomorrow morning. Sorry for the timing overlap.

-----8<----- END EMAIL 4 -----8<-----
