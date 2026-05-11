/**
 * Percent formatting helpers.
 *
 * Auto-detects decimal form:
 * - Values where 0 < |v| < 1 are treated as decimal form (multiplied by 100).
 *   e.g. `formatPercent(0.5)` → `"50%"`, `formatPercent(0.99)` → `"99%"`.
 * - Values where |v| >= 1 are treated as already-percent.
 *   e.g. `formatPercent(1)` → `"1%"` (NOT "100%"), `formatPercent(15)` → `"15%"`.
 * - Zero passes through as-is (`"0%"`).
 *
 * **Important boundary:** `formatPercent(1)` returns `"1%"`, not `"100%"`.
 * If your data convention treats 1.0 as "100%", pre-multiply before calling.
 *
 * Non-finite inputs (NaN, Infinity) return the em-dash "—".
 */

const DASH = '—';

export interface FormatPercentOptions {
  /** Fixed decimal places. When omitted, trims trailing zeros (up to 2 decimals). */
  decimals?: number;
  /** BCP 47 locale tag. Default: 'en-US' */
  locale?: string;
}

export function formatPercent(value: number, opts: FormatPercentOptions = {}): string {
  if (!Number.isFinite(value)) return DASH;
  const { decimals, locale = 'en-US' } = opts;

  // Disambiguate decimal form vs already-percent form.
  // |v| in (0, 1) → decimal; multiply by 100.
  // |v| = 0 or |v| >= 1 → already percent.
  const isDecimalForm = Math.abs(value) > 0 && Math.abs(value) < 1;
  const asPercent = isDecimalForm ? value * 100 : value;

  if (decimals !== undefined) {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(asPercent) + '%';
  }

  // Default: up to 2 decimals, trailing zeros trimmed (minimumFractionDigits: 0).
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(asPercent);
  return formatted + '%';
}
