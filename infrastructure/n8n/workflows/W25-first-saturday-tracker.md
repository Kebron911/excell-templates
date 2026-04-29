# W25 — First Saturday Tracker

**Priority:** P1 — drives Day-7 onboarding email segmentation

**Family:** L — Course

**Summary:** Captures the LMS event when a student clicks "I have my first Saturday scheduled" in their dashboard. Updates the Course_Students row, applies the milestone tag, and logs to Airtable for later cohort-completion-rate analysis.

This is the single most predictive engagement signal in the course — students who schedule the first Saturday inside 14 days complete the course at >70%; students who don't, complete at <15%.

---

## Trigger

LMS dashboard (Influencersoft) fires a webhook when the student clicks the "First Saturday scheduled" button:

`https://n8n.thestrledger.com/webhook/first-saturday-scheduled`

The button is configured in the Module 0.3 lesson card with a hidden form that POSTs the student's email + the date they entered into the form's "Saturday date" field.

---

## Inputs

```json
{
  "email": "host@example.com",
  "saturday_date": "2026-05-23",
  "submitted_at": "2026-05-12T18:42:18Z",
  "secret": "<env:LMS_WEBHOOK_SECRET>"
}
```

`saturday_date` is the date the student entered. `submitted_at` is when they clicked. The two might differ — student schedules Saturday May 23 from their May 12 dashboard click.

---

## Node-by-node configuration

### Node 1 — Webhook (POST)

Path: `/webhook/first-saturday-scheduled`
Validates shared secret query param.

### Node 2 — Function: Validate input

```js
const data = $input.first().json.body;

if (!data.email || !data.saturday_date) {
  throw new Error('Missing required fields');
}

const saturdayDate = new Date(data.saturday_date);
if (isNaN(saturdayDate.getTime())) {
  throw new Error('Invalid saturday_date');
}

const today = new Date();
const daysUntil = Math.floor((saturdayDate - today) / (1000 * 60 * 60 * 24));

return [{ json: {
  email: data.email.toLowerCase().trim(),
  saturday_date: data.saturday_date,
  submitted_at: data.submitted_at || new Date().toISOString(),
  days_until_saturday: daysUntil,
  is_within_14_days: daysUntil >= 0 && daysUntil <= 14
}}];
```

### Node 3 — Airtable: Find Course_Students row

Search by email. If no match, the student isn't enrolled — log to Errors and exit (someone is hitting the webhook with a non-enrolled email — possible attack or test).

### Node 4 — Airtable: Update Course_Students row

```
first_saturday_scheduled       (saturday_date)
first_saturday_scheduled_at    (submitted_at)
first_saturday_within_14_days  (boolean)
```

### Node 5 — IS API: Apply milestone tag

```
POST {{ IS_API_BASE_URL }}/api/contacts/tags
Body: {
  email: $json.email,
  tags: ['course:milestone:first-saturday-set']
}
```

This tag is what the IS-side onboarding sequence uses to skip the Day-7 "did you schedule?" email — if the tag is set before Day 7, the email suppresses.

### Node 6 — Calendar event creation (optional, courteous)

If the student opted in via a checkbox on the form ("Send me a calendar invite"), create an .ics file and email it:

```
HTTP POST to: {{ IS_API_BASE_URL }}/api/email/send
Body: {
  to: $json.email,
  subject: "Your first 21-minute Saturday is on the calendar",
  body: "<short congratulatory body>",
  attachments: [
    { name: "first-saturday.ics", content: <generated ics blob> }
  ]
}
```

The .ics generation is a Code node that builds a 2-hour event titled "Quarterly Tax Tab — first run" on the chosen date at 9 AM local time.

### Node 7 — Slack notification

Post to `#str-platform-wins`:

```
🗓️ First Saturday scheduled
Student: {{ $json.email }}
Saturday date: {{ $json.saturday_date }} ({{ $json.days_until_saturday }} days out)
```

These notifications are useful early in launch (low volume, high signal). Toggle off after 200 students enroll to avoid Slack noise.

### Node 8 — Update Course_Students aggregate metric

Trigger a small Airtable formula update or write to a separate `Course_Metrics` table:

```
metric: 'first_saturday_scheduled_count_30d'
value: <count of rows with first_saturday_scheduled_at within last 30 days>
last_updated: now
```

This metric feeds the weekly briefing (W10) so Daniel can track the leading indicator of completion.

### Node 9 — Error branch

Standard error pattern.

---

## Outputs

- Course_Students row updated with first_saturday_scheduled fields
- IS milestone tag applied (suppresses Day-7 nudge email)
- Optional .ics calendar invite sent to student
- Slack notification (early launch only)
- Course_Metrics aggregate refreshed

---

## Dependencies

- LMS dashboard (Influencersoft) configured with the "First Saturday scheduled" button + webhook
- Course_Students table includes fields: `first_saturday_scheduled`, `first_saturday_scheduled_at`, `first_saturday_within_14_days`
- IS API contact-tagging endpoint accessible
- Env vars: `LMS_WEBHOOK_SECRET`, `IS_API_BASE_URL`

---

## Error handling

- Email not found in Course_Students → log to Errors with severity `warning` (could be a test or a non-purchase email submission)
- Invalid date format → log to Errors, return 400 to LMS so the LMS shows an error message back to the student
- IS API failure → retry 3×; if persistent, the milestone tag isn't set and the student receives the Day-7 nudge email (degraded behavior, not catastrophic)
- Course_Students update failure → critical; retry 3×; if persistent, P1 alert (we lost the conversion signal)

---

## Test cases

1. **Enrolled student, valid Saturday 5 days out** → row updated, tag applied, calendar invite sent (if opted in), Slack posted, Day-7 email suppressed.
2. **Enrolled student, Saturday in the past** (data entry error) → row still updated; `is_within_14_days = false`; no special handling — student can correct from the dashboard later.
3. **Non-enrolled email hits webhook** → Errors row created; 200 returned to LMS to avoid leaking enrollment status.
4. **Same student re-clicks the button** → row updates with new date (latest wins); tag re-applied (no-op); idempotent.
5. **IS API down** → row updated, tag application queued in retries, eventually succeeds.

---

## Volume

Steady state: 5–15 events per day. Spike during launch week and at module-2 unlock dates.

---

## Companion workflows

- **Triggered by:** LMS dashboard button click
- **Reads from:** Airtable Course_Students (find row by email)
- **Writes to:** Course_Students (update), IS (tag), Course_Metrics (aggregate)
- **Affects:** IS-side post-purchase onboarding sequence (Day-7 email suppression)
- **Read by:** W10 Weekly Ops Briefing (uses first_saturday_scheduled_count_30d metric)
