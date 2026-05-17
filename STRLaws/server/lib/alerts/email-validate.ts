/**
 * Email validation for the signup endpoint.
 *
 * Pragmatic — covers RFC 5322 syntax, length cap from the schema
 * (alert_subscribers.email VARCHAR(320)), and rejects the worst
 * disposable-mail domains so the free-alerts list stays cleanish.
 */
import { z } from 'zod';

// Subset of the long disposable-domain list. Sufficient for free-tier
// hygiene; full list is too aggressive (kills legitimate aliases).
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  '10minutemail.com',
  'throwaway.email',
  'yopmail.com',
  'trashmail.com',
  'getnada.com',
  'maildrop.cc',
  'sharklasers.com',
  'dispostable.com',
]);

export const emailSchema = z
  .string()
  .trim()
  .max(320, 'Email too long')
  .toLowerCase()
  .email('Invalid email format')
  .refine((e) => {
    const domain = e.split('@')[1] ?? '';
    return !DISPOSABLE_DOMAINS.has(domain);
  }, 'Disposable email domains are not accepted');

export function normalizeEmail(raw: string): string {
  const parsed = emailSchema.safeParse(raw);
  if (!parsed.success) return raw.trim().toLowerCase();
  return parsed.data;
}

export class InvalidEmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidEmailError';
  }
}

export function assertValidEmail(raw: string): string {
  const parsed = emailSchema.safeParse(raw);
  if (!parsed.success) {
    throw new InvalidEmailError(parsed.error.issues[0]?.message ?? 'Invalid email');
  }
  return parsed.data;
}
