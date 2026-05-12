import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isGateDismissed, markGateDismissed, clearGateDismissed } from '../src/dismissal.js';

describe('gate dismissal (sessionStorage)', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    vi.stubGlobal('window', {
      sessionStorage: {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => { store[k] = v; },
        removeItem: (k: string) => { delete store[k]; },
      },
    });
  });

  it('isGateDismissed returns false initially', () => {
    expect(isGateDismissed('house-rules-pdf')).toBe(false);
  });

  it('mark + isGateDismissed roundtrip', () => {
    markGateDismissed('house-rules-pdf');
    expect(isGateDismissed('house-rules-pdf')).toBe(true);
  });

  it('clear removes dismissal', () => {
    markGateDismissed('house-rules-pdf');
    clearGateDismissed('house-rules-pdf');
    expect(isGateDismissed('house-rules-pdf')).toBe(false);
  });

  it('per-toolSlug isolation', () => {
    markGateDismissed('house-rules-pdf');
    expect(isGateDismissed('welcome-book')).toBe(false);
  });

  it('SSR-safe: returns false / no-ops when window undefined', () => {
    vi.stubGlobal('window', undefined);
    expect(isGateDismissed('x')).toBe(false);
    expect(() => markGateDismissed('x')).not.toThrow();
    expect(() => clearGateDismissed('x')).not.toThrow();
  });
});
