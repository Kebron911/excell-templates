# Nurture Sequence — Welcome Book Magnet Trigger

**Spec reference:** §7.3 of master strategy. Targets: traffic → email capture → Day 0 lead-magnet delivery → Day 21 Welcome Book ($47) close.

**Lead magnet:** *The 5-Tab Welcome Book Starter* — a one-property fillable PDF with the five highest-leverage tabs (Arrival, Wi-Fi, House Rules, Local Picks · 12 categories, Departure). Whets the appetite for the full 13-tab workbook.

**Trigger:** form submission on `thestrledger.com/welcome-starter`

**Default tag at entry:** `source:welcome-magnet` (overrides per UTM: `pinterest`, `etsy-cross`, `blog`)

**Target conversion:** 6–9% from list to GST-001 purchase ($47) inside 30 days. Below 4% = sequence rewrite.

**Token conventions:**
- `{{ first_name | default: "there" }}` — Influencersoft / ConvertKit syntax substitutable
- `{{ link_starter_pdf }}` — generated download link, 7-day expiry
- `{{ link_welcome_book }}` — `/p/welcome-book?utm_source=email&utm_campaign=welcome-magnet&utm_content=email{N}`

---

## Email 1 — Day 0 — Deliver + the question every welcome book misses

**Subject:** Your 5-Tab Welcome Book Starter (and the question every host misses)

**Preheader:** It's the one your guest texts you about at 9 PM on a Saturday.

```
Hey {{ first_name | default: "there" }},

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
```

---

## Email 2 — Day 2 — The local guide nobody writes (the 9 PM question)

**Subject:** "Where do you eat?" (the question your welcome book has to answer)

**Preheader:** It's the most-asked guest question in the history of short-term rentals.

```
{{ first_name | default: "Hey" }},

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
```

---

## Email 3 — Day 7 — The safety tab most hosts skip (and the new platform rule)

**Subject:** The 6 disclosures Airbnb is about to start asking for

**Preheader:** Two of them are already required in three states. The rest are coming.

```
{{ first_name | default: "Hey" }},

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
```

---

## Email 4 — Day 14 — What it actually looks like in your guest's hands

**Subject:** What our guests see when they walk in

**Preheader:** It's a 24-page PDF. Here's how we use it.

```
{{ first_name | default: "Hey" }},

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
```

---

## Email 5 — Day 20 — The price moves tomorrow

**Subject:** Tomorrow the price moves to $67

**Preheader:** Last note from this sequence — last day at $47.

```
{{ first_name | default: "Hey" }},

Last note from me on this one.

Twenty days ago you downloaded the 5-tab starter. The full 13-tab Welcome Book has been $47 every email since — that price expires at midnight tomorrow.

After that it's $67. (Still less than one bad review costs you in dynamic-pricing rank, but $20 more than today.)

Here it is one more time: [The Welcome Book — $47 thru tomorrow →]({{ link_welcome_book }})

If you already bought it, ignore me, and thank you. If you're not going to buy it, that's fine too — the starter PDF is yours to keep, and I'll send you one note a month from here on, no more sales sequences.

Either way, build a welcome book. Ours or someone else's. Your reviews will thank you.

— Emily · The STR Ledger

P.S. The bundle (Welcome Book + Turnover Checklist + Local Recs add-on) is $79 and will be live next month. If you'd rather wait for that, hit reply and I'll send you a heads-up when it launches.
```

---

## Sequence-level notes

**Tagging on conversion.** When `link_welcome_book` UTM hits the checkout, fire `tag:converted-welcome-book` and exit this sequence. Move buyer to the post-purchase nurture (separate doc).

**Non-converters at Day 30.** Move to monthly newsletter (`list:nurture-monthly`). Do not loop them back into another product-specific sequence for at least 60 days.

**A/B test slots.**
- Email 1 subject line — `Your 5-Tab Welcome Book Starter (and the question every host misses)` vs `Here's your Welcome Book Starter (open this before your next booking)`
- Email 4 subject line — `What our guests see when they walk in` vs `The leather-bound trick that gets you photographed`

**Voice check (per `brand/brand-decisions.md` §6).**
- ✅ First-person plural ("we built", "our reviews")
- ✅ Specific numbers (4.78 → 4.91, 80 picks, 13 tabs, $47, $67)
- ✅ "Host" and "portfolio" language
- ✅ Problem first, product second (Email 1 leads with reviews, Email 2 leads with the 9 PM question, Email 3 leads with the new platform rule)
- ✅ Plain English, no boss-babe, no crypto-bro punctuation
- ✅ Calm authority on the safety/legal note in Email 3

**Pairs with.** This sequence runs in parallel with the Hero Magnet sequence (`nurture-hero-magnet.md`) — different lead magnet, different product close, different campaign. A subscriber on both lists sees both sequences but tagged so neither pitches the same SKU twice.
