export const prerender = false;

import type { APIRoute } from 'astro';
import { postToN8n } from '../../lib/n8n';

const SITE = (): string =>
  import.meta.env.SITE || process.env.SITE || 'https://strmanuals.com';

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get('content-type') || '';
  let email = '';
  let firstName = '';
  let landingPage = '';

  if (contentType.includes('application/json')) {
    const body = await request.json();
    email = (body.email || '').toString().toLowerCase().trim();
    firstName = (body.first_name || body.firstName || '').toString().trim();
    landingPage = (body.landing_page || '').toString();
  } else {
    const form = await request.formData();
    email = (form.get('email') ?? '').toString().toLowerCase().trim();
    firstName = (form.get('first_name') ?? '').toString().trim();
    landingPage = (form.get('landing_page') ?? '').toString();
  }

  if (!email || !email.includes('@')) {
    return new Response('Valid email required', { status: 400 });
  }

  await postToN8n('/webhook/lead-magnet-strmanuals-tax-explainer', {
    form_slug: 'strmanuals-tax-explainer',
    email,
    first_name: firstName,
    landing_page: landingPage || request.headers.get('referer') || '',
    submitted_at: new Date().toISOString(),
    source: 'strmanuals',
  });

  // Browsers POSTing forms get redirected to a confirmation state.
  if (!contentType.includes('application/json')) {
    return redirect(`${SITE()}/free?confirmed=1`, 303);
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
