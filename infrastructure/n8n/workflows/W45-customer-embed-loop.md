# W45 — Customer → Review / Embed Loop

**Priority:** P2 (Phase 4 — Traffic Engines)

**Family:** I — Research / off-page

**Summary:** Extends the existing **W13 (Review Request)** with a follow-up Day-21 ask: customers who left a positive review get a one-line invitation to either (a) embed an attribution badge on their own STR-related content or (b) link to The STR Ledger from their blog/forum/FB post. Includes a copy-paste HTML embed snippet pre-tagged with UTM. Detected embeds + referrer hits log to `ops/customer-embeds.ndjson` for `/promote/customer-embeds` (Phase 2 page).

Low conversion (~2–5% of happy customers act), but every link earned is hyper-relevant, lasts forever, and required no cold outreach to acquire.

---

## Triggers

1. **Cron — daily 10:30 ET** (30 min after W13's daily 10:00 cron) — finds eligible Day-21 customers and dispatches the embed-ask email.
2. **Webhook — `/webhook/embed-detected`** — fired by W44 or a separate referrer-log poll when a new embed is detected in incoming referrer traffic.

## Node-by-node configuration

### Branch A — Day-21 Embed Ask

#### A1 — Cron Daily 10:30
#### A2 — Airtable Query: Eligible Customers
- Filter:
  - `Purchase date <= today - 21 days`
  - `Embed_ask_sent != true`
  - `Review_left = true`
  - `Review_rating >= 4` (only happy customers)
- Sort: `Purchase date DESC`

#### A3 — SplitInBatches

#### A4 — HTTP: Claude — Draft Embed Ask Email (cred `7`)
- Model: `claude-haiku-4-5-20251001`
- System: "You draft a one-paragraph follow-up email in Daniel's voice. Thank the customer for the review (cite the specific star rating + review excerpt if available). Then ONE ask: 'If you write about your STR business anywhere — blog, FB group, member-only forum — would you consider linking back? Here's a badge if helpful: [BADGE_PLACEHOLDER]'. Plain text. No emoji. No 'P.S.' Max 90 words. Sign 'Daniel, The STR Ledger'."
- User: customer first name + product purchased + review_excerpt + review_rating

#### A5 — Code: Build Embed Snippet
```js
const customerId = $json.customer_id;
const utm = `utm_source=customer-embed&utm_campaign=str-ledger-badge&utm_content=${customerId}`;
const snippet = `<a href="https://thestrledger.com?${utm}" target="_blank" rel="noopener">
  <img src="https://thestrledger.com/badges/built-with-strledger.svg"
       alt="Built with The STR Ledger templates"
       width="180" height="54" loading="lazy">
</a>`;
return [{ json: { ...$json, embed_snippet: snippet, embed_utm: utm } }];
```

#### A6 — HTTP: Influencersoft — Send Email
- POST to IS API with the email body + customer email + subject `"Quick favor (+ a free badge)"`
- IS handles unsubscribe footer + DKIM/SPF
- Capture send_id

#### A7 — Airtable Update Customer
- `Embed_ask_sent = true`
- `Embed_ask_sent_at = now`
- `Embed_utm = <utm>`
- `Embed_send_id = <IS send_id>`

#### A8 — NoOp loop-back

### Branch B — Embed Detection

#### B1 — Webhook `/webhook/embed-detected`
Body: `{ "embedder_domain": "...", "widget_id": "...", "referrer_url": "...", "utm_content": "<customer_id>" }`

(B1 fires from a referrer-log poll workflow OR from W44 if it scrapes Ahrefs/Semrush for `<customer-embed>` UTM tag in inbound links. For new-brand stage, simplest: a daily Plausible/GA4 export filtered by `utm_source=customer-embed` writes new embedder_domain rows.)

#### B2 — Code: Dedupe vs existing embeds.ndjson

#### B3 — Local Filesystem: Append `ops/customer-embeds.ndjson`
Row shape:
```json
{
  "detected_at": "2026-05-10T14:23:00Z",
  "embedder_domain": "examplehost.com",
  "embedder_url": "https://examplehost.com/airbnb-tools",
  "widget_id": "badge-builtwith",
  "linked_customer_id": "recXYZ",
  "referrer_visits_30d": 0,
  "still_present": true,
  "last_verified": "2026-05-10T14:23:00Z"
}
```

#### B4 — Airtable Update Customer
- `Embed_active = true`
- `Embed_first_detected = now`
- Increment `Customer_link_count`

#### B5 — Slack `#str-platform-traffic`
- New embed notification with embedder_domain, customer name, customer's product, badge type
- Optional: Claude drafts a thank-you DM/email — push to Slack for `[Approve & Send]` (relationship building for future co-marketing)

### Branch C — Stale Embed Sweep (weekly)

#### C1 — Cron Sunday 22:00
- Read all rows in `ops/customer-embeds.ndjson` where `still_present = true`
- For each: HTTP HEAD `embedder_url`; fetch and check if the badge URL still appears in HTML
- If absent for 7 days: mark `still_present = false`, write back to ndjson
- If newly absent: Slack note (don't alarm; just informational)

### Error branch — standard envelope.

## Inputs

- Airtable Customer table (must have: `Purchase_date`, `Review_left`, `Review_rating`, `Review_excerpt`, `Embed_ask_sent`, `Embed_utm`, `Embed_active`)
- IS API (cred `2`) for the send
- Referrer-log source (Plausible export OR GA4 BigQuery export) — feeds B1
- `ops/customer-embeds.ndjson` writable
- Brand asset: `https://thestrledger.com/badges/built-with-strledger.svg` — SVG sources committed at `brand/assets/badges/` (light + dark variants + README). One-time upload to Hostinger `public_html/badges/` required.

## Outputs

- IS emails sent to eligible customers
- `ops/customer-embeds.ndjson` rows for detected embeds
- Slack notifications on new embeds
- Updates to Airtable Customer (Embed_ask_sent, Embed_active flags)
- Surfaces on `/promote/customer-embeds` (Phase 2 dashboard page)

## Dependencies

- W13 already running and writing `Review_left` / `Review_rating` back to Airtable
- IS email template `embed-ask` exists (created from Claude draft + Daniel review)
- Badge SVG hosted at the stable URL
- Plausible/GA4 export pipeline exists (for B1) — may need a tiny separate flow to poll referrers
- `ops/customer-embeds.ndjson` mounted writable

## Edge cases

| Case | Handling |
|---|---|
| Customer left 5-star but text-only review (no excerpt) | Claude fallback: omit review excerpt, generic thank-you |
| Customer unsubscribed | IS skips send; Airtable still marks `Embed_ask_sent = true` (don't retry) |
| Customer left negative review | Filter excludes them (`Review_rating >= 4` gate) |
| Same embedder_domain detected on 3 pages | First detection logs; subsequent dedupe at B2; refresh `last_verified` only |
| UTM stripped by referrer | B1 can't link back to customer_id — still log embed with `linked_customer_id = null` |
| Badge SVG returns 404 | Critical — Slack P1 alert; customers see broken image on their site |
| Embed removed | C1 sweep flips `still_present = false`; not deleted from log (history matters) |

## Test cases

1. **Day-21 ask:** mock customer purchased 21 days ago with 5-star review → cron picks them up → IS receives send request → Airtable marks `Embed_ask_sent`.
2. **Filter happy only:** mock 3-star reviewer → cron skips them.
3. **Embed detected:** POST to B1 webhook with mock data → ndjson row appended → Slack notification → Airtable Customer flagged `Embed_active`.
4. **Stale sweep:** mock embed row from 14 days ago where badge no longer in HTML → C1 flips `still_present` to false.
5. **Dedupe:** call B1 twice with same `embedder_url` within 5 minutes → only one ndjson row exists.

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Embed asks sent/week | matches positive-review pace (~5–20/wk at 100 customers/mo with 60% review rate) | 0 for 14d = trigger gate broken |
| Embed-ask → embed conversion | 2–5% | < 1% sustained = badge design issue or email copy too cold |
| Active embeds | grows monotonically (with churn) | declining month-over-month = customers removing badges = quality concern |
| Referrer visits from embeds | 5–30/mo per active embed | drops to 0 sitewide = UTM tracking broken |

## Deployment

1. Upload pre-built badge SVGs from `brand/assets/badges/` to Hostinger `public_html/badges/` per the README in that folder. Both light and dark variants ship committed.
2. Add Airtable Customer columns: `Embed_ask_sent`, `Embed_ask_sent_at`, `Embed_utm`, `Embed_active`, `Embed_first_detected`, `Customer_link_count`.
3. Create IS email template `embed-ask` (Daniel review the Claude default once; lock).
4. Build Plausible referrer-export polling flow (separate, simple — 30 min build) feeding B1.
5. Import `W45-customer-embed-loop.json`.
6. Mount `ops/customer-embeds.ndjson` writable in n8n container.
7. Activate Branch A first (no risk — just a follow-up email). Wait 21+ days from first customer batch to see effect. Then enable B and C.

## Iteration log

- `2026-05-10` — Initial spec. P2 build for Phase 4 Traffic Engines (W45).
