import { describe, it, expect } from 'vitest';
import { GdprRequestSchema } from '../src/lib/data/gdpr.js';
import { BackupTestSchema } from '../src/lib/data/backup-tests.js';
import { IncidentSchema } from '../src/lib/data/incidents.js';

describe('GdprRequestSchema', () => {
  it('accepts a fully-populated request', () => {
    const parsed = GdprRequestSchema.parse({
      id: '01HZ-AB12',
      email: 'user@example.com',
      type: 'erasure',
      details: 'Delete my data',
      origin: 'https://thestrledger.com/privacy',
      ts: '2026-05-10T18:00:00Z',
      dueAt: '2026-06-09T18:00:00Z',
      status: 'open',
    });
    expect(parsed.type).toBe('erasure');
    expect(parsed.status).toBe('open');
  });

  it('defaults status to open + details/origin to empty string', () => {
    const parsed = GdprRequestSchema.parse({
      id: 'x',
      email: 'a@b.co',
      type: 'access',
      ts: '2026-05-10T18:00:00Z',
      dueAt: '2026-06-09T18:00:00Z',
    });
    expect(parsed.status).toBe('open');
    expect(parsed.details).toBe('');
    expect(parsed.origin).toBe('');
  });

  it('rejects an unsupported type', () => {
    expect(() => GdprRequestSchema.parse({
      id: 'x', email: 'a@b.co', type: 'subpoena',
      ts: '2026-05-10T18:00:00Z', dueAt: '2026-06-09T18:00:00Z',
    })).toThrow();
  });

  it('rejects an invalid status', () => {
    expect(() => GdprRequestSchema.parse({
      id: 'x', email: 'a@b.co', type: 'access', status: 'pending',
      ts: '2026-05-10T18:00:00Z', dueAt: '2026-06-09T18:00:00Z',
    })).toThrow();
  });
});

describe('BackupTestSchema', () => {
  it('accepts a passing probe', () => {
    const parsed = BackupTestSchema.parse({
      ts: '2026-05-01T04:00:00Z',
      priority: 'P2',
      passed: true,
      message: 'Restore probe PASSED · 12345 files · sentinels present',
    });
    expect(parsed.passed).toBe(true);
    expect(parsed.priority).toBe('P2');
  });

  it('accepts a failing probe at P0', () => {
    const parsed = BackupTestSchema.parse({
      ts: '2026-05-01T04:00:00Z',
      priority: 'P0',
      passed: false,
      message: 'No backups found in /var/backups/strledger',
    });
    expect(parsed.passed).toBe(false);
  });

  it('defaults priority to P2 + passed to false when omitted', () => {
    const parsed = BackupTestSchema.parse({
      ts: '2026-05-01T04:00:00Z',
    });
    expect(parsed.priority).toBe('P2');
    expect(parsed.passed).toBe(false);
    expect(parsed.message).toBe('');
  });

  it('rejects a non-priority string', () => {
    expect(() => BackupTestSchema.parse({
      ts: '2026-05-01T04:00:00Z', priority: 'urgent', passed: true,
    })).toThrow();
  });
});

describe('IncidentSchema', () => {
  it('accepts a full postmortem', () => {
    const parsed = IncidentSchema.parse({
      id: '2026-05-10-01',
      title: 'n8n nightly-refresh failed — Etsy auth expired',
      severity: 'SEV2',
      status: 'resolved',
      alertedAt: '2026-05-10T03:05:00Z',
      acknowledgedAt: '2026-05-10T03:17:00Z',
      resolvedAt: '2026-05-10T04:40:00Z',
      source: 'n8n-self-watch',
      summary: 'Etsy API token expired silently',
      rootCause: 'Tokens auto-rotate every 90d; no renewal flow',
      fix: 'Re-authorized in dev portal',
      prevention: 'Add etsy-token-expiry-watch',
      affectedAreas: ['money', 'etsy'],
    });
    expect(parsed.severity).toBe('SEV2');
    expect(parsed.status).toBe('resolved');
    expect(parsed.affectedAreas).toEqual(['money', 'etsy']);
  });

  it('allows null ack + resolved timestamps for an open incident', () => {
    const parsed = IncidentSchema.parse({
      id: '2026-05-10-02',
      title: 'Just happened',
      severity: 'SEV1',
      status: 'open',
      alertedAt: '2026-05-10T18:00:00Z',
      acknowledgedAt: null,
      resolvedAt: null,
    });
    expect(parsed.status).toBe('open');
    expect(parsed.acknowledgedAt).toBeNull();
    expect(parsed.resolvedAt).toBeNull();
  });

  it('defaults all postmortem fields to empty + affectedAreas to []', () => {
    const parsed = IncidentSchema.parse({
      id: 'x',
      title: 'minimal',
      severity: 'SEV3',
      alertedAt: '2026-05-10T18:00:00Z',
    });
    expect(parsed.rootCause).toBe('');
    expect(parsed.fix).toBe('');
    expect(parsed.prevention).toBe('');
    expect(parsed.affectedAreas).toEqual([]);
    expect(parsed.status).toBe('open');
  });

  it('rejects unsupported severity / status', () => {
    expect(() => IncidentSchema.parse({
      id: 'x', title: 't', severity: 'SEV0', alertedAt: '2026-05-10T18:00:00Z',
    })).toThrow();
    expect(() => IncidentSchema.parse({
      id: 'x', title: 't', severity: 'SEV1', status: 'in-progress',
      alertedAt: '2026-05-10T18:00:00Z',
    })).toThrow();
  });
});
