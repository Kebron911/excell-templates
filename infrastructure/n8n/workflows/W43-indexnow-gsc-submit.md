# W43 — IndexNow + GSC URL Submit

**Priority:** P1 (Phase 4 — Traffic Engines)

**Family:** I — Research / off-page

**Summary:** Every blog post or product page published gets crawled within hours instead of days. Triggers off the same Airtable Content `Status=Published` event as W16 (Blog Post Promotion Cascade) and runs in parallel. Submits the URL to:
1. **Google Search Console URL Inspection API** — request indexing
2. **Bing IndexNow** — free, instant
3. **Yandex IndexNow** — same key
4. **Pinterest URL ping** — uses the existing Pinterest API cred from W15
5. Re-pings sitemap URLs to all four

Logs each submission to `ops/cache/indexnow.json` for the SEO dashboard. Costs $0; no new vendor.

---

## Triggers

Two triggers in the same workflow:

1. **Webhook** — POST `/webhook/content-published` from Airtable automation when `Status` changes to `Published`. Body: `{ "content_record_id": "rec...", "url": "https://thestrledger.com/blog/...", "type": "blog-post"|"product-page"|"tool" }`.
2. **Cron** — daily 06:00 ET. Re-submits the sitemap to all engines (cheap insurance against crawl-budget gaps).

## Node-by-node configuration

### Node 1a — Content Published Webhook
- Path: `content-published`
- Method: POST

### Node 1b — Cron Daily 06:00 (`scheduleTrigger`)
- Daily at 06:00 ET
- Branches to Node 5 (sitemap-only path)

### Node 2 — HTTP: GSC URL Inspection (cred id `5` — Search Console OAuth)
- POST `https://searchconsole.googleapis.com/v1/urlInspection/index:inspect`
- Body:
  ```json
  {
    "inspectionUrl": "{{ $json.url }}",
    "siteUrl": "sc-domain:thestrledger.com"
  }
  ```
- Continue on fail: yes
- Capture response status + indexStatusResult into context

### Node 3 — HTTP: Bing IndexNow
- POST `https://api.indexnow.org/IndexNow`
- Headers: `Content-Type: application/json`
- Body:
  ```json
  {
    "host": "thestrledger.com",
    "key": "{{ $env.INDEXNOW_KEY }}",
    "keyLocation": "https://thestrledger.com/{{ $env.INDEXNOW_KEY }}.txt",
    "urlList": ["{{ $json.url }}"]
  }
  ```
- Continue on fail: yes

### Node 4 — HTTP: Yandex IndexNow
- POST `https://yandex.com/indexnow`
- Same body shape as Node 3 (IndexNow is a shared protocol)
- Continue on fail: yes

### Node 5 — Sitemap Re-Submit Branch (cron entry point)
- HTTP GET `https://thestrledger.com/sitemap.xml`
- Code: parse XML → extract URLs published in last 30 days
- For each: re-call Nodes 3 + 4 (IndexNow batch — IndexNow accepts up to 10,000 URLs per call)

### Node 6 — Pinterest URL Ping (cred id `12` — Pinterest API)
- POST `https://api.pinterest.com/v5/url_metadata`
- Body: `{ "url": "{{ $json.url }}" }`
- Pinterest re-scrapes the URL on next pin generation
- Continue on fail: yes

### Node 7 — Code: Build Submission Result Row
```js
const url = $json.url;
const ts = new Date().toISOString();
const submissions = {
  url,
  submitted_at: ts,
  gsc_status: $node['GSC URL Inspect'].json?.statusCode || 'skipped',
  bing_status: $node['Bing IndexNow'].json?.statusCode || 'skipped',
  yandex_status: $node['Yandex IndexNow'].json?.statusCode || 'skipped',
  pinterest_status: $node['Pinterest Ping'].json?.statusCode || 'skipped',
};
const ok = [submissions.gsc_status, submissions.bing_status, submissions.yandex_status]
  .filter(s => typeof s === 'number' && s >= 200 && s < 300).length;
return [{ json: { ...submissions, success_count: ok } }];
```

### Node 8 — Local Filesystem: Update `ops/cache/indexnow.json`
- Read current cache
- Append latest submission to `recent_submissions[]` (cap at 200)
- Recompute aggregates: `submissions_24h`, `submissions_7d`, `errors_7d`, `last_submission_at`
- Atomic write

### Node 9 — Slack `#str-platform-alerts` (only on failure)
- Switch: only post if `success_count < 2` (at least 2 of 3 search engines should succeed)
- Block kit: URL + per-engine status + GSC indexStatusResult coverage state

### Error branch — standard envelope.

## Inputs

- Airtable Content row (URL, type, content_record_id)
- Sitemap.xml at `https://thestrledger.com/sitemap.xml`
- IndexNow key file at `https://thestrledger.com/{key}.txt` (one-time setup)
- GSC OAuth (cred 5)
- Pinterest OAuth (cred 12)

## Outputs

- API submissions to GSC + Bing + Yandex + Pinterest
- `ops/cache/indexnow.json` updated with submission log
- Surfaces aggregates on `/promote/seo` (extend existing page) — `submissions_24h`, `submissions_7d`, `last_submission_at`, `errors_7d`
- Slack alert on multi-engine failure

## Dependencies

- IndexNow key file uploaded to site root once (`ops/runbooks/indexnow-setup.md` documents this)
- GSC site verified as `sc-domain:thestrledger.com` (Domain property, covers all subdomains including blog)
- `ops/cache/indexnow.json` writable by n8n
- Airtable automation: Content Status → Published → POST `/webhook/content-published`

## Edge cases

| Case | Handling |
|---|---|
| URL not yet crawlable (404 still serving) | GSC returns SOFT_404; logged but not alerted |
| GSC quota exceeded (200 inspection requests/day per property) | Switch on response code 429 → fall back to Bing/Yandex only; daily cron picks up the missed URL |
| IndexNow key file removed from site | Bing/Yandex return 403 → Slack alert: "IndexNow key invalid — re-upload `<key>.txt` to site root" |
| URL already indexed | Idempotent — re-submit returns 200 with same indexStatusResult |
| Webhook called for non-public URL (draft, password-protected) | Skipped at Node 2 if URL contains `/draft/` or `/preview/` |
| Sitemap.xml unreachable | Cron logs error; webhook path still works for new publishes |

## Test cases

1. **Happy path:** publish a blog post → webhook fires within 60s → all 4 endpoints POST'd → indexnow.json gets new row → /promote/seo shows submissions_24h++.
2. **Sitemap cron:** manually trigger Node 1b → all URLs published in last 30 days re-submitted to Bing/Yandex.
3. **Quota hit:** mock GSC 429 → workflow continues to Bing/Yandex, logs warning, no Slack alert (1-of-3 still succeeds).
4. **Total failure:** disconnect internet → all 4 fail → Slack alert posted; row logged with all-error status.
5. **Idempotency:** call webhook twice with same URL → both succeed, indexnow.json shows 2 rows for same URL (expected — useful for tracking re-submissions after content updates).

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| `submissions_24h` | tracks publish cadence (~1–4 expected) | 0 for 7d = automation broken |
| `errors_7d` | < 5% of submissions_7d | > 20% = engine API issue or key problem |
| Time from publish → first GSC index status | < 24h | > 7d = manually re-request indexing |

## Deployment

1. **One-time:** generate IndexNow key (32-char hex), create `<key>.txt` containing the key, upload to site root via Hostinger SFTP (`/public_html/<key>.txt`). Document in `ops/runbooks/indexnow-setup.md`.
2. Set env var `INDEXNOW_KEY` in n8n.
3. Verify `sc-domain:thestrledger.com` property exists in GSC; create OAuth cred (id `5` if not already present).
4. Import `W43-indexnow-gsc-submit.json`.
5. Configure credentials `5` (GSC), `12` (Pinterest if available).
6. Build Airtable automation: Content `Status=Published` → POST `/webhook/content-published`.
7. Mount `ops/cache/indexnow.json` writable in n8n container.
8. Activate. Test by publishing a draft test blog post.

## Iteration log

- `2026-05-10` — Initial spec. P1 build for Phase 4 Traffic Engines (W43).
