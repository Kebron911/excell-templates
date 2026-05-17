/**
 * Compare two `regulations` rows and classify the diff.
 *
 * Severity ladder (overall = max across FieldChanges):
 *
 *   major     — change a market is open/closed
 *               • ban_status crosses between {none|partial} ↔ {full|moratorium}
 *               • permit_required flips
 *
 *   material  — substantive cost or scope change
 *               • permit_cost_usd changes by >25% (or crosses null↔value)
 *               • tax_rate_pct changes by >1.0 percentage point
 *               • ban_status moves none↔partial (less severe than full ban)
 *               • occupancy_cap_persons changes
 *               • primary_residence_only flips
 *               • max_nights_per_year changes
 *               • registration_required flips
 *
 *   minor     — anything else (slug fixes, prose tweaks in *_notes_md)
 *
 * Pure function — no I/O. Caller picks rows + persists the DiffResult.
 */
import type { ChangeSeverity, DiffResult, FieldChange, RegulationRow } from './types';

const SEVERITY_ORDER: Record<ChangeSeverity, number> = { minor: 0, material: 1, major: 2 };

function maxSeverity(a: ChangeSeverity, b: ChangeSeverity): ChangeSeverity {
  return SEVERITY_ORDER[a] >= SEVERITY_ORDER[b] ? a : b;
}

function isBanOpen(status: RegulationRow['ban_status']): boolean {
  return status === null || status === 'none' || status === 'partial';
}

function pctChange(prev: number | null, next: number | null): number | null {
  if (prev === null || next === null || prev === 0) return null;
  return Math.abs((next - prev) / prev) * 100;
}

function pushIfChanged<T>(
  changes: FieldChange[],
  field: keyof RegulationRow,
  before: T,
  after: T,
  severity: ChangeSeverity,
  describe: (b: T, a: T) => string,
): void {
  if (before === after) return;
  changes.push({ field, before, after, severity, description: describe(before, after) });
}

export function diffRegulations(
  prev: RegulationRow | null,
  next: RegulationRow,
): DiffResult {
  const changes: FieldChange[] = [];

  // First-ever record for a city: every populated field is "new". Treat as material.
  if (prev === null) {
    return {
      cityId: next.city_id,
      prevRegulationId: null,
      nextRegulationId: next.id,
      severity: 'material',
      changes: [
        {
          field: 'id',
          before: null,
          after: next.id,
          severity: 'material',
          description: 'Initial regulation record published for this city.',
        },
      ],
      isNoop: false,
    };
  }

  // ban_status — most consequential field.
  if (prev.ban_status !== next.ban_status) {
    const prevOpen = isBanOpen(prev.ban_status);
    const nextOpen = isBanOpen(next.ban_status);
    const crossedThreshold = prevOpen !== nextOpen;
    changes.push({
      field: 'ban_status',
      before: prev.ban_status,
      after: next.ban_status,
      severity: crossedThreshold ? 'major' : 'material',
      description: crossedThreshold
        ? `Market status crossed open/closed boundary: ${prev.ban_status ?? 'unknown'} → ${next.ban_status ?? 'unknown'}.`
        : `Ban status changed: ${prev.ban_status ?? 'unknown'} → ${next.ban_status ?? 'unknown'}.`,
    });
  }

  // permit_required boolean flip → major (changes whether you can operate at all).
  if (prev.permit_required !== next.permit_required) {
    changes.push({
      field: 'permit_required',
      before: prev.permit_required,
      after: next.permit_required,
      severity: 'major',
      description: `Permit requirement flipped: ${prev.permit_required ? 'required' : 'not required'} → ${next.permit_required ? 'required' : 'not required'}.`,
    });
  }

  // permit_cost_usd — material if >25% delta or null↔value transition.
  if (prev.permit_cost_usd !== next.permit_cost_usd) {
    const pct = pctChange(prev.permit_cost_usd, next.permit_cost_usd);
    const isSubstantive = pct === null || pct > 25;
    changes.push({
      field: 'permit_cost_usd',
      before: prev.permit_cost_usd,
      after: next.permit_cost_usd,
      severity: isSubstantive ? 'material' : 'minor',
      description: `Permit fee changed: $${prev.permit_cost_usd ?? '?'} → $${next.permit_cost_usd ?? '?'}${pct !== null ? ` (${pct.toFixed(1)}%)` : ''}.`,
    });
  }

  // tax_rate_pct — material if >1pp delta or null↔value.
  if (prev.tax_rate_pct !== next.tax_rate_pct) {
    const delta =
      prev.tax_rate_pct !== null && next.tax_rate_pct !== null
        ? Math.abs(next.tax_rate_pct - prev.tax_rate_pct)
        : null;
    const isSubstantive = delta === null || delta > 1.0;
    changes.push({
      field: 'tax_rate_pct',
      before: prev.tax_rate_pct,
      after: next.tax_rate_pct,
      severity: isSubstantive ? 'material' : 'minor',
      description: `Tax rate changed: ${prev.tax_rate_pct ?? '?'}% → ${next.tax_rate_pct ?? '?'}%.`,
    });
  }

  pushIfChanged(changes, 'occupancy_cap_persons', prev.occupancy_cap_persons, next.occupancy_cap_persons, 'material',
    (b, a) => `Occupancy cap changed: ${b ?? '?'} → ${a ?? '?'} persons.`);

  pushIfChanged(changes, 'primary_residence_only', prev.primary_residence_only, next.primary_residence_only, 'material',
    (b, a) => `Primary-residence requirement ${b ? 'lifted' : 'imposed'}: ${b ? 'yes' : 'no'} → ${a ? 'yes' : 'no'}.`);

  pushIfChanged(changes, 'max_nights_per_year', prev.max_nights_per_year, next.max_nights_per_year, 'material',
    (b, a) => `Max nights per year changed: ${b ?? 'unlimited'} → ${a ?? 'unlimited'}.`);

  pushIfChanged(changes, 'registration_required', prev.registration_required, next.registration_required, 'material',
    (b, a) => `Registration requirement ${b ? 'lifted' : 'imposed'}: ${b ? 'yes' : 'no'} → ${a ? 'yes' : 'no'}.`);

  pushIfChanged(changes, 'zoning_notes_md', prev.zoning_notes_md, next.zoning_notes_md, 'minor',
    () => 'Zoning notes updated.');
  pushIfChanged(changes, 'enforcement_notes_md', prev.enforcement_notes_md, next.enforcement_notes_md, 'minor',
    () => 'Enforcement notes updated.');

  const severity = changes.reduce<ChangeSeverity>(
    (acc, c) => maxSeverity(acc, c.severity),
    'minor',
  );

  return {
    cityId: next.city_id,
    prevRegulationId: prev.id,
    nextRegulationId: next.id,
    severity,
    changes,
    isNoop: changes.length === 0,
  };
}
