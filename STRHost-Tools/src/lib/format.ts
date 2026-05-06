/**
 * Formatting helpers for currency, percent, and number display.
 *
 * Used by every calculator. Numbers render with `font-variant-numeric: tabular-nums`
 * via the `.num` / `.font-mono` class on the rendering element — these helpers
 * return strings only.
 *
 * Non-finite inputs (NaN, Infinity) return the em-dash "—" so calculators can
 * render gracefully when an input is missing or a division-by-zero occurs.
 */

const DASH = '—';

function isFinite(n: number): boolean {
  return Number.isFinite(n);
}

export interface FormatCurrencyOptions {
  currency?: string;             // default 'USD'
  maximumFractionDigits?: number; // default 2
  minimumFractionDigits?: number; // default 2
  locale?: string;               // default 'en-US'
}

export function formatCurrency(value: number, opts: FormatCurrencyOptions = {}): string {
  if (!isFinite(value)) return DASH;
  const {
    currency = 'USD',
    maximumFractionDigits = 2,
    minimumFractionDigits = maximumFractionDigits === 0 ? 0 : 2,
    locale = 'en-US',
  } = opts;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value);
}

export interface FormatPercentOptions {
  decimals?: number;  // default: 1, but trims trailing zeros to look natural
  locale?: string;
}

export function formatPercent(value: number, opts: FormatPercentOptions = {}): string {
  if (!isFinite(value)) return DASH;
  const { decimals, locale = 'en-US' } = opts;
  // Disambiguation: values in [0, 1] are decimal percent; values > 1 are already-percent.
  // Special case 1 → "100%" since callers entering "1" probably mean 100%.
  // Negatives: same rule applied to absolute value.
  const isDecimalForm = Math.abs(value) > 0 && Math.abs(value) <= 1;
  const asPercent = isDecimalForm ? value * 100 : value;

  if (decimals !== undefined) {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(asPercent) + '%';
  }

  // Default: show up to 2 decimals, trim trailing zeros, never show ".0%"
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(asPercent);
  return formatted + '%';
}

export interface FormatNumberOptions {
  decimals?: number;
  locale?: string;
}

export function formatNumber(value: number, opts: FormatNumberOptions = {}): string {
  if (!isFinite(value)) return DASH;
  const { decimals, locale = 'en-US' } = opts;
  // Normalize -0 to 0 for display
  const v = value === 0 ? 0 : value;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 20,
  }).format(v);
}

/**
 * Returns "1.2K", "1.5M", "2.5B" — used for big-number summary cards.
 * Trims trailing ".0" so 15,000 renders as "15K" not "15.0K".
 */
export function formatAbbreviated(value: number): string {
  if (!isFinite(value)) return DASH;
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs < 1_000) return `${sign}${abs}`;

  const tiers: Array<[number, string]> = [
    [1_000_000_000, 'B'],
    [1_000_000, 'M'],
    [1_000, 'K'],
  ];
  for (const [divisor, suffix] of tiers) {
    if (abs >= divisor) {
      const scaled = abs / divisor;
      // 1 decimal, but trim trailing .0
      const rounded = Math.round(scaled * 10) / 10;
      const display = rounded % 1 === 0 ? `${rounded.toFixed(0)}` : `${rounded.toFixed(1)}`;
      return `${sign}${display}${suffix}`;
    }
  }
  return `${sign}${abs}`;
}

/**
 * Parses user input from form fields. Strips currency symbols, commas, and
 * percent signs (but does not auto-convert percent). Returns NaN for unparseable
 * input — caller decides whether to use a default or show an error.
 */
export function parseNumberInput(raw: string): number {
  if (raw == null) return NaN;
  const cleaned = String(raw).trim().replace(/[$,£€¥%\s]/g, '');
  if (cleaned === '' || cleaned === '-') return NaN;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}
