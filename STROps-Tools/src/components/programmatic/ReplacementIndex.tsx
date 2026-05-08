/**
 * ReplacementIndex — sortable React island for /replace/.
 * Sortable by name · category · costLow · costHigh · lifespanYears.
 * Category filter dropdown.
 * Click a row to navigate to /replace/{slug}/.
 */

import { useMemo, useState } from 'react';

export type ReplacementRow = {
  slug: string;
  name: string;
  category: string;
  costLow: number;
  costHigh: number;
  lifespanYears: number;
};

type SortKey = 'name' | 'category' | 'costLow' | 'costHigh' | 'lifespanYears';
type SortDir = 'asc' | 'desc';

interface Props {
  rows: ReplacementRow[];
}

export default function ReplacementIndex({ rows }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');

  const categories = useMemo(
    () => Array.from(new Set(rows.map(r => r.category))).sort(),
    [rows],
  );

  const view = useMemo(() => {
    let filtered = rows;
    if (category) filtered = filtered.filter(r => r.category === category);
    if (q) {
      const ql = q.toLowerCase();
      filtered = filtered.filter(r => r.name.toLowerCase().includes(ql));
    }
    const sorted = [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      const aStr = String(av);
      const bStr = String(bv);
      return sortDir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
    return sorted;
  }, [rows, category, q, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function arrow(key: SortKey): string {
    if (key !== sortKey) return '';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  }

  return (
    <div className="surface-calc p-4 my-6">
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <label className="md:col-span-1 text-small block">
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
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 focus:outline-none focus:border-accent focus:shadow-focus"
          >
            <option value="">All categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <p className="text-caption text-ink-3 self-end leading-snug">
          {view.length} of {rows.length} items. Click a header to sort.
        </p>
      </div>

      <table className="w-full text-small">
        <thead>
          <tr className="text-ink-3 text-left">
            <th
              className="font-normal py-1 cursor-pointer hover:text-accent-deep select-none"
              onClick={() => toggleSort('name')}
            >
              Item{arrow('name')}
            </th>
            <th
              className="font-normal py-1 cursor-pointer hover:text-accent-deep select-none"
              onClick={() => toggleSort('category')}
            >
              Category{arrow('category')}
            </th>
            <th
              className="font-normal py-1 text-right cursor-pointer hover:text-accent-deep select-none"
              onClick={() => toggleSort('costLow')}
            >
              Low{arrow('costLow')}
            </th>
            <th
              className="font-normal py-1 text-right cursor-pointer hover:text-accent-deep select-none"
              onClick={() => toggleSort('costHigh')}
            >
              High{arrow('costHigh')}
            </th>
            <th
              className="font-normal py-1 text-right cursor-pointer hover:text-accent-deep select-none"
              onClick={() => toggleSort('lifespanYears')}
            >
              Lifespan{arrow('lifespanYears')}
            </th>
          </tr>
        </thead>
        <tbody>
          {view.length === 0 && (
            <tr>
              <td colSpan={5} className="py-2 text-ink-3">No matches.</td>
            </tr>
          )}
          {view.map(r => (
            <tr
              key={r.slug}
              onClick={() => { window.location.href = `/replace/${r.slug}`; }}
              className="border-t border-rule cursor-pointer hover:bg-parchment-alt"
            >
              <td className="py-1.5 text-navy">{r.name}</td>
              <td className="py-1.5 text-ink-2 capitalize">{r.category}</td>
              <td className="py-1.5 text-right font-mono num">${r.costLow}</td>
              <td className="py-1.5 text-right font-mono num">${r.costHigh}</td>
              <td className="py-1.5 text-right font-mono num">{r.lifespanYears}y</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
