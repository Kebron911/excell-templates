import { useMemo, useState } from 'react';
import type { CityEntry, RegulationStatus, SaturationTier } from '@/data/cities';
import { formatCurrency, formatPercent } from '@/lib/format';

type SortKey = 'state' | 'score' | 'adr' | 'occ';

interface Props {
  cities: CityEntry[];
}

const REG_OPTIONS: RegulationStatus[] = ['permissive', 'moderate', 'restrictive', 'banned'];
const SAT_OPTIONS: SaturationTier[] = ['A', 'B', 'C', 'D'];

const REG_BADGE: Record<RegulationStatus, string> = {
  permissive: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  moderate: 'bg-amber-100 text-amber-900 border-amber-300',
  restrictive: 'bg-orange-100 text-orange-900 border-orange-300',
  banned: 'bg-red-100 text-red-900 border-red-300',
};

const REG_LABEL: Record<RegulationStatus, string> = {
  permissive: 'Permissive',
  moderate: 'Moderate',
  restrictive: 'Restrictive',
  banned: 'Banned',
};

function scoreCls(score: number): string {
  if (score >= 80) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
  if (score >= 60) return 'bg-amber-100 text-amber-900 border-amber-300';
  return 'bg-stone-200 text-stone-700 border-stone-300';
}

export default function CitiesIndex({ cities }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [regFilter, setRegFilter] = useState<Set<RegulationStatus>>(new Set());
  const [satFilter, setSatFilter] = useState<Set<SaturationTier>>(new Set());
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = cities.filter((c) => {
      if (regFilter.size > 0 && !regFilter.has(c.regulationStatus)) return false;
      if (satFilter.size > 0 && !satFilter.has(c.saturationTier)) return false;
      if (q.length > 0) {
        const hay = `${c.name} ${c.state} ${c.stateName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    arr = [...arr].sort((a, b) => {
      switch (sortKey) {
        case 'state':
          return (
            a.stateName.localeCompare(b.stateName) ||
            a.name.localeCompare(b.name)
          );
        case 'score':
          return b.marketScore - a.marketScore;
        case 'adr':
          return b.adrAvg - a.adrAvg;
        case 'occ':
          return b.occupancyAvg - a.occupancyAvg;
      }
    });
    return arr;
  }, [cities, sortKey, regFilter, satFilter, query]);

  function toggle<T>(set: Set<T>, value: T, update: (s: Set<T>) => void) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    update(next);
  }

  return (
    <section className="cities-index">
      <div className="rounded-md border border-rule bg-parchment-light p-4 md:p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
          <div>
            <label className="label text-navy block mb-2" htmlFor="cities-search">
              Search
            </label>
            <input
              id="cities-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="City or state name…"
              className="w-full rounded-md border border-rule bg-parchment px-4 py-2 text-ui text-navy placeholder:text-ink-3 focus:outline-none focus:border-accent focus:shadow-focus"
            />
          </div>
          <div>
            <label className="label text-navy block mb-2" htmlFor="cities-sort">
              Sort
            </label>
            <select
              id="cities-sort"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="rounded-md border border-rule bg-parchment px-4 py-2 text-ui text-navy focus:outline-none focus:border-accent focus:shadow-focus"
            >
              <option value="score">Market score (high → low)</option>
              <option value="state">State (A → Z)</option>
              <option value="adr">ADR (high → low)</option>
              <option value="occ">Occupancy (high → low)</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-caption text-ink-3 uppercase tracking-widest mr-1 self-center">
            Regulation
          </span>
          {REG_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => toggle(regFilter, r, setRegFilter)}
              className={`rounded-md border px-3 py-1 text-caption transition-colors duration-std ${
                regFilter.has(r)
                  ? REG_BADGE[r]
                  : 'border-rule bg-parchment text-ink-2 hover:border-accent'
              }`}
            >
              {REG_LABEL[r]}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-caption text-ink-3 uppercase tracking-widest mr-1 self-center">
            Saturation
          </span>
          {SAT_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(satFilter, s, setSatFilter)}
              className={`rounded-md border px-3 py-1 text-caption transition-colors duration-std ${
                satFilter.has(s)
                  ? 'bg-accent text-parchment border-accent'
                  : 'border-rule bg-parchment text-ink-2 hover:border-accent'
              }`}
            >
              Tier {s}
            </button>
          ))}
        </div>

        <p className="mt-4 text-caption text-ink-3">
          Showing <span className="font-mono">{visible.length}</span> of{' '}
          <span className="font-mono">{cities.length}</span> cities
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
        {visible.map((c) => (
          <li key={c.slug} className="m-0 p-0">
            <a
              href={`/cities/${c.slug}`}
              className="group block h-full rounded-md border border-rule bg-parchment-light p-4 no-underline hover:border-accent hover:shadow-card transition-all duration-std"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-serif text-h3 text-navy group-hover:text-accent leading-tight">
                    {c.name}, {c.state}
                  </p>
                  <p className="text-caption text-ink-3">{c.stateName}</p>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center rounded-md border px-2 py-1 text-caption font-mono ${scoreCls(
                    c.marketScore,
                  )}`}
                >
                  {c.marketScore}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-caption ${
                    REG_BADGE[c.regulationStatus]
                  }`}
                >
                  {REG_LABEL[c.regulationStatus]}
                </span>
                <span className="inline-flex items-center rounded-md border border-rule bg-parchment px-2 py-0.5 text-caption text-ink-2">
                  Tier {c.saturationTier}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-small">
                <div>
                  <p className="text-caption text-ink-3 uppercase tracking-widest">ADR</p>
                  <p className="font-mono text-navy">
                    {formatCurrency(c.adrAvg, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-caption text-ink-3 uppercase tracking-widest">Occ</p>
                  <p className="font-mono text-navy">{formatPercent(c.occupancyAvg)}</p>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="mt-6 text-ui text-ink-2">
          No cities match the current filters. Try clearing one.
        </p>
      )}
    </section>
  );
}
