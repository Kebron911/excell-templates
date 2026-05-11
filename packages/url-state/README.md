# @str/url-state

Encode/decode calculator state in URL search params, with optional zod schema validation on decode.

## API

### Core (defaults-driven, matches all 4 in-tree apps)

```ts
import { serialize, parse, createDebouncedReplaceState } from '@str/url-state';

const defaults = { price: 0, bedrooms: 1, isPet: false };

// Serialize — omits keys matching defaults, booleans as 1/0
const qs = serialize({ price: 250000, bedrooms: 3, isPet: true }, defaults);
// "price=250000&bedrooms=3&isPet=1"

// Parse — typed via defaults, falls back to defaults for missing/invalid
const state = parse('price=250000&bedrooms=3', defaults);
// { price: 250000, bedrooms: 1, isPet: false }

// Debounced history.replaceState
const replace = createDebouncedReplaceState(200);
replace({ price: 250000, bedrooms: 3, isPet: true }, defaults);
```

## Cross-App URL Compatibility

This package's `parse()` and `decodeState()` are LENIENT — they accept booleans as both `1`/`0` (STRGuests/STRBuyers/STRHost convention) and `true`/`false` (STROps convention). This allows URLs shared between sites to decode correctly regardless of origin.

The encoders preserve the producing site's convention:
- `serialize()` emits `1`/`0` (STRGuests/STRBuyers/STRHost compatible)
- `encodeState()` emits `true`/`false` (STROps compatible)

When wiring a new site to this package, prefer `serialize`/`parse` for new code (more compact wire format) but use `encodeState`/`decodeState` if migrating from STROps' in-tree implementation to preserve URL backward compatibility.

### Extended (encodeState / decodeState / withState)

```ts
import { encodeState, decodeState, withState } from '@str/url-state';

// encodeState — no defaults filtering, arrays as comma-separated
const qs = encodeState({ price: 250000, amenities: ['pool', 'wifi'] });
// "price=250000&amenities=pool%2Cwifi"

// decodeState — defaults-driven coercion, arrays split on comma
const state = decodeState('price=250000', { price: 0, amenities: [] as string[] });
// { price: 250000, amenities: [] }

// withState — appends encoded state to a full URL
const url = withState('https://example.com/calc', { price: 250000, bedrooms: 3 });
// "https://example.com/calc?price=250000&bedrooms=3"
```
