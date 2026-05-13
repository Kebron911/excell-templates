# C3 — Per-Order Signed Download URLs

**Status:** spec only — not yet deployed
**Created:** 2026-05-13 (from audit AUDIT-2026-05-13.md)
**Owner:** needs n8n + Cloudflare Worker collaboration

---

## Problem

Today, the PDF download URL is `https://strmanuals.com/dl/<BUILD_HASH>/<slug>/v1.pdf` where `<BUILD_HASH>` comes from `STRMANUALS_DOWNLOAD_HASH` and is **identical for every customer** until rotated. One shared link in a Facebook group leaks the whole library.

Rotating the hash breaks every existing customer's email at the same time, so we can't rotate reactively.

## Goal

Each customer's email contains a download URL valid:
- **For that customer only** (or at least time-bounded so leaks expire)
- **For 7 days from purchase** (matches the 14-day refund window with margin)
- **Without per-customer state in a database** (n8n + Workers, no Postgres add)

## Design — HMAC-signed Worker

```
Customer pays → Stripe webhook → n8n W01b composes URL:

  https://dl.strmanuals.com/<slug>/v1.pdf?
    e=<expEpochSec>&
    s=<HMAC_SHA256(slug + e + orderId, DOWNLOAD_SECRET)>&
    o=<orderId>

n8n sends email with that URL.

Customer clicks → Cloudflare Worker on dl.strmanuals.com:
  1. Parse {slug, e, s, o} from URL.
  2. Reject if e < now.
  3. Recompute HMAC; reject if mismatch.
  4. Stream the PDF from R2 (or proxy from origin).
  5. Set Content-Disposition: attachment; filename="STR-<slug>.pdf"
```

## Why this shape

- **Stateless** — no DB lookup per download. HMAC is the only check.
- **One secret** — `DOWNLOAD_SECRET` lives in Cloudflare + n8n env. Rotating it invalidates ALL outstanding links (use sparingly — emergency only).
- **Token is the link** — no separate "claim" step the customer has to perform.
- **Pirated link expires** — sharing the URL works until `e` passes; after that, garbage.
- **No customer email in the URL** — minimizes the leak surface if the URL ends up in browser history / referer headers.

## Cloudflare Worker (full source)

```js
// dl.strmanuals.com Worker
// Env vars (set in Workers dashboard):
//   DOWNLOAD_SECRET — same as n8n's DOWNLOAD_SECRET
//   R2_BUCKET       — R2 binding (or use fetch() to origin)

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const parts = url.pathname.split('/').filter(Boolean); // ['<slug>', 'v1.pdf']
    if (parts.length !== 2 || parts[1] !== 'v1.pdf') {
      return new Response('Not found', { status: 404 });
    }
    const slug = parts[0];
    const exp = url.searchParams.get('e');
    const sig = url.searchParams.get('s');
    const order = url.searchParams.get('o');

    if (!exp || !sig || !order) return new Response('Bad request', { status: 400 });

    const now = Math.floor(Date.now() / 1000);
    if (Number(exp) < now) {
      return new Response('Link expired. Email hello@strmanuals.com with your order reference for a fresh one.', {
        status: 410, headers: { 'Content-Type': 'text/plain' }
      });
    }

    const payload = `${slug}|${exp}|${order}`;
    const expected = await hmac(env.DOWNLOAD_SECRET, payload);
    if (!safeEqual(sig, expected)) return new Response('Invalid signature', { status: 403 });

    // Stream from R2
    const obj = await env.R2_BUCKET.get(`manuals/${slug}/v1.pdf`);
    if (!obj) return new Response('Not found', { status: 404 });

    return new Response(obj.body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="STR-${slug}.pdf"`,
        'Cache-Control': 'private, no-store',
      },
    });
  },
};

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const buf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
```

## n8n W01b — URL composition (Code node)

```js
// Inputs from upstream Stripe webhook node:
//   $json.customer_email
//   $json.metadata.sku           ('MAN-TAX-01' etc.)
//   $json.id                     (Stripe session ID — becomes orderId)
//
// Output: emailable URL.

const SKU_TO_SLUG = {
  'MAN-TAX-01': 'tax-01',
  'MAN-TAX-02': 'tax-02',
  'MAN-REV-01': 'rev-01',
  'MAN-REV-02': 'rev-02',
  'MAN-LGL-01': 'lgl-01',
  'MAN-BUNDLE-01': 'bundle', // bundle delivers a single zip OR loops to send 5 emails — TBD
};

const slug = SKU_TO_SLUG[$json.metadata.sku];
if (!slug) throw new Error(`Unknown SKU: ${$json.metadata.sku}`);

const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;   // 7 days
const orderId = $json.id;                                     // cs_test_... or cs_live_...
const payload = `${slug}|${exp}|${orderId}`;

const secret = $env.DOWNLOAD_SECRET;
const crypto = require('crypto');
const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');

const url = `https://dl.strmanuals.com/${slug}/v1.pdf?e=${exp}&s=${sig}&o=${encodeURIComponent(orderId)}`;
return [{ json: { url, slug, customer_email: $json.customer_email, order_id: orderId } }];
```

## R2 setup (one-time)

```bash
# Create bucket
wrangler r2 bucket create strmanuals-pdfs

# Upload manuals (one-time + each release)
for sku in tax-01 tax-02 rev-01 rev-02 lgl-01; do
  wrangler r2 object put "strmanuals-pdfs/manuals/${sku}/v1.pdf" \
    --file="STRManuals/manuscripts/output/${sku}/v1.pdf"
done

# Bind R2 to Worker in wrangler.toml:
#   [[r2_buckets]]
#   binding = "R2_BUCKET"
#   bucket_name = "strmanuals-pdfs"
```

## DNS / routing

- Cloudflare zone `strmanuals.com`: add `dl` CNAME → Worker route `dl.strmanuals.com/*` → `strmanuals-download` Worker.
- Keep the existing `/dl/<HASH>/<slug>/v1.pdf` static path working for ~14 days so any outstanding email links don't break.

## Re-request flow (customer support)

When a customer emails "my link expired":

1. Look up their order in Stripe by session-ID suffix (from thank-you page reference).
2. Trigger n8n re-issue workflow (manual call to W01b with new exp).
3. Send fresh URL.

Eventually, a `/downloads` page that takes `?email=` + magic-link auth could automate this — but for v1 it's a manual support flow.

## Migration plan

| Phase | Action | Risk |
|---|---|---|
| 1 | Deploy Worker, copy PDFs to R2, leave old `/dl/<HASH>/` path working | None — additive |
| 2 | Update n8n W01b to compose signed URL | Old purchases still receive old-format links until W01b changes |
| 3 | After 14 days, kill the old `/dl/<HASH>/` static path | All in-flight refund-window orders have had time to download |
| 4 | (Optional) Build `/downloads` self-service re-request page | Reduces support volume long-term |

## What to do today (no Worker yet)

If the Worker can't ship this week, an interim mitigation:

- **Rotate `STRMANUALS_DOWNLOAD_HASH` monthly** (was already supported by the build pipeline).
- **Email active customers** the new URL on rotation.
- This bounds the leak window to ~30 days rather than "forever," with zero engineering cost.

## Open questions

- **Bundle delivery** — single zip URL, or 5 separate URLs in one email? Spec assumes the latter (5 HMACs); confirm preference.
- **R2 vs. continuing to ship PDFs in `dist/`** — current Path B has PDFs in the static deploy. R2 is cleaner but adds a service. Worker can also `fetch()` from `https://strmanuals.com/dl/<HASH>/...` (the static path) for now, gating with HMAC at the edge. Keeps the storage story unchanged.
- **Free magnet PDF** — does it need signing too? Probably not (it's free; piracy here is a marketing win, not a loss). Leave unsigned.
