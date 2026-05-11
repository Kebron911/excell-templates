/** Single source for date / currency / number formatting across the console. */

const DAY_MS = 86_400_000;

export function formatDate(input: string | Date | null | undefined, mode: 'auto' | 'relative' | 'absolute' | 'full' = 'auto'): string {
  if (!input) return '—';
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '—';
  const now = Date.now();
  const diffDays = Math.floor((now - d.getTime()) / DAY_MS);
  const sameYear = d.getFullYear() === new Date().getFullYear();

  if (mode === 'relative' || (mode === 'auto' && Math.abs(diffDays) < 30)) {
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays === -1) return 'tomorrow';
    if (diffDays > 0) return `${diffDays}d ago`;
    return `in ${Math.abs(diffDays)}d`;
  }
  if (mode === 'absolute' || (mode === 'auto' && sameYear)) {
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(input: string | Date | null | undefined): string {
  if (!input) return '—';
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function formatCurrency(n: number | null | undefined, opts: { decimals?: number; symbol?: string } = {}): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  const { decimals = 0, symbol = '$' } = opts;
  return `${symbol}${n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

export function formatPercent(ratio: number | null | undefined, decimals = 0): string {
  if (ratio === null || ratio === undefined || Number.isNaN(ratio)) return '—';
  return `${(ratio * 100).toFixed(decimals)}%`;
}

export function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return n.toLocaleString();
}

export function ageInDays(input: string | Date | null | undefined): number | null {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / DAY_MS);
}
