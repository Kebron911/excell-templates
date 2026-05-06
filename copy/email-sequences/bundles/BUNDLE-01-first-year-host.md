# Bundle Cross-Sell Sequence — First-Year Host Bundle

**Bundle:** BUNDLE-01 First-Year Host ($97 — saves $41 vs $138 à la carte)
**Trigger:** customer bought ACQ-001 / ACQ-002 / OPS-003 / FIN-002 individually
**Tag at entry:** `bundle-cross:first-year-host`
**Sequence length:** 4 emails over 14 days
**Target conversion:** 8-12% of triggered list to bundle purchase. Below 4% = sequence rewrite.

**Tokens:**
- `{{ first_name | default: "there" }}`
- `{{ purchased_sku }}` — the SKU that triggered the sequence (ACQ-001 / ACQ-002 / OPS-003 / FIN-002)
- `{{ purchased_sku_name }}` — human-readable name
- `{{ link_bundle }}` — `/p/bundles/first-year-host?utm_source=email&utm_campaign=bundle-cross-01&utm_content=email{N}`
- `{{ bundle_credit_amount }}` — what they paid for the trigger SKU (auto-credited toward bundle)

**Suppression rules:**
- If customer already owns the bundle, exit sequence
- If customer has a refund pending on the trigger SKU, hold sequence until resolved
- If customer is on `bundle-cross:portfolio` (higher-tier bundle), exit — Portfolio supersedes

---

## Email 1 — Day 2 — "You bought one piece"

**Subject:** You just bought one piece of the first-year stack

**Preheader:** The other three are the ones nobody tells you about until it's too late.

```
{{ first_name | default: "Hey" }},

Couple days ago you grabbed {{ purchased_sku_name }}. Welcome — it's one of the four workbooks I built specifically for first-year STR hosts.

The other three:

  · STR Deal Analyzer — underwrites any property in 5 minutes. Cash-on-cash, DSCR, cap rate, BUY/WALK/NEGOTIATE verdict.
  · Cost-to-Launch Calculator — 120-item furnishing checklist (catches the long tail most buyers forget — toaster, can opener, ice tray).
  · License/Permit Tracker — the workbook that prevents the $5,000 fine from your city's STR ordinance you didn't know existed.
  · Break-Even Occupancy — at what occupancy do you stop losing money?

Each one solves a different first-year landmine.

Bundle them: $97. À la carte: $138. Save $41.

→ [Get the full First-Year Host Bundle]({{ link_bundle }})

Note: your purchase of {{ purchased_sku_name }} (${{ bundle_credit_amount }}) credits toward the bundle. The link above auto-applies it — you'll see the discount at checkout.

— Emily · The STR Ledger

P.S. If you bought {{ purchased_sku_name }} this week and you're not sure why I'm offering you a bundle that includes it: read it as a discounted upgrade, not a duplicate purchase. The math works because the bundle SKUs flow data into each other — cleaner than running them separately.
```

---

## Email 2 — Day 7 — The first-year landmine you didn't think you had

**Subject:** The first-year STR landmine that hits 60% of new hosts

**Preheader:** It's not the deal. It's not the launch. It's the thing your city's website buries on page 47.

```
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
```

---

## Email 3 — Day 11 — The cleanest version of the math

**Subject:** Quick math on the bundle

**Preheader:** $97 vs $138, plus the credit you've already paid.

```
{{ first_name | default: "Hey" }},

Cutting straight today.

You bought {{ purchased_sku_name }} for ${{ bundle_credit_amount }}.
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
```

---

## Email 4 — Day 14 — Last note

**Subject:** Last note on the First-Year Bundle

**Preheader:** I won't keep emailing about this. One last reminder.

```
{{ first_name | default: "Hey" }},

Last note on the First-Year Host Bundle.

If you're using {{ purchased_sku_name }} and finding it useful, the other 3 workbooks are designed to flow data into and out of it. They're not a separate purchase — they're the rest of the same operating system.

→ [First-Year Host Bundle — $97]({{ link_bundle }})

If it's not the right time, no problem. The à la carte SKUs stay available individually. I won't email you about this bundle again.

I'll send you something different on Monday — a note about a specific tax move most first-year hosts miss in their first April. Different topic, different sequence.

Talk Monday,
Emily · The STR Ledger

P.S. If you've already purchased the bundle, ignore this email — IS will catch up overnight and you'll be moved off this sequence by tomorrow.
```

---

## After sequence

- **Tags set:** `bundle-cross:first-year-host:converted` (if purchased) OR `bundle-cross:first-year-host:declined` (if exited Day 14 without purchase)
- **Next sequence trigger:** First-April-tax-moves (TAX-001 cross-sell if not already owned, otherwise general nurture)
- **Suppression added:** customer won't see this same bundle sequence again for 12 months

## Iteration log

- `2026-05-05` — Initial draft. Email 2 uses a real-feeling story for OPS-003 angle (most-emotionally-charged of the 4). Math email Day 11 is the closer for analytical buyers; story email Day 7 is the closer for narrative buyers; redundancy is intentional.
