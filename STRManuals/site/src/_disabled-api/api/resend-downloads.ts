export const prerender = false;

import type { APIRoute } from 'astro';
import { postToN8n } from '../../lib/n8n';

const SITE = (): string =>
  import.meta.env.SITE || process.env.SITE || 'https://strmanuals.com';

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get('content-type') || '';
  let email = '';

  if (contentType.includes('application/json')) {
    const body = await request.json();
    email = (body.email || '').toString().toLowerCase().trim();
  } else {
    const form = await request.formData();
    email = (form.get('email') ?? '').toString().toLowerCase().trim();
  }

  if (!email || !email.includes('@')) {
    return new Response('Valid email required', { status: 400 });
  }

  // Hand off to n8n — n8n looks up Airtable Orders by email,
  // generates fresh HMAC tokens for each owned SKU, and emails them via IS.
  // This endpoint never reveals whether the email matches an order
  // (always 200 OK to prevent enumeration).
  await postToN8n('/webhook/strmanuals-resend-downloads', {
    email,
    requested_at: new Date().toISOString(),
    source: 'strmanuals',
  });

  if (!contentType.includes('application/json')) {
    return redirect(`${SITE()}/downloads?sent=1`, 303);
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
