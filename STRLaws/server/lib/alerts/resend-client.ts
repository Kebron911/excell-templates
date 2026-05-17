/**
 * Resend transactional email provider (premium-tier alerts + confirmations).
 *
 * Lazy SDK load — works without RESEND_API_KEY at import time so the rest
 * of the alert pipeline (validation, routing, templates) is exercisable
 * before credentials arrive. When the key is absent, loadResendProvider
 * returns null and the caller decides whether to fail loud or fall through.
 */
import type { EmailMessage, EmailProvider, EmailSendResult } from './types';

export interface ResendSDKLike {
  emails: {
    send: (opts: {
      from: string;
      to: string | string[];
      subject: string;
      text: string;
      html?: string;
      tags?: Array<{ name: string; value: string }>;
    }) => Promise<{ data?: { id: string } | null; error?: { message: string } | null }>;
  };
}

export function createResendProvider(sdk: ResendSDKLike, fromAddress: string): EmailProvider {
  return {
    channel: 'resend',
    async send(message: EmailMessage): Promise<EmailSendResult> {
      try {
        const sendOpts: Parameters<typeof sdk.emails.send>[0] = {
          from: fromAddress,
          to: message.to,
          subject: message.subject,
          text: message.text,
          html: message.html,
        };
        if (message.tags) {
          sendOpts.tags = Object.entries(message.tags).map(([name, value]) => ({ name, value }));
        }
        const response = await sdk.emails.send(sendOpts);
        if (response.error) {
          return { providerMessageId: null, status: 'failed', errorMessage: response.error.message };
        }
        return {
          providerMessageId: response.data?.id ?? null,
          status: 'sent',
          errorMessage: null,
        };
      } catch (err) {
        return {
          providerMessageId: null,
          status: 'failed',
          errorMessage: err instanceof Error ? err.message : 'unknown resend error',
        };
      }
    },
  };
}

export async function loadResendProvider(): Promise<EmailProvider | null> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !fromAddress) return null;
  try {
    const mod = await import('resend');
    const ResendCtor = (mod as { Resend?: unknown }).Resend
      ?? (mod as { default?: unknown }).default;
    if (!ResendCtor) return null;
    const Ctor = ResendCtor as new (key: string) => ResendSDKLike;
    return createResendProvider(new Ctor(apiKey), fromAddress);
  } catch {
    return null;
  }
}
