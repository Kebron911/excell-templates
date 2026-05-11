---
title: Social-question answer template (Reddit / Quora / HN)
purpose: Used by W41 to draft helpful answers Daniel posts manually
version: 1
last_updated: 2026-05-11
locked: true
---

# Social-question answer template (W41)

Loaded into the Claude draft prompt in W41 Node 9. Sits alongside `voice-guide.md`. Output is a Slack-card draft Daniel reviews and posts manually within ~4 hours of surfacing.

## What Claude is asked to produce

A JSON object:

```json
{
  "answer_markdown": "...",
  "optional_link_line": "..."
}
```

### `answer_markdown` rules

- 80–250 words
- Lead with the actual answer, not throat-clearing
- One specific, concrete fact early (number, IRC ref, named guidance)
- Acknowledge the edge case if there is one
- Close with a question that invites continued discussion (optional)
- Follows `voice-guide.md` voice rules
- NEVER includes a link to thestrledger.com — Daniel's profile bio carries the brand link
- NEVER uses exclamation points
- NEVER says "as an AI", "I think", "in my opinion as X"

### `optional_link_line` rules

A single contextual line Daniel MAY add IF the link is genuinely the most helpful next step. Default to empty string `""`.

Acceptable scenarios:
- The question asks for a template specifically and we have a free version: `"I made a free version here: <url>"`
- The question is about a topic with a long-form guide on the blog: `"There's a deeper write-up here if useful: <url>"`

Unacceptable scenarios:
- Generic plug ("Check out my templates...")
- Off-topic plug (the question is about marketing; we have a tax template)
- Self-promotion without warrant

If the link would feel like an ad, default to `""` and let the answer stand alone. Earning brand recall through usefulness beats traffic from one link drop.

## Subreddit / topic specifics

When the surfaced post comes from these sources, apply the extra rules:

### r/AirBnBHosts, r/AirBnB
- Treat the audience as semi-pro hosts (1–10 properties)
- Don't condescend; they know basics
- Specifically helpful: regulatory updates, IRS tax treatment, market data
- Specifically unhelpful: "consult a CPA" as the whole answer (give them framework first)

### r/realestateinvesting
- Larger investor audience; might be new to STR specifics
- Bridge from long-term-rental knowledge → STR-specific differences
- 14-day rule + material participation are common knowledge gaps

### r/tax
- Most technically savvy audience
- Cite IRC sections, Pubs, case law where applicable
- Avoid colloquialisms; this audience parses every word
- Never recommend a tax position; only explain frameworks

### r/Entrepreneur
- Off-topic risk — many questions here aren't STR specific
- Only answer if the question intersects STR business directly (e.g. "starting an Airbnb business")

### Quora
- Long-form okay; this answer might persist for years
- Format matters more than on Reddit (use clear paragraphs)
- More formal voice than Reddit

### HN
- Technical-builder audience
- Answer only if it's about tooling, automation, n8n, indexing, or programmatic SEO — not general STR business
- Cite primary sources where possible

## Example output

Input (from W41):

```
platform: reddit
subreddit_or_topic: r/AirBnBHosts
title: "Do I really need to track mileage if I drive 2x/month to my STR?"
excerpt: "I drive to my Airbnb maybe twice a month for restocking. Is mileage tracking worth the hassle for that small amount?"
```

Claude output:

```json
{
  "answer_markdown": "Worth it, yes — but for a reason most hosts miss.\n\nThe deduction itself is small at low miles (2026 IRS standard rate is 70¢/mile). At 50 miles round-trip × 24 trips/year, you're looking at ~$840 in deductions. Maybe $200 in actual tax savings depending on your bracket.\n\nThe real reason: if you ever get audited on the rental, the IRS asks for substantiation of *every* business expense. \"I drive there sometimes\" doesn't cut it. A logged mileage record (date, miles, purpose) is contemporaneous evidence that the property is operated as a business, which protects the rest of your Schedule E deductions — depreciation, supplies, repairs.\n\nThe hassle is the friction. A phone app that auto-detects trips solves that. The act of tracking is more valuable than the deduction itself.\n\nWhat made you consider stopping — is the app you're using annoying?",
  "optional_link_line": ""
}
```

What this hits:
- Concrete numbers (70¢, $840, $200)
- The non-obvious insight (audit substantiation > the deduction itself)
- Voice (no exclamation, "Worth it, yes — but..." opener, "Heads up:"-style framing)
- Closes with a question
- No link drop (the answer stands alone)

## Iteration log

- `2026-05-11 v1` — Initial template. Used in W41 Node 9 draft prompt.
