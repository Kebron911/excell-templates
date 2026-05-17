import { describe, expect, it } from 'vitest';
import { assertValidEmail, emailSchema, InvalidEmailError, normalizeEmail } from '../../server/lib/alerts/email-validate';

describe('emailSchema', () => {
  it('accepts a standard email', () => {
    expect(emailSchema.safeParse('daniel@example.com').success).toBe(true);
  });

  it('rejects malformed email', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false);
  });

  it('rejects empty string', () => {
    expect(emailSchema.safeParse('').success).toBe(false);
  });

  it('lowercases on parse', () => {
    const r = emailSchema.safeParse('Daniel@Example.COM');
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBe('daniel@example.com');
  });

  it('trims whitespace', () => {
    const r = emailSchema.safeParse('  daniel@example.com  ');
    expect(r.success).toBe(true);
  });

  it('rejects disposable domain (mailinator)', () => {
    expect(emailSchema.safeParse('test@mailinator.com').success).toBe(false);
  });

  it('rejects disposable domain (10minutemail)', () => {
    expect(emailSchema.safeParse('test@10minutemail.com').success).toBe(false);
  });

  it('rejects emails > 320 chars', () => {
    const long = `${'a'.repeat(320)}@example.com`;
    expect(emailSchema.safeParse(long).success).toBe(false);
  });

  it('allows + tagging', () => {
    expect(emailSchema.safeParse('daniel+strlaws@example.com').success).toBe(true);
  });
});

describe('assertValidEmail', () => {
  it('returns the normalized email when valid', () => {
    expect(assertValidEmail('DANIEL@EXAMPLE.COM')).toBe('daniel@example.com');
  });

  it('throws InvalidEmailError on bad input', () => {
    expect(() => assertValidEmail('xxx')).toThrow(InvalidEmailError);
  });
});

describe('normalizeEmail', () => {
  it('best-effort normalizes even invalid email so caller can still log it', () => {
    expect(normalizeEmail('  XXX  ')).toBe('xxx');
  });
});
