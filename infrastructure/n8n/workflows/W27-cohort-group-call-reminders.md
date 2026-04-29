# W27 — Cohort Group Call Reminders

**Priority:** P1

**Family:** L — Course

**Summary:** For each active cohort, sends reminders 24 hours and 1 hour before each Tuesday group call. Bumps the `cohort-week:N` tag at week boundaries so the IS-side cohort overlay sequence (C1-C8 emails) fires correctly.

---

## Trigger

Two cron schedules:

- **Cron A — Monday 19:00 ET** — fires the "tomorrow at 7 PM" 24-hour reminder
- **Cron B — Tuesday 18:00 ET** — fires the "in one hour" reminder

Both crons run for every active cohort.

---

## Node-by-node configuration

### Node 1 — Cron trigger

Two scheduled triggers as above. Single workflow with a Switch node routing by `which_reminder` ("24h" or "1h").

### Node 2 — Get active cohorts

Query Airtable Cohorts where:
```
status = 'in-progress'
next_call_date <= now + 30 hours AND next_call_date > now
```

Returns the cohort(s) whose next call is today (Tuesday) or tomorrow.

### Node 3 — Get enrolled students per cohort

Query Course_Students where `cohort_id` matches the active cohort and `status = 'active'`.

### Node 4 — IS API: Send reminder email

Per student:

```
POST {{ IS_API_BASE_URL }}/api/email/send
Body:
  to: <student email>
  subject: <calculated by reminder type>
    24h: "Tomorrow at 7 PM ET — Cohort Call <N>"
    1h:  "In one hour — Cohort Call <N>"
  body: <template referencing the week's pre-call homework>
```

The template is pulled from Airtable `Cohort_Email_Templates` keyed on `(week_number, reminder_type)`. Lets Daniel adjust copy without touching n8n.

### Node 5 — Update cohort-week tag

After Tuesday's 1h reminder fires, also bump tags:
- Remove old tag: `cohort-week:N`
- Apply new tag: `cohort-week:N+1`

This drives the IS-side cohort overlay sequence (C3, C4, C5, C6) — each cohort-week tag bump fires the next overlay email.

### Node 6 — Slack notification (Tuesday call only)

Post to `#str-platform-wins` 30 minutes before each call:

```
🎙️ Cohort Call <N> — <cohort_id>
Starts at 7:00 PM ET
Enrolled: <N> students
Pre-call homework: <link to Airtable view>
```

### Node 7 — Mark call as sent

Update Cohorts row:
```
last_reminder_sent_at = now
last_reminder_type = '24h' | '1h'
```

Prevents duplicate sends if cron fires twice.

### Node 8 — Error branch

Standard pattern.

---

## Outputs

- Email reminders sent to enrolled students
- IS cohort-week tag bumped (drives next overlay email)
- Slack ops notification before each call
- Cohorts row updated with last reminder state

---

## Dependencies

- Cohorts table includes `next_call_date`, `last_reminder_sent_at`, `last_reminder_type`
- Cohort_Email_Templates table for swap-able copy
- W26 has populated Course_Students with cohort_id

---

## Test cases

1. **Active cohort, Monday 19:00 ET, next call tomorrow** → all enrolled students receive 24h email, week-tag stays at current value.
2. **Active cohort, Tuesday 18:00 ET, call in 1 hour** → all enrolled students receive 1h reminder, Slack ops notification posts, cohort-week tag bumps after the call.
3. **No active cohorts** → workflow runs, no actions taken, no Slack noise.
4. **Two concurrent cohorts** (e.g., one in week 2, one in week 4) → each sends its own reminders independently.

---

## Volume

Up to 25 students × 2 cohorts × 4 calls × 2 reminders = 400 emails per cohort cycle. Trivial.

---

## Companion workflows

- **Triggered by:** Cron (twice weekly per active cohort)
- **Reads from:** Cohorts (active), Course_Students (enrolled), Cohort_Email_Templates (copy)
- **Writes to:** Cohorts (last reminder state), IS (tags, emails)
