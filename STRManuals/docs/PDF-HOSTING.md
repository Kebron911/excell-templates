# PDF Hosting Strategy for strmanuals.com (Path B)

**Status:** decision pending
**Last updated:** 2026-05-11
**Context:** Path B (static site, no `/api/download` HMAC server). n8n W01b
needs to put a working PDF link in the order-confirmation email.

The 6 manual PDFs + the free explainer currently live at:

```
STRManuals/site/private/manuals/{slug}/v1.pdf
STRManuals/site/private/free/tax-loophole-explainer.pdf
```

They are outside `public_html` and not served by the static deploy. We
need a delivery path.

---

## Option 1 — Unguessable URL inside `public_html` *(recommended for launch)*

**Idea:** copy PDFs into the Hostinger docroot at a path with a long,
unpredictable hash. n8n emails the full URL to the buyer.

```
public_html/dl/9f3c4a7e2b1d8e6f5a/str-tax-loophole-playbook/v1.pdf
public_html/dl/9f3c4a7e2b1d8e6f5a/material-participation-survival-kit/v1.pdf
... (one path per SKU)
public_html/dl/free-3b8d2c1a4f6e9b0d/tax-loophole-explainer.pdf
```

**Pros**
- Zero new infrastructure. Same rsync deploy. Hostinger serves the PDF
  as a static asset at full disk speed.
- Implementation is "copy the file in" — minutes of work.
- n8n W01b Normalize node already builds a URL string; we just point it
  at the unguessable path.

**Cons**
- One leaked URL → public for the lifetime of that hash. No expiry.
- No per-buyer watermark.
- Rotating the hash means a new deploy + email to existing buyers.

**Implementation**
1. Pick a hash:
   ```
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   ```
   Save it as `STRMANUALS_DOWNLOAD_HASH` in repo root `.env`.
2. Add a build step to `STRManuals/site/scripts` that copies PDFs from
   `private/` into `dist/dl/{HASH}/...` post-build.
3. Update W01b Normalize node `downloadUrl` to:
   `https://strmanuals.com/dl/{HASH}/{slug}/v1.pdf`
4. Add `dl/` to `dist/` exclusion in `.gitignore` (so the hashed copies
   never enter git).
5. Rotation policy: rotate the hash every 90 days; existing buyers can
   re-request via an n8n "resend" workflow that emails the current URL.

This is what I would build for a v0.1 launch. Watermarking + expiry can
arrive later by switching back to Path A.

---

## Option 2 — Pre-signed bucket URLs

**Idea:** upload PDFs to Cloudflare R2 / Backblaze B2 / S3, n8n
generates a 24h pre-signed URL per order, emails that.

**Pros**
- Real per-order expiry. Each link dies in 24h.
- Bucket bandwidth scales independently.

**Cons**
- New account (R2/B2 are cheapest — R2 free egress is ideal).
- New credentials on n8n + a presigning step (R2 SDK or `aws sdk` with
  R2 endpoint).
- Cost ~$0 at strmanuals scale but operational overhead is real.

**Implementation sketch**
1. Create R2 bucket `strmanuals-pdfs`, upload `private/manuals/**`.
2. Add R2 access key + secret to n8n env.
3. New Code node before "IS · Assign to sequence" that generates a
   pre-signed GET URL for `{slug}/v1.pdf` with 24h expiry. AWS SDK v3
   in n8n: import `@aws-sdk/s3-request-presigner`.
4. Pass the signed URL as `download_url` merge var.

Worth doing for v0.2+ when sharing-abuse becomes a measurable problem.

---

## Option 3 — PDF as IS email attachment

**Idea:** n8n fetches the PDF binary from a fixed location, base64-
encodes it, attaches to the IS email API call directly. No URL ever
leaves the email.

**Pros**
- No external hosting needed at all.
- The PDF is the email — buyers can't re-download from a link.

**Cons**
- Depends on IS API supporting per-recipient attachments. Many
  email-sequence platforms only allow attachments on the *template*,
  not per-send.
- Large attachments (>5MB) hit Gmail's clip-the-message threshold,
  hurting deliverability.
- Per-recipient attachments inflate IS storage usage.

**Implementation gate:** confirm via IS API docs that the
`AssignToSequence` (or its real name) accepts an `attachments` array.
If yes, n8n W01b adds a Read-File step before the IS call.

Likely **not worth pursuing unless 1 and 2 both fail**.

---

## Recommendation

Ship **Option 1** for launch. Two reasons:
1. It's the only one that's done in the time it takes to copy six
   files into a folder.
2. The leak-risk is real but small — strmanuals isn't a high-piracy
   target at v0.1, and a 90-day rotation cadence caps blast radius.

Migrate to Option 2 after the first 100 orders or first verified
sharing incident, whichever comes first.

## What needs to change once decided

Three things land together:

1. **n8n W01b Normalize node** — set `downloadUrl` to the chosen scheme.
   Current placeholder: `https://downloads.strmanuals.com/private/${slug}/v1.pdf`.
2. **Deploy step or post-deploy script** that puts the PDFs at the chosen
   path. For Option 1: a `scripts/copy-pdfs-to-dist.mjs` added to the
   build workflow. For Option 2: a one-time `aws s3 cp` upload.
3. **`STRManuals/DEPLOY-STATUS.md`** — un-check the "PDF hosting" gate
   item once the URL pattern is live and reachable.
