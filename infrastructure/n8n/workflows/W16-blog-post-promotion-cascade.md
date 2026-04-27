# W16 — Blog Post Promotion Cascade

**Priority:** P2

**Family:** F — Content multiplication & distribution

**Summary:** When an Airtable Content row of `Type=blog-post` flips to `Status=Published`, an Airtable automation calls this workflow's webhook with the row's `record_id`. The workflow fetches the row, asks Claude (Opus 4.7) for 5 Pinterest pin variants (tip-list, quote-card, infographic, question, before/after), generates a pin image for each via Vista Create, writes 5 new Content rows of `Type=pinterest-pin Status=Draft` linked back to the parent blog post, then asks Claude for an email broadcast (subject + markdown body), writes that as `Type=email-broadcast Status=Draft`, and posts a summary to `#str-platform-content`.

---

## Trigger

HTTP POST webhook: `https://n8n.thestrledger.com/webhook/blog-published`

Configured in **Airtable Content table → Automations → When record updated** with trigger condition `Type = "blog-post" AND Status = "Published"` and action **Run script (n8n call)** posting:

```json
{ "record_id": "{{ trigger.record.id }}" }
```

## Node-by-node configuration

### Node 1 — Webhook (Blog Published)

- **Type:** `n8n-nodes-base.webhook` (v2)
- **Path:** `/webhook/blog-published`
- **Method:** POST
- **Response mode:** Respond immediately with 200

### Node 2 — Function: Extract Blog Record ID

```js
const body = $input.first().json.body || $input.first().json;
const recordId = body.record_id || body.recordId || body.id;

if (!recordId) {
  throw new Error('Missing record_id in webhook payload from Airtable automation');
}

return [{ json: {
  record_id: recordId,
  triggered_at: new Date().toISOString()
}}];
```

### Node 3 — Airtable: Get Blog Post Row

- **Table:** Content (`TABLE_ID_CONTENT`)
- **Operation:** Get by record id (`{{ $json.record_id }}`)
- Returns full record with `Title, URL, Target keyword, Summary/Body`.

### Node 4 — Function: Build Claude Pin Prompt

```js
const row = $input.first().json;
const f = row.fields || {};
const title = f.Title || f.title || '';
const url = f['URL'] || f.url || '';
const keyword = f['Target keyword'] || f.target_keyword || '';
const summary = f['Summary'] || f.summary || f.Body?.slice(0, 500) || '';

if (!title || !url) throw new Error('Blog row missing Title or URL');

const prompt = `You are a Pinterest content strategist for The STR Ledger ...
Generate exactly 5 Pinterest pin variants ...
variant_type order: tip-list, quote-card, infographic, question, before-after
Each object: { variant_type, pin_title, pin_description, hashtags[] }
Return ONLY the JSON array.`;

return [{ json: {
  blog_record_id: row.id,
  blog_title: title,
  blog_url: url,
  blog_keyword: keyword,
  prompt: prompt,
  triggered_at: $node['Extract Blog Record ID'].json.triggered_at
}}];
```

### Node 5 — HTTP POST: Claude — Generate Pin Variants

- **Method:** POST
- **URL:** `https://api.anthropic.com/v1/messages`
- **Auth:** httpHeaderAuth, credential `id: 7` (Claude API — `x-api-key` header)
- **Headers:** `anthropic-version: 2023-06-01`, `content-type: application/json`
- **Body:**

```js
JSON.stringify({
  model: 'claude-opus-4-7',
  max_tokens: 2000,
  messages: [{ role: 'user', content: $json.prompt }]
})
```

- **Timeout:** 60s

### Node 6 — Function: Parse Pin Variants

```js
const resp = $input.first().json;
const text = resp.content?.[0]?.text || '';
if (!text) throw new Error('Claude returned empty content');

let cleaned = text.trim()
  .replace(/^```json\s*/i, '')
  .replace(/^```\s*/, '')
  .replace(/```\s*$/, '')
  .trim();

let variants;
try { variants = JSON.parse(cleaned); }
catch (e) { throw new Error('Failed to parse Claude JSON: ' + e.message); }

if (!Array.isArray(variants) || variants.length === 0) {
  throw new Error('Claude did not return a non-empty array');
}

const ctx = $node['Build Claude Pin Prompt'].json;

const templateMap = {
  'tip-list': $env.VISTA_TEMPLATE_TIP_LIST || 'tmpl-tip-list-001',
  'quote-card': $env.VISTA_TEMPLATE_QUOTE || 'tmpl-quote-card-001',
  'infographic': $env.VISTA_TEMPLATE_INFOGRAPHIC || 'tmpl-infographic-001',
  'question': $env.VISTA_TEMPLATE_QUESTION || 'tmpl-question-001',
  'before-after': $env.VISTA_TEMPLATE_BEFORE_AFTER || 'tmpl-before-after-001'
};

return variants.map((v, idx) => ({ json: {
  index: idx,
  variant_type: v.variant_type,
  pin_title: v.pin_title,
  pin_description: v.pin_description,
  hashtags: Array.isArray(v.hashtags) ? v.hashtags : [],
  vista_template_id: templateMap[v.variant_type] || templateMap['tip-list'],
  blog_record_id: ctx.blog_record_id,
  blog_title: ctx.blog_title,
  blog_url: ctx.blog_url,
  blog_keyword: ctx.blog_keyword
}}));
```

### Node 7 — SplitInBatches (Batch Variants 1 / batch)

- **Type:** `n8n-nodes-base.splitInBatches` (v3)
- **Batch size:** 1 (one Vista Create call + one Airtable write per variant)
- **Output 0 (done):** flows to **Build Email Prompt** (Node 10)
- **Output 1 (loop):** flows to **Vista Create — Generate Pin Image** (Node 8)

### Node 8 — HTTP POST: Vista Create — Generate Pin Image

- **Method:** POST
- **URL:** `https://api.create.vista.com/v1/projects`
- **Auth:** httpHeaderAuth, credential `id: 14` (Vista Create API)
- **Body:**

```js
JSON.stringify({
  template_id: $json.vista_template_id,
  fields: {
    headline: $json.pin_title,
    subheadline: $json.blog_keyword,
    body: $json.pin_description.slice(0, 200),
    cta: 'Read the full post',
    url: $json.blog_url
  },
  output_format: 'png',
  output_size: { width: 1000, height: 1500 }
})
```

- **Timeout:** 60s
- Vista Create returns `{ id, output_url }` (or `image_url`); both fields are read in Node 9 for resilience.

### Node 9 — Airtable: Create Pin Content Row

- **Table:** Content (`TABLE_ID_CONTENT`)
- **Operation:** Create
- **Fields written:**
  - `Title`: pin_title (from variant)
  - `Type`: `pinterest-pin`
  - `Status`: `Draft`
  - `Variant type`: `{{ variant_type }}`
  - `Pin description`: `{{ pin_description }}`
  - `Hashtags`: hashtags joined with space
  - `Image URL`: `{{ output_url || image_url || url }}` from Vista response
  - `Vista project id`: `{{ id || project_id }}`
  - `Parent blog post`: link `[{{ blog_record_id }}]`
  - `Created at`: ISO timestamp
- After create, control returns to Node 7 (SplitInBatches) for the next variant.

### Node 10 — Function: Build Email Prompt

Runs once after the variant loop's "done" output.

```js
const ctx = $node['Build Claude Pin Prompt'].json;
const variantCount = $items('Parse Pin Variants', 0, 0).length;

const prompt = `You are an email copywriter for The STR Ledger newsletter ...
Blog title: ${ctx.blog_title}
Blog URL: ${ctx.blog_url}
Target keyword: ${ctx.blog_keyword}

Return JSON: { subject (max 60 chars), body_markdown (150-300 words, ends with CTA link) }
Voice: editorial, dry-confident, host-to-host. No hype. No exclamation marks.
Return ONLY the JSON object.`;

return [{ json: {
  blog_record_id: ctx.blog_record_id,
  blog_title: ctx.blog_title,
  blog_url: ctx.blog_url,
  variant_count: variantCount,
  prompt: prompt
}}];
```

### Node 11 — HTTP POST: Claude — Generate Email Broadcast

Same shape as Node 5: `claude-opus-4-7`, max_tokens 1500, single user message containing the prompt.

### Node 12 — Function: Parse Email JSON

Strips markdown fences, parses JSON, validates `subject` and `body_markdown` exist, propagates blog context for downstream nodes.

### Node 13 — Airtable: Create Email Content Row

- **Table:** Content (`TABLE_ID_CONTENT`)
- **Operation:** Create
- **Fields written:**
  - `Title`: email subject
  - `Type`: `email-broadcast`
  - `Status`: `Draft`
  - `Email subject`: subject
  - `Email body`: body_markdown
  - `Parent blog post`: link `[{{ blog_record_id }}]`
  - `Created at`: ISO timestamp

### Node 14 — Slack Cascade Summary

- **Channel:** `#str-platform-content`
- **Message:**

```
📝 Blog post promotion cascade ready
Blog: <blog_title>
URL: <blog_url>
📌 Pinterest pin drafts created: <variant_count>
✉️ Email broadcast draft: "<subject>"
All items in Airtable Content as Status=Draft. Review + publish when ready.
```

### Error branch (wraps Nodes 2–13)

If any node fails:
1. **Build Error Envelope** packages timestamp, workflow, node, message, payload, status `Open`.
2. **Log Error to Airtable** writes to `TABLE_ID_ERRORS`.
3. **Slack Error Alert** posts to `#str-platform-alerts`.

## Inputs

- Webhook payload: `{ record_id: "<airtable_record_id>" }`
- Airtable Content row of Type=blog-post with: Title, URL, Target keyword, Summary or Body
- Env vars (optional, with safe fallbacks): `VISTA_TEMPLATE_TIP_LIST`, `VISTA_TEMPLATE_QUOTE`, `VISTA_TEMPLATE_INFOGRAPHIC`, `VISTA_TEMPLATE_QUESTION`, `VISTA_TEMPLATE_BEFORE_AFTER`

## Outputs

- 5 new Airtable Content rows: `Type=pinterest-pin Status=Draft` with image URL + parent link
- 1 new Airtable Content row: `Type=email-broadcast Status=Draft` with subject + body
- Slack summary in `#str-platform-content`

## Dependencies

- Airtable automation on Content table firing the webhook on Status→Published transitions
- Claude API key in credential `id: 7` (header `x-api-key`)
- Vista Create API key in credential `id: 14`
- Airtable credential `id: 1`, Slack credential `id: 3`
- Airtable Content table columns: `Type, Status, Title, URL, Target keyword, Summary, Variant type, Pin description, Hashtags, Image URL, Vista project id, Email subject, Email body, Parent blog post (link to self), Created at`
- Vista Create templates exist for the 5 variant types (or env vars set to the real template IDs)

## Edge cases

| Case | Handling |
|---|---|
| Webhook missing `record_id` | Node 2 throws → error branch fires |
| Blog row missing Title or URL | Node 4 throws → error branch fires |
| Claude returns non-JSON / wraps in markdown | Node 6 strips fences and retries parse; throws if still invalid |
| Claude returns < 5 variants | Workflow continues with whatever count was returned (no hard 5-required check; partial cascade still useful) |
| Vista Create returns 5xx for one variant | Error branch logs that pin; loop continues to next variant; final Slack summary still fires |
| Vista template id missing in env | Falls back to `tmpl-tip-list-001` placeholder; pin still created with that template |
| Airtable rate limit (429) | n8n retry policy handles; persistent failure → error branch |
| Email Claude call fails | Pins are already saved; email step errors → Slack alert flags incomplete cascade |
| Webhook fired twice for same record | 5 duplicate pin rows created (acceptable; user can dedupe; Airtable automation should debounce on its side) |
| Blog row Status flipped Published → Draft → Published | Cascade re-runs; duplicate drafts produced (intentional; user should archive olds) |

## Test cases

1. **Happy path** — Publish a real blog row. Expected: 5 pinterest-pin Drafts + 1 email-broadcast Draft, all linked to parent, Slack summary posted within ~90s.
2. **Blog with no Target keyword** — Expected: Claude still generates pins (keyword field empty in prompt); no error.
3. **Claude returns malformed JSON** — Mock the Claude endpoint to return prose. Expected: Node 6 throws, error branch fires, no pins created.
4. **Vista Create returns 500 for one variant** — Mock 1 of 5 calls to fail. Expected: 4 pins created, 1 error logged, email step still runs, Slack summary shows variant_count=5 but operator sees Errors row.
5. **Webhook missing record_id** — POST `{}`. Expected: Node 2 throws → error branch.
6. **Airtable record id stale (404)** — Expected: Node 3 errors → error branch.
7. **Claude API key invalid** — Expected: Node 5 returns 401 → error branch with clear message.
8. **Re-publish same blog** — Run cascade twice. Expected: 10 pin drafts, 2 email drafts (intentional; manual cleanup).

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Cascade execution success rate | > 95% | < 90% = investigate |
| Time webhook → Slack summary | < 120s p95 | > 300s = investigate Vista or Claude latency |
| Pins created per blog post | 5 | < 5 sustained = investigate Claude prompt drift |
| Email broadcast created per blog post | 1 | 0 = investigate Node 11/12 |
| Claude token spend per cascade | < 5k tokens | > 10k = investigate prompt bloat |

## Deployment

1. Import `W16-blog-post-promotion-cascade.json` into n8n.
2. Replace `BASE_ID_PLACEHOLDER`, `TABLE_ID_CONTENT`, `TABLE_ID_ERRORS` with real Airtable IDs.
3. Confirm credentials `id: 1` (Airtable), `id: 3` (Slack), `id: 7` (Claude API), `id: 14` (Vista Create API) exist.
4. Set env vars in n8n admin: `VISTA_TEMPLATE_TIP_LIST`, `VISTA_TEMPLATE_QUOTE`, `VISTA_TEMPLATE_INFOGRAPHIC`, `VISTA_TEMPLATE_QUESTION`, `VISTA_TEMPLATE_BEFORE_AFTER` (or accept `tmpl-*-001` placeholders for first smoke test).
5. Add Airtable Content columns: `Variant type, Pin description, Hashtags, Image URL, Vista project id, Email subject, Email body, Parent blog post, Created at`.
6. Activate the workflow.
7. In Airtable Content automations: create automation "On Published blog post" → Trigger: record updated, Conditions: `Type=blog-post AND Status=Published` → Action: Send POST to `https://n8n.thestrledger.com/webhook/blog-published` with body `{ "record_id": "{{ trigger.record.id }}" }`.
8. Test by flipping a test blog row to Published; verify all 6 drafts appear and Slack message lands.
9. Commit JSON + MD to `infrastructure/n8n/workflows/`.

## Iteration log

- `2026-04-27` — Initial spec. Unimplemented. Pin loop uses SplitInBatches batchSize=1 to keep Vista API calls serial (avoids the bursty 5-parallel pattern that has tripped Vista rate limiting in past tests). Email step runs only after all 5 pins finish so the Slack summary lists everything in one notification.
