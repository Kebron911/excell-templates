# Paste Sheet — BUNDLE-01-first-year-host

> **Auto-generated from:** `copy\email-sequences\bundles\BUNDLE-01-first-year-host.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.
> **Token format:** IS `{$xxx}` (NOT Liquid `{{ xxx }}`). Built-ins → `{$name}`. Custom fields → `{$leadExfield[N]}`.

> ⚠️ **4 of 4 email(s) need manual rewrite before pasting.** See per-email TODOs below.

## IS UI setup

1. **Processes → New process** (or open existing)
2. **Process name:** `BUNDLE-01-first-year-host`
3. **Trigger node:** `Tag applied` → tag = `bundle-cross:first-year-host`
   - Toggle ON: "Perform only once for an object"
   - Entry filter: `Tags | Doesn't match | do-not-email` (+ `refund-filed`, `unsubscribed` as additional rows)
4. **Add 4 Send email node(s)** below in order. Per-email config follows.
5. **End of process** node at the end.
6. **Save and Activate.**

Repeat for kill-switch: separate small Process triggered by `Tag applied = do-not-email` → Remove from list `STR Ledger — Contacts` → End of process. (Built once, applies to every sequence.)

---

### Email 1 of 4 — "You bought one piece"

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_bundle`, `bundle_credit_amount`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E1 - Day 2 - "You bought one piece"`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `2 d 0 hrs 0 min`

**Subject (paste):**

~~~
You just bought one piece of the first-year stack
~~~

**Preheader (paste):**

~~~
The other three are the ones nobody tells you about until it's too late.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-01-first-year-host EMAIL 1 -----8<-----

{$name},

Couple days ago you grabbed {$leadExfield[2]}. Welcome — it's one of the four workbooks I built specifically for first-year STR hosts.

The other three:

  · STR Deal Analyzer — underwrites any property in 5 minutes. Cash-on-cash, DSCR, cap rate, BUY/WALK/NEGOTIATE verdict.
  · Cost-to-Launch Calculator — 120-item furnishing checklist (catches the long tail most buyers forget — toaster, can opener, ice tray).
  · License/Permit Tracker — the workbook that prevents the $5,000 fine from your city's STR ordinance you didn't know existed.
  · Break-Even Occupancy — at what occupancy do you stop losing money?

Each one solves a different first-year landmine.

Bundle them: $97. À la carte: $138. Save $41.

→ [Get the full First-Year Host Bundle]({{ link_bundle }})

Note: your purchase of {$leadExfield[2]} (${{ bundle_credit_amount }}) credits toward the bundle. The link above auto-applies it — you'll see the discount at checkout.

— Emily · The STR Ledger

P.S. If you bought {$leadExfield[2]} this week and you're not sure why I'm offering you a bundle that includes it: read it as a discounted upgrade, not a duplicate purchase. The math works because the bundle SKUs flow data into each other — cleaner than running them separately.

-----8<----- END EMAIL 1 -----8<-----

### Email 2 of 4 — The first-year landmine you didn't think you had

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_bundle`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E2 - Day 7 - The first-year landmine you didn't think you had`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `5 d 0 hrs 0 min`

**Subject (paste):**

~~~
The first-year STR landmine that hits 60% of new hosts
~~~

**Preheader (paste):**

~~~
It's not the deal. It's not the launch. It's the thing your city's website buries on page 47.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-01-first-year-host EMAIL 2 -----8<-----

{$name},

Quick story.

Last summer, a host I worked with closed on a cabin in the Smokies. Did everything right. Ran the deal in a spreadsheet, budgeted the launch, listed by Memorial Day. Hit Superhost in 6 months.

Two weeks ago she got a $4,200 fine in the mail. Sevier County had quietly added an STR registration requirement six months after she listed — and her listing got auto-flagged by an enforcement bot scraping Airbnb. The fine was for 6 months of unregistered nights at $700/month.

She didn't know about the registration. The county's website buried it on page 47 of a PDF document titled "TRANSIENT OCCUPANCY ORDINANCE 2024-103."

The License/Permit Tracker — one of the 4 workbooks in the First-Year Host Bundle — surfaces this kind of thing as a renewal-deadline countdown. Yellow at 60 days, red at 30. It's the workbook you never appreciate until you almost miss a deadline.

It's $47 individually. With the other three first-year workbooks (Deal Analyzer + Cost-to-Launch + Break-Even), the bundle is $97. Saves $41 over à la carte.

→ [First-Year Host Bundle — $97]({{ link_bundle }})

Most hosts don't think they need permit tracking until they get the letter.

— Emily

P.S. The county didn't refund Sarah's fine. It took her tax filing for the next two years to absorb the hit. The workbook bundle is $97. The fine was $4,200. Math.

-----8<----- END EMAIL 2 -----8<-----

### Email 3 of 4 — The cleanest version of the math

> ⚠️ **TODO — Tokens NOT in IS field map:** `bundle_credit_amount`, `97 minus bundle_credit_amount`, `link_bundle`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E3 - Day 11 - The cleanest version of the math`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `4 d 0 hrs 0 min`

**Subject (paste):**

~~~
Quick math on the bundle
~~~

**Preheader (paste):**

~~~
$97 vs $138, plus the credit you've already paid.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-01-first-year-host EMAIL 3 -----8<-----

{$name},

Cutting straight today.

You bought {$leadExfield[2]} for ${{ bundle_credit_amount }}.
The First-Year Host Bundle is $97 (4 workbooks).
À la carte total of those 4: $138.

You paid ${{ bundle_credit_amount }} already. The credit applies. The remaining 3 workbooks cost you $[TODO {{ 97 minus bundle_credit_amount }}] all-in.

Here's what the other 3 do:

  · STR Deal Analyzer — verifies the next deal you look at (or audits the current one)
  · Cost-to-Launch Calculator — 120-item furnishing list (saves $3-8K of forgotten items on a typical launch)
  · License/Permit Tracker — multi-jurisdiction renewal calendar
  · Break-Even Occupancy — at what occupancy you stop losing money

(I include 4 above on purpose — your purchase counts as one of them, so depending on which you bought, swap accordingly.)

→ [Apply credit + get the rest of the bundle]({{ link_bundle }})

— Emily

P.S. Lifetime updates included on every workbook. When any one gets a new version, you get it automatically.

-----8<----- END EMAIL 3 -----8<-----

### Email 4 of 4 — Last note

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_bundle`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E4 - Day 14 - Last note`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `3 d 0 hrs 0 min`

**Subject (paste):**

~~~
Last note on the First-Year Bundle
~~~

**Preheader (paste):**

~~~
I won't keep emailing about this. One last reminder.
~~~

**Body (paste between fences):**

-----8<----- BEGIN BUNDLE-01-first-year-host EMAIL 4 -----8<-----

{$name},

Last note on the First-Year Host Bundle.

If you're using {$leadExfield[2]} and finding it useful, the other 3 workbooks are designed to flow data into and out of it. They're not a separate purchase — they're the rest of the same operating system.

→ [First-Year Host Bundle — $97]({{ link_bundle }})

If it's not the right time, no problem. The à la carte SKUs stay available individually. I won't email you about this bundle again.

I'll send you something different on Monday — a note about a specific tax move most first-year hosts miss in their first April. Different topic, different sequence.

Talk Monday,
Emily · The STR Ledger

P.S. If you've already purchased the bundle, ignore this email — IS will catch up overnight and you'll be moved off this sequence by tomorrow.

-----8<----- END EMAIL 4 -----8<-----
