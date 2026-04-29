# Post-Purchase Onboarding Sequence — *The 47-Deduction Operator*

**Status:** Draft v0.1 — 2026-04-29
**Sequence type:** Lifecycle, triggered by purchase event
**Audience:** Course buyers — Self-Study, Cohort, Done-With-You (with tier-specific branches)
**Goal:** Land the buyer in Module 2 within 7 days, complete Module 2 within 30 days, finish the course within 90 days, prevent refunds inside the 14-day window through engagement (not retention emails)

---

## Why this sequence exists

Most course buyers hit "Enroll" with intent and then stall. Industry-standard self-paced course completion is ~22%. Cohort completion runs higher (~70%) because of the calendar lock, but only if the first 7 days work.

The post-purchase sequence is the bridge between *intent* and *first 21-minute Saturday*. It does five things:

1. Confirms the purchase + ships the deliverables on schedule
2. Sets the cadence (when to watch what)
3. Lowers activation friction (where to start, what to skip)
4. Builds the habit (Module 0.3's calendar block, then the first Saturday)
5. Catches drift early (re-engagement before the 14-day refund window closes)

---

## Sequence map

```
DAY 0       PURCHASE                        (trigger event)
DAY 0  ·  Email 1   Welcome + access       (within 5 minutes)
DAY 1  ·  Email 2   Start here             (next morning, 8 AM local)
DAY 3  ·  Email 3   The spine                (Module 2 push)
DAY 7  ·  Email 4   First Saturday?         (accountability ping)
DAY 11 · Email 5    Refund window check    (only if non-active — soft, honest)
DAY 14 · Email 6    Module 3 unlock         (if active) / final refund nudge (if not)
DAY 21 · Email 7    Big levers              (Module 4)
DAY 30 · Email 8    The 30-day check        (NPS + first-Saturday survey)
DAY 60 · Email 9    Audit defense + handoff (Modules 5–6)
DAY 90 · Email 10   Graduation              (Module 7 + community welcome)

PLUS branches:
   Cohort tier  →  cohort-specific overlay (8 additional touches over 4 weeks)
   DWY tier     →  concierge handoff overlay (5 additional touches)
   Inactive    →  re-engagement track (stops day 60)
```

The skeleton works for all three tiers. The branches add tier-specific touches without rewriting the core.

---

## Voice rules

Same as the rest of the brand:
- Editorial-finance register
- Specific dollar figures + IRS code citations (sparingly)
- No emoji, no exclamation points except in dialogue
- "Operator" / "host" / "portfolio" — never "rock star" or "tax ninja"
- Sign-off: *— The STR Ledger* with *Run your rentals before they run you.* below

---

## Email 1 — *Day 0, within 5 minutes of purchase*

**Trigger:** Purchase event, any tier
**Subject:** *You're in. Here is your access.*
**Preview text:** *Login link, the bundle download, and the one thing to do before tomorrow.*

```
You're in.

Here is what happens in the next five minutes:

  1.  You log in.
       Click here: [LMS LOGIN LINK]
       Username: [EMAIL]
       Password: set at first login (link below)

  2.  You download the workbook bundle.
       It's the first thing in your dashboard. ~75 files, organized in
       nine folders. Don't open them all today.

  3.  You watch Module 0, Lesson 0.1 — six minutes.
       It explains what to do next and what to skip.

That's it for today. Tomorrow morning we'll send the start-here email.

If anything is broken — login, download, billing — reply to this
email. A real person responds inside two business hours during the
business day.

— The STR Ledger
*Run your rentals before they run you.*
```

**Tags applied:** `course:purchased`, `course:{{tier}}`, `customer:course`
**Cookie:** drops 365-day attribution cookie if not already present

---

## Email 2 — *Day 1, 8:00 AM local*

**Trigger:** 24h after Email 1 send
**Subject:** *Start here.*
**Preview text:** *Three lessons. Twenty-five minutes. Then put it down.*

```
Good morning.

The temptation today will be to watch six modules.

Don't.

Module 0 is twenty-five minutes — three short lessons. Watch them.
Then close the LMS for the rest of the day.

  Lesson 0.1   What you're about to install   6 min
  Lesson 0.2   Tour of the workbook bundle    12 min
  Lesson 0.3   Set your quarterly cadence     7 min

Lesson 0.3 is the most important assignment in the course. It asks
you to put four Saturdays on your calendar — March 28, June 27,
September 26, and December 26. The four 21-minute Saturdays.

Most students who skip this assignment don't run the system. Most
students who complete it do.

It's a single calendar event. Done in two minutes.

We'll send the next email Wednesday with Module 1.

— The STR Ledger
*Run your rentals before they run you.*
```

**Tags applied:** `course:onboarding-day-1`
**Tracked outcome:** LMS event "Lesson 0.3 completed" — feeds segmentation for Day 7 email

---

## Email 3 — *Day 3, 8:00 AM local*

**Trigger:** 48h after Email 2 send
**Subject:** *Module two is the spine.*
**Preview text:** *Eight lessons, ninety minutes. The single module that matters most.*

```
Module One — The Frame — is now unlocked. Fifty minutes. Five
lessons. Watch it tonight.

But the thing we want to flag is Module Two.

Module Two — The Capture System — is eight lessons that walk through
each step of the seven-minute tax tab. It is the spine of the course.
Every other module either feeds it or extends it.

If you finish Module Two and stop there, you have already installed
the asset most hosts spent five years not building.

Module Two unlocks Saturday morning. Your homework between now and
then:

  •  Watch Module One end-to-end.
  •  Run the Schedule E vs. Schedule C decision tree on YOUR
      portfolio. (PDF in your bonus folder, file 04-decision-trees,
      tree #1.)
  •  Bring your worst question to the community channel — we run a
      Wednesday-evening FAQ thread for new students.

Reply to this email if anything in Module One didn't make sense.

— The STR Ledger
*Run your rentals before they run you.*
```

**Tags applied:** `course:onboarding-day-3`
**Personalized fields:** if `course:cohort` → swap "community channel" → "cohort Slack #wins-and-stucks"; if `course:dwy` → swap to "your private channel + your concierge intro call is on the calendar for [DATE]"

---

## Email 4 — *Day 7, Sunday 6:00 PM local*

**Trigger:** Sunday after Day 3 send
**Subject:** *First 21 minutes — when?*
**Preview text:** *We are not asking for completion. We are asking for the date.*

```
A week in.

We are not asking whether you have finished Module Two — that's a
2026 problem, not a today problem.

We are asking whether you have a date scheduled for your first
twenty-one-minute Saturday on one property.

  •  If yes — confirm it in the LMS dashboard. Click "I have my
      first Saturday scheduled" and tell us the date. Takes ten
      seconds.

  •  If not — pick a date in the next two weeks. Pull up the
      calendar event from Lesson 0.3 and choose ONE of the four
      Saturdays we put on the calendar. Treat it as a real
      appointment.

The course works for the students who run the first Saturday.
The course doesn't work for the students who don't.

Reply with the date if you'd rather not click. We read every reply.

— The STR Ledger
*Run your rentals before they run you.*

P.S.  The 14-day refund window closes one week from today. If the
      course isn't fitting your situation, reply and we'll refund
      without a survey or negotiation. The work either delivers or
      it doesn't.
```

**Tags applied:** `course:onboarding-day-7`
**Tracked outcome:** "First Saturday scheduled" event from LMS dashboard click; this is the single most predictive engagement signal

**The P.S.** is honest by design. Hosts who got cold feet during week 1 are not retained by hiding the refund — they leave a 1-star review. Acknowledging the window builds trust with the 95% who stay.

---

## Email 5 — *Day 11* *(only if non-active — Lesson 0.3 not complete OR no LMS visit since Day 3)*

**Trigger:** Day 11 + segmentation filter (no progress beyond Lesson 0.3)
**Subject:** *Three days left in the refund window.*
**Preview text:** *No pitch. An honest check-in.*

```
You bought the course eleven days ago. The dashboard shows you
haven't been back since the welcome email.

This is not a guilt-trip email. Two scenarios:

  Scenario one  —  You bought it, life happened, you'll get to it.
                   That's normal. The course doesn't expire. The
                   community is there when you're ready.

  Scenario two  —  You bought it, opened it, and decided it wasn't
                   the fit you expected.

If scenario two — the 14-day refund window closes Friday at midnight.
Reply to this email with the word "refund" and we'll process it
inside two business hours, no questions, no survey.

If scenario one — no action needed. You'll get the next email at the
2-week mark with Module 3 access. We'll be here.

— The STR Ledger
*Run your rentals before they run you.*
```

**Tags applied:** `course:at-risk` if not already; `course:reactivated` on next LMS visit
**Refund handling:** "refund" reply hits a Zapier intake → ops queue → processed inside the promised 2 business hours

This email looks like it works against the business. It works *for* the business — the refund cohort would have charged back anyway, and the email earns goodwill from the much larger stay-cohort who reads it and doesn't refund.

---

## Email 6 — *Day 14, 8:00 AM local* — branched

### 6A — Active branch *(student has progressed past Module 1)*

**Subject:** *Module 3 is open. Forty-seven deductions on the table.*
**Preview text:** *Twelve lessons, two hours fifteen. Workshop format.*

```
Module Three is open.

Twelve workshop sessions. Each one runs a worked example end-to-end:
the recurring ten, repairs vs. improvements, depreciation,
§168(k) bonus, mileage, platform fees, professional services, home
office, insurance, marketing.

The way to watch this module is in the order you encounter the
deductions in your own portfolio. If you spent yesterday on a
$340 paint receipt, watch 3.3. If you're working through your
mileage log this week, watch 3.6.

Module Three is reference, not a sequential read. Treat it like
Wikipedia for the 47 deductions — open the chapter you need, close
the rest.

Capstone of Module Three is Lesson 3.12: the 47-Deduction Self-Audit
Checklist. Run it on last year's return. If you find three or more
missed deductions, the course paid for itself this morning.

— The STR Ledger
*Run your rentals before they run you.*
```

### 6B — Inactive branch *(no progress past Lesson 0.3)*

**Subject:** *Last note about the refund window.*
**Preview text:** *It closes tonight. After tonight, the course is yours regardless.*

```
The 14-day refund window closes at midnight tonight in your local
timezone.

If you'd like to refund — reply with "refund" and it's processed
inside two business hours. No survey, no negotiation.

If you'd like to keep the course — do nothing. The course doesn't
expire. You can come back to it in a month, a quarter, a year, or
when next tax season comes around.

This is the last email about the refund window. After tonight, our
emails go back to the regular cadence: Module 3 unlock, Module 4
unlock, and so on.

Whatever you choose, we appreciate you taking the chance on it.

— The STR Ledger
*Run your rentals before they run you.*
```

**Tags applied:** `course:onboarding-day-14`, `course:active` or `course:inactive`
**Decision logic:** lookup at Day 14 — has the student watched ≥4 lessons or scheduled a first Saturday? Active. Otherwise: inactive.

---

## Email 7 — *Day 21, 8:00 AM local*

**Trigger:** Day 21 send to all active students
**Subject:** *The big levers.*
**Preview text:** *Cost segregation. The STR loophole. Augusta. Six lessons.*

```
Three weeks in. If Module Two is the spine, Module Four is the
torque.

Six lessons on the four asymmetric deductions where most of the
dollars live:

  4.1  Cost segregation — when it pencils, when it doesn't
  4.2  TAX-010 walkthrough — the DIY workbook
  4.3  The STR loophole, decoded
  4.4  The Augusta Rule — §280A(g)
  4.5  The 14-day personal-use line
  4.6  Stacking the levers — Amanda's $50,000 year, deconstructed

Module Four does NOT apply to every host. If your acquisition basis
is under $400K, cost seg likely doesn't pencil. If you don't have an
entity, Augusta doesn't apply. If your average rental period is over
seven days, the STR loophole doesn't fit.

Watch 4.1, 4.4, and 4.5 anyway — they're the framework. Skip 4.2 and
4.3 if your situation doesn't apply, with no guilt.

Lesson 4.6 — *stacking the levers* — is worth watching regardless
of which levers you're using.

— The STR Ledger
*Run your rentals before they run you.*
```

**Tags applied:** `course:onboarding-day-21`

---

## Email 8 — *Day 30, 8:00 AM local*

**Trigger:** Day 30 send to all course-purchasers
**Subject:** *Thirty days in. Two questions.*
**Preview text:** *Both are short. Both are honest.*

```
Thirty days in.

Two questions, three minutes total.

  ONE.   On a scale of 0 to 10, how likely are you to recommend the
         course to another STR host?
         [LINK to single-question form]

  TWO.   Have you run your first 21-minute Saturday yet?
         [LINK to two-button form: yes / not yet]

The first question is our NPS. We watch it weekly. It tells us
whether the course is delivering for the cohort that signed up.

The second question is our most predictive completion signal. The
hosts who run their first Saturday inside 30 days finish the course
at >70%. The hosts who don't, finish at <15%.

If "not yet" — reply to this email with what's blocking you. The
most common blockers are: not enough time, intimidation by the
workbook, life events. We've seen all three. We can usually unblock
the first two in fifteen minutes of email back-and-forth.

— The STR Ledger
*Run your rentals before they run you.*
```

**Tags applied:** `course:nps-asked-30`
**Engagement triggers:** NPS submission tags `course:nps-{{score}}`; second-question response triggers a personal Daniel reply if "not yet"

---

## Email 9 — *Day 60, 8:00 AM local*

**Trigger:** Day 60 send to active students
**Subject:** *Audit defense. The CPA handoff.*
**Preview text:** *Modules 5 and 6 — the most underrated modules in the course.*

```
Two months in.

If you're caught up through Module Four, the next two modules are
the ones that pay for themselves on your next return regardless of
whether you ever face an examination:

  Module Five  —  Audit Defense
  Module Six   —  The CPA Handoff

Module Five builds your audit dossier. Five lessons. Do not skip the
Tabletop Drill (Lesson 5.5). It is the closest thing in the course
to an actual examination conversation, and it surfaces gaps in your
substantiation while there is still time to close them.

Module Six is what you send your CPA in February so March is
preparation, not archaeology. Twelve folders, one cover letter, a
question-list document. Hosts who send a clean handoff folder file
2–3 weeks earlier and pay 20–30% less in CPA fees than hosts who
send a workbook with no framing.

If you have NOT yet found a CPA — work the 12-question scorecard
(in Module Six) against ONE candidate this month. The Directory in
your bonus folder is the shortlist.

— The STR Ledger
*Run your rentals before they run you.*
```

**Tags applied:** `course:onboarding-day-60`

---

## Email 10 — *Day 90, 8:00 AM local*

**Trigger:** Day 90 send
**Subject:** *Graduation.*
**Preview text:** *What a year on the system looks like.*

```
Ninety days in.

If you've worked through Module Seven, you've graduated. Your
quarterly cadence is on the calendar for next year. Your audit
dossier shell is built. Your CPA handoff folder template exists.
Your portfolio runs on the system rather than reconstructing itself
each March.

If you haven't worked through Module Seven yet, no rush — it's the
year-2 module and it stays available indefinitely.

A few notes on what comes next:

  •  The community is yours, lifetime. Drop in when you have a
      question or a win.

  •  The annual "What Changed" update video lands every January.
      It walks through the year's rate changes, threshold updates,
      and material code changes in 30 minutes. You'll get an email
      when it's live.

  •  Quarterly office hours are on the calendar — last Saturday of
      each quarter at 11 AM Eastern. They're cohort-only by default;
      Self-Study graduates can attend the January and July sessions
      as standing alumni.

  •  Year-2 health check (Lesson 7.4) is the December exercise.
      We'll send a reminder.

If the course delivered, we'd appreciate a sentence or two we can
share with the next class — testimonials are how the work reaches
the next operator.

[LINK to short testimonial form]

Whatever you choose, thank you for taking it.

— The STR Ledger
*Run your rentals before they run you.*
```

**Tags applied:** `course:graduate`
**Triggers:** testimonial form submission feeds the social-proof library; high-NPS graduates receive a referral-program invite at Day 120

---

## Cohort overlay — additional touches *(8 emails over 4 weeks)*

The cohort tier overlays the core sequence with cohort-specific touches. Numbered C1–C8 to distinguish from the base sequence.

| Day | Email | Purpose |
|---|---|---|
| -7 | C1 | "Cohort starts in 7 days" — Slack invite, cohort calendar |
| -1 | C2 | "Tomorrow, 7 PM Eastern" — call link, pre-call homework reminder |
| 0 (cohort) | C3 | Same-day post-Call-1: "Recording is live; here's what you should have ready by Call 2" |
| 7 (cohort) | C4 | Pre-Call-2: "Bring your trickiest receipt" |
| 14 (cohort) | C5 | Pre-Call-3 + CPA panel reminder ("Submit your panel question by Friday") |
| 21 (cohort) | C6 | Pre-Call-4: "Tabletop drill score requested" |
| 28 (cohort) | C7 | Graduation: certificate issued, wall poster shipped, lifetime Slack confirmed |
| 60 (post-cohort) | C8 | "How is your Q1 going?" — first quarterly check |

Cohort overlay emails are short — most are 100–150 words. They are operational, not narrative.

---

## Done-With-You overlay — additional touches *(5 emails)*

The DWY tier adds five concierge-flavored touches:

| Day | Email | Purpose |
|---|---|---|
| 0 | DWY1 | "Welcome — your concierge intake form is here" — link to intake form (portfolio details, current bookkeeping state, pain points) |
| 3 | DWY2 | "First 1:1 scheduled" — calendar confirmation + pre-session questionnaire |
| Post-call-1 | DWY3 | Recap of first session + assignment for second session |
| Post-call-2 | DWY4 | Recap + assignment for third session |
| Post-call-3 | DWY5 | "Your audit dossier review is complete" — written summary, recommendations, CPA Directory introduction |

DWY emails are individually written, not templated. The 5-email skeleton is the cadence; the content is bespoke per buyer.

---

## Re-engagement track — for the inactive

Students with `course:at-risk` or `course:inactive` after Day 14 enter a slower cadence:

| Day | Email | Purpose |
|---|---|---|
| 30 | RE1 | "If now's not the right time, no problem — here is the one thing to bookmark" — link to the 47-Deduction Self-Audit Checklist |
| 60 | RE2 | "Tax-season approaches — re-engage now and you'll close 2026 cleanly" — Module 6 (Handoff) recommended as starting point |
| 90 | RE3 | "Last touch from the onboarding sequence — the door's still open" — links to community + LMS, then drops to the regular newsletter cadence |

After RE3, the inactive student receives the regular brand newsletter cadence and is no longer in onboarding. They re-enter the active sequence if they ever progress past Module 1.

---

## Frequency cap & exclusion rules

- **Active students** receive the core sequence + tier overlay. Maximum 2 emails per week from this sequence.
- **Inactive students** receive the core sequence days 0, 1, 3, 7, 11, 14 + the re-engagement track. Day 21+ core emails are suppressed for inactive students.
- **Refunded students** are removed from all course sequences immediately and dropped to the brand newsletter cadence.
- **Quiet hours** apply across all emails: no sends 9 PM – 7 AM in the recipient's timezone.
- **Tax-season override**: between February 1 and April 15, the cadence accelerates by ~3 days for any student behind on Modules 5–6, since the tax-season window is the most useful time to engage with those modules.

---

## What this sequence does not do

- **No upsell within the first 14 days.** The refund window is sacred. No DWY upgrade pitches, no Course Vol. 02 pre-sells, no affiliate offers. Trust is built before it's monetized.
- **No public testimonial requests before Day 90.** Asking too early gets thin testimonials. The Day-90 ask is when graduates are speaking from completion.
- **No "are you stuck?" support emails.** The community + Slack is where stuckness lives. The sequence assumes the support layer is doing its job.
- **No "buy our other thing" cross-sell to existing workbook buyers.** They already bought; respect the spend.

---

## Metrics to watch

| Metric | Target |
|---|---|
| Email 1 → Lesson 0.1 viewed | >85% |
| Email 2 → Lesson 0.3 completed (calendar set) | >65% |
| Email 4 → "First Saturday scheduled" | >50% |
| Day 14 active rate | >55% |
| Day 30 NPS submitted | >35% |
| Day 30 first-Saturday-completed | >40% |
| Day 90 graduation rate (Module 7 viewed) | Self-Study 35%+, Cohort 70%+ |
| Refund rate (14-day window) | <5% |

Below-target metrics trigger sequence revision before the next cohort or significant launch.

---

## Voice/copy review checklist (before each cohort or seasonal refresh)

- [ ] Every dollar figure verified against current law and current pricing
- [ ] All IRS code citations validated
- [ ] Every link UTM-tagged with sequence step + email number
- [ ] No emoji
- [ ] No exclamation points outside dialogue
- [ ] Disclaimer present at end of any email mentioning specific deductions
- [ ] Tier-specific personalization fields tested in Influencersoft preview
- [ ] Quiet-hours respected via timezone-aware send

---

## Production checklist

- [ ] All 10 core emails drafted in Influencersoft as templates
- [ ] Cohort overlay (C1–C8) drafted
- [ ] DWY overlay (DWY1–DWY5) drafted as bespoke skeletons
- [ ] Re-engagement track (RE1–RE3) drafted
- [ ] Tagging plan synced with the master tagging plan in 00-course-plan.md §9.4
- [ ] LMS event hooks for "Lesson 0.3 completed" and "First Saturday scheduled" wired
- [ ] Refund-reply automation (Zapier → ops queue) tested end-to-end
- [ ] Beta test: 3 staff or alumni run the full sequence as test buyers; capture feedback before public launch

---

*Last reviewed: 2026-04-29. Lifecycle sequences need quarterly tuning; expect to revise this sequence after the first two cohorts based on observed completion patterns and refund reasons. The core 10-email skeleton is durable; the overlays and triggers are where most adjustments will happen.*
