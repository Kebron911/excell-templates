# Content Atomization Engine — Master Spec

**Status:** Draft v1 — ready to operationalize
**Date:** 2026-04-29
**Author:** Daniel Harrison
**Scope:** A single, self-feeding content production system for The STR Ledger that takes one weekly Source Topic and produces every artifact across YouTube, Instagram, Pinterest, Email, Blog, LinkedIn, X, Facebook, and Etsy from one Master Slide Deck.
**Source of insight:** Cross-platform research dossier at [`research/youtube/channels.md`](../../../../research/youtube/channels.md) and [`research/instagram/accounts.md`](../../../../research/instagram/accounts.md) (2026-04-29).

---

## 0. Executive Summary

### One-line thesis
> One Source Topic per week → one Master 10-slide Deck → 11 platform-specific artifacts derived from it → every CTA loops back into the same funnel → audience signals select next week's topic. The engine feeds itself; every new product, blog post, email reply, and customer review becomes input for next week's deck.

### Why this exists
- **Production capacity is the bottleneck** for a one-person editorial-finance brand. The way through is not "make more" but "make once, redistribute everywhere."
- **The cross-platform research confirmed two complementary truths:** YouTube rewards long-form slide+VO (rare in the STR niche → positioning gap), and Instagram rewards carousel posts (3× saves vs. single image → conversion metric). Both feed off the *same slide deck*.
- **Pinterest, X, LinkedIn, email, Etsy, and the FB group are downstream consumers** of the same deck — not separate content streams.

### What "done" looks like
- Pick a topic on Monday.
- Ship 11 distinct artifacts by Friday.
- Schedule everything for the following week.
- Comments + saves + email replies + Etsy reviews automatically populate the topic pool for the *next* Monday.

---

## 1. Operating Principles (locked)

1. **The slide is the atomic unit.** Every platform consumes slides differently, but they're all the same content molecule. If a thought can't fit on a slide, it isn't ready to publish.
2. **One Master Deck per week. No exceptions.** Constraint forces clarity; clarity forces the brand voice.
3. **No platform gets bespoke content.** Every artifact is a transform of the Master Deck, never a fresh creation. Bespoke = burnout.
4. **One human voice (Daniel's), faceless slides.** Per the research finding: faceless ≠ AI-voiced. Daniel's voice is the brand asset that compounds. AI tools live behind the mic.
5. **Every artifact carries exactly one CTA.** No multi-CTA hedging. CTA is determined by funnel role, not by guesswork.
6. **Every artifact tags its source deck.** Traceability is non-negotiable — without it, the self-feeding loop has no signal.
7. **Pinterest is search infrastructure, not social media.** Pins live for years; treat them as evergreen assets, not a feed.

---

## 2. The Atomic Unit: The Master Deck

Every week, Daniel produces ONE 10-slide deck. This is the source from which all other artifacts derive.

### Standard structure

| Slide | Role | Content |
|---|---|---|
| 1 | **Hook** | Headline promise — number + specificity ("5 STR write-offs your CPA forgets") |
| 2 | **Problem** | What hosts get wrong, named plainly |
| 3 | **Stakes** | The dollar cost of being wrong |
| 4 | **Concept** | The single key idea (the "if you remember one thing…") |
| 5 | **Step 1 / Tip 1** | First actionable piece |
| 6 | **Step 2 / Tip 2** | Second actionable piece |
| 7 | **Step 3 / Tip 3** | Third actionable piece |
| 8 | **Real example** | Actual numbers — pulled from a template, an Airtable row, a customer scenario |
| 9 | **Recap** | The 3 takeaways condensed back to a card |
| 10 | **CTA** | One specific URL — funnel-role-determined |

### Source pool for the topic itself

The Source Topic each week is pulled from one of six pools (ranked):

1. **Top engagement signal** from the past 30 days — top hook by saves on IG, top Short on YouTube, top pin on Pinterest. The audience is voting; the system listens.
2. **Top question from email replies** to the most recent newsletter.
3. **Top question from FB group** in the past week.
4. **One row of an Excel template** (a P&L line, a Schedule E line, a depreciation row) — guarantees product alignment.
5. **One IRS section / tax topic** (Section 280A, material participation, cost segregation, etc.) — guarantees authority alignment.
6. **One Etsy review** — confused customers reveal the next teardown topic.

If pools 1–3 are dry (early days), default to 4–6.

---

## 3. The Atomization Map (the 11 artifacts)

| # | Artifact | Source slides | Format | Funnel role | CTA |
|---|---|---|---|---|---|
| 1 | **YouTube long-form** | All 10 + VO walkthrough | 10–15 min video | MOFU | Blog post URL |
| 2 | **YouTube Shorts** (×5–10) | One slide per Short, hook-first | <60s | TOFU | `/47` lead magnet |
| 3 | **Instagram carousel** | Slides 1–9 → 1080×1350 each | 9-slide carousel | TOFU + saves | Link-in-bio → blog |
| 4 | **Instagram Reel** | Slides 1, 4, 5, 6, 7, 10 + VO | 30–45s | TOFU | Link-in-bio → blog |
| 5 | **Pinterest pins** (×3–5) | Slide 1 hook → 3–5 pin variants (tip-list, quote-card, infographic, question, before/after — per existing pin catalog) | 1000×1500 PNG | TOFU (search) | Blog post or `/47` |
| 6 | **Email newsletter** | Slides 4–8 expanded as teardown | 400–700 words | MOFU + nurture | Product page or blog |
| 7 | **Blog post (Ghost)** | All 10 expanded to 1500–2500 words | Long-form SEO | MOFU + SEO | Product page |
| 8 | **LinkedIn post + carousel** | Slide 1 in post body, full deck as PDF carousel | LinkedIn-native | TOFU | Blog post |
| 9 | **X/Twitter thread** | One tweet per slide (10 tweets) | Thread | TOFU | Blog post |
| 10 | **FB group post** | Slide 1 + question prompt | Discussion starter | Community | None (engagement only) |
| 11 | **Etsy listing refresh** | Slide 8 (real numbers) → injected into product description "What's inside" block | Listing copy update | BOFU | (the listing itself) |

**One deck → 11 artifacts → ~570 artifacts/year from 52 decks.**

---

## 4. The Funnel Loop

Every artifact carries exactly **one** of three CTAs. The CTA is fixed per artifact type — no decisions made during production.

### CTA hierarchy

| Funnel stage | CTA | Channels that use it |
|---|---|---|
| **TOFU** (cold reach) | `thestrledger.com/47` lead magnet | YT Shorts, Pinterest, X, FB group, IG (when relevant) |
| **MOFU** (interested) | Specific blog post URL | YT long-form, email, LinkedIn, IG carousel |
| **BOFU** (ready to buy) | Specific Etsy listing or site product page | Email sequences, Etsy listing copy itself, dedicated product walkthroughs |

### Self-feeding mechanism

```
                    ┌─────────────────────────────────────┐
                    │  Topic pool (6 sources)             │
                    │  — top engagement (IG/YT/Pin)       │◄────────┐
                    │  — email reply questions            │         │
                    │  — FB group questions               │         │
                    │  — P&L row / IRS topic / Etsy review│         │
                    └────────────┬────────────────────────┘         │
                                 │                                  │
                                 ▼                                  │
                    ┌─────────────────────────┐                     │
                    │  Master 10-slide Deck   │                     │
                    └────────────┬────────────┘                     │
                                 │                                  │
                                 ▼                                  │
              ┌──────────────────────────────────────┐              │
              │  11 atomized artifacts (atomization map)│            │
              └────────────┬─────────────────────────┘              │
                           │                                        │
                           ▼                                        │
              ┌────────────────────────────────────┐                │
              │  Funnel CTAs → /47, blog, Etsy     │                │
              └────────────┬───────────────────────┘                │
                           │                                        │
                           ▼                                        │
              ┌─────────────────────────────────┐                   │
              │  Audience signal capture        │                   │
              │  — saves, comments, replies,    │                   │
              │    email questions, reviews     │                   │
              └────────────┬────────────────────┘                   │
                           │                                        │
                           └────────────────────────────────────────┘
                                feeds next week's topic
```

The loop is designed to be operational on day one and *more* operational over time as signal density grows.

---

## 5. Asset Reuse Rules

These rules eliminate decisions and prevent drift.

1. **One Vista Create master per artifact type** (already exists for Pinterest pins; extend to IG carousel, IG Reel cover, YouTube thumbnail, LinkedIn carousel, X header). Duplicate the master, swap text and screenshot — never design from scratch.
2. **One audio recording per Master Deck.** Daniel records the YouTube long-form VO once. The Reel and Shorts cuts are extracted from that single audio file. Email and blog versions reuse the script.
3. **One image library per topic.** All graphics, screenshots, charts, and slides for a given Source Topic live in one folder, indexed by topic slug.
4. **Every CTA URL has a tracked alias.** UTM parameters per channel (`utm_source=pinterest`, `utm_source=ig_carousel`, `utm_source=yt_short`) so the funnel-loop signal is measurable.
5. **Every artifact tags `source_deck=YYYY-MM-DD-topic-slug` in metadata** (file name, post tag, schedule database). Without this tag, the engagement signal cannot map back to a topic in the input pool.
6. **No artifact is published "naked"** — every one points to the next funnel stage. If you can't pick the CTA in 5 seconds from the table above, the artifact isn't ready.

---

## 6. Production Cadence

Single creator (Daniel) executing this solo — proven cadence:

| Day | Block | Output |
|---|---|---|
| **Mon** | Topic + Deck | Pick from pool; draft 10-slide deck script |
| **Tue** | Design | Build deck in Vista Create using master |
| **Wed AM** | Record | Record YouTube long-form VO over deck |
| **Wed PM** | Cut | Export 5–10 Shorts and the 30–45s Reel from same audio |
| **Thu AM** | Port | Reformat deck slides 1–9 to IG carousel size; write IG caption |
| **Thu PM** | Pinterest | Generate 3–5 pin variants from slide 1 + master pin Vista template |
| **Fri AM** | Long-form text | Expand deck → blog post + email newsletter |
| **Fri PM** | Schedule + ladder | Schedule everything for next week; draft LinkedIn, X thread, FB post; refresh Etsy listing if applicable |

**Total active hours per week: ~10–14.** Output: 11 artifacts.

If a week is shortened, **always sacrifice the long-tail (blog, LinkedIn, X) before the core (deck, IG, YouTube, Pinterest, email).**

---

## 7. Automation Hooks (n8n Phase 2)

The current spec is human-executed. Below are the n8n automation points to add once the manual workflow is proven (target: Month 3+).

| Stage | Manual today | n8n automation |
|---|---|---|
| Topic-pool refresh | Daniel scans IG saves / email replies | n8n pulls IG API + Gmail + Etsy reviews into Airtable `topic_signals` table; ranks by engagement |
| Master Deck draft | Daniel writes script | Claude (over Airtable MCP) drafts a 10-slide deck given a topic row |
| Cut artifacts | Daniel cuts Shorts/Reel manually | HyperFrames or FFmpeg pipeline auto-exports cuts from a single source video |
| Pinterest scheduling | Manual via Creasquare | n8n posts to Creasquare API on a daily-pin cadence |
| Engagement-signal capture | Manual scan | n8n pulls saves/comments per artifact into `topic_signals`; tags by `source_deck` |
| Newsletter | Manual draft | Claude drafts from deck + Daniel edits |
| Blog post | Manual draft | Claude drafts long-form from deck + script + Daniel edits |
| Etsy listing refresh | Manual edit | n8n pushes updated description block via Etsy API |

The automation does not change the methodology — it just removes labor.

---

## 8. Success Metrics (per Master Deck)

Track these per-deck metrics in Airtable. Each row is one Master Deck; each column is one artifact's signal.

- **Reach:** YT views, IG reach, Pinterest impressions, blog pageviews, email open rate.
- **Saves:** IG carousel saves (the conversion-leading metric for an Excel-template buyer).
- **Click-through:** UTM hits from each channel to `/47` or blog or product page.
- **Conversion:** lead-magnet sign-ups attributed to source deck; Etsy/site purchases attributed to source deck.
- **Topic-signal feedback:** comments + email replies counted per deck; top three become input for next week.

A deck is "successful" if it generates ≥ 1 new lead-magnet sign-up per platform per week and ≥ 1 inbound question that becomes the next week's topic.

---

## 9. Voice & Trust Guardrails (from the AI-personality decision, 2026-04-29)

- **Daniel's real voice carries every voiceover.** No AI-generated narrators on top-of-funnel content. The voice is the brand asset.
- **AI is allowed everywhere behind the mic:** script drafting, slide layout, B-roll selection, caption writing, voice cleanup, image generation for non-authority assets.
- **Brand-mascot AI personas are out of scope.** Tax content sits next to IRS forms in the buyer's brain — anonymous synth voices read as low-effort and corrode trust.
- **An ElevenLabs clone of Daniel's own voice is permissible** for batch-producing Shorts when scheduling demands it, with the rule: same voice as the long-form recordings, never a different voice.
- **The product walkthrough test:** if a voice wouldn't work on the paid Excel template tutorial, it doesn't go on the marketing either. Marketing teaches the buyer what the brand sounds like.

---

## 10. Cross-references

- Pinterest production system: [`copy/pinterest/pin-catalog-first-30.md`](../../../copy/pinterest/pin-catalog-first-30.md)
- Email sequences: [`copy/email-sequences/`](../../../copy/email-sequences/)
- Existing blog posts: [`copy/blog-posts/`](../../../copy/blog-posts/)
- Etsy listings: [`copy/etsy-listings/`](../../../copy/etsy-listings/)
- Lead magnets: [`copy/lead-magnets/`](../../../copy/lead-magnets/)
- Master strategy: [`docs/superpowers/specs/2026-04-22-str-tax-platform-design.md`](2026-04-22-str-tax-platform-design.md)
- Weekly runbook: [`docs/runbooks/weekly-content-atomization.md`](../../runbooks/weekly-content-atomization.md)
- Topic-brief + Master Deck templates: [`copy/_atomization/`](../../../copy/_atomization/)
- Original platform research: [`research/youtube/channels.md`](../../../../research/youtube/channels.md), [`research/instagram/accounts.md`](../../../../research/instagram/accounts.md)
