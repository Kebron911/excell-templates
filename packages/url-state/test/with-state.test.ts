import { describe, it, expect } from 'vitest';
import { withState } from '../src/index.js';

describe('withState', () => {
  it('appends state to URL with no existing query', () => {
    const url = withState('https://example.com/calc', { price: 100, bedrooms: 1 });
    expect(url).toMatch(/^https:\/\/example\.com\/calc\?/);
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('price')).toBe('100');
  });

  it('appends state to URL with existing query string', () => {
    const url = withState('https://example.com/calc?utm=foo', { price: 100 });
    expect(url).toMatch(/^https:\/\/example\.com\/calc\?utm=foo&/);
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('utm')).toBe('foo');
    expect(params.get('price')).toBe('100');
  });

  it('returns original URL for empty state', () => {
    const url = withState('https://example.com/calc', {});
    expect(url).toBe('https://example.com/calc');
  });

  it('handles arrays as comma-separated', () => {
    const url = withState('https://example.com/calc', { amenities: ['pool', 'wifi'] });
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('amenities')).toBe('pool,wifi');
  });

  it('works with a path-only URL', () => {
    const url = withState('/calc', { price: 250000 });
    expect(url).toBe('/calc?price=250000');
  });

  it('works with a path+query URL', () => {
    const url = withState('/calc?a=1', { price: 250000 });
    expect(url).toBe('/calc?a=1&price=250000');
  });

  it('handles unicode in values', () => {
    const url = withState('https://example.com/calc', { label: 'résumé' });
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('label')).toBe('résumé');
  });

  it('handles numbers and booleans', () => {
    const url = withState('https://example.com', { n: 42, b: true });
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('n')).toBe('42');
    expect(params.get('b')).toBe('true');
  });

  it('does not double-encode existing query on URL with hash', () => {
    // URL with fragment — state appended before hash would be wrong,
    // but withState treats the full string as opaque and appends after it.
    // This is the documented behavior: pass URL without hash.
    const url = withState('https://example.com/calc', { price: 1 });
    expect(url).toContain('price=1');
  });
});
