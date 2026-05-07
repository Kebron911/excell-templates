/**
 * Formatting helpers for currency, percent, number, and phone display.
 *
 * Used by every generator. Numbers render with `font-variant-numeric:
 * tabular-nums` via the `.num` / `.font-mono` class on the rendering element —
 * these helpers return strings only.
 *
 * Non-finite inputs (NaN, Infinity) return the em-dash "—" so generators can
 * render gracefully when an input is missing or a division-by-zero occurs.
 *
 * Cluster note: mirrors strhost.tools/src/lib/format.ts with one addition —
 * formatPhone() for welcome-book + check-in PDFs.
 */

const DASH = '—';

function isFinite(n: number): boolean {
  return Number.isFinite(n);
}

export interface FormatCurrencyOptions {
  currency?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  locale?: string;
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
  decimals?: number;
  locale?: string;
}

export function formatPercent(value: number, opts: FormatPercentOptions = {}): string {
  if (!isFinite(value)) return DASH;
  const { decimals, locale = 'en-US' } = opts;
  const isDecimalForm = Math.abs(value) > 0 && Math.abs(value) <= 1;
  const asPercent = isDecimalForm ? value * 100 : value;

  if (decimals !== undefined) {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(asPercent) + '%';
  }

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
  const v = value === 0 ? 0 : value;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 20,
  }).format(v);
}

/**
 * Returns "1.2K", "1.5M", "2.5B" — used for big-number summary cards.
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
      const rounded = Math.round(scaled * 10) / 10;
      const display = rounded % 1 === 0 ? `${rounded.toFixed(0)}` : `${rounded.toFixed(1)}`;
      return `${sign}${display}${suffix}`;
    }
  }
  return `${sign}${abs}`;
}

/**
 * Parses user input from form fields. Strips currency symbols, commas, and
 * percent signs. Returns NaN for unparseable input.
 */
export function parseNumberInput(raw: string): number {
  if (raw == null) return NaN;
  const cleaned = String(raw).trim().replace(/[$,£€¥%\s]/g, '');
  if (cleaned === '' || cleaned === '-') return NaN;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Format a US phone number for display in welcome books and check-in PDFs.
 *
 * Accepts loose input (digits, spaces, dashes, parentheses, +, leading 1)
 * and renders one of:
 *   - "(415) 555-0142"      — 10 digits
 *   - "+1 (415) 555-0142"   — 11 digits with leading 1
 *   - "+44 20 7946 0958"    — international fallback (digits + space groups)
 *
 * Returns the original (trimmed) string if it can't be normalized — always
 * leaves the raw value visible rather than the em-dash, since printable PDFs
 * benefit from showing what the host typed even if the format is non-standard.
 */
export function formatPhone(raw: string): string {
  if (raw == null) return '';
  const trimmed = String(raw).trim();
  if (trimmed === '') return '';

  // Capture leading + before stripping non-digits.
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  if (hasPlus && digits.length >= 8 && digits.length <= 15) {
    // Naive international grouping: country code 1–3 digits, then 2-4-4-ish.
    const cc = digits.slice(0, digits.length - 10) || digits.slice(0, 2);
    const rest = digits.slice(cc.length);
    const groups: string[] = [];
    let i = 0;
    while (i < rest.length) {
      const len = rest.length - i >= 4 ? (rest.length - i === 4 ? 4 : Math.min(rest.length - i, 4)) : rest.length - i;
      groups.push(rest.slice(i, i + len));
      i += len;
    }
    return `+${cc} ${groups.join(' ')}`.trim();
  }

  return trimmed;
}
