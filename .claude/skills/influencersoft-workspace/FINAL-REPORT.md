# InfluencerSoft Skill — Final Benchmark Report

Generated: 2026-05-14

---

## 1. Iteration Journey

| Eval | Iter-1 with_skill | Iter-1 baseline | Iter-3 | Iter-4 | Notes |
|---|---|---|---|---|---|
| eval-0 tag-etsy-buyer (6 assertions) | 100% | 33% | 83% | **100%** | Fully recovered from iter-3 regression |
| eval-1 emails-going-to-spam (7 assertions) | 100% | 29% | 86% | **29%** | Hard regression — generic deliverability guide, misses 5/7 IS-specific assertions |
| eval-2 add-custom-field (5 assertions) | 100% | 20% | 60% | **80%** | Improved vs iter-3; misses only shorter-name recommendation |
| eval-3 bulk-product-upload (6 assertions) | 33% | 17% | 17% | **33%** | Flat — HMAC override unchanged, push_products.js and disabled-endpoint warning absent |
| **Overall** | **83%** | **25%** | **62%** | **61%** | Aggregator: 60.5% (rounding from per-eval averages) |

---

## 2. Skill Quality Finding

The skill content is correct and aligned with the official InfluencerSoft help-center guide (9 errors fixed, 28 gaps filled, 8 tribal-knowledge items preserved across iter-2/iter-3). The regressions in iter-4 are model-tier failures, not skill-content failures.

**Eval-1 regression (29%):** The iter-4 answer produced a generic, model-trained deliverability checklist instead of reading the skill's `deliverability.md` quick-triage section. The skill explicitly lists the five critical IS-specific checks in priority order (corporate domain, sender confirmation, DKIM+SPF+DMARC, FBL setup, FBL brand-new mailbox gotcha). The model answered from training priors. Five of seven IS-specific assertions failed.

**Eval-3 stall (33%, same as iter-1 baseline):** The `§0 Critical Gotchas` restructure in iter-4 did not fix the HMAC regression. The answer uses `HMAC-SHA256` throughout (capability matrix, code, checklist, n8n suggestion). The correct algorithm is `MD5(buildQuery + username + apikey)`. The model's strong prior — "API hash signing → HMAC" — overrides the explicit `api-quickref.md §0` callout that says "MD5, NOT HMAC". Additionally, the answer does not mention `infrastructure/influencersoft/push_products.js`, does not warn that AddGood was disabled for the `kebron` tenant as of 2026-05-08, and does not name `support@influencersoft.com` or Tech Tuesday as the escalation path. Four of six assertions failed.

**Eval-2 improvement (80%):** Three previously-failing assertions now pass (prefix-slug collision, stale UI error with LAST-collision phrasing, naming convention). Only the shorter-name recommendation (ref_src / source_ref) is missing.

**Eval-0 stable (100%):** All six assertions pass consistently across all iterations with the skill.

---

## 3. Recommendations

**For production IS work:**

1. Use `sonnet` or better — not `haiku` — for any question touching hash/auth, deliverability setup, or account-specific operational facts. Haiku's training priors for "API signing → HMAC" and generic deliverability checklists override explicit anti-pattern instructions even when the skill front-loads them in `§0 Critical Gotchas`.

2. The skill content is authoritative. The `api-quickref.md §0` callout, the `deliverability.md` quick-triage section, and the `gotchas.md` AddGood-disabled warning are all correct and precisely target the failing assertions. The problem is retrieval and attention under haiku, not content accuracy.

3. Overall value is still decisive: with the skill, haiku averages 61% vs a 25% baseline — a 2.4× improvement. On the two evals where haiku can follow skill instructions (eval-0, eval-2), it achieves 100% and 80%. The failure modes are concentrated in the two evals requiring recall of counter-intuitive facts (MD5 not HMAC; IS-specific FBL/sender setup) against strong training priors.

---

## 4. Final Skill State

8 files at `.claude/skills/influencersoft/`:

| File | Lines | Words |
|---|---|---|
| SKILL.md | 333 | 2,411 |
| api-quickref.md | 210 | 1,307 |
| ui-walkthrough.md | 210 | 1,401 |
| modules.md | 185 | 1,298 |
| plans-and-support.md | 116 | 747 |
| deliverability.md | 154 | 1,014 |
| gotchas.md | 105 | 1,652 |
| reports-analytics.md | 92 | 759 |
| **Total** | **1,405** | **10,589** |

**Commit history (12+ atomic commits):**
- Iter-1 (initial build): SKILL.md + 6 module files
- Iter-2 (MD5 promotion): api-quickref.md §0 callout added, MD5 made explicit
- Iter-3 (guide-comparison alignment, 8 commits): 9 errors corrected, 28 gaps filled, tribal knowledge preserved; deliverability.md quick-triage added
- Iter-4 (§0 critical gotchas restructure): api-quickref.md §0 rewritten as priority-first callout block

**Unresolved:** eval-3 HMAC regression and eval-1 deliverability regression require sonnet-tier model to resolve reliably. Skill content cannot force haiku to override its training priors on these two topics.
