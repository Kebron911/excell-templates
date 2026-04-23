# Brand Substitution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substitute every `<brand>`, `<brand name>`, `<domain>`, and related token across the repo with the locked values from `brand/brand-decisions.md` (`The STR Ledger` / `thestrledger.com`), so all drafted copy, ops docs, and infrastructure specs read as final rather than templated.

**Architecture:** Straight find-and-replace using the `Edit` tool with `replace_all`. Applied per-file in an order that prevents collisions (most-specific patterns first). Each directory is one task + one commit for reviewability. Two files are intentionally excluded — `brand/brand-decisions.md` (it documents the tokens) and `docs/superpowers/specs/2026-04-22-str-tax-platform-design.md` (historical snapshot written before brand was locked). The master plan at `docs/superpowers/plans/2026-04-22-weeks-1-8-launch.md` is included because it guides ongoing work, not a historical record.

**Tech Stack:** Markdown files only. No code. Tools: `Edit` (for substitutions, always with `replace_all: true`), `Grep` (for verification), `Bash` (for git commit).

---

## Canonical substitution sequence

**Order matters** — always apply in this exact order to avoid breaking longer matches. Within a single task, run the sequence on each file. **Skip any step whose `old_string` is not present in the target file** — the `Edit` tool errors when `old_string` isn't found, and that's expected for files that don't use every placeholder.

| # | `old_string` | `new_string` |
|---|---|---|
| 1 | `<brand name>` | `The STR Ledger` |
| 2 | `hello@<brand>.com` | `hello@thestrledger.com` |
| 3 | `n8n.<brand>.com` | `n8n.thestrledger.com` |
| 4 | `blog.<brand>.com` | `blog.thestrledger.com` |
| 5 | `app.<brand>.com` | `app.thestrledger.com` |
| 6 | `<brand>.com` | `thestrledger.com` |
| 7 | `<brand>` | `The STR Ledger` |
| 8 | `<domain>` | `thestrledger.com` |
| 9 | `<tagline placeholder>` | `Run your rentals before they run you.` |

All `Edit` calls use `replace_all: true`.

---

## File inventory

**Files to modify (17 total):**

Copy (8):
- `copy/etsy-listings/shop-about.md` (3 hits)
- `copy/etsy-listings/shop-policies.md` (3 hits)
- `copy/blog-posts/01-airbnb-tax-deductions.md` (8 hits)
- `copy/blog-posts/content-plan.md` (3 hits)
- `copy/pinterest/pin-catalog-first-30.md` (30 hits)
- `copy/fb-group/launch-plan.md` (4 hits)
- `copy/lead-magnets/etsy-buyer-pdf.md` (8 hits)
- `copy/email-sequences/nurture-hero-magnet.md` (15 hits)

Ops (2):
- `ops/credentials-inventory.md` (2 hits)
- `ops/user-manual-todo.md` (37 hits)

Infrastructure (4):
- `infrastructure/n8n/workflows-map.md` (8 hits)
- `infrastructure/n8n/workflows/W01-order-ingestion-stripe.md` (3 hits)
- `infrastructure/n8n/workflows/W02-order-ingestion-gumroad.md` (3 hits)
- `infrastructure/n8n/workflows/W04-subscriber-sync.md` (1 hit)

Docs (3):
- `docs/runbooks/disaster-recovery.md` (4 hits)
- `docs/runbooks/template-production-process.md` (1 hit)
- `docs/superpowers/plans/2026-04-22-weeks-1-8-launch.md` (83 hits)

**Files explicitly NOT modified:**
- `brand/brand-decisions.md` — documents the tokens themselves
- `docs/superpowers/specs/2026-04-22-str-tax-platform-design.md` — historical snapshot of the pre-lock brainstorm

**Also touched:**
- `README.md` — updated to reflect the locked brand (Task 9, not a substitution)

---

### Task 1: Substitute copy/etsy-listings/

**Files:**
- Modify: `copy/etsy-listings/shop-about.md`
- Modify: `copy/etsy-listings/shop-policies.md`

- [ ] **Step 1: Read `copy/etsy-listings/shop-about.md` to confirm current placeholders**

Use `Read` tool on the file. Expect to see `<brand name>` and `<domain>` tokens.

- [ ] **Step 2: Apply canonical substitution sequence to `copy/etsy-listings/shop-about.md`**

For each row in the canonical sequence above, call `Edit` with `replace_all: true`. If a row's `old_string` is not in the file, the `Edit` call errors — that's expected; skip to the next row.

- [ ] **Step 3: Grep the file for any remaining tokens**

```
Grep pattern: "<brand|<domain|<tagline placeholder"
Path: copy/etsy-listings/shop-about.md
Output mode: content
```

Expected: **0 matches.** If any remain, the substitution sequence didn't cover them — inspect manually and escalate.

- [ ] **Step 4: Read `copy/etsy-listings/shop-policies.md` to confirm current placeholders**

- [ ] **Step 5: Apply canonical substitution sequence to `copy/etsy-listings/shop-policies.md`**

Same process as Step 2.

- [ ] **Step 6: Grep shop-policies.md for remaining tokens**

```
Grep pattern: "<brand|<domain|<tagline placeholder"
Path: copy/etsy-listings/shop-policies.md
```

Expected: **0 matches.**

- [ ] **Step 7: Commit**

```bash
git add copy/etsy-listings/shop-about.md copy/etsy-listings/shop-policies.md
git commit -m "brand: substitute tokens in copy/etsy-listings/"
```

---

### Task 2: Substitute copy/blog-posts/

**Files:**
- Modify: `copy/blog-posts/01-airbnb-tax-deductions.md`
- Modify: `copy/blog-posts/content-plan.md`

- [ ] **Step 1: Read `copy/blog-posts/01-airbnb-tax-deductions.md`**

- [ ] **Step 2: Apply canonical substitution sequence**

- [ ] **Step 3: Grep the file for remaining tokens**

```
Grep pattern: "<brand|<domain|<tagline placeholder"
Path: copy/blog-posts/01-airbnb-tax-deductions.md
```

Expected: **0 matches.**

- [ ] **Step 4: Read `copy/blog-posts/content-plan.md`**

- [ ] **Step 5: Apply canonical substitution sequence**

- [ ] **Step 6: Grep the file for remaining tokens**

```
Grep pattern: "<brand|<domain|<tagline placeholder"
Path: copy/blog-posts/content-plan.md
```

Expected: **0 matches.**

- [ ] **Step 7: Commit**

```bash
git add copy/blog-posts/01-airbnb-tax-deductions.md copy/blog-posts/content-plan.md
git commit -m "brand: substitute tokens in copy/blog-posts/"
```

---

### Task 3: Substitute copy/pinterest/

**Files:**
- Modify: `copy/pinterest/pin-catalog-first-30.md` (30 hits — largest single copy file)

- [ ] **Step 1: Read `copy/pinterest/pin-catalog-first-30.md`**

- [ ] **Step 2: Apply canonical substitution sequence**

- [ ] **Step 3: Grep the file for remaining tokens**

```
Grep pattern: "<brand|<domain|<tagline placeholder"
Path: copy/pinterest/pin-catalog-first-30.md
```

Expected: **0 matches.**

- [ ] **Step 4: Commit**

```bash
git add copy/pinterest/pin-catalog-first-30.md
git commit -m "brand: substitute tokens in copy/pinterest/"
```

---

### Task 4: Substitute copy/fb-group/, copy/lead-magnets/, copy/email-sequences/

**Files:**
- Modify: `copy/fb-group/launch-plan.md`
- Modify: `copy/lead-magnets/etsy-buyer-pdf.md`
- Modify: `copy/email-sequences/nurture-hero-magnet.md`

- [ ] **Step 1: Read `copy/fb-group/launch-plan.md`**

- [ ] **Step 2: Apply canonical substitution sequence**

- [ ] **Step 3: Grep for remaining tokens**

```
Grep pattern: "<brand|<domain|<tagline placeholder"
Path: copy/fb-group/launch-plan.md
```

Expected: **0 matches.**

- [ ] **Step 4: Read `copy/lead-magnets/etsy-buyer-pdf.md`**

- [ ] **Step 5: Apply canonical substitution sequence**

- [ ] **Step 6: Grep for remaining tokens**

```
Grep pattern: "<brand|<domain|<tagline placeholder"
Path: copy/lead-magnets/etsy-buyer-pdf.md
```

Expected: **0 matches.**

- [ ] **Step 7: Read `copy/email-sequences/nurture-hero-magnet.md`**

- [ ] **Step 8: Apply canonical substitution sequence**

- [ ] **Step 9: Grep for remaining tokens**

```
Grep pattern: "<brand|<domain|<tagline placeholder"
Path: copy/email-sequences/nurture-hero-magnet.md
```

Expected: **0 matches.**

- [ ] **Step 10: Commit**

```bash
git add copy/fb-group/launch-plan.md copy/lead-magnets/etsy-buyer-pdf.md copy/email-sequences/nurture-hero-magnet.md
git commit -m "brand: substitute tokens in copy/fb-group/, lead-magnets/, email-sequences/"
```

---

### Task 5: Substitute ops/

**Files:**
- Modify: `ops/credentials-inventory.md`
- Modify: `ops/user-manual-todo.md` (37 hits — largest single file)

- [ ] **Step 1: Read `ops/credentials-inventory.md`**

- [ ] **Step 2: Apply canonical substitution sequence**

- [ ] **Step 3: Grep for remaining tokens**

```
Grep pattern: "<brand|<domain|<tagline placeholder"
Path: ops/credentials-inventory.md
```

Expected: **0 matches.**

- [ ] **Step 4: Read `ops/user-manual-todo.md`**

- [ ] **Step 5: Apply canonical substitution sequence**

Note: this file has 37 occurrences — expect `<brand>` alone and `<brand>.com` variants to be frequent.

- [ ] **Step 6: Grep for remaining tokens**

```
Grep pattern: "<brand|<domain|<tagline placeholder"
Path: ops/user-manual-todo.md
```

Expected: **0 matches.**

- [ ] **Step 7: Commit**

```bash
git add ops/credentials-inventory.md ops/user-manual-todo.md
git commit -m "brand: substitute tokens in ops/"
```

---

### Task 6: Substitute infrastructure/n8n/

**Files:**
- Modify: `infrastructure/n8n/workflows-map.md`
- Modify: `infrastructure/n8n/workflows/W01-order-ingestion-stripe.md`
- Modify: `infrastructure/n8n/workflows/W02-order-ingestion-gumroad.md`
- Modify: `infrastructure/n8n/workflows/W04-subscriber-sync.md`

- [ ] **Step 1: Read `infrastructure/n8n/workflows-map.md`**

- [ ] **Step 2: Apply canonical substitution sequence**

- [ ] **Step 3: Grep for remaining tokens**

```
Grep pattern: "<brand|<domain|<tagline placeholder"
Path: infrastructure/n8n/workflows-map.md
```

Expected: **0 matches.**

- [ ] **Step 4: Read and substitute `W01-order-ingestion-stripe.md`**

- [ ] **Step 5: Read and substitute `W02-order-ingestion-gumroad.md`**

- [ ] **Step 6: Read and substitute `W04-subscriber-sync.md`**

- [ ] **Step 7: Grep the whole n8n directory for remaining tokens**

```
Grep pattern: "<brand|<domain|<tagline placeholder"
Path: infrastructure/n8n
```

Expected: **0 matches.**

- [ ] **Step 8: Commit**

```bash
git add infrastructure/n8n/
git commit -m "brand: substitute tokens in infrastructure/n8n/"
```

---

### Task 7: Substitute docs/runbooks/

**Files:**
- Modify: `docs/runbooks/disaster-recovery.md`
- Modify: `docs/runbooks/template-production-process.md`

- [ ] **Step 1: Read `docs/runbooks/disaster-recovery.md`**

- [ ] **Step 2: Apply canonical substitution sequence**

- [ ] **Step 3: Grep for remaining tokens**

```
Grep pattern: "<brand|<domain|<tagline placeholder"
Path: docs/runbooks/disaster-recovery.md
```

Expected: **0 matches.**

- [ ] **Step 4: Read `docs/runbooks/template-production-process.md`**

- [ ] **Step 5: Apply canonical substitution sequence**

- [ ] **Step 6: Grep for remaining tokens**

```
Grep pattern: "<brand|<domain|<tagline placeholder"
Path: docs/runbooks/template-production-process.md
```

Expected: **0 matches.**

- [ ] **Step 7: Commit**

```bash
git add docs/runbooks/
git commit -m "brand: substitute tokens in docs/runbooks/"
```

---

### Task 8: Substitute master plan

**Files:**
- Modify: `docs/superpowers/plans/2026-04-22-weeks-1-8-launch.md` (83 hits — largest file)

**Why this file is in scope:** it's a *running* implementation plan, not a historical record. Ongoing execution should read the real brand and domain, not template placeholders.

- [ ] **Step 1: Read `docs/superpowers/plans/2026-04-22-weeks-1-8-launch.md`**

Expect a long file. Skim to confirm no literal code blocks contain the tokens as examples (if any such block exists, note its line range — those occurrences might need manual review).

- [ ] **Step 2: Apply canonical substitution sequence**

- [ ] **Step 3: Grep for remaining tokens**

```
Grep pattern: "<brand|<domain|<tagline placeholder"
Path: docs/superpowers/plans/2026-04-22-weeks-1-8-launch.md
```

Expected: **0 matches.** If any remain, inspect — they may be intentional backticked example placeholders (preserve) or real misses (fix manually).

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/plans/2026-04-22-weeks-1-8-launch.md
git commit -m "brand: substitute tokens in weeks-1-8 launch plan"
```

---

### Task 9: Update README.md with locked brand

**Files:**
- Modify: `README.md` (lines 1-27 — whole file)

This is not a find-replace — it's a content update. The current README describes the project generically; now it should lead with the brand.

- [ ] **Step 1: Read `README.md`**

- [ ] **Step 2: Overwrite README.md with the brand-aware version**

Use the `Write` tool to replace the entire file with:

```markdown
# The STR Ledger

> *Run your rentals before they run you.*

Business-grade Excel financial and operational systems for short-term rental (Airbnb/VRBO) hosts. Anchored on a tax-and-financial beachhead, distributed through a multi-storefront network (Etsy, Gumroad, own site), compounded by email, affiliates, and community. Designed to run 95% automated end to end.

**Live at:** [thestrledger.com](https://thestrledger.com)

## Repository layout

```
brand/
  brand-decisions.md       ← locked brand identity (name, palette, type, voice)
  assets/                  ← logo exports + Canva outputs (produced per Task 0.5)
copy/                      ← user-facing drafts (Etsy, email, blog, Pinterest, FB)
docs/
  runbooks/                ← ops procedures
  superpowers/
    specs/
      2026-04-22-str-tax-platform-design.md   ← master strategy design
    plans/
      2026-04-22-weeks-1-8-launch.md          ← weeks 1-8 execution plan
      2026-04-22-brand-substitution.md        ← brand token substitution pass
infrastructure/
  airtable/schema.md       ← Airtable base schema
  n8n/                     ← n8n workflow specs
ops/
  credentials-inventory.md
  user-manual-todo.md      ← Daniel's human action checklist
templates/                 ← Excel template briefs + specs (one folder per SKU)
```

## Current status

- **Brand:** locked — The STR Ledger / thestrledger.com
- **Niche:** Short-Term Rental hosts
- **Beachhead:** STR tax & financial templates
- **Primary persona:** Semi-Pro Sarah (3–10 properties)
- **Hub:** Influencersoft + Stripe Tax + Ghost blog at `blog.thestrledger.com`
- **SSOT:** Airtable → Postgres (Phase 3)
- **Automation:** n8n self-hosted at `n8n.thestrledger.com`, Claude over MCP
- **Launch sequence:** Etsy-MVP in Weeks 1–2, full stack by Week 8

See [the master strategy](docs/superpowers/specs/2026-04-22-str-tax-platform-design.md) and [the locked brand](brand/brand-decisions.md).
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "readme: update for locked brand (The STR Ledger)"
```

---

### Task 10: Final repo-wide verification

**No files modified** — this task only runs the final audit.

- [ ] **Step 1: Run a repo-wide grep for any remaining tokens**

```
Grep pattern: "<brand|<domain|<tagline placeholder"
Path: (repo root — C:/Users/Kebron/Desktop/Claude OS/Excell-Templates)
Output mode: files_with_matches
```

Expected: **exactly 2 files listed** —
1. `brand/brand-decisions.md` (documents the tokens; this is correct)
2. `docs/superpowers/specs/2026-04-22-str-tax-platform-design.md` (historical snapshot; this is correct)

**Any other file appearing in the output is a miss — go fix it.**

- [ ] **Step 2: Spot-check 3 substituted files read naturally**

Read:
- `copy/etsy-listings/shop-about.md` — should read as final Etsy About copy with "The STR Ledger" and "thestrledger.com" woven in
- `ops/user-manual-todo.md` — should say `n8n.thestrledger.com` etc. in infrastructure steps
- `copy/email-sequences/nurture-hero-magnet.md` — should say `hello@thestrledger.com` as sender

Look for awkward residue: double domain (e.g., "thestrledger.com.com"), broken capitalization ("the STR Ledger"), or prose that reads weird with the substituted values.

- [ ] **Step 3: Commit any spot-check fixes (if needed)**

```bash
# only if fixes were made
git add <specific files>
git commit -m "brand: fix awkward residue in <file>"
```

- [ ] **Step 4: Summary report**

Produce a short text summary for Daniel:
- Total files substituted: 17
- Total commits made: 9 (one per task + any spot-check fixes)
- Any files needing manual review: list them or state "none"
- Confirm the two intentionally-skipped files are still intentionally placeholder-bearing

This closes the "brand locked" milestone — every unblocked downstream task can now proceed with real values.

---

## Self-review notes (pre-execution)

1. **Spec coverage:** every placeholder type in `brand/brand-decisions.md` §9 has a corresponding substitution rule in the canonical sequence. The `<brand name>` and `<domain>` base cases are covered plus all subdomain/email variants. ✓

2. **Order-of-operations correctness:** the canonical sequence runs most-specific → least-specific. `<brand name>` (with space) goes before `<brand>` (without space). `<brand>.com` and subdomain variants go before bare `<brand>`. ✓

3. **False-positive risk:** two files are explicitly excluded (brand-decisions.md and the pre-lock strategy spec). A third concern — the master plan at `docs/superpowers/plans/2026-04-22-weeks-1-8-launch.md` — includes literal placeholder examples in some code blocks; Task 8 Step 1 flags a manual skim, Step 3 flags any residue for inspection. ✓

4. **Commit granularity:** 9 commits, one per directory/task, keeps each diff reviewable (<50 hits per commit except the 83-hit master plan, which is appropriately its own task). ✓

5. **Verification:** every task has a per-file grep step + Task 10 runs a final repo-wide grep. A file can't silently keep a token through the pass. ✓

6. **Escalation path:** any unexpected residue (Task 10 Step 1) is flagged rather than silently merged — preserves human review. ✓

---

**End of plan.**
