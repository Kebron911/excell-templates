#!/usr/bin/env node
import { Command } from "commander";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./env.js";
import { generatePin } from "./orchestrator/generate.js";
import { generateBatch } from "./queue/batch.js";
import { writeJobSummary } from "./output/job-writer.js";
import { parsePinInputCsv } from "./csv/parse.js";
import { listBrandIds } from "./brand/kit-loader.js";
import "./templates/index.js";
import { listTemplateIds } from "./templates/registry.js";
import { logger } from "./logger.js";

const PACKAGE_ROOT = resolve(fileURLToPath(import.meta.url), "..", "..");
const BRANDS_DIR = resolve(PACKAGE_ROOT, "brands");

const program = new Command();
program.name("pinforge").description("Pinterest pin generator").version("0.1.0");

program.command("generate")
  .description("Generate a single pin")
  .requiredOption("--brand <id>", "brandId")
  .requiredOption("--topic <text>", "pin topic")
  .requiredOption("--keyword <text>", "primary SEO keyword")
  .requiredOption("--url <url>", "destination URL")
  .option("--template <id>", "templateId (default: brand default)")
  .option("--bg <type>", "backgroundType: solid|gradient|image")
  .option("--treatment <type>", "imageTreatment: bottom-gradient|white-banner|duotone")
  .action(async (opts) => {
    const env = loadEnv();
    const result = await generatePin({
      brandId: opts.brand,
      topic: opts.topic,
      primaryKeyword: opts.keyword,
      destinationUrl: opts.url,
      templateId: opts.template,
      backgroundType: opts.bg,
      imageTreatment: opts.treatment
    }, { env, brandsDir: BRANDS_DIR, outputDir: resolve(process.cwd(), env.outputDir) });
    process.stdout.write(`✓ ${result.paths.png}\n  ${result.paths.json}\n`);
  });

program.command("bulk <file>")
  .description("Generate pins from a CSV file")
  .action(async (file) => {
    const env = loadEnv();
    const text = await readFile(file, "utf8");
    const parsed = parsePinInputCsv(text);
    if (parsed.errors.length > 0) {
      process.stderr.write(`⚠ ${parsed.errors.length} CSV row error(s):\n`);
      for (const e of parsed.errors) process.stderr.write(`  line ${e.line}: ${e.message}\n`);
    }
    if (parsed.rows.length === 0) {
      process.stderr.write("No valid rows to process.\n");
      process.exit(1);
    }
    const outputDir = resolve(process.cwd(), env.outputDir);
    const jobsDir = resolve(process.cwd(), env.jobsDir);
    const result = await generateBatch(parsed.rows, { env, brandsDir: BRANDS_DIR, outputDir });
    const summaryPath = await writeJobSummary({ jobsDir, jobId: result.jobId, result });
    process.stdout.write(`✓ Job ${result.jobId} complete: ${result.succeeded.length} succeeded, ${result.failed.length} failed\n  summary: ${summaryPath}\n`);
    if (result.failed.length > 0) process.exitCode = 2;
  });

program.command("brands")
  .description("List available brand kits")
  .action(async () => {
    const ids = await listBrandIds(BRANDS_DIR);
    for (const id of ids) process.stdout.write(`${id}\n`);
  });

program.command("templates")
  .description("List available templates")
  .action(() => {
    for (const id of listTemplateIds()) process.stdout.write(`${id}\n`);
  });

program.parseAsync().catch(err => {
  logger.error({ err: String(err), stack: err.stack }, "pinforge CLI failed");
  process.exit(1);
});
