/**
 * RestockCalculator — hydrated island. Items in textarea CSV. URL-stateful.
 *
 * Bonus action: copy results as TSV to clipboard so the host can paste into
 * Excel/Sheets as a reorder list.
 */

import { useEffect, useMemo, useState } from 'react';
import { computeRestock, type RestockItem } from '@/lib/calc/restock';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';

type State = {
  bookingsPerMonth: number;
  avgGuestsPerStay: number;
  items: string;
};

const defaults: State = {
  bookingsPerMonth: 10,
  avgGuestsPerStay: 3,
  items: [
    'Toilet paper rolls,0.5,4',
    'Dish soap (oz),1,4',
    'Trash bags,0.25,4',
    'Coffee pods,1.5,4',
    'Paper towels (rolls),0.2,4',
  ].join('\n'),
};

function parseItems(rows: string): RestockItem[] {
  return rows
    .split('\n')
    .map(r => r.trim())
    .filter(Boolean)
    .map(r => {
      const [name, perGuestNight, avgNights] = r.split(',').map(x => x.trim());
      return {
        name,
        perGuestNight: Number(perGuestNight) || 0,
        avgNights: Number(avgNights) || 0,
      };
    });
}

export default function RestockCalculator() {
  const [s, setS] = useState<State>(defaults);
  const [copied, setCopied] = useState(false);
  const replacer = useMemo(() => createDebouncedReplaceState(200), []);

  useEffect(() => {
    if (typeof window !== 'undefined') setS(parse(window.location.search, defaults));
  }, []);

  useEffect(() => {
    replacer(s, defaults);
  }, [s, replacer]);

  const items = useMemo(() => parseItems(s.items), [s.items]);
  const result = useMemo(
    () => computeRestock({
      bookingsPerMonth: s.bookingsPerMonth,
      avgGuestsPerStay: s.avgGuestsPerStay,
      items,
    }),
    [s.bookingsPerMonth, s.avgGuestsPerStay, items],
  );

  function copyTsv() {
    const tsv = ['Item\tPer month\tPer year'];
    for (const l of result.lines) tsv.push(`${l.name}\t${l.qtyPerMonth}\t${l.qtyPerYear}`);
    navigator.clipboard?.writeText(tsv.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="surface-calc p-6 my-6">
      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <label className="text-small block">
          <span className="block text-ink-2 mb-1">Bookings per month</span>
          <input
            type="number"
            min={0}
            max={120}
            value={s.bookingsPerMonth}
            onChange={e => setS({ ...s, bookingsPerMonth: Number(e.target.value) || 0 })}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 num focus:outline-none focus:border-accent focus:shadow-focus"
          />
        </label>
        <label className="text-small block">
          <span className="block text-ink-2 mb-1">Avg guests per stay</span>
          <input
            type="number"
            min={1}
            max={20}
            step={0.5}
            value={s.avgGuestsPerStay}
            onChange={e => setS({ ...s, avgGuestsPerStay: Number(e.target.value) || 0 })}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 num focus:outline-none focus:border-accent focus:shadow-focus"
          />
        </label>
        <label className="md:col-span-3 text-small block">
          <span className="block text-ink-2 mb-1">
            Consumables <code className="text-caption">name,perGuestNight,avgNights</code> — one per line
          </span>
          <textarea
            rows={6}
            value={s.items}
            onChange={e => setS({ ...s, items: e.target.value })}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 font-mono text-caption focus:outline-none focus:border-accent focus:shadow-focus"
          />
        </label>
      </div>

      <p className="label text-navy mb-2">Reorder quantities</p>
      <table className="w-full text-small">
        <thead>
          <tr className="text-ink-3 text-left">
            <th className="font-normal py-1">Item</th>
            <th className="font-normal py-1 text-right">Per month</th>
            <th className="font-normal py-1 text-right">Per year</th>
          </tr>
        </thead>
        <tbody>
          {result.lines.length === 0 && (
            <tr>
              <td colSpan={3} className="py-2 text-ink-3">
                Add at least one item.
              </td>
            </tr>
          )}
          {result.lines.map((l, i) => (
            <tr key={i} className="border-t border-rule">
              <td className="py-1.5">{l.name}</td>
              <td className="py-1.5 num text-right font-mono">{l.qtyPerMonth}</td>
              <td className="py-1.5 num text-right font-mono">{l.qtyPerYear}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex flex-wrap gap-3 print:hidden">
        <button
          type="button"
          onClick={copyTsv}
          disabled={result.lines.length === 0}
          className="rounded-md bg-accent text-parchment px-5 py-2 text-ui font-semibold hover:bg-accent-deep disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-std focus:outline-none focus:shadow-focus"
        >
          {copied ? 'Copied to clipboard' : 'Copy reorder list (TSV)'}
        </button>
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(window.location.href)}
          className="rounded-md border border-rule bg-parchment px-4 py-2 text-ui hover:border-accent hover:shadow-card transition-all duration-std focus:outline-none focus:shadow-focus"
        >
          Copy share link
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md border border-rule bg-parchment px-4 py-2 text-ui hover:border-accent hover:shadow-card transition-all duration-std focus:outline-none focus:shadow-focus"
        >
          Print
        </button>
      </div>
    </div>
  );
}
