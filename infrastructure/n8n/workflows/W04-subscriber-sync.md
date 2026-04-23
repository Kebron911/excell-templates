# W04 — Subscriber Sync (IS → Airtable)

**Priority:** P0

**Family:** B — Customer data unification

**Summary:** Mirrors IS subscribers to Airtable Customers table so non-buyers are tracked for LTV attribution and segmentation. Complements order-driven flows (W01–W03).

---

## Trigger

**Path A (preferred):** IS webhook on `subscriber.created` or `contact.updated` events → POST `https://n8n.thestrledger.com/webhook/subscriber-is`

**Path B (fallback):** Cron every 1 hour → pull IS API for contacts modified since last sync

Use Path A if IS supports webhooks; Path B if not. Determined at Task B3 when surveying IS capabilities.

## Node-by-node configuration (Path A — webhook)

### Node 1 — Webhook (POST)

Path: `/webhook/subscriber-is`; verify IS shared secret or signature per IS's documented mechanism.

### Node 2 — Function: Normalize IS Contact

```js
const contact = $input.body;

const normalized = {
  is_contact_id: contact.id,
  email: (contact.email || '').toLowerCase(),
  first_name: contact.first_name || '',
  last_name: contact.last_name || '',
  tags: contact.tags || [],
  source_utm: contact.custom_fields?.utm_source || null,
  source_campaign: contact.custom_fields?.utm_campaign || null,
  subscribed_at: contact.created_at,
  unsubscribed: contact.unsubscribed === true,
  raw_payload: JSON.stringify(contact).slice(0, 3000)
};

// Derive acquisition source from tags if present
const sourceTag = normalized.tags.find(t => t.startsWith('source:'));
if (sourceTag) {
  normalized.acquisition_source = sourceTag.replace('source:', '');
} else if (normalized.source_utm) {
  normalized.acquisition_source = normalized.source_utm;
} else {
  normalized.acquisition_source = 'unknown';
}

// Derive persona from tags
const personaTag = normalized.tags.find(t => t.startsWith('persona:'));
normalized.persona = personaTag ? personaTag.replace('persona:', '') : 'unknown';

// Derive lead magnet from tags
const magnetTag = normalized.tags.find(t => t.startsWith('magnet:'));
normalized.lead_magnet = magnetTag ? magnetTag.replace('magnet:', '') : 'none';

return normalized;
```

### Node 3 — Airtable: Find or Create Customer

- **Match on:** `Email`
- **On create:**
  - All fields populated from normalized data
  - `First contact date`: `{{ $json.subscribed_at }}`
- **On update:**
  - Never overwrite `First contact date`
  - Update `IS contact ID` if blank
  - Merge tags (don't replace — IS might lose tags temporarily)
  - Update `Persona tag` only if currently `unknown`
  - Update `Lead magnet downloaded` — append to multi-select, don't replace

### Node 4 — Success response

HTTP 200 with `{"synced": true, "email": "..."}`

### Error branch

Write to Errors, Slack alert, retry.

## Node-by-node configuration (Path B — cron polling fallback)

### Node 1 — Cron

Schedule: every 1 hour

### Node 2 — Airtable: Get last sync timestamp

Read `last_is_sync` from a dedicated "Config" table or n8n static data.

### Node 3 — IS API: List contacts modified since last sync

```
GET /api/contacts?modified_after=<last_sync_iso>&limit=500
```

Paginate if >500 results.

### Node 4 — Loop: for each contact

Normalize (same as Path A Node 2), upsert in Airtable (same as Path A Node 3).

### Node 5 — Update `last_is_sync` timestamp to now

### Node 6 — Error branch

## Inputs

- IS webhook payload or IS API fetch
- Environment: `IS_API_KEY`, `IS_WEBHOOK_SECRET`, `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`

## Outputs

- Airtable Customer rows (upserted)

## Dependencies

- IS has been configured with API access or webhook support
- Airtable Customers table exists

## Edge cases

| Case | Handling |
|---|---|
| Unsubscribed contact | Update Airtable row's `Unsubscribed` checkbox, don't remove |
| Contact exists in Airtable from prior order (W01/W02) | Update tags + persona, preserve order history |
| Email changed in IS | Create new Customer row (IS contact ID tracking preserves link) — flag for manual merge |
| Webhook replay | Idempotent via Email upsert |
| Contact deleted in IS (rare) | Mark Airtable row `status: deleted_in_is` — don't actually delete (audit trail) |
| Custom field schema changes in IS | Normalize function needs update; catch at Errors |

## Test cases

1. **New subscriber from Pinterest ad** — Customer created with acquisition_source=pinterest, persona=unknown
2. **Subscriber upgrade to buyer** — W01/W02 fires separately; W04 has already created the row, W01 updates it
3. **Existing customer adds FB Group membership tag in IS** — W04 propagates tag update to Airtable
4. **Unsubscribed customer re-subscribes** — Airtable row unsubscribed flag flips back, tags preserved
5. **Bulk import of 1000 contacts via IS admin** — Path B handles paginated fetch, all 1000 upserted

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Sync lag (time from IS event to Airtable write) | < 60s (Path A) or < 1 hr (Path B) | > 5 min (A) / > 2 hr (B) |
| Success rate | > 99% | < 95% |
| Schema mismatch errors | 0 | > 0 = IS field changed, update normalize function |

## Deployment

1. Survey IS capabilities (Task B3 Step 5) — determine if webhooks or polling
2. Create workflow in n8n
3. Configure credentials
4. **Path A:** register webhook endpoint in IS → test via IS's webhook-test tool
5. **Path B:** test cron manually with a known-modified contact
6. Monitor for 24 hours, verify no Errors rows accumulate
7. Export to JSON, commit

## Iteration log

- `2026-04-22` — Initial spec. Unimplemented.
