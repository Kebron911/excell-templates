# @str/format

Number, date, currency, and string formatters shared across STR-Tools apps.

Pure functions, zero dependencies. 100% unit-test coverage required.

## Usage

```ts
import { formatCurrency, formatPercent } from '@str/format';

formatCurrency(1234.5);  // "$1,234.50"
formatPercent(0.125);    // "12.5%"
```

## Migration Notes

### From STROps' in-tree `format.ts` (Phase 3 wiring)

STROps currently has `fmtUsd`, `fmtInt`, `fmtPct`, `fmtList` in its in-tree `src/lib/format.ts`. None have callers in STROps source today, so they are NOT in `@str/format`. Before Phase 3 wires STROps to `@str/format`:

- `fmtUsd(n)` → `formatCurrency(n)` (drop-in for default options)
- `fmtInt(n)` → `formatNumber(n, { decimals: 0 })`
- `fmtPct(n)` → `formatPercent(n)` — **BEHAVIORAL DIFFERENCE:** `fmtPct` always treats input as decimal (multiplies by 100). `formatPercent` auto-detects: values with `|v| < 1` are decimal, `|v| >= 1` are already-percent. If STROps ever passes `fmtPct(1.5)` expecting `"150%"`, `formatPercent(1.5)` returns `"1.5%"`. Audit callsites before swap.
- `fmtList(items)` (Oxford-comma list) — **NO EQUIVALENT.** Either add `formatList` to `@str/format` when first needed, or keep `fmtList` in STROps locally.

### `formatPercent` auto-detect heuristic

`formatPercent(0.15)` returns `"15%"` (decimal form). `formatPercent(15)` returns `"15%"` (already-percent). `formatPercent(1)` returns `"1%"` (already-percent — NOT 100%).

If your data convention is ambiguous, pre-multiply or pre-normalize before calling, or wait for a future `form: 'decimal' | 'percent'` opt-in option (not implemented in v0.1.0).
