import { loadCatalog } from '@str/catalog';
import { loadEnv } from './env.js';
import { Runner } from './runner.js';
import { buildServer } from './server.js';
import { HealthStore } from './store.js';

async function main(): Promise<void> {
  const env = loadEnv();
  const { catalog } = loadCatalog();
  const store = new HealthStore();

  const runner = new Runner({
    catalog,
    store,
    intervalMs: env.intervalMs,
    sslIntervalMs: env.sslIntervalMs,
    timeoutMs: env.timeoutMs,
    sslWarnDays: env.sslWarnDays,
  });
  runner.start();

  const app = buildServer({ store });
  await app.listen({ host: env.host, port: env.port });
  console.log(`empire-health listening on ${env.host}:${env.port}`);

  const shutdown = async (): Promise<void> => {
    runner.stop();
    await app.close();
    process.exit(0);
  };
  process.on('SIGTERM', () => void shutdown());
  process.on('SIGINT', () => void shutdown());
}

main().catch((err: unknown) => {
  console.error('empire-health failed to start:', err);
  process.exit(1);
});
