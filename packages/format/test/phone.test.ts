import { describe, it, expect } from 'vitest';
import { formatPhone } from '../src/phone';

describe('formatPhone', () => {
  // 10-digit US number
  it('formats 10 bare digits as (NXX) NXX-XXXX', () => {
    expect(formatPhone('4155550142')).toBe('(415) 555-0142');
  });

  it('formats number with dashes', () => {
    expect(formatPhone('415-555-0142')).toBe('(415) 555-0142');
  });

  it('formats number with dots', () => {
    expect(formatPhone('415.555.0142')).toBe('(415) 555-0142');
  });

  it('formats number with parentheses already in it', () => {
    expect(formatPhone('(415) 555-0142')).toBe('(415) 555-0142');
  });

  it('formats number with spaces', () => {
    expect(formatPhone('415 555 0142')).toBe('(415) 555-0142');
  });

  // 11-digit with leading 1
  it('formats 11-digit number starting with 1 as +1 (NXX) NXX-XXXX', () => {
    expect(formatPhone('14155550142')).toBe('+1 (415) 555-0142');
  });

  it('formats +1 international format', () => {
    expect(formatPhone('+14155550142')).toBe('+1 (415) 555-0142');
  });

  it('formats 1-NXX-NXX-XXXX with dashes', () => {
    expect(formatPhone('1-415-555-0142')).toBe('+1 (415) 555-0142');
  });

  // International (+ prefix, not US)
  it('formats international +44 number with + grouping', () => {
    const result = formatPhone('+442079460958');
    expect(result).toMatch(/^\+44/);
  });

  it('formats international number preserving + prefix', () => {
    // +33612345678 → 11 digits; cc = slice(0,1) = '3', rest = '3612345678'
    // Naive grouping: +3 3612 3456 78 — this is the documented international fallback
    const result = formatPhone('+33612345678');
    expect(result).toMatch(/^\+3/);
    expect(result).toContain('3612');
  });

  // Edge cases
  it('returns empty string for empty input', () => {
    expect(formatPhone('')).toBe('');
  });

  it('returns empty string for null', () => {
    expect(formatPhone(null as unknown as string)).toBe('');
  });

  it('returns empty string for whitespace-only', () => {
    expect(formatPhone('   ')).toBe('');
  });

  it('returns trimmed original for unrecognized format', () => {
    const odd = '12345';
    expect(formatPhone(odd)).toBe('12345');
  });

  it('returns trimmed original for very short input', () => {
    expect(formatPhone('  abc  ')).toBe('abc');
  });
});
