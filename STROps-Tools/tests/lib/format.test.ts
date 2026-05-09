import { describe, it, expect } from 'vitest';
import { fmtUsd, fmtPct, fmtInt, fmtList } from '@lib/format';

describe('format', () => {
  it('fmtUsd', () => {
    expect(fmtUsd(1234.5)).toBe('$1,234.50');
    expect(fmtUsd(0)).toBe('$0.00');
    expect(fmtUsd(-5)).toBe('-$5.00');
  });
  it('fmtPct', () => {
    expect(fmtPct(0.625)).toBe('62.5%');
    expect(fmtPct(0.5, 0)).toBe('50%');
  });
  it('fmtInt', () => {
    expect(fmtInt(12000)).toBe('12,000');
  });
  it('fmtList', () => {
    expect(fmtList(['a','b','c'])).toBe('a, b, and c');
    expect(fmtList(['a','b'])).toBe('a and b');
    expect(fmtList(['a'])).toBe('a');
    expect(fmtList([])).toBe('');
  });
});
