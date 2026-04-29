# W28 — Refund Reply Intake

**Priority:** P1

**Family:** L — Course

**Summary:** The post-purchase onboarding sequence (Day 11, Day 14) tells students they can refund by replying with the word "refund." This workflow listens for those replies, validates the student is within the 14-day refund window, fires the refund via Stripe/Gumroad, and updates Airtable + IS state.

The promise: refund processed within 2 business hours, no survey, no negotiation.

---

## Trigger

Inbound email at `hello@thestrledger.com`, filtered by:

1. Sender email matches a Course_Students row
2. Body or subject contains the word "refund" (case-insensitive)

W12 Customer Support Triage already runs on this inbox; W28 is a sub-routing path that fires before W12 takes over for non-refund emails.

The two workflows coordinate via a precedence rule: if the email matches the refund pattern AND the sender is a course buyer within 14 days, W28 handles it; otherwise W12 takes over.

---

## Node-by-node configuration

### Node 1 — IMAP / Email Trigger

Polls `hello@thestrledger.com` every 2 minutes.

### Node 2 — Filter: course buyer + refund keyword

```js
const email = $input.first().json;
const fromEmail = (email.from || '').toLowerCase();
const text = ((email.subject || '') + ' ' + (email.text || '')).toLowerCase();

if (!text.match(/\brefund\b/)) {
  return [];  // not a refund request, hand off to W12
}

return [{ json: { from_email: fromEmail, subject: email.subject, body: email.text, message_id: email.messageId } }];
```

### Node 3 — Airtable: Lookup Course_Students

Search by email. If no match, this isn't a course buyer — return early; W12 handles non-course refund requests.

### Node 4 — Function: Check 14-day window

```js
const student = $input.first().json;
const purchaseDate = new Date(student.purchase_date);
const now = new Date();
const daysSincePurchase = Math.floor((now - purchaseDate) / (1000 * 60 * 60 * 24));

if (daysSincePurchase > 14) {
  return [{ json: { ...student, in_window: false, days_since: daysSincePurchase } }];
}

if (student.tier === 'dwy' && student.dwy_first_session_held === true) {
  return [{ json: { ...student, in_window: false, reason: 'dwy_first_session_held' } }];
}

return [{ json: { ...student, in_window: true, days_since: daysSincePurchase } }];
```

DWY tier: refundable until the first 1:1 session is held; non-refundable thereafter.

### Node 5 — Branch: in window or out

- **In window** → continue with refund processing
- **Out of window** → reply with template "Your refund window closed on <date>. Hit reply if you'd like to discuss further." + alert Daniel via Slack for human review

### Node 6 — Resolve order_id and platform

Look up the original Order in Airtable Orders table by `email + earliest course-related order`. Returns `order_id`, `platform` (stripe/gumroad), `gross_amount`.

### Node 7 — Branch: Stripe vs Gumroad

#### Stripe branch

```
POST https://api.stripe.com/v1/refunds
Body:
  payment_intent: <stripe_payment_intent_id>
  reason: requested_by_customer
```

#### Gumroad branch

```
POST https://api.gumroad.com/v2/sales/<sale_id>/refund
```

### Node 8 — Update Airtable Course_Students

```
status                      = 'refunded'
refunded_at                 = now
refund_amount               = gross_amount
```

### Node 9 — Update Airtable Orders

Trigger W07 Refund Handler with the refund event so the standard refund-update path runs. This keeps refund handling consistent with non-course refunds.

### Node 10 — IS API: Tag and remove from sequences

```
POST {{ IS_API_BASE_URL }}/api/contacts/tags
Body:
  email: $email
  add: ['course:refunded', 'course:refunded:' + new Date().toISOString().substring(0,10)]
  remove: ['course:purchased', 'course:onboarding-day-1', 'course:onboarding-day-3', etc.]
```

Removing the onboarding tags stops the sequence from continuing to fire emails to a refunded customer.

### Node 11 — IS API: Revoke LMS access

```
POST {{ IS_API_BASE_URL }}/api/courses/revoke
Body:
  contact_email: $email
  course_id: <derived from tier>
```

Revoke is graceful — student keeps account but loses course access.

### Node 12 — Send confirmation email

Auto-reply within minutes of the refund processing:

```
To: $student_email
Subject: Refund processed
Body: |
  Confirmed. Your $X has been refunded to your original payment method.
  Most cards reflect the credit within 3-5 business days.

  No survey, no negotiation — that was the deal.

  The book is still yours. The community door stays open if you want it.

  — The STR Ledger
```

### Node 13 — Slack notification

Post to `#str-platform-wins` (yes, wins — refund-on-promise is brand-positive):

```
↩️ Refund processed within window
Student: <email>
Tier: <tier>
Days since purchase: <days_since>
Amount: $<amount>
```

### Node 14 — Out-of-window path: human review

For requests outside the window or DWY post-first-session:

```
Reply: "Your refund window closed on <date>. We'd still like to help —
        hit reply with what's happening and Daniel will respond within
        one business day."

Alert Slack: #str-platform-alerts (out-of-window refund request needs human eyes)
```

### Node 15 — Error branch

Standard error pattern. Refund failures are P0 — alert loudly.

---

## Outputs

- Stripe/Gumroad refund processed
- Airtable Course_Students.status = refunded
- IS LMS access revoked, tags swapped
- Confirmation email sent
- Slack notification

---

## Dependencies

- IMAP or Google Workspace integration on `hello@thestrledger.com`
- Stripe API key with refund capability
- Gumroad API key with refund capability
- W12 Customer Support Triage runs on the same inbox (precedence ordering)
- W07 Refund Handler exists for downstream consistency

---

## Error handling

- Stripe/Gumroad refund API fails → critical; do NOT mark as refunded in Airtable; retry 3×; if still failing, P0 Slack alert and human takes over within 2 business hours per the policy
- Multiple matches in Course_Students (rare but possible if email shared) → flag for human review
- Reply doesn't actually want refund (false-positive on keyword) → human review path; no auto-action

---

## Test cases

1. **Self-Study buyer at day 7 replies "refund"** → refund processed, confirmation email sent, all tags swapped, LMS revoked. End-to-end in <5 minutes.
2. **Cohort buyer at day 16** → out-of-window reply sent, Slack alert posted for human review.
3. **DWY buyer who has had first 1:1** → out-of-window reply, no auto-refund.
4. **Non-course buyer email contains "refund" mention** (e.g., asking about how refunds work) → handed to W12, not processed by W28.
5. **Stripe API down** → retries 3×, fails, P0 alert. Human handles within 2 hours per policy.
6. **Email from address that's not in Course_Students** → handed to W12 (could be a new buyer asking pre-purchase question).

---

## Volume

Expected refund rate: <5% of course purchases. At ~50 enrollments per month: 1-3 refunds per month. Trivial volume; the workflow's value is in the speed and reliability, not throughput.

---

## Companion workflows

- **Triggered by:** Inbound email at `hello@thestrledger.com`
- **Reads from:** Airtable Course_Students, Airtable Orders
- **Writes to:** Course_Students (status), Orders (via W07), IS (revoke + tags), Stripe/Gumroad (refund)
- **Coordinates with:** W07 Refund Handler (downstream consistency), W12 Customer Support Triage (precedence)
