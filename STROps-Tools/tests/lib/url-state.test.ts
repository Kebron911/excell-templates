import { describe, it, expect, vi } from 'vitest';
import { encodeState, decodeState, makeReplacer } from '@str/url-state';

describe('url-state', () => {
  it('round-trips primitives', () => {
    const s = { adr: 220, occ: 0.62, cleaning: 95, name: 'Cabin A' };
    expect(decodeState(encodeState(s), s)).toEqual(s);
  });
  it('decode falls back to defaults on missing keys', () => {
    const defaults = { a: 1, b: 2 };
    expect(decodeState('?a=9', defaults)).toEqual({ a: 9, b: 2 });
  });
  it('decode coerces numeric strings', () => {
    expect(decodeState('?occ=0.8', { occ: 0 })).toEqual({ occ: 0.8 });
  });
  it('handles arrays via comma-separated values', () => {
    const s = { ids: ['a', 'b', 'c'] };
    expect(decodeState(encodeState(s), { ids: [] as string[] })).toEqual(s);
  });
  it('debounces replaceState', async () => {
    vi.useFakeTimers();
    const spy = vi.fn();
    const r = makeReplacer(spy, 200);
    r('?a=1'); r('?a=2'); r('?a=3');
    vi.advanceTimersByTime(199);
    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2);
    expect(spy).toHaveBeenCalledWith('?a=3');
    vi.useRealTimers();
  });
});
