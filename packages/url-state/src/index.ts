// Canonical API — used by STRGuests, STRBuyers, STRHost, and STROps
export { serialize } from './serialize.js';
export { parse } from './parse.js';
export { createDebouncedReplaceState } from './debounce.js';

// Types
export type { Primitive, State, StateShape } from './types.js';
export type { DefaultsMap } from './parse.js';
