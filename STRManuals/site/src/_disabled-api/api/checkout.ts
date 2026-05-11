export const prerender = false;

import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const getStripe = () => {
  const key = import.meta.env.STRIPE_SECRET || process.env.STRIPE_SECRET;
  if (!key) throw new Error('STRIPE_SECRET not set');
  return new Stripe(key, { apiVersion: '2026-04-22.dahlia' as Stripe.LatestApiVersion });
};

const SITE = (): string =>
  import.meta.env.SITE || process.env.SITE || 'https://strmanuals.com';

export const GET: APIRoute = async ({ url }) => {
  const priceId = url.searchParams.get('price');
  if (!priceId) {
    return new Response('Missing price parameter', { status: 400 });
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE()}/thank-you?session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE()}/`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_creation: 'always',
      metadata: { source: 'strmanuals' },
    });
  } catch (err) {
    console.error('Stripe checkout creation failed', err);
    return new Response('Checkout creation failed', { status: 502 });
  }

  if (!session.url) {
    return new Response('Stripe did not return a session URL', { status: 502 });
  }
  return Response.redirect(session.url, 303);
};
