---
title: IndexNow setup (one-time) — Bing / Yandex / Pinterest URL submission
owner: Daniel
last_reviewed: 2026-05-11
cadence: annual
---

# IndexNow Setup (one-time)

**Purpose:** wire up the IndexNow protocol so W43 can instantly notify Bing, Yandex, and any other IndexNow-compatible engine when a new page publishes. Replaces the "wait days for the crawler" loop with a real-time push.

**Time:** 15 minutes.

**Cost:** $0 (IndexNow is a free open protocol).

**Prereq:** thestrledger.com on Hostinger with SFTP access.

---

## Step 1 — Generate the IndexNow key (1 min)

The key is a 32-character hex string, unique to your site. Generate it once and never change it.

In a terminal:

```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

Or PowerShell:

```powershell
-join ((1..32) | ForEach-Object { '0123456789abcdef'[(Get-Random -Maximum 16)] })
```

Save the output. Example: `7e2a9c8b1f0d4e6a8c3b2f1e9d4c7a6b` — this is your IndexNow key.

---

## Step 2 — Create the key verification file (2 min)

Create a file named `<your-key>.txt` whose contents are just the key itself:

```bash
echo -n "7e2a9c8b1f0d4e6a8c3b2f1e9d4c7a6b" > 7e2a9c8b1f0d4e6a8c3b2f1e9d4c7a6b.txt
```

The filename and contents MUST match exactly. No trailing newline.

---

## Step 3 — Upload to site root via Hostinger SFTP (5 min)

The file must live at `https://thestrledger.com/<your-key>.txt` and return HTTP 200 with `Content-Type: text/plain`.

Via Hostinger SFTP (n8n credentials inventory has these):

```bash
sftp <hostinger-user>@thestrledger.com
cd public_html
put 7e2a9c8b1f0d4e6a8c3b2f1e9d4c7a6b.txt
```

Or via Hostinger File Manager (hPanel → Files → File Manager → public_html → Upload).

**Verify it's reachable:**

```bash
curl -i https://thestrledger.com/7e2a9c8b1f0d4e6a8c3b2f1e9d4c7a6b.txt
```

Expected response:
```
HTTP/2 200
content-type: text/plain
...

7e2a9c8b1f0d4e6a8c3b2f1e9d4c7a6b
```

If it returns 404 or HTML: file is in the wrong directory or Hostinger added an extension. Fix before continuing — the protocol requires the exact key text.

---

## Step 4 — Set the n8n environment variable (1 min)

In n8n (Settings → Variables, or in `.env` if running self-hosted Docker):

```
INDEXNOW_KEY=7e2a9c8b1f0d4e6a8c3b2f1e9d4c7a6b
```

Restart n8n so the variable is picked up.

---

## Step 5 — Test submission (3 min)

Manually fire a test submission to confirm the protocol accepts your key:

```bash
curl -X POST 'https://api.indexnow.org/IndexNow' \
  -H 'Content-Type: application/json' \
  -d '{
    "host": "thestrledger.com",
    "key": "7e2a9c8b1f0d4e6a8c3b2f1e9d4c7a6b",
    "keyLocation": "https://thestrledger.com/7e2a9c8b1f0d4e6a8c3b2f1e9d4c7a6b.txt",
    "urlList": ["https://thestrledger.com/"]
  }'
```

Expected: HTTP 200 (silent success) or 202 (accepted for processing). Anything 4xx means the key file isn't reachable or doesn't match.

Repeat for Yandex:

```bash
curl -X POST 'https://yandex.com/indexnow' \
  -H 'Content-Type: application/json' \
  -d '{ ...same body... }'
```

---

## Step 6 — Verify W43 picks it up (3 min)

In n8n, open the W43 workflow (`W43 — IndexNow + GSC URL Submit`) and click "Execute Workflow" once. Watch the execution log:

- Node "Bing IndexNow": should show status 200/202
- Node "Yandex IndexNow": should show status 200/202
- Node "GSC URL Inspect": should show indexStatusResult

If any return 4xx, check:
- Key file URL: `keyLocation` in body matches actual public URL
- Key contents: exact text match, no whitespace, no extension confusion
- Host header: matches your verified domain (no `www.` mismatch)

---

## Maintenance

| Event | Action |
|-------|--------|
| Migrating to a new domain | Generate NEW key for new domain; upload to new site root; update `INDEXNOW_KEY` env var |
| Key file accidentally deleted | Re-upload — same key, same file, no protocol re-registration needed |
| Site moves off Hostinger | Same: upload key file to new site root |
| Year passes with no issues | No action — IndexNow keys don't expire |
| Bing Webmaster Tools shows "IndexNow blocked" | Re-verify key file is reachable and `Content-Type: text/plain` |

---

## Anti-patterns

- ❌ Renaming the key file to anything else
- ❌ Adding HTML wrapping around the key (must be raw text)
- ❌ Storing the key in a public git repo — it's not exactly a secret (anyone can read it from your site), but rotating one that leaked accidentally is fine; just generate a new one and re-upload
- ❌ Calling IndexNow with old URLs that have been redirected — wastes quota; IndexNow expects current canonical URLs
- ❌ Submitting more than 10,000 URLs per call — IndexNow caps batch size
- ❌ Re-pinging the same URL more than once per day — IndexNow rate-limits per URL

---

## Related runbooks

- [Phase 0 Citation Sprints](./phase-0-citation-sprints.md) — runs in parallel; both kick off the Traffic Engines phase
- [Disaster recovery](../../docs/runbooks/disaster-recovery.md) — if site moves, replay this runbook on new host

---

## Iteration log

- `2026-05-11` — Initial runbook. Required prereq for W43 (`infrastructure/n8n/workflows/W43-indexnow-gsc-submit.md`).
