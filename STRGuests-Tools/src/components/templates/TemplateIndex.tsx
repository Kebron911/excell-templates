/**
 * TemplateIndex — client island for /templates/
 *
 * Receives the full template list as a prop (rendered SSR-first by the
 * Astro page so search engines see all 26 entries pre-hydration).
 * Provides:
 *   - Free-text search (matches name + scenario, case-insensitive)
 *   - Category filter chips (multi-select, OR semantics)
 *   - Sort: name | category | lastVerified (default: lastVerified desc)
 *   - URL state via ?cat=... & q=... so deep links from scenario pages
 *     pre-filter the index to the same category
 */

import { useEffect, useMemo, useState } from 'react';

export interface TemplateRow {
  key: string;
  name: string;
  category: string;
  scenario: string;
  lastVerified: string;
}

interface Props {
  templates: TemplateRow[];
  categories: string[];
}

type SortKey = 'name' | 'category' | 'lastVerified';

function readInitialState(categories: string[]): { q: string; cats: Set<string>; sort: SortKey } {
  if (typeof window === 'undefined') return { q: '', cats: new Set(), sort: 'lastVerified' };
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  const cats = new Set<string>();
  if (cat && categories.includes(cat)) cats.add(cat);
  const q = params.get('q') ?? '';
  const sortRaw = params.get('sort') as SortKey | null;
  const sort: SortKey = sortRaw === 'name' || sortRaw === 'category' || sortRaw === 'lastVerified' ? sortRaw : 'lastVerified';
  return { q, cats, sort };
}

export default function TemplateIndex({ templates, categories }: Props) {
  const initial = readInitialState(categories);
  const [q, setQ] = useState(initial.q);
  const [cats, setCats] = useState<Set<string>>(initial.cats);
  const [sort, setSort] = useState<SortKey>(initial.sort);

  // Sync state to URL (debounced via rAF batch)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (cats.size === 1) params.set('cat', Array.from(cats)[0]);
    if (sort !== 'lastVerified') params.set('sort', sort);
    const next = params.toString() ? `?${params.toString()}` : window.location.pathname;
    const target = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    window.history.replaceState(null, '', target);
    void next;
  }, [q, cats, sort]);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let rows = templates;
    if (cats.size > 0) rows = rows.filter((r) => cats.has(r.category));
    if (needle) {
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(needle) ||
          r.scenario.toLowerCase().includes(needle),
      );
    }
    const sorted = [...rows];
    switch (sort) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'category':
        sorted.sort((a, b) =>
          a.category === b.category ? a.name.localeCompare(b.name) : a.category.localeCompare(b.category),
        );
        break;
      case 'lastVerified':
        sorted.sort((a, b) => b.lastVerified.localeCompare(a.lastVerified) || a.name.localeCompare(b.name));
        break;
    }
    return sorted;
  }, [templates, q, cats, sort]);

  const toggleCat = (c: string) => {
    setCats((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const clearFilters = () => {
    setQ('');
    setCats(new Set());
    setSort('lastVerified');
  };

  return (
    <div>
      {/* Controls */}
      <div className="rounded-md border border-rule bg-parchment-light p-4">
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-3 items-end">
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest">
            Search
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="late checkout, noise, anniversary…"
              className="mt-1 rounded-md border border-rule bg-white px-3 py-2 text-ui text-navy placeholder:text-ink-3 focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus normal-case tracking-normal"
            />
          </label>
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="mt-1 rounded-md border border-rule bg-white px-3 py-2 text-ui text-navy focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus normal-case tracking-normal"
            >
              <option value="lastVerified">Recently verified</option>
              <option value="name">Name (A → Z)</option>
              <option value="category">Category</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="label text-ink-2 mr-1">Category</span>
          {categories.map((c) => {
            const active = cats.has(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCat(c)}
                aria-pressed={active}
                className={
                  'rounded-pill px-3 py-1 text-caption uppercase tracking-widest border transition-colors duration-std capitalize ' +
                  (active
                    ? 'bg-[color:var(--accent-500)] text-white border-[color:var(--accent-500)]'
                    : 'bg-white text-navy border-rule hover:border-[color:var(--accent-500)]')
                }
              >
                {c.replace(/-/g, ' ')}
              </button>
            );
          })}
          {(cats.size > 0 || q.trim() || sort !== 'lastVerified') && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-2 text-caption text-ink-3 hover:text-[color:var(--accent-700)] underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mt-5 flex items-baseline justify-between">
        <p className="text-small text-ink-2">
          Showing <span className="font-mono font-semibold text-navy">{visible.length}</span> of {templates.length} templates
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="mt-4 rounded-md border border-dashed border-rule bg-parchment-light px-5 py-8 text-center">
          <p className="font-serif text-h3 text-navy">No matches.</p>
          <p className="mt-2 text-small text-ink-2">Try clearing filters or broadening the search.</p>
        </div>
      ) : (
        <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 list-none p-0">
          {visible.map((r) => (
            <li key={r.key}>
              <a
                href={`/templates/${r.key}`}
                className="block group rounded-md border border-rule bg-white p-4 no-underline hover:border-[color:var(--accent-500)] hover:shadow-card transition-all duration-std"
              >
                <p className="label text-[color:var(--accent-700)] capitalize">{r.category.replace(/-/g, ' ')}</p>
                <p className="mt-2 text-ui text-navy group-hover:text-[color:var(--accent-700)] font-semibold">{r.name}</p>
                <p className="mt-1 text-caption text-ink-2 leading-snug">{r.scenario}</p>
                <p className="mt-3 text-caption text-ink-3 font-mono">Last verified {r.lastVerified}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
