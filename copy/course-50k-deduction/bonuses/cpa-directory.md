# Bonus B12 — The STR-Aware CPA Directory

**Format:** PDF directory + submission form + this curation spec
**Course module:** Module 6 (paired with the CPA Interview Scorecard)
**Use case:** A vetted shortlist of STR-knowledgeable CPAs hosts can interview, refreshed twice a year

> **The single most-asked question in any STR community is "who's your CPA?"**
>
> Most hosts settle for a generalist preparer because they don't know how to find a specialist. This directory is the shortlist — vetted, scored, refreshed, and honest about pricing and capacity.

---

## What this directory is

A curated list of ~20 STR-aware CPAs and EAs serving U.S. STR hosts. Each listing includes:

- Firm name, location, primary states served
- Pricing model and ballpark
- STR-specific experience signals
- Capacity status (accepting new clients / waitlist / closed)
- Score on the same 12 questions the CPA Interview Scorecard uses
- Contact path

The directory is a *shortlist*, not a marketplace. Inclusion is editorial, not paid. The course earns trust by saying "we asked these 12 questions; here are the answers" — not by collecting referral fees.

---

## What this directory is not

- **Not pay-to-play.** No CPA pays to be listed. The brand value collapses the moment that changes.
- **Not exhaustive.** The directory aims for ~20 listings, not 200. Coverage of major STR markets matters more than coverage of every CPA who ever filed a Schedule E.
- **Not a hiring decision substitute.** Listed CPAs still need to be interviewed by the host using the 12-question scorecard. The directory means "worth interviewing," not "hire blindly."
- **Not a regulatory endorsement.** State licensing varies; the course confirms active licensure at intake but cannot guarantee status long-term.

---

## Listing schema

Each directory entry uses the same fields, in the same order, every time. Consistency is what makes the directory scannable.

```yaml
firm_name: "[Legal name]"
short_name: "[Brand name if different]"
principal: "[Primary preparer; CPA or EA]"
credential: "[CPA / EA / Other]"
license_state: "[State]"
license_verified: "[Date last verified by The STR Ledger]"

location:
  city: "[City]"
  state: "[State]"
  remote_only: false  # most are; flag if true

states_served:
  - "Primary: [State]"
  - "Secondary: [Multi-state with experience]"

pricing:
  model: "[Flat-fee / Per-form / Per-property / Hourly]"
  ballpark_low: 0    # USD
  ballpark_high: 0   # USD
  notes: "[e.g., 'Includes one mid-year planning call' or 'Excludes amendment work']"
  payment_plans: "[Available / Not available]"

services:
  preparation: true
  planning: true
  amendments: true
  audits: true
  entity_setup: true
  bookkeeping: false
  fractional_cfo: false

str_experience:
  client_count_band: "[<10 / 10-25 / 25-50 / 50+]"
  years_with_str_clients: 0
  niche: "[e.g., 'Mid-Atlantic mountain markets' / 'Texas + LLC structures' / 'Multi-state portfolios']"
  cost_seg_experience: true
  loophole_experience: true
  s_corp_experience: true

capacity:
  status: "[Accepting / Waitlist / Closed for {{YEAR}}]"
  status_as_of: "[Date]"
  typical_response_time: "[X business days]"

scorecard:
  q1_avg_rental_period: 3
  q2_material_participation: 3
  q3_str_loophole: 3
  q4_cost_seg: 2
  q5_bar_test: 3
  q6_augusta: 3
  q7_1099: 3
  q8_personal_use: 3
  q9_bonus_dep: 2
  q10_audit: 2
  q11_software: 3
  q12_str_specific: 3
  total: 33  # max 36

contact:
  website: "[URL]"
  email: "[Email]"
  phone: "[Phone]"
  intake_form: "[URL if applicable]"
  preferred_contact: "[Email / Form / Phone]"

testimonials:
  count_collected: 3
  permission_to_publish: true
  sample_quote: "[Single quote, with permission, from a real client]"
  reference_calls_available: false  # most CPAs say no for confidentiality

last_reviewed: "[Date]"
review_notes: "[Anything host should know going in]"
```

---

## Curation process — how a CPA gets listed

Three stages. No shortcuts.

### Stage 1 — Sourcing

- Direct outreach via LinkedIn, BiggerPockets STR forum, FB Inner Circle group asks
- CPA-association directories (AICPA, NAEA, state societies)
- Referrals from listed CPAs ("who would you trust with your own portfolio?")
- Self-submission via the course's CPA submission form (lower-trust path; still vetted)

### Stage 2 — Vetting

For each candidate:

1. **License verification.** Active CPA or EA license confirmed via state board lookup.
2. **Credential check.** Years of experience, STR-specific experience claimed.
3. **Reference calls.** 2–3 existing clients (with permission) speak to working style and accuracy.
4. **The 12-question interview.** A 30-minute call where the candidate is asked the same questions on the CPA Interview Scorecard.
5. **Scoring.** Total of the 12 questions plus weighted reference feedback.

**Threshold for listing: 27/36 on the scorecard, plus positive reference checks.**

CPAs scoring 24–26 with strong references and a niche specialization are listed with notes ("strong on cost-seg, lighter on Augusta").

CPAs below 24 are declined. The brand value of the directory rests on the floor.

### Stage 3 — Annual recheck

Twice a year (January and July):

- Capacity status refreshed
- License status re-verified
- Pricing updated
- Any complaints from course members investigated
- Listings without recent host engagement reviewed for delisting

A CPA can be removed at any time for: license issues, pattern of host complaints, dropping below scorecard threshold on re-interview, or unwillingness to confirm capacity.

---

## Coverage targets

Aim for the following coverage by listing #20:

| Geography | Target listings |
|---|---|
| Mountain West (Colorado, Utah, Idaho, Montana, Wyoming) | 3 |
| Pacific (California, Oregon, Washington) | 3 |
| Southwest (Arizona, New Mexico, Nevada) | 2 |
| Texas | 2 |
| Southeast (Florida, Georgia, Carolinas, Tennessee) | 3 |
| Northeast (NY, NJ, PA, MA, NH, ME) | 2 |
| Midwest (multi-state) | 2 |
| Multi-state remote-only | 3 |

Coverage gaps are flagged on the directory's intro page so hosts in uncovered states know to use the 12-question scorecard with a local generalist or remote specialist.

---

## Specialization tagging

Each listing carries 1–3 specialization tags:

```
COST-SEG       Has run engineering studies and DIY workbooks
LOOPHOLE       Strong on §469(c)(7) STR loophole positioning
S-CORP         Comfortable with S-corp election decisions and reasonable comp
ENTITY         Multi-property entity structuring; series LLC; LP/LLLP
COST-AVG       Mid-tier acquisition basis ($300K–$700K) — most STR hosts
HIGH-NW        Multi-million-dollar portfolios; integrated planning
NEW-HOST       Specializes in first-year hosts and entity decisions at startup
AUDIT          Audit defense experience, IRS correspondence handling
MULTI-STATE    Hosts with properties in multiple states
LIVING-INTL    U.S.-citizen hosts living abroad with U.S. STR portfolios
```

Tags drive search and filtering on the digital version of the directory.

---

## Pricing transparency

Hosts hate finding out the cost on the engagement letter. The directory bands pricing into clear tiers:

| Tier | Annual cost | Typical scope |
|---|---|---|
| **Lean** | $400–$800 | Schedule E only, basic prep, no planning |
| **Standard** | $800–$1,800 | Sched E + planning call + responsiveness during the year |
| **Premium** | $1,800–$5,000 | Full planning, mid-year reviews, entity work, audit support |
| **Boutique** | $5,000+ | Multi-property, multi-state, integrated personal + business |

CPAs who can't or won't band their pricing don't get listed. Opacity at the listing stage is a signal it'll be opaque at the engagement-letter stage.

---

## The submission form (for CPAs to apply)

```
═══════════════════════════════════════════════════════════════════
       Apply to be listed in The STR Ledger CPA Directory
═══════════════════════════════════════════════════════════════════

Section 1 — Firm
  Firm name:                  ____________________________________
  Principal preparer:         ____________________________________
  Credential (CPA/EA):        ____________________________________
  State of license:           ____________________________________
  License #:                  ____________________________________
  Years preparing returns:    ____________________________________

Section 2 — STR practice
  Approximate # of STR clients currently served:         ________
  Years serving STR clients:                             ________
  Multi-state portfolio experience? (yes/no):            ________
  Cost-seg experience? (yes/no):                         ________
  STR loophole / §469(c)(7) experience? (yes/no):        ________

Section 3 — Pricing
  Pricing model (flat / per-form / per-property / hourly): ______
  Annual fee range (typical client):       $______ to $______
  Engagement letter sample available? (yes/no):           ______

Section 4 — Capacity
  Currently accepting new clients? (yes/waitlist/no):     ______
  Typical response time during tax season:                ______

Section 5 — References
  Name 2–3 current clients we may contact (with permission):
    1. ____________________________________________________
    2. ____________________________________________________
    3. ____________________________________________________

Section 6 — Self-evaluation
  How would you score yourself on the CPA Interview Scorecard
  (0-3 per question, max 36)?
                                                       ____ / 36

Section 7 — Final
  Why do you want to be listed?                  __________________
                                                  __________________
  Anything else we should know?                  __________________
                                                  __________________

By submitting, you consent to:
  - License verification
  - The 12-question interview
  - Reference calls with the clients you named
  - Listing with the editorial scorecard score (not your self-score)
  - Removal at any time for license issues or pattern of host complaints
  - No payment to be listed; no payment for referrals

[ ] I understand and consent.

Signed:  ____________________  Date:  ____________________
```

Submissions reviewed quarterly. Reasonable response time: 30–60 days.

---

## Editorial standards

A few rules that protect the directory's value:

1. **Editorial tone matches the brand.** No promotional language in CPA bios. Each listing is written in the same dispassionate register as the rest of the course.
2. **No glowing language.** "Highly recommended" / "exceptional" are scrubbed. The score and the notes do the talking.
3. **Honest about limitations.** If a CPA is great on cost-seg and weak on Augusta, the listing says so.
4. **Capacity transparency.** A "Closed for {{YEAR}}" listing is more useful than the same listing falsely showing "Accepting." Honest closure builds trust.
5. **No referral fees, ever.** The moment the directory takes referral fees, hosts have a right to question every recommendation. The cost of integrity is small; the cost of losing it is the entire directory.

---

## How hosts use the directory

The expected workflow:

1. Open the directory PDF.
2. Filter by state and specialization tag.
3. Identify 3–5 listings that fit.
4. Review each listing's score, pricing band, and capacity status.
5. Reach out to top 2 via the listed contact path.
6. **Run the 12-question CPA Interview Scorecard on each.**
7. Hire the one whose score, working style, and pricing fit best.

The directory's role is *narrowing the field from thousands to a manageable few.* The scorecard's role is *the actual hiring decision.* Directory + scorecard = a vetted hire in 2–3 weeks instead of "ask the FB group and hope."

---

## Distribution

| Tier | What they get |
|---|---|
| **Self-Study course** | Full directory PDF (current year) |
| **Cohort** | Self-Study + warm intro to one CPA from the directory at student request *(once-per-enrollment courtesy)* |
| **Done-With-You** | Cohort + 30-min concierge call where Daniel matches the host to a directory entry based on portfolio specifics |

The Cohort warm intro is a small but real concierge moment. It costs Daniel 5 minutes and earns the buyer a meaningful head-start. CPAs who agree to be listed agree to accept these warm intros.

---

## File outputs

```
/12-cpa-directory/
   directory-{{YEAR-MM}}.pdf       ← refreshed twice a year
   directory-archive/              ← prior versions
     directory-2026-01.pdf
     directory-2026-07.pdf
   submission-form.pdf             ← for CPA applicants
   curation-policy.md              ← public-facing version of editorial standards
   submission-template.docx        ← for ease of email applications
```

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| A listed CPA underperforms for a host | Course collects 1-question post-engagement feedback; pattern of low scores triggers re-interview |
| Directory becomes outdated quickly | Twice-yearly refresh built into the production calendar |
| Too few listings to be useful | Sourcing is ongoing; coverage map flags gaps publicly |
| CPA on the list loses license | Twice-yearly license verification; emergency delisting on notification |
| CPAs object to public scorecard scores | Self-scoring required at submission; published score is editorial; CPAs sign acknowledgment at submission |
| Directory becomes a referral business | Editorial firewall: no referral fees, no paid placement, audited annually |

---

## Why this matters more than it looks

In every STR-host community, "who's your CPA?" is the gateway question that creates loyalty. A host who finds a great CPA through this directory tells five friends. A host who finds a bad CPA through this directory tells fifty.

The directory is a brand bet. Get it right and the course's word becomes the trust currency in the niche. Get it wrong and recovery is slow.

The editorial discipline above is what makes the bet worth taking.

---

*Last reviewed: 2026-04-28. The directory is editorial; inclusion does not constitute legal, tax, or financial advice. Hosts must independently verify each preparer's qualifications and run their own engagement-letter review before hiring.*
