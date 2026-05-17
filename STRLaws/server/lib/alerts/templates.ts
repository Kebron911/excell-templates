/**
 * Email body templates for confirmation + alert messages.
 *
 * Plain-text first; HTML is a minimal wrapper that delivers cleanly in
 * Gmail/Outlook without inline-CSS gymnastics. All copy is keyed off
 * severity so the alert dispatcher just picks the right helper.
 */
import type { AlertSeverity, EmailMessage } from './types';

const SITE_URL = process.env.PUBLIC_SITE_URL ?? 'https://strlaws.com';

const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  major: 'Major change',
  material: 'Material update',
  minor: 'Minor update',
};

function htmlWrap(bodyHtml: string): string {
  return [
    '<!doctype html>',
    '<html><head><meta charset="utf-8"></head>',
    '<body style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif; color: #1a2237; max-width: 560px; margin: 0 auto; padding: 24px;">',
    bodyHtml,
    '<hr style="border: 0; border-top: 1px solid #e0d9c8; margin: 32px 0 16px;">',
    `<p style="font-size: 12px; color: #6b6856;">STRLaws · <a href="${SITE_URL}/legal/sources" style="color: #6b6856;">Methodology</a> · <a href="${SITE_URL}/unsubscribe" style="color: #6b6856;">Unsubscribe</a></p>`,
    '<p style="font-size: 12px; color: #6b6856;">STRLaws is an information service, not legal advice. Always verify regulations with your local jurisdiction.</p>',
    '</body></html>',
  ].join('\n');
}

export interface ConfirmTemplateInput {
  toEmail: string;
  confirmToken: string;
}

export function confirmationEmail(input: ConfirmTemplateInput): EmailMessage {
  const confirmUrl = `${SITE_URL}/api/alerts/confirm?token=${encodeURIComponent(input.confirmToken)}`;
  const text =
    `Welcome to STRLaws alerts.\n\n` +
    `Click to confirm your subscription:\n${confirmUrl}\n\n` +
    `If you didn't sign up, just ignore this email — you won't receive anything else.\n\n` +
    `— STRLaws`;
  const html = htmlWrap(
    `<h2 style="margin: 0 0 16px;">Confirm your STRLaws alerts</h2>` +
    `<p>Click the button below to confirm your subscription. We'll email you when short-term-rental regulations change in cities you're watching.</p>` +
    `<p style="margin: 24px 0;"><a href="${confirmUrl}" style="background: #1a2237; color: #f3ead5; padding: 10px 18px; text-decoration: none; border-radius: 4px; display: inline-block;">Confirm subscription</a></p>` +
    `<p style="font-size: 14px; color: #5a5a4a;">Or paste this link into your browser:<br><span style="word-break: break-all;">${confirmUrl}</span></p>` +
    `<p style="font-size: 14px; color: #5a5a4a;">If you didn't sign up, ignore this email.</p>`,
  );
  return {
    to: input.toEmail,
    subject: 'Confirm your STRLaws alerts subscription',
    text,
    html,
    tags: { type: 'confirmation' },
  };
}

export interface AlertTemplateInput {
  toEmail: string;
  cityName: string;
  stateName: string;
  citySlug: string;
  stateSlug: string;
  severity: AlertSeverity;
  blogPostSlug: string | null;
  summary: string | null;
}

export function regulationChangeAlert(input: AlertTemplateInput): EmailMessage {
  const label = SEVERITY_LABEL[input.severity];
  const cityUrl = `${SITE_URL}/${input.stateSlug}/${input.citySlug}`;
  const blogUrl = input.blogPostSlug ? `${SITE_URL}/blog/${input.blogPostSlug}` : null;
  const summary = input.summary ?? `${label} to short-term-rental regulations in ${input.cityName}, ${input.stateName}.`;

  const subject = `${label}: ${input.cityName}, ${input.stateName} STR regulations`;

  const text =
    `${label}: ${input.cityName}, ${input.stateName}\n\n` +
    `${summary}\n\n` +
    (blogUrl ? `Read the full post: ${blogUrl}\n` : '') +
    `View current regulations: ${cityUrl}\n\n` +
    `— STRLaws`;

  const html = htmlWrap(
    `<p style="display: inline-block; background: ${input.severity === 'major' ? '#c95c2f' : input.severity === 'material' ? '#d4a64a' : '#cfc7af'}; color: #1a2237; padding: 4px 8px; border-radius: 3px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">${label}</p>` +
    `<h2 style="margin: 12px 0 16px;">${input.cityName}, ${input.stateName}</h2>` +
    `<p>${summary}</p>` +
    (blogUrl
      ? `<p style="margin: 24px 0;"><a href="${blogUrl}" style="background: #1a2237; color: #f3ead5; padding: 10px 18px; text-decoration: none; border-radius: 4px; display: inline-block;">Read the full post</a></p>`
      : '') +
    `<p style="font-size: 14px;"><a href="${cityUrl}" style="color: #6c4a1f;">View current regulations →</a></p>`,
  );

  return {
    to: input.toEmail,
    subject,
    text,
    html,
    tags: {
      type: 'regulation_change',
      severity: input.severity,
      city_slug: input.citySlug,
      state_slug: input.stateSlug,
    },
  };
}
