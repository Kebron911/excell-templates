# W23 — Course Purchase Onboarding

**Priority:** P0 — blocks course launch

**Family:** L — Course

**Summary:** When an Order Ingestion workflow (W01/W02) detects a course-tier SKU, this workflow takes over: provisions LMS access, creates the Course_Students row, sets onboarding tags in IS to fire the post-purchase 10-email sequence, and (for cohort/DWY tiers) hands off to W26 for fulfillment.

---

## Trigger

Delegated from W01 (Stripe/IS) or W02 (Gumroad) Order Ingestion workflows.

W01/W02 add a Switch node: if any product SKU starts with `course-` (e.g., `course-self-study`, `course-cohort`, `course-dwy`), the order is forwarded via webhook to:

`https://n8n.thestrledger.com/webhook/course-onboarding`

The forwarded payload carries the normalized order envelope plus a `course_tier` field set to one of `self-study`, `cohort`, `dwy`.

---

## Inputs

```json
{
  "order_id": "stripe-pi_3ABC123",
  "timestamp": "2026-04-29T15:42:18Z",
  "email": "host@example.com",
  "first_name": "Sarah",
  "course_tier": "cohort",
  "gross_amount": 997.00,
  "platform": "is",
  "stripe_customer_id": "cus_XYZ",
  "discount_code_used": "STROPERATOR50",
  "utm_source": "email",
  "utm_campaign": "course-launch-week-1"
}
```

---

## Node-by-node configuration

### Node 1 — Webhook (POST)

Path: `/webhook/course-onboarding`
Validates a shared secret query param `?secret=<env:COURSE_WEBHOOK_SECRET>` since the source is internal (W01/W02 forwarding) — not external.

### Node 2 — Function: Normalize and validate

```js
const order = $input.first().json.body;

if (!order.email || !order.course_tier) {
  throw new Error('Missing required fields: email and course_tier');
}

const validTiers = ['self-study', 'cohort', 'dwy'];
if (!validTiers.includes(order.course_tier)) {
  throw new Error(`Invalid course_tier: ${order.course_tier}`);
}

return [{ json: {
  ...order,
  email: order.email.toLowerCase().trim(),
  enrollment_date: new Date().toISOString(),
  module_unlock_schedule: {
    'module-0': order.timestamp,
    'module-1': addDays(order.timestamp, 2),
    'module-2': addDays(order.timestamp, 4),
    'module-3': addDays(order.timestamp, 14),
    'module-4': addDays(order.timestamp, 21),
    'module-5': addDays(order.timestamp, 35),
    'module-6': addDays(order.timestamp, 50),
    'module-7': addDays(order.timestamp, 70)
  }
}}];

function addDays(iso, days) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
```

### Node 3 — Airtable: Create Course_Students row

Create row in `Course_Students` table:

```
email                       (from input)
first_name                  (from input)
tier                        (course_tier)
purchase_date               (timestamp)
order_id                    (order_id)
current_module              "module-0"
module_unlock_schedule      (JSON, from node 2)
first_saturday_scheduled    null
nps_score                   null
graduation_date             null
status                      "active"
discount_code_used          (from input)
```

Match column: `email`. Upsert — if a course_students row exists for this email (e.g., DWY upgrade from Cohort), update the tier and refresh the unlock schedule rather than creating duplicate.

### Node 4 — Influencersoft: Provision LMS access

```
HTTP POST to: {{ $env.IS_API_BASE_URL }}/api/courses/grant
Body: {
  contact_email: $json.email,
  course_id: $env[`IS_COURSE_ID_${$json.course_tier.toUpperCase()}`],
  drip_schedule: $json.module_unlock_schedule
}
```

Influencersoft returns a `student_id` — save it back to the Course_Students row in node 5.

### Node 5 — Airtable: Update Course_Students with student_id

Update the row created in Node 3 with the IS `student_id` for cross-system reference.

### Node 6 — Influencersoft: Apply onboarding tags

```
HTTP POST to: {{ $env.IS_API_BASE_URL }}/api/contacts/tags
Body: {
  email: $json.email,
  tags: [
    'course:purchased',
    `course:${$json.course_tier}`,
    'customer:course',
    `course:onboarding-day-0`
  ]
}
```

The `course:purchased` tag is what fires the IS post-purchase 10-email sequence. The IS sequence handles email delivery; n8n does not send emails directly.

### Node 7 — Switch: Tier-specific routing

```
self-study  →  Node 8a (Send welcome email via IS — already covered by tag fire)
cohort      →  Node 8b (Forward to W26 Cohort Enrollment)
dwy         →  Node 8c (Forward to W26 + DWY-specific path)
```

### Node 8a — Self-Study completion path

For self-study buyers, the IS sequence handles everything from here. No further n8n action.

### Node 8b — Cohort handoff to W26

```
HTTP POST to: https://n8n.thestrledger.com/webhook/cohort-enrollment
Body: {
  ...all order fields,
  course_students_record_id: $json.airtable_record_id,
  is_student_id: $json.is_student_id
}
```

### Node 8c — DWY handoff to W26 + concierge alert

Same as 8b plus:

```
Slack: Post to #str-platform-wins
Message: "🎓 New DWY enrollment: {first_name} ({email}). Concierge intake form sent.
First 1:1 should be scheduled within 7 days."
```

### Node 9 — Convergence: Slack notification

For all tiers, post to `#str-platform-wins`:

```
🎓 New course enrollment
Tier: {{ $json.course_tier }}
Email: {{ $json.email }}
Source: {{ $json.utm_source || 'direct' }}
Discount: {{ $json.discount_code_used || 'none' }}
```

### Node 10 — Error branch

Standard pattern: catch errors, write to Errors table with `workflow_id: W23`, post to `#str-platform-alerts`, retry up to 3 times with exponential backoff for transient API errors.

---

## Outputs

- Airtable Course_Students row created
- IS LMS access granted with drip schedule
- IS contact tagged (fires onboarding sequence)
- Slack notification
- (Cohort/DWY) handoff webhook fired to W26

---

## Dependencies

- Airtable base must have `Course_Students` table with full schema (Task L1)
- IS API course-grant endpoint accessible (Task L2)
- W26 Cohort Enrollment workflow exists for the cohort/dwy handoff
- Env vars: `IS_API_BASE_URL`, `IS_COURSE_ID_SELF_STUDY`, `IS_COURSE_ID_COHORT`, `IS_COURSE_ID_DWY`, `COURSE_WEBHOOK_SECRET`

---

## Error handling

- Missing email or course_tier → reject with 400, log to Errors, no Slack noise (this is W01/W02's bug, not a course bug — the alert routes to those workflows)
- IS API failure on grant → retry 3× with exponential backoff (2s, 8s, 32s); if still failing, write to Errors and post P0 alert to Slack — buyer is paying customer with no LMS access
- Airtable row already exists with different tier → upgrade path: update tier, preserve purchase_date as the original, set `tier_upgraded_at` to now
- IS tagging failure (sequence won't fire) → retry 3×; if still failing, post to Slack `#str-platform-alerts` for manual intervention — onboarding sequence is the post-purchase contract

---

## Test cases

1. **Self-Study purchase, fresh email** → Course_Students row created, LMS access granted, tags applied, IS sequence fires, no W26 handoff. Buyer receives Email 1 within 5 minutes per onboarding sequence.
2. **Cohort purchase, fresh email** → All of above plus W26 webhook fired, Slack `#str-platform-wins` notification posted, cohort calendar invite arrives within 1 hour (handled in W26).
3. **DWY purchase, fresh email** → All of above plus DWY-specific Slack alert about concierge intake.
4. **Existing Self-Study buyer purchases Cohort upgrade** → Course_Students row updates tier to cohort, `tier_upgraded_at` set, fresh module-unlock schedule, W26 fires.
5. **Discount code STROPERATOR50 used** → discount_code_used field set on Course_Students row; downstream NPS and review-request emails reference reader-discount segmentation.
6. **IS API down** → retries 3×; on persistent failure writes to Errors, posts P0 alert. Buyer's payment already cleared — manual recovery required.

---

## Design notes

**Why we don't send the welcome email directly from n8n.** Email delivery has compliance, deliverability, and template-management concerns that IS handles natively. n8n's job is to set the tags that fire IS's sequence; the sequence handles delivery. This separation has held across W01 and W08 and stays consistent here.

**Why module unlock dates are computed at purchase.** Storing the schedule as JSON on the Course_Students row makes W24 (Module Drip Unlock) idempotent — it computes "should this student have access to module X today?" by reading the schedule, not by tracking state. If a student requests faster unlock for a specific reason, we update the schedule field.

**Why we don't trigger the IS sequence directly.** IS sequences fire from tag application, not from API call. This means the IS-side automation can be edited without touching n8n. n8n applies tags; IS owns sequence behavior.

---

## Cost / volume

Expected volume: 5–15 enrollments per typical day during a launch week, 1–3 per day in steady state. n8n execution cost negligible. IS API calls: ~3 per enrollment.

---

## Companion workflows

- **Triggered by:** W01, W02 (when product SKU is course-*)
- **Triggers:** W26 Cohort Enrollment (for cohort/dwy tiers)
- **Read by:** W24 Module Drip Unlock (uses module_unlock_schedule field)
- **Read by:** W29 NPS Collection (uses purchase_date for Day-30 trigger)
