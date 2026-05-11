/**
 * Phone number formatting for welcome books and check-in PDFs.
 *
 * Accepts loose input (digits, spaces, dashes, parentheses, +, leading 1)
 * and renders one of:
 *   - "(415) 555-0142"      — 10 digits (US domestic)
 *   - "+1 (415) 555-0142"   — 11 digits with leading 1 (US with country code)
 *   - "+44 20 7946 0958"    — international fallback (+ prefix, 8–15 digits)
 *
 * Returns the original (trimmed) string if it can't be normalized — always
 * leaves the raw value visible rather than an em-dash, since printable PDFs
 * benefit from showing what the host typed even if the format is non-standard.
 */

export function formatPhone(raw: string): string {
  if (raw == null) return '';
  const trimmed = String(raw).trim();
  if (trimmed === '') return '';

  // Capture leading + before stripping non-digits.
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');

  // US domestic: 10 digits
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // US with country code: 11 digits starting with 1
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  // International (+ prefix, 8–15 digits)
  if (hasPlus && digits.length >= 8 && digits.length <= 15) {
    // Naive grouping: extract country code (digits before last 10), then group rest.
    const cc = digits.slice(0, digits.length - 10) || digits.slice(0, 2);
    const rest = digits.slice(cc.length);
    const groups: string[] = [];
    let i = 0;
    while (i < rest.length) {
      const remaining = rest.length - i;
      const len = remaining >= 4 ? (remaining === 4 ? 4 : Math.min(remaining, 4)) : remaining;
      groups.push(rest.slice(i, i + len));
      i += len;
    }
    return `+${cc} ${groups.join(' ')}`.trim();
  }

  return trimmed;
}
