import { loadCatalog } from '@str/catalog';
import { loadApiEnv } from './env.js';
import { buildServer } from './server.js';

async function main(): Promise<void> {
  let env;
  try {
    env = loadApiEnv();
  } catch (err) {
    console.error('Env validation failed:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  let catalog;
  try {
    const result = loadCatalog();
    catalog = result.catalog;
    if (result.warnings.length > 0) {
      console.warn(`catalog loaded with ${result.warnings.length} warning(s)`);
      for (const w of result.warnings) console.warn(`  · ${w}`);
    }
  } catch (err) {
    console.error('Catalog load failed:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  let app;
  try {
    app = await buildServer({ env, catalog });
  } catch (err) {
    console.error('Server build failed:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  try {
    await app.listen({ host: env.host, port: env.port });
    console.log(`catalog-api listening on ${env.host}:${env.port}`);
  } catch (err) {
    console.error('Listen failed:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
