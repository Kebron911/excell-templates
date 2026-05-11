// Core API — matches STRGuests / STRBuyers / STRHost in-tree variants
export { serialize } from './serialize.js';
export { parse } from './parse.js';
export { createDebouncedReplaceState, makeReplacer, browserReplacer } from './debounce.js';

// Extended API — matches STROps variant + task spec surface
export { encodeState } from './encode.js';
export { decodeState } from './decode.js';
export { withState } from './with-state.js';

// Types
export type { Primitive, State, StateShape } from './types.js';
export type { DefaultsMap } from './decode.js';
