# Bundle Cross-Sell Sequence — Pro Manager Bundle

**Bundle:** BUNDLE-05 Pro Manager ($497 launch — saves $32 vs $529 à la carte; rises to $797 once 3 future B2B SKUs ship) · own-site only
**Trigger:** customer bought PAM-001 individually OR PAM-002/003/004 individually
**Tag at entry:** `bundle-cross:pro-manager`
**Sequence length:** 3 emails over 14 days
**Target conversion:** 15-25% — narrow but high-intent B2B audience; PAM-001 buyers are already pre-qualified.

**Tokens:** standard plus `{{ company_name }}` (where collected from buyer profile — defaults to "your PM operation")

**Suppression:**
- If customer is a solo host (no B2B signals), exit — Portfolio Bundle is theirs, not Pro Manager
- If customer is on `bundle-cross:portfolio`, exit (overlap)
- If customer cancels PAM-001 within 30 days, exit (likely refund-bound)

---

## Email 1 — Day 3 — The B2B stack

**Subject:** Seven workbooks for {{ company_name | default: "your PM operation" }}

**Preheader:** PAM-001 + the operating layer underneath. White-labelable.

```
{{ first_name | default: "Hey" }},

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
```

---

## Email 2 — Day 8 — The reason the savings are 6%, not 35%

**Subject:** Why the Pro Manager Bundle saves only 6%

**Preheader:** And why that's the right number for the launch.

```
{{ first_name | default: "Hey" }},

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
```

---

## Email 3 — Day 14 — Last note + the future SKUs

**Subject:** Last note + the 3 SKUs your bundle will inherit

**Preheader:** Won't email again. One last reminder.

```
{{ first_name | default: "Hey" }},

Last note on the Pro Manager Bundle.

If you're using PAM-001 and it's working, the operating-layer workbooks underneath aren't a separate purchase — they're the rest of the same B2B stack.

→ [Pro Manager Bundle — $497]({{ link_bundle }})

The lifetime-updates clause: when the 3 future B2B SKUs ship, they're added to your bundle automatically. Cleaner CRM ($97), Co-Host Commission Splitter ($67), Maintenance Workflow ($67). $231 of future SKU-value at no additional charge.

If now isn't the right time, no problem — won't email about this bundle again. Different topic next week: a note about what to charge owner clients (the most-undervalued PM lever).

Talk soon,
Emily · The STR Ledger

P.S. The 3 future B2B SKUs are in active development. When they ship, the bundle list price rises from $497 to $797. Today's launch price is the floor.
```

---

## After sequence

- **Tags set:** `bundle-cross:pro-manager:converted` OR `:declined`
- **Next sequence trigger:** "pm-pricing-strategy" — niche PM ops content + general nurture
- **Suppression:** 12 months on this bundle

## Iteration log

- `2026-05-05` — Initial draft. Pro Manager (B2B) sequence is short + frank because B2B buyers convert on transparent reasoning, not narrative. Day-8 email (the "why 6% not 35%" pitch) is the actual close — most B2B buyers respect operators who explain pricing logic.
