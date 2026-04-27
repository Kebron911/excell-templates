# W19 — FB Group New Member

**Priority:** P2

**Family:** E — Community / top-of-funnel capture

**Summary:** Webhook from Zapier (or Pabbly) on the "FB Group new member" trigger. Parses the three entry-question answers, asks Claude to infer one of four buyer personas (`dreamer | sam | sarah | pam`) with deterministic rule overrides for the unambiguous cases, upserts the member into Airtable Customers with `FB Group member = true`, then either (a) auto-DMs them via Facebook Graph API if confidence ≥ 0.75 or (b) queues a manual outreach card for Daniel.

---

## Trigger

HTTP POST webhook: `https://n8n.thestrledger.com/webhook/fb-group-new-member`

Configured in Zapier:
- **Trigger app:** Facebook Groups → New Member
- **Action:** Webhooks by Zapier → POST
- **URL:** the n8n webhook URL above
- **Payload (JSON):** `{ fb_user_id, name, email?, joined_at, hosting_status, listing_count, headache, profile_url }`

(If Daniel ever drops Zapier, Path B is a Google Form whose responses POST the same JSON shape via Apps Script.)

## Node-by-node configuration

### Node 1 — Webhook

- **Path:** `/webhook/fb-group-new-member`
- **Method:** POST
- **Response mode:** `onReceived` with body `{"received": true}` so Zapier doesn't time out
- **Auth:** none at webhook layer (Zapier IPs + obscurity); add HMAC in Phase 2

### Node 2 — Function: Parse Entry Answers

Tolerates multiple key shapes (`hosting_status` OR `q1` OR `answer_1` OR `question_1`) so different Zapier configs work without re-mapping.

```js
const input = $input.first().json;
const body = input.body || input;

const fb_user_id = (body.fb_user_id || body.user_id || body.member_id || '').toString().trim();
const full_name = (body.name || body.full_name || body.member_name || '').toString().trim();
const first_name = (body.first_name || full_name.split(' ')[0] || '').trim();
const last_name = (body.last_name || full_name.split(' ').slice(1).join(' ') || '').trim();
const email = (body.email || body.member_email || '').toString().toLowerCase().trim();
const joined_at = body.joined_at || body.timestamp || new Date().toISOString();
const profile_url = body.profile_url || (fb_user_id ? `https://facebook.com/${fb_user_id}` : '');

const hosting_status = (body.hosting_status || body.q1 || body.answer_1 || body.question_1 || '').toString().trim();
const listing_count_raw = (body.listing_count || body.q2 || body.answer_2 || body.question_2 || '').toString().trim();
const headache = (body.headache || body.biggest_headache || body.q3 || body.answer_3 || body.question_3 || '').toString().trim();

const listing_count_num = parseInt((listing_count_raw.match(/\d+/) || ['0'])[0], 10) || 0;

if (!fb_user_id && !email) throw new Error('Webhook must include at least fb_user_id or email');

return [{ json: { fb_user_id, full_name, first_name, last_name, email, profile_url, joined_at, hosting_status, listing_count_raw, listing_count_num, headache, raw_payload: JSON.stringify(body).slice(0, 5000) } }];
```

### Node 3 — HTTP: Claude Persona Inference

- `POST https://api.anthropic.com/v1/messages`
- Header auth cred ID `7`, headers `anthropic-version: 2023-06-01`
- Model `claude-opus-4-7`, max_tokens 600
- **System:** four-persona rubric strict; STRICT JSON only.
- **User:** the three answers + parsed listing count, asks for `{persona, confidence, reasoning, headache_tag}`.

### Node 4 — Function: Parse Persona + Apply Rules

Deterministic overrides win when answers are unambiguous, even if Claude wavers. Net effect: Claude is the tie-breaker on ambiguous cases; rules dominate the obvious ones.

```js
const claude = $input.first().json;
const member = $node['Parse Entry Answers'].json;

const raw = claude?.content?.[0]?.text || '';
if (!raw) throw new Error('Claude returned empty content');

let parsed;
try {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  parsed = JSON.parse(cleaned);
} catch (e) { throw new Error('Could not parse Claude JSON: ' + e.message); }

const valid_personas = ['dreamer','sam','sarah','pam'];
let persona = (parsed.persona || '').toLowerCase().trim();
let confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 0.5;
let reasoning = parsed.reasoning || '';

const hs = (member.hosting_status || '').toLowerCase();
const headache_lc = (member.headache || '').toLowerCase();
const manages_for_others = /manage|co-?host|property manager|agency|on behalf|clients/.test(hs + ' ' + headache_lc);
const is_planning = /planning|plan to|about to|researching|not yet|haven't started|first listing|future/.test(hs + ' ' + headache_lc);

if (manages_for_others) { persona = 'pam'; confidence = Math.max(confidence, 0.9); reasoning = 'Rule override: manages for others. ' + reasoning; }
else if (is_planning) { persona = 'dreamer'; confidence = Math.max(confidence, 0.85); reasoning = 'Rule override: planning. ' + reasoning; }
else if (member.listing_count_num === 1) { persona = 'sam'; confidence = Math.max(confidence, 0.85); reasoning = 'Rule override: 1 listing. ' + reasoning; }
else if (member.listing_count_num >= 3) { persona = 'sarah'; confidence = Math.max(confidence, 0.85); reasoning = 'Rule override: 3+ listings. ' + reasoning; }

if (!valid_personas.includes(persona)) { persona = 'dreamer'; confidence = 0.3; }

return [{ json: { ...member, persona, confidence, reasoning, headache_tag: parsed.headache_tag || 'general', high_confidence: confidence >= 0.75 } }];
```

### Node 5 — Airtable: Upsert Customer (FB Member)

- Table `TABLE_ID_CUSTOMERS`, operation **upsert**
- Match column: `Email` if email present, else `FB user ID`
- Fields: Email, FB user ID, First name, Last name, FB profile URL, **FB Group member? = true**, FB Group joined at, **Persona tag**, Persona confidence, **Headache tag**, Headache notes, Hosting status, Listing count, Acquisition source = `fb-group`, First contact date

### Node 6 — Switch: Confidence Gate

- Branch `high_conf_dm`: `high_confidence == true` AND `fb_user_id != ''` → DM path
- Branch `manual_queue`: anything else (low confidence OR no fb_user_id) → manual queue
- `fallbackOutput: 1` ensures unmatched goes to manual queue (safer default)

### Node 7 — Function: Build Persona DM

Per-persona warm intro that name-drops the member's stated headache when available. Keeps message under 4 sentences (FB Messenger best practice).

```js
const greetings = {
  dreamer: `Hey ${m.first_name}! ... Free numbers worksheet: https://thestrledger.com/start`,
  sam:     `Hey ${m.first_name}! ... template that might help: https://thestrledger.com/start`,
  sarah:   `Hey ${m.first_name}! ... Portfolio Bundle: https://thestrledger.com/portfolio`,
  pam:     `Hey ${m.first_name}! ... Pro Manager Bundle: https://thestrledger.com/pro-manager`
};
return [{ json: { ...m, dm_message: greetings[m.persona] } }];
```

### Node 8 — HTTP: Send FB DM via Graph API

- `POST https://graph.facebook.com/v18.0/me/messages`
- Header auth cred ID `12` (page access token in `Authorization: Bearer ...` header)
- Body:
  ```json
  {
    "recipient": { "id": "<fb_user_id>" },
    "messaging_type": "MESSAGE_TAG",
    "tag": "ACCOUNT_UPDATE",
    "message": { "text": "<dm_message>" }
  }
  ```
- Note: FB's 24-hour rule + tag policy may reject DMs to users who haven't messaged the page; fallback to manual queue if API returns error.

### Node 9 — Airtable: Outreach Queue (Manual DM)

- Table `TABLE_ID_SUPPORT_DRAFTS`, operation **create**
- Fields: Message ID = `fb-<id>`, Received at = joined_at, From email = email or `<fb_user_id>@facebook.local`, From name = full_name, Subject = `FB Group: New <persona> to DM (<conf>%)`, Body = answers + reasoning, Classification = `fb_group_outreach`, Priority = `high`, Status = `Awaiting Daniel review`

### Node 10 — Slack Community Notification

- Channel `#str-platform-community`
- Message: `👋 New FB Group member — <name>\nPersona: <persona> (<conf>%)\nListings: <raw> | Headache: <tag>\nDM: auto-sent | queued for manual review`

### Error branch (Build Error Envelope → Log Error to Airtable → Slack Error Alert)

Standard envelope, alerts `#str-platform-alerts`.

## Inputs

- Zapier webhook payload with FB user info + 3 entry-question answers
- Credentials: 1 (Airtable), 3 (Slack), 7 (Claude API), 12 (Facebook Graph API page token)

## Outputs

- 1× Customers upsert with persona + headache tag + FB membership flag
- Either: 1× FB Messenger DM via Graph API
- Or: 1× SupportDrafts row for Daniel to manually DM
- 1× Slack notification to `#str-platform-community`

## Dependencies

- Zapier (or equivalent) configured with FB Group new-member trigger
- FB Page connected to the Group with messaging permissions
- FB App with `pages_messaging` permission approved (for non-organic DM tags)
- Airtable Customers table fields: `Email`, `FB user ID`, `First name`, `Last name`, `FB profile URL`, `FB Group member?` (Checkbox), `FB Group joined at` (Date), `Persona tag` (Single select: dreamer/sam/sarah/pam), `Persona confidence` (Number), `Headache tag` (Single line text), `Headache notes` (Long text), `Hosting status` (Single line text), `Listing count` (Number), `Acquisition source` (Single select), `First contact date` (Date)
- SupportDrafts table from W12

## Edge cases

| Case | Handling |
|---|---|
| Webhook missing all identifiers | Node 2 throws → error branch fires |
| Member answered only 1 of 3 questions | Claude infers from what's there; rule overrides may still pin a persona; low confidence routes to manual queue |
| Listing count answer is "a few" / "several" | `parseInt` returns 0; falls through rule overrides; Claude inferred persona used |
| Member already in Customers (existing buyer rejoins group) | Upsert merges; sets `FB Group member? = true` without overwriting purchase history |
| FB Graph API DM returns error (24-hr window violation) | onError continueErrorOutput → error branch → manual queue effectively backstops via separate manual review |
| Same member webhook fires twice (Zapier retry) | Upsert is idempotent on Email/FB user ID; DM may double-send — mitigation in Phase 2: dedupe table |
| Claude returns invalid JSON | Parse error → error branch; member still in Customers (Node 5 already ran? No — Node 4 errors before Node 5. Daniel handles manually.) Note: this means a parse failure means no Customer row either. If recovery important, add a fallback "create with persona=unknown" path. |
| FB Page lost messaging permission | Send FB DM step errors → manual queue still backstops |
| Spammer / fake account joins | Daniel's FB Group admission flow filters most; if one slips through, Customers row + Slack ping = noise but not harmful; can manually delete |

## Test cases

1. **Sarah profile** — `hosting_status: "active"`, `listing_count: "5"`, `headache: "consolidating reports"` → expect persona=sarah (rule override), high confidence, auto-DM with Portfolio Bundle link.
2. **Sam profile** — `listing_count: "1"`, hosting actively → expect persona=sam, auto-DM.
3. **Dreamer** — `hosting_status: "planning to start in May"` → rule override → persona=dreamer.
4. **Pam** — `headache: "I co-host 12 properties for owners"` → rule override → persona=pam.
5. **Ambiguous** — `hosting_status: "kinda"`, `listing_count: "2"`, `headache: "a lot"` → Claude classifies, confidence likely < 0.75 → manual queue.
6. **No fb_user_id, only email** — upsert succeeds, Confidence Gate routes to manual queue (no `fb_user_id` to DM).
7. **Webhook with only `q1/q2/q3`** — fallback key matching works, persona inferred.
8. **Duplicate webhook** — second run upserts cleanly; Slack pings twice (acceptable in Phase 1).
9. **FB Graph API rejects DM** — error envelope fires; member is still tagged in Airtable; Daniel sees the alert.
10. **Member already in Customers as buyer** — upsert sets FB-related fields without nuking `First purchase date` etc.

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Webhook execution success rate | > 98% | < 90% = investigate Zapier or n8n |
| Persona auto-DM success rate | > 80% | < 50% = FB messaging perms / 24-hr policy issue |
| % routed to manual queue | < 30% | > 50% = retune Claude / rule overrides |
| New FB members captured per week | trend up | sudden 0 = Zapier broken |
| Persona distribution (sarah / sam / dreamer / pam) | matches Daniel's qualitative read | drift = retune |

## Deployment

1. Set up Zapier "FB Group new member → Webhook" zap pointing at `https://n8n.thestrledger.com/webhook/fb-group-new-member`. Map the 3 entry-question answers to `hosting_status`, `listing_count`, `headache`.
2. Configure n8n credentials: Airtable (1), Slack (3), Claude API (7), Facebook Graph API page token (12).
3. Add the FB-related fields to Customers table (see Dependencies).
4. Replace `BASE_ID_PLACEHOLDER`, `TABLE_ID_CUSTOMERS`, `TABLE_ID_SUPPORT_DRAFTS`, `TABLE_ID_ERRORS` placeholders.
5. Import `W19-fb-group-new-member.json` into n8n.
6. Activate the workflow.
7. Trigger a test from Zapier with a fake payload; verify Customers row + Slack ping. Test FB DM with a real test account.
8. Monitor first 10 real members; manually verify persona accuracy and tune the rule regex / Claude prompt if needed.

## Iteration log

- `2026-04-27` — Initial spec. Unimplemented.
- (future entries as the workflow evolves in production)
