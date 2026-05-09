const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const intl = new Intl.NumberFormat('en-US');

export const fmtUsd = (n: number) => usd.format(n);
export const fmtInt = (n: number) => intl.format(Math.round(n));

export function fmtPct(n: number, digits = 1): string {
  const v = n * 100;
  return `${v.toFixed(digits).replace(/\.0+$/, '')}%`;
}

export function fmtList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}
