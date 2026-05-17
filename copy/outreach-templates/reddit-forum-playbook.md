# Reddit / Forum Playbook

**Purpose:** Surface The STR Ledger inside the communities where Airbnb hosts already discuss their problems — without getting banned or flamed.
**Owner:** Daniel
**Last reviewed:** 2026-05-16

> **Reddit's rule:** if your last 10 posts/comments are 90%+ helpful contribution and 10% self-promotion, you're a member. If it's 50/50, you're a spammer. We aim for 95/5.

---

## Target communities

### Reddit (Tier A — direct STR audience)

| Subreddit | Subs | Self-promo policy | Best post type |
|-----------|------|---------------------|----------------|
| r/AirBnBHosts | 30K | Strict — auto-removes links | Text answers in threads; never original-post links |
| r/airbnb_hosts | 60K | Moderately strict | Same |
| r/ShortTermRentals | 18K | Friendly to operator content | Operator stories OK if no link in body |
| r/realestateinvesting | 1.5M | Strict for promo | STR-segment comments only |
| r/vrbo | 12K | Quiet, low moderation | Same as r/airbnb |
| r/AirBnB | 600K | Mostly guest audience — DON'T pitch hosts here | Avoid, mostly noise |

### Reddit (Tier B — adjacent personal finance / small biz)

| Subreddit | Subs | Why fit |
|-----------|------|---------|
| r/smallbusiness | 1.5M | Solo-founder/templates angle |
| r/sidehustle | 2M | "I built a templates business" stories |
| r/Bookkeeping | 50K | When asked about STR specifically |
| r/tax | 200K | STR tax Q&A — high authority signal |
| r/Entrepreneur | 3M | Solo-founder Q&A occasionally |
| r/Frugal | 2M | Avoid — wrong audience |

### Facebook Groups (Tier A — paid lurker access)

| Group | Members | Notes |
|-------|---------|-------|
| Airbnb Superhosts | 300K+ | Strict no-promotion; comment authority only |
| Short-Term Rentals USA | 100K+ | Friendly; one of the best-moderated |
| STR Rental Hosts | 80K+ | Active daily threads |
| Hospitable Users | 30K+ | Tools-friendly group |
| BiggerPockets STR Forum | (forum, not FB but same model) | Most-credible long-form audience |

### Slack / Discord

- BiggerPockets Slack (members-only)
- IndieMakers (for founder-build angle)
- ProductHunt Makers (when shipping new tools)

---

## The 95/5 contribution rule

For every post/comment that mentions The STR Ledger (5%), spend 19 helpful comments in the same community (95%) that don't.

### What "helpful" looks like
- Answer a question with specifics, no link
- Share a number from your own portfolio
- Push back gently on bad tax advice with a reference to IRS pub
- Show your work — e.g. "Here's how I'd model that: revenue $X, cleaning $Y, software stack $Z..."

### What it does NOT look like
- "Great question, I cover this on my site at [link]"
- "DM me, I can help"
- Posting the same answer in 5 subreddits in one day
- Replying to a year-old thread with a link

---

## Post types that work

### Type 1: First-person answer (90% of activity)
> "I had this exact issue last year — what worked for me was {{ specific thing }}. The math: {{ numbers }}. Caveat: {{ honest limitation }}."

### Type 2: Resource share (10% of activity, link allowed in 1 of 20 posts)
> "There's a free PDF that maps every Schedule E line specifically for STR — I keep it next to me during tax-prep. Lives at thestrledger.com/47 (no email gate, just a download)."

Only when:
- The post is asking for exactly that resource
- The community allows links (check rules)
- Your account has >50 unrelated helpful comments in the last 60 days
- You're disclosing you built it: "I built it last year for my own taxes" — never pretend it's third-party

### Type 3: Long-form story post (Tier B subs — 1 per quarter)
> Title: "I built a 65-template financial-ops library for STR hosts solo — what worked and what failed"
> Body: 1500-word build journey, with screenshots, numbers, and honest reflections. Link at the bottom in a "if you want to see it" P.S., not in the headline.

These hit r/Entrepreneur and r/SideHustle hard, IF authentic.

---

## What to track per post

Maintain a sheet (could just be `ops/reddit-pipeline.yaml`):

```yaml
- subreddit: r/AirBnBHosts
  url: https://reddit.com/r/AirBnBHosts/comments/abc123/...
  type: helpful_answer
  link_included: false
  upvotes: 24
  comments_back: 6
  saved_count: 0
  date: 2026-05-16
  account_karma_at_post: 240
```

### Account-level tracking
- Karma to date in each subreddit
- Mod-flag count (target: 0)
- Ratio of helpful : self-promotional posts (target ≥ 19:1)

---

## Voice rules

1. **No "Hey hosts!" intro.** Reddit smells AI-generated posts from a mile.
2. **One concrete number per post.** Anchors credibility.
3. **Use parentheticals to acknowledge limitations.** ("This works if you're at 1 property; falls apart at 5+.")
4. **Push back on bad advice politely.** "Mind if I add a counterpoint? IRS Pub 527 actually says..."
5. **Match the sub's tone.** r/realestateinvesting is buttoned-up; r/SideHustle is casual. Lurk before posting.
6. **Never use the words 'leverage', 'maximize', 'optimize', 'unlock', 'game-changer'.** They scan as marketing.

---

## Forbidden moves

- Cross-posting the same answer in multiple subs same day
- Asking for upvotes
- Editing a post-2-hours-later to add a link
- Voting on your own posts from alt accounts
- Posting from a 1-week-old account
- Replying to a year-old thread with a link
- Using URL shorteners (bit.ly, etc) — flagged as spam
- AMA without explicit mod permission

---

## When to post (best engagement windows)

- **Reddit:** Mon–Thu 9 AM–1 PM ET (target audience reads on lunch break)
- **Facebook groups:** Wed–Fri 7 AM ET (pre-work scroll)
- **BiggerPockets forum:** Tue–Wed evenings ET (longer-form readers)

Avoid weekends in B2B-leaning subs (low engagement). Avoid Mondays in r/personalfinance (too crowded by big posts).

---

## Cadence target

- **4 helpful comments per day** in target subs (28/week)
- **1 link-allowed post per week** maximum, only when genuinely on-topic
- **1 long-form story post per quarter** in Tier-B subs
- **0 promotional DMs.** Ever. If someone asks for the link in DM, send it; never initiate.

---

## Crisis playbook (when a post is flagged or thread goes hostile)

| Situation | Response |
|-----------|----------|
| Post auto-removed by AutoMod | Don't repost. Check rules, edit if needed, message mod once politely. |
| Post manually removed by mod | Accept silently. DM mod once: "Want to understand what I got wrong here — I'll skip self-promo entirely if that's the right rule." |
| Comment getting downvoted | Stop replying. Don't argue. Edit to add nuance once if appropriate, then move on. |
| Direct accusation of spam | Acknowledge politely, link your account history showing 95%+ non-promotional contribution. |
| Bandwagon hostility against The STR Ledger specifically | DO NOT defend in-thread. Note the criticism, fix the underlying issue if real (e.g., refunds, support response time), then continue helpful posting elsewhere. |

---

## KPIs

| Metric | Target (90 days) |
|--------|-------------------|
| Helpful contributions across communities | 350+ |
| Times we were tagged/quoted/saved | 100+ |
| Direct traffic from Reddit | 800+ sessions/mo by Month 3 |
| Mod-removal events | 0 |
| Account bans | 0 |
| Email subscribers attributed to Reddit | 50/mo by Month 3 |

---

## Files to maintain alongside

- `copy/outreach-templates/reddit-forum-playbook.md` (this file)
- `ops/reddit-pipeline.yaml` — per-post tracker
- `ops/manual work/reddit-daily-workflow.md` — TO BUILD: 15-min daily routine for cycle through targeted subs
