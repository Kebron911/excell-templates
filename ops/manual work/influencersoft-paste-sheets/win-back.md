# Paste Sheet — win-back

> **Auto-generated from:** `copy\email-sequences\win-back.md`
> **DO NOT EDIT.** Re-run `node scripts/is-paste-helper.mjs` after editing the source.

## IS UI setup

1. **Automations → New Sequence**
2. **Name:** `win-back`
3. **Trigger:** When tag `inactive-30d` is added
4. **Then add 3 email(s) below in order.** Set the delay per the header on each.
5. **Save and Activate** when the last email is in.

When done, mark this sequence done in your tracker.

---

### Email 1 of 3 — Are you still in?

- **Delay (set in IS):** Day 0
- **Subject (copy):**

      {{ first_name | default: "Hey" }} — should I keep emailing you?

- **Preheader (copy):**

      Honest question. {{ months_since_last_open }} months since you last opened.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN win-back EMAIL 1 -----8<-----

{{ first_name | default: "Hey" }},

Honest question: it's been {{ months_since_last_open | default: "a while" }} months since you opened anything from me, and I'd rather you tell me to leave than keep showing up uninvited.

Three options. Pick one:

**1. Stay in — I just got busy.**
Click anywhere in this email (the link below works). I'll keep sending the newsletter and stop counting opens for a while.

→ [Yes, keep me on]({{ link_newsletter_archive }})

**2. Quiet for now — newsletter only, no other emails.**
Reply with the word "quiet" and I'll move you to the once-a-month digest list (no product launches, no sequences, just the newsletter).

**3. I'm out — unsubscribe me.**
→ [Unsubscribe]({{ link_unsub }})

Whichever you pick is fine. The only thing that doesn't help either of us is silence — Gmail and Outlook punish me for sending to people who never open, and that hurts the inbox placement of people who actually want to hear from me.

— Emily · The STR Ledger

P.S. If you're still on the fence about STR investing, that's also a perfectly fine reason to leave. The newsletter is for operators who are in the work. Coming back later is always an option.

-----8<----- END EMAIL 1 -----8<-----

### Email 2 of 3 — One concrete thing you missed

- **Delay (set in IS):** Day 7
- **Subject (copy):**

      The cleaning-fee mistake costing hosts $4-7K/year

- **Preheader (copy):**

      Sample of what the newsletter actually sends. Then I'll quiet down.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN win-back EMAIL 2 -----8<-----

{{ first_name | default: "Hey" }},

Quick test before I assume you're gone.

Here's a real piece of what you've been missing — the actual newsletter content, not a pitch:

> Most hosts price the cleaning fee at "what the cleaner charges + $20 buffer." That feels reasonable until you realize: high cleaning fees suppress booking conversion 12-18%, AND Airbnb buries listings with cleaning-fee-to-nightly-rate ratios above 0.4. The optimal pricing is usually $40-80 *under* what hosts initially set — counterintuitive, but the math is consistent across every market I've analyzed.

That's the kind of thing the newsletter sends, weekly, free. No fluff, no SKU pitches in 80% of issues.

If that's useful — keep me in your inbox by [clicking here]({{ link_top_post }}) (loads the full article on cleaning fee math).

If it's not your thing — totally fine, [unsubscribe here]({{ link_unsub }}) and I'll stop. No hard feelings.

— Emily

P.S. One more email after this, then I'll go quiet on my own. Promise.

-----8<----- END EMAIL 2 -----8<-----

### Email 3 of 3 — Last note + sunset

- **Delay (set in IS):** Day 21
- **Subject (copy):**

      Going quiet — last note from me

- **Preheader (copy):**

      Removing you from broadcast. Not deleted, just paused.

- **Body (copy everything between the lines below):**

-----8<----- BEGIN win-back EMAIL 3 -----8<-----

{{ first_name | default: "Hey" }},

This is the last one for now.

Since there's been no opens in {{ months_since_last_open | default: "a while" }} months, I'm moving you off the active broadcast list — your email stays in the system (so you can come back any time without re-subscribing), but you'll stop hearing from me.

If you want to opt back in later: thestrledger.com/newsletter resubscribes you in 10 seconds.

If you want a clean break: [Unsubscribe completely]({{ link_unsub }}).

Either way — thanks for being on the list at all. STR investing is a slow game and most people who subscribe are still figuring out whether the work fits them. That's fine. Coming back when the timing's right is always allowed.

— Emily · The STR Ledger

P.S. If something specific made you tune out (too many emails, wrong topics, life got busy) and you want to tell me — reply to this. I read every reply. The list gets better when people tell me what didn't work.

-----8<----- END EMAIL 3 -----8<-----
