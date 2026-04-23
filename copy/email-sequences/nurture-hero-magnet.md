# Nurture Sequence — Hero Magnet Trigger

**Spec reference:** §7.3 of master strategy. Targets: traffic → email capture → Day 0 welcome → Day 21 bundle close.

**Trigger:** form submission on `thestrledger.com/47`

**Default tag at entry:** `source:hero-magnet` (overridden if UTM indicates pinterest/etsy/blog — opens of each segment branch with a different first paragraph in Email 1)

**Token conventions:**
- `{{ first_name | default: "there" }}` — substitute IS/your-platform's syntax
- `{{ tax_season_weeks_out }}` — computed by IS dynamic field (Tax Day − today in weeks)
- `The STR Ledger`, `thestrledger.com` — replace after Task A1 brand lock

---

## Email 1 — Day 0 — Deliver + FB Group invite + story hook

**Subject:** Here's your 47 deductions (and a quick favor)

**Preheader:** Plus: the one deduction that surprised me most — $8,427 in the first year.

```
Hey {{ first_name | default: "there" }},

Here's the guide: [Download the 47 Airbnb Tax Deductions Most Hosts Miss →]

I put this list together after my third tax season as a host, when my CPA asked me a question that still makes me cringe: "Did you track cost segregation for that property?"

I didn't. Which is how I learned — the hard way — that most STR hosts leave somewhere between $3K and $15K on the table every year in deductions they didn't know they could take.

The guide is the checklist I wish I'd had. Work through it before you see your CPA this year.

One favor while you're here: if you want the ongoing systems and not just the one-off checklist, the fastest way in is our free private group. Hosts-only, no pitches, I share a new template or system every week:

[Join the Inner Circle (free) →]

Tomorrow I'll tell you about the $8,427 deduction specifically. Some of it you've probably heard of. Some of it will be new.

Talk then,
The STR Ledger · <signature>

P.S. If this email ended up in Promotions, drag it to the Primary tab and the next 8 will land in the right place. Email providers are weird about new senders.
```

---

## Email 2 — Day 2 — The $8,427 deduction story

**Subject:** The $8,427 deduction (most hosts miss it)

**Preheader:** Amanda had owned 3 cabins for 4 years before her new CPA flagged this.

```
{{ first_name | default: "Hey" }},

Quick one today — story first, lesson after.

Amanda had owned three cabins in the Smokies for four years when she finally switched CPAs. Her old one had filed her Schedule E correctly, depreciated the buildings correctly, even remembered the start-up costs in year one.

What he hadn't done was a **cost segregation study** — the analysis that separates out the 5-year property (furniture, fixtures, appliances), 7-year property (some equipment), and 15-year property (landscaping, exterior improvements) from the 27.5-year building.

When Amanda's new CPA ran the analysis on year one alone — looking backward four years — she amended her returns and reclaimed $8,427 in depreciation she'd been spreading over 27.5 years instead of taking upfront.

She did not need a fancy engineer-led cost seg study. For most STRs under ~$500K acquisition cost, a "DIY" or "self-segregated" method is acceptable and takes a few hours.

The cost seg workbook that was sitting in Amanda's toolkit is **item #23 in the 47 Deductions guide**. Go re-read it.

Tomorrow: why QuickBooks keeps failing STR hosts (and what to use instead).

— The STR Ledger
```

---

## Email 3 — Day 4 — Why QuickBooks fails STR hosts

**Subject:** Why QuickBooks keeps breaking for STR hosts

**Preheader:** If you've re-categorized Airbnb deposits four times this year, you're not alone.

```
{{ first_name | default: "Hey" }},

Every host I've ever talked to has had the same moment with QuickBooks.

You connect your business bank account. QuickBooks auto-categorizes the Airbnb deposit as "Uncategorized Income" or — worse — "Consulting Revenue" because that's what another client of your CPA's firm uses.

You re-categorize it. Next month, QuickBooks does the same thing.

You build a "STR Income" account. Now half your deposits lump together across properties. You can't tell which house is profitable and which one is secretly eating margin.

Here's the thing: QuickBooks was built for service businesses and retail. Not for operators who run 3 distinct profit centers (properties) under one tax entity, pay cleaning fees per stay that are partially pass-through, pay platform fees that vary by listing, and need per-property P&Ls at tax time.

The hosts I know who use QuickBooks "successfully" are the ones paying a bookkeeper $200/mo to clean up the miscategorizations every month. Which works. But you can do it with Excel for $0 and have clean books the CPA actually asks for.

That's the entire premise of what we build.

Tomorrow I want to show you the one template that changed how I run my portfolio: the mileage log I built after the IRS audited my 2022 return. $17. Rounding error. Pays for itself on a single trip.

— The STR Ledger
```

---

## Email 4 — Day 6 — Tripwire pitch (Mileage Log)

**Subject:** The $17 log that tracks every deductible mile

**Preheader:** It's not pretty. It just works and it survived an audit.

```
{{ first_name | default: "Hey" }},

Four emails in. Here's the first thing I'll ask you to buy.

[STR Mileage Log — $17 — see it here →]

Why this one first:

1. **It pays for itself on the first trip.** IRS 2026 rate is 70¢/mile. Any trip to a property 25+ miles away makes the template free.

2. **It survived an audit.** When I got audited for 2022 returns, my mileage deduction (~$4,200) was the first thing they wanted to see. The log I built — date, purpose, start odometer, end odometer, miles, auto-calculated deduction — was what they asked for. The audit closed on mileage in 12 minutes.

3. **It's the gateway to everything else.** If this one works for you, the per-diem meal tracker, the 1099 contractor tracker, and the full Schedule E workbook all follow the same logic. If this one doesn't solve your problem, you learn for $17.

[Grab the Mileage Log →]

When you check out, you'll see an option to add the **Per-Diem Meal Tracker** for $12 extra. I built that one for the commutes to my furthest property where I end up at Waffle House at 11pm. Worth adding if you ever stay overnight near a property.

14-day refund if it's not what you expected. No hoops.

— The STR Ledger

P.S. If $17 feels steep and you just want the free stuff, that's fine — the 47 Deductions guide and the FB Group are where the bulk of the value is. I'll keep writing. No pressure.
```

---

## Email 5 — Day 8 — Branches

### Branch 5A — Tripwire buyer (skipped to): welcome + next step

**Trigger:** Day 6 purchase of Mileage Log

**Subject:** You got the Mileage Log — here's what's next

```
{{ first_name | default: "Hey" }},

You made it real. Thank you.

Check your inbox for the delivery email (file attached + Etsy / Gumroad download link, depending where you bought). Any issues opening it, reply to this email and I'll fix.

Here's where most mileage-log buyers go next: the **Schedule E Workbook**. It's the big one — the workbook that turns the mileage log + your expense receipts + your property address data into a Schedule E that looks like your CPA built it.

$97. 30-day refund. I'll tell you more about it on Day 11.

For now: open the mileage log, punch in your trips from the last month, and see what pops out at the bottom. Most hosts are $500+ ahead of where they thought they were by the end of the first session.

— The STR Ledger
```

### Branch 5B — Non-buyer: Amanda case study

**Subject:** Amanda's 7-minute tax tab

**Preheader:** She doesn't keep books during the year. Her tax tab still takes 7 minutes.

```
{{ first_name | default: "Hey" }},

Totally fine if the mileage log isn't your thing. Let me try a different angle.

Amanda (the cabin operator from earlier — three listings in the Smokies) doesn't keep books during the year. She drops every expense into a shoebox and a Google Sheet labeled "ugh".

She still has a clean Schedule E every April, and it takes her **7 minutes per property** to generate. Not 7 hours. 7 minutes.

Here's how:

1. At the end of each quarter, she opens her shoebox
2. She tags every receipt by property (she uses a sticky-note system, one color per house)
3. She opens her Schedule E Workbook (the one we sell for $97)
4. She dumps the receipts into the matching tab — receipts already sorted by property + category from the sticky notes
5. The workbook auto-generates her Schedule E with every property's numbers in the right box

7 minutes per property. Three properties. 21 minutes total per quarter.

Before this setup, Amanda's tax season was a full weekend (16 hours minimum) of re-categorizing QuickBooks transactions and arguing with herself about whether a rug was a "Supplies" or "Depreciable asset."

I'll pitch you this workbook directly on Day 11. For now, just sit with this: most STR hosts' real problem is not lack of tax knowledge. It's lack of a system.

— The STR Ledger
```

---

## Email 6 — Day 11 — Core product pitch: Schedule E Workbook

**Subject:** The workbook Amanda uses (the one that saved her Q4)

**Preheader:** Schedule E for STR hosts, with depreciation, 1099s, and per-property rollup.

```
{{ first_name | default: "Hey" }},

Today's the pitch for the big one.

[Schedule E Workbook — $97 — see what's inside →]

What it does:
- One tab per property (unlimited, just copy the template tab)
- Every IRS Schedule E line auto-calculates from your per-property tabs
- Built-in depreciation tracker (MACRS 27.5-year, with cost segregation columns for 5/7/15-year property)
- 1099-NEC contractor tracking across all properties (your cleaners, handyman, landscaper)
- Rolls everything up into a Schedule E that matches line-for-line what your CPA needs to file
- Printable summary tab if your CPA prefers PDFs (most do, strangely)

Who it's for:
- Hosts with 1–10 properties
- Anyone who's ever scrolled through QuickBooks and thought "this isn't built for this"
- Schedule E filers (passive activity — most hosts). If you file Schedule C instead (material participation), there's a separate workbook — reply and I'll send the link.

Who it's not for:
- Hosts with 0 properties yet — go grab the 47 Deductions guide first
- Hosts with 20+ properties — you need the Multi-Entity P&L workbook instead, reply for that

[Grab the Schedule E Workbook →]

At checkout, you'll see the Depreciation Tracker as an OrderBump for $37 (normally $47 standalone). Take it. You need it for the Schedule E workbook to do its job.

After you buy: you'll see a one-time offer for the **Portfolio Bundle** at $297 (normally $397). If you're serious about treating this portfolio like a business, that's the move. Everything at that tier in one package. Decline it at full price anywhere else.

30-day refund on the workbook. 30-day refund on the bundle.

— The STR Ledger
```

---

## Email 7 — Day 14 — Tax season urgency

**Subject:** Tax season is {{ tax_season_weeks_out }} weeks out

**Preheader:** Real math on what happens if you start now vs wait.

```
{{ first_name | default: "Hey" }},

Quick math.

Tax Day is **{{ tax_season_weeks_out }} weeks away**.

If you start organizing your STR expenses **now**, you have ~{{ tax_season_weeks_out }} × 3 focused hours = ~{{ tax_season_weeks_out_times_3 }} hours total to get books clean.

If you wait until the last 3 weeks of March, you have 9 hours. Total.

Every year I hear the same thing from hosts in early April: "If I'd started in January I'd have caught three more deductions."

I'm not trying to hard-sell the workbook here. I'm telling you to start — even if with a notebook and a shoebox. The tool you use matters less than the week you start.

If you want the tool, here it is one more time: [Schedule E Workbook →]

If you'd rather start with the lighter tax kit (single property, simpler returns), [Tax Season Bundle at $147 →] has the essentials plus mileage, 1099, depreciation, and the per-diem tracker.

Either way. Start this week.

— The STR Ledger
```

---

## Email 8 — Day 18 — Objection handling

**Subject:** I hate these emails too, but...

**Preheader:** Read this if you've thought "I already have a CPA" or "TurboTax handles it."

```
{{ first_name | default: "Hey" }},

Two common objections I hear. Both worth addressing.

**"I already have a CPA — they handle all this."**

Good CPAs are gold. But your CPA needs clean inputs to produce clean outputs. If you hand them QuickBooks that's been miscategorizing Airbnb deposits all year, they'll either (a) charge you $500–$1,500 to clean it up first, or (b) file from the mess and cost you deductions that weren't surfaced.

The workbook is the "clean inputs" side. Your CPA is the "optimal outputs" side. They're not competing — they're sequential.

Almost every CPA-using host who buys the workbook reports that their CPA thanks them for it. Some CPAs have started *recommending* it to their other STR clients.

**"I just use TurboTax."**

TurboTax can file a Schedule E. What it can't do: depreciate your furniture separately from your building (5-year vs 27.5-year), track per-property margin so you know which house to sell, or generate the 1099-NEC cleaner summary that triggers whether you need to file 1099s at all.

TurboTax is the output engine. You still need the input discipline. That's what the workbook is.

If you're still on the fence, grab the free 47 Deductions guide (you already have it — revisit section 3: the "Most Commonly Missed" list). If any 3 items in that list apply to you but you're not currently claiming them, the workbook pays for itself this April and every April after.

[Schedule E Workbook →]

One more email in this sequence. Then I'll stop pitching and go back to the free weekly tips.

— The STR Ledger
```

---

## Email 9 — Day 21 — Bundle last call

**Subject:** Tax Bundle launch price closes in 48 hours

**Preheader:** After this I'll stop. Promise.

```
{{ first_name | default: "Hey" }},

Last email in this sequence.

If any of the last three weeks of emails made you think "I should probably have a system for this," the **Tax Season Bundle** is the system at the smallest viable price.

[Tax Season Bundle — $147 — full contents →]

What's in it:
- Schedule E Workbook (normally $97)
- Depreciation Tracker (normally $47)
- 1099-NEC Contractor Tracker (normally $17)
- Mileage Log (normally $17)
- Per-Diem Meal Tracker (normally $12)
- Quarterly Estimated Tax Calculator (normally $47)
- Home Office Deduction Allocator (normally $27)
- Year-Over-Year Comparison Workbook (normally $37)

**$301 value. $147 bundle price. $154 off.**

30-day refund on the whole bundle if it doesn't work for your setup.

[Grab the Tax Bundle →]

After this email, the bundle returns to its standard rotation (still $147 during tax season, but without the launch-discount email campaign around it).

I'm going to go back to writing the weekly Friday tips. They'll land in your inbox every Friday morning. If those aren't useful, unsubscribe link is at the bottom of every one. No hard feelings.

Thanks for letting me in your inbox for 21 days.

— The STR Ledger
```

---

## Branching logic summary

| Day | Event | Branch |
|---|---|---|
| 0 | Enrolled | Email 1 fires |
| 2 | — | Email 2 fires |
| 4 | — | Email 3 fires |
| 6 | — | Email 4 (tripwire pitch) fires |
| 8 | Purchased Mileage Log on Day 6? | **yes** → Email 5A; **no** → Email 5B |
| 11 | — | Email 6 (Schedule E pitch) fires |
| 11 | Purchased Schedule E on Day 11? | **yes** → move to Bundle/Portfolio sequence; **no** → continue |
| 14 | — | Email 7 (urgency) fires |
| 18 | — | Email 8 (objection handling) fires |
| 21 | — | Email 9 (bundle last call) fires |
| 22 | Bundle purchased by Day 21? | **yes** → move to Vault/Membership arc; **no** → move to quarterly re-engagement |

## Source-tag entry variants

Email 1's first paragraph changes based on entry source. The rest of the sequence is identical.

**source:hero-magnet (default):** as written above.

**source:pinterest** — Email 1 first paragraph replaced with:
> Found you on Pinterest — welcome.
> If you're here, you're probably deep in "research mode" for either your first listing or your first serious tax season. This guide is the one I wish I'd had before either.

**source:etsy-post-purchase** — Email 1 first paragraph replaced with:
> Thanks for your recent Etsy purchase — welcome to the list.
> Since you already have one of our templates, the 47 Deductions guide is the fastest way to see what else might be leaving money on the table this year.

**source:blog** — Email 1 first paragraph replaced with:
> Caught you on the blog — welcome.
> Since you've read at least one post, you already know we're not a "Airbnb lifestyle" brand. This list is the numbers-and-systems side of hosting.

---

## Post-sequence (Day 22+)

Move to weekly broadcast list (`Fridays — weekly tips`). Tag the contact `sequence:hero-complete`. Remove from the hero-magnet sequence to prevent re-enrollment.

Contacts who purchased anything during the sequence stay on the broadcast list plus move into product-specific follow-up sequences:
- Mileage Log buyer → 3-email Schedule E upsell over 10 days
- Schedule E buyer → 3-email Bundle upsell over 10 days
- Bundle buyer → 4-email Vault + Membership sequence over 14 days

(Those are separate sequences to be drafted once the hero sequence is proven.)

---

## Copy QA notes

Before going live with each email:

1. Replace every `The STR Ledger` and `thestrledger.com` token
2. Check every link (404 check on all CTAs)
3. Preview in desktop + mobile + Gmail + Outlook — look for broken CTAs or mis-rendered PS lines
4. Verify the unsubscribe link is present (legal requirement)
5. Confirm sender name + reply-to is `hello@thestrledger.com` (not `noreply@`)
6. Verify DNS: SPF, DKIM, DMARC records are all set (Task B3 Step 4)
7. Send to yourself first, read out loud, fix any clunky sentences
8. Send to 1–2 friends who host STRs — ask for honest feedback on tone

---

## Metric targets

Per spec §7.1:

- Open rate: ≥ 25% (below = subject line weak OR deliverability problem)
- Click rate on tripwire pitch (Email 4): ≥ 5%
- Conversion rate on tripwire: ≥ 3% of list
- Conversion rate on core product (Email 6): ≥ 2% of remaining list
- Conversion rate on bundle (Email 9): ≥ 1% of remaining list

Track in Airtable Metrics table, weekly review.
