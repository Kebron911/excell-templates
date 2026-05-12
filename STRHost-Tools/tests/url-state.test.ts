import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  serialize,
  parse,
  createDebouncedReplaceState,
} from '@str/url-state';

describe('serialize', () => {
  it('serializes a flat object to URLSearchParams string', () => {
    const out = serialize({ price: 1000, occupancy: 0.7, name: 'demo' });
    const params = new URLSearchParams(out);
    expect(params.get('price')).toBe('1000');
    expect(params.get('occupancy')).toBe('0.7');
    expect(params.get('name')).toBe('demo');
  });

  it('omits keys whose values match defaults (URLs stay short)', () => {
    const out = serialize({ price: 1000, occupancy: 0.7 }, { price: 1000, occupancy: 0.5 });
    const params = new URLSearchParams(out);
    expect(params.has('price')).toBe(false);
    expect(params.get('occupancy')).toBe('0.7');
  });

  it('encodes booleans as 1/0', () => {
    const out = serialize({ enabled: true, disabled: false });
    const params = new URLSearchParams(out);
    expect(params.get('enabled')).toBe('1');
    expect(params.get('disabled')).toBe('0');
  });

  it('skips undefined and null values', () => {
    const out = serialize({ a: 1, b: undefined as any, c: null as any });
    const params = new URLSearchParams(out);
    expect(params.has('a')).toBe(true);
    expect(params.has('b')).toBe(false);
    expect(params.has('c')).toBe(false);
  });

  it('returns empty string when all values match defaults', () => {
    const out = serialize({ price: 1000 }, { price: 1000 });
    expect(out).toBe('');
  });
});

describe('parse', () => {
  it('coerces values using defaults as type signal', () => {
    const out = parse('?price=1234.5&occupancy=0.7&name=foo', {
      price: 0,
      occupancy: 0,
      name: '',
    });
    expect(out).toEqual({ price: 1234.5, occupancy: 0.7, name: 'foo' });
  });

  it('falls back to default when key is missing', () => {
    const out = parse('?price=1234.5', { price: 0, occupancy: 0.5 });
    expect(out.occupancy).toBe(0.5);
  });

  it('falls back to default when value cannot be coerced to number', () => {
    const out = parse('?price=abc', { price: 100 });
    expect(out.price).toBe(100);
  });

  it('decodes booleans from 1/0/true/false', () => {
    expect(parse('?on=1', { on: false }).on).toBe(true);
    expect(parse('?on=0', { on: true }).on).toBe(false);
    expect(parse('?on=true', { on: false }).on).toBe(true);
    expect(parse('?on=false', { on: true }).on).toBe(false);
  });

  it('handles a leading ? or no leading ?', () => {
    expect(parse('?price=1', { price: 0 }).price).toBe(1);
    expect(parse('price=1', { price: 0 }).price).toBe(1);
  });

  it('returns defaults verbatim for empty search string', () => {
    expect(parse('', { price: 100, occupancy: 0.5 })).toEqual({ price: 100, occupancy: 0.5 });
  });
});

describe('createDebouncedReplaceState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Stub history.replaceState
    const calls: string[] = [];
    (globalThis as any).__replaceStateCalls = calls;
    (globalThis as any).history = {
      replaceState: (_state: any, _title: string, url: string) => {
        calls.push(url);
      },
    };
    (globalThis as any).window = {
      location: { pathname: '/test', search: '', href: 'http://localhost/test' },
      history: (globalThis as any).history,
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (globalThis as any).__replaceStateCalls;
  });

  it('debounces multiple calls within 200ms into one replaceState', () => {
    const replace = createDebouncedReplaceState(200);
    replace({ price: 1 });
    replace({ price: 2 });
    replace({ price: 3 });
    expect((globalThis as any).__replaceStateCalls.length).toBe(0);
    vi.advanceTimersByTime(200);
    expect((globalThis as any).__replaceStateCalls.length).toBe(1);
    expect((globalThis as any).__replaceStateCalls[0]).toContain('price=3');
  });

  it('separates calls beyond debounce window into multiple replaceState invocations', () => {
    const replace = createDebouncedReplaceState(200);
    replace({ price: 1 });
    vi.advanceTimersByTime(200);
    replace({ price: 2 });
    vi.advanceTimersByTime(200);
    expect((globalThis as any).__replaceStateCalls.length).toBe(2);
  });

  it('honors custom delay', () => {
    const replace = createDebouncedReplaceState(50);
    replace({ a: 1 });
    vi.advanceTimersByTime(49);
    expect((globalThis as any).__replaceStateCalls.length).toBe(0);
    vi.advanceTimersByTime(1);
    expect((globalThis as any).__replaceStateCalls.length).toBe(1);
  });
});
