import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  type FormatCurrencyOptions,
} from '../src/currency';

describe('formatCurrency', () => {
  // Happy path — defaults
  it('formats a positive integer in USD', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  it('formats a decimal value with 2 decimal places by default', () => {
    expect(formatCurrency(9.5)).toBe('$9.50');
  });

  it('formats zero as $0.00', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats a negative value', () => {
    expect(formatCurrency(-250)).toBe('-$250.00');
  });

  it('formats a large value with comma separators', () => {
    expect(formatCurrency(1_500_000)).toBe('$1,500,000.00');
  });

  // Non-finite → em-dash
  it('returns em-dash for NaN', () => {
    expect(formatCurrency(NaN)).toBe('—');
  });

  it('returns em-dash for Infinity', () => {
    expect(formatCurrency(Infinity)).toBe('—');
  });

  it('returns em-dash for -Infinity', () => {
    expect(formatCurrency(-Infinity)).toBe('—');
  });

  // Options: maximumFractionDigits = 0
  it('formats with zero decimal places when maximumFractionDigits=0', () => {
    expect(formatCurrency(1234.56, { maximumFractionDigits: 0 })).toBe('$1,235');
  });

  it('formats with zero decimal places when value is whole', () => {
    expect(formatCurrency(500, { maximumFractionDigits: 0 })).toBe('$500');
  });

  // Options: currency override
  it('formats in EUR when currency=EUR', () => {
    const result = formatCurrency(100, { currency: 'EUR', locale: 'en-US' });
    expect(result).toBe('€100.00');
  });

  // Options: locale override
  it('respects custom locale (de-DE uses comma decimal)', () => {
    const result = formatCurrency(1234.56, { locale: 'de-DE', currency: 'EUR' });
    // de-DE uses period as thousands sep and comma as decimal
    expect(result).toContain('1.234');
    expect(result).toContain('56');
  });

  // minimumFractionDigits defaults: when maximumFractionDigits=0, min=0
  it('sets minimumFractionDigits to 0 when maximumFractionDigits=0', () => {
    expect(formatCurrency(100, { maximumFractionDigits: 0, minimumFractionDigits: 0 })).toBe('$100');
  });

  // explicit minimumFractionDigits override
  it('respects explicit minimumFractionDigits', () => {
    expect(formatCurrency(5, { minimumFractionDigits: 0, maximumFractionDigits: 2 })).toBe('$5');
  });

  // Rounding
  it('rounds correctly at boundary', () => {
    expect(formatCurrency(1.005)).toBe('$1.01');
  });

  it('formats very small positive value', () => {
    expect(formatCurrency(0.01)).toBe('$0.01');
  });
});
