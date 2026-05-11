/**
 * Shared types for @str/url-state.
 *
 * Primitive covers the value types supported natively in URLSearchParams.
 * State is the shape accepted by serialize/parse.
 * StateShape (from STROps) additionally allows arrays for comma-joined encoding.
 */

export type Primitive = string | number | boolean;
export type State = Record<string, Primitive | null | undefined>;
export type StateShape = Record<string, Primitive | Primitive[]>;
