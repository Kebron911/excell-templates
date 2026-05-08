/**
 * MaintenanceIndex — sortable React island for /maintenance/.
 * Reads pre-flattened rows from props (Astro frontmatter does the JSON load).
 *
 * Sortable: name · cadenceDays · season · costLow · skillLevel.
 * Click a row to navigate to /maintenance/{slug}/.
 */

import { useMemo, useState } from 'react';

export type MaintenanceRow = {
  slug: string;
  name: string;
  cadenceDays: number;
  season: string;
  costLow: number;
  costHigh: number;
  skillLevel: 'diy' | 'pro';
};

type SortKey = 'name' | 'cadenceDays' | 'season' | 'costLow' | 'skillLevel';
type SortDir = 'asc' | 'desc';

interface Props {
  rows: MaintenanceRow[];
}

export default function MaintenanceIndex({ rows }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [season, setSeason] = useState('');

  const seasons = useMemo(
    () => Array.from(new Set(rows.map(r => r.season))).sort(),
    [rows],
  );

  const view = useMemo(() => {
    const filtered = season ? rows.filter(r => r.season === season) : rows;
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
  }, [rows, season, sortKey, sortDir]);

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
      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <label className="text-small block">
          <span className="block text-ink-2 mb-1">Filter by season</span>
          <select
            value={season}
            onChange={e => setSeason(e.target.value)}
            className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 focus:outline-none focus:border-accent focus:shadow-focus"
          >
            <option value="">All seasons</option>
            {seasons.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <p className="text-caption text-ink-3 self-end leading-snug">
          {view.length} of {rows.length} tasks. Click a header to sort.
        </p>
      </div>

      <table className="w-full text-small">
        <thead>
          <tr className="text-ink-3 text-left">
            <th
              className="font-normal py-1 cursor-pointer hover:text-accent-deep select-none"
              onClick={() => toggleSort('name')}
            >
              Task{arrow('name')}
            </th>
            <th
              className="font-normal py-1 text-right cursor-pointer hover:text-accent-deep select-none"
              onClick={() => toggleSort('cadenceDays')}
            >
              Cadence{arrow('cadenceDays')}
            </th>
            <th
              className="font-normal py-1 cursor-pointer hover:text-accent-deep select-none"
              onClick={() => toggleSort('season')}
            >
              Season{arrow('season')}
            </th>
            <th
              className="font-normal py-1 text-right cursor-pointer hover:text-accent-deep select-none"
              onClick={() => toggleSort('costLow')}
            >
              Cost low{arrow('costLow')}
            </th>
            <th
              className="font-normal py-1 cursor-pointer hover:text-accent-deep select-none"
              onClick={() => toggleSort('skillLevel')}
            >
              Skill{arrow('skillLevel')}
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
              onClick={() => { window.location.href = `/maintenance/${r.slug}`; }}
              className="border-t border-rule cursor-pointer hover:bg-parchment-alt"
            >
              <td className="py-1.5 text-navy">{r.name}</td>
              <td className="py-1.5 text-right font-mono num">{r.cadenceDays}d</td>
              <td className="py-1.5 text-ink-2 capitalize">{r.season}</td>
              <td className="py-1.5 text-right font-mono num">${r.costLow}</td>
              <td className="py-1.5 capitalize">{r.skillLevel === 'pro' ? 'Pro' : 'DIY'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
