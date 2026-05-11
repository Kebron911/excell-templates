/**
 * General number formatting helpers.
 *
 * Non-finite inputs (NaN, Infinity) return the em-dash "—".
 */

const DASH = '—';

export interface FormatNumberOptions {
  /** Fixed decimal places. When omitted, uses natural precision (0 min, 20 max). */
  decimals?: number;
  /** BCP 47 locale tag. Default: 'en-US' */
  locale?: string;
}

/**
 * Format a number with thousand separators and optional fixed decimals.
 * Normalizes -0 to 0.
 */
export function formatNumber(value: number, opts: FormatNumberOptions = {}): string {
  if (!Number.isFinite(value)) return DASH;
  const { decimals, locale = 'en-US' } = opts;
  // Normalize -0 to 0 for display.
  const v = value === 0 ? 0 : value;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 20,
  }).format(v);
}

/**
 * Format a number with compact abbreviation suffixes: K, M, B.
 *
 * Returns "1.2K", "1.5M", "2.5B". Trims trailing ".0" so 15,000 renders as
 * "15K" not "15.0K". Values under 1,000 are returned as plain strings.
 */
export function formatAbbreviated(value: number): string {
  if (!Number.isFinite(value)) return DASH;
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs < 1_000) return formatNumber(value, { locale: 'en-US' });

  const tiers: Array<[number, string]> = [
    [1_000_000_000, 'B'],
    [1_000_000, 'M'],
    [1_000, 'K'],
  ];
  for (const [divisor, suffix] of tiers) {
    if (abs >= divisor) {
      const scaled = abs / divisor;
      const rounded = Math.round(scaled * 10) / 10;
      const display = rounded % 1 === 0 ? `${rounded.toFixed(0)}` : `${rounded.toFixed(1)}`;
      return `${sign}${display}${suffix}`;
    }
  }
  return `${sign}${abs}`;
}

/**
 * Parse user input from form fields. Strips currency symbols ($, £, €, ¥),
 * commas, percent signs, and whitespace. Returns NaN for unparseable input.
 *
 * Does NOT auto-convert percent (50% → 50, not 0.5). Caller decides meaning.
 */
export function parseNumberInput(raw: string): number {
  if (raw == null) return NaN;
  const cleaned = String(raw).trim().replace(/[$,£€¥%\s]/g, '');
  if (cleaned === '' || cleaned === '-') return NaN;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}
