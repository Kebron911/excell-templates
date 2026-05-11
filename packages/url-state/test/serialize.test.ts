import { describe, it, expect } from 'vitest';
import { serialize } from '../src/index.js';

describe('serialize', () => {
  it('serializes numbers and strings', () => {
    const qs = serialize({ price: 250000, label: 'beach house' });
    const params = new URLSearchParams(qs);
    expect(params.get('price')).toBe('250000');
    expect(params.get('label')).toBe('beach house');
  });

  it('encodes booleans as 1/0', () => {
    const qs = serialize({ isPet: true, isSmoke: false });
    const params = new URLSearchParams(qs);
    expect(params.get('isPet')).toBe('1');
    expect(params.get('isSmoke')).toBe('0');
  });

  it('omits keys matching defaults', () => {
    const defaults = { price: 100000, bedrooms: 1 };
    const qs = serialize({ price: 100000, bedrooms: 3 }, defaults);
    const params = new URLSearchParams(qs);
    expect(params.get('price')).toBeNull();   // matches default
    expect(params.get('bedrooms')).toBe('3'); // differs
  });

  it('omits undefined/null values', () => {
    const qs = serialize({ a: undefined, b: null, c: 1 });
    const params = new URLSearchParams(qs);
    expect(params.get('a')).toBeNull();
    expect(params.get('b')).toBeNull();
    expect(params.get('c')).toBe('1');
  });

  it('returns empty string for empty/all-default state', () => {
    const defaults = { price: 0 };
    expect(serialize({}, defaults)).toBe('');
    expect(serialize({ price: 0 }, defaults)).toBe('');
  });

  it('does not omit false when default is true', () => {
    const qs = serialize({ isPet: false }, { isPet: true });
    const params = new URLSearchParams(qs);
    expect(params.get('isPet')).toBe('0');
  });

  it('handles zero correctly (not treated as falsy omit)', () => {
    const qs = serialize({ price: 0 }, { price: 100 });
    const params = new URLSearchParams(qs);
    expect(params.get('price')).toBe('0');
  });

  it('handles unicode strings', () => {
    const qs = serialize({ name: 'Märket öl ñoño' });
    const params = new URLSearchParams(qs);
    expect(params.get('name')).toBe('Märket öl ñoño');
  });

  it('handles large objects (100 keys)', () => {
    const state: Record<string, number> = {};
    for (let i = 0; i < 100; i++) state[`k${i}`] = i;
    const qs = serialize(state);
    const params = new URLSearchParams(qs);
    expect(params.get('k0')).toBe('0');
    expect(params.get('k99')).toBe('99');
  });
});
