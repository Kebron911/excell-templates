import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadApiEnv } from "./env.js";
import { buildServer } from "./server.js";

async function main(): Promise<void> {
  let env;
  try {
    env = loadApiEnv();
  } catch (err) {
    console.error("Env validation failed:", err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  // Resolve brands dir relative to @str/pinforge package location
  const pinforgeEntry = fileURLToPath(
    import.meta.resolve("@str/pinforge")
  );
  const brandsDir = resolve(dirname(pinforgeEntry), "../brands");
  const outputDir = env.pinforge.outputDir;

  let app;
  try {
    app = await buildServer({ env, brandsDir, outputDir });
  } catch (err) {
    console.error("Server build failed:", err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  try {
    await app.listen({ host: env.host, port: env.port });
    console.log(`pinforge-api listening on ${env.host}:${env.port}`);
  } catch (err) {
    console.error("Server listen failed:", err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
