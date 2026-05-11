# W41 — Social Question Watcher (Reddit / Quora / HN)

**Priority:** P1 (Phase 4 — Traffic Engines)

**Family:** I — Research / off-page

**Summary:** Polls free public APIs (Reddit JSON, HN Algolia, Google Alerts RSS) for questions relevant to STR taxes, bookkeeping, hosting, and Excel spreadsheets. Claude classifies and drafts a non-link-drop helpful response per match. Slack card surfaces it for Daniel to read on phone and post manually within ~4 hours. Workflow does the **finding** (the actual work-saver). Daniel does the **posting** (Reddit/Quora pattern-detect bot accounts; manual send keeps account alive). Each posted answer logged to `ops/social-answers.ndjson` for `/promote/social-answers` dashboard.

---

## Triggers

Single trigger: **Cron every 30 minutes** (`*/30 * * * *`). All polling happens inside the same execution.

## Node-by-node configuration

### Node 1 — Cron (`scheduleTrigger`)
- Mode: `everyX`, value `30`, unit `minutes`
- Timezone: `America/New_York`

### Node 2 — Code: Build Source Queries
```js
return [
  // Reddit subreddits — pull /new for fresh questions
  { json: { source: 'reddit', endpoint: 'https://www.reddit.com/r/AirBnB/new.json?limit=25', sub: 'AirBnB' } },
  { json: { source: 'reddit', endpoint: 'https://www.reddit.com/r/AirBnBHosts/new.json?limit=25', sub: 'AirBnBHosts' } },
  { json: { source: 'reddit', endpoint: 'https://www.reddit.com/r/realestateinvesting/new.json?limit=25', sub: 'realestateinvesting' } },
  { json: { source: 'reddit', endpoint: 'https://www.reddit.com/r/tax/new.json?limit=25', sub: 'tax' } },
  { json: { source: 'reddit', endpoint: 'https://www.reddit.com/r/Entrepreneur/new.json?limit=25', sub: 'Entrepreneur' } },

  // HN Algolia — search keywords
  { json: { source: 'hn', endpoint: 'https://hn.algolia.com/api/v1/search_by_date?tags=story&query=airbnb%20tax', topic: 'airbnb-tax' } },
  { json: { source: 'hn', endpoint: 'https://hn.algolia.com/api/v1/search_by_date?tags=story&query=STR%20bookkeeping', topic: 'str-bookkeeping' } },
  { json: { source: 'hn', endpoint: 'https://hn.algolia.com/api/v1/search_by_date?tags=story&query=vacation%20rental%20spreadsheet', topic: 'vr-spreadsheet' } },

  // Google Alerts RSS — configured separately in Daniel's Google Alerts
  { json: { source: 'google-alerts', endpoint: 'https://www.google.com/alerts/feeds/00000000000000000000/0000000000000000000', topic: 'str-tax-mentions' } },
];
```

### Node 3 — SplitInBatches — One source per iteration

### Node 4 — HTTP: Fetch Source
- URL: `={{ $json.endpoint }}`
- Method: GET
- Headers: `User-Agent: STR-Ledger-Bot/1.0 (https://thestrledger.com)` (Reddit requires a real UA)
- Response format: depends on source (JSON for Reddit/HN, XML for RSS)
- Continue on fail: yes
- Timeout: 10000ms

### Node 5 — Code: Normalize to Question Shape
```js
const items = $input.all();
const out = [];
for (const item of items) {
  const meta = item.json; // contains source, endpoint, sub or topic
  const body = $input.context && $input.context.body || meta;
  const source = meta.source;

  if (source === 'reddit') {
    const posts = (body?.data?.children || []).map(c => c.data);
    for (const p of posts) {
      out.push({
        json: {
          surfaced_at: new Date().toISOString(),
          platform: 'reddit',
          subreddit_or_topic: `r/${meta.sub}`,
          question_url: `https://www.reddit.com${p.permalink}`,
          title: p.title || '',
          excerpt: (p.selftext || '').slice(0, 800),
          author: p.author,
          posted_at: p.created_utc ? new Date(p.created_utc * 1000).toISOString() : null,
          score: p.score,
        }
      });
    }
  } else if (source === 'hn') {
    for (const h of (body?.hits || [])) {
      out.push({
        json: {
          surfaced_at: new Date().toISOString(),
          platform: 'hn',
          subreddit_or_topic: meta.topic,
          question_url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
          title: h.title || h.story_title || '',
          excerpt: '',
          author: h.author,
          posted_at: h.created_at,
          score: h.points,
        }
      });
    }
  } else if (source === 'google-alerts') {
    // Parse Atom feed entries — n8n's RSS Read node is preferred but kept here for clarity
    const entries = body?.feed?.entry || body?.rss?.channel?.item || [];
    for (const e of entries) {
      out.push({
        json: {
          surfaced_at: new Date().toISOString(),
          platform: 'google-alerts',
          subreddit_or_topic: meta.topic,
          question_url: e.link?.[0]?.['@_href'] || e.link || '',
          title: e.title?.['#text'] || e.title || '',
          excerpt: (e.content?.['#text'] || e.description || '').replace(/<[^>]+>/g, '').slice(0, 800),
          author: '',
          posted_at: e.published || e.pubDate || null,
          score: 0,
        }
      });
    }
  }
}
return out;
```

### Node 6 — Code: Dedupe vs Existing Log
- Read last 7 days of `ops/social-answers.ndjson` (mounted volume) into a Set of `question_url`
- Drop any incoming row whose `question_url` already exists
- Output the new ones

(In production, n8n reads/writes via the Local Filesystem node or Postgres if NDJSON is too slow at scale.)

### Node 7 — HTTP: Claude Classify (cred id `7`)
- POST `https://api.anthropic.com/v1/messages`
- Model: `claude-haiku-4-5-20251001` (cheap classifier)
- System: "You classify forum posts. Output JSON: `{ kind: 'question'|'discussion'|'news'|'spam', topic: 'str-tax'|'str-bookkeeping'|'str-hosting'|'general'|'other', match_score: 0..1, reason: 'short' }`. Only mark `match_score >= 0.6` if a STR-tax-templates business could helpfully answer with first-hand expertise."
- User: title + excerpt + platform + subreddit_or_topic
- Body: `{ model, max_tokens: 200, system, messages: [{ role:'user', content: '<title>\n\n<excerpt>' }] }`

### Node 8 — Code: Filter to Matched Questions
- Parse Claude's JSON response
- Keep only rows where `kind === 'question'` AND `match_score >= 0.6`

### Node 9 — HTTP: Claude Draft Helpful Answer (cred id `7`)
- POST `https://api.anthropic.com/v1/messages`
- Model: `claude-sonnet-4-6`
- System: "You draft helpful Reddit/Quora answers in Daniel's voice (concrete, no fluff, no link drops). Output JSON: `{ answer_markdown, optional_link_line }`. The answer must stand alone without any link to thestrledger.com. The optional_link_line is a single contextual line Daniel may add IF the link is genuinely the most helpful thing — e.g. 'I made a free version here: <url>'. Default to empty string. NEVER use exclamation points. NEVER mention 'as an AI'."
- Max tokens: 800

### Node 10 — Slack Card to `#str-platform-traffic`
- Block kit with: question title, platform/subreddit, link to question, drafted answer in code block, optional link line
- Buttons (interactive): `[Posted]` `[Skip]`
- Posting `[Posted]` triggers a webhook back to Node 12

### Node 11 — NoOp loop-back to Source SplitInBatches

### Node 12 — Webhook `/webhook/social-answer-posted`
Body: `{ "question_url": "...", "answer_url": "..." }` (Daniel pastes the URL of his posted reply when he clicks `[Posted]`).

### Node 13 — Code: Append to social-answers.ndjson
```js
const row = {
  surfaced_at: $json.surfaced_at,
  platform: $json.platform,
  subreddit_or_topic: $json.subreddit_or_topic,
  question_url: $json.question_url,
  answered: true,
  answer_url: $json.answer_url,
  posted_at: new Date().toISOString(),
  est_visits: 0,            // backfilled later by W44/manual
};
return [{ json: row, line: JSON.stringify(row) + '\n' }];
```

### Node 14 — Local Filesystem: Append `ops/social-answers.ndjson`
- Operation: append
- File path: `/data/ops/social-answers.ndjson`

### Node 15 — Slack confirmation
"Logged answer to `/promote/social-answers`."

### Error branch (3 nodes, cred `1`/`3`)
Standard envelope per W21 pattern.

## Inputs

- Reddit JSON API (no key — User-Agent required)
- HN Algolia API (no key)
- Google Alerts RSS feed URL(s) (Daniel sets these up in Google Alerts, paste into Build Source Queries)
- Claude API key (cred `7`)
- Slack bot token (cred `3`)
- Local filesystem mount for `ops/social-answers.ndjson`

## Outputs

- Slack cards in `#str-platform-traffic` for each matched question
- Appended rows in `ops/social-answers.ndjson` after Daniel marks `[Posted]`
- Surfaces on `/promote/social-answers` dashboard page

## Dependencies

- Slack channel `#str-platform-traffic` (create if missing)
- Daniel logged into Slack on phone for fast reads
- Reddit account in good standing — Daniel posts manually
- Optional: Quora account (currently API-less; Daniel surfaces from notification email forwarded to a watched mailbox in a future revision)

## Edge cases

| Case | Handling |
|---|---|
| Reddit rate-limits | UA + 30-min cadence keeps under 60 req/10min limit; on 429 → skip source, log warning |
| RSS feed empty | Normalize returns [] — no error |
| Claude returns non-JSON | Filter step skips the row, logs once |
| Question already in last-7d log | Dedupe drops it before Claude classification (cost saving) |
| Multiple subs match same question (cross-post) | Dedupe by canonical Reddit URL |
| Daniel never clicks `[Posted]` | Slack card stays; no log row written; no harm |
| Feed source down | Continue-on-fail at HTTP node; other sources keep going |

## Test cases

1. **Happy path:** Reddit returns 5 posts, 1 classifies as STR-tax question with score 0.8 → Slack card appears within 60s with drafted answer.
2. **Dedupe:** rerun within 30 min on same Reddit feed → no duplicate Slack cards.
3. **Posted webhook:** click `[Posted]` in Slack with answer URL → ndjson row appended; `/promote/social-answers` count increments next page load.
4. **Bad UA:** strip the User-Agent header → Reddit returns 429 → workflow logs error envelope, other sources still emit cards.
5. **Claude classifier conservative:** post with `match_score 0.4` → filter drops it; no draft generated; no Slack card.

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Questions surfaced/week | 10–40 | < 5 sustained = sources stale; > 100 = filter too loose |
| Daniel-posted answers/week | 3–15 | 0 for 7d = Daniel disengaged or too noisy → tune match threshold |
| Cost (Claude per run) | < $0.05 | > $0.20 = classifier model upgraded incorrectly or excerpt size too big |

## Deployment

1. Import `W41-social-question-watcher.json` into n8n.
2. Configure credentials `1`, `3`, `7` (Airtable, Slack, Claude).
3. Create Slack channel `#str-platform-traffic` and add the n8n bot.
4. Set up 1+ Google Alerts feeds (`"airbnb tax" OR "vacation rental tax" OR "STR bookkeeping"`) and paste the feed URLs into Node 2.
5. Mount `ops/social-answers.ndjson` writable inside the n8n container (Docker: `-v ./ops:/data/ops`).
6. Activate. Verify with a manual test query before relying on cadence.

## Iteration log

- `2026-05-10` — Initial spec. P1 build for Phase 4 Traffic Engines (W41).
