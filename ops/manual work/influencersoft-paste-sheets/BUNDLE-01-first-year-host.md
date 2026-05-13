# Paste Sheet — BUNDLE-01-first-year-host

> **Auto-generated from:** `copy\email-sequences\bundles\BUNDLE-01-first-year-host.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.

## IS UI setup

1. **Automations → New Sequence**
2. **Name:** `BUNDLE-01-first-year-host`
3. **Trigger:** When tag `bundle-cross:first-year-host` is added
4. **Then add 4 email(s) below in order.** Set the delay per the header on each.
5. **Save and Activate** when the last email is in.

When done, mark this sequence done in your tracker.

---

### Email 1 of 4 — "You bought one piece"

- **Delay (set in IS):** Day 2
- **Subject (copy):**

      You just bought one piece of the first-year stack

- **Preheader (copy):**

      The other three are the ones nobody tells you about until it's too late.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN BUNDLE-01-first-year-host EMAIL 1 -----8<-----

{{ first_name | default: "Hey" }},

Couple days ago you grabbed {{ sku_label }}. Welcome — it's one of the four workbooks I built specifically for first-year STR hosts.

The other three:

  · STR Deal Analyzer — underwrites any property in 5 minutes. Cash-on-cash, DSCR, cap rate, BUY/WALK/NEGOTIATE verdict.
  · Cost-to-Launch Calculator — 120-item furnishing checklist (catches the long tail most buyers forget — toaster, can opener, ice tray).
  · License/Permit Tracker — the workbook that prevents the $5,000 fine from your city's STR ordinance you didn't know existed.
  · Break-Even Occupancy — at what occupancy do you stop losing money?

Each one solves a different first-year landmine.

Bundle them: $97. À la carte: $138. Save $41.

→ [Get the full First-Year Host Bundle]({{ link_bundle }})

Note: your purchase of {{ sku_label }} (${{ bundle_credit_amount }}) credits toward the bundle. The link above auto-applies it — you'll see the discount at checkout.

— Emily · The STR Ledger

P.S. If you bought {{ sku_label }} this week and you're not sure why I'm offering you a bundle that includes it: read it as a discounted upgrade, not a duplicate purchase. The math works because the bundle SKUs flow data into each other — cleaner than running them separately.

-----8<----- END EMAIL 1 -----8<-----

### Email 2 of 4 — The first-year landmine you didn't think you had

- **Delay (set in IS):** Day 7
- **Subject (copy):**

      The first-year STR landmine that hits 60% of new hosts

- **Preheader (copy):**

      It's not the deal. It's not the launch. It's the thing your city's website buries on page 47.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN BUNDLE-01-first-year-host EMAIL 2 -----8<-----

{{ first_name | default: "Hey" }},

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

- **Delay (set in IS):** Day 11
- **Subject (copy):**

      Quick math on the bundle

- **Preheader (copy):**

      $97 vs $138, plus the credit you've already paid.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN BUNDLE-01-first-year-host EMAIL 3 -----8<-----

{{ first_name | default: "Hey" }},

Cutting straight today.

You bought {{ sku_label }} for ${{ bundle_credit_amount }}.
The First-Year Host Bundle is $97 (4 workbooks).
À la carte total of those 4: $138.

You paid ${{ bundle_credit_amount }} already. The credit applies. The remaining 3 workbooks cost you ${{ 97 minus bundle_credit_amount }} all-in.

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

- **Delay (set in IS):** Day 14
- **Subject (copy):**

      Last note on the First-Year Bundle

- **Preheader (copy):**

      I won't keep emailing about this. One last reminder.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN BUNDLE-01-first-year-host EMAIL 4 -----8<-----

{{ first_name | default: "Hey" }},

Last note on the First-Year Host Bundle.

If you're using {{ sku_label }} and finding it useful, the other 3 workbooks are designed to flow data into and out of it. They're not a separate purchase — they're the rest of the same operating system.

→ [First-Year Host Bundle — $97]({{ link_bundle }})

If it's not the right time, no problem. The à la carte SKUs stay available individually. I won't email you about this bundle again.

I'll send you something different on Monday — a note about a specific tax move most first-year hosts miss in their first April. Different topic, different sequence.

Talk Monday,
Emily · The STR Ledger

P.S. If you've already purchased the bundle, ignore this email — IS will catch up overnight and you'll be moved off this sequence by tomorrow.

-----8<----- END EMAIL 4 -----8<-----
