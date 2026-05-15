# STR_StrManuals_LeadMagnet_Tax — end-to-end smoke test

Run after the wiring checklist completes. Total time: ~5 minutes.

## Setup

- Throwaway address: a 10-minute mail (e.g., `https://temp-mail.org`) **or** a `+tag` alias on a real inbox you control: `you+strmanualstest@gmail.com`. Gmail/+tag is preferred because you can see IS sequence emails arrive over the following days.
- Have these tabs open in parallel windows:
  1. https://strmanuals.com/free
  2. n8n executions list for `STR_StrManuals_LeadMagnet_Tax`
  3. Google Sheets — Leads tab
  4. InfluencerSoft — Leads/Contacts list

## Path A — happy path (valid email)

1. Open https://strmanuals.com/free.
2. Inspect the form's `action` attribute in DevTools — confirm it resolves to your n8n base + `/webhook/lead-magnet-strmanuals-tax-explainer`. If it's still pointing at a stale path, the site needs a redeploy first.
3. Enter the throwaway email. Submit.
4. **Browser:** should land on `https://strmanuals.com/free/?confirmed=1` (303 redirect from n8n).
5. **n8n:** open the latest execution. Expect green ticks on:
   - `Tax-loophole magnet webhook` (input has `body.email`)
   - `Validate + prep` (output has `ok: true`, `pdf_url` contains `/dl/a72d025ff5beac1c57bc98b067969a07/free/...`)
   - `Valid?` (true branch)
   - `InfluencerSoft → tag lead` (HTTP 200; `neverError` masks IS rejections, so peek at the body — `{"success":true}` or similar)
   - `SMTP → deliver explainer PDF`
   - `Sheets → leads backup`
   - `Respond 303 → /free?confirmed=1`
6. **Inbox:** "Your STR Tax Loophole Explainer (8 pages)" arrives within ~30s. Click the PDF link. Expect `application/pdf`, no 403, opens to the 8-page magnet.
7. **Google Sheet:** a new row appears in `Leads` with `magnet=str-tax-loophole-explainer`, `source=strmanuals.com`, `landing_page=strmanuals.com/free`.
8. **InfluencerSoft:** lead exists with tags `magnet:str-tax-loophole-explainer`, `source:strmanuals.com`, `funnel:free-to-tax-playbook`. If a nurture sequence is wired to the magnet tag, the Day-0 message should be queued.

## Path B — invalid email

1. Open https://strmanuals.com/free in a private window.
2. Bypass HTML5 validation: DevTools console — `document.querySelector('form').action.includes('lead-magnet')` should be true, then `fetch(document.querySelector('form').action, {method:'POST', body: new URLSearchParams({email:'not-an-email', landing_page:'test'})})`.
3. **n8n:** latest execution shows `Validate + prep` returns `ok: false`, `Valid?` takes false branch, ends at `Respond 303 → /free?error=...`.
4. **Inbox / Sheet / IS:** no row, no email, no lead. Silence confirms the validation gate held.

## Path C — PDF link from email is reachable from a clean browser

This catches the failure mode where the hashed `/dl/` path returns 404 (e.g., SFTP upload missed a directory) — `Verify build output` step in CI won't catch this because the path is server-only.

1. Copy the PDF URL from the email received in Path A step 6.
2. Open in a clean incognito window (no cookies, no n8n session).
3. Expect: PDF renders. If 404, run `STRManuals/scripts/upload-pdfs-to-hostinger.ps1` and verify the file landed at `/home/u470667024/domains/strmanuals.com/public_html/dl/a72d025ff5beac1c57bc98b067969a07/free/tax-loophole-explainer.pdf` (ssh in and `ls -la` if scp succeeded).

## Cleanup

- Delete the throwaway lead from InfluencerSoft so it doesn't poison conversion stats.
- Optionally delete the throwaway row from the Sheet, or tag it `test:smoke` for filter-out.

## Failure recipes

| Symptom | Likely cause | Fix |
|---|---|---|
| 502 from n8n on POST | Workflow not activated, or webhook URL stale | Toggle Active; verify `PUBLIC_N8N_WEBHOOK_BASE` |
| Email arrives but PDF link 404s | PDFs not on server, or hash mismatch | Run `upload-pdfs-to-hostinger.ps1`; confirm n8n env `STRMANUALS_DOWNLOAD_HASH` matches `STRManuals/site/.env` |
| n8n execution succeeds, no email | SMTP credential picking wrong account / Hostinger SMTP throttled | Check n8n credentials panel; resend; check Hostinger mail logs |
| Sheet row missing | Google credential expired (re-auth needed) | Refresh OAuth in n8n credentials |
| IS lead exists but no tags | `add_tags` param empty (env var not set) | Check `INFLUENCERSOFT_API_KEY` env var resolves; check `add_tags` in execution payload |
| `Validate + prep` returns `missing_download_hash` | n8n env var not set | Settings → Environment → add `STRMANUALS_DOWNLOAD_HASH=a72d025ff5beac1c57bc98b067969a07` and restart n8n |
