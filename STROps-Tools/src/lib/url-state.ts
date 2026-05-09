export type Primitive = string | number | boolean;
export type StateShape = Record<string, Primitive | Primitive[]>;

export function encodeState(state: StateShape): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(state)) {
    if (Array.isArray(v)) params.set(k, v.join(','));
    else params.set(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : '';
}

export function decodeState<T extends StateShape>(query: string, defaults: T): T {
  const out: StateShape = { ...defaults };
  const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
  for (const k of Object.keys(defaults)) {
    const raw = params.get(k);
    if (raw === null) continue;
    const def = (defaults as StateShape)[k];
    if (Array.isArray(def)) {
      out[k] = raw === '' ? [] : raw.split(',');
    } else if (typeof def === 'number') {
      const n = Number(raw);
      out[k] = Number.isFinite(n) ? n : def;
    } else if (typeof def === 'boolean') {
      out[k] = raw === 'true';
    } else {
      out[k] = raw;
    }
  }
  return out as T;
}

export function makeReplacer(replace: (q: string) => void, ms = 200) {
  let t: ReturnType<typeof setTimeout> | null = null;
  let last = '';
  return (q: string) => {
    last = q;
    if (t) clearTimeout(t);
    t = setTimeout(() => replace(last), ms);
  };
}

export function browserReplacer(ms = 200) {
  return makeReplacer((q) => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.pathname}${q}${window.location.hash}`;
    window.history.replaceState(null, '', url);
  }, ms);
}
