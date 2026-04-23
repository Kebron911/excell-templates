# W08 — Lead Magnet Delivery

**Priority:** P0

**Family:** D — Funnel orchestration

**Summary:** Mirror IS lead-magnet form submissions into Airtable Customers with source attribution. IS delivers the magnet + triggers the nurture sequence natively; n8n ensures Airtable stays in sync.

---

## Trigger

IS webhook on `form.submitted` for the `/47` (hero magnet) landing page form.

POST to `https://n8n.thestrledger.com/webhook/lead-magnet-47`

Similar webhook exists for each secondary magnet (`/pinterest-cashflow`, `/etsy-post`, `/blog-cost-per-stay`) — can be one workflow with Switch by magnet ID, or separate workflows per magnet (prefer single workflow with Switch).

## Node-by-node configuration

### Node 1 — Webhook (POST)

Path: `/webhook/lead-magnet-47`

If IS provides signed webhooks, verify signature. Otherwise, validate shared secret passed as URL query param.

### Node 2 — Function: Parse form submission

```js
const submission = $input.body;

// IS form submissions typically include:
// - email (required)
// - first_name (optional)
// - form_id or slug identifying which magnet
// - UTM params captured as hidden fields
// - timestamp

const parsed = {
  email: (submission.email || '').toLowerCase(),
  first_name: submission.first_name || '',
  magnet_id: submission.form_slug || 'hero-47',
  utm_source: submission.custom_fields?.utm_source || null,
  utm_medium: submission.custom_fields?.utm_medium || null,
  utm_campaign: submission.custom_fields?.utm_campaign || null,
  utm_content: submission.custom_fields?.utm_content || null,
  referrer: submission.referrer || null,
  landing_page: submission.landing_url || null,
  timestamp: submission.submitted_at || new Date().toISOString(),
  ip_country: submission.ip_country || null
};

// Validate email format
if (!parsed.email || !parsed.email.includes('@')) {
  throw new Error('Invalid email in submission');
}

return parsed;
```

### Node 3 — Function: Derive acquisition attribution

```js
const parsed = $input.all()[0].json;
let acquisition_source;

// Priority 1: explicit UTM source
if (parsed.utm_source) {
  acquisition_source = parsed.utm_source.toLowerCase();
}
// Priority 2: referrer-based inference
else if (parsed.referrer) {
  if (parsed.referrer.includes('pinterest.com')) acquisition_source = 'pinterest';
  else if (parsed.referrer.includes('etsy.com')) acquisition_source = 'etsy-post-purchase';
  else if (parsed.referrer.includes('facebook.com')) acquisition_source = 'fb-group';
  else if (parsed.referrer.includes(`blog.thestrledger.com`)) acquisition_source = 'blog';
  else acquisition_source = 'other';
}
// Priority 3: magnet-id default
else {
  const defaults = {
    'hero-47': 'direct',
    'pinterest-cashflow': 'pinterest',
    'etsy-post': 'etsy-post-purchase',
    'blog-cost-per-stay': 'blog'
  };
  acquisition_source = defaults[parsed.magnet_id] || 'unknown';
}

return {
  ...parsed,
  acquisition_source,
  acquisition_campaign: parsed.utm_campaign || null
};
```

### Node 4 — Airtable: Upsert Customer

- Match: `Email`
- On create:
  - `Email`: from Node 3
  - `First name`: from Node 3
  - `Acquisition source`: derived
  - `Acquisition campaign`: UTM campaign if present
  - `Persona tag`: `unknown` (to be inferred later)
  - `Lead magnet downloaded`: `[magnet_id]` (multi-select)
  - `First contact date`: timestamp
- On update (existing Customer):
  - Append magnet_id to `Lead magnet downloaded` multi-select (don't replace)
  - Do NOT overwrite `Acquisition source` (first-touch attribution)
  - Do NOT overwrite `First contact date`

### Node 5 — IS API: Ensure contact tagged correctly

Tags to add:
- `magnet:<magnet_id>` (e.g., `magnet:hero-47`)
- `source:<acquisition_source>`
- `list:weekly-tips` (subscribes them to the Friday broadcasts)

**Note:** IS should also be automatically enrolling this contact into the nurture sequence defined in `copy/email-sequences/nurture-hero-magnet.md`. W08 does NOT trigger the sequence; that's IS-native. W08 just ensures tagging is consistent so branch logic works.

### Node 6 — Optional: First-touch enrichment (async)

If budget allows, call an enrichment API (Clearbit, FullContact, Hunter) to pull:
- Job title (if LinkedIn-discoverable)
- Company (indicator of whether they're an operator vs investor)
- Location

Store in `Notes` field on Customer row. Skip if no enrichment service configured.

### Node 7 — Slack notification (conditional)

Only for first 100 subscribers of each magnet:
- Channel: `#str-platform-wins`
- Message: `📥 New subscriber via <magnet_id>: <first_name or email domain> from <acquisition_source>`

### Node 8 — Success response

HTTP 200 with `{"status": "processed", "email_lowercased": "..."}`

### Error branch

Standard Errors table + Slack + retry.

**Special:** if IS fails but Airtable succeeded, DON'T retry Airtable — just retry IS tag operation. Idempotency matters here.

## Inputs

- IS form submission webhook
- Environment: `IS_API_KEY`, `IS_WEBHOOK_SECRET`, `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`

## Outputs

- Airtable Customer row upserted
- IS contact tagged
- (IS-native) Customer enrolled in nurture sequence

## Dependencies

- IS lead-magnet landing pages deployed and forms configured with webhook
- Airtable Customers table
- IS contact tagging API accessible

## Edge cases

| Case | Handling |
|---|---|
| Duplicate submission (same email re-opts-in) | Upsert; append magnet_id to existing row's list; no duplicate row |
| Email typo (e.g., `user@gmial.com`) | Accept and save; IS will handle bounces naturally |
| Invalid email (no @) | Reject at Node 2, return 400 |
| Contact already tagged (repeat submit) | Tag add is idempotent — no error |
| High-volume burst (100+ submissions in 1 min, e.g., viral Pinterest pin) | n8n handles sequentially; Airtable API may rate-limit → queue with backoff |
| Spam bot submission | Consider honeypot field on IS form; reject at Node 2 if honeypot populated |
| Magnet file delivery failure (IS's problem) | Not W08's concern — IS owns delivery |

## Test cases

1. **First-time Pinterest subscriber** — submits `/47` with UTM source=pinterest
   - Expected: Airtable row created, source=pinterest, campaign captured, IS tagged `source:pinterest` + `magnet:hero-47`
2. **Existing customer downloads a second magnet** — already bought a template, now gets the blog magnet
   - Expected: existing row updated, `Lead magnet downloaded` now contains both magnet IDs; acquisition source NOT overwritten
3. **Duplicate submission (accidental double-click)** — same email, same magnet, seconds apart
   - Expected: upsert dedupes, only 1 row; IS tag already present, no error
4. **Submission without UTM** — direct landing-page visit
   - Expected: acquisition_source = 'direct'
5. **Spam bot submission** — honeypot field filled
   - Expected: 400 at Node 2, no writes
6. **IS API temporarily down** — Airtable succeeds but IS tag fails
   - Expected: Errors row; retry IS tag only; eventually succeeds

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Conversion rate (form views → submissions) | > 5% on cold Pinterest traffic; > 15% on warm blog traffic | < 3% cold / < 8% warm = investigate |
| Airtable sync success | > 99% | < 95% |
| Duplicate rate | < 5% (expected from accidental re-submits) | > 20% = landing page confusing users |
| Spam bot rate | < 1% (with honeypot) | > 5% = add CAPTCHA |

## Deployment

1. Build IS landing page at `/47` with form (email + optional first_name + hidden UTM fields)
2. Configure IS form to send webhook on submit
3. Create W08 workflow, configure IS + Airtable credentials
4. Connect form webhook → n8n endpoint
5. Test: submit with real email → verify Airtable row created within 30s, IS tagged, nurture sequence starts
6. Add honeypot field to form + update Node 2 to check
7. Export workflow JSON, commit

## Iteration log

- `2026-04-22` — Initial spec. Unimplemented.
