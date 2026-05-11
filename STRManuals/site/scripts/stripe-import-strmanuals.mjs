#!/usr/bin/env node
/**
 * stripe-import-strmanuals.mjs — Create the 6 strmanuals.com SKUs in Stripe.
 *
 * DRY-RUN BY DEFAULT. No live API calls unless --live is passed.
 *
 * Creates: Product + Price + PaymentLink for each of:
 *   MAN-TAX-01, MAN-TAX-02, MAN-REV-01, MAN-REV-02, MAN-LGL-01, MAN-BUNDLE-01.
 *
 * Reads STRIPE_SECRET from STRManuals/site/.env (via dotenv).
 *
 * Statement descriptor: "STR MANUALS"
 * Metadata on every Product/Price: { sku, slug, kind, source: "strmanuals-v1" }
 * Idempotency keys derived from SKU code — re-running is safe.
 *
 * Output:
 *   - Console table: SKU | product_id | price_id | payment_link
 *   - File: ops/strmanuals-stripe-results.csv (every run)
 *   - File: STRManuals/site/.env.strmanuals.snippet (paste-ready STRIPE_PRICE_* lines)
 *
 * Usage:
 *   node scripts/stripe-import-strmanuals.mjs           # dry-run
 *   node scripts/stripe-import-strmanuals.mjs --live    # create in Stripe
 *   node scripts/stripe-import-strmanuals.mjs --filter TAX-01   # subset
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SITE_ROOT, '..', '..');

dotenv.config({ path: path.join(SITE_ROOT, '.env') });

const args = process.argv.slice(2);
const LIVE = args.includes('--live');
const filterIdx = args.indexOf('--filter');
const FILTER = filterIdx >= 0 ? args[filterIdx + 1] : null;

const SITE_URL = process.env.SITE || 'https://strmanuals.com';

const CATALOG = [
  {
    sku: 'MAN-TAX-01',
    slug: 'str-tax-loophole-playbook',
    name: 'The STR Tax Loophole Playbook',
    description:
      'Plain-English on the short-term rental loophole — who qualifies, how to document it, and where it goes wrong. 48-page PDF + companion P&L workbook.',
    price_cents: 2900,
    kind: 'manual',
  },
  {
    sku: 'MAN-TAX-02',
    slug: 'material-participation-survival-kit',
    name: 'Material Participation Survival Kit',
    description:
      'Hit the 100-hour / 500-hour test without losing the loophole. 36-page PDF + hours log template.',
    price_cents: 2900,
    kind: 'manual',
  },
  {
    sku: 'MAN-REV-01',
    slug: 'why-bookings-down',
    name: 'Why Are My Bookings Down? Diagnostic',
    description:
      'Step-by-step diagnostic for STR hosts watching bookings slide. 28-page PDF + break-even occupancy workbook.',
    price_cents: 1900,
    kind: 'manual',
  },
  {
    sku: 'MAN-REV-02',
    slug: 'direct-bookings-starter',
    name: 'Direct Bookings Starter',
    description:
      'The 90-day plan to take 25% of your bookings off Airbnb. 32-page PDF + email sequence pack.',
    price_cents: 2500,
    kind: 'manual',
  },
  {
    sku: 'MAN-LGL-01',
    slug: 'permit-regulation-survival',
    name: 'STR Permit & Regulation Survival Guide',
    description:
      'Decision tree for hosts in cities tightening STR rules. 30-page PDF + permit research worksheet.',
    price_cents: 2500,
    kind: 'manual',
  },
  {
    sku: 'MAN-BUNDLE-01',
    slug: 'str-manuals-bundle',
    name: 'STR Manuals — All Five',
    description:
      'All five strmanuals.com manuals (~174 pages) plus every companion workbook. Save $28 vs à la carte.',
    price_cents: 9900,
    kind: 'bundle',
  },
];

const PRICE_ID_ENV = {
  'MAN-TAX-01': 'STRIPE_PRICE_TAX_01',
  'MAN-TAX-02': 'STRIPE_PRICE_TAX_02',
  'MAN-REV-01': 'STRIPE_PRICE_REV_01',
  'MAN-REV-02': 'STRIPE_PRICE_REV_02',
  'MAN-LGL-01': 'STRIPE_PRICE_LGL_01',
  'MAN-BUNDLE-01': 'STRIPE_PRICE_BUNDLE',
};

const items = FILTER ? CATALOG.filter((c) => c.sku.includes(FILTER)) : CATALOG;
if (items.length === 0) {
  console.error(`No SKUs matched filter "${FILTER}"`);
  process.exit(1);
}

console.log(`Mode: ${LIVE ? 'LIVE (will create in Stripe)' : 'DRY-RUN (no API calls)'}`);
console.log(`SKUs in this run: ${items.map((i) => i.sku).join(', ')}`);
console.log();

if (!LIVE) {
  for (const it of items) {
    console.log(`[dry] ${it.sku.padEnd(15)} ${('$' + it.price_cents / 100).padStart(7)}  ${it.name}`);
  }
  console.log('\nDry run complete. Re-run with --live to actually create in Stripe.');
  process.exit(0);
}

if (!process.env.STRIPE_SECRET) {
  console.error('ERROR: STRIPE_SECRET not set in STRManuals/site/.env');
  process.exit(2);
}

const Stripe = (await import('stripe')).default;
const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2024-12-18.acacia',
});

const results = [];
for (const it of items) {
  const idemBase = `strmanuals-v1-${it.sku}`;
  try {
    const product = await stripe.products.create(
      {
        name: it.name,
        description: it.description,
        metadata: {
          sku: it.sku,
          slug: it.slug,
          kind: it.kind,
          source: 'strmanuals-v1',
        },
      },
      { idempotencyKey: `${idemBase}-product` },
    );
    const price = await stripe.prices.create(
      {
        product: product.id,
        unit_amount: it.price_cents,
        currency: 'usd',
        metadata: {
          sku: it.sku,
          slug: it.slug,
          source: 'strmanuals-v1',
        },
      },
      { idempotencyKey: `${idemBase}-price` },
    );
    const link = await stripe.paymentLinks.create(
      {
        line_items: [{ price: price.id, quantity: 1 }],
        allow_promotion_codes: true,
        payment_intent_data: { statement_descriptor: 'STR MANUALS' },
        after_completion: {
          type: 'redirect',
          redirect: { url: `${SITE_URL}/thank-you?session={CHECKOUT_SESSION_ID}` },
        },
        metadata: { sku: it.sku, slug: it.slug, source: 'strmanuals-v1' },
      },
      { idempotencyKey: `${idemBase}-link` },
    );
    results.push({
      sku: it.sku,
      slug: it.slug,
      product_id: product.id,
      price_id: price.id,
      payment_link: link.url,
      env_var: PRICE_ID_ENV[it.sku],
    });
    console.log(`OK  ${it.sku}  ${price.id}`);
  } catch (e) {
    console.error(`FAIL ${it.sku}: ${e.message}`);
    results.push({ sku: it.sku, error: e.message });
  }
}

const OPS_DIR = path.join(REPO_ROOT, 'ops');
fs.mkdirSync(OPS_DIR, { recursive: true });
const CSV = path.join(OPS_DIR, 'strmanuals-stripe-results.csv');
fs.writeFileSync(
  CSV,
  'sku,slug,product_id,price_id,payment_link,env_var,error\n' +
    results
      .map((r) =>
        [
          r.sku,
          r.slug ?? '',
          r.product_id ?? '',
          r.price_id ?? '',
          r.payment_link ?? '',
          r.env_var ?? '',
          (r.error ?? '').replace(/[,"]/g, ' '),
        ].join(','),
      )
      .join('\n'),
);

const ENV_SNIPPET = path.join(SITE_ROOT, '.env.strmanuals.snippet');
const envLines = results
  .filter((r) => r.price_id)
  .map((r) => `${r.env_var}=${r.price_id}`)
  .join('\n');
fs.writeFileSync(ENV_SNIPPET, envLines + '\n');

console.log(`\nResults: ${CSV}`);
console.log(`Env snippet (paste into STRManuals/site/.env): ${ENV_SNIPPET}`);
