import { describe, it, expect } from 'vitest';
import { formatPercent } from '../src/percent';

describe('formatPercent', () => {
  // Happy path — decimal form (0 < |v| < 1) auto-multiplied
  it('converts 0.5 to 50%', () => {
    expect(formatPercent(0.5)).toBe('50%');
  });

  it('converts 0.1 to 10%', () => {
    expect(formatPercent(0.1)).toBe('10%');
  });

  it('treats 1 as already-percent (1%, not 100%) per new boundary rule', () => {
    expect(formatPercent(1)).toBe('1%');
  });

  it('converts 0.856 to 85.6%', () => {
    expect(formatPercent(0.856)).toBe('85.6%');
  });

  // Already-percent form (|v| > 1)
  it('passes through values > 1 as-is (already percent)', () => {
    expect(formatPercent(65)).toBe('65%');
  });

  it('passes through negative values > 1 in absolute (already percent)', () => {
    expect(formatPercent(-20)).toBe('-20%');
  });

  it('passes through 100 as 100%', () => {
    expect(formatPercent(100)).toBe('100%');
  });

  // Zero
  it('formats zero as 0%', () => {
    expect(formatPercent(0)).toBe('0%');
  });

  // Non-finite → em-dash
  it('returns em-dash for NaN', () => {
    expect(formatPercent(NaN)).toBe('—');
  });

  it('returns em-dash for Infinity', () => {
    expect(formatPercent(Infinity)).toBe('—');
  });

  it('returns em-dash for -Infinity', () => {
    expect(formatPercent(-Infinity)).toBe('—');
  });

  // Negative decimal form
  it('converts -0.25 (decimal form) to -25%', () => {
    expect(formatPercent(-0.25)).toBe('-25%');
  });

  // decimals option
  it('respects decimals=0 option', () => {
    expect(formatPercent(0.1234, { decimals: 0 })).toBe('12%');
  });

  it('respects decimals=1 option', () => {
    expect(formatPercent(0.1234, { decimals: 1 })).toBe('12.3%');
  });

  it('respects decimals=2 option', () => {
    expect(formatPercent(0.1234, { decimals: 2 })).toBe('12.34%');
  });

  it('respects decimals=2 for already-percent values', () => {
    expect(formatPercent(65.678, { decimals: 2 })).toBe('65.68%');
  });

  // Default trimming of trailing zeros
  it('trims trailing zeros by default (no decimals option)', () => {
    expect(formatPercent(0.5)).toBe('50%'); // not "50.00%"
  });

  // locale option
  it('respects locale option', () => {
    const result = formatPercent(0.5, { locale: 'de-DE' });
    expect(result).toContain('%');
  });
});

describe('boundary cases at |value| === 1', () => {
  it('treats 1 as already-percent (1%, not 100%)', () => {
    expect(formatPercent(1)).toBe('1%');
  });
  it('treats -1 as already-percent (-1%, not -100%)', () => {
    expect(formatPercent(-1)).toBe('-1%');
  });
  it('treats 0.99 as decimal (99%)', () => {
    expect(formatPercent(0.99)).toBe('99%');
  });
  it('treats -0.99 as decimal (-99%)', () => {
    expect(formatPercent(-0.99)).toBe('-99%');
  });
  it('treats 1.01 as already-percent (1.01%)', () => {
    expect(formatPercent(1.01, { decimals: 2 })).toBe('1.01%');
  });
});
