import { describe, expect, it } from 'vitest';
import { diffRegulations } from '../../server/lib/diff/regulation-diff';
import type { RegulationRow } from '../../src/lib/city-data';

function reg(overrides: Partial<RegulationRow> = {}): RegulationRow {
  return {
    id: 100,
    city_id: 1,
    snapshot_id: 1,
    effective_date: '2026-01-01',
    permit_required: 1,
    permit_cost_usd: 200,
    permit_url: 'https://example.gov/permit',
    occupancy_cap_persons: 8,
    tax_rate_pct: 6.0,
    tax_authority: 'County',
    ban_status: 'none',
    ban_details_md: null,
    registration_required: 1,
    registration_url: null,
    primary_residence_only: 0,
    max_nights_per_year: null,
    zoning_notes_md: 'Original zoning text.',
    enforcement_notes_md: 'Original enforcement.',
    ...overrides,
  };
}

describe('diffRegulations — first-ever record', () => {
  it('returns material severity with sentinel change when prev is null', () => {
    const r = diffRegulations(null, reg({ id: 1 }));
    expect(r.severity).toBe('material');
    expect(r.isNoop).toBe(false);
    expect(r.changes).toHaveLength(1);
    expect(r.prevRegulationId).toBeNull();
    expect(r.nextRegulationId).toBe(1);
  });
});

describe('diffRegulations — no-op detection', () => {
  it('returns isNoop=true when both records are identical', () => {
    const prev = reg({ id: 50 });
    const next = reg({ id: 51 }); // only id differs; id is not diffed
    const r = diffRegulations(prev, next);
    expect(r.isNoop).toBe(true);
    expect(r.changes).toHaveLength(0);
    expect(r.severity).toBe('minor');
  });
});

describe('diffRegulations — ban_status severity ladder', () => {
  it('classifies none → full as major (crosses open/closed)', () => {
    const r = diffRegulations(reg(), reg({ id: 101, ban_status: 'full' }));
    expect(r.severity).toBe('major');
    expect(r.changes[0]!.field).toBe('ban_status');
    expect(r.changes[0]!.severity).toBe('major');
    expect(r.changes[0]!.description.toLowerCase()).toContain('open/closed');
  });

  it('classifies partial → moratorium as major', () => {
    const r = diffRegulations(reg({ ban_status: 'partial' }), reg({ id: 101, ban_status: 'moratorium' }));
    expect(r.severity).toBe('major');
  });

  it('classifies none → partial as material (still open)', () => {
    const r = diffRegulations(reg(), reg({ id: 101, ban_status: 'partial' }));
    expect(r.severity).toBe('material');
  });

  it('classifies full → moratorium as material (both closed, no crossing)', () => {
    const r = diffRegulations(reg({ ban_status: 'full' }), reg({ id: 101, ban_status: 'moratorium' }));
    expect(r.severity).toBe('material');
  });
});

describe('diffRegulations — permit_required', () => {
  it('classifies permit_required flip as major', () => {
    const r = diffRegulations(reg({ permit_required: 0 }), reg({ id: 101, permit_required: 1 }));
    expect(r.severity).toBe('major');
  });
});

describe('diffRegulations — permit_cost_usd threshold', () => {
  it('classifies <25% change as minor', () => {
    const r = diffRegulations(reg({ permit_cost_usd: 100 }), reg({ id: 101, permit_cost_usd: 110 }));
    expect(r.changes[0]!.severity).toBe('minor');
    expect(r.severity).toBe('minor');
  });

  it('classifies >25% change as material', () => {
    const r = diffRegulations(reg({ permit_cost_usd: 100 }), reg({ id: 101, permit_cost_usd: 200 }));
    expect(r.changes[0]!.severity).toBe('material');
    expect(r.severity).toBe('material');
  });

  it('classifies null → value as material (treat as substantive)', () => {
    const r = diffRegulations(reg({ permit_cost_usd: null }), reg({ id: 101, permit_cost_usd: 100 }));
    expect(r.changes[0]!.severity).toBe('material');
  });
});

describe('diffRegulations — tax_rate_pct threshold', () => {
  it('classifies <1pp change as minor', () => {
    const r = diffRegulations(reg({ tax_rate_pct: 6.0 }), reg({ id: 101, tax_rate_pct: 6.5 }));
    expect(r.changes[0]!.severity).toBe('minor');
  });

  it('classifies >1pp change as material', () => {
    const r = diffRegulations(reg({ tax_rate_pct: 6.0 }), reg({ id: 101, tax_rate_pct: 8.0 }));
    expect(r.changes[0]!.severity).toBe('material');
  });
});

describe('diffRegulations — material scope changes', () => {
  it('flags occupancy_cap_persons change as material', () => {
    const r = diffRegulations(reg({ occupancy_cap_persons: 8 }), reg({ id: 101, occupancy_cap_persons: 4 }));
    expect(r.severity).toBe('material');
  });

  it('flags primary_residence_only flip as material', () => {
    const r = diffRegulations(reg({ primary_residence_only: 0 }), reg({ id: 101, primary_residence_only: 1 }));
    expect(r.severity).toBe('material');
  });

  it('flags max_nights_per_year change as material', () => {
    const r = diffRegulations(reg({ max_nights_per_year: null }), reg({ id: 101, max_nights_per_year: 90 }));
    expect(r.severity).toBe('material');
  });

  it('flags registration_required flip as material', () => {
    const r = diffRegulations(reg({ registration_required: 1 }), reg({ id: 101, registration_required: 0 }));
    expect(r.severity).toBe('material');
  });
});

describe('diffRegulations — notes-only changes', () => {
  it('classifies zoning_notes_md text change alone as minor', () => {
    const r = diffRegulations(reg(), reg({ id: 101, zoning_notes_md: 'Updated zoning prose.' }));
    expect(r.severity).toBe('minor');
    expect(r.changes).toHaveLength(1);
  });
});

describe('diffRegulations — severity is max of all field changes', () => {
  it('escalates to major when one major change is present alongside minors', () => {
    const r = diffRegulations(
      reg({ ban_status: 'none', zoning_notes_md: 'old' }),
      reg({ id: 101, ban_status: 'full', zoning_notes_md: 'new' }),
    );
    expect(r.severity).toBe('major');
    expect(r.changes.length).toBeGreaterThanOrEqual(2);
  });
});
