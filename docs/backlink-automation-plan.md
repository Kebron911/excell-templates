# Traffic + Backlink Plan — The STR Ledger (New-Brand Edition)

**Constraints honored:**
- Budget ceiling: $50/mo incremental (use what you already own)
- No existing brand reputation yet — defer all rep-gated tactics
- Low-hanging, easy-to-automate moves only
- Goal: get **juice to the site fast** (traffic in 30–90 days, ranking authority compounding behind it)

**Reframe up front:** the prior plan was a maintenance system for an established site. For a new brand, you need acquisition. And you need to separate two goals that get confused:

| Goal | Timeframe | What works |
|------|-----------|-----------|
| **Visits this month** | 30–90 days | Be where your buyer already is: Pinterest, Reddit, Etsy SEO, YouTube Shorts, Quora, niche FB groups |
| **Ranking authority** | 6–18 months | Backlinks from topically relevant sites, branded mentions, content depth |

A link from BiggerPockets DR84 helps **rankings**. A pin that goes mildly viral on Pinterest sends **visits**. Often the same activity does both — but design for the right one.

Your initial instinct ("links for traffic") is right when the link is on a **high-traffic page**. That changes which links to chase: forget DR/DA scoring; chase **pages that already get visits**.

---

## What you already own that drives this

You don't need to buy anything. The plan rides on existing infrastructure:

| Asset | Workflow it powers |
|-------|---------------------|
| n8n self-hosted | All workflows |
| Claude API (already in stack) | Drafting + classification |
| Airtable SSOT | State + queues |
| Influencersoft | Customer/subscriber comms |
| Instantly (W21) | Cold outreach when needed |
| Pinterest cascade (W15/W16) | Traffic engine #1 |
| Ghost blog | Content + entity hub |
| Etsy storefront | Already-converting traffic source |
| FB Group | Captive audience |
| Hostinger SFTP | 301 deploys |

**Free tools added (no recurring cost):**
- Google Search Console (you have this)
- Bing Webmaster Tools (free)
- IndexNow API (free, no auth needed)
- Reddit JSON API (free, no key needed)
- HN Algolia (free)
- Google Alerts RSS (free)
- Schema.org validator (free)
- Pinterest Trends (free)

---

## Phase 0 — Manual weekend sprints (do once, links forever)

These are the unglamorous one-shot moves that real marketers do in their first week. They're not workflows because you do them once. Each gives you a permanent dofollow link from a known-trustworthy source. Do all of these in one weekend.

### Sprint 0.1 — Profile-and-citation blitz (4 hours)
Create profiles on these. Each profile page links back to thestrledger.com. Most are dofollow. All are free. None require reputation.

| Site | Why |
|------|-----|
| Crunchbase | Business citation, often shows in branded SERP |
| LinkedIn Company Page | Already a must-have |
| Trustpilot | Lets future customers leave reviews; brand SERP shield |
| G2 (as a vendor) | Templates qualify as a "tool" — get listed |
| Capterra / GetApp / Software Advice | Same as G2; covers SMB software search |
| Product Hunt (claim maker profile) | Sets you up for a future launch |
| Indie Hackers profile | Founder profile + product link |
| AngelList / Wellfound | Company + founder profile |
| BetaList (when ready) | One-time launch listing |
| About.me | Cheap dofollow personal-brand citation |
| Substack publication (mirror your blog posts) | Cross-domain authority + email-list growth |
| Medium publication (republish posts with canonical tag back) | Same play |
| Reddit user profile (link in bio) | Used by Sprint 0.4 below |
| YouTube channel banner + about (link to site) | Traffic engine when you ship Shorts |
| Pinterest profile (already have) | Verified site link |

**Time:** 4 hours, one Saturday. **Cost:** $0. **Yield:** 12–15 dofollow citations + branded SERP shield.

### Sprint 0.2 — STR-niche directory submissions (2 hours)
Most STR/Airbnb tool directories accept free submissions. They're moderate-traffic pages, so the links double as referral traffic.

| Directory | Notes |
|-----------|-------|
| Airbnb host tool roundup pages (e.g., HostTools.io directory, Hospitable's resources page, OwnerRez integrations) | Some require API integration; just submit a "tools" listing |
| BNB Wizards / SmartBnB / Airbtics resources pages | Submit |
| Reddit r/AirBnBHosts wiki | Many subs let you propose resource additions |
| Awesome lists on GitHub (e.g., awesome-airbnb-tools) | PR a one-line addition |
| LiveRez, IGMS, Lodgify community resource pages | Submit |
| State/city STR association websites with a "resources" page | Submit |
| Spreadsheet template aggregators (Vertex42, Spreadsheet123 — even just user submissions) | Submit a free template lead-magnet version |

**Time:** 2 hours. **Cost:** $0. **Yield:** 5–15 niche-relevant links, some with traffic.

### Sprint 0.3 — Etsy → site link bridge (already half-done)
Your Etsy listings drive traffic to Etsy. Many buyers Google your shop name afterward. Make that branded search land somewhere good:
- Add "thestrledger.com" to every Etsy listing description's bottom line ("More tools at thestrledger.com")
- Etsy shop About section: "Visit thestrledger.com for the full template library"
- Etsy follow-up message after purchase: link to a free bonus on the site

Etsy outbound links are nofollow but **drive direct referral traffic** — exactly the thing your initial framing was reaching for.

**Time:** 1 hour. **Cost:** $0. **Yield:** continuous referral traffic from existing Etsy sales.

### Sprint 0.4 — Reddit + Quora seed answers (2 hours/week ongoing)
Each good answer = 50–500 visits, often for years. Pure traffic play.

- Subscribe to r/AirBnB, r/AirBnBHosts, r/Hosting, r/realestateinvesting, r/tax, r/Entrepreneur
- Quora topics: Airbnb, short-term rentals, rental property taxes
- When someone asks a question your templates solve: write a long, useful, link-free answer. Put your site link in your profile (Sprint 0.1).
- Optionally drop a single-line "I made a free version here: [link]" — only when contextually obvious
- Never copy-paste. Auto-detection bans accounts.

This is **not a workflow** — it's a recurring manual habit. W41 below detects the questions for you.

---

## Phase 1 — Cheap, automatable workflows (W41–W45)

Five workflows. None require Ahrefs, Featured, Brand24, or any new vendor. Total monthly delta: **~$10–30** (Claude API only).

### W41 — Reddit / Quora / FB Group Question Watcher
**Goal:** surface questions your templates solve, where you can answer naturally.
**Cost:** $0
**Trigger:** Cron every 30 min

**Nodes:**
1. Cron
2. Pull from free APIs:
   - Reddit JSON: `r/AirBnB/new`, `r/AirBnBHosts/new`, `r/realestateinvesting/new`, `r/tax/new`, `r/Entrepreneur/new`
   - HN Algolia: queries for "airbnb tax", "STR bookkeeping", "vacation rental spreadsheet"
   - Google Alerts RSS for `"Airbnb tax" OR "vacation rental tax" OR "STR bookkeeping"`
3. Claude classifies each post as `question | discussion | news | spam` + topic tag
4. If `question` AND topic matches your library: push to Slack with the link, the question, and a Claude-drafted helpful response (NOT a link drop — a useful answer)
5. Daniel reads it on phone, posts manually within 4 hours when relevant

**Why manual posting:** Reddit/Quora pattern-detect bot accounts. The 30-second human send keeps you alive. The automation does the **finding** — that's the actual work-saver.

**Yield:** 2–10 high-intent visits per good answer; over time, accumulates into a steady drip + builds your Reddit account karma so future links carry weight.

---

### W42 — Auto Profile/Directory Refresher
**Goal:** keep all your Phase 0 profiles current automatically when your bio, headshot, or product list changes.
**Cost:** $0
**Trigger:** Airtable `Identity` row change OR weekly cron

**Nodes:**
1. Trigger
2. Pull current bio, headshot URL, product list, key links from Airtable `Identity` table
3. For each citation in `Citations` table (the ones from Sprint 0.1):
   - If the platform has an API (LinkedIn, Crunchbase via API): push update
   - If not: write to Airtable `Manual Refresh Queue` with the new bio + the URL to update
4. Slack weekly digest: "These 4 profiles need your bio update"

**Why this matters:** stale profiles signal a dead brand. A consistent fresh bio across 15 profiles is a brand-strength signal both Google and humans pick up.

---

### W43 — IndexNow + GSC Submit on Every Publish
**Goal:** every new blog post + product page gets crawled within hours, not days.
**Cost:** $0 (both APIs are free)
**Trigger:** Airtable Content row published

**Nodes:**
1. Webhook from Airtable
2. POST URL to:
   - Google Search Console URL Inspection API (request indexing)
   - Bing IndexNow endpoint (free, no signup beyond key file in your site root)
   - Yandex IndexNow (same key)
3. Ping Pinterest with the URL (Pinterest API)
4. Submit to your `sitemap.xml` and ping search engines
5. Log status in Airtable

**Yield:** posts indexed in hours instead of days/weeks. Crucial for new-brand timeline.

---

### W44 — Pinterest Volume Crank (extension of W15/W16)
**Goal:** Pinterest is your #1 traffic engine for STR niche. Crank pin volume from "5 per blog post" to "5 per blog post + 5 evergreen pins per week + repins of top performers."

You already have W15 (performance poll) and W16 (cascade). What's missing:
- **Evergreen pin generator** — Claude generates 5 new pins/week from your existing top-10 blog posts in different visual styles (tip-list, quote, infographic, question, before/after)
- **Top-performer auto-variant** — when W15 flags a pin in top 10%, W44 auto-generates 3 visual variants and queues them
- **Idea Pins / Video Pins** — Pinterest weighs these higher in 2026; auto-generate from blog post intros

**Cost:** Claude API drafts + Vista Create API for image gen (already have access)
**Yield:** Pinterest impressions compound. STR-host audience skews heavy Pinterest. Realistic 6-month target: 50k+ monthly impressions, 1–3% CTR = 500–1500 visits/month.

---

### W45 — Customer → Review/Embed Loop
**Goal:** turn buyers into linkers. Every purchase already triggers W13 review request. Extend it.

**Nodes:**
1. After W13 fires (Day 7 review request), Day 21 trigger:
2. If customer left a positive review (Etsy/Gumroad/Trustpilot): send a follow-up
   - "Loved that you found the templates useful. If you write about your STR business anywhere — blog, FB group, member-only forum — would you consider linking back? Here's a badge if helpful: [embed snippet]"
3. Embed snippet = small HTML block with attribution link + tiny logo
4. Track via UTM `?utm_source=customer-embed`
5. Each new embed showing in referrer logs → Slack notification

**Cost:** $0
**Yield:** low conversion (~2–5% of happy customers do this) but every link is hyper-relevant and lasts forever. With 100 customers/mo at 3% conversion = 3 niche-relevant links/mo on autopilot.

---

## What this DOES NOT include (and why)

| Deferred | Why | When to revisit |
|----------|-----|----------------|
| Ahrefs / Semrush ($140–500/mo) | Too expensive at this stage; GSC + free tools cover 80% | When MRR > $3k/mo |
| Featured.com / Qwoted ($199/mo + rep needed) | No journalist credibility yet to vet | Month 6, after some Reddit/Pinterest authority + 1–2 podcast appearances |
| Cold outreach via Instantly (W34/W35-style) | Burns sender reputation if done before linkable assets exist | After at least one solid linkable asset published (data study or free tool) |
| Inbound 404 reclaim (W31) | New site has no inbound 404s with link equity yet | Month 9–12 |
| Anchor-drift monitoring (W33) | Need 100+ links before metrics are meaningful | Month 12+ |
| Original data study / STR Tax Survey | High-leverage but takes 4–6 weeks to produce + needs distribution muscle | Q4 (publish Jan 2027 for tax season 2027) |
| Founder podcast tour | Hosts vet guests via existing PR — need 1–2 prior placements first | Month 4–6 |
| PMS partner page outreach (Hospitable/OwnerRez/Hostfully) | Requires either an integration or an established audience | After product-market fit signal (50+ buyers/mo) |

---

## Honest 90-day expectations

If you ship Phase 0 (one weekend) + W41–W45 (1–2 weeks of n8n work), realistic outcomes:

| Metric | 30 days | 60 days | 90 days |
|--------|---------|---------|---------|
| **Visits/mo from Pinterest** (W44) | 200–500 | 800–2000 | 2000–5000 |
| **Visits/mo from Reddit/Quora** (W41 + manual posting) | 50–150 | 200–500 | 500–1500 |
| **Visits/mo from Etsy referral** (Sprint 0.3) | scales with Etsy sales | " | " |
| **Indexed pages** (W43) | All published in 1–3 days | " | " |
| **Permanent dofollow citations** (Sprint 0.1 + 0.2) | 12–25 | 25–35 | 30–40 |
| **Customer-embed links** (W45) | 0–1 | 1–3 | 3–8 |
| **Total referring domains** | 15–25 | 25–40 | 40–60 |

That's modest but it's **real, free, and compounding**. By month 6 the Phase 0 citations stop being meaningful relative to organic links you've earned from being useful on Reddit, Pinterest, Etsy.

---

## What to actually do this week

**Saturday (4 hrs):** Sprint 0.1 — profile blitz. Bang out all 12–15 citations.
**Sunday (3 hrs):** Sprint 0.2 — STR directory submissions + Sprint 0.3 — Etsy bridge edits.
**Mon–Tue:** Build W43 (IndexNow + GSC submit). 2–4 hours of n8n work. Free, immediate, every page benefits.
**Wed–Thu:** Build W41 (Reddit/Quora watcher). Slack notifications start that day.
**Fri:** Manual habit kicks in — answer 1–2 Reddit questions per day going forward.

Week 2: Build W44 (Pinterest crank) and W45 (customer embed loop).

Total cost: under $30 in Claude API. Total time: ~1.5 weeks of part-time work. Total ongoing maintenance: ~2 hours/week (Reddit answers + reviewing Slack queues).

---

## Cost ceiling

| Item | Monthly |
|------|---------|
| Claude API (W41–W45 incremental drafting) | $10–25 |
| Free APIs (GSC, IndexNow, Reddit, HN, Google Alerts) | $0 |
| Existing infra (n8n, Airtable, Instantly, IS, Hostinger) | $0 incremental |
| **Total Phase 1 delta** | **$10–25/mo** |

Well under your $50/mo ceiling. Leaves headroom to add Featured.com Pro ($199/mo) at month 6 once reputation is built.

---

## Empire Console (dashboard) updates

The dashboard at `tools/empire-console` currently frames `/promote` around the **old acquisition model** — outreach pipelines for backlinks, influencers, press. That framing is wrong for our current stage. Update the dashboard to reflect the traffic-first, distribution-first philosophy.

### Re-tiling `/promote/index.astro`

Reorganize the three groups:

**Group 1 — Traffic Engines** (where visits come from now)
| Tile | Status | Data source |
|------|--------|-------------|
| Pinterest perf | **Activate** (was disabled) | Pinterest API → `ops/cache/pinterest.json` |
| Reddit/Quora answers | **New** | `ops/social-answers.ndjson` (W41 writes) |
| Etsy referral | **New** | `ops/cache/traffic.json` filtered by `source=etsy` |
| Citations (profiles + directories) | **New** | `ops/citations.yaml` (Phase 0 sprints) |
| Newsletter | Existing | unchanged |
| Atomization decks | Existing | unchanged |
| Copy library | Existing | unchanged |

**Group 2 — Long Game (deferred until reputation built)**
Demote and badge as `Deferred · Mo 6+`:
| Tile | New badge |
|------|-----------|
| Backlinks (outreach) | `Deferred — Phase 0 sprints first` |
| Press / PR (HARO/podcasts) | `Deferred — needs first 1–2 placements` |
| Influencers | `Deferred — needs MRR > $3k` |
| Partnerships (PMS) | `Deferred — needs 50+ buyers/mo` |

**Group 3 — Service** — unchanged.

### New data sources to write

| Path | Shape | Producer | Consumer |
|------|-------|----------|----------|
| `ops/citations.yaml` | List of {`platform`, `url`, `tier`, `state` (pending/live/stale), `last_refresh`, `bio_version`} | Sprint 0.1 + 0.2 (manual init), W42 (refresh) | `/promote/citations` |
| `ops/social-answers.ndjson` | One row per Reddit/Quora question surfaced + answered. Fields: `surfaced_at`, `platform`, `subreddit_or_topic`, `question_url`, `answered`, `answer_url`, `est_visits` | W41 surfaces; Daniel marks `answered` | `/promote/social-answers` |
| `ops/customer-embeds.ndjson` | One row per detected embed. Fields: `detected_at`, `embedder_domain`, `widget_id`, `referrer_visits_30d`, `still_present` | W45 / W36 | `/promote/customer-embeds` (Phase 2) |
| `ops/cache/pinterest.json` | `{ generatedAt, pins_published_7d, pins_published_30d, impressions_7d, impressions_30d, top_pins[], outbound_clicks_30d }` | n8n nightly-refresh extension | `/promote/pinterest` |
| `ops/cache/indexnow.json` | `{ submissions_24h, submissions_7d, last_submission_at, errors_7d }` | W43 writes after each submit | `/promote/seo` (extend) |

### New `/lib/data` loaders

Mirror the `pipelines.ts` and `traffic.ts` patterns:

| File | Exports | Notes |
|------|---------|-------|
| `lib/data/citations.ts` | `readCitations()` returning `{ citations[], counts: { live, pending, stale } }` | YAML loader |
| `lib/data/social-answers.ts` | `readSocialAnswers()` returning `{ surfaced[], answered[], counts, est_visits_30d }` | NDJSON line-stream |
| `lib/data/pinterest.ts` | `readPinterest()` returning the cache schema with `isCacheReady` | Mirror `traffic.ts` |
| `lib/data/customer-embeds.ts` | `readCustomerEmbeds()` returning `{ active[], lost[], total_referrer_visits_30d }` | Phase 2 |

### New pages

| Page | Owner | Key widgets |
|------|-------|-------------|
| `/promote/pinterest.astro` | W44 | Pins published this week, impressions trend, top pins by outbound clicks, link to Pinterest |
| `/promote/social-answers.astro` | W41 | Questions surfaced (last 7d), answered count, conversion rate, top-traffic answers |
| `/promote/citations.astro` | Phase 0 + W42 | Tier-1 platforms checklist (live vs missing), stale bio refresher list |
| `/promote/etsy-referral.astro` | Existing traffic data | Etsy → site referral visits, conversion to email signup, top-referring listings |

### Updates to existing pages

**`/promote/backlinks.astro`** — rewrite to:
- Lead with "**Deferred — focus on Traffic Engines first**" banner
- Show outreach pipeline as **read-only history**, not next-action queue
- Add link to `/promote/citations` ("This is the cheap-link work that matters now")
- Keep the lost-link recovery widget (W31 work, when it eventually runs)

**`/promote/index.astro`** — see retiling above. Activate `Pinterest perf` tile. Add `Citations`, `Reddit/Quora answers`, `Etsy referral` tiles. Demote `Backlinks`, `Press`, `Influencers`, `Partnerships` with `Deferred` badges.

### `paths.ts` additions

```ts
citations: resolve(REPO_ROOT, 'ops', 'citations.yaml'),
socialAnswers: resolve(REPO_ROOT, 'ops', 'social-answers.ndjson'),
customerEmbeds: resolve(REPO_ROOT, 'ops', 'customer-embeds.ndjson'),
cache: {
  // ...existing entries...
  pinterest: resolve(REPO_ROOT, 'ops', 'cache', 'pinterest.json'),
  indexnow:  resolve(REPO_ROOT, 'ops', 'cache', 'indexnow.json'),
}
```

### Workflow → dashboard wiring

Each new workflow writes to a known path so the dashboard reads cleanly:

| Workflow | Writes to | Surfaces on |
|----------|-----------|-------------|
| W41 Reddit/Quora watcher | `ops/social-answers.ndjson` | `/promote/social-answers` |
| W42 Profile refresher | `ops/citations.yaml` (updates `last_refresh`) | `/promote/citations` |
| W43 IndexNow + GSC submit | `ops/cache/indexnow.json` | `/promote/seo` (existing page, extend) |
| W44 Pinterest crank | `ops/cache/pinterest.json` | `/promote/pinterest` |
| W45 Customer → embed | `ops/customer-embeds.ndjson` | `/promote/customer-embeds` (Phase 2) |

### Implementation phasing for dashboard

Same week as workflow build, in order:
1. Create `ops/citations.yaml` stub + page (so Phase 0 weekend has somewhere to land)
2. Update `/promote/index.astro` retile + `/promote/backlinks.astro` deferred banner
3. Create `social-answers.ndjson` schema + page (when W41 ships)
4. Create `pinterest.json` cache + page (when W44 ships)
5. Customer-embed page (Phase 2 only — when first calculator widget exists)

---

## When to upgrade

Trigger conditions to graduate to the bigger plan:

| Trigger | Unlock |
|---------|--------|
| MRR > $3k/mo | Add Ahrefs Standard or Semrush Pro |
| 50+ pieces of long-form content published | Add W31 inbound 404 reclaim |
| 1–2 podcast appearances landed | Build W35 Featured/Qwoted responder |
| First STR Tax Survey published (Q4 2026) | Distribute via cold outreach (W34) — now you have a hook |
| 100+ active customers | Push for PMS partner page inclusions |

The plan above gets you to those triggers without spending money you don't yet have or claiming reputation you don't yet hold.
