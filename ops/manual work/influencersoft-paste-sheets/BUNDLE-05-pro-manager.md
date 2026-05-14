# Paste Sheet — BUNDLE-05-pro-manager

> **Auto-generated from:** `copy\email-sequences\bundles\BUNDLE-05-pro-manager.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.
> **Token format:** IS `{$xxx}` (NOT Liquid `{{ xxx }}`). Built-ins → `{$name}`. Custom fields → `{$leadExfield[N]}`.

> ⚠️ **3 of 3 email(s) need manual rewrite before pasting.** See per-email TODOs below.

## IS UI setup

1. **Processes → New process** (or open existing)
2. **Process name:** `BUNDLE-05-pro-manager`
3. **Trigger node:** `Tag applied` → tag = `bundle-cross:pro-manager`
   - Toggle ON: "Perform only once for an object"
   - Entry filter: `Tags | Doesn't match | do-not-email` (+ `refund-filed`, `unsubscribed` as additional rows)
4. **Add 3 Send email node(s)** below in order. Per-email config follows.
5. **End of process** node at the end.
6. **Save and Activate.**

Repeat for kill-switch: separate small Process triggered by `Tag applied = do-not-email` → Remove from list `STR Ledger — Contacts` → End of process. (Built once, applies to every sequence.)

---

### Email 1 of 3 — The B2B stack

> ⚠️ **TODO — Tokens NOT in IS field map:** `company_name`, `link_bundle`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E1 - Day 3 - The B2B stack`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `3 d 0 hrs 0 min`

**Subject (paste):**

~~~
Seven workbooks for {{ company_name | default: "your PM operation" }}
~~~

**Preheader (paste):**

~~~
PAM-001 + the operating layer underneath. White-labelable.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-05-pro-manager EMAIL 1 -----8<-----

{$name},

Thanks for picking up the Owner Reporting Dashboard.

The Pro Manager Bundle is what sits underneath that — the operating math your PM operation needs to actually deliver the per-owner reports cleanly.

Bundled at $497 (launch price). À la carte $529. Modest savings ($32) — the pitch isn't discount, it's having the integrated stack.

What's in it:

  · Owner Reporting Dashboard (PAM-001 — you already own it; the credit applies)
  · Multi-Property Master P&L (TAX-011) — the financial side feeding owner reports
  · RevPAR Dashboard — the operational metric feeding owner reports
  · Damage Claim + AirCover Log — your claim-lifecycle infrastructure
  · License/Permit Tracker — multi-jurisdiction renewal calendar (most PM operations run across 3+ cities)
  · Listing SEO Audit — listing-quality control across owner properties
  · Cleaning Fee Optimizer — pricing optimization owner-by-owner

→ [Pro Manager Bundle — $497]({{ link_bundle }})

— Emily · The STR Ledger

P.S. The launch price is $497 because 3 future B2B SKUs (Cleaner CRM, Co-Host Commission Splitter, Maintenance Workflow) haven't shipped yet. When they ship, bundle rises to $797 — but launch buyers get the new SKUs free as a loyalty add-on. Lifetime updates clause.

-----8<----- END EMAIL 1 -----8<-----

### Email 2 of 3 — The reason the savings are 6%, not 35%

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_bundle`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E2 - Day 8 - The reason the savings are 6%, not 35%`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `5 d 0 hrs 0 min`

**Subject (paste):**

~~~
Why the Pro Manager Bundle saves only 6%
~~~

**Preheader (paste):**

~~~
And why that's the right number for the launch.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-05-pro-manager EMAIL 2 -----8<-----

{$name},

A note on Pro Manager Bundle pricing — because a B2B buyer notices the math.

The bundle saves $32 (6%) on the 7 workbooks at launch. Most bundles save 25-35%. Why is this one smaller?

Two reasons:

**1. PAM-001 is half the bundle's price ($197 of $497).** The other 6 workbooks à la carte total $332. Discounting heavily on a flagship SKU you already own would cheapen the brand for direct-buyers.

**2. The bundle is sized to grow.** Three B2B SKUs are in development:

  · Cleaner CRM — multi-cleaner roster, payroll, certifications ($97)
  · Co-Host Commission Splitter — variable splits across owner relationships ($67)
  · Maintenance Workflow — work-order intake → vendor dispatch → owner notification ($67)

When those ship, the à la carte total rises to $760. The bundle stays at $797 (5% savings). Launch buyers get the 3 new SKUs free — that's where the actual savings hit, deferred.

So the pitch at launch is integration, not discount. Same logic as the Portfolio Bundle.

→ [Pro Manager Bundle — $497]({{ link_bundle }})

— Emily

P.S. White-labelability is the other reason PMs buy the bundle vs the SKUs individually. The Owner Reporting Dashboard's per-owner statements pull data from the operating workbooks via consistent conventions. Doing this manually with mixed-convention spreadsheets is the busywork PMs hate.

-----8<----- END EMAIL 2 -----8<-----

### Email 3 of 3 — Last note + the future SKUs

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_bundle`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E3 - Day 14 - Last note + the future SKUs`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `6 d 0 hrs 0 min`

**Subject (paste):**

~~~
Last note + the 3 SKUs your bundle will inherit
~~~

**Preheader (paste):**

~~~
Won't email again. One last reminder.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-05-pro-manager EMAIL 3 -----8<-----

{$name},

Last note on the Pro Manager Bundle.

If you're using PAM-001 and it's working, the operating-layer workbooks underneath aren't a separate purchase — they're the rest of the same B2B stack.

→ [Pro Manager Bundle — $497]({{ link_bundle }})

The lifetime-updates clause: when the 3 future B2B SKUs ship, they're added to your bundle automatically. Cleaner CRM ($97), Co-Host Commission Splitter ($67), Maintenance Workflow ($67). $231 of future SKU-value at no additional charge.

If now isn't the right time, no problem — won't email about this bundle again. Different topic next week: a note about what to charge owner clients (the most-undervalued PM lever).

Talk soon,
Emily · The STR Ledger

P.S. The 3 future B2B SKUs are in active development. When they ship, the bundle list price rises from $497 to $797. Today's launch price is the floor.

-----8<----- END EMAIL 3 -----8<-----
