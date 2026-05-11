import { describe, it, expect } from 'vitest';
import { formatNumber, formatAbbreviated, parseNumberInput } from '../src/number';

describe('formatNumber', () => {
  // Happy path
  it('formats integer with thousand separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
  });

  it('formats zero as "0"', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('formats negative number', () => {
    expect(formatNumber(-1234)).toBe('-1,234');
  });

  it('formats decimal without forcing extra digits', () => {
    expect(formatNumber(1.5)).toBe('1.5');
  });

  it('formats large number', () => {
    expect(formatNumber(1_000_000)).toBe('1,000,000');
  });

  // Non-finite → em-dash
  it('returns em-dash for NaN', () => {
    expect(formatNumber(NaN)).toBe('—');
  });

  it('returns em-dash for Infinity', () => {
    expect(formatNumber(Infinity)).toBe('—');
  });

  it('returns em-dash for -Infinity', () => {
    expect(formatNumber(-Infinity)).toBe('—');
  });

  // decimals option
  it('formats with decimals=2 fixed', () => {
    expect(formatNumber(5, { decimals: 2 })).toBe('5.00');
  });

  it('formats with decimals=0 (no fraction)', () => {
    expect(formatNumber(5.678, { decimals: 0 })).toBe('6');
  });

  it('formats with decimals=1', () => {
    expect(formatNumber(5.678, { decimals: 1 })).toBe('5.7');
  });

  // locale option
  it('respects locale option', () => {
    const result = formatNumber(1234.5, { locale: 'de-DE' });
    expect(result).toContain('1.234');
  });

  // -0 normalization
  it('normalizes -0 to "0"', () => {
    expect(formatNumber(-0)).toBe('0');
  });
});

describe('formatAbbreviated', () => {
  // Thousands
  it('abbreviates 1000 as "1K"', () => {
    expect(formatAbbreviated(1000)).toBe('1K');
  });

  it('abbreviates 1500 as "1.5K"', () => {
    expect(formatAbbreviated(1500)).toBe('1.5K');
  });

  it('abbreviates 15000 as "15K"', () => {
    expect(formatAbbreviated(15000)).toBe('15K');
  });

  it('abbreviates 1200 as "1.2K"', () => {
    expect(formatAbbreviated(1200)).toBe('1.2K');
  });

  // Millions
  it('abbreviates 1000000 as "1M"', () => {
    expect(formatAbbreviated(1_000_000)).toBe('1M');
  });

  it('abbreviates 1500000 as "1.5M"', () => {
    expect(formatAbbreviated(1_500_000)).toBe('1.5M');
  });

  // Billions
  it('abbreviates 2500000000 as "2.5B"', () => {
    expect(formatAbbreviated(2_500_000_000)).toBe('2.5B');
  });

  it('abbreviates 1000000000 as "1B"', () => {
    expect(formatAbbreviated(1_000_000_000)).toBe('1B');
  });

  // Small values (< 1000) — returned as-is
  it('returns small values unchanged', () => {
    expect(formatAbbreviated(999)).toBe('999');
  });

  it('returns zero unchanged', () => {
    expect(formatAbbreviated(0)).toBe('0');
  });

  // Negative values
  it('abbreviates -1500 as "-1.5K"', () => {
    expect(formatAbbreviated(-1500)).toBe('-1.5K');
  });

  it('abbreviates -2000000 as "-2M"', () => {
    expect(formatAbbreviated(-2_000_000)).toBe('-2M');
  });

  // Non-finite → em-dash
  it('returns em-dash for NaN', () => {
    expect(formatAbbreviated(NaN)).toBe('—');
  });

  it('returns em-dash for Infinity', () => {
    expect(formatAbbreviated(Infinity)).toBe('—');
  });

  // Trims trailing ".0"
  it('does not show .0 suffix (15K not 15.0K)', () => {
    expect(formatAbbreviated(15_000)).toBe('15K');
    expect(formatAbbreviated(2_000_000)).toBe('2M');
  });
});

describe('formatAbbreviated under 1000 — uses locale formatting', () => {
  it('formats 999 with no separator (correct in en-US)', () => {
    expect(formatAbbreviated(999)).toBe('999');
  });
  it('formats fractional 999.5 with locale-aware decimal', () => {
    expect(formatAbbreviated(999.5)).toBe('999.5');
  });
  it('formats negative under-1000 correctly', () => {
    expect(formatAbbreviated(-500)).toBe('-500');
  });
});

describe('parseNumberInput', () => {
  // Happy path
  it('parses plain integer string', () => {
    expect(parseNumberInput('123')).toBe(123);
  });

  it('parses decimal string', () => {
    expect(parseNumberInput('1.5')).toBe(1.5);
  });

  it('strips dollar sign', () => {
    expect(parseNumberInput('$1,234')).toBe(1234);
  });

  it('strips commas', () => {
    expect(parseNumberInput('1,000,000')).toBe(1_000_000);
  });

  it('strips percent sign', () => {
    expect(parseNumberInput('50%')).toBe(50);
  });

  it('strips euro symbol', () => {
    expect(parseNumberInput('€100')).toBe(100);
  });

  it('strips pound sign', () => {
    expect(parseNumberInput('£99.99')).toBe(99.99);
  });

  it('strips whitespace', () => {
    expect(parseNumberInput('  42  ')).toBe(42);
  });

  // Negative
  it('parses negative value', () => {
    expect(parseNumberInput('-500')).toBe(-500);
  });

  // Non-parseable → NaN
  it('returns NaN for empty string', () => {
    expect(parseNumberInput('')).toBeNaN();
  });

  it('returns NaN for just a dash', () => {
    expect(parseNumberInput('-')).toBeNaN();
  });

  it('returns NaN for non-numeric text', () => {
    expect(parseNumberInput('abc')).toBeNaN();
  });

  it('returns NaN for null-like (null coerced)', () => {
    expect(parseNumberInput(null as unknown as string)).toBeNaN();
  });

  it('returns NaN for undefined-like', () => {
    expect(parseNumberInput(undefined as unknown as string)).toBeNaN();
  });

  it('parses zero', () => {
    expect(parseNumberInput('0')).toBe(0);
  });
});

describe('parseNumberInput edge cases — scientific notation and Infinity', () => {
  it('accepts scientific notation', () => {
    expect(parseNumberInput('1e3')).toBe(1000);
    expect(parseNumberInput('1.5e2')).toBe(150);
  });
  it('rejects Infinity string', () => {
    expect(parseNumberInput('Infinity')).toBeNaN();
    expect(parseNumberInput('-Infinity')).toBeNaN();
  });
  it('rejects NaN string', () => {
    expect(parseNumberInput('NaN')).toBeNaN();
  });
});
