import type { CheckStatus, HttpCheckResult, SslCheckResult } from './checkers.js';

export interface SiteHealth {
  siteId: string;
  displayName: string;
  domain: string;
  http?: HttpCheckResult & { checkedAt: string };
  ssl?: SslCheckResult & { checkedAt: string };
}

export interface EmpireHealthSnapshot {
  generatedAt: string;
  overall: CheckStatus;
  sites: SiteHealth[];
}

export class HealthStore {
  private siteState = new Map<string, SiteHealth>();

  setSite(meta: { siteId: string; displayName: string; domain: string }): void {
    if (!this.siteState.has(meta.siteId)) {
      this.siteState.set(meta.siteId, { ...meta });
    }
  }

  updateHttp(siteId: string, result: HttpCheckResult): void {
    const s = this.siteState.get(siteId);
    if (!s) return;
    s.http = { ...result, checkedAt: new Date().toISOString() };
  }

  updateSsl(siteId: string, result: SslCheckResult): void {
    const s = this.siteState.get(siteId);
    if (!s) return;
    s.ssl = { ...result, checkedAt: new Date().toISOString() };
  }

  snapshot(): EmpireHealthSnapshot {
    const sites = Array.from(this.siteState.values()).sort((a, b) =>
      a.siteId.localeCompare(b.siteId),
    );
    const overall: CheckStatus = sites.some(
      (s) => s.http?.status === 'fail' || s.ssl?.status === 'fail',
    )
      ? 'fail'
      : sites.some((s) => s.http?.status === 'warn' || s.ssl?.status === 'warn')
        ? 'warn'
        : 'ok';
    return {
      generatedAt: new Date().toISOString(),
      overall,
      sites,
    };
  }
}
