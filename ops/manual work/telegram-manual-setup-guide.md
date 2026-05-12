# Telegram Manual Setup Guide

> **Manual step — bot creation via @BotFather + channel creation + admin invite are all Telegram-client UI flows.** There's no API for "create a new bot programmatically" — the Telegram team specifically prevents that to limit bot spam. Once the bot + channels exist, every send-message call is API.
>
> **Last reviewed:** 2026-05-11
>
> **Account state:** ❌ no bot, no channels. Per `infrastructure/n8n/secrets-inventory.md`: `telegram-empire-bot` credential pending; `TELEGRAM_P0_CHAT` / `TELEGRAM_P1_CHAT` / `TELEGRAM_P2_CHAT` env vars pending.
>
> **Role in the empire:** the priority sink. Every n8n flow ends in `shared/telegram-router` which forwards to one of 3 channels by severity:
> - **P0** — page-now (revenue drop, refund spike, site down)
> - **P1** — daily digest 08:00 (traffic anomalies, indexing issues, weekly P&L)
> - **P2** — weekly Monday 08:00 (digests, low-priority backlog, freshness reports)

---

## Pre-flight (2 min)

1. **Install Telegram** on your phone if you haven't — https://telegram.org/apps. The native app is required to talk to @BotFather; web/desktop work too but flow is identical on phone.
2. Open Telegram → search **@BotFather** → start a chat.
3. Have your **n8n login** ready in another tab — you'll paste the bot token into n8n credentials in Part 4.

---

## Part 1 — Create the bot via @BotFather (5 min)

@BotFather is the official Telegram-team bot for creating other bots. Treat its responses as gospel.

1. In your @BotFather chat, send: `/newbot`
2. @BotFather: "Alright, a new bot. How are we going to call it?"
   - Reply: `STR Ledger Empire`
3. @BotFather: "Good. Now let's choose a username for your bot. It must end in `bot`."
   - Reply: `strledger_empire_bot`
   - If taken: try `strledger_alerts_bot`, `thestrledger_bot`, `strledger_ops_bot`. Note the actual handle you end up with.
4. @BotFather replies with a token block:
   ```
   Done! Congratulations on your new bot. ...
   Use this token to access the HTTP API:
   <BOT_TOKEN>
   Keep your token secure and store it safely, it can be used by anyone to control your bot.
   ```
5. **Immediately save the token** to Vaultwarden under `Telegram Bot — STR Ledger Empire`. Format `1234567890:ABC...` — about 46 chars.

### 1.1 Set bot description + profile photo (optional polish)

1. Send `/setdescription` → @BotFather asks which bot → pick `@strledger_empire_bot` → reply:
   `Internal alerts bot for The STR Ledger empire. Routes P0/P1/P2 events to the corresponding channels.`
2. Send `/setuserpic` → same selection → upload `brand/assets/logo-square-navy.png` (already produced).

### 1.2 Disable group chat (security)

The bot should ONLY send to the 3 channels you'll create — never to random user DMs or arbitrary groups.

1. Send `/setjoingroups` → pick `@strledger_empire_bot` → reply `Disable`.

→ **Tell Claude:** *"Telegram bot created: @<bot_handle>, token in Vaultwarden."*

---

## Part 2 — Create the 3 channels (10 min)

Channels (NOT groups) — channels are one-to-many broadcast. You're the only sender; n8n posts via the bot.

### 2.1 Create channel `@strledger-p0`

1. In Telegram app → top-right pencil icon → **New Channel** (NOT New Group).
2. Channel name: `STR Ledger — P0 (page now)`
3. Description: `Page-now alerts: revenue drops, refund spikes, site down, kill-sku triggers. Sound on, do not silence.`
4. Channel photo: same logo as the bot.
5. **Channel type: Public** → set link to `strledger_p0` (won't be discoverable in search since you control the link — but technically public so the bot can join. **You can switch to Private after the bot is added** — see 2.4.)
6. Skip "Add Members" — you'll add yourself + the bot in next step.

### 2.2 Add the bot as admin

1. Open the new channel → top → tap channel name → **Administrators** → **Add Administrator**.
2. Search `@strledger_empire_bot` → tap it → confirm permissions:
   - ✅ Post messages
   - ✅ Edit messages of others (lets the bot edit its own posts — useful for evolving status updates)
   - ✅ Delete messages of others
   - ⬜ Add new admins (no — bot shouldn't promote anyone)
3. **Done.**

### 2.3 Capture the channel ID

You can't see channel IDs in the Telegram UI directly. Use @userinfobot:

1. In the channel, send any test message (e.g. "hello").
2. **Forward** that message → search `@userinfobot` → forward to it.
3. @userinfobot replies with channel info including `Id: -100<numbers>`. The full numeric ID (with the `-100` prefix) is what n8n needs.
4. Save: `TELEGRAM_P0_CHAT = -100<numbers>` to Vaultwarden alongside the bot token.

### 2.4 (Optional but recommended) Switch to Private

Now that the bot is admin and you have the channel ID:

1. Channel settings → **Channel type** → **Private**.
2. This removes the `t.me/strledger_p0` public link. The bot can still post (it joined when public). New users join only via invite link.

### 2.5 Repeat for P1 and P2

**`@strledger-p1`:**
- Name: `STR Ledger — P1 (daily digest)`
- Description: `Daily digest 08:00: traffic anomalies, indexing issues, GSC digest, weekly P&L preview. Silent (you check on schedule).`
- Mute notifications in your Telegram client for this channel — it's silent-by-design.
- Add bot as admin, capture `TELEGRAM_P1_CHAT`.

**`@strledger-p2`:**
- Name: `STR Ledger — P2 (weekly digest)`
- Description: `Weekly Monday 08:00: low-priority backlog, freshness reports, vendor-renewal previews.`
- Mute notifications for this channel.
- Add bot as admin, capture `TELEGRAM_P2_CHAT`.

→ **Tell Claude:** *"Telegram channels created: P0/P1/P2 IDs in Vaultwarden."*

---

## Part 3 — Verify with a manual send (3 min)

Sanity-check before letting n8n loose.

From your terminal:

```bash
BOT_TOKEN="<the bot token>"
P0_CHAT="<the P0 channel ID, including -100 prefix>"

curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -d "chat_id=${P0_CHAT}" \
  -d "text=Telegram bot wired up. This is a manual test from setup."
```

Expected: 200 response + message appears in your @strledger-p0 channel.

If 401: bot token is wrong (re-copy from Vaultwarden).
If 400 `chat_id`: channel ID is wrong (re-run forward-to-userinfobot flow).
If 403: bot isn't an admin of the channel (re-do Part 2.2).

Repeat for P1 and P2 to confirm all 3 channel IDs are correct.

→ **Tell Claude:** *"Telegram smoke test passed on all 3 channels."*

---

## Part 4 — Wire into n8n (covered by n8n guide, not here)

Once the bot token + 3 channel IDs exist in Vaultwarden, the n8n-manual-setup-guide.md Part 2 (env vars) and Part 3 (credentials) handle:

- Set `TELEGRAM_P0_CHAT` / `P1_CHAT` / `P2_CHAT` env vars in n8n Settings → Variables.
- Create n8n credential `telegram-empire-bot` (type: Telegram API) with the bot token.

Don't do that step here — do it in the n8n guide when you arrive at it.

→ **Tell Claude:** *"Telegram setup complete — ready for n8n wiring."*

---

## Trigger-tag / env-var map

| Telegram output | Where it's used |
|---|---|
| Bot token | n8n credential `telegram-empire-bot` |
| `-100<P0_id>` | n8n env var `TELEGRAM_P0_CHAT` — sound-on alerts |
| `-100<P1_id>` | n8n env var `TELEGRAM_P1_CHAT` — daily digest 08:00 |
| `-100<P2_id>` | n8n env var `TELEGRAM_P2_CHAT` — weekly digest Mon 08:00 |
| Bot active as admin in all 3 channels | Every n8n flow can route through `shared/telegram-router` |

---

## Estimate

- Pre-flight: 2 min
- Create bot via @BotFather: 5 min
- Create 3 channels + add bot + capture IDs: 10 min
- Smoke test all 3: 3 min
- **Total: ~20 min**

---

## Common gotchas

- **Bot vs Group vs Channel.** Use **Channel** (one-to-many broadcast). Groups are for chat; bots in groups are noisier and harder to permission. Channels are what every Telegram-alerts pattern uses.
- **Channel ID needs the `-100` prefix.** It's a Telegram quirk — the ID @userinfobot shows already includes it. Don't strip it.
- **Bot must be admin BEFORE the channel goes private.** If you flip private first, the bot won't see new posts and won't be addable.
- **Mute notifications for P1 and P2 in YOUR client.** The channels are silent-by-design — if you don't mute on your phone, you'll get pinged at midnight when the daily-digest flow runs.
- **Don't reuse the bot for other empires.** If you spin up a second empire (e.g. DermMap), create a new bot. One bot ↔ one empire keeps blast radius small if a token leaks.
- **Token rotation:** if you suspect the bot token leaked, send `/revoke` to @BotFather → it issues a new token and invalidates the old. Update Vaultwarden + n8n credential afterward.
