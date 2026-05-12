/**
 * Cross-app encode/decode compatibility tests for @str/url-state.
 *
 * Verifies that @str/url-state correctly decodes URLs produced by all 4
 * in-tree variants (STRGuests, STRBuyers, STRHost, STROps), and that
 * URLs encoded by @str/url-state decode correctly regardless of which
 * app produced the URL.
 *
 * Encoding formats:
 *   STRGuests/STRBuyers/STRHost  → booleans as "1"/"0", no array support, no leading "?"
 *   STROps (migrated)            → booleans as "1"/"0", no array support (canonical)
 *   STROps (legacy URLs in wild) → booleans as "true"/"false", leading "?"
 *   @str/url-state serialize()   → booleans as "1"/"0", defaults-filtered, no leading "?"
 *
 * Lenient decoder:
 *   parse() accepts "1"/"true" for true, "0"/"false" for false — backward-compat
 *   guarantee so any URLs in the wild from the old STROps API still decode.
 */

import { describe, it, expect } from 'vitest';
import { serialize, parse } from '../src/index.js';

// ---------------------------------------------------------------------------
// STRGuests / STRBuyers / STRHost wire format (booleans as 1/0)
// ---------------------------------------------------------------------------
describe('cross-app compat: STRGuests/STRBuyers/STRHost wire format (booleans 1/0)', () => {
  it('parse() decodes a STRBuyers-style query string with boolean=1', () => {
    const qs = 'price=250000&isPet=1&beds=3';
    const defaults = { price: 0, isPet: false, beds: 0 };
    const out = parse(qs, defaults);
    expect(out).toEqual({ price: 250000, isPet: true, beds: 3 });
  });

  it('parse() decodes boolean=0 as false', () => {
    const out = parse('isPet=0', { isPet: true });
    expect(out.isPet).toBe(false);
  });

  it('parse() falls back to defaults for keys absent from STRBuyers-style URL', () => {
    const defaults = { price: 0, isPet: false, beds: 1 };
    const out = parse('price=300000&isPet=1', defaults);
    expect(out.beds).toBe(1);
  });

  it('serialize() emits booleans as 1/0 (STRGuests/STRBuyers/STRHost wire format)', () => {
    const qs = serialize({ isPet: true, hasPool: false } as Record<string, boolean>, { isPet: false, hasPool: false });
    expect(qs).toContain('isPet=1');
    expect(qs).not.toContain('hasPool');
  });

  it('serialize() omits values matching defaults', () => {
    const defaults: Record<string, number | boolean> = { price: 0, beds: 1, isPet: false };
    const qs = serialize({ price: 500000, beds: 1, isPet: false }, defaults);
    expect(qs).toContain('price=500000');
    expect(qs).not.toContain('beds');
    expect(qs).not.toContain('isPet');
  });
});

// ---------------------------------------------------------------------------
// STROps legacy wire format — booleans as true/false, leading "?"
// parse() MUST be lenient here (backward-compat for URLs in the wild)
// ---------------------------------------------------------------------------
describe('cross-app compat: STROps legacy wire format (booleans true/false) — lenient decode', () => {
  it('parse() accepts boolean=true (STROps legacy format)', () => {
    const out = parse('isPet=true&beds=3', { isPet: false, beds: 0 });
    expect(out).toEqual({ isPet: true, beds: 3 });
  });

  it('parse() accepts boolean=false as false (STROps legacy format)', () => {
    const out = parse('isPet=false', { isPet: true });
    expect(out.isPet).toBe(false);
  });

  it('parse() accepts URLSearchParams input (STROps migrated pattern)', () => {
    const out = parse(new URLSearchParams('isPet=1&beds=3'), { isPet: false, beds: 0 });
    expect(out).toEqual({ isPet: true, beds: 3 });
  });

  it('parse() accepts leading ? (STROps legacy format)', () => {
    const out = parse('?isPet=true&beds=2', { isPet: false, beds: 0 });
    expect(out).toEqual({ isPet: true, beds: 2 });
  });
});

// ---------------------------------------------------------------------------
// Lenient boolean decoding: canonical parse() accepts both encodings
// ---------------------------------------------------------------------------
describe('cross-app compat: lenient boolean decoding works for both wire formats', () => {
  it('parse() accepts boolean=true (STROps legacy wire format)', () => {
    const out = parse('isPet=true', { isPet: false });
    expect(out.isPet).toBe(true);
  });

  it('parse() accepts boolean=1 (STRGuests/STRBuyers/STRHost wire format)', () => {
    const out = parse('isPet=1', { isPet: false });
    expect(out.isPet).toBe(true);
  });

  it('parse() accepts boolean=false as false', () => {
    const out = parse('isPet=false', { isPet: true });
    expect(out.isPet).toBe(false);
  });

  it('parse() accepts boolean=0 as false', () => {
    const out = parse('isPet=0', { isPet: true });
    expect(out.isPet).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Cross-app URL sharing: real round-trip scenarios
// ---------------------------------------------------------------------------
describe('cross-app compat: shared URLs decode correctly across sites', () => {
  it('URL serialized by STRBuyers (1/0 booleans) round-trips via parse', () => {
    const original = { isPet: true, beds: 3 } as Record<string, number | boolean>;
    const defaults = { isPet: false, beds: 0 };
    const qs = serialize(original, defaults);
    expect(qs).toContain('isPet=1');
    const out = parse(qs, defaults);
    expect(out).toEqual({ isPet: true, beds: 3 });
  });

  it('Legacy STROps URL (true/false booleans) decodes correctly via parse', () => {
    // Simulates a URL shared from the old STROps encodeState — must still decode
    const legacyQs = 'isPet=true&beds=3';
    const out = parse(legacyQs, { isPet: false, beds: 0 });
    expect(out).toEqual({ isPet: true, beds: 3 });
  });

  it('STROps URL with leading ? decodes correctly via parse', () => {
    const strOpsStyleQs = '?isPet=true&beds=2';
    const out = parse(strOpsStyleQs, { isPet: false, beds: 0 });
    expect(out).toEqual({ isPet: true, beds: 2 });
  });

  it('STRBuyers URL (serialize output) round-trips back through parse after sharing', () => {
    const original = { price: 450000, beds: 3, isPet: true, label: 'beachfront' };
    const defaults = { price: 0, beds: 1, isPet: false, label: '' };
    const qs = serialize(original, defaults);
    const received = parse(qs, defaults);
    expect(received).toEqual(original);
  });
});
