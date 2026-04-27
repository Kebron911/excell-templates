# W21 — Research Outreach Pipeline

**Priority:** P3 (Phase 2)

**Family:** E — Outreach / partnerships

**Summary:** ScrapeBox CSV drops into Google Drive trigger Claude-drafted personalized emails into an Airtable Outreach Queue. Daniel reviews each draft. On per-row approval, Instantly sends. Replies route back via webhook and flip the row to `Replied`. Daniel handles replies in his inbox.

---

## Triggers

This workflow has **three trigger nodes** living side-by-side in the same workflow:

1. **Google Drive Trigger** — folder `str-platform/outreach-inbox/`, event `fileCreated`, polling every 30 minutes.
2. **Webhook** — POST `/webhook/outreach-approved` with `{ "outreach_record_id": "recXXXXXXXXXXXXXX" }` fired by Airtable automation when Daniel sets a row's Status to `Approved`.
3. **Webhook** — POST `/webhook/instantly-reply` (configured in Instantly as the reply-tracking webhook URL).

## Node-by-node configuration

### Node 1 — Google Drive Trigger (`googleDriveTrigger` v1)

- Folder: `str-platform/outreach-inbox/` (replace placeholder folder ID after import)
- Event: `fileCreated`
- Polling: every 30 minutes
- Cred: id `15` Google Drive

### Node 2 — HTTP: Download CSV File

- GET `https://www.googleapis.com/drive/v3/files/{{ $json.id }}?alt=media`
- Auth: `googleDriveOAuth2Api` cred `15`
- Response format: `text` (raw CSV string)

### Node 3 — Code: Parse CSV

```js
const fileMeta = $node['Drive CSV Trigger'].json;
const raw = typeof $input.first().json === 'string' ? $input.first().json : ($input.first().json.data || '');
const text = String(raw).replace(/\r/g, '');
const lines = text.split('\n').filter(l => l.trim());
function splitCSVLine(line) {
  const out = []; let cur = ''; let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { if (inQ && line[i + 1] === '"') { cur += '"'; i++; } else inQ = !inQ; }
    else if (ch === ',' && !inQ) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur); return out.map(s => s.trim());
}
const headers = splitCSVLine(lines[0]).map(h => h.toLowerCase());
const get = (cols, i) => i >= 0 ? cols[i] : '';
const ni = headers.indexOf('name'), ei = headers.indexOf('email'), wi = headers.indexOf('website'), ci = headers.indexOf('context');
const rows = [];
for (let i = 1; i < lines.length; i++) {
  const c = splitCSVLine(lines[i]);
  const email = (get(c, ei) || '').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) continue;
  rows.push({ name: get(c, ni), email, website: get(c, wi), context: get(c, ci), source_file_id: fileMeta.id, source_file_name: fileMeta.name });
}
return rows.map(r => ({ json: r }));
```

### Node 4 — SplitInBatches (1) — Per-prospect loop

### Node 5 — Airtable Upsert OutreachQueue

- Match on `Email` (lowercase)
- Status: `New` on insert (do not overwrite if already further along)

### Node 6 — HTTP: Claude Draft Email (cred id `7`)

- POST `https://api.anthropic.com/v1/messages`
- Headers: `anthropic-version: 2023-06-01`, `content-type: application/json`
- Model: `claude-opus-4-7`
- System prompt: persona = Daniel; specific, helpful, human; one ask; output strict JSON `{ subject, body, reasoning }`
- User content: prospect name/email/website/context

### Node 7 — Code: Extract Draft

```js
const resp = $input.first().json;
const text = (resp.content && resp.content[0] && resp.content[0].text) || '';
let parsed = { subject: '', body: '', reasoning: '' };
try {
  const cleaned = text.replace(/```json\s*/i, '').replace(/```\s*$/i, '').trim();
  parsed = JSON.parse(cleaned);
} catch (e) {
  parsed = { subject: '(claude returned non-JSON)', body: text.slice(0, 4000), reasoning: 'json-parse-failed' };
}
return [{ json: { outreach_record_id: $node['Upsert OutreachQueue'].json.id, draft_subject: parsed.subject, draft_body: parsed.body, draft_reasoning: parsed.reasoning, raw_claude: text.slice(0, 2000) } }];
```

### Node 8 — Airtable Update OutreachQueue Draft

- Set Draft subject / body / reasoning, Status → `AwaitingApproval`, Drafted at.

### Node 9 — NoOp loop-back to Split Prospects

### Node 10 — Email Daniel — Drafts Ready (after loop, cred `8`)

Subject: `[STR Ledger] Outreach drafts ready for review (<csv name>)`. Body links Airtable view URL.

### Node 11 — Webhook `/webhook/outreach-approved`

Body: `{ "outreach_record_id": "recXXXXXXXXXXXXXX" }`. Triggered by Airtable automation when Daniel sets `Status=Approved`.

### Node 12 — Airtable Get OutreachQueue Row (by ID)

### Node 13 — Switch: Guard Approved Status

Sanity check — only proceed if `Status=Approved` (defends against stale webhook calls).

### Node 14 — HTTP: Instantly Send Email (cred id `17`)

- POST `https://api.instantly.ai/api/v1/send_email`
- Body: `campaign_id` (from env `INSTANTLY_CAMPAIGN_ID`), `from_email`, `to_email`, `subject`, `body`, `reply_to`, `custom_variables.outreach_record_id`

### Node 15 — Airtable Update Mark Sent

- Status → `Sent`, Sent at, Instantly response (truncated)

### Node 16 — Slack `#str-platform-outreach` confirmation

### Node 17 — Webhook `/webhook/instantly-reply`

Configured inside Instantly as the reply event URL. Body shape: `{ lead_email, campaign_id, ... }`.

### Node 18 — Airtable Search OutreachQueue by Email

Filter: `LOWER({Email}) = '<lead_email>'` to find original row.

### Node 19 — Airtable Update OutreachQueue → `Replied`

Replied at + reply payload (truncated).

### Node 20 — Slack `#str-platform-outreach` reply notice

### Error branch (3 nodes, cred `1`/`3`)

Standard envelope.

## Inputs

- CSV file dropped into Google Drive (`name`, `email`, `website`, `context` columns)
- Approval webhook payloads (via Airtable automation)
- Instantly reply webhooks

## Outputs

- Airtable OutreachQueue rows (lifecycle: New → AwaitingApproval → Approved → Sent → Replied)
- Instantly email sends
- Slack channel `#str-platform-outreach` posts on send + reply
- Daniel receives summary email after each CSV import

## Dependencies

- Airtable OutreachQueue table with columns: Email (primary, unique), Name, Website, Context, Source file, Status (single select), Draft subject, Draft body, Draft reasoning, Imported at, Drafted at, Sent at, Replied at, Reply payload, Instantly response.
- Airtable automation: when row Status changes to `Approved`, POST to `/webhook/outreach-approved` with `outreach_record_id`.
- Instantly account with campaign created and reply webhook URL configured.
- Google Drive folder shared with the n8n service account.
- Claude API key (cred `7`).

## Edge cases

| Case | Handling |
|---|---|
| CSV has duplicate emails | Upsert dedupes by Email |
| CSV missing `email` column | Parse throws explicit error → error envelope |
| Invalid email format | Skipped during parse |
| Claude returns non-JSON | Extract Draft falls back to `(claude returned non-JSON)` subject; row flagged for manual rewrite |
| Daniel sets Status=Skip | Workflow never fires (no webhook) — nothing to do |
| Approval webhook fired twice | Mark Sent is idempotent on retry; second call still succeeds (Instantly will dedupe by `lead_email + campaign_id`) |
| Instantly send 4xx | Error envelope; row stays `Approved` for retry |
| Reply for unknown email | Search returns 0 → error envelope logs as orphan reply |
| Large CSV (>500 rows) | SplitInBatches handles serially; entire run capped by `executionTimeout: 600` (re-tune for 1000+) |
| Spam-trap email | Approval safeguard: Daniel never approves rows that look risky; W21 never auto-sends |

## Test cases

1. **CSV ingest happy path:** drop CSV with 3 valid rows → expect 3 OutreachQueue rows in `AwaitingApproval` with non-empty drafts; summary email arrives.
2. **Bad email row:** include 1 row with `notanemail` → that row is dropped, others succeed.
3. **Duplicate email re-upload:** drop same CSV again → upsert keeps existing Status if past `New`.
4. **Approval flow:** mark row Approved → Airtable automation calls webhook → Instantly send → row → `Sent` → Slack post.
5. **Reply flow:** mock Instantly reply webhook → row → `Replied`, Slack post.
6. **Stale approval:** call approval webhook on a row already `Sent` → guard switch blocks send (Status != Approved).
7. **Claude API outage:** simulate 500 → error envelope logs, row remains `New` for re-drafting on next run.

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Drafts generated per CSV | matches CSV row count (- invalid) | < 80% = parse problem |
| Approval rate | tracked, no target — Daniel discretion | n/a |
| Sent → Reply rate | > 5% | < 1% sustained = pause campaigns |
| Bounce / spam reports (Instantly) | < 2% | > 5% = stop and investigate domain reputation |

## Deployment

1. Import `W21-research-outreach-pipeline.json`.
2. Replace `BASE_ID_PLACEHOLDER`, `TABLE_ID_OUTREACH_QUEUE`, `TABLE_ID_ERRORS`, and the Drive folder URL.
3. Configure credentials `1`, `3`, `7`, `8`, `15`, `17`.
4. Set env vars: `INSTANTLY_CAMPAIGN_ID`, `AIRTABLE_OUTREACH_QUEUE_VIEW_URL`, `N8N_BASE_URL`.
5. Build Airtable automation: `Status` updated → `Approved` → call `/webhook/outreach-approved` with `outreach_record_id`.
6. In Instantly: set webhook URL `https://n8n.thestrledger.com/webhook/instantly-reply` for Reply events.
7. Activate workflow.
8. Drop a 1-row test CSV to verify the full pipeline before scaling.

## Iteration log

- `2026-04-27` — Initial spec + JSON. Phase 2; unimplemented in production.
