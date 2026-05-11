import { describe, it, expect } from 'vitest';
import { parse } from '../src/index.js';

const defaults = { price: 100000, bedrooms: 1, isPet: false, label: 'default' };

describe('parse', () => {
  it('parses numbers from query string', () => {
    const state = parse('price=250000&bedrooms=3', defaults);
    expect(state.price).toBe(250000);
    expect(state.bedrooms).toBe(3);
  });

  it('parses booleans encoded as 1/0', () => {
    const state = parse('isPet=1', defaults);
    expect(state.isPet).toBe(true);

    const state2 = parse('isPet=0', defaults);
    expect(state2.isPet).toBe(false);
  });

  it('parses booleans encoded as true/false strings', () => {
    const state = parse('isPet=true', defaults);
    expect(state.isPet).toBe(true);

    const state2 = parse('isPet=false', defaults);
    expect(state2.isPet).toBe(false);
  });

  it('falls back to defaults for missing keys', () => {
    const state = parse('price=250000', defaults);
    expect(state.bedrooms).toBe(1); // default
    expect(state.isPet).toBe(false); // default
    expect(state.label).toBe('default'); // default
  });

  it('falls back to defaults for non-finite numbers', () => {
    const state = parse('price=notanumber', defaults);
    expect(state.price).toBe(100000);
  });

  it('accepts query string with leading ?', () => {
    const state = parse('?price=250000', defaults);
    expect(state.price).toBe(250000);
  });

  it('ignores unknown keys (only maps what is in defaults)', () => {
    const state = parse('price=250000&unknown=foo', defaults);
    expect((state as Record<string, unknown>).unknown).toBeUndefined();
  });

  it('handles empty query string — returns defaults', () => {
    const state = parse('', defaults);
    expect(state).toEqual(defaults);
  });

  it('handles unicode string values', () => {
    const state = parse(`label=${encodeURIComponent('Märket öl')}`, defaults);
    expect(state.label).toBe('Märket öl');
  });

  it('roundtrips correctly with serialize', async () => {
    const { serialize } = await import('../src/index.js');
    const original = { price: 375000, bedrooms: 4, isPet: true, label: 'beach house' };
    const qs = serialize(original);
    const state = parse(qs, defaults);
    expect(state).toEqual(original);
  });
});
