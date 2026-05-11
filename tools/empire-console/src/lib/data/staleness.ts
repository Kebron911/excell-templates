/**
 * Staleness thresholds — centralized so the "why is this 30 vs 180 vs 365?"
 * decision is documented, not buried in each reader.
 *
 * Each value is a number of DAYS since last_updated/last_reviewed/last_contact.
 * Past this threshold, the item is flagged as stale and surfaces in alerts.
 */

export const STALE_DAYS = {
  /** Runbooks must be reviewed quarterly. >180d = forgotten. */
  runbook: 180,

  /** Asset registry items (lead magnets, tools, docs) — long shelf life. >365d = orphan. */
  asset: 365,

  /** Risks reviewed quarterly per scoring discipline. >180d = unverified. */
  risk: 180,

  /** Competitor watch reviewed weekly to monthly. >30d = market may have moved. */
  competitor: 30,

  /** Network relationships go cold fast. >90d = reach out. */
  networkContact: 90,
} as const;

/**
 * Standard "is this stale?" check. Returns true if undated.
 */
export function isStale(lastUpdated: string | null | undefined, threshold: number): boolean {
  if (!lastUpdated) return true;
  const t = new Date(lastUpdated).getTime();
  if (Number.isNaN(t)) return true;
  return (Date.now() - t) / 86_400_000 > threshold;
}

/**
 * Days since the given date, or null if invalid/missing.
 */
export function daysSince(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const t = new Date(dateStr).getTime();
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / 86_400_000);
}
