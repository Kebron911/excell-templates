# Paste Sheet — BUNDLE-03-year-2-operator

> **Auto-generated from:** `copy\email-sequences\bundles\BUNDLE-03-year-2-operator.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.
> **Token format:** IS `{$xxx}` (NOT Liquid `{{ xxx }}`). Built-ins → `{$name}`. Custom fields → `{$leadExfield[N]}`.

> ⚠️ **3 of 3 email(s) need manual rewrite before pasting.** See per-email TODOs below.

## IS UI setup

1. **Processes → New process** (or open existing)
2. **Process name:** `BUNDLE-03-year-2-operator`
3. **Trigger node:** `Tag applied` → tag = `bundle-cross:year-2-operator`
   - Toggle ON: "Perform only once for an object"
   - Entry filter: `Tags | Doesn't match | do-not-email` (+ `refund-filed`, `unsubscribed` as additional rows)
4. **Add 3 Send email node(s)** below in order. Per-email config follows.
5. **End of process** node at the end.
6. **Save and Activate.**

Repeat for kill-switch: separate small Process triggered by `Tag applied = do-not-email` → Remove from list `STR Ledger — Contacts` → End of process. (Built once, applies to every sequence.)

---

### Email 1 of 3 — Three more levers an experienced host actually controls

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_bundle`, `bundle_credit_amount`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E1 - Day 3 - Three more levers an experienced host actually controls`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `3 d 0 hrs 0 min`

**Subject (paste):**

~~~
The three other levers a Year-2 host actually controls
~~~

**Preheader (paste):**

~~~
You bought one. Here's the other three. They compose into a system.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-03-year-2-operator EMAIL 1 -----8<-----

{$name},

You picked up {$leadExfield[2]}. Year-2 territory.

The other three workbooks at this tier:

  · RevPAR Dashboard — your three numbers (RevPAR, ADR, occupancy) per property and portfolio-wide. Quarter-over-quarter momentum. WINNING / MIXED / LOSING per property.
  · Cleaning Fee Optimizer — three pricing strategies side-by-side. Most hosts are leaving $1.5-4.5K/yr on the table without knowing it.
  · Listing SEO Audit — 25 ranking criteria scored, prioritized fix list.
  · Damage Claim + AirCover Log — average host recovers 30-40% of claims because evidence isn't structured. With a structured packet it's 60-80%.

Bundled: $147. À la carte: $188. Save $41.

→ [Year-2 Operator Bundle — $147]({{ link_bundle }})

Your ${{ bundle_credit_amount }} purchase of {$leadExfield[2]} credits toward the bundle.

— Emily · The STR Ledger

P.S. The 22% bundle savings is smaller than the First-Year Bundle (30%) — by design. Year-2 buyers want most of these workbooks individually, so the discount is the kicker not the headline.

-----8<----- END EMAIL 1 -----8<-----

### Email 2 of 3 — The recovery rate gap

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_bundle`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E2 - Day 7 - The recovery rate gap`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `4 d 0 hrs 0 min`

**Subject (paste):**

~~~
Why most hosts only recover 35% of damage claims
~~~

**Preheader (paste):**

~~~
The evidence isn't structured. Here's how to fix that.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-03-year-2-operator EMAIL 2 -----8<-----

{$name},

A specific Year-2 number that surprises most hosts:

> Average AirCover claim recovery rate, across hosts who file: 30-40%.
> With a structured per-incident log + claim-ready packet: 60-80%.

That's the difference between the workbook and not.

The gap isn't because Airbnb's stingy. It's that hosts file claims with: a few photos, a vague description, and an estimated repair cost. AirCover's adjuster (or your dwelling carrier's adjuster) low-balls because the evidence is low-quality.

The Damage Claim Log (in the Year-2 Operator Bundle) is the structured version: pre-stay vs post-stay photo comparison (you have walkthrough photos at every check-in, right?), itemized damage with replacement costs, supporting documentation links. The Claim Packet tab is print-ready.

For a host filing 2-3 claims/year averaging $1,800 each: lifting recovery from 35% to 65% = $1,620/yr difference. Workbook is $37 individually. Bundle (4 workbooks) is $147.

→ [Year-2 Operator Bundle — $147]({{ link_bundle }})

— Emily

P.S. Most operators undervalue claim documentation until the first $4K loss they don't recover. The bundle pays for itself on the first prevented denial.

-----8<----- END EMAIL 2 -----8<-----

### Email 3 of 3 — Last note + the SEO audit

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_bundle`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E3 - Day 10 - Last note + the SEO audit`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `3 d 0 hrs 0 min`

**Subject (paste):**

~~~
Last note + the listing-rank lever most hosts ignore
~~~

**Preheader (paste):**

~~~
25 criteria. Each one ranked by impact.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-03-year-2-operator EMAIL 3 -----8<-----

{$name},

Last note on the bundle.

If you're using {$leadExfield[2]} and finding it useful, the other three workbooks compose into the same Year-2 operating system. Particularly:

The **Listing SEO Audit**. 25 criteria scored, prioritized fix list ranked by estimated rank lift. Most Year-2 operators have an 8-10/25 score and don't know it. A 14-day rewrite to 18+/25 typically lifts bookings by 12-25%.

You won't get there from intuition. The criteria are specific: keyword density in title (3 sub-criteria), photo composition (5), description (3), amenities (3), pricing rules (3), calendar hygiene (3), host signals (3), search-rank levers (2). Each maps to a fix.

The bundle is $147 (4 workbooks). À la carte is $188.

→ [Year-2 Operator Bundle — $147]({{ link_bundle }})

If now's not the time, no problem. Won't email about this bundle again. Different topic next week — a note about pricing-tool ROI (paid tools work for some hosts, not others; the math).

Talk soon,
Emily · The STR Ledger

P.S. If you bought the bundle already, IS will catch up overnight and move you off this sequence.

-----8<----- END EMAIL 3 -----8<-----
