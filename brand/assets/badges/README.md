# Customer attribution badges

For the W45 customer → embed loop ([infrastructure/n8n/workflows/W45-customer-embed-loop.md](../../../infrastructure/n8n/workflows/W45-customer-embed-loop.md)).

Customers who left 4+ star reviews receive a Day-21 follow-up email asking them to embed an attribution badge on their own STR-related content (blog post, FB group resource list, member-only forum, etc.). The badge links back to thestrledger.com pre-tagged with their `customer_id` UTM, which W45 Branch B detects in referrer logs.

## Files

| File | When to use |
|------|-------------|
| [built-with-strledger.svg](./built-with-strledger.svg) | Default — Parchment background. Use on light-themed customer pages (90%+ of cases) |
| [built-with-strledger-dark.svg](./built-with-strledger-dark.svg) | Dark variant — Harbor Navy background. Use on dark-themed customer pages |

Both are 180×54px vector. Render crisp at 1x/2x/3x. Brand colors locked per [brand/brand-decisions.md §4](../../brand-decisions.md).

## Deployment (one-time)

These files must be hosted on thestrledger.com so customer pages can `<img src="...">` them. Upload via Hostinger SFTP to `public_html/badges/`:

```bash
sftp <hostinger-user>@thestrledger.com
cd public_html
mkdir -p badges
put built-with-strledger.svg badges/
put built-with-strledger-dark.svg badges/
```

Verify reachable:

```bash
curl -I https://thestrledger.com/badges/built-with-strledger.svg
# Expect: HTTP/2 200, Content-Type: image/svg+xml
```

Cache-Control: set 30-day cache via Hostinger `.htaccess`:

```apache
<FilesMatch "\.svg$">
  Header set Cache-Control "public, max-age=2592000"
</FilesMatch>
```

## Embed snippet (what W45 sends to customers)

```html
<a href="https://thestrledger.com?utm_source=customer-embed&utm_campaign=str-ledger-badge&utm_content=<customer_id>"
   target="_blank" rel="noopener">
  <img src="https://thestrledger.com/badges/built-with-strledger.svg"
       alt="Built with The STR Ledger templates"
       width="180" height="54" loading="lazy">
</a>
```

W45 Branch A populates `<customer_id>` per recipient so referrer detection can link each embed back to its referring customer record in Airtable.

## Anti-patterns

- ❌ Don't bitmap the SVG to PNG — vector renders better on retina screens and loads faster
- ❌ Don't add hover effects in the SVG — these don't render on external sites and bloat the file
- ❌ Don't translate the badge to other locales — STR Ledger is English-speaking US/CA/AU/UK only at this stage
- ❌ Don't use the badge in your own marketing (avoid "Built with X" on X's own site — looks self-referential)
- ❌ Don't change colors per customer request — the locked palette enforces brand entity consistency for AI-citation entity graph

## Iteration log

- `2026-05-11` — Initial 180×54 badge + dark variant. Brand v1.1 palette (Harbor Navy, Parchment, Muted Gold, Graphite).
