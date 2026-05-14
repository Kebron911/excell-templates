# Paste Sheet — BUNDLE-04-portfolio

> **Auto-generated from:** `copy\email-sequences\bundles\BUNDLE-04-portfolio.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.
> **Token format:** IS `{$xxx}` (NOT Liquid `{{ xxx }}`). Built-ins → `{$name}`. Custom fields → `{$leadExfield[N]}`.

> ⚠️ **3 of 3 email(s) need manual rewrite before pasting.** See per-email TODOs below.

## IS UI setup

1. **Processes → New process** (or open existing)
2. **Process name:** `BUNDLE-04-portfolio`
3. **Trigger node:** `Tag applied` → tag = `bundle-cross:portfolio`
   - Toggle ON: "Perform only once for an object"
   - Entry filter: `Tags | Doesn't match | do-not-email` (+ `refund-filed`, `unsubscribed` as additional rows)
4. **Add 3 Send email node(s)** below in order. Per-email config follows.
5. **End of process** node at the end.
6. **Save and Activate.**

Repeat for kill-switch: separate small Process triggered by `Tag applied = do-not-email` → Remove from list `STR Ledger — Contacts` → End of process. (Built once, applies to every sequence.)

---

### Email 1 of 3 — Fourteen workbooks is an operating system

> ⚠️ **TODO — Tokens NOT in IS field map:** `skus_owned_list`, `link_bundle`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E1 - Day 5 - Fourteen workbooks is an operating system`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `5 d 0 hrs 0 min`

**Subject (paste):**

~~~
Fourteen workbooks. One operating system. $397.
~~~

**Preheader (paste):**

~~~
When you scale past one property, individual workbooks stop being the right unit.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-04-portfolio EMAIL 1 -----8<-----

{$name},

You're past the single-property stage. The signal — you've bought {{ skus_owned_list }}, which means you're operating across multiple workbooks already, manually.

The Portfolio Bundle is the integrated alternative.

  · 14 Excel workbooks
  · ~$593 à la carte
  · $397 bundled (33% off)
  · Lifetime updates on every workbook in the bundle

What's in it:

  Multi-Property Master P&L (TAX-011) · RevPAR Dashboard · Deal Analyzer (Full) · Damage Claim + AirCover Log · License/Permit Tracker · Cleaning Fee Optimizer · Listing SEO Audit · Break-Even Occupancy · Cost-to-Launch Calculator · Escape the W2 Planner · Single-Property P&L Tracker · Schedule E Tax-Prep Workbook · Welcome Book · Cleaner Turnover Checklist

The 14 share conventions — same tab structures, same cell-format rules, same upgrade paths. They flow data into each other. Your existing purchases credit toward the bundle.

→ [Portfolio Bundle — $397]({{ link_bundle }})

— Emily · The STR Ledger

P.S. The bundle is own-site only (not on Etsy). Etsy's price-anchor doesn't serve a $397 SKU; direct-buyers in the Portfolio cohort don't shop on Etsy anyway.

-----8<----- END EMAIL 1 -----8<-----

### Email 2 of 3 — The hidden value isn't the savings

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_bundle`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E2 - Day 9 - The hidden value isn't the savings`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `4 d 0 hrs 0 min`

**Subject (paste):**

~~~
The portfolio bundle's real value isn't the 33% off
~~~

**Preheader (paste):**

~~~
It's the consistency of conventions. You don't see it until you've integrated them.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-04-portfolio EMAIL 2 -----8<-----

{$name},

Most pitches for a 14-product bundle lead with the dollar savings. $196 off. 33% discount.

That math is true. It's not the actual reason serious portfolio operators buy.

The actual reason: every workbook in the bundle uses the same conventions. Same tab structures. Same cell formatting. Same dropdown sources. Same Schedule E line mappings. Same Settings-tab pattern. Same active-tax-year cell.

Which means:

  · The Multi-Property P&L pulls cost basis from the Single-Property P&L automatically
  · The Depreciation Tracker reads in-service dates from Property Info tabs identically across all 14
  · The Cleaning Fee Optimizer reads turnover-cost from the Cleaning Cost Tracker without reformatting
  · The 1099-NEC Tracker pulls vendor payments from the Maintenance Log without column-mapping work

À la carte you get 14 workbooks with subtle inconsistencies that compound into reconciliation work. Bundled, you get 14 workbooks that compose into one operating system — every quarter saves you 4-8 hours of formatting + reconciliation that shouldn't exist.

The savings are real. The integration is the actual reason.

→ [Portfolio Bundle — $397]({{ link_bundle }})

— Emily

P.S. If you've already integrated the workbooks you own and aren't running into the reconciliation problem: ignore this. The bundle is for operators where the manual reconciliation has started to bite.

-----8<----- END EMAIL 2 -----8<-----

### Email 3 of 3 — Last note

> ⚠️ **TODO — Tokens NOT in IS field map:** `skus_owned_list`, `link_bundle`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E3 - Day 14 - Last note`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `5 d 0 hrs 0 min`

**Subject (paste):**

~~~
Last Portfolio Bundle note
~~~

**Preheader (paste):**

~~~
Won't keep emailing about this. One last reminder.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-04-portfolio EMAIL 3 -----8<-----

{$name},

Last note on the Portfolio Bundle.

You've already paid for {{ skus_owned_list }}. The credit applies toward $397. The remaining workbooks are the rest of the multi-property stack.

→ [Portfolio Bundle — $397 (with your credit applied)]({{ link_bundle }})

If you're not ready, no problem. The à la carte SKUs stay available individually. Won't email about this bundle again.

Different topic next week — a note about depreciation acceleration via cost segregation. Different sequence, different sender frequency.

Talk soon,
Emily · The STR Ledger

P.S. The Portfolio Bundle includes Schedule E Tax-Prep + the Multi-Property Master P&L + the Single-Property P&L. If you handle your own taxes (not via CPA), those three together cut tax-prep time roughly 80% vs. running them separately. Worth the bundle on tax time alone.

-----8<----- END EMAIL 3 -----8<-----
