/**
 * Cross-app encode/decode compatibility tests for @str/url-state.
 *
 * Verifies that @str/url-state correctly decodes URLs produced by all 4
 * in-tree variants (STRGuests, STRBuyers, STRHost, STROps), and that
 * URLs encoded by @str/url-state decode correctly regardless of which
 * API the receiving app uses.
 *
 * Encoding formats:
 *   STRGuests/STRBuyers/STRHost  → booleans as "1"/"0", no array support, no leading "?"
 *   STROps                       → booleans as "true"/"false", arrays comma-joined, leading "?"
 *   @str/url-state serialize()   → booleans as "1"/"0", defaults-filtered, no leading "?"
 *   @str/url-state encodeState() → booleans as "true"/"false", arrays comma-joined, no leading "?"
 *
 * Lenient decoders:
 *   parse()       accepts "1"/"true" for true, "0"/"false" for false
 *   decodeState() accepts "true"/"1" for true, "false"/"0" for false
 */

import { describe, it, expect } from 'vitest';
import { serialize, parse, encodeState, decodeState } from '../src/index.js';

// ---------------------------------------------------------------------------
// STRGuests / STRBuyers / STRHost wire format (booleans as 1/0)
// ---------------------------------------------------------------------------
describe('cross-app compat: STRGuests/STRBuyers/STRHost wire format (booleans 1/0)', () => {
  it('parse() decodes a STRBuyers-style query string with boolean=1', () => {
    // Simulate what STRBuyers serialize() produces: booleans as 1/0
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
    expect(out.beds).toBe(1); // default preserved
  });

  it('serialize() emits booleans as 1/0 (STRGuests/STRBuyers/STRHost wire format)', () => {
    const qs = serialize({ isPet: true, hasPool: false }, { isPet: false, hasPool: false });
    expect(qs).toContain('isPet=1');
    // hasPool matches default → omitted
    expect(qs).not.toContain('hasPool');
  });

  it('serialize() omits values matching defaults', () => {
    const defaults = { price: 0, beds: 1, isPet: false };
    const qs = serialize({ price: 500000, beds: 1, isPet: false }, defaults);
    expect(qs).toContain('price=500000');
    expect(qs).not.toContain('beds');
    expect(qs).not.toContain('isPet');
  });

  it('decodeState() also decodes STRBuyers-style boolean=1 (lenient)', () => {
    const out = decodeState('isPet=1&beds=2', { isPet: false, beds: 0 });
    expect(out.isPet).toBe(true);
    expect(out.beds).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// STROps wire format (booleans as true/false, arrays comma-separated)
// ---------------------------------------------------------------------------
describe('cross-app compat: STROps wire format (booleans true/false, arrays comma-separated)', () => {
  it('decodeState() decodes a STROps-style query with boolean=true', () => {
    const out = decodeState('isPet=true&beds=3', { isPet: false, beds: 0 });
    expect(out).toEqual({ isPet: true, beds: 3 });
  });

  it('decodeState() decodes boolean=false as false', () => {
    const out = decodeState('isPet=false', { isPet: true });
    expect(out.isPet).toBe(false);
  });

  it('decodeState() decodes comma-separated arrays (STROps format)', () => {
    const out = decodeState('amenities=pool,wifi,parking', { amenities: [] as string[] });
    expect(out.amenities).toEqual(['pool', 'wifi', 'parking']);
  });

  it('decodeState() decodes URL-encoded comma-separated arrays', () => {
    // STROps encodes via URLSearchParams which percent-encodes commas
    const out = decodeState('amenities=pool%2Cwifi', { amenities: [] as string[] });
    expect(out.amenities).toEqual(['pool', 'wifi']);
  });

  it('encodeState() emits booleans as true/false (STROps wire format)', () => {
    const qs = encodeState({ isPet: true, hasPool: false });
    expect(qs).toContain('isPet=true');
    expect(qs).toContain('hasPool=false');
  });

  it('encodeState() emits comma-separated arrays (URL-encoded)', () => {
    const qs = encodeState({ amenities: ['pool', 'wifi'] });
    expect(qs).toContain('amenities=pool%2Cwifi');
  });

  it('encodeState() does NOT filter defaults (encodes everything)', () => {
    const qs = encodeState({ isPet: false, beds: 0 });
    expect(qs).toContain('isPet=false');
    expect(qs).toContain('beds=0');
  });

  it('parse() also decodes STROps-style boolean=true (lenient)', () => {
    const out = parse('isPet=true&beds=3', { isPet: false, beds: 0 });
    expect(out.isPet).toBe(true);
    expect(out.beds).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// Lenient boolean decoding: both APIs accept both encodings
// ---------------------------------------------------------------------------
describe('cross-app compat: lenient boolean decoding works for both APIs', () => {
  it('parse() accepts boolean=true (STROps wire format)', () => {
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

  it('decodeState() accepts boolean=1 (STRGuests/STRBuyers/STRHost wire format)', () => {
    const out = decodeState('isPet=1', { isPet: false });
    expect(out.isPet).toBe(true);
  });

  it('decodeState() accepts boolean=true (STROps wire format)', () => {
    const out = decodeState('isPet=true', { isPet: false });
    expect(out.isPet).toBe(true);
  });

  it('decodeState() accepts boolean=false as false', () => {
    const out = decodeState('isPet=false', { isPet: true });
    expect(out.isPet).toBe(false);
  });

  it('decodeState() accepts boolean=0 as false', () => {
    const out = decodeState('isPet=0', { isPet: true });
    expect(out.isPet).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Cross-app URL sharing: real round-trip scenarios
// ---------------------------------------------------------------------------
describe('cross-app compat: shared URLs decode correctly across sites', () => {
  it('URL serialized by STRBuyers (1/0 booleans) decodes correctly via STROps-style decodeState', () => {
    // STRBuyers-style encode via serialize (1/0 booleans, defaults-filtered)
    const qs = serialize({ isPet: true, beds: 3 }, { isPet: false, beds: 0 });
    expect(qs).toContain('isPet=1'); // confirm wire format

    // STROps-style decode via decodeState (lenient, accepts 1 as true)
    const out = decodeState(qs, { isPet: false, beds: 0 });
    expect(out).toEqual({ isPet: true, beds: 3 });
  });

  it('URL encoded by STROps-style encodeState (true/false) decodes correctly via parse', () => {
    // STROps-style encode via encodeState (true/false booleans, no defaults-filtering)
    const qs = encodeState({ isPet: true, beds: 3 });
    expect(qs).toContain('isPet=true'); // confirm wire format

    // STRBuyers/STRHost-style decode via parse (lenient, accepts "true")
    const out = parse(qs, { isPet: false, beds: 0 });
    expect(out).toEqual({ isPet: true, beds: 3 });
  });

  it('STROps URL with leading ? decodes correctly via parse', () => {
    // STROps in-tree encodeState returns a leading "?"
    const strOpsStyleQs = '?isPet=true&beds=2';
    const out = parse(strOpsStyleQs, { isPet: false, beds: 0 });
    expect(out).toEqual({ isPet: true, beds: 2 });
  });

  it('STROps URL with leading ? decodes correctly via decodeState', () => {
    // Note: "+" in a query string is decoded as a space by URLSearchParams (standard behavior)
    const strOpsStyleQs = '?amenities=pool,wifi&isPet=true';
    const out = decodeState(strOpsStyleQs, { amenities: [] as string[], isPet: false });
    expect(out.isPet).toBe(true);
    expect(out.amenities).toEqual(['pool', 'wifi']);
  });

  it('STRBuyers URL (serialize output) round-trips back through parse after sharing', () => {
    const original = { price: 450000, beds: 3, isPet: true, label: 'beachfront' };
    const defaults = { price: 0, beds: 1, isPet: false, label: '' };
    const qs = serialize(original, defaults);

    // Simulate the URL reaching another site that uses @str/url-state parse
    const received = parse(qs, defaults);
    expect(received).toEqual(original);
  });

  it('encodeState with arrays shares cleanly and decodes via decodeState', () => {
    const original = { amenities: ['pool', 'wifi', 'gym'], isPet: false };
    const qs = encodeState(original);

    const defaults = { amenities: [] as string[], isPet: false };
    const out = decodeState(qs, defaults);
    expect(out.amenities).toEqual(['pool', 'wifi', 'gym']);
    expect(out.isPet).toBe(false);
  });
});
