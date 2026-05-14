# All InfluencerSoft Sequences — Combined Paste Sheets

> **Auto-generated.** Re-run `node scripts/is-paste-helper.mjs` to refresh.
> Paste these into IS in the order listed (Processes → New process per row).

## Order + progress

| # | Sequence | Trigger tag | Emails | Status |
|---|----------|-------------|--------|--------|
| 1 | `post-purchase-etsy-buyer` | `customer:etsy` | 10 | ☐ to-paste |
| 2 | `review-request` | `purchased:day5` | 2 | ☐ to-paste |
| 3 | `refund-recovery` | `refund-filed` | 2 | ☐ to-paste |
| 4 | `welcome-book-magnet` | `lead-magnet:welcome-book` | 5 | ☐ to-paste |
| 5 | `abandoned-cart` | `checkout-abandoned` | 3 | ☐ to-paste |
| 6 | `win-back` | `inactive-30d` | 3 | ☐ to-paste |
| 7 | `BUNDLE-01-first-year-host` | `bundle-cross:first-year-host` | 4 | ☐ to-paste |
| 8 | `BUNDLE-02-aspiring-host` | `bundle-cross:aspiring-host` | 4 | ☐ to-paste |
| 9 | `BUNDLE-03-year-2-operator` | `bundle-cross:year-2-operator` | 3 | ☐ to-paste |
| 10 | `BUNDLE-04-portfolio` | `bundle-cross:portfolio` | 3 | ☐ to-paste |
| 11 | `BUNDLE-05-pro-manager` | `bundle-cross:pro-manager` | 3 | ☐ to-paste |

**Total emails to paste: 42**

---
# Paste Sheet — post-purchase-etsy-buyer

> **Auto-generated from:** `copy\email-sequences\post-purchase-etsy-buyer.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.
> **Token format:** IS `{$xxx}` (NOT Liquid `{{ xxx }}`). Built-ins → `{$name}`. Custom fields → `{$leadExfield[N]}`.

> ⚠️ **9 of 10 email(s) need manual rewrite before pasting.** See per-email TODOs below.

## IS UI setup

1. **Processes → New process** (or open existing)
2. **Process name:** `post-purchase-etsy-buyer`
3. **Trigger node:** `Tag applied` → tag = `customer:etsy`
   - Toggle ON: "Perform only once for an object"
   - Entry filter: `Tags | Doesn't match | do-not-email` (+ `refund-filed`, `unsubscribed` as additional rows)
4. **Add 10 Send email node(s)** below in order. Per-email config follows.
5. **End of process** node at the end.
6. **Save and Activate.**

Repeat for kill-switch: separate small Process triggered by `Tag applied = do-not-email` → Remove from list `STR Ledger — Contacts` → End of process. (Built once, applies to every sequence.)

---

### Email 1 of 10 — Order received + delivery

**Block name (rename to):** `E1 - Day 0 (within 5 minutes of order) - Order received + delivery`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **Immediately after previous step** (0 d 0 hrs 0 min)

**Subject (paste):**

~~~
Your {$leadExfield[2]} is ready (download + 3 things to read)
~~~

**Preheader (paste):**

~~~
Order #{$leadExfield[4]}. Plus the one tab nobody opens until they need it.
~~~

**Body (paste between fences):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 1 -----8<-----

Hey {$name},

Order #{$leadExfield[4]} just landed. Here's what you do next:

**1. Download the files** (you've already got an Etsy email with these):
   · BLANK xlsx — your starter copy
   · DEMO xlsx — pre-filled example data; learn from this before clearing it
   · How-to PDF — step-by-step usage
   · License PDF — terms (single-business use)
   · A13 buyer companion — link to your free guide (more on that in 5 days)

**2. Open the DEMO first.** Real data shows you what the workbook can DO. Then duplicate it as your working copy and clear the inputs.

**3. The "Settings" tab is the one nobody opens until they need it.** It's where the active tax year lives, where dropdowns get configured, and where the upgrade-banner lives. Read it once now — saves a 9pm panic later.

That's it for today.

Five days from now I'll send you a follow-up note about a free Excel checklist that pairs with what you just bought. Different topic, different sequence.

Talk soon,
Emily · The STR Ledger

P.S. If this email landed in Promotions, drag it to Primary so the next 9 emails arrive in your main inbox. Email providers are weird about new senders.

P.P.S. Anything broken in the file? Reply to this email — real humans, fast replies. We respond within 1 business day.

-----8<----- END EMAIL 1 -----8<-----

### Email 2 of 10 — Use it on something specific

> ⚠️ **TODO — IS does NOT support Liquid conditionals (`{% if %}`).** This email has conditional logic that won't render. Either rewrite as single-version copy OR split into per-SKU branches using Filter Condition nodes on the canvas.

**Block name (rename to):** `E2 - Day 2 - Use it on something specific`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `2 d 0 hrs 0 min`

**Subject (paste):**

~~~
Use {$leadExfield[2]} on this specific thing
~~~

**Preheader (paste):**

~~~
Don't read the manual. Pick the one row that maps to a real situation.
~~~

**Body (paste between fences):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 2 -----8<-----

{$name},

Most STR templates die on the desktop because the buyer never actually fills them out. The DEMO data is sample data; your data is real and feels different.

The cure: pick the most recent specific situation and run it through the workbook.

For {$leadExfield[2]}, that means: 
{% if sku_code contains "TAX-001" %}
> Pick last week's longest property-related drive. Date, destination, business purpose, miles. One row. The workbook tells you the dollar deduction at the IRS rate.
{% elsif sku_code contains "TAX-002" %}
> Pick the last 30 days of bookings + expenses on your highest-revenue property. Paste them in. Run the Schedule E Summary. See what your Q1-equivalent looks like.
{% elsif sku_code contains "TAX-003" %}
> Pull up Venmo. Find the contractor you've paid the most this year. Add them to the Contractor tab. Add their last 5 payments to the Payment Log. The dashboard tells you whether they've crossed $600 yet.
{% elsif sku_code contains "OPS-001" %}
> Print the checklist. Hand it to your cleaner before next turnover. Add the scoring column once they finish. Two turnovers in you'll know which cleaner is actually 5/5 vs which one is 3/5.
{% elsif sku_code contains "GST-001" %}
> Don't customize all 9 sections at once. Just fill in the WiFi tab + the House Rules tab. That covers 60% of the questions guests text you. The other 7 sections fill in over a month.
{% else %}
> Open the DEMO tab. Pick the row that most closely matches your situation. Trace the math (or the workflow) for that one row. THEN clear the rest and start filling in your data.
{% endif %}

Two minutes of "real data, one row" beats two hours of "I'll customize everything later."

— Emily

P.S. Stuck somewhere? Reply to this email with what you're stuck on. Real humans, fast replies.

-----8<----- END EMAIL 2 -----8<-----

### Email 3 of 10 — The free 47-deductions guide (hero magnet pitch)

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_thestrledger`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E3 - Day 5 - The free 47-deductions guide (hero magnet pitch)`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `3 d 0 hrs 0 min`

**Subject (paste):**

~~~
The 47 Airbnb tax deductions most hosts miss (free guide)
~~~

**Preheader (paste):**

~~~
A reader of {$leadExfield[2]} sent me this. Most overlap with what you already track.
~~~

**Body (paste between fences):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 3 -----8<-----

{$name},

Quick one. Free thing.

Three years of conversations with serious STR hosts surfaced a pattern: every host misses 8-12 deductions a year that they're entitled to. Most of the gap is depreciation (the biggest deduction, the most-skipped) but there's also a long tail — the Augusta rule, §195 startup costs, the QBI safe harbor, the STR loophole flip — that compound to $5K-$50K of deferred or unclaimed tax savings depending on the host.

I wrote it up. 47 deductions, organized by category, each with the Schedule E line, the IRS reference, and why most hosts miss it.

Free for buyers of any STR Ledger workbook:

→ [Download "47 Airbnb Tax Deductions Most Hosts Miss"]({{ link_thestrledger }}/47?email={$name})

It pairs with {$leadExfield[2]} — the workbook tracks the deductions; the guide tells you which ones to look for in the first place.

— Emily

P.S. The guide includes a companion Excel checklist. Captured? Y/N + YTD $ tracking per row. Same Excel + Google Sheets compatibility. Free with the PDF.

-----8<----- END EMAIL 3 -----8<-----

### Email 4 of 10 — Etsy review request

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_etsy_review`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E4 - Day 9 - Etsy review request`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `4 d 0 hrs 0 min`

**Subject (paste):**

~~~
Quick favor (worth 4 minutes of your morning)
~~~

**Preheader (paste):**

~~~
Etsy reviews are how new sellers like me get found. Honest feedback only, including the tough kind.
~~~

**Body (paste between fences):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 4 -----8<-----

{$name},

Quick ask.

Etsy reviews are the single biggest growth lever for new sellers like me. Without them, my listings rank below sellers with hundreds of reviews — even if my templates are better.

If {$leadExfield[2]} has been useful, would you leave an honest review? Takes 4 minutes:

→ [Leave a review for order #{$leadExfield[4]}]({{ link_etsy_review }})

A few notes:

  · Honest is what I want. If something didn't work for you, I'd rather know on Etsy where I can publicly fix it (or refund you) than hear it later.
  · 5 stars are great. 4 stars with a specific note are even better — they show me where to improve.
  · If something is genuinely broken, please reply to THIS email FIRST so I can fix it. Don't take it to Etsy if I can fix it in 24 hours.

That's it. No incentive, no discount, no nudge — Etsy ToS prohibits incentivizing reviews and I respect the rule. Just a request from someone trying to build something useful.

— Emily

P.S. Even if you don't leave a review: thank you for buying. Etsy sellers see who bought what; you supported a small operator + the templates you got back.

-----8<----- END EMAIL 4 -----8<-----

### Email 5 of 10 — The 1 mistake your tax form makes

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_thestrledger`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E5 - Day 14 - The 1 mistake your tax form makes`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `5 d 0 hrs 0 min`

**Subject (paste):**

~~~
The Schedule E mistake your tax form makes by default
~~~

**Preheader (paste):**

~~~
TurboTax + H&R Block both default-categorize cleaning fees this way. It's wrong.
~~~

**Body (paste between fences):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 5 -----8<-----

{$name},

A tax-day landmine specific to STR hosts:

> When TurboTax (or H&R Block, or FreeTaxUSA) imports your 1099-K from Airbnb, it often categorizes the cleaning fee paid by guests as "income" — and the cleaning fee paid to your cleaner as "expense."

Both lines are correct. But the cleaning fee CHARGED to guests should land on Schedule E Line 3 (Rents Received) NOT a separate income category. And the cleaning fee PAID to cleaners is Line 8 (Cleaning + Maintenance) NOT a generic Line 19 "Other."

The common error: filing the cleaning fees as a wash (revenue cancels expense). The IRS sees this as under-reported gross rents — even though the net is the same — and flags the return for closer review.

This is the kind of thing the Single-Property P&L Tracker (TAX-002) handles automatically — every expense category dropdown-enforced and pre-mapped to the correct Schedule E line.

If you didn't already buy it: [TAX-002 — $27]({{ link_thestrledger }}/p/single-property-pl?utm_source=email&utm_campaign=post-purchase&utm_content=email5)

If you did, run a sanity-check on last year's filing. Most hosts find at least one mis-mapped category.

— Emily

P.S. This is also why I built the 47-deductions guide. If you didn't grab it: [Download here]({{ link_thestrledger }}/47).

-----8<----- END EMAIL 5 -----8<-----

### Email 6 of 10 — The cross-sell pivot

> ⚠️ **TODO — IS does NOT support Liquid conditionals (`{% if %}`).** This email has conditional logic that won't render. Either rewrite as single-version copy OR split into per-SKU branches using Filter Condition nodes on the canvas.
> ⚠️ **TODO — Tokens NOT in IS field map:** `link_thestrledger`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E6 - Day 21 - The cross-sell pivot`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `7 d 0 hrs 0 min`

**Subject (paste):**

~~~
Hosts who bought {$leadExfield[2]} usually grab this next
~~~

**Preheader (paste):**

~~~
Not because I sell it. Because the math chains.
~~~

**Body (paste between fences):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 6 -----8<-----

{$name},

Three weeks in. Quick check-in.

The most-common second-purchase from buyers of {$leadExfield[2]} is: **{$leadExfield[5]}**.

Why those two together:
{% if sku_code contains "TAX-001" %}
The Mileage Log captures Schedule E Line 7 (Auto/travel). The next workbook most hosts grab — the Single-Property P&L Tracker — captures every other Schedule E line. Combined, your year-end Schedule E summary is one page, ready for CPA hand-off.
{% elsif sku_code contains "TAX-002" %}
The Single-Property P&L tracks one property's Schedule E line items. The next workbook most hosts grab — the Mileage Log — captures Schedule E Line 7 specifically (which the P&L hands off to). Together they close the auto/travel + revenue + expenses gap.
{% elsif sku_code contains "ACQ-001" %}
The Deal Analyzer underwrites year 1. The next workbook most hosts grab — the 5-Year Pro Forma — projects years 2-5 with debt amortization, depreciation, and exit value. Together they answer "does this deal cash flow AND build wealth?"
{% else %}
The two workbooks share data conventions and compose into one operating system. Buying both saves vs. buying separately.
{% endif %}

→ [{$leadExfield[5]}]({$leadExfield[6]})

If you've already bought it, ignore this. I'll send you something different on Monday.

— Emily

P.S. If you're in the market for multiple workbooks, the bundles save more than à la carte: [Bundles overview]({{ link_thestrledger }}/bundles). Won't pitch the bundles directly in this sequence — that's a separate flow if you bought one of the bundle's component SKUs.

-----8<----- END EMAIL 6 -----8<-----

### Email 7 of 10 — The single biggest STR tax trap

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_thestrledger`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E7 - Day 30 - The single biggest STR tax trap`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `9 d 0 hrs 0 min`

**Subject (paste):**

~~~
The biggest tax trap for serious STR hosts (it's not what you think)
~~~

**Preheader (paste):**

~~~
It's not depreciation. It's not the home office deduction. It's the schedule.
~~~

**Body (paste between fences):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 7 -----8<-----

{$name},

Quick story from a host I worked with last year.

She bought a vacation rental, ran it well, made $52K in net rental income in year 2. Filed Schedule E. Smooth.

Her CPA never asked her one question: *"Are you providing substantial services to guests?"*

She was. Daily housekeeping during stays. Pre-stocked groceries. Concierge bookings for activities. She was running a hospitality operation, not a rental operation. Per IRS guidance, that flips her from Schedule E (passive rental income) to Schedule C (active business income).

Schedule C means SE tax — 15.3% on top of regular income. Schedule C also means §179 immediate expensing, Solo 401(k) shelter, and QBI 20% deduction.

The decision matters by $5K-$15K for a typical operator. Filing Schedule E when it should be Schedule C = audit risk + back-tax. Filing Schedule C when it should be Schedule E = unnecessary 15.3% SE tax.

The Self-Employment Tax Calculator (TAX-008) walks the decision cleanly. It also computes the SE tax math + the 50% above-the-line deduction most hosts miss + Solo 401(k) limits.

→ [TAX-008 Self-Employment Tax Calculator — $27]({{ link_thestrledger }}/p/se-tax?utm_source=email&utm_campaign=post-purchase&utm_content=email7)

— Emily

P.S. If you're sure you're Schedule E (no substantial services, no material participation flip), ignore. Most STR hosts ARE Schedule E. But knowing for sure beats assuming.

-----8<----- END EMAIL 7 -----8<-----

### Email 8 of 10 — Bundle hint (light touch)

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_thestrledger`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E8 - Day 40 - Bundle hint (light touch)`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `10 d 0 hrs 0 min`

**Subject (paste):**

~~~
Quick math: 4 STR workbooks for $97 (vs $138 à la carte)
~~~

**Preheader (paste):**

~~~
Most buyers of {$leadExfield[2]} eventually grab 3-4 more. Bundle is cheaper.
~~~

**Body (paste between fences):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 8 -----8<-----

{$name},

Math note.

Most buyers of {$leadExfield[2]} eventually own 3-4 STR Ledger workbooks within 12 months. The most-common combinations form bundles I built specifically for them.

If you're already 1 SKU in and considering more:

  · **First-Year Host Bundle** — $97 (4 SKUs, save $41) — for buyers in year 1 of operation
  · **Year-2 Operator Bundle** — $147 (4 SKUs, save $41) — for buyers in year 2+ optimizing
  · **Portfolio Bundle** — $397 (14 SKUs, save ~$200) — for 3+ properties / multi-LLC operators

→ [Bundles overview]({{ link_thestrledger }}/bundles)

Your existing purchase credits toward whichever bundle you upgrade to.

If you don't need more right now, ignore. The à la carte SKUs stay available individually.

— Emily

P.S. Etsy doesn't carry the Portfolio Bundle (own-site only — premium tier). The First-Year and Year-2 bundles are on both.

-----8<----- END EMAIL 8 -----8<-----

### Email 9 of 10 — Free guide reminder + soft cross-sell

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_thestrledger`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E9 - Day 50 - Free guide reminder + soft cross-sell`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `10 d 0 hrs 0 min`

**Subject (paste):**

~~~
Did you grab the 47-deductions guide?
~~~

**Preheader (paste):**

~~~
Some readers buy the workbook, skip the free guide, miss the deductions. Don't.
~~~

**Body (paste between fences):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 9 -----8<-----

{$name},

Touchpoint check.

Three weeks ago I sent the 47-deductions guide. Some readers buy a workbook, skip the free guide, then miss 8-12 deductions a year. Don't be that reader.

→ [47 Airbnb Tax Deductions Most Hosts Miss (free)]({{ link_thestrledger }}/47)

The PDF is the read-once version. The Excel checklist is the year-round capture tool. Both free.

— Emily

P.S. The Excel checklist's biggest value is the YTD $ rollup — running total of deductions captured across all 47 categories. Most hosts under-claim by $5-15K/year because they forget what they're entitled to. The checklist + the workbook you bought together close that gap.

-----8<----- END EMAIL 9 -----8<-----

### Email 10 of 10 — Last note in this sequence + what's next

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_thestrledger`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E10 - Day 60 - Last note in this sequence + what's next`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `10 d 0 hrs 0 min`

**Subject (paste):**

~~~
Last note in this sequence (subscribe to the newsletter?)
~~~

**Preheader (paste):**

~~~
You'll hear less from me after this. Once a week if you stay subscribed.
~~~

**Body (paste between fences):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 10 -----8<-----

{$name},

Last email in the post-purchase sequence.

You'll hear less from me after this — about once a week, on Wednesday mornings. The newsletter covers:

  · One STR-tax tactic per week (specific, actionable, IRS-cited)
  · Quarterly market updates (rates, regulation, demand patterns)
  · New workbook releases (announced first to existing buyers, with first-look pricing)

If that's not your speed: [unsubscribe here]({{ link_thestrledger }}/unsub) — no hard feelings, no won't-they-please-stay popups.

If it IS your speed: stay subscribed. The Wednesday newsletter starts next week with a tactic that saves most STR hosts $1,200-$3,800/year (the Augusta rule). Specific, defensible, often missed.

Thanks for buying {$leadExfield[2]}. Hope it's been useful.

— Emily · The STR Ledger

P.S. If you ever have a question, hit reply. Real humans, fast replies. Even after the sequences end.

-----8<----- END EMAIL 10 -----8<-----


---

# Paste Sheet — review-request

> **Auto-generated from:** `copy\email-sequences\review-request.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.
> **Token format:** IS `{$xxx}` (NOT Liquid `{{ xxx }}`). Built-ins → `{$name}`. Custom fields → `{$leadExfield[N]}`.

> ⚠️ **2 of 2 email(s) need manual rewrite before pasting.** See per-email TODOs below.

## IS UI setup

1. **Processes → New process** (or open existing)
2. **Process name:** `review-request`
3. **Trigger node:** `Tag applied` → tag = `purchased:day5`
   - Toggle ON: "Perform only once for an object"
   - Entry filter: `Tags | Doesn't match | do-not-email` (+ `refund-filed`, `unsubscribed` as additional rows)
4. **Add 2 Send email node(s)** below in order. Per-email config follows.
5. **End of process** node at the end.
6. **Save and Activate.**

Repeat for kill-switch: separate small Process triggered by `Tag applied = do-not-email` → Remove from list `STR Ledger — Contacts` → End of process. (Built once, applies to every sequence.)

---

### Email 1 of 2 — The ask

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_etsy_review`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E1 - Day 7 - The ask`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `7 d 0 hrs 0 min`

**Subject (paste):**

~~~
Quick favor — 60-second review of {$leadExfield[2]}?
~~~

**Preheader (paste):**

~~~
If it's working. If it's not, please email me first.
~~~

**Body (paste between fences):**

-----8<----- BEGIN review-request EMAIL 1 -----8<-----

{$name},

A week in with {$leadExfield[2]} — how's it going?

If it's working: would you take 60 seconds and leave an honest Etsy review? Reviews are how new buyers decide whether to trust a small shop, and yours genuinely moves the needle for me.

→ [Leave a review on Etsy]({{ link_etsy_review }})

If something's off — a formula isn't behaving, a tab confuses you, anything — please email me at hello@thestrledger.com first. I'd rather fix it than have you write a frustrated review I can't respond to.

That's it. No script, no star-count ask. Just honest feedback if you've got 60 seconds.

— Emily · The STR Ledger

P.S. If you've already left one — thank you. Skip this email.

-----8<----- END EMAIL 1 -----8<-----

### Email 2 of 2 — Last-chance ask

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_etsy_review`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E2 - Day 14 - Last-chance ask`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `7 d 0 hrs 0 min`

**Subject (paste):**

~~~
Last note on this — review or feedback either way
~~~

**Preheader (paste):**

~~~
Two weeks in. Won't ask again after this.
~~~

**Body (paste between fences):**

-----8<----- BEGIN review-request EMAIL 2 -----8<-----

{$name},

Two weeks since you picked up {$leadExfield[2]}. One more nudge then I'll stop.

If the workbook is doing the job — an honest Etsy review helps the next buyer figure out whether it's right for them:

→ [Review {$leadExfield[2]}]({{ link_etsy_review }})

If it's NOT doing the job, I want to know. Reply to this email or write to hello@thestrledger.com. Specific feedback ("the depreciation tab confused me", "I expected a feature that wasn't there") makes the next version better — for you and for everyone else.

Either way — review, feedback, or silence — that's the last you'll hear from me on this. Different topic next week: the most-overlooked Schedule E line for {$leadExfield[1]} buyers (it's not what you think).

Thanks again for picking up the workbook.

— Emily

P.S. Etsy reviews can be edited later. If you leave 4 stars now and the workbook saves you 3 hours at tax time, you can come back and bump it.

-----8<----- END EMAIL 2 -----8<-----


---

# Paste Sheet — refund-recovery

> **Auto-generated from:** `copy\email-sequences\refund-recovery.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.
> **Token format:** IS `{$xxx}` (NOT Liquid `{{ xxx }}`). Built-ins → `{$name}`. Custom fields → `{$leadExfield[N]}`.

> ⚠️ **2 of 2 email(s) need manual rewrite before pasting.** See per-email TODOs below.

## IS UI setup

1. **Processes → New process** (or open existing)
2. **Process name:** `refund-recovery`
3. **Trigger node:** `Tag applied` → tag = `refund-filed`
   - Toggle ON: "Perform only once for an object"
   - Entry filter: `Tags | Doesn't match | do-not-email` (+ `refund-filed`, `unsubscribed` as additional rows)
4. **Add 2 Send email node(s)** below in order. Per-email config follows.
5. **End of process** node at the end.
6. **Save and Activate.**

Repeat for kill-switch: separate small Process triggered by `Tag applied = do-not-email` → Remove from list `STR Ledger — Contacts` → End of process. (Built once, applies to every sequence.)

---

### Email 1 of 2 — The apology + the question

> ⚠️ **TODO — Tokens NOT in IS field map:** `refunded_sku_name`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E1 - Day 1 - The apology + the question`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `1 d 0 hrs 0 min`

**Subject (paste):**

~~~
Sorry the workbook didn't land — quick question
~~~

**Preheader (paste):**

~~~
Refund processed. One small ask if you have 30 seconds.
~~~

**Body (paste between fences):**

-----8<----- BEGIN refund-recovery EMAIL 1 -----8<-----

{$name},

Just confirmed your refund for {{ refunded_sku_name }} — should be back on your card within 3-5 business days (Etsy/Stripe handles the timing, not me).

I'm writing because I'd rather learn than lose. If you've got 30 seconds, would you tell me what went wrong? One sentence is plenty:

  · Wrong fit — expected something different
  · Too complex — opened it and felt overwhelmed
  · Too simple — already had this in my own spreadsheet
  · Bug or formula issue — something didn't work
  · Changed mind — no specific reason
  · Other — [tell me]

Just hit reply. No script, no follow-up survey. The workbook gets better when buyers tell me where it missed.

If there's a different workbook in the catalog that would actually fit — I'm happy to point you at it (no obligation, no upsell). Reply and tell me your situation.

— Emily · The STR Ledger

P.S. Refunds are part of the deal. The 14-day no-questions policy is real and I don't take it personally. The only bad outcome is silence — that's the version I can't fix.

-----8<----- END EMAIL 1 -----8<-----

### Email 2 of 2 — One last "is there a better fit?"

> ⚠️ **TODO — Tokens NOT in IS field map:** `refunded_sku_name`, `refunded_sku_code`, `link_alternate_sku`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E2 - Day 7 - One last "is there a better fit?"`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `6 d 0 hrs 0 min`

**Subject (paste):**

~~~
One thought before you go
~~~

**Preheader (paste):**

~~~
A different workbook might fit better. No pressure.
~~~

**Body (paste between fences):**

-----8<----- BEGIN refund-recovery EMAIL 2 -----8<-----

{$name},

Last note from me on this.

If {{ refunded_sku_name }} wasn't the right fit, there's a chance another workbook in the catalog is — without me knowing your specific situation, I can only guess, but here's the most-common pattern:

**If you refunded {{ refunded_sku_code }} because it was too tax-focused** → the operating workbooks (RevPAR Dashboard, Cleaning Fee Optimizer) might fit better. They're for *running* the property, not filing.

**If you refunded because it was too operational** → the tax workbooks (Schedule E Tax-Prep, Mileage Log) are narrower and finish-it-and-file.

**If you refunded because the catalog feels like too much** → the bundles solve "I don't know which one I need" — pick the persona that matches you (First-Year Host, Year-2 Operator, Portfolio).

→ [Browse the catalog]({{ link_alternate_sku }})

No discount code, no "come back" pitch. If nothing fits, nothing fits. The newsletter (free, weekly, no SKU pitches in 80% of issues) is the lowest-pressure way to stay in touch — and you'll see when something I build genuinely matches your situation.

That's the last I'll send on this. Thanks for giving the workbook a try.

— Emily

P.S. If the refund was about the workbook itself (a bug, a confusing tab, a missing feature) and not about fit — please tell me. That's the feedback I act on fastest.

-----8<----- END EMAIL 2 -----8<-----


---

# Paste Sheet — welcome-book-magnet

> **Auto-generated from:** `copy\email-sequences\welcome-book-magnet.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.
> **Token format:** IS `{$xxx}` (NOT Liquid `{{ xxx }}`). Built-ins → `{$name}`. Custom fields → `{$leadExfield[N]}`.

> ⚠️ **5 of 5 email(s) need manual rewrite before pasting.** See per-email TODOs below.

## IS UI setup

1. **Processes → New process** (or open existing)
2. **Process name:** `welcome-book-magnet`
3. **Trigger node:** `Tag applied` → tag = `lead-magnet:welcome-book`
   - Toggle ON: "Perform only once for an object"
   - Entry filter: `Tags | Doesn't match | do-not-email` (+ `refund-filed`, `unsubscribed` as additional rows)
4. **Add 5 Send email node(s)** below in order. Per-email config follows.
5. **End of process** node at the end.
6. **Save and Activate.**

Repeat for kill-switch: separate small Process triggered by `Tag applied = do-not-email` → Remove from list `STR Ledger — Contacts` → End of process. (Built once, applies to every sequence.)

---

### Email 1 of 5 — Deliver + the question every welcome book misses

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_starter_pdf`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E1 - Day 0 - Deliver + the question every welcome book misses`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **Immediately after previous step** (0 d 0 hrs 0 min)

**Subject (paste):**

~~~
Your 5-Tab Welcome Book Starter (and the question every host misses)
~~~

**Preheader (paste):**

~~~
It's the one your guest texts you about at 9 PM on a Saturday.
~~~

**Body (paste between fences):**

-----8<----- BEGIN welcome-book-magnet EMAIL 1 -----8<-----

Hey {$name},

Here's the file: [Download The 5-Tab Welcome Book Starter →]({{ link_starter_pdf }})

Quick story before you open it.

Three years into hosting, our review average had been stuck at 4.78 for as long as I could remember. Not bad. Not great. The kind of average that costs you the Superhost badge by 0.02 stars in a bad quarter.

I went back through eighteen months of reviews looking for the pattern. Almost half of the under-5-star reviews mentioned the same thing in different words: "took us a while to figure out X." The TV remote. The thermostat. Where the coffee filters were. Whether the hot tub was the loud one or the quiet one. Why the Wi-Fi was named after our dog.

None of those are guest-failure problems. They're welcome-book problems. We just didn't have one — we had a Word doc with a sad header image that nobody read.

So I built one. Thirteen tabs. Eighty local picks. The starter you just downloaded is five of those tabs, the highest-leverage five. Use it on one property this weekend. See if a guest texts you less.

I'll send you the next note in two days — about the one tab most hosts skip and shouldn't.

Talk then,
Emily · The STR Ledger

P.S. If this email landed in Promotions, drag it to Primary so the next four show up. Email providers are weird about new senders.

-----8<----- END EMAIL 1 -----8<-----

### Email 2 of 5 — The local guide nobody writes (the 9 PM question)

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_welcome_book`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E2 - Day 2 - The local guide nobody writes (the 9 PM question)`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `2 d 0 hrs 0 min`

**Subject (paste):**

~~~
"Where do you eat?" (the question your welcome book has to answer)
~~~

**Preheader (paste):**

~~~
It's the most-asked guest question in the history of short-term rentals.
~~~

**Body (paste between fences):**

-----8<----- BEGIN welcome-book-magnet EMAIL 2 -----8<-----

{$name},

Quick one today.

Look at any host Slack, any Airbnb subreddit, any STR Facebook group. Ask which question guests text most often.

It's not the door code. It's not the Wi-Fi. It's some version of:

> "Hey — any food recommendations? Where do you go?"

Usually at 8 or 9 PM, after they've unpacked, and they're hungry.

The starter you downloaded has 12 local-pick categories. The full Welcome Book has 80 picks across 20 categories — coffee shops by drive-thru and not, dinner cheap and nice, the one grocery store that's actually open at 9 PM, the ATM that doesn't charge a fee, where to get a bagel on Sunday morning.

Eighty picks sounds like overkill until you realize you're answering the same five texts a week.

Here's the workbook: [The Welcome Book — $47 →]({{ link_welcome_book }})

A week from now I'll send you the tab most hosts skip — the one Airbnb and VRBO are about to start requiring.

— Emily

P.S. If you've already filled out the starter and want to upgrade to the full 13-tab version, the $47 price holds for the rest of this email sequence. After Day 21 it's $67.

-----8<----- END EMAIL 2 -----8<-----

### Email 3 of 5 — The safety tab most hosts skip (and the new platform rule)

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_welcome_book`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E3 - Day 7 - The safety tab most hosts skip (and the new platform rule)`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `5 d 0 hrs 0 min`

**Subject (paste):**

~~~
The 6 disclosures Airbnb is about to start asking for
~~~

**Preheader (paste):**

~~~
Two of them are already required in three states. The rest are coming.
~~~

**Body (paste between fences):**

-----8<----- BEGIN welcome-book-magnet EMAIL 3 -----8<-----

{$name},

The Welcome Book had 12 tabs until two weeks ago.

I added Tab 8 — Safety & Disclosures — after a flurry of platform-policy updates and a state-level STR law that my city council passed in March. Six fields, plain English, written for the guest:

  1. Smoke alarms — locations + last-tested date
  2. CO detectors — locations + last-tested date
  3. Fire extinguisher — location + last-service date
  4. First-aid kit — location
  5. Emergency exits — front + alternate
  6. Local STR registration number — posted at entry

Two of those are already required disclosures in California, Washington, and parts of Colorado. The rest are increasingly platform-required (Airbnb's Safety Disclosure prompt, VRBO's Safety Section). The hosts who stay ahead of these don't get listings down-ranked when policy changes.

The starter PDF you downloaded doesn't include this tab — it's full-product only. Here it is: [The Welcome Book →]({{ link_welcome_book }})

One more email coming on Day 14, then the offer closes.

— Emily

P.S. None of this is legal advice. The disclosures cover platform requirements and the most common state-law triggers, but if you're in NYC, Honolulu, or Santa Monica, check local law specifically — those three are doing things differently.

-----8<----- END EMAIL 3 -----8<-----

### Email 4 of 5 — What it actually looks like in your guest's hands

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_welcome_book`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E4 - Day 14 - What it actually looks like in your guest's hands`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `7 d 0 hrs 0 min`

**Subject (paste):**

~~~
What our guests see when they walk in
~~~

**Preheader (paste):**

~~~
It's a 24-page PDF. Here's how we use it.
~~~

**Body (paste between fences):**

-----8<----- BEGIN welcome-book-magnet EMAIL 4 -----8<-----

{$name},

I want to show you the workflow we use, since it's the difference between "I bought a template" and "this saved me an hour a week."

When a booking comes in:
  1. The Welcome Book lives in a Dropbox folder per property. We update it when something changes — new coffee shop opens, new Wi-Fi router, anything.
  2. Three days before check-in, the Hospitable automation sends the guest a link to the latest PDF.
  3. We also keep a printed copy on the kitchen counter, leather-bound, $14 from Amazon. Looks like a hotel concierge book. Guests photograph the cover for their reviews — I've seen it on probably 30 of ours.

The 80 local picks are the part I get the most thank-yous for. The arrival flow is the part that cuts texts the most. The safety tab is the one I sleep better knowing is there.

Six days left at $47 — after Day 21 the price moves to $67.

[Get the Welcome Book →]({{ link_welcome_book }})

One last note coming Friday.

— Emily

P.S. If the Welcome Book isn't right for you, just hit reply and tell me what's missing. I read every reply, and I've added three of the eighty local-pick categories based on host suggestions.

-----8<----- END EMAIL 4 -----8<-----

### Email 5 of 5 — The price moves tomorrow

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_welcome_book`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E5 - Day 20 - The price moves tomorrow`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `6 d 0 hrs 0 min`

**Subject (paste):**

~~~
Tomorrow the price moves to $67
~~~

**Preheader (paste):**

~~~
Last note from this sequence — last day at $47.
~~~

**Body (paste between fences):**

-----8<----- BEGIN welcome-book-magnet EMAIL 5 -----8<-----

{$name},

Last note from me on this one.

Twenty days ago you downloaded the 5-tab starter. The full 13-tab Welcome Book has been $47 every email since — that price expires at midnight tomorrow.

After that it's $67. (Still less than one bad review costs you in dynamic-pricing rank, but $20 more than today.)

Here it is one more time: [The Welcome Book — $47 thru tomorrow →]({{ link_welcome_book }})

If you already bought it, ignore me, and thank you. If you're not going to buy it, that's fine too — the starter PDF is yours to keep, and I'll send you one note a month from here on, no more sales sequences.

Either way, build a welcome book. Ours or someone else's. Your reviews will thank you.

— Emily · The STR Ledger

P.S. The bundle (Welcome Book + Turnover Checklist + Local Recs add-on) is $79 and will be live next month. If you'd rather wait for that, hit reply and I'll send you a heads-up when it launches.

-----8<----- END EMAIL 5 -----8<-----


---

# Paste Sheet — abandoned-cart

> **Auto-generated from:** `copy\email-sequences\abandoned-cart.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.
> **Token format:** IS `{$xxx}` (NOT Liquid `{{ xxx }}`). Built-ins → `{$name}`. Custom fields → `{$leadExfield[N]}`.

> ⚠️ **3 of 3 email(s) need manual rewrite before pasting.** See per-email TODOs below.

## IS UI setup

1. **Processes → New process** (or open existing)
2. **Process name:** `abandoned-cart`
3. **Trigger node:** `Tag applied` → tag = `checkout-abandoned`
   - Toggle ON: "Perform only once for an object"
   - Entry filter: `Tags | Doesn't match | do-not-email` (+ `refund-filed`, `unsubscribed` as additional rows)
4. **Add 3 Send email node(s)** below in order. Per-email config follows.
5. **End of process** node at the end.
6. **Save and Activate.**

Repeat for kill-switch: separate small Process triggered by `Tag applied = do-not-email` → Remove from list `STR Ledger — Contacts` → End of process. (Built once, applies to every sequence.)

---

### Email 1 of 3 — The friction-finder

> ⚠️ **TODO — Tokens NOT in IS field map:** `cart_sku_name`, `cart_price`, `link_product_page`, `link_resume_checkout`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E1 - 1 hour after abandonment - The friction-finder`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `0 d 1 hrs 0 min`

**Subject (paste):**

~~~
Your cart for {{ cart_sku_name }} — anything I can fix?
~~~

**Preheader (paste):**

~~~
Came up to checkout and stopped. No pressure — just want to know if something's broken.
~~~

**Body (paste between fences):**

-----8<----- BEGIN abandoned-cart EMAIL 1 -----8<-----

{$name},

I noticed you started checkout for {{ cart_sku_name }} ({{ cart_price }}) and didn't finish.

That's totally fine — most often it's just "got distracted, will come back" — but if something on the checkout page broke or felt off, I want to know:

  · Card declined? Stripe sometimes flags first-time charges; try again or use a different card.
  · Confused about what's included? Here's the [full feature list]({{ link_product_page }}).
  · Want to ask a question first? Reply to this email — I read everything within 24 hours.
  · Want to come back later? Your link still works:

→ [Resume checkout — {{ cart_price }}]({{ link_resume_checkout }})

That's it. No pressure, no "limited-time" tricks. The price is the price, the workbook isn't going anywhere.

— Emily · The STR Ledger

P.S. The 14-day no-questions refund is real. If you're worried about buyer's remorse — that's the safety net.

-----8<----- END EMAIL 1 -----8<-----

### Email 2 of 3 — The "why operators buy this" pitch

> ⚠️ **TODO — IS does NOT support Liquid conditionals (`{% if %}`).** This email has conditional logic that won't render. Either rewrite as single-version copy OR split into per-SKU branches using Filter Condition nodes on the canvas.
> ⚠️ **TODO — Tokens NOT in IS field map:** `cart_sku_name`, `cart_price`, `link_resume_checkout`, `link_product_page`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E2 - 24 hours later - The "why operators buy this" pitch`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `0 d 23 hrs 0 min`

**Subject (paste):**

~~~
Re: {{ cart_sku_name }} — one specific use-case
~~~

**Preheader (paste):**

~~~
What this saves vs the manual version.
~~~

**Body (paste between fences):**

-----8<----- BEGIN abandoned-cart EMAIL 2 -----8<-----

{$name},

Quick follow-up on {{ cart_sku_name }}.

Most operators looking at this workbook are solving one of these specific problems:

{% if cart_sku_code starts with "TAX-" %}
  · "Tax season is coming and my receipts/spreadsheets are scattered across 4 systems"
  · "My CPA is charging me extra because my numbers don't tie out"
  · "I'm pretty sure I'm leaving deductions on the table but don't know which"
{% elsif cart_sku_code starts with "ACQ-" %}
  · "I'm looking at a property and the listing photos lie about what STR can earn"
  · "I want to underwrite the deal myself, not trust a broker's spreadsheet"
  · "I need to know my actual break-even occupancy before I write the offer"
{% elsif cart_sku_code starts with "FIN-" or starts with "REV-" or starts with "MKT-" %}
  · "I'm running the property fine but I have no idea if my numbers are good or bad vs market"
  · "I'm leaving money on the table but can't tell where"
  · "Pricing tools cost $30-50/mo each — I want to see if I'd actually use one before paying"
{% elsif cart_sku_code starts with "BUNDLE-" %}
  · "I want the integrated stack, not 4 separate purchases"
  · "I'm at the point where one workbook isn't enough — I need the system"
{% else %}
  · "I'm 6-12 months into hosting and the spreadsheets I cobbled together aren't holding up"
  · "I want one workbook that actually fits how STR operators work, not generic small-business stuff"
{% endif %}

If any of those is your situation, the {{ cart_price }} pays itself back the first time you use it. If none of them is — that's your sign it's not the right fit, and that's also fine.

→ [Resume checkout — {{ cart_price }}]({{ link_resume_checkout }})

Or: [browse the catalog]({{ link_product_page }}) if a different workbook is closer to your problem.

— Emily

P.S. If you're holding back because of price — the bundles ($97-497) often pencil better than buying single SKUs. Three SKUs in a bundle = the price of two à la carte.

-----8<----- END EMAIL 2 -----8<-----

### Email 3 of 3 — Last note

> ⚠️ **TODO — Tokens NOT in IS field map:** `cart_sku_name`, `cart_price`, `link_resume_checkout`, `link_product_page`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E3 - 72 hours later - Last note`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `2 d 0 hrs 0 min`

**Subject (paste):**

~~~
Last note on {{ cart_sku_name }}
~~~

**Preheader (paste):**

~~~
Going quiet on this. Newsletter continues.
~~~

**Body (paste between fences):**

-----8<----- BEGIN abandoned-cart EMAIL 3 -----8<-----

{$name},

Last note on the cart you started — {{ cart_sku_name }} at {{ cart_price }}.

Your checkout link is still live:

→ [Resume checkout]({{ link_resume_checkout }})

If now isn't the right time, no problem. The workbook isn't going on sale and the price isn't going up — coming back next week or next month works the same.

Going quiet on this specific cart now. You'll still get the weekly newsletter (which is mostly tactical STR content, not pitches), and if a different workbook in the catalog turns out to fit your situation better, that's a good outcome too.

→ [Browse all 65 workbooks]({{ link_product_page }})

Thanks for almost picking it up — that genuinely matters at this scale.

— Emily · The STR Ledger

P.S. If something about the checkout itself stopped you (card error, confusion about delivery, anything), reply to this email and I'll fix it. Bug reports from abandoned carts are how I find broken-checkout problems before they cost real money.

-----8<----- END EMAIL 3 -----8<-----


---

# Paste Sheet — win-back

> **Auto-generated from:** `copy\email-sequences\win-back.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.
> **Token format:** IS `{$xxx}` (NOT Liquid `{{ xxx }}`). Built-ins → `{$name}`. Custom fields → `{$leadExfield[N]}`.

> ⚠️ **3 of 3 email(s) need manual rewrite before pasting.** See per-email TODOs below.

## IS UI setup

1. **Processes → New process** (or open existing)
2. **Process name:** `win-back`
3. **Trigger node:** `Tag applied` → tag = `inactive-30d`
   - Toggle ON: "Perform only once for an object"
   - Entry filter: `Tags | Doesn't match | do-not-email` (+ `refund-filed`, `unsubscribed` as additional rows)
4. **Add 3 Send email node(s)** below in order. Per-email config follows.
5. **End of process** node at the end.
6. **Save and Activate.**

Repeat for kill-switch: separate small Process triggered by `Tag applied = do-not-email` → Remove from list `STR Ledger — Contacts` → End of process. (Built once, applies to every sequence.)

---

### Email 1 of 3 — Are you still in?

> ⚠️ **TODO — Tokens NOT in IS field map:** `months_since_last_open`, `link_newsletter_archive`, `link_unsub`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E1 - Day 0 - Are you still in?`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **Immediately after previous step** (0 d 0 hrs 0 min)

**Subject (paste):**

~~~
{$name} — should I keep emailing you?
~~~

**Preheader (paste):**

~~~
Honest question. {{ months_since_last_open }} months since you last opened.
~~~

**Body (paste between fences):**

-----8<----- BEGIN win-back EMAIL 1 -----8<-----

{$name},

Honest question: it's been {{ months_since_last_open | default: "a while" }} months since you opened anything from me, and I'd rather you tell me to leave than keep showing up uninvited.

Three options. Pick one:

**1. Stay in — I just got busy.**
Click anywhere in this email (the link below works). I'll keep sending the newsletter and stop counting opens for a while.

→ [Yes, keep me on]({{ link_newsletter_archive }})

**2. Quiet for now — newsletter only, no other emails.**
Reply with the word "quiet" and I'll move you to the once-a-month digest list (no product launches, no sequences, just the newsletter).

**3. I'm out — unsubscribe me.**
→ [Unsubscribe]({{ link_unsub }})

Whichever you pick is fine. The only thing that doesn't help either of us is silence — Gmail and Outlook punish me for sending to people who never open, and that hurts the inbox placement of people who actually want to hear from me.

— Emily · The STR Ledger

P.S. If you're still on the fence about STR investing, that's also a perfectly fine reason to leave. The newsletter is for operators who are in the work. Coming back later is always an option.

-----8<----- END EMAIL 1 -----8<-----

### Email 2 of 3 — One concrete thing you missed

> ⚠️ **TODO — Tokens NOT in IS field map:** `link_top_post`, `link_unsub`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E2 - Day 7 - One concrete thing you missed`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `7 d 0 hrs 0 min`

**Subject (paste):**

~~~
The cleaning-fee mistake costing hosts $4-7K/year
~~~

**Preheader (paste):**

~~~
Sample of what the newsletter actually sends. Then I'll quiet down.
~~~

**Body (paste between fences):**

-----8<----- BEGIN win-back EMAIL 2 -----8<-----

{$name},

Quick test before I assume you're gone.

Here's a real piece of what you've been missing — the actual newsletter content, not a pitch:

> Most hosts price the cleaning fee at "what the cleaner charges + $20 buffer." That feels reasonable until you realize: high cleaning fees suppress booking conversion 12-18%, AND Airbnb buries listings with cleaning-fee-to-nightly-rate ratios above 0.4. The optimal pricing is usually $40-80 *under* what hosts initially set — counterintuitive, but the math is consistent across every market I've analyzed.

That's the kind of thing the newsletter sends, weekly, free. No fluff, no SKU pitches in 80% of issues.

If that's useful — keep me in your inbox by [clicking here]({{ link_top_post }}) (loads the full article on cleaning fee math).

If it's not your thing — totally fine, [unsubscribe here]({{ link_unsub }}) and I'll stop. No hard feelings.

— Emily

P.S. One more email after this, then I'll go quiet on my own. Promise.

-----8<----- END EMAIL 2 -----8<-----

### Email 3 of 3 — Last note + sunset

> ⚠️ **TODO — Tokens NOT in IS field map:** `months_since_last_open`, `link_unsub`. Either hardcode the value, add a new custom field, or inject via n8n at send time. See `infrastructure/influencersoft/custom-fields.yaml` § non_is_tokens.

**Block name (rename to):** `E3 - Day 21 - Last note + sunset`

**IS delay setting** (Perform this step → after the previous one with a delay):
- **after the previous one with a delay:** `14 d 0 hrs 0 min`

**Subject (paste):**

~~~
Going quiet — last note from me
~~~

**Preheader (paste):**

~~~
Removing you from broadcast. Not deleted, just paused.
~~~

**Body (paste between fences):**

-----8<----- BEGIN win-back EMAIL 3 -----8<-----

{$name},

This is the last one for now.

Since there's been no opens in {{ months_since_last_open | default: "a while" }} months, I'm moving you off the active broadcast list — your email stays in the system (so you can come back any time without re-subscribing), but you'll stop hearing from me.

If you want to opt back in later: thestrledger.com/newsletter resubscribes you in 10 seconds.

If you want a clean break: [Unsubscribe completely]({{ link_unsub }}).

Either way — thanks for being on the list at all. STR investing is a slow game and most people who subscribe are still figuring out whether the work fits them. That's fine. Coming back when the timing's right is always allowed.

— Emily · The STR Ledger

P.S. If something specific made you tune out (too many emails, wrong topics, life got busy) and you want to tell me — reply to this. I read every reply. The list gets better when people tell me what didn't work.

-----8<----- END EMAIL 3 -----8<-----


---

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


---

# Paste Sheet — BUNDLE-02-aspiring-host

> **Auto-generated from:** `copy\email-sequences\bundles\BUNDLE-02-aspiring-host.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.
> **Token format:** IS `{$xxx}` (NOT Liquid `{{ xxx }}`). Built-ins → `{$name}`. Custom fields → `{$leadExfield[N]}`.

> ⚠️ **4 of 4 email(s) need manual rewrite before pasting.** See per-email TODOs below.

## IS UI setup

1. **Processes → New process** (or open existing)
2. **Process name:** `BUNDLE-02-aspiring-host`
3. **Trigger node:** `Tag applied` → tag = `bundle-cross:aspiring-host`
   - Toggle ON: "Perform only once for an object"
   - Entry filter: `Tags | Doesn't match | do-not-email` (+ `refund-filed`, `unsubscribed` as additional rows)
4. **Add 4 Send email node(s)** below in order. Per-email config follows.
5. **End of process** node at the end.
6. **Save and Activate.**

Repeat for kill-switch: separate small Process triggered by `Tag applied = do-not-email` → Remove from list `STR Ledger — Contacts` → End of process. (Built once, applies to every sequence.)

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


---

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


---

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


---

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
