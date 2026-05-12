# @str/url-state

Encode/decode calculator state in URL search params for all 4 STR-Tools apps
(STRGuests, STRBuyers, STRHost, STROps).

## API

```ts
import { serialize, parse, createDebouncedReplaceState } from '@str/url-state';

const defaults = { price: 0, bedrooms: 1, isPet: false };

// Serialize — omits keys matching defaults, booleans as 1/0
const qs = serialize({ price: 250000, bedrooms: 3, isPet: true }, defaults);
// "price=250000&bedrooms=3&isPet=1"

// Parse — typed via defaults, falls back to defaults for missing/invalid.
// Accepts a raw search string (with or without "?") or a URLSearchParams instance.
const state = parse('price=250000&bedrooms=3', defaults);
// { price: 250000, bedrooms: 1, isPet: false }

const state2 = parse(new URLSearchParams(window.location.search), defaults);

// Debounced history.replaceState — call with (state, defaults) to update the URL
const replace = createDebouncedReplaceState(200);
replace({ price: 250000, bedrooms: 3, isPet: true }, defaults);
```

## Cross-App URL Compatibility

`parse()` is **lenient** — it accepts booleans as both `1`/`0` and `true`/`false`.
This means any URLs previously shared from the old STROps API (`true`/`false` encoding)
still decode correctly after migration to the canonical `serialize`/`parse` API.

`serialize()` always emits `1`/`0` (shorter wire format).
