# Paste Sheet — post-purchase-etsy-buyer

> **Auto-generated from:** `copy\email-sequences\post-purchase-etsy-buyer.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.

## IS UI setup

1. **Automations → New Sequence**
2. **Name:** `post-purchase-etsy-buyer`
3. **Trigger:** When tag `customer:etsy` is added
4. **Then add 10 email(s) below in order.** Set the delay per the header on each.
5. **Save and Activate** when the last email is in.

When done, mark this sequence done in your tracker.

---

### Email 1 of 10 — Order received + delivery

- **Delay (set in IS):** Day 0 (within 5 minutes of order)
- **Subject (copy):**

      Your {{ sku_label }} is ready (download + 3 things to read)

- **Preheader (copy):**

      Order #{{ order_ref }}. Plus the one tab nobody opens until they need it.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 1 -----8<-----

Hey {{ first_name | default: "there" }},

Order #{{ order_ref }} just landed. Here's what you do next:

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

- **Delay (set in IS):** Day 2
- **Subject (copy):**

      Use {{ sku_label }} on this specific thing

- **Preheader (copy):**

      Don't read the manual. Pick the one row that maps to a real situation.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 2 -----8<-----

{{ first_name | default: "Hey" }},

Most STR templates die on the desktop because the buyer never actually fills them out. The DEMO data is sample data; your data is real and feels different.

The cure: pick the most recent specific situation and run it through the workbook.

For {{ sku_label }}, that means: 
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

- **Delay (set in IS):** Day 5
- **Subject (copy):**

      The 47 Airbnb tax deductions most hosts miss (free guide)

- **Preheader (copy):**

      A reader of {{ sku_label }} sent me this. Most overlap with what you already track.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 3 -----8<-----

{{ first_name | default: "Hey" }},

Quick one. Free thing.

Three years of conversations with serious STR hosts surfaced a pattern: every host misses 8-12 deductions a year that they're entitled to. Most of the gap is depreciation (the biggest deduction, the most-skipped) but there's also a long tail — the Augusta rule, §195 startup costs, the QBI safe harbor, the STR loophole flip — that compound to $5K-$50K of deferred or unclaimed tax savings depending on the host.

I wrote it up. 47 deductions, organized by category, each with the Schedule E line, the IRS reference, and why most hosts miss it.

Free for buyers of any STR Ledger workbook:

→ [Download "47 Airbnb Tax Deductions Most Hosts Miss"]({{ link_thestrledger }}/47?email={{ first_name }})

It pairs with {{ sku_label }} — the workbook tracks the deductions; the guide tells you which ones to look for in the first place.

— Emily

P.S. The guide includes a companion Excel checklist. Captured? Y/N + YTD $ tracking per row. Same Excel + Google Sheets compatibility. Free with the PDF.

-----8<----- END EMAIL 3 -----8<-----

### Email 4 of 10 — Etsy review request

- **Delay (set in IS):** Day 9
- **Subject (copy):**

      Quick favor (worth 4 minutes of your morning)

- **Preheader (copy):**

      Etsy reviews are how new sellers like me get found. Honest feedback only, including the tough kind.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 4 -----8<-----

{{ first_name | default: "Hey" }},

Quick ask.

Etsy reviews are the single biggest growth lever for new sellers like me. Without them, my listings rank below sellers with hundreds of reviews — even if my templates are better.

If {{ sku_label }} has been useful, would you leave an honest review? Takes 4 minutes:

→ [Leave a review for order #{{ order_ref }}]({{ link_etsy_review }})

A few notes:

  · Honest is what I want. If something didn't work for you, I'd rather know on Etsy where I can publicly fix it (or refund you) than hear it later.
  · 5 stars are great. 4 stars with a specific note are even better — they show me where to improve.
  · If something is genuinely broken, please reply to THIS email FIRST so I can fix it. Don't take it to Etsy if I can fix it in 24 hours.

That's it. No incentive, no discount, no nudge — Etsy ToS prohibits incentivizing reviews and I respect the rule. Just a request from someone trying to build something useful.

— Emily

P.S. Even if you don't leave a review: thank you for buying. Etsy sellers see who bought what; you supported a small operator + the templates you got back.

-----8<----- END EMAIL 4 -----8<-----

### Email 5 of 10 — The 1 mistake your tax form makes

- **Delay (set in IS):** Day 14
- **Subject (copy):**

      The Schedule E mistake your tax form makes by default

- **Preheader (copy):**

      TurboTax + H&R Block both default-categorize cleaning fees this way. It's wrong.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 5 -----8<-----

{{ first_name | default: "Hey" }},

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

- **Delay (set in IS):** Day 21
- **Subject (copy):**

      Hosts who bought {{ sku_label }} usually grab this next

- **Preheader (copy):**

      Not because I sell it. Because the math chains.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 6 -----8<-----

{{ first_name | default: "Hey" }},

Three weeks in. Quick check-in.

The most-common second-purchase from buyers of {{ sku_label }} is: **{{ xsell_name }}**.

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

→ [{{ xsell_name }}]({{ xsell_url }})

If you've already bought it, ignore this. I'll send you something different on Monday.

— Emily

P.S. If you're in the market for multiple workbooks, the bundles save more than à la carte: [Bundles overview]({{ link_thestrledger }}/bundles). Won't pitch the bundles directly in this sequence — that's a separate flow if you bought one of the bundle's component SKUs.

-----8<----- END EMAIL 6 -----8<-----

### Email 7 of 10 — The single biggest STR tax trap

- **Delay (set in IS):** Day 30
- **Subject (copy):**

      The biggest tax trap for serious STR hosts (it's not what you think)

- **Preheader (copy):**

      It's not depreciation. It's not the home office deduction. It's the schedule.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 7 -----8<-----

{{ first_name | default: "Hey" }},

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

- **Delay (set in IS):** Day 40
- **Subject (copy):**

      Quick math: 4 STR workbooks for $97 (vs $138 à la carte)

- **Preheader (copy):**

      Most buyers of {{ sku_label }} eventually grab 3-4 more. Bundle is cheaper.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 8 -----8<-----

{{ first_name | default: "Hey" }},

Math note.

Most buyers of {{ sku_label }} eventually own 3-4 STR Ledger workbooks within 12 months. The most-common combinations form bundles I built specifically for them.

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

- **Delay (set in IS):** Day 50
- **Subject (copy):**

      Did you grab the 47-deductions guide?

- **Preheader (copy):**

      Some readers buy the workbook, skip the free guide, miss the deductions. Don't.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 9 -----8<-----

{{ first_name | default: "Hey" }},

Touchpoint check.

Three weeks ago I sent the 47-deductions guide. Some readers buy a workbook, skip the free guide, then miss 8-12 deductions a year. Don't be that reader.

→ [47 Airbnb Tax Deductions Most Hosts Miss (free)]({{ link_thestrledger }}/47)

The PDF is the read-once version. The Excel checklist is the year-round capture tool. Both free.

— Emily

P.S. The Excel checklist's biggest value is the YTD $ rollup — running total of deductions captured across all 47 categories. Most hosts under-claim by $5-15K/year because they forget what they're entitled to. The checklist + the workbook you bought together close that gap.

-----8<----- END EMAIL 9 -----8<-----

### Email 10 of 10 — Last note in this sequence + what's next

- **Delay (set in IS):** Day 60
- **Subject (copy):**

      Last note in this sequence (subscribe to the newsletter?)

- **Preheader (copy):**

      You'll hear less from me after this. Once a week if you stay subscribed.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN post-purchase-etsy-buyer EMAIL 10 -----8<-----

{{ first_name | default: "Hey" }},

Last email in the post-purchase sequence.

You'll hear less from me after this — about once a week, on Wednesday mornings. The newsletter covers:

  · One STR-tax tactic per week (specific, actionable, IRS-cited)
  · Quarterly market updates (rates, regulation, demand patterns)
  · New workbook releases (announced first to existing buyers, with first-look pricing)

If that's not your speed: [unsubscribe here]({{ link_thestrledger }}/unsub) — no hard feelings, no won't-they-please-stay popups.

If it IS your speed: stay subscribed. The Wednesday newsletter starts next week with a tactic that saves most STR hosts $1,200-$3,800/year (the Augusta rule). Specific, defensible, often missed.

Thanks for buying {{ sku_label }}. Hope it's been useful.

— Emily · The STR Ledger

P.S. If you ever have a question, hit reply. Real humans, fast replies. Even after the sequences end.

-----8<----- END EMAIL 10 -----8<-----
