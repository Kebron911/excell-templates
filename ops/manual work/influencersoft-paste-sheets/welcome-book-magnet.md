# Paste Sheet — welcome-book-magnet

> **Auto-generated from:** `copy\email-sequences\welcome-book-magnet.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.
> **Token format:** IS `{$xxx}` (NOT Liquid `{{ xxx }}`). Built-ins → `{$name}`. Custom fields → `{$leadExfield[N]}`.

> ⚠️ **5 of 5 email(s) need manual rewrite before pasting.** See per-email TODOs below.

## IS UI setup

1. **`Campaigns → Sequences → Add sequence`** — NOT `Tasks → Processes`. Sequences is the correct module for trigger-based email drips. (Founder explicitly warns against Process for this use case — gotchas.md #27.)
2. **Sequence name:** `welcome-book-magnet`
3. **Trigger node:** `Tag applied` → tag = `lead-magnet:welcome-book`
   - Toggle ON: "Perform only once for an object"
   - Entry filter: `Tags | Doesn't match | do-not-email` (+ `refund-filed`, `unsubscribed` as additional rows)
4. **Add 5 Send email node(s)** below in order. Per-email config follows.
5. **End of process** node at the end.
6. **Save and Activate.**

Repeat for kill-switch: separate small Sequence triggered by `Tag applied = do-not-email` → Remove from list `STR Ledger — Contacts` → End of process. (Built once, applies to every sequence.)

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
