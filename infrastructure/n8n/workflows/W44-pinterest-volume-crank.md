# W44 — Pinterest Volume Crank

**Priority:** P1 (Phase 4 — Traffic Engines)

**Family:** I — Research / off-page

**Summary:** Extends the existing **W15 (Pinterest Pin Performance Poll)** + **W16 (Blog Post Promotion Cascade)** with three additive workflows that compound Pinterest impressions without manual effort:

1. **Evergreen pin generator** — every Monday 09:00, Claude regenerates 5 new pin variants for each of the top-10 highest-performing blog posts in different visual styles (tip-list / quote-card / infographic / question / before-after).
2. **Top-performer auto-variant** — when W15 flags a pin in the top 10% (top 1–2 pins/week typically), W44 auto-generates 3 visual variants and queues them via Vista Create API.
3. **Idea Pin / Video Pin generator** — for the 5 newest blog posts each week, generate one Idea Pin (multi-slide carousel) and one Video Pin (Ken Burns over post images with TTS voiceover). Pinterest weights these higher than static pins as of 2026.

Outputs aggregate pin metrics to `ops/cache/pinterest.json` for the `/promote/pinterest` dashboard page. All inputs come from existing data — no new APIs, no new costs.

---

## Triggers

Three triggers in the same workflow:

1. **Cron — Monday 09:00 ET** → Branch A (evergreen pin generator)
2. **Webhook — `/webhook/top-performer-flagged`** → Branch B (auto-variant). Fired by W15 when a pin breaches top-10% threshold.
3. **Cron — Friday 14:00 ET** → Branch C (Idea/Video pin generator from week's new blog posts)

## Node-by-node configuration

### Branch A — Evergreen Pin Generator (Mon 09:00)

#### A1 — Cron Mon 09:00
#### A2 — Airtable Query: Top-10 Blog Posts by Lifetime Pinterest Outbound Clicks
- Filter: `Type=blog-post AND Status=Published AND Pinterest_outbound_clicks > 0`
- Sort: `Pinterest_outbound_clicks DESC`
- Limit: 10

#### A3 — SplitInBatches — one post per iteration

#### A4 — HTTP: Claude — Generate 5 Pin Variants (cred `7`)
- Model: `claude-sonnet-4-6`
- System: "You generate Pinterest pins for an STR-tax Excel templates brand. Output JSON array of exactly 5 pin specs in styles: tip-list, quote-card, infographic, question, before-after. Each spec: `{ style, pin_title (50-60 chars), pin_description (160-180 chars with 2-3 hashtags), visual_text (the bold overlay copy, max 12 words), color_scheme: 'brand-warm'|'brand-cool'|'brand-mono', alt_text (for accessibility) }`. STR-host audience skews female 30-55. Pinterest 2026 prefers vertical 1000x1500 with clear text overlay."
- User: blog post title + URL + top 3 headings + target keyword

#### A5 — HTTP: Vista Create API — Generate Pin Image
- POST `https://api.vistacreate.com/v1/projects/<TEMPLATE_ID>/render`
- Body: variant's visual_text + color_scheme + post image URL
- Returns: image URL
- Continue on fail: yes (if Vista fails, push to Daniel's manual review queue)

#### A6 — Airtable Create Content Row
- Type: `pinterest-pin`
- Status: `Draft` (Daniel still reviews + posts to Pinterest manually until Pinterest write API is wired)
- Linked to blog post
- Image URL: from Vista
- Pin title / description / alt_text / style

#### A7 — NoOp loop-back

#### A8 — Slack Digest `#str-platform-traffic`
"5 evergreen pins drafted for each of top 10 posts. Review at: <Airtable URL>"

### Branch B — Top-Performer Auto-Variant

#### B1 — Webhook `/webhook/top-performer-flagged`
Body: `{ "pin_id": "...", "blog_post_id": "rec...", "metric": "outbound_clicks", "value": 47 }` (fired by W15)

#### B2 — Airtable Get original pin + post details

#### B3 — HTTP: Claude — Generate 3 Visual Variants
- Same as A4 but with the original pin's style/copy as seed; rotate 3 visual treatments (color shift, layout flip, overlay font change)

#### B4 — Vista Create render (3 images)

#### B5 — Airtable Create 3 Content rows as `pinterest-pin` Draft

#### B6 — Slack notify

### Branch C — Idea/Video Pin Generator (Fri 14:00)

#### C1 — Cron Fri 14:00

#### C2 — Airtable Query: blog posts published in last 7 days

#### C3 — SplitInBatches

#### C4 — HTTP: Claude — Generate Idea Pin Storyboard
- Output: 5-slide carousel (cover + 3 content + CTA). Each slide: visual_text, layout, color
- Plus a Video Pin script: 15s max, 4-6 scene beats, voiceover text

#### C5 — Vista Create: Render Idea Pin (5-slide carousel) — Vista API supports multi-page rendering

#### C6 — HTTP: TTS — Generate Voiceover for Video Pin
- Use ElevenLabs or OpenAI TTS API (cheap cred `21` to be configured) OR fall back to silent video
- Output: mp3 URL
- Continue on fail: yes (silent video is acceptable on Pinterest)

#### C7 — HyperFrames render Video Pin
- Use HyperFrames CLI or Vista video template
- 9:16 aspect 1080x1920, 15s max
- Outputs mp4

#### C8 — Airtable Create Content rows
- `pinterest-idea-pin` for carousel
- `pinterest-video-pin` for video
- Both `Status=Draft`

#### C9 — Slack Digest

### Aggregation tail (all branches feed here)

#### Z1 — Pinterest Stats Update (chained off W15 nightly poll OR re-called here weekly)
Reads from Airtable Content:
- `pins_published_7d` — count of Status=Published pinterest-pin/idea/video where `Published at >= now-7d`
- `pins_published_30d` — same, 30d
- `impressions_7d` / `impressions_30d` — sum from W15 polled stats
- `outbound_clicks_30d` — sum
- `top_pins` — top 10 by clicks last 30d

Writes to `ops/cache/pinterest.json` (atomic).

### Error branch — standard envelope.

## Inputs

- Airtable Content table (existing — pinterest-pin type already in use)
- Airtable Identity (brand colors, fonts, voice)
- Claude API (cred 7)
- Vista Create API (cred 18 — already wired for W16)
- Pinterest API (cred 12 — for W15 polling; W44 doesn't post yet)
- Optional: TTS API (cred 21, to be configured for Video Pins)

## Outputs

- 50 evergreen pin drafts per Monday run (10 posts × 5 variants)
- 3 variants per top-performer flag (B branch fires ~1–2x/week)
- ~10 Idea Pins + ~5 Video Pins per Friday run (depends on weekly publish cadence)
- `ops/cache/pinterest.json` updated weekly with aggregate stats
- Daniel uploads to Pinterest manually for now (Pinterest API write tier requires Business approval — defer to W44b)

## Dependencies

- W15 must be active (provides the top-performer flag webhook and impressions data)
- W16 must be active (the cascade trigger creates the initial pins; W44 amplifies)
- Vista Create template IDs for: tip-list, quote-card, infographic, question, before-after, idea-pin-5-slide, video-pin-9-16
- `ops/cache/pinterest.json` writable
- HyperFrames CLI installed in the n8n container (for Branch C video gen)

## Edge cases

| Case | Handling |
|---|---|
| < 10 published blog posts exist | Branch A processes whatever exists; Slack note: "Only N posts qualified" |
| Vista Create rate limit | Slow down to 1 render/30s within batch; fall back to manual queue if 429 persists |
| Claude generates 4 pins instead of 5 | Acceptable — log warning |
| Pinterest API auth expired | Polling fails in W15; W44 still drafts but stats stay stale; Slack alert |
| Idea Pin renders > 50MB | Reject; regenerate at lower quality; if still > 50MB, fall back to 3-slide |
| TTS API outage | Render silent Video Pin; flag in Airtable for Daniel to add manual VO later |
| Cron fires while previous run still active | n8n queues; second run skips if first hasn't completed; log warning |

## Test cases

1. **Branch A happy path:** mock 10 published posts → 50 draft Content rows created → Slack digest sent → Vista images URLs valid.
2. **Branch B fire:** call `/webhook/top-performer-flagged` with valid pin_id → 3 new variants created.
3. **Branch C with 0 new posts this week:** workflow exits cleanly with Slack note "no posts to amplify".
4. **Vista failure:** mock Vista 500 → Airtable rows still created with `image_url = null` and `manual_render_needed = true`; Slack notice queued for Daniel.
5. **Pinterest.json aggregation:** run Z1 with mock Airtable data → file written with correct counts.

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Pins drafted per Monday run | 40–50 (10 posts × 5) | < 20 = source query broken |
| Pins published per week (manual upload by Daniel) | 20+ | < 10 sustained = Daniel disengaged |
| Pinterest impressions (W15 cache) | 200/wk → 2000/wk over 90 days | flat for 30d = pin quality issue |
| Outbound clicks 30d | track baseline first month, then +10%/month | declining for 60d = pause + analyze |

## Deployment

1. Identify Vista Create template IDs for the 7 pin types; store in env vars `VISTA_TEMPLATE_TIP_LIST` etc.
2. Confirm W15 + W16 are active and stable.
3. Install HyperFrames CLI in n8n container for Branch C (`npm i -g @hyperframes/cli`).
4. Configure cred `21` for TTS provider (optional for first ship — Branch C can run silent).
5. Import `W44-pinterest-volume-crank.json`.
6. Mount `ops/cache/pinterest.json` writable.
7. Activate Branch A first (lowest risk). Wait one Monday cycle to verify drafts look right. Then enable B and C.

## Iteration log

- `2026-05-10` — Initial spec. P1 build for Phase 4 Traffic Engines (W44).
