# W29 — NPS Day-30 Collection

**Priority:** P1

**Family:** L — Course

**Summary:** Daily cron that identifies students at exactly 30 days post-purchase, sends them a 2-question form (NPS + first-Saturday-status), processes the responses, and tags accordingly. Drives the most honest signal of course quality.

---

## Trigger

Cron daily at 08:00 ET.

Plus a webhook for receiving form responses:

`https://n8n.thestrledger.com/webhook/nps-response`

---

## Node-by-node configuration

### Node 1 — Daily Cron (sending arm)

Standard cron node, schedule `0 8 * * *`.

### Node 2 — Get students at exactly Day 30

Query Course_Students:

```
status = 'active' AND
purchase_date is exactly 30 days ago AND
nps_asked_at IS NULL
```

The "exactly 30 days" allows ±12 hours of tolerance (cron runs at 08:00 daily, so a student who purchased at 14:00 on Day 0 will hit Day 30 around 14:00 — they get the email on the morning of Day 30).

### Node 3 — Per student: send NPS form email

```
POST {{ IS_API_BASE_URL }}/api/email/send
Body:
  to: $email
  subject: "Thirty days in. Two questions."
  body: <copy from post-purchase-onboarding.md Email 8 with form links>
```

The email body contains two form links:

- NPS form: `https://n8n.thestrledger.com/webhook/nps-response?email=<encoded>&q=1`
- First-Saturday status form: `https://n8n.thestrledger.com/webhook/nps-response?email=<encoded>&q=2`

Both forms post back to the same webhook with different `q` parameters.

### Node 4 — Mark NPS asked

Update Course_Students row:
```
nps_asked_at = now
```

Prevents re-sending if cron logic glitches.

### Node 5 — IS: Apply tag

```
POST {{ IS_API_BASE_URL }}/api/contacts/tags
Body:
  email: $email
  tags: ['course:nps-asked-30']
```

### Node 6 — Webhook (receiving arm)

Path: `/webhook/nps-response`

Listens for form submissions.

### Node 7 — Branch by question type

Switch on `q` parameter:

- **q=1** (NPS) — extract score (0-10) from form data, tag accordingly
- **q=2** (First Saturday) — extract yes/no, branch into different paths

### Node 8a — NPS response handler

```js
const score = parseInt($json.body.score);

if (isNaN(score) || score < 0 || score > 10) {
  throw new Error('Invalid NPS score');
}

const tagBucket = score >= 9 ? 'promoter' : score >= 7 ? 'passive' : 'detractor';

return [{ json: {
  email: $json.body.email,
  score,
  tag_bucket: tagBucket,
  comment: $json.body.comment || ''
}}];
```

Update Course_Students:
```
nps_score = score
nps_responded_at = now
nps_comment = comment
```

Apply IS tag:
```
['course:nps:' + tag_bucket, 'course:nps-' + score]
```

If `tag_bucket === 'detractor'` (score 0-6): Slack alert to `#str-platform-alerts` so Daniel can reach out personally within 24 hours.

If `tag_bucket === 'promoter'` (score 9-10): queue for testimonial request at Day 90.

### Node 8b — First-Saturday response handler

```js
const completed = $json.body.completed === 'yes';

return [{ json: {
  email: $json.body.email,
  first_saturday_completed: completed
}}];
```

Update Course_Students:
```
first_saturday_completed = completed
first_saturday_completed_reported_at = now
```

If `completed === false`: trigger personal Daniel reply via Slack queue — "What's blocking you?" The "not yet" responses are the most actionable conversation in the course.

### Node 9 — Aggregate metrics

After 7 days of NPS responses accumulate, compute:
- 7-day rolling average NPS
- 30-day rolling promoter % - detractor %
- Bucket distribution (promoter / passive / detractor counts)

Write to Course_Metrics table for the W10 weekly briefing to read.

### Node 10 — Error branch

Standard pattern.

---

## Outputs

- NPS form emails sent to Day-30 students
- Course_Students rows updated with nps_score and first_saturday_completed
- IS tags applied (drive segmentation for Day-90 testimonial request)
- Detractor alert to Slack for personal follow-up
- Course_Metrics aggregates updated

---

## Dependencies

- Course_Students table includes `nps_asked_at`, `nps_score`, `nps_responded_at`, `nps_comment`, `first_saturday_completed`, `first_saturday_completed_reported_at`
- IS form-rendering capability (or direct webhook to n8n with simple HTML form)
- Course_Metrics table for aggregate reporting

---

## Error handling

- Invalid score → return 400, log to Errors with severity `warning`
- Email already has nps_score (re-submission) → overwrite with latest, log the change
- Detractor alert delivery failure → retry; if persistent, log Errors (we want every detractor known)

---

## Test cases

1. **Student exactly Day 30** → form email sent, nps_asked_at marked, `course:nps-asked-30` tag applied.
2. **Student responds with score 10** → score saved, `course:nps:promoter` tag applied, no Slack alert (positive scores don't need attention).
3. **Student responds with score 5** → score saved, `course:nps:detractor` tag, Slack alert posted to `#str-platform-alerts`, queued for Daniel personal reply.
4. **Student responds "first Saturday not completed"** → flag set, queued for personal reply about blockers.
5. **Re-submission with different score** → latest wins, change logged.

---

## Volume

At ~50 enrollments per month, ~50 NPS sends per month + ~30-40 responses per month. Trivial volume.

---

## Companion workflows

- **Triggered by:** Cron daily (sending) + webhook (receiving)
- **Reads from:** Course_Students (Day-30 query)
- **Writes to:** Course_Students (nps fields), IS (tags), Course_Metrics (aggregates)
- **Read by:** W10 Weekly Ops Briefing (uses NPS aggregate)
- **Affects:** Day-90 graduation email (testimonial request prioritized for promoters)
