import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercent, formatNumber } from '@str/format';

describe('format', () => {
  it('formatCurrency', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(-5)).toBe('-$5.00');
  });
  it('formatPercent', () => {
    // Values in (0,1) are decimal form — multiplied by 100.
    expect(formatPercent(0.625)).toBe('62.5%');
    expect(formatPercent(0.5, { decimals: 0 })).toBe('50%');
  });
  it('formatNumber', () => {
    expect(formatNumber(12000, { decimals: 0 })).toBe('12,000');
  });
});
