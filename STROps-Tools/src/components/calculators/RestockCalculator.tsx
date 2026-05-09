import { useEffect, useMemo, useState } from 'react';
import { computeRestock, type RestockItem } from '@lib/calc/restock';
import { encodeState, decodeState, browserReplacer } from '@lib/url-state';
import { track, markCalcRunOnce } from '@lib/analytics';

type State = {
  bookingsPerMonth: number;
  avgGuestsPerStay: number;
  items: string;
};
const defaults: State = {
  bookingsPerMonth: 10,
  avgGuestsPerStay: 3,
  items:
    'Toilet paper rolls,0.5,4\nDish soap (oz),1.0,4\nShampoo (oz),0.8,4\nCoffee pods,1.5,4',
};

function parseItems(items: string): RestockItem[] {
  return items
    .split('\n')
    .map(r => r.trim())
    .filter(Boolean)
    .map(r => {
      const [name, perGuestNight, avgNights] = r.split(',').map(s => s.trim());
      return {
        name,
        perGuestNight: Number(perGuestNight) || 0,
        avgNights: Number(avgNights) || 0,
      };
    });
}

export default function RestockCalculator() {
  const [s, setS] = useState<State>(defaults);
  const replacer = useMemo(() => browserReplacer(200), []);
  useEffect(() => {
    if (typeof window !== 'undefined') setS(decodeState(window.location.search, defaults));
  }, []);
  useEffect(() => {
    replacer(encodeState(s));
  }, [s, replacer]);

  const items = useMemo(() => parseItems(s.items), [s.items]);
  const r = useMemo(
    () =>
      computeRestock({
        bookingsPerMonth: s.bookingsPerMonth,
        avgGuestsPerStay: s.avgGuestsPerStay,
        items,
      }),
    [s.bookingsPerMonth, s.avgGuestsPerStay, items],
  );

  useEffect(() => {
    if (r.lines.length > 0 && markCalcRunOnce('restock-calculator')) {
      track('tool_calc_run', { tool: 'restock-calculator' });
    }
  }, [r]);

  return (
    <div className="calculator-shell border border-rule bg-parchment p-6 my-6">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <label className="text-sm">
          Bookings / month
          <input
            type="number"
            min={0}
            value={s.bookingsPerMonth}
            onChange={e => setS({ ...s, bookingsPerMonth: Number(e.target.value) })}
            className="block w-full border border-rule px-3 py-2 num"
          />
        </label>
        <label className="text-sm">
          Avg guests / stay
          <input
            type="number"
            min={0}
            step={0.5}
            value={s.avgGuestsPerStay}
            onChange={e => setS({ ...s, avgGuestsPerStay: Number(e.target.value) })}
            className="block w-full border border-rule px-3 py-2 num"
          />
        </label>
        <label className="text-sm md:col-span-1">
          Items (name,perGuestNight,avgNights)
          <textarea
            rows={5}
            value={s.items}
            onChange={e => setS({ ...s, items: e.target.value })}
            className="block w-full border border-rule px-3 py-2 mono text-xs"
          />
        </label>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-ink3 text-left">
            <th>Item</th>
            <th>Qty / month</th>
            <th>Qty / year</th>
          </tr>
        </thead>
        <tbody>
          {r.lines.map((l, i) => (
            <tr key={i} className="border-t border-rule">
              <td>{l.name}</td>
              <td className="num">{l.qtyPerMonth}</td>
              <td className="num">{l.qtyPerYear}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 flex gap-3" data-print="hide">
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="border border-rule px-4 py-2 text-sm"
        >
          Copy share link
        </button>
        <button
          onClick={() => window.print()}
          className="border border-rule px-4 py-2 text-sm"
        >
          Print
        </button>
      </div>
    </div>
  );
}
