/**
 * DamageCostLookup — searchable replacement-cost catalog. Phase 2 ships a
 * seed of common items; Phase 3 Task 21 expands to ~50 with deep
 * /replace/[item] pages. Row click navigates to those (404 until then).
 */

import { useMemo, useState } from 'react';
import items from '@/data/items.json';

type Item = {
  name: string;
  category: string;
  costRange: [number, number];
  lifespanYears: number;
  brandRecs: string[];
  sourceUrls: string[];
  lastVerified: string;
};
type Catalog = Record<string, Item>;
// Cast through `unknown` — TypeScript widens JSON tuple literals like
// `[100, 250]` to `number[]`, which trips ts(2352)'s structural-assertion
// branch. Runtime data shape matches `Catalog` exactly.
const catalog = items as unknown as Catalog;

export default function DamageCostLookup() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');

  const cats = useMemo(
    () => Array.from(new Set(Object.values(catalog).map(i => i.category))).sort(),
    [],
  );

  const rows = useMemo(() => {
    const all = Object.entries(catalog);
    const filtered = all.filter(([, it]) => {
      const matchesQ = !q || it.name.toLowerCase().includes(q.toLowerCase());
      const matchesCat = !cat || it.category === cat;
      return matchesQ && matchesCat;
    });
    return filtered.sort(([, a], [, b]) => a.name.localeCompare(b.name));
  }, [q, cat]);

  return (
    <div className="surface-calc p-6 my-6">
      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <label className="md:col-span-2 text-small block">
          <span className="block text-ink-2 mb-1">Search</span>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="mattress, sofa, lamp…"
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 focus:outline-none focus:border-accent focus:shadow-focus"
          />
        </label>
        <label className="text-small block">
          <span className="block text-ink-2 mb-1">Category</span>
          <select
            value={cat}
            onChange={e => setCat(e.target.value)}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 focus:outline-none focus:border-accent focus:shadow-focus"
          >
            <option value="">All</option>
            {cats.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <table className="w-full text-small">
        <thead>
          <tr className="text-ink-3 text-left">
            <th className="font-normal py-1">Item</th>
            <th className="font-normal py-1">Category</th>
            <th className="font-normal py-1 text-right">Cost range</th>
            <th className="font-normal py-1 text-right">Lifespan</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="py-2 text-ink-3">
                No matches.
              </td>
            </tr>
          )}
          {rows.map(([slug, it]) => (
            <tr
              key={slug}
              onClick={() => {
                window.location.href = `/replace/${slug}`;
              }}
              className="border-t border-rule cursor-pointer hover:bg-parchment-alt"
            >
              <td className="py-1.5 text-navy">{it.name}</td>
              <td className="py-1.5 text-ink-2 capitalize">{it.category}</td>
              <td className="py-1.5 num text-right font-mono">
                ${it.costRange[0]}–${it.costRange[1]}
              </td>
              <td className="py-1.5 num text-right font-mono">{it.lifespanYears}y</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-caption text-ink-3 leading-snug">
        Cost ranges are typical replacement costs (low–high), not insurance estimates. Click a row for brand recs and a per-item replacement guide.
      </p>
    </div>
  );
}
