export const prerender = false;

import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { buildDownloadUrl, makeExpiry } from '../../lib/hmac';
import { getManual, skuFromPriceId } from '../../lib/manuals';
import { postToN8n } from '../../lib/n8n';

const stripe = () => {
  const key = import.meta.env.STRIPE_SECRET || process.env.STRIPE_SECRET;
  if (!key) throw new Error('STRIPE_SECRET not set');
  return new Stripe(key, { apiVersion: '2026-04-22.dahlia' as Stripe.LatestApiVersion });
};

const SITE = (): string =>
  import.meta.env.SITE || process.env.SITE || 'https://strmanuals.com';

const WEBHOOK_SECRET = (): string => {
  const s = import.meta.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;
  if (!s) throw new Error('STRIPE_WEBHOOK_SECRET not set');
  return s;
};

const NEXT_MANUAL: Record<string, { title: string; url: string }> = {
  'str-tax-loophole-playbook':         { title: 'Material Participation Survival Kit', url: `${SITE()}/manuals/tax-02` },
  'material-participation-survival-kit': { title: 'The STR Tax Loophole Playbook',     url: `${SITE()}/manuals/tax-01` },
  'why-bookings-down':                 { title: 'Direct Bookings Starter',             url: `${SITE()}/manuals/rev-02` },
  'direct-bookings-starter':           { title: 'Why Are My Bookings Down?',           url: `${SITE()}/manuals/rev-01` },
  'permit-regulation-survival':        { title: 'The STR Tax Loophole Playbook',       url: `${SITE()}/manuals/tax-01` },
};

export const POST: APIRoute = async ({ request }) => {
  const sig = request.headers.get('stripe-signature');
  if (!sig) return new Response('Missing signature', { status: 400 });

  const raw = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, sig, WEBHOOK_SECRET());
  } catch (err) {
    console.error('Stripe signature verification failed', err);
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response(JSON.stringify({ received: true, ignored: event.type }), { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const email = session.customer_details?.email ?? session.customer_email;
  if (!email) {
    console.error('No email on checkout session', session.id);
    return new Response('Missing email', { status: 400 });
  }

  const lineItems = await stripe().checkout.sessions.listLineItems(session.id, { limit: 5 });
  const priceId = lineItems.data[0]?.price?.id ?? '';
  const sku = skuFromPriceId(priceId);
  if (!sku) {
    console.error('Unknown price ID on checkout', priceId);
    return new Response('Unknown SKU', { status: 200 }); // 200 so Stripe doesn't retry
  }

  const manual = getManual(sku);
  if (!manual) return new Response('Unknown SKU', { status: 200 });

  const orderId = session.id;
  const expiry = makeExpiry(24);
  const downloadUrl = buildDownloadUrl(SITE(), { email, orderId, sku, expiry });
  const next = NEXT_MANUAL[sku];

  await postToN8n('/webhook/order-stripe', {
    source: 'strmanuals',
    order_id: orderId,
    timestamp: new Date().toISOString(),
    email,
    first_name: session.customer_details?.name?.split(' ')[0] ?? '',
    normalized_sku: sku,
    manual_title: manual.title,
    manual_short_sku: manual.shortSku,
    gross_amount_cents: session.amount_total ?? manual.priceCents,
    download_url: downloadUrl,
    download_expiry: new Date(expiry * 1000).toISOString(),
    companion_name: manual.companion.name,
    companion_url: manual.companion.url,
    next_manual_title: next?.title ?? '',
    next_manual_url: next?.url ?? '',
    stripe_customer_id: typeof session.customer === 'string' ? session.customer : '',
  });

  return new Response(JSON.stringify({ received: true }), { status: 200 });
};
