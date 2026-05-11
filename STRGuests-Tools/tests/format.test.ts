import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatAbbreviated,
  parseNumberInput,
  formatPhone,
} from '@str/format';

describe('formatCurrency', () => {
  it('formats whole dollars with two decimals', () => {
    expect(formatCurrency(1234)).toBe('$1,234.00');
  });

  it('formats fractional dollars with two decimals', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });

  it('rounds to two decimals', () => {
    expect(formatCurrency(1234.567)).toBe('$1,234.57');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('handles negatives', () => {
    expect(formatCurrency(-99.5)).toBe('-$99.50');
  });

  it('respects maximumFractionDigits override (cents-off mode)', () => {
    expect(formatCurrency(1234.5, { maximumFractionDigits: 0 })).toBe('$1,235');
  });

  it('returns "—" for non-finite inputs', () => {
    expect(formatCurrency(NaN)).toBe('—');
    expect(formatCurrency(Infinity)).toBe('—');
  });
});

describe('formatPercent', () => {
  it('treats values 0–1 as decimal percent (0.085 → "8.5%")', () => {
    expect(formatPercent(0.085)).toBe('8.5%');
  });

  it('treats values > 1 as already-percent (8.5 → "8.5%")', () => {
    expect(formatPercent(8.5)).toBe('8.5%');
  });

  it('handles 1 as 1% (already-percent form; use 1.0 → pass 100 for "100%")', () => {
    // @str/format boundary: |v| >= 1 is treated as already-percent.
    // The in-tree lib treated <= 1 as decimal — the shared package uses < 1.
    expect(formatPercent(1)).toBe('1%');
    expect(formatPercent(100)).toBe('100%');
  });

  it('handles 0 as 0%', () => {
    expect(formatPercent(0)).toBe('0%');
  });

  it('respects decimals option', () => {
    expect(formatPercent(0.0856, { decimals: 2 })).toBe('8.56%');
    expect(formatPercent(0.0856, { decimals: 0 })).toBe('9%');
  });

  it('returns "—" for non-finite inputs', () => {
    expect(formatPercent(NaN)).toBe('—');
  });
});

describe('formatNumber', () => {
  it('groups thousands with commas', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('respects decimals option', () => {
    expect(formatNumber(1234.5, { decimals: 1 })).toBe('1,234.5');
  });

  it('handles negative zero as 0', () => {
    expect(formatNumber(-0)).toBe('0');
  });

  it('returns "—" for non-finite inputs', () => {
    expect(formatNumber(NaN)).toBe('—');
  });
});

describe('formatAbbreviated', () => {
  it('returns plain number under 1,000', () => {
    expect(formatAbbreviated(999)).toBe('999');
  });

  it('abbreviates thousands as K', () => {
    expect(formatAbbreviated(1234)).toBe('1.2K');
    expect(formatAbbreviated(15_000)).toBe('15K');
  });

  it('abbreviates millions as M', () => {
    expect(formatAbbreviated(1_234_567)).toBe('1.2M');
    expect(formatAbbreviated(15_000_000)).toBe('15M');
  });

  it('abbreviates billions as B', () => {
    expect(formatAbbreviated(2_500_000_000)).toBe('2.5B');
  });

  it('handles negatives', () => {
    expect(formatAbbreviated(-1234)).toBe('-1.2K');
  });
});

describe('parseNumberInput', () => {
  it('strips commas and currency symbols', () => {
    expect(parseNumberInput('$1,234.50')).toBe(1234.5);
  });

  it('strips percent signs but does not auto-convert', () => {
    expect(parseNumberInput('8.5%')).toBe(8.5);
  });

  it('handles plain numbers', () => {
    expect(parseNumberInput('1234')).toBe(1234);
  });

  it('returns NaN for unparseable input', () => {
    expect(parseNumberInput('abc')).toBeNaN();
  });

  it('returns NaN for empty string', () => {
    expect(parseNumberInput('')).toBeNaN();
  });

  it('handles negative inputs', () => {
    expect(parseNumberInput('-$1,234.50')).toBe(-1234.5);
  });
});

describe('formatPhone', () => {
  it('formats 10-digit US numbers as "(xxx) xxx-xxxx"', () => {
    expect(formatPhone('4155550142')).toBe('(415) 555-0142');
  });

  it('strips non-digits before formatting', () => {
    expect(formatPhone('(415) 555-0142')).toBe('(415) 555-0142');
    expect(formatPhone('415.555.0142')).toBe('(415) 555-0142');
    expect(formatPhone('415 555 0142')).toBe('(415) 555-0142');
  });

  it('formats 11-digit numbers starting with 1 as "+1 (xxx) xxx-xxxx"', () => {
    expect(formatPhone('14155550142')).toBe('+1 (415) 555-0142');
    expect(formatPhone('1-415-555-0142')).toBe('+1 (415) 555-0142');
  });

  it('formats international numbers with leading + and spaced groups', () => {
    const out = formatPhone('+442079460958');
    expect(out.startsWith('+')).toBe(true);
    expect(out.replace(/\D/g, '')).toBe('442079460958');
  });

  it('returns empty string for empty input', () => {
    expect(formatPhone('')).toBe('');
    expect(formatPhone('   ')).toBe('');
  });

  it('returns trimmed input verbatim when it cannot be normalized', () => {
    expect(formatPhone('call the host')).toBe('call the host');
    expect(formatPhone('555-CALL')).toBe('555-CALL');
  });
});
