# thestrledger.com — site

Custom PHP/HTML site deployed to Hostinger Business at `thestrledger.com`.
Brand-aligned with `design-system/` (locked v1.1).

## Structure

```
site/
  public/                  ← deploys 1:1 to Hostinger DOC_ROOT
    index.php              home (12-SKU catalog + lead-magnet capture)
    product.php            product detail (driven by ?sku=, pretty URL via .htaccess)
    free.php               lead-magnet opt-in page (driven by ?id=)
    submit.php             form fallback handler (mail() + log)
    thank-you.php          post-opt-in
    terms.php
    privacy.php
    refunds.php
    about.php
    404.php
    .htaccess              pretty URLs, HTTPS canonical, security headers, gzip
    assets/css/site.css    production stylesheet (tokens lifted from design-system)
    assets/img/            (favicon, og-default — TODO)
    _inc/                  shared PHP includes (head, header, footer, lead-form, bootstrap)
    _data/                 products + magnets data (PHP arrays)
    _config/               config.example.php + config.php (gitignored)
  scripts/
    deploy.sh              rsync over SSH using STRLEDGER_* from .secrets/hostinger.env
  config.example.php       (deprecated — moved under public/_config/)
  README.md                this file
  .gitignore
```

The `_inc/`, `_data/`, `_config/` directories each contain `Require all denied`
.htaccess files so Apache won't serve their contents. PHP can still `include` them.

## Deploy

```bash
# Dry run first (see what would change)
bash site/scripts/deploy.sh --dry-run

# Actual deploy (overwrites placeholder Coming Soon page)
bash site/scripts/deploy.sh

# First-deploy convenience: also seed config.php from config.example.php on server
bash site/scripts/deploy.sh --init
```

`deploy.sh` reads `STRLEDGER_*` from `C:/Users/Kebron/Desktop/Claude OS/.secrets/hostinger.env`
and uses `$STRLEDGER_SSH_KEY_PATH` for auth.

## Placeholders that block first payment

These live in `site/public/_config/config.php` (created by copying
`config.example.php`). The site renders fine with empty values — buy buttons fall
back to the Etsy shop URL — but real revenue requires:

| Key | When you can fill it | Effect when empty |
|---|---|---|
| `is_product_urls[*]` | After IS sales pages exist | Each "Buy" button → Etsy shop URL |
| `is_form_endpoint` | After IS account + form built | Email opt-ins POST to `/submit.php` (mails support inbox + logs) |
| `is_magnet_tags[*]` | When IS list/tag dictionary loaded | No tag attached on POST to IS |
| `ga4_id` or `plausible_domain` | After analytics provisioned | No analytics tag rendered |
| `etsy_shop_url` | When Etsy shop is live | Defaults to `https://www.etsy.com/shop/TheSTRLedger` |
| `noindex` | Pre-launch only — set `true` to hide from search; flip `false` at G4 | Site is indexable |

**Stripe keys** are not required on the site. Per decision: customers click
"Buy" → land on the Influencersoft sales/checkout page. Stripe is the processor
behind IS, not on this site.

## Day-0 launch checklist (site only)

Site is independent of P0.0 email plumbing and P0.1 Daniel-only account work.
What this scaffold gives you, ready to ship:

- [x] Home + 12 product pages + 4 lead-magnet opt-ins + 4 legal/about + thank-you + 404
- [x] Lead capture (degrades to mail() until IS endpoint configured)
- [x] Pretty URLs, HTTPS canonical, security headers, gzip, 30-day asset cache
- [x] Brand-aligned per design-system v1.1 (Cormorant Garamond + Inter + JetBrains Mono, palette, four signatures)
- [x] Mobile-responsive
- [x] Deploy script (`site/scripts/deploy.sh`)

Pre-flight before deploy:

- [ ] `cp site/public/_config/config.example.php site/public/_config/config.php` and fill any placeholders you have
- [ ] Add favicon + apple-touch-icon + og-default.png to `site/public/assets/img/` (optional — pages render without)
- [ ] `bash site/scripts/deploy.sh --dry-run` and review the file list
- [ ] `bash site/scripts/deploy.sh --init` to deploy + seed remote config

Post-deploy smoke test:

- [ ] `curl -I https://thestrledger.com/` returns 200, no longer the Coming Soon page
- [ ] `https://thestrledger.com/products/TAX-001` renders the mileage-log product page
- [ ] `https://thestrledger.com/free/47-deductions` renders, form posts, you receive a `[lead]` email at `hello@thestrledger.com`
- [ ] `https://thestrledger.com/terms` `/privacy` `/refunds` all render
- [ ] `https://thestrledger.com/nonexistent` returns the branded 404 page

## After IS pages exist

1. Edit `site/public/_config/config.php`:
   ```php
   'is_product_urls' => [
     'TAX-001' => 'https://app.thestrledger.com/p/mileage-log',
     // ... fill in as IS pages go live
   ],
   'is_form_endpoint' => 'https://app.thestrledger.com/api/forms/lead',
   ```
2. `bash site/scripts/deploy.sh` — only the config diff goes up.
3. Verify: visit a product page, click Buy, confirm IS page loads.

## Known limitations / future work

- Bundle landing pages not built (P3.2 mentions tax-bundle landing — out of Day-0 scope; copy exists in `copy/product-pages/bundles/`).
- Blog explicitly skipped per Daniel's call.
- No Stripe code on site — all checkout via IS.
- No A/B testing harness; add later if needed.
- Lead log writes to `_data/leads-*.log` inside webroot; .htaccess denies direct access. Consider moving outside `public_html` once config is mature.
