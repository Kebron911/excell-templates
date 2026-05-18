import type { Catalog } from '@str/catalog';
import { checkHttp, checkSsl } from './checkers.js';
import { HealthStore } from './store.js';

export interface RunnerOptions {
  catalog: Catalog;
  store: HealthStore;
  intervalMs: number;
  sslIntervalMs: number;
  timeoutMs: number;
  sslWarnDays: number;
  /** Override for tests. Defaults to globalThis.setInterval. */
  setIntervalFn?: typeof setInterval;
  /** Override for tests. Defaults to globalThis.clearInterval. */
  clearIntervalFn?: typeof clearInterval;
}

export class Runner {
  private httpTimer?: NodeJS.Timeout;
  private sslTimer?: NodeJS.Timeout;

  constructor(private readonly opts: RunnerOptions) {
    for (const site of opts.catalog.sites) {
      opts.store.setSite({
        siteId: site.id,
        displayName: site.displayName,
        domain: site.domain,
      });
    }
  }

  async runHttpAll(): Promise<void> {
    await Promise.all(
      this.opts.catalog.sites.map(async (site) => {
        const result = await checkHttp(`https://${site.domain}/`, {
          timeoutMs: this.opts.timeoutMs,
        });
        this.opts.store.updateHttp(site.id, result);
      }),
    );
  }

  async runSslAll(): Promise<void> {
    await Promise.all(
      this.opts.catalog.sites.map(async (site) => {
        const result = await checkSsl(site.domain, {
          timeoutMs: this.opts.timeoutMs,
          warnDays: this.opts.sslWarnDays,
        });
        this.opts.store.updateSsl(site.id, result);
      }),
    );
  }

  start(): void {
    const setIntervalFn = this.opts.setIntervalFn ?? setInterval;
    void this.runHttpAll();
    void this.runSslAll();
    this.httpTimer = setIntervalFn(() => {
      void this.runHttpAll();
    }, this.opts.intervalMs);
    this.sslTimer = setIntervalFn(() => {
      void this.runSslAll();
    }, this.opts.sslIntervalMs);
  }

  stop(): void {
    const clearIntervalFn = this.opts.clearIntervalFn ?? clearInterval;
    if (this.httpTimer) clearIntervalFn(this.httpTimer);
    if (this.sslTimer) clearIntervalFn(this.sslTimer);
  }
}
