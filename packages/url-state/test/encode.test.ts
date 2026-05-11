import { describe, it, expect } from 'vitest';
import { encodeState } from '../src/index.js';

describe('encodeState', () => {
  it('encodes numbers and strings', () => {
    const qs = encodeState({ price: 250000, label: 'beach house' });
    const params = new URLSearchParams(qs);
    expect(params.get('price')).toBe('250000');
    expect(params.get('label')).toBe('beach house');
  });

  it('encodes arrays as comma-separated', () => {
    const qs = encodeState({ amenities: ['pool', 'wifi', 'parking'] });
    const params = new URLSearchParams(qs);
    expect(params.get('amenities')).toBe('pool,wifi,parking');
  });

  it('encodes empty array as empty string', () => {
    const qs = encodeState({ amenities: [] });
    const params = new URLSearchParams(qs);
    expect(params.get('amenities')).toBe('');
  });

  it('does NOT filter based on defaults (all keys included)', () => {
    // encodeState has no defaults concept — includes everything
    const qs = encodeState({ price: 0, bedrooms: 1, isPet: false });
    const params = new URLSearchParams(qs);
    expect(params.get('price')).toBe('0');
    expect(params.get('bedrooms')).toBe('1');
    expect(params.get('isPet')).toBe('false');
  });

  it('encodes booleans as their string representation', () => {
    const qs = encodeState({ isPet: true, isSmoke: false });
    const params = new URLSearchParams(qs);
    expect(params.get('isPet')).toBe('true');
    expect(params.get('isSmoke')).toBe('false');
  });

  it('returns empty string for empty state', () => {
    expect(encodeState({})).toBe('');
  });

  it('handles unicode values', () => {
    const qs = encodeState({ name: 'ñoño 中文 émoji' });
    const params = new URLSearchParams(qs);
    expect(params.get('name')).toBe('ñoño 中文 émoji');
  });

  it('handles numeric arrays', () => {
    const qs = encodeState({ scores: [1, 2, 3] });
    const params = new URLSearchParams(qs);
    expect(params.get('scores')).toBe('1,2,3');
  });

  it('handles 100-key object', () => {
    const state: Record<string, number> = {};
    for (let i = 0; i < 100; i++) state[`k${i}`] = i * 10;
    const qs = encodeState(state);
    const params = new URLSearchParams(qs);
    expect(params.get('k0')).toBe('0');
    expect(params.get('k99')).toBe('990');
  });

  it('skips undefined and null values', () => {
    const qs = encodeState({ a: undefined as unknown as string, b: null as unknown as string, c: 'ok' });
    const params = new URLSearchParams(qs);
    expect(params.get('a')).toBeNull();
    expect(params.get('b')).toBeNull();
    expect(params.get('c')).toBe('ok');
  });
});
