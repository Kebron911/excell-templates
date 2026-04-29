# Audit Dossier Template

**Format:** Folder structure + Excel index + 14 sub-tabs + this design spec
**Course module:** Module 5 (Lesson 5.2)
**Use case:** The complete audit-defense file. Built once per tax year. Examiner-ready.

> **If it's not in a folder a CPA can find in 60 seconds, the IRS doesn't care that you remember it.** The dossier is the folder. This template is the shape of the folder.

---

## Why an audit dossier (and not just "good books")

A clean Schedule E and a categorized workbook are necessary but not sufficient for examination. The dossier turns the workbook into an *evidence package* — every line on the return paired with the substantiation that supports it, organized in the order an examiner reads.

The dossier is built once per tax year. It snapshots the year. After filing, it's archived and never reopened unless an Information Document Request arrives.

Hosts who survive examinations cleanly almost universally have a dossier. Hosts who don't, don't.

---

## Folder structure (recommended)

The dossier lives in cloud storage (Dropbox, Google Drive, OneDrive — pick one, stay there). Top-level folder per tax year:

```
/audit-dossier-{{TAX_YEAR}}/
   00-index.xlsx                          ← master index, single source of truth
   01-return-and-supporting/
       schedule-e-as-filed.pdf            ← what was filed
       form-4562-depreciation.pdf
       form-8829-home-office.pdf          (if applicable)
       form-1099-nec-issued.pdf           (if applicable)
       1099-k-airbnb.pdf                  (incoming)
       1099-k-vrbo.pdf                    (incoming, if applicable)
       form-1098-mortgage.pdf
       property-tax-statement.pdf
   02-bookkeeping-snapshot/
       TAX-002-as-of-{{filing_date}}.xlsx
       TAX-004-as-of-{{filing_date}}.xlsx
       TAX-001-mileage-as-of-{{filing_date}}.xlsx
       reconciliation-summary.pdf
   03-receipts/
       Q1/
           [photographed receipts, named YYYY-MM-DD-vendor-amount.jpg]
       Q2/
       Q3/
       Q4/
   04-repairs-vs-improvements/
       repairs-line-14-summary.pdf
       improvements-capitalized-summary.pdf
       bar-test-notes/
           {{date}}-{{item}}-bar-test.pdf
   05-vehicle-mileage/
       mileage-log-final.xlsx
       trip-corroboration/                ← calendar entries, contractor invoices
   06-travel-meals-lodging/
       per-diem-trips-log.pdf
       trip-receipts/
           {{trip-date}}-{{destination}}/
   07-contractors-1099s/
       contractor-roster-with-w9s.xlsx
       w9-files/
       1099-nec-filed/
   08-cleaning-fees-reconciliation/
       airbnb-host-statement-q1.pdf
       airbnb-host-statement-q2.pdf
       airbnb-host-statement-q3.pdf
       airbnb-host-statement-q4.pdf
       cleaning-fee-reconciliation.xlsx
   09-depreciation-and-cost-seg/
       depreciation-schedule.xlsx
       cost-seg-study.pdf                 (if applicable)
       form-4562-line-by-line-tieout.pdf
       placed-in-service-log.xlsx
   10-home-office/
       form-8829-tieout.pdf
       square-footage-measurement.pdf
       photos-of-space/
   11-insurance/
       declarations-pages/
       umbrella-allocation-worksheet.xlsx
   12-entity-and-legal/
       formation-documents.pdf
       operating-agreement.pdf
       annual-resolutions.pdf
       legal-invoices/
   13-augusta-section-280a-g/
       fmv-worksheet.xlsx
       board-minutes/
       personal-use-calendar.xlsx
       comparable-screenshots/
   14-material-participation/
       time-log-final.xlsx
       correspondence-log.xlsx
       decision-log.xlsx
       reservation-log.xlsx
   99-correspondence/                     ← if anything triggers
       irs-notices/
       cpa-correspondence/
```

**14 numbered subfolders + receipts (03) + correspondence (99).** The numbers are deliberate. Examiners read in order; the dossier is in the order they read.

---

## The master index — `00-index.xlsx`

A single Excel file at the top of the dossier folder. Each row is a Schedule E line; each row points to the sub-folder and file(s) that substantiate that line.

### Index structure

```
═══════════════════════════════════════════════════════════════════════════
              AUDIT DOSSIER INDEX — TAX YEAR {{YEAR}}
═══════════════════════════════════════════════════════════════════════════

Schedule E line | Amount        | Substantiation file(s)              | Status
                |               |                                      |
3  Rents rcvd   | $94,200.00    | 01/1099-k-airbnb.pdf                 | ✓
                |               | 08/cleaning-fee-reconciliation.xlsx  | ✓
                |               |                                      |
5  Advertising  | $1,250.00     | 02/TAX-002 → Marketing tab           | ✓
                |               | 03/Q2/2026-05-14-photographer.pdf    | ✓
                |               |                                      |
6  Auto/travel  | $4,202.00     | 05/mileage-log-final.xlsx            | ✓
                |               | 05/trip-corroboration/               | ✓
                |               |                                      |
7  Cleaning &   | $11,400.00    | 02/TAX-002 → Cleaning tab            | ✓
   maintenance  |               | 07/contractor-roster-with-w9s.xlsx   | ✓
                |               | 07/1099-nec-filed/cleaner-XXX.pdf    | ✓
                |               |                                      |
8  Commissions  | $0.00         | n/a                                  | –
                |               |                                      |
9  Insurance    | $4,200.00     | 11/declarations-pages/               | ✓
                |               | 11/umbrella-allocation-worksheet.xlsx| ✓
                |               |                                      |
10 Legal/prof   | $3,400.00     | 12/legal-invoices/                   | ✓
                |               | 02/TAX-002 → Legal tab               | ✓
                |               |                                      |
11 Mgmt fees    | $0.00         | n/a                                  | –
                |               |                                      |
12 Mortgage int | $18,420.00    | 01/form-1098-mortgage.pdf            | ✓
                |               |                                      |
13 Other int    | $0.00         | n/a                                  | –
                |               |                                      |
14 Repairs      | $8,432.00     | 04/repairs-line-14-summary.pdf       | ✓
                |               | 04/bar-test-notes/                   | ✓
                |               | 03/Q1-Q4/ (matching receipts)        | ✓
                |               |                                      |
15 Supplies     | $1,840.00     | 02/TAX-002 → Supplies tab            | ✓
                |               | 03/Q1-Q4/                            | ✓
                |               |                                      |
16 Taxes        | $4,820.00     | 01/property-tax-statement.pdf        | ✓
                |               |                                      |
17 Utilities    | $6,240.00     | 02/TAX-002 → Utilities tab           | ✓
                |               |                                      |
18 Depreciation | $24,840.00    | 01/form-4562-depreciation.pdf        | ✓
                |               | 09/depreciation-schedule.xlsx        | ✓
                |               | 09/cost-seg-study.pdf                | ✓
                |               |                                      |
19 Other        | $5,140.00     | 02/TAX-002 → Other tab               | ✓
                |               | (sub-itemized below)                 |
                |               |                                      |
   19a Platform fees   $2,826   | 03/airbnb-host-statement-Q1-Q4       | ✓
   19b Software        $1,134   | 03/Q1-Q4/                            | ✓
   19c Education       $497     | 03/Q2/2026-05-XX-course-receipt.pdf  | ✓
   19d Per-diem        $283     | 06/per-diem-trips-log.pdf            | ✓
   19e Bank fees       $260     | 03/Q1-Q4/                            | ✓
   19f Misc            $140     | 03/Q1-Q4/                            | ✓

═══════════════════════════════════════════════════════════════════════════
SPECIAL FILINGS / ELECTIONS
═══════════════════════════════════════════════════════════════════════════

Item                         | Amount        | File                       | Status
§168(k) bonus depreciation   | $67,200.00    | 09/form-4562-line-by-line  | ✓
§280A(g) Augusta exclusion   | $11,200.00    | 13/                        | ✓
§469(c)(7) STR loophole      | (treatment)   | 14/                        | ✓
§280A(d) personal use        | (none > thr.) | 13/personal-use-calendar   | ✓
1099-NEC issued (3)          | $14,790.00    | 07/1099-nec-filed/         | ✓

═══════════════════════════════════════════════════════════════════════════
DOSSIER COMPLETENESS
═══════════════════════════════════════════════════════════════════════════

Total Schedule E lines        : 17
Lines with substantiation     : 12 (lines 8, 11, 13 are zero — not flagged)
Lines incomplete              : 0
Special filings substantiated : 5 of 5

Tabletop Drill score          : 14 / 15
Year-End Health Check score   : 27 / 30
Last reviewed                 : {{date}}
Reviewer                      : {{host name}}

═══════════════════════════════════════════════════════════════════════════
```

The index is the document the host hands a CPA — or an examiner — first. Everything else is just navigation.

---

## Status flags (column 4 of the index)

| Flag | Meaning |
|---|---|
| ✓ | Fully substantiated. Files exist, are organized, and tie back to the line amount. |
| ◐ | Partially substantiated. File exists but isn't complete. *Action needed before filing.* |
| ✗ | No substantiation. *Either drop the deduction or build the substantiation now.* |
| – | Not applicable (zero on this line, or no claim). |
| ? | Substantiation exists but the position is uncertain. *Flag for CPA review.* |

The dossier ships with **zero ✗ flags.** A flagged item means either build the file or drop the deduction; an audit dossier with ✗ flags is a dossier that loses on examination.

---

## Building the dossier — the workflow

### Phase 1 — Year-round capture *(passive, ongoing)*

The capture system from Module 2 is already feeding the dossier. Receipts go into `/03-receipts/`. Mileage flows to `/05-vehicle-mileage/`. The contractors file lives in `/07-contractors-1099s/` and is updated each time a new contractor is engaged.

If Module 2 is running cleanly, the dossier is mostly self-building. The host's job each year is to organize the harvested files, not to assemble them from scratch.

### Phase 2 — Year-end snapshot *(once, December 28)*

After the Year-End Health Check (Bonus — `year-end-health-check.md`), snapshot the workbooks:

```
TAX-002-as-of-{{filing_date}}.xlsx       ← copy current TAX-002 here
TAX-004-as-of-{{filing_date}}.xlsx       ← copy current TAX-004 here
TAX-001-mileage-as-of-{{filing_date}}.xlsx
mileage-log-final.xlsx                   ← lock the mileage log; no further entries
```

These snapshots freeze the books at filing. They are *not* the live workbooks — they are the version that tied to the return.

### Phase 3 — Return alignment *(after CPA hands back the return)*

Once the CPA delivers the draft return:

1. Save the return PDF to `/01-return-and-supporting/schedule-e-as-filed.pdf`.
2. For each Schedule E line, verify the dossier index shows the matching amount.
3. Reconcile any discrepancies *before signing the return.* (Lesson 6.4 covers the 6-line review.)
4. Lock the dossier folder. Subsequent edits go in `/99-correspondence/` only.

### Phase 4 — Archive *(after filing)*

Compress the dossier folder. Save as `audit-dossier-{{YEAR}}.zip`. Two backup locations:

- Cloud copy (the working location, e.g., Dropbox)
- Local copy (encrypted external drive)

Retention: **7 years from filing date** under §6501(e) — three years standard, six years if substantial omission, seven gives margin. Some hosts retain forever; the marginal storage cost is negligible.

### Phase 5 — Reopen *(only if triggered)*

The dossier is reopened only if an IRS notice arrives. At that point:

1. Save the notice to `/99-correspondence/irs-notices/`.
2. Engage the CPA who prepared the return (or, if separate, an audit-specialist CPA from the Directory).
3. Use the index to locate substantiation for each line item the IDR references.
4. Respond within the 30-day window with the dossier files cited by name and folder.

---

## Naming conventions

Consistency makes the dossier searchable:

- Receipts: `YYYY-MM-DD-vendor-amount.jpg` *(e.g., `2026-05-14-home-depot-1140.18.jpg`)*
- Workbook snapshots: `TAX-XXX-as-of-YYYY-MM-DD.xlsx`
- BAR-test notes: `YYYY-MM-DD-item-bar-test.pdf` *(e.g., `2026-07-22-deck-rebuild-bar-test.pdf`)*
- Contractor W-9s: `w9-{{lastname-firstname}}-{{tax-year-collected}}.pdf`
- 1099-NEC filed: `1099-nec-{{lastname-firstname}}-{{tax-year}}.pdf`
- Trip folders: `YYYY-MM-DD-destination/`

The receipt naming convention enables the workbook to link to the file by computing the expected filename from the transaction's date + vendor + amount.

---

## Sample dossier reviews — what each looks like at the end

### Best-case dossier *(score 27+ on Year-End Health Check)*

- All 14 sub-folders populated
- Index shows ✓ for every line with a non-zero amount
- Tabletop drill score 14+ / 15
- Reconciliation summary ties every Schedule E line to a substantiation file
- BAR-test notes exist for every repair line item over $1,000
- All §274(d) trips have receipts AND log entries (not just one or the other)
- Augusta documentation pack is complete (if §280A(g) elected)
- Material-participation logs are contemporaneous

### Workable dossier *(score 22–26)*

- All sub-folders populated
- 1–3 ◐ flags in the index — substantiation incomplete on a few items
- Tabletop drill score 12 / 15
- Most §274(d) trips substantiated; a handful reconstructed from corroborating evidence
- Action plan written for each ◐ to convert to ✓ before next filing

### Triage dossier *(score below 22)*

- Sub-folders partially populated; gaps obvious
- Multiple ✗ flags requiring drop-the-deduction decisions or last-minute substantiation builds
- Tabletop drill score below 10
- Reconstructed mileage and meals — fragile on examination
- Decision required: amend or accept exposure

A triage dossier is a starting point, not a defense. Hosts in this state should not file without CPA review and should plan a year-2 system rebuild.

---

## What the examiner sees

If an IDR arrives, the host's response is essentially:

> *"Attached is the dossier index for tax year {{YEAR}} (file 00-index.xlsx). The IDR references lines 14, 6, and the §469(c)(7) treatment. Substantiation for those items is in folders 04, 05, and 14 respectively. Let me know if any specific files are needed in alternate format."*

Examiners who receive organized dossiers tend to close examinations faster. Examiners who receive shoeboxes tend to expand the scope.

The dossier is, in part, a behavioral signal: this taxpayer kept books, knew what they were doing, and is responsive. Examiners read the signal.

---

## What this template is not

- Not a substitute for a CPA's review of a specific return
- Not a guarantee against audit *(the IRS selects returns by methods including DIF score, not just by sloppiness)*
- Not legal advice on contested positions
- Not a static document — the structure evolves as IRS examination patterns evolve

---

## Course shipment

```
/03-templates/audit-dossier/
   folder-structure-template.zip      ← empty folder shell, ready to populate
   00-index-template.xlsx             ← the index, pre-built
   bar-test-note-template.docx
   reconciliation-summary-template.docx
   naming-conventions-cheatsheet.pdf
   setup-video.mp4                    ← 12-min walkthrough (Module 5.2)
```

The setup video shows the host populating an empty dossier folder for the first time, end-to-end. Most students complete the initial build in a single 90-minute session and then maintain it incrementally.

---

*Last reviewed: 2026-04-28. Audit posture varies by examiner, region, and fact pattern; the dossier is built to a defensible standard but specific examinations may require additional or different substantiation. General information, not legal or tax advice.*
