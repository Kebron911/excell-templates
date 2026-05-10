/**
 * Dev-only timing helpers. Wrap reader calls or expensive sections to
 * see what's slow in the dev console. No-op in production builds.
 *
 * Usage:
 *
 *   import { time } from '@/lib/observability';
 *   const result = await time('readVendors', () => readVendors());
 */

const isDev = import.meta.env.DEV;
const SLOW_THRESHOLD_MS = 200;

/**
 * Time an async operation. Logs to stdout in dev mode if it takes > 200ms;
 * always logs in dev if `verbose: true`.
 */
export async function time<T>(label: string, fn: () => Promise<T>, opts: { verbose?: boolean } = {}): Promise<T> {
  if (!isDev) return fn();
  const start = performance.now();
  try {
    const result = await fn();
    const elapsed = performance.now() - start;
    if (opts.verbose || elapsed > SLOW_THRESHOLD_MS) {
      const tag = elapsed > SLOW_THRESHOLD_MS ? '[slow]' : '[time]';
      console.log(`${tag} ${label}: ${elapsed.toFixed(1)}ms`);
    }
    return result;
  } catch (err) {
    const elapsed = performance.now() - start;
    console.log(`[fail] ${label}: ${elapsed.toFixed(1)}ms — ${err instanceof Error ? err.message : err}`);
    throw err;
  }
}

/**
 * Time multiple parallel reader calls. Logs the slowest if any exceeded the threshold.
 *
 *   const [a, b, c] = await timeAll('today-landing', [
 *     ['vendors', () => readVendors()],
 *     ['runbooks', () => readRunbooks()],
 *     ['progress', () => readProgress()],
 *   ]);
 */
export async function timeAll<T extends readonly unknown[]>(
  groupLabel: string,
  fns: { [K in keyof T]: [string, () => Promise<T[K]>] }
): Promise<T> {
  if (!isDev) return Promise.all(fns.map(([_, f]) => f())) as Promise<T>;
  const start = performance.now();
  const results = await Promise.all(fns.map(async ([label, f]) => {
    const s = performance.now();
    try {
      const r = await f();
      return { label, elapsed: performance.now() - s, result: r, error: null };
    } catch (err) {
      return { label, elapsed: performance.now() - s, result: null, error: err };
    }
  }));
  const total = performance.now() - start;
  if (total > SLOW_THRESHOLD_MS) {
    const slowest = results.slice().sort((a, b) => b.elapsed - a.elapsed).slice(0, 3);
    console.log(`[slow] ${groupLabel}: ${total.toFixed(1)}ms total · slowest: ${slowest.map((r) => `${r.label} ${r.elapsed.toFixed(0)}ms`).join(', ')}`);
  }
  const errored = results.filter((r) => r.error);
  if (errored.length > 0) {
    console.log(`[fail] ${groupLabel}: ${errored.length} reader(s) threw: ${errored.map((r) => r.label).join(', ')}`);
    throw errored[0].error;
  }
  return results.map((r) => r.result) as unknown as T;
}
