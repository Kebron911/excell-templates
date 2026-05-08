import { useMemo, useState } from 'react';
import items from '@data/items.json';

type Item = {
  name: string;
  category: string;
  costRange: [number, number];
  lifespanYears: number;
};
type Catalog = Record<string, Item>;
const catalog = items as unknown as Catalog;

export default function DamageCostLookup() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const rows = useMemo(() => {
    const all = Object.entries(catalog);
    const filtered = all.filter(([, it]) => {
      const matchesQ = !q || it.name.toLowerCase().includes(q.toLowerCase());
      const matchesCat = !cat || it.category === cat;
      return matchesQ && matchesCat;
    });
    return filtered.sort(([, a], [, b]) => a.name.localeCompare(b.name));
  }, [q, cat]);
  const cats = Array.from(new Set(Object.values(catalog).map(i => i.category))).sort();
  return (
    <div className="calculator-shell border border-rule bg-parchment p-6 my-6">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <label className="text-sm md:col-span-2">
          Search
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            className="block w-full border border-rule px-3 py-2"
            placeholder="mattress, sofa, lamp..."
          />
        </label>
        <label className="text-sm">
          Category
          <select
            value={cat}
            onChange={e => setCat(e.target.value)}
            className="block w-full border border-rule px-3 py-2"
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
      <table className="w-full text-sm">
        <thead>
          <tr className="text-ink3 text-left">
            <th>Item</th>
            <th>Category</th>
            <th>Cost range</th>
            <th>Lifespan</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([slug, it]) => (
            <tr
              key={slug}
              onClick={() => (window.location.href = `/replace/${slug}`)}
              className="border-t border-rule cursor-pointer hover:bg-parchment-alt"
            >
              <td>{it.name}</td>
              <td className="text-ink2">{it.category}</td>
              <td className="num">
                ${it.costRange[0]}–${it.costRange[1]}
              </td>
              <td className="num">{it.lifespanYears}y</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="text-ink2 text-sm mt-4">No items match your search.</p>
      )}
    </div>
  );
}
