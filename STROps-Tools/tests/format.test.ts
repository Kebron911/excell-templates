import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatAbbreviated,
  parseNumberInput,
} from '@/lib/format';

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

  it('handles 1 as 100% (unambiguous edge: caller wanted 100%)', () => {
    expect(formatPercent(1)).toBe('100%');
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
