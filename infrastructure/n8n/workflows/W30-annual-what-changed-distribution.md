# W30 — Annual "What Changed" Distribution

**Priority:** P1

**Family:** L — Course

**Summary:** Annual cron that fires January 20 each year. Emails every enrolled course student with a link to the new "What Changed" update video, and posts the first 5 minutes (rates section) as a free YouTube video for the public funnel. Honors the lifetime-updates promise the course was sold on.

---

## Trigger

Cron annually: January 20, 09:00 ET. (`0 9 20 1 *`)

The 20th is chosen because IRS releases standard mileage rate in late December and per-diem rates effective October 1; by January 20 every rate is confirmed and the video has been recorded.

---

## Node-by-node configuration

### Node 1 — Annual Cron January 20

`0 9 20 1 *`

### Node 2 — Get current year's update record

Query Airtable `Course_Annual_Updates` for the current tax year:

```
year = <current year>
status = 'ready-to-send'
```

The record contains:
- `video_url` — Vimeo link or LMS lesson link
- `youtube_public_url` — first-5-minutes free clip
- `action_list_pdf_url` — companion downloadable
- `summary_paragraph` — short paragraph of headline rate changes

If status is not 'ready-to-send' (i.e., Daniel hasn't finished recording/uploading), the workflow pauses and posts an alert to Slack instead of sending. This is a fail-safe.

### Node 3 — Get all enrolled course students

Query Course_Students:

```
status IN ('active', 'graduated')   // both still get the update
graduation_date IS NULL OR graduation_date >= <2 years ago>
```

Limit to the last 2 years of students. Hosts who graduated more than 2 years ago likely have a different operating context and don't need the email; they can find the video in their LMS if interested.

### Node 4 — Send announcement email per student

```
POST {{ IS_API_BASE_URL }}/api/email/send
Body:
  to: $email
  subject: "What Changed in <YEAR> — your annual update is live"
  body: <template with video link, action list link, summary paragraph>
```

The template is pulled from Airtable `Email_Templates` keyed on `course-annual-update-<year>` so it can be Daniel-edited each year without n8n changes.

### Node 5 — Update Course_Annual_Updates record

```
sent_at = now
sent_count = <number of recipients>
status = 'sent'
```

### Node 6 — IS API: Apply tag

For each student:

```
POST {{ IS_API_BASE_URL }}/api/contacts/tags
Body:
  email: $email
  tags: ['course:annual-update-' + <year> + '-sent']
```

The tag drives a 30-day follow-up that detects students who clicked the video link vs. didn't open the email. Used for engagement analysis.

### Node 7 — Public YouTube post (semi-automated)

YouTube doesn't have a clean API for one-shot video uploads from n8n in our setup. The workflow instead:

1. Drops a Slack message in `#str-platform-wins` with a checklist:
   - "Upload the first 5 minutes to YouTube under the 'Annual Updates' playlist"
   - "Set the description to point at thestrledger.com/operator-course"
   - "Schedule for tomorrow 6 PM ET"

This semi-automation is acceptable because the YouTube clip is once a year — fully automating the upload + scheduling adds n8n complexity for marginal value.

### Node 8 — Pinterest pin queue

Trigger a webhook to W16 (Blog Post Promotion Cascade) with the new content:

```
POST https://n8n.thestrledger.com/webhook/blog-post-published
Body:
  content_type: 'annual-update-video'
  url: <youtube_public_url>
  title: 'What Changed in <YEAR> — STR Tax Update'
```

W16 generates 5 pin variants and queues them for Daniel's review.

### Node 9 — Slack ops summary

```
📅 Annual What Changed distribution — <YEAR>
Recipients: <N> active + <M> graduated students
Update record: <Airtable link>
YouTube checklist posted in #str-platform-wins.
Pinterest pins queued via W16.
```

### Node 10 — Error branch

Standard pattern. The annual workflow's failure mode is "we missed the deadline" — alert loudly so Daniel can manually distribute.

---

## Outputs

- Announcement email sent to all current and recent course students
- IS tag applied for engagement tracking
- YouTube upload checklist posted to Slack
- Pinterest pins queued via W16
- Course_Annual_Updates record marked sent

---

## Dependencies

- Course_Annual_Updates table with the year's record marked 'ready-to-send'
- Email template populated by Daniel before January 20
- W16 Blog Post Promotion Cascade exists for pin generation
- The video is recorded, edited, and uploaded to LMS by January 19

---

## Pre-flight checklist (manual, January 15)

Before the cron fires, Daniel verifies:

- [ ] Update video recorded and uploaded to LMS
- [ ] Course_Annual_Updates record created with all URLs and status='ready-to-send'
- [ ] Email template `course-annual-update-<year>` populated
- [ ] First 5 minutes exported as standalone video file ready for YouTube manual upload
- [ ] Action-list PDF generated and uploaded to course bonus folder

If any item is missing on January 20, the workflow's Node 2 catches it and pauses; Slack alert prompts Daniel to complete the prep.

---

## Test cases

1. **Happy path: Course_Annual_Updates ready, video URL valid, ~80 students** → emails delivered, tag applied, YouTube checklist posted, Pinterest queue triggered.
2. **Course_Annual_Updates not ready (status != 'ready-to-send')** → workflow pauses, Slack alert: "Annual update not ready — manual intervention required."
3. **Email template missing** → workflow falls back to a simple bare-bones template with just the video URL; logs warning.
4. **Many students (200+)** → workflow batches into 50-recipient sends with a small delay between batches to avoid IS rate limits.

---

## Volume

Once a year. ~50-200 recipients. Trivial.

---

## Companion workflows

- **Triggered by:** Annual cron (January 20)
- **Reads from:** Course_Annual_Updates (year's record), Course_Students (recipients), Email_Templates
- **Writes to:** Course_Annual_Updates (sent state), IS (emails + tags)
- **Triggers:** W16 Blog Post Promotion Cascade (Pinterest pins)
- **Manual handoff:** YouTube upload checklist for Daniel
