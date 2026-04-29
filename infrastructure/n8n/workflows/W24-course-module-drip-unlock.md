# W24 — Course Module Drip Unlock

**Priority:** P0 — drives the post-purchase 14-day unlock cadence

**Family:** L — Course

**Summary:** Daily cron that walks the Course_Students table, identifies students whose next module is due to unlock based on their stored `module_unlock_schedule`, and grants module access via the Influencersoft API. Idempotent — re-runs safely if executions are missed.

---

## Trigger

Cron daily at 06:00 ET.

---

## Why daily and not real-time

Module unlocks are not time-sensitive to the minute. A student whose Module 2 unlocks "two days after purchase" doesn't care whether it lands at 06:00 or 14:00. Daily cron is simpler than per-student scheduled unlocks, easier to debug, and idempotent.

The trade-off: if a student purchases at 23:00 on Day 0, their Module 0 access is granted by W23 immediately (welcome lesson is available). Module 1 unlock fires on the cron run two days later — typically 31 hours after purchase rather than exactly 48. Acceptable.

---

## Inputs

None — reads from Airtable Course_Students table.

---

## Node-by-node configuration

### Node 1 — Cron (06:00 ET daily)

Standard cron node. Schedule: `0 6 * * *` in `America/New_York`.

### Node 2 — Airtable: Get active students

Query Course_Students table:

```
Filter: status = 'active' AND graduation_date IS NULL
Fields: email, tier, module_unlock_schedule, current_module, is_student_id
```

Returns array of student rows.

### Node 3 — Function: Determine unlocks for today

```js
const students = $input.all();
const today = new Date();
const moduleOrder = ['module-0', 'module-1', 'module-2', 'module-3',
                     'module-4', 'module-5', 'module-6', 'module-7'];

const unlocksToProcess = [];

for (const student of students) {
  const schedule = JSON.parse(student.json.module_unlock_schedule || '{}');
  const currentModule = student.json.current_module || 'module-0';
  const currentIndex = moduleOrder.indexOf(currentModule);

  // Find the highest module the student should have access to today
  let highestUnlocked = currentModule;
  for (let i = currentIndex + 1; i < moduleOrder.length; i++) {
    const moduleKey = moduleOrder[i];
    const unlockDate = new Date(schedule[moduleKey] || '9999-01-01');
    if (unlockDate <= today) {
      highestUnlocked = moduleKey;
    } else {
      break;
    }
  }

  // If the highest-unlocked-today is ahead of current_module, schedule unlock
  if (highestUnlocked !== currentModule) {
    unlocksToProcess.push({
      airtable_record_id: student.json.id,
      email: student.json.email,
      is_student_id: student.json.is_student_id,
      from_module: currentModule,
      to_module: highestUnlocked
    });
  }
}

return unlocksToProcess.map(u => ({ json: u }));
```

### Node 4 — Loop: For each unlock to process

n8n's "Split In Batches" node, batch size 1, to process each unlock individually with full error isolation.

### Node 5 — IS API: Unlock the module(s)

For each pending unlock, fire one API call per module from `(from_module + 1)` through `to_module`:

```
POST {{ IS_API_BASE_URL }}/api/courses/lessons/unlock
Body: {
  contact_email: $json.email,
  course_id: <derived from tier>,
  module_id: <module being unlocked>
}
```

This catches the case where a student's last n8n run was missed (e.g., 4-day-old laptop, n8n outage) and they're due to unlock 2 modules at once. The catch-up loop unlocks each in sequence.

### Node 6 — IS API: Apply milestone tag

Each unlock fires a tag application:

```
POST {{ IS_API_BASE_URL }}/api/contacts/tags
Body: {
  email: $json.email,
  tags: [`course:milestone:${module_unlocked}-unlocked`]
}
```

The milestone tags drive the IS-side onboarding emails (e.g., the Module 3 unlock fires "Module 3 is open" email per the post-purchase sequence).

### Node 7 — Airtable: Update current_module

Update the Course_Students row:

```
current_module = <highest module unlocked>
last_unlock_at = now
```

### Node 8 — Daily Summary Slack Notification

After all unlocks processed, post a single summary:

```
🔓 Module Drip Unlock — daily summary
Total unlocks processed: 12
By module:
  module-1 (4 students)
  module-2 (3 students)
  module-3 (5 students)
```

If 0 unlocks: post nothing (avoid Slack noise on slow days).

### Node 9 — Error branch

Standard error pattern. Per-student failures don't stop the loop — they're logged and the next student processes.

---

## Outputs

- IS module access granted for due-to-unlock students
- IS milestone tags applied (drives next email in onboarding sequence)
- Airtable Course_Students.current_module updated
- (Optional) Slack daily summary

---

## Dependencies

- W23 has populated Course_Students rows with valid `module_unlock_schedule`
- IS API endpoints for lesson unlock and tag application accessible
- Course_Students schema includes `current_module`, `is_student_id`, `last_unlock_at` fields

---

## Error handling

- Per-student error isolation — one student's IS API failure doesn't affect others
- Retry per IS call: 3× with exponential backoff (handled at IS API node level)
- If IS API persistently down → write all pending unlocks to Errors table with status `pending-retry`; manual rerun option available
- Schedule corruption (malformed JSON in `module_unlock_schedule`) → log to Errors, skip that student, continue processing

---

## Idempotency

The workflow is idempotent by design:

- Module unlocks via IS are no-ops if already unlocked (IS API returns 200 even on duplicate)
- Tag applications via IS are no-ops if tag already present
- Airtable update sets `current_module` to the highest-unlocked module — re-running the cron the same day produces the same result

This means:

- If the cron is missed for 3 days, the next run catches up cleanly
- Manual reruns during testing don't double-trigger anything
- A student who upgrades from Self-Study to Cohort (W23 updates the schedule) cleanly picks up the new schedule on the next cron

---

## Test cases

1. **Single new student, day-of-purchase** → no unlock processed (Module 0 already granted by W23). current_module stays `module-0`.
2. **Student at day 2 of enrollment** → Module 1 unlocks. Tag `course:milestone:module-1-unlocked` applied. current_module → `module-1`.
3. **Student at day 14, last cron at day 7** (caught-up scenario) → Module 2 and Module 3 both unlock in sequence. Two tags applied. current_module → `module-3`.
4. **Student already at module-7** → no unlock processed; logged as graduated candidate (graduation logic lives in another workflow).
5. **IS API returns 5xx on one student's unlock** → retry 3×, fail to Errors, continue with remaining students. Failed student is retried on next cron.
6. **Malformed module_unlock_schedule JSON** → student skipped with Errors row; next cron retries (still skipped until fixed); manual fix updates the row.

---

## Volume and cost

Steady state (after launch): ~100 active students, ~10 module unlocks per day.
Launch week: 100+ unlocks per day (everyone hits Module 1 unlock day at roughly the same time).

Per-execution: ~30 IS API calls. n8n cost negligible.

---

## Companion workflows

- **Reads from:** Airtable Course_Students (populated by W23)
- **Writes to:** IS LMS state, Airtable Course_Students.current_module
- **Triggers:** IS-side onboarding sequence (via milestone tag application)
- **Companion:** W29 NPS Collection reads `current_module` to determine readiness for NPS request
