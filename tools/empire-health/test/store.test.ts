import { describe, expect, it } from 'vitest';
import { HealthStore } from '../src/store.js';

function freshStore(): HealthStore {
  const s = new HealthStore();
  s.setSite({ siteId: 'guests', displayName: 'Guests', domain: 'strguests.tools' });
  s.setSite({ siteId: 'host', displayName: 'Host', domain: 'strhost.tools' });
  return s;
}

describe('HealthStore', () => {
  it('initializes with ok overall on empty state', () => {
    const snap = freshStore().snapshot();
    expect(snap.overall).toBe('ok');
    expect(snap.sites).toHaveLength(2);
  });

  it('records http result + checkedAt', () => {
    const s = freshStore();
    s.updateHttp('guests', { status: 'ok', httpStatus: 200, responseTimeMs: 50 });
    const site = s.snapshot().sites.find((x) => x.siteId === 'guests')!;
    expect(site.http?.status).toBe('ok');
    expect(site.http?.checkedAt).toBeDefined();
  });

  it('elevates overall to warn when any site is warn', () => {
    const s = freshStore();
    s.updateHttp('guests', { status: 'warn', httpStatus: 403, responseTimeMs: 50 });
    expect(s.snapshot().overall).toBe('warn');
  });

  it('elevates overall to fail when any site is fail (even with warns elsewhere)', () => {
    const s = freshStore();
    s.updateHttp('guests', { status: 'warn', httpStatus: 403, responseTimeMs: 50 });
    s.updateSsl('host', { status: 'fail', error: 'expired' });
    expect(s.snapshot().overall).toBe('fail');
  });

  it('ignores updates for unknown sites', () => {
    const s = freshStore();
    s.updateHttp('not-a-site', { status: 'ok', httpStatus: 200, responseTimeMs: 1 });
    expect(s.snapshot().sites).toHaveLength(2);
  });

  it('sorts sites by id for stable output', () => {
    const ids = freshStore().snapshot().sites.map((s) => s.siteId);
    expect(ids).toEqual([...ids].sort());
  });
});
