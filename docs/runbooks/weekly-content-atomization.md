# Weekly Content Atomization Runbook

**Cadence:** Once per week, Mon–Fri.
**Output:** 11 artifacts from 1 Master Deck, all scheduled for the *following* week.
**Source spec:** [`docs/superpowers/specs/2026-04-29-content-atomization-engine.md`](../superpowers/specs/2026-04-29-content-atomization-engine.md)

---

## Pre-flight (Sunday night, 15 min)

- [ ] Open Airtable `topic_signals` table — review the top 3 hooks/comments/replies from past 7 days
- [ ] Confirm next week's posting calendar is empty (we are filling it Friday)
- [ ] Confirm Vista Create masters are accessible
- [ ] Confirm OBS / recording setup works

---

## Monday — Topic + Deck Draft (≈2 hours)

- [ ] Pick **one** topic from the source pool (per spec §2 ranking):
  - Top engagement signal → top email reply → top FB question → P&L row → IRS section → Etsy review
- [ ] Create the topic folder: `copy/_atomization/decks/YYYY-MM-DD-{slug}/`
- [ ] Open `copy/_atomization/topic-brief-template.md`, copy into the deck folder as `brief.md`, fill in:
  - Source Topic + which pool it came from
  - Buyer pain in one sentence
  - The single key idea (slide 4)
  - The 3 actionable steps/tips (slides 5–7)
  - The real-numbers example (slide 8)
  - The funnel CTA (which of the three URLs)
- [ ] Open `master-deck-template.md`, copy into deck folder as `deck.md`, write the 10 slide texts
- [ ] **Verification:** read deck.md aloud start-to-finish in under 4 minutes. If longer, cut.

---

## Tuesday — Design (≈1.5 hours)

- [ ] Duplicate the Vista Create deck master → name it with the deck slug
- [ ] Type slide text from `deck.md` into each of the 10 slides
- [ ] Drop in any spreadsheet screenshots required for slide 8 (real example)
- [ ] Export:
  - 16:9 PNG set (for YouTube)
  - 1080×1350 PNG set (for Instagram carousel — slides 1–9)
  - 1080×1920 PNG set (for Reel and Shorts backgrounds — slides 1, 4, 5, 6, 7, 10)
- [ ] Save all exports into the deck folder under `assets/`
- [ ] **Verification:** title text is readable at thumbnail size on all three exports

---

## Wednesday AM — Record (≈1 hour)

- [ ] Open `deck.md`, read each slide as the script
- [ ] Record one continuous YouTube long-form voiceover (10–15 min) over the 16:9 PNG sequence
- [ ] Save to deck folder as `audio-master.wav`
- [ ] Render YouTube long-form video → `assets/youtube-long.mp4`
- [ ] **Verification:** play first 60 seconds — audio quality is clean, slide transitions are tight

---

## Wednesday PM — Cut Shorts + Reel (≈1.5 hours)

- [ ] From `audio-master.wav`, extract:
  - 5–10 standalone Shorts (one slide each, < 60s) → `assets/shorts/short-N.mp4`
  - 1 Instagram Reel (slides 1, 4, 5, 6, 7, 10; 30–45s) → `assets/ig-reel.mp4`
- [ ] Each Short hooks with the slide-1 promise OR the specific tip; never with throat-clearing
- [ ] Add captions (auto-generate, then proof) to every short and reel
- [ ] **Verification:** open one Short on phone — first 1.5 seconds reads as a hook, not buildup

---

## Thursday AM — Instagram (≈1 hour)

- [ ] Reorder 1080×1350 PNG slides for IG carousel: slide 1 (hook) → slide 9 (recap), insert slide 10 (CTA) as the final card
- [ ] Write IG caption: hook line + 3-bullet preview + CTA + 5–8 hashtags (host-niche specific)
- [ ] Schedule IG carousel + Reel for next week (Tue carousel, Thu Reel — split for separate impressions)
- [ ] Tag every scheduled post with `source_deck=YYYY-MM-DD-{slug}` in description metadata field
- [ ] **Verification:** carousel preview on phone shows readable slide-1 hook at thumbnail size

---

## Thursday PM — Pinterest (≈1 hour)

- [ ] Generate 3–5 pin variants from slide 1 hook using existing pin catalog style system (tip-list, quote-card, infographic, question, before/after — see [`copy/pinterest/pin-catalog-first-30.md`](../../copy/pinterest/pin-catalog-first-30.md))
- [ ] Each pin: 1000×1500 PNG, ≥60pt headline, brand colors, logo bottom-right
- [ ] Append to `copy/pinterest/pin-catalog-{month}.md` with title, style, board, day-to-schedule, UTM URL
- [ ] Schedule via Creasquare — 1 pin per day spread over next week
- [ ] **Verification:** every pin URL has `?utm_source=pinterest&utm_medium=pin&utm_campaign={slug}`

---

## Friday AM — Long-form Text (≈2 hours)

- [ ] **Blog post:** expand deck → 1500–2500 words. Each slide becomes a section header. Section 8 (real numbers) becomes the most detailed block. Save to `copy/blog-posts/{slug}.md`. Schedule on Ghost for next week.
- [ ] **Email newsletter:** condense slides 4–8 into 400–700 words. Personal voice. Single CTA = blog post URL. Save to `copy/email-sequences/newsletter-{slug}.md`. Schedule.
- [ ] **Verification:** blog post passes a "would you read this" test on first scroll — hook in first 3 lines, scannable subheads

---

## Friday PM — Ladder + Schedule (≈1.5 hours)

- [ ] **YouTube long-form:** upload `youtube-long.mp4` with thumbnail; description includes blog URL + `/47` link; schedule for next week
- [ ] **YouTube Shorts:** upload all 5–10; schedule one per day across 7 days
- [ ] **LinkedIn:** post slide-1 text + attach 9-slide PDF carousel; schedule
- [ ] **X/Twitter:** thread = one tweet per slide (10 tweets); schedule
- [ ] **FB group:** post slide-1 hook + question prompt; schedule
- [ ] **Etsy listing refresh** (only if topic ties to a SKU): inject slide-8 numbers into product description "What's inside" block; update listing
- [ ] **Topic-pool intake:** before logging off, scan IG saves / YT comments / email replies / FB group / Etsy reviews from past 7 days; log top 3 signals into Airtable `topic_signals` for next Monday's pick
- [ ] **Verification:** open the next-week calendar — every day has at least one artifact scheduled, every artifact has a `source_deck` tag

---

## Done. Total active time: ≈10–14 hours.

---

## Cut-corners hierarchy (when the week is short)

If you have to drop something, drop in this order — never the reverse:

1. X/Twitter thread (lowest ROI for STR niche)
2. LinkedIn carousel
3. FB group post
4. Etsy listing refresh (only if no SKU tie-in this week)
5. Blog post (only as last resort — SEO compounds)

**Never drop:** the deck, IG carousel, YouTube long-form, Pinterest pins, email newsletter. These five are the load-bearing artifacts.

---

## Anti-patterns (do not do)

- ❌ Recording without a written script (the deck IS the script — write it first)
- ❌ Designing slides before the script is locked
- ❌ Posting same-day instead of scheduling next-week (no buffer = burnout)
- ❌ Bespoke content per platform (defeats the entire engine)
- ❌ Skipping the `source_deck` tag (kills the self-feeding loop)
- ❌ Multi-CTA artifacts (every artifact gets exactly one CTA)
- ❌ AI-narrated voiceover on tax content (corrodes trust per spec §9)
