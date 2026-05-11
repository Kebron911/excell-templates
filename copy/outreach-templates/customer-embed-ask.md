---
title: Customer embed-ask template
purpose: Used by W45 Branch A — Day-21 follow-up to happy customers asking them to embed our badge
version: 1
last_updated: 2026-05-11
locked: true
---

# Customer embed-ask template (W45)

W45 Branch A fires daily at 10:30 ET. Finds customers who are 21+ days post-purchase with a 4+ star review on Etsy/Gumroad/Trustpilot. Sends a single follow-up email via Influencersoft asking them to embed the attribution badge ([brand/assets/badges/](../../brand/assets/badges/)).

Conversion target: 2–5% of happy customers act. Every accepted embed = permanent referrer-traffic source + branded-anchor backlink.

## What Claude is asked to produce

A JSON object:

```json
{
  "subject": "...",
  "body": "...",
  "reasoning": "..."
}
```

### `subject` rules

- 4–6 words
- No emoji, no exclamation
- Slightly warm; addresses them by first name in the body, not subject

Acceptable:
- "Quick favor, {{ first_name }}?"
- "{{ first_name }} — a small ask"
- "One quick thing about your review"

Unacceptable:
- "🎉 Thanks for your review!"
- "Special offer for you"
- "Become an STR Ledger affiliate today"

### `body` rules

~80–100 words. Markdown not HTML (IS converts). Single ask. Embed snippet pre-populated.

**Para 1 — Acknowledge the review specifically**
Reference their `Review_excerpt` if available — quote a 3–6 word fragment. If only `Review_rating` is available, reference the rating without quoting.

**Para 2 — The ask + the snippet**
One sentence ask. Then the snippet block, pre-tagged with their `customer_id` UTM. Templated like:

```html
<a href="https://thestrledger.com?utm_source=customer-embed&utm_campaign=str-ledger-badge&utm_content={{ customer_id }}" target="_blank" rel="noopener">
  <img src="https://thestrledger.com/badges/built-with-strledger.svg" alt="Built with The STR Ledger templates" width="180" height="54" loading="lazy">
</a>
```

**Para 3 — Permission to ignore**
Make declining painless: "No worries if not — just thought I'd ask." This is the difference between a 2% and 0% conversion rate. Customers who feel pressured don't act.

**Sign off**
"— Daniel, The STR Ledger"

## Example output

Input:

```
first_name: "Sarah"
product_purchased: "Tax Season Bundle"
review_rating: 5
review_excerpt: "saved me hours of bookkeeping"
customer_id: "recCustomer12345"
```

Claude output:

```json
{
  "subject": "Quick favor, Sarah?",
  "body": "Sarah,\n\nThanks for the 5-star review on the Tax Season Bundle — the \"saved me hours of bookkeeping\" line genuinely made my week.\n\nIf you write about your STR business anywhere — blog, FB group post, member-only forum, anywhere a host might land — would you consider embedding the badge below so they can find us? Here it is:\n\n```\n<a href=\"https://thestrledger.com?utm_source=customer-embed&utm_campaign=str-ledger-badge&utm_content=recCustomer12345\" target=\"_blank\" rel=\"noopener\">\n  <img src=\"https://thestrledger.com/badges/built-with-strledger.svg\" alt=\"Built with The STR Ledger templates\" width=\"180\" height=\"54\" loading=\"lazy\">\n</a>\n```\n\nNo worries if not — just thought I'd ask.\n\n— Daniel, The STR Ledger",
  "reasoning": "Specific subject with first name. Para 1 quotes the 6-word review fragment which proves I actually read their review. Para 2 has the single ask with the snippet UTM-tagged to their customer_id. Para 3 is the permission to ignore. ~95 words; no marketing, no follow-up promise."
}
```

## Hard rules

1. **Only fire once per customer per product purchase.** `Embed_ask_sent=true` blocks re-sends.
2. **Never fire to customers who left negative reviews** (`Review_rating < 4`).
3. **Never fire to customers who unsubscribed from IS** — IS handles this gate automatically; W45 still marks `Embed_ask_sent=true` to prevent retry.
4. **Never include incentives** ("for this we'll send you...") — this borders on FTC affiliate-disclosure territory and feels transactional.
5. **Never follow up** if customer doesn't reply. The ask is a low-pressure favor; double-asking burns goodwill.
6. **Daniel pre-approves the IS template once** then never touches individual sends. The voice + structure lock in once.

## After the send

- W45 Branch B (referrer-log poll) detects embeds via `utm_source=customer-embed` → appends to `ops/customer-embeds.ndjson` → Airtable Customer flagged `Embed_active=true`
- Slack notification on first detected embed per customer
- W45 Branch C (Sun 22:00) verifies embeds still present; flips `still_present=false` if removed

## Iteration log

- `2026-05-11 v1` — Initial template. Used in W45 Branch A. Single source of truth; Daniel reviews + approves the IS template once at deploy.
