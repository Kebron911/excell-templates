# W26 — Cohort Enrollment & Fulfillment

**Priority:** P0 — blocks cohort delivery

**Family:** L — Course

**Summary:** When a student purchases the Cohort or DWY tier, this workflow handles the cohort-specific fulfillment: invites them to Slack, assigns them to the next-available cohort group, sends calendar invites for the 4 group calls, triggers the wall-poster fulfillment, and queues the DWY concierge intake for DWY buyers.

---

## Trigger

Delegated from W23 Course Purchase Onboarding via webhook:

`https://n8n.thestrledger.com/webhook/cohort-enrollment`

---

## Inputs

```json
{
  "email": "host@example.com",
  "first_name": "Sarah",
  "course_tier": "cohort",
  "course_students_record_id": "rec123ABC",
  "is_student_id": "is_456",
  "secret": "<env:COURSE_WEBHOOK_SECRET>",
  "dwy_concierge": false
}
```

`dwy_concierge: true` is set when the buyer is on the DWY tier.

---

## Node-by-node configuration

### Node 1 — Webhook (POST)

Path: `/webhook/cohort-enrollment`
Validates shared secret.

### Node 2 — Function: Validate input

Standard validation. Must have email + course_tier + course_students_record_id.

### Node 3 — Airtable: Resolve next active cohort

Query `Cohorts` table for the next cohort whose:

```
Filter: status = 'enrolling' AND seats_remaining > 0
Sort: start_date ASC
Limit: 1
```

Returns the cohort row with cohort_id, start_date, slack_channel_name, seats_remaining.

If no cohort is currently enrolling, fall back to the next "scheduled" cohort and add the student to its waitlist (handled in node 4 conditional).

### Node 4 — Cohort assignment branch

Two paths:

- **Active cohort available** → continue to node 5 (assign + invite)
- **Next cohort is scheduled but not yet enrolling** → write student to `Cohort_Waitlist`, send waitlist confirmation email, end workflow. Daniel manually opens the next cohort.

### Node 5 — Airtable: Assign student to cohort

Update Course_Students row:

```
cohort_id              (the resolved cohort_id)
cohort_start_date      (cohort's start_date)
cohort_slack_channel   (cohort's slack_channel_name)
```

Update Cohorts row:

```
seats_remaining        (decrement by 1)
enrolled_emails        (append email)
```

### Node 6 — Slack API: Invite student to cohort channel

```
POST https://slack.com/api/conversations.invite
Body: {
  channel: <cohort's slack_channel_id>,
  users: <slack_user_id resolved from email lookup>
}
```

If the student doesn't have a Slack account yet (most don't), the API returns "user_not_in_team" — fall back to:

```
POST https://slack.com/api/admin.users.invite
Body: {
  email: <student email>,
  channel_ids: [<cohort's channel_id>],
  team_id: <env:SLACK_TEAM_ID>
}
```

This requires admin scope on the Slack workspace; the bot used here must be elevated.

### Node 7 — Send 4 calendar invites for cohort calls

For each of the 4 cohort calls (week 1, 2, 3, 4 — dates derived from cohort.start_date):

Generate an .ics file. Send via IS API:

```
POST {{ IS_API_BASE_URL }}/api/email/send
Body: {
  to: $student_email,
  subject: "Cohort Call X — Tuesday <date>",
  body: "<short body referencing the week's pre-call homework>",
  attachments: [{ name: "cohort-call-X.ics", content: <base64> }]
}
```

The 4 calls are 60 minutes each, Tuesdays at 7:00 PM Eastern. The .ics events should be standalone (not a recurring series) so students see four discrete events on their calendar.

For DWY buyers, also send the CPA panel session calendar invite (Thursday of week 3, 7 PM ET, 90 minutes).

### Node 8 — Trigger wall poster fulfillment

If the cohort is at the "ship-poster" stage (the cohort has explicit physical-fulfillment enabled in its config row), POST to Printful:

```
POST https://api.printful.com/orders
Body: {
  recipient: {
    name: $student_first_name + " " + $student_last_name,
    address1: $student_shipping_address_line1,
    city: $city, state_code: $state, country_code: 'US', zip: $zip
  },
  items: [
    {
      sync_variant_id: <env:PRINTFUL_POSTER_VARIANT_ID>,
      quantity: 1
    }
  ],
  retail_costs: { subtotal: '0.00', shipping: '0.00', total: '0.00' }
}
```

If the student's shipping address is missing, send them an "address request" email with a form link, and queue the Printful order for the response.

### Node 9 — DWY-specific concierge intake

If `dwy_concierge: true`:

```
HTTP POST to: {{ IS_API_BASE_URL }}/api/email/send
Body: {
  to: $student_email,
  subject: "Your concierge intake — let's get started",
  body: <DWY intake form template, with link to the form>
}
```

Also create an Airtable `DWY_Intake_Queue` row for Daniel's manual follow-up.

### Node 10 — IS: Apply cohort-specific tags

```
POST {{ IS_API_BASE_URL }}/api/contacts/tags
Body: {
  email: $email,
  tags: [
    'course:cohort-enrolled',
    `cohort:${cohort_id}`,
    `cohort-week:1`,
    'course:milestone:cohort-onboarded'
  ]
}
```

The cohort-week tag gets bumped each week by W27.

### Node 11 — Slack notification to ops channel

Post to `#str-platform-wins`:

```
👥 Cohort enrollment
Student: {{ first_name }} ({{ email }})
Cohort: {{ cohort_id }}
Tier: {{ course_tier }}
Seats remaining in cohort: {{ seats_remaining }}
Wall poster shipping: {{ shipping_status }}
```

If the cohort just hit its 25-seat cap with this enrollment, post a separate "🔒 Cohort {{ id }} is full" alert.

### Node 12 — Error branch

Standard error pattern. Per-stage failures should not block the entire workflow — Slack invite failure shouldn't prevent calendar invites; calendar invite failure shouldn't block poster fulfillment. Each major stage has independent retry + log.

---

## Outputs

- Course_Students row updated with cohort assignment
- Cohorts row updated with seat decrement
- Slack channel invitation sent
- 4 calendar invites delivered (5 if DWY — adds CPA panel)
- Printful order placed for wall poster (or address-request email queued)
- DWY: concierge intake email sent + Airtable queue row created
- IS tags applied
- Slack ops notification

---

## Dependencies

- Cohorts table exists with schema: `cohort_id`, `start_date`, `status` (enrolling/in-progress/closed/waitlist), `seats_remaining`, `slack_channel_id`, `slack_channel_name`, `enrolled_emails`
- Slack workspace has cohort channels pre-created (one per cohort)
- Printful integration set up with poster as a sync product
- Env vars: `SLACK_TEAM_ID`, `PRINTFUL_POSTER_VARIANT_ID`, `IS_API_BASE_URL`, `COURSE_WEBHOOK_SECRET`

---

## Error handling

- No active cohort + no scheduled cohort → critical error; alert Daniel immediately. The cohort tier was sold without inventory.
- Slack invite failure (rate limit, scope issue) → retry 3×; if persistent, log to Errors with severity `warning` and Slack alert; student can be manually invited later.
- Printful API failure → retry 3×; if persistent, queue in Airtable `Printful_Pending` table for manual fulfillment.
- Missing shipping address → graceful path: send address-request email, set `wall_poster_status: pending-address` on Course_Students; queue Printful order locally to fire when address arrives.

---

## Test cases

1. **Cohort buyer, active cohort with seats** → enrolled, calendar invites sent, poster shipping queued, Slack invite sent, tags applied. End-to-end test should land 4 calendar invites in inbox + Slack channel access.
2. **DWY buyer, active cohort** → all of above + CPA panel invite + concierge intake email + DWY queue row.
3. **Buyer when next cohort is scheduled but not yet enrolling** → added to waitlist, waitlist email sent, no calendar invites.
4. **Buyer triggers cohort 25-seat fill** → Slack alert "🔒 Cohort full" posted; cohort status auto-flips from `enrolling` to `closed-full` (handled in Cohorts table automation, not this workflow).
5. **Slack invite returns rate-limit error** → retry 3×, succeed on attempt 2, continue with rest of workflow.
6. **Printful order succeeds** → tracking number returned, written to Course_Students for student visibility.
7. **Buyer has no shipping address** → address-request email queued, Printful deferred, calendar invites still sent (independent stage).

---

## Volume

Cohort cap is 25 students per cohort, 2 cohorts per year. Steady state: ~50 cohort enrollments per year. Plus 5–10 DWY enrollments per year. Low volume; plenty of margin.

Launch week may compress 25 cohort enrollments into 72 hours.

---

## Companion workflows

- **Triggered by:** W23 Course Purchase Onboarding (cohort/dwy tiers)
- **Reads from:** Airtable Cohorts (find next active)
- **Writes to:** Course_Students (assignment), Cohorts (seat decrement), DWY_Intake_Queue (DWY only), IS (tags), Slack
- **Affects:** W27 Cohort Group Call Reminders (uses cohort_id, cohort-week tag)
- **External:** Slack admin API (workspace invites), Printful API (fulfillment)
