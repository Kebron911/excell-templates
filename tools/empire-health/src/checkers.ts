import { connect } from 'node:tls';

export type CheckStatus = 'ok' | 'warn' | 'fail';

export interface HttpCheckResult {
  status: CheckStatus;
  httpStatus?: number;
  responseTimeMs: number;
  error?: string;
}

export interface SslCheckResult {
  status: CheckStatus;
  validFrom?: string;
  validTo?: string;
  daysUntilExpiry?: number;
  issuer?: string;
  error?: string;
}

export interface CheckOptions {
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT = 10_000;

export async function checkHttp(url: string, opts: CheckOptions = {}): Promise<HttpCheckResult> {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT;
  const start = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'empire-health-monitor/0.1' },
    });
    const responseTimeMs = Date.now() - start;
    if (res.ok) {
      return { status: 'ok', httpStatus: res.status, responseTimeMs };
    }
    if (res.status >= 500) {
      return { status: 'fail', httpStatus: res.status, responseTimeMs };
    }
    return { status: 'warn', httpStatus: res.status, responseTimeMs };
  } catch (err) {
    return {
      status: 'fail',
      responseTimeMs: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function checkSsl(
  host: string,
  opts: CheckOptions & { warnDays?: number; port?: number } = {},
): Promise<SslCheckResult> {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT;
  const warnDays = opts.warnDays ?? 14;
  const port = opts.port ?? 443;

  return new Promise((resolve) => {
    const socket = connect({
      host,
      port,
      servername: host,
      timeout: timeoutMs,
      rejectUnauthorized: false,
    });

    const onError = (msg: string): void => {
      socket.destroy();
      resolve({ status: 'fail', error: msg });
    };

    socket.on('secureConnect', () => {
      try {
        const cert = socket.getPeerCertificate();
        socket.end();
        if (!cert || !cert.valid_to) {
          resolve({ status: 'fail', error: 'no peer certificate' });
          return;
        }
        const validTo = new Date(cert.valid_to);
        const daysUntilExpiry = Math.floor((validTo.getTime() - Date.now()) / 86_400_000);
        const status: CheckStatus =
          daysUntilExpiry < 0 ? 'fail' : daysUntilExpiry < warnDays ? 'warn' : 'ok';
        const result: SslCheckResult = {
          status,
          validFrom: cert.valid_from,
          validTo: cert.valid_to,
          daysUntilExpiry,
        };
        if (cert.issuer && typeof cert.issuer === 'object' && 'CN' in cert.issuer) {
          result.issuer = String((cert.issuer as Record<string, unknown>).CN);
        }
        resolve(result);
      } catch (err) {
        onError(err instanceof Error ? err.message : String(err));
      }
    });

    socket.on('error', (err) => onError(err.message));
    socket.on('timeout', () => onError('tls handshake timeout'));
  });
}
