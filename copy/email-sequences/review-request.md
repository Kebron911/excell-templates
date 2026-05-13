# Review Request Sequence — Etsy Buyers

**Trigger:** customer with tag `customer:etsy` reaches Day 7 post-purchase
**Tag at entry:** `review-request:etsy`
**Sequence length:** 2 emails (Day 7 ask, Day 14 last-chance) — short by design
**Target outcome:** 10-15% review rate — Etsy review-rate baseline is 5-8%; doubling that requires asking once well, not nagging.

**Tokens:** `{{ first_name }}`, `{{ sku_label }}`, `{{ sku_code }}`, `{{ link_etsy_review }}`, `{{ link_support }}`

**Suppression:**
- If customer is on `bundle-cross:*` and has clicked a bundle link, defer review ask by 7 days (avoid mixing pitch + ask)
- If customer has emailed `hello@` with any complaint, exit (route to support recovery, not review request)
- If customer has tag `refunded:*`, exit
- If customer has already left a review (manual tag `reviewed:etsy`), exit
- Hard suppression after this sequence: 365 days (never ask same buyer twice on same SKU)

**Etsy ToS compliance notes:**
- No incentive offered for review (gift cards, discounts, free files = ToS violation → listing suspension)
- Negative-feedback routing: ask buyer to email `hello@` FIRST if anything is wrong — this is allowed; redirecting an *existing* negative review is not
- "Honest review" wording — never "5-star review" or "positive review"

---

## Email 1 — Day 7 — The ask

**Subject:** Quick favor — 60-second review of {{ sku_label }}?

**Preheader:** If it's working. If it's not, please email me first.

```
{{ first_name | default: "Hey" }},

A week in with {{ sku_label }} — how's it going?

If it's working: would you take 60 seconds and leave an honest Etsy review? Reviews are how new buyers decide whether to trust a small shop, and yours genuinely moves the needle for me.

→ [Leave a review on Etsy]({{ link_etsy_review }})

If something's off — a formula isn't behaving, a tab confuses you, anything — please email me at hello@thestrledger.com first. I'd rather fix it than have you write a frustrated review I can't respond to.

That's it. No script, no star-count ask. Just honest feedback if you've got 60 seconds.

— Emily · The STR Ledger

P.S. If you've already left one — thank you. Skip this email.
```

---

## Email 2 — Day 14 — Last-chance ask

**Subject:** Last note on this — review or feedback either way

**Preheader:** Two weeks in. Won't ask again after this.

```
{{ first_name | default: "Hey" }},

Two weeks since you picked up {{ sku_label }}. One more nudge then I'll stop.

If the workbook is doing the job — an honest Etsy review helps the next buyer figure out whether it's right for them:

→ [Review {{ sku_label }}]({{ link_etsy_review }})

If it's NOT doing the job, I want to know. Reply to this email or write to hello@thestrledger.com. Specific feedback ("the depreciation tab confused me", "I expected a feature that wasn't there") makes the next version better — for you and for everyone else.

Either way — review, feedback, or silence — that's the last you'll hear from me on this. Different topic next week: the most-overlooked Schedule E line for {{ sku_code }} buyers (it's not what you think).

Thanks again for picking up the workbook.

— Emily

P.S. Etsy reviews can be edited later. If you leave 4 stars now and the workbook saves you 3 hours at tax time, you can come back and bump it.
```

---

## After sequence

- **Tags set:** `review-request:etsy:complete` (regardless of outcome)
- **Manual tag for buyer-replied-with-issue:** `support:reply-needed` — routes to inbox triage
- **Suppression:** 365 days on review request for same SKU
- **Next sequence trigger:** continues normal post-purchase Etsy buyer flow (no override)

## Iteration log

- `2026-05-05` — Initial draft. Two-touch sequence. Day-7 first ask is the highest-converting moment per Etsy seller research (workbook is fresh + "this works" feeling peaks Day 5-10). Day-14 final note signals "won't be a pest" which itself improves response. ToS-compliant: no incentive language, "honest review" framing, negative-feedback redirect to email BEFORE review (legal — redirecting an existing review is not).
