/**
 * Currency formatting helpers.
 *
 * Non-finite inputs (NaN, Infinity) return the em-dash "—" so callers can
 * render gracefully when an input is missing or a division-by-zero occurs.
 */

const DASH = '—';

export interface FormatCurrencyOptions {
  /** ISO 4217 currency code. Default: 'USD' */
  currency?: string;
  /** Maximum fraction digits. Default: 2 */
  maximumFractionDigits?: number;
  /** Minimum fraction digits. Default: matches maximumFractionDigits (or 0 if max is 0). */
  minimumFractionDigits?: number;
  /** BCP 47 locale tag. Default: 'en-US' */
  locale?: string;
}

export function formatCurrency(value: number, opts: FormatCurrencyOptions = {}): string {
  if (!Number.isFinite(value)) return DASH;
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
