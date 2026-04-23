# W17 — Weekly Backup

**Priority:** P0

**Family:** K — Resilience

**Summary:** Every Sunday at 02:00 ET, export full Airtable base + IS products/subscribers to CSVs and upload to Google Drive. Retain backups per rotation policy.

---

## Trigger

Cron: `0 2 * * 0` (Sunday 02:00 ET — adjust for n8n's timezone setting)

## Node-by-node configuration

### Node 1 — Cron

Schedule: weekly, Sunday 02:00 America/New_York

### Node 2 — Function: Generate backup folder name

```js
const now = new Date();
const dateStr = now.toISOString().slice(0, 10);  // YYYY-MM-DD
const folderName = `backup-${dateStr}`;

return {
  folder_name: folderName,
  date: dateStr,
  timestamp: now.toISOString()
};
```

### Node 3 — Airtable: Export each table as CSV

Loop through each table in the `STR Platform — Master` base:
- Products
- Customers
- Orders
- Content
- Metrics
- Errors
- Partners (Phase 2)
- Outreach Queue (Phase 2)

For each table:
1. Fetch all records (paginated, 100 per page)
2. Flatten linked record fields to comma-separated IDs
3. Flatten attachment fields to comma-separated URLs
4. Convert to CSV string

**Airtable API consideration:** 5 req/sec rate limit per base. At 100 records per page with 8 tables and ~10K total records, this takes ~20 requests with delays = ~5 seconds. Acceptable.

### Node 4 — IS API: Export subscribers to CSV

```
GET /api/subscribers?export=csv
```

Save as `is-subscribers.csv`.

### Node 5 — IS API: Export products to CSV

Save as `is-products.csv`.

### Node 6 — IS API: Export last 30 days of orders to CSV

IS-native order log, independent of Airtable Orders table. Saves for cross-reconciliation.

Save as `is-orders-last-30-days.csv`.

### Node 7 — Function: Create ZIP archive

Bundle all CSVs + a `MANIFEST.txt` with:
- Backup date
- Files included
- File sizes
- Row counts per file
- Airtable base schema snapshot (export schema via API too)

### Node 8 — Google Drive: Upload

1. Create folder `Backups/str-platform/<folder_name>/` (create parent dirs if missing)
2. Upload ZIP file
3. Also upload individual CSVs separately (for easy inspection without unzipping)

### Node 9 — Rotation: delete old backups

Retention policy:
- **Last 30 days:** keep all 4 weekly backups (actually all 4 since weekly)
- **Older than 30 days:** keep 1 per month for 12 months
- **Older than 12 months:** delete

```js
// Logic:
// 1. List all folders in Backups/str-platform/
// 2. For each folder, parse date
// 3. If < 30 days old → keep
// 4. If < 12 months old → keep only if first backup of that month
// 5. If >= 12 months old → delete
```

Implement as loop iterating folders, calling Google Drive delete API for rotation victims.

### Node 10 — Verification: open one random backup

Monthly (1st Sunday of month), after backup completes:
1. Pick the newly-created backup folder
2. Download the Products CSV
3. Verify row count > 0
4. Verify column headers match expected schema
5. Write result to Airtable Metrics table as `backup_verification_<date>` with pass/fail

Weekly backups skip verification — monthly drills catch integrity issues.

### Node 11 — Slack confirmation

Message format:
```
✅ Weekly backup complete
Date: 2026-04-22
Tables exported: 8
IS exports: 3 (subscribers, products, orders)
Total size: 12.4 MB
Location: drive.google.com/<folder-url>
Retention: 30 days + 12 monthly snapshots
Next backup: 2026-04-29 02:00
```

### Error branch

**Backup failures are P0 — alert loud.**

1. Write to Errors
2. Slack to `#str-platform-alerts` with **@channel** mention
3. Email Daniel directly
4. Retry automatically after 1 hour
5. If second retry fails, escalate to SMS (Twilio)

## Inputs

- Airtable base data
- IS API exports
- Environment: `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `IS_API_KEY`, `GOOGLE_DRIVE_CREDENTIALS`

## Outputs

- Google Drive folder `Backups/str-platform/<date>/` with:
  - Individual CSVs per Airtable table
  - IS exports
  - ZIP archive of all above
  - MANIFEST.txt

## Dependencies

- Google Drive OAuth configured in n8n
- Backup folder structure exists in Drive
- Sufficient Google Workspace storage quota (typically 30 GB free, expand if needed)

## Edge cases

| Case | Handling |
|---|---|
| Airtable API rate limit | Built-in exponential backoff; fallback to 10 req/sec theoretical max |
| IS API down | Log partial backup: Airtable CSVs saved, IS portion flagged as missing, Slack warning |
| Google Drive quota full | Fail loudly; Daniel manual intervention to upgrade storage |
| Large tables (>50K rows) exceed memory | Stream to disk incrementally, don't load all rows in memory |
| Schema drift (new field added, old removed) | Verification step catches column mismatch on next monthly check |
| Concurrent backup (unlikely but possible) | Skip if `<date>` folder already exists; log warning |
| Backup succeeds but Slack fails | Backup still valid; log Slack failure to Errors, continue |

## Test cases

1. **Nominal run** — all 8 Airtable tables export, all 3 IS exports succeed, ZIP created, uploaded, Slack confirmed
2. **Airtable rate limit hit mid-export** — retries kick in, eventually completes
3. **IS API transient failure** — Airtable portion succeeds, IS portion flagged; still logged as "partial backup"
4. **Google Drive quota full** — fails loudly, SMS alert fires, backup not created
5. **Monthly verification pass** — first Sunday of month, test restore opens CSV with expected row count
6. **Rotation test** — simulate 14-month-old folder, verify it's deleted; simulate 2-month-old folder, verify it survives

## Monitoring

| Metric | Target | Alert |
|---|---|---|
| Backup success rate | 100% | Any failure = P0 |
| Backup size trend | Growing ~5% MoM is normal | Shrinking = possible data loss or Airtable issue |
| Monthly verification pass | 100% | Any fail = investigate before trusting backups |
| Drive storage used | < 80% of quota | > 80% = plan storage upgrade |

## Deployment

1. Create Google Drive folder structure `Backups/str-platform/`
2. Configure Google Drive OAuth in n8n (use a dedicated service Gmail account, not personal Daniel account — isolation)
3. Create W17 workflow with all nodes
4. **Test manually first** — trigger once, verify all exports succeed and files appear in Drive
5. Verify ZIP extracts cleanly on your desktop
6. Enable cron schedule
7. First monthly verification: ensure the 1st-Sunday logic fires correctly
8. Set up monitoring alerts in Slack
9. Export workflow JSON, commit

## Why this is P0

Everything else can be rebuilt from docs in this repo. Customer data, order history, email list, and product sales attribution **cannot be rebuilt** from anywhere but the live tools + backups.

If the Airtable base corrupts or IS goes down simultaneously (rare, but possible), backups are the only recovery path. One missed weekly backup = up to 14 days of business history at risk.

This is the first workflow to build, before any workflow that writes data.

## Iteration log

- `2026-04-22` — Initial spec. Unimplemented.
