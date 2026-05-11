import { describe, it, expect } from 'vitest';
import { decodeState } from '../src/index.js';

const defaults = {
  price: 0,
  bedrooms: 1,
  isPet: false,
  label: 'none',
  amenities: [] as string[],
};

describe('decodeState', () => {
  it('decodes number values', () => {
    const state = decodeState('price=250000', defaults);
    expect(state.price).toBe(250000);
  });

  it('decodes array from comma-separated string', () => {
    const state = decodeState('amenities=pool%2Cwifi', defaults);
    expect(state.amenities).toEqual(['pool', 'wifi']);
  });

  it('decodes empty string to empty array', () => {
    const state = decodeState('amenities=', defaults);
    expect(state.amenities).toEqual([]);
  });

  it('decodes boolean as true for "true" and "1"', () => {
    expect(decodeState('isPet=true', defaults).isPet).toBe(true);
    expect(decodeState('isPet=1', defaults).isPet).toBe(true);
  });

  it('decodes boolean as false for other values', () => {
    expect(decodeState('isPet=false', defaults).isPet).toBe(false);
    expect(decodeState('isPet=0', defaults).isPet).toBe(false);
    expect(decodeState('isPet=yes', defaults).isPet).toBe(false);
  });

  it('falls back to defaults for missing keys', () => {
    const state = decodeState('', defaults);
    expect(state).toEqual(defaults);
  });

  it('falls back to defaults for invalid numbers', () => {
    const state = decodeState('price=notanumber', defaults);
    expect(state.price).toBe(0);
  });

  it('accepts leading ?', () => {
    const state = decodeState('?price=500000', defaults);
    expect(state.price).toBe(500000);
  });

  it('ignores keys not in defaults', () => {
    const state = decodeState('price=100&unknown=foo', defaults);
    expect((state as Record<string, unknown>).unknown).toBeUndefined();
  });

  it('roundtrips with encodeState', async () => {
    const { encodeState } = await import('../src/index.js');
    const original = { price: 375000, bedrooms: 3, isPet: true, label: 'beach', amenities: ['pool', 'wifi'] };
    const qs = encodeState(original);
    const decoded = decodeState(qs, defaults);
    expect(decoded).toEqual(original);
  });
});
