import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  issueToken,
  verifyToken,
  isValidEmail,
  maskEmail,
  tokenHash,
} from '../../server/lib/email-verify';
import { buildCookie, readVerifiedEmail } from '../../server/lib/verified-cookie';

describe('isValidEmail', () => {
  it('accepts well-formed', () => {
    expect(isValidEmail('host@example.com')).toBe(true);
  });
  it('rejects malformed', () => {
    expect(isValidEmail('no-at-sign')).toBe(false);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('  ')).toBe(false);
  });
});

describe('maskEmail', () => {
  it('keeps domain visible, masks local part', () => {
    expect(maskEmail('daniel@example.com')).toBe('d***l@example.com');
    expect(maskEmail('jo@example.com')).toBe('j*@example.com');
  });
});

describe('issue/verifyToken', () => {
  beforeEach(() => {
    process.env.EMAIL_VERIFY_SECRET = 'a-test-secret-with-enough-bytes';
  });
  afterEach(() => {
    delete process.env.EMAIL_VERIFY_SECRET;
  });

  it('issues a token that round-trips', () => {
    const issued = issueToken('Daniel@Example.com');
    expect(issued.email).toBe('daniel@example.com');
    expect(issued.expiresAt.getTime()).toBeGreaterThan(Date.now());
    const result = verifyToken(issued.token);
    expect(result.ok).toBe(true);
    expect(result.email).toBe('daniel@example.com');
  });

  it('tokenHash is sha256 hex of the token', () => {
    const issued = issueToken('host@example.com');
    expect(issued.tokenHash).toMatch(/^[0-9a-f]{64}$/);
    expect(tokenHash(issued.token)).toBe(issued.tokenHash);
  });

  it('rejects a tampered token', () => {
    const issued = issueToken('host@example.com');
    const tampered = issued.token.slice(0, -2) + 'AB';
    expect(verifyToken(tampered).ok).toBe(false);
  });

  it('rejects a token signed with a different secret', () => {
    const issued = issueToken('host@example.com');
    process.env.EMAIL_VERIFY_SECRET = 'a-different-test-secret-bytes-here';
    expect(verifyToken(issued.token).ok).toBe(false);
  });

  it('throws when secret is missing or short', () => {
    delete process.env.EMAIL_VERIFY_SECRET;
    expect(() => issueToken('host@example.com')).toThrow();
  });

  it('rejects invalid emails at issue time', () => {
    expect(() => issueToken('not-an-email')).toThrow();
  });
});

describe('verified cookie', () => {
  beforeEach(() => {
    process.env.EMAIL_VERIFY_SECRET = 'a-test-secret-with-enough-bytes';
  });
  afterEach(() => {
    delete process.env.EMAIL_VERIFY_SECRET;
  });

  it('round-trips a valid email', () => {
    const cookieHeader = buildCookie('daniel@example.com');
    // Parse the Set-Cookie value back into a Cookie request header.
    const value = cookieHeader.split(';')[0]!;
    expect(readVerifiedEmail(value)).toBe('daniel@example.com');
  });

  it('rejects a tampered cookie', () => {
    const cookieHeader = buildCookie('daniel@example.com');
    const value = cookieHeader.split(';')[0]!;
    const tampered = value.slice(0, -2) + '00';
    expect(readVerifiedEmail(tampered)).toBeNull();
  });

  it('returns null when no cookie is set', () => {
    expect(readVerifiedEmail(undefined)).toBeNull();
    expect(readVerifiedEmail('other=foo')).toBeNull();
  });
});
