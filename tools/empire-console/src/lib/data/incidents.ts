import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { resolve } from 'node:path';
import { paths } from '../paths.js';

/**
 * Incidents log — append-only NDJSON at ops/incidents.ndjson.
 * One line per incident. Currently manual (paste/curl from /maintain/incidents
 * empty state); Phase 5+ may auto-draft from P0 alerts.
 *
 * MTTA = mean time to acknowledge (alertedAt → acknowledgedAt)
 * MTTR = mean time to resolve   (alertedAt → resolvedAt)
 */

const IncidentSchema = z.object({
  id: z.string(),
  title: z.string(),
  severity: z.enum(['SEV1', 'SEV2', 'SEV3']),
  status: z.enum(['open', 'mitigated', 'resolved']).default('open'),
  alertedAt: z.string(),
  acknowledgedAt: z.string().nullable().default(null),
  resolvedAt: z.string().nullable().default(null),
  source: z.string().default(''),       // which alert/flow surfaced it
  summary: z.string().default(''),      // one-paragraph summary
  rootCause: z.string().default(''),    // postmortem field
  fix: z.string().default(''),          // what was done
  prevention: z.string().default(''),   // how we avoid next time
  affectedAreas: z.array(z.string()).default([]), // e.g. ["money", "etsy", "n8n"]
});

export type Incident = z.infer<typeof IncidentSchema>;

export interface IncidentsReport {
  incidents: Incident[];
  totals: {
    total: number;
    open: number;
    mitigated: number;
    resolved: number;
    bySeverity: Record<'SEV1' | 'SEV2' | 'SEV3', number>;
    mttaMinutes: number | null;  // null if no acks yet
    mttrMinutes: number | null;  // null if no resolutions yet
    daysSinceLast: number | null;
  };
}

const LOG_PATH = resolve(paths.ops, 'incidents.ndjson');

function durationMin(start: string, end: string | null): number | null {
  if (!end) return null;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (!isFinite(ms) || ms < 0) return null;
  return Math.round(ms / 60000);
}

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export async function readIncidents(): Promise<IncidentsReport> {
  let raw: string;
  try { raw = await readFile(LOG_PATH, 'utf8'); }
  catch {
    return {
      incidents: [],
      totals: {
        total: 0, open: 0, mitigated: 0, resolved: 0,
        bySeverity: { SEV1: 0, SEV2: 0, SEV3: 0 },
        mttaMinutes: null, mttrMinutes: null, daysSinceLast: null,
      },
    };
  }
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  const incidents: Incident[] = [];
  for (const line of lines) {
    try { incidents.push(IncidentSchema.parse(JSON.parse(line))); }
    catch { /* skip malformed */ }
  }
  incidents.sort((a, b) => b.alertedAt.localeCompare(a.alertedAt));

  const mttaSamples = incidents
    .map((i) => durationMin(i.alertedAt, i.acknowledgedAt))
    .filter((m): m is number => m !== null);
  const mttrSamples = incidents
    .map((i) => durationMin(i.alertedAt, i.resolvedAt))
    .filter((m): m is number => m !== null);

  const last = incidents[0];
  const daysSinceLast = last
    ? Math.floor((Date.now() - new Date(last.alertedAt).getTime()) / 864e5)
    : null;

  return {
    incidents,
    totals: {
      total: incidents.length,
      open: incidents.filter((i) => i.status === 'open').length,
      mitigated: incidents.filter((i) => i.status === 'mitigated').length,
      resolved: incidents.filter((i) => i.status === 'resolved').length,
      bySeverity: {
        SEV1: incidents.filter((i) => i.severity === 'SEV1').length,
        SEV2: incidents.filter((i) => i.severity === 'SEV2').length,
        SEV3: incidents.filter((i) => i.severity === 'SEV3').length,
      },
      mttaMinutes: mean(mttaSamples),
      mttrMinutes: mean(mttrSamples),
      daysSinceLast,
    },
  };
}
