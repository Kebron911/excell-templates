---
title: Unlinked-mention reclaim template
purpose: Used by W34 to draft outreach when a publisher mentioned us without linking
version: 1
last_updated: 2026-05-11
locked: true
---

# Unlinked-mention reclaim template (W34)

When W34 detects an editorial mention of "The STR Ledger" or "thestrledger.com" without a hyperlink, Claude drafts a reach-out citing the specific paragraph. Daniel reviews via Slack and approves the send (Instantly).

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

- 6–10 words
- Specific to their article — never generic ("Quick question", "Following up")
- Reference the article topic or a phrase from it
- No salesy language, no clickbait

Acceptable:
- "Quick note on your STR-tax piece"
- "Found something while reading your Airbnb-bookkeeping post"
- "Re: <article title> — small heads-up"

Unacceptable:
- "Hi" / "Hello" / "Quick question"
- "Featured in your article?"
- "Boost your traffic with our templates"

### `body` rules

3–4 short paragraphs. ~80–120 words total.

**Para 1 — Reference proof** (1–2 sentences)
You read the article. Cite a specific phrase or section that proves it. Not just the title — something only a reader would know.

**Para 2 — The ask** (1–2 sentences)
"Noticed you mentioned [The STR Ledger / thestrledger.com] in [section]. If you'd consider linking it back so readers can find it, that'd be appreciated. Here's the canonical URL: <url>."

**Para 3 — No-pressure close** (1 sentence)
"Either way, thanks for the mention — appreciated the piece overall."

**Optional Para 4 — Mutual help**
If the article cites outdated info Daniel can clarify, offer it: "If useful, here's an updated take on [topic]: <url>". Only when genuinely relevant; never as a wedge.

### Voice anchors (per voice-guide.md)

- No "Hope this finds you well"
- No "I love your work"
- No multiple asks
- No "Looking forward to hearing from you"
- Sign off with first name only: "— Daniel"
- Never include the brand tagline in the signature (the link in the body carries it)

## Example output

Input (from W34):

```
outlet: "Rental Scale-Up"
mention_url: "https://rentalscaleup.com/airbnb-tax-mistakes-2026"
mention_paragraph: "...Some hosts swear by template-based bookkeeping (The STR Ledger has built a small library of them). Others stick to QuickBooks Online or hire a CPA from day one..."
publisher_email: "jane@rentalscaleup.com"
publisher_name: "Jane Smith"
```

Claude output:

```json
{
  "subject": "Quick note on your Airbnb-tax-mistakes piece",
  "body": "Hi Jane,\n\nRead your piece on the 2026 Airbnb tax mistakes — the section on hosts misclassifying Schedule E vs C was sharp. We see that one a lot too.\n\nYou mentioned The STR Ledger in the bookkeeping-options paragraph (\"some hosts swear by template-based bookkeeping...\"). If you'd consider linking it back so readers can find us, that'd be appreciated. Canonical URL: https://thestrledger.com.\n\nEither way, thanks for the mention — appreciated the piece overall.\n\n— Daniel",
  "reasoning": "Specific subject referencing topic. Para 1 cites the Schedule E vs C section which proves I read it. Para 2 names the exact phrase that mentioned us and gives the canonical URL. Para 3 is the no-pressure close. ~80 words; single ask; brand link is in the ask itself."
}
```

## Anti-patterns to avoid in drafts

- ❌ Pasting the full mention paragraph back at the publisher (they wrote it — they know what it says)
- ❌ Demanding a link change ("please update your article")
- ❌ Offering "a link in return" (link exchanges are devalued + scammy-feeling)
- ❌ Asking for anchor text ("could you use 'STR tax templates' as the anchor?") — let publisher choose
- ❌ Following up more than once if no response in 7 days

## After the send

- If publisher adds link within 14 days → W6/placement-tracker (Phase 5) detects new backlink → row updated in Airtable Mentions table
- If no response in 7 days → status stays `Sent`; do NOT follow up
- If publisher declines (rare) → mark `Status=Declined`, never re-pitch this outlet for this URL

## Iteration log

- `2026-05-11 v1` — Initial template. Used in W34 Node 6 draft prompt.
