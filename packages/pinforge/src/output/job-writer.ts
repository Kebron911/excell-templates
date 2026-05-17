import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { BatchResult } from "../queue/batch.js";

export interface WriteJobSummaryInput {
  jobsDir: string;
  jobId: string;
  result: BatchResult;
}

export async function writeJobSummary(input: WriteJobSummaryInput): Promise<string> {
  await mkdir(input.jobsDir, { recursive: true });
  const path = join(input.jobsDir, `${input.jobId}.json`);
  const body = {
    jobId: input.result.jobId,
    completedAt: new Date().toISOString(),
    counts: {
      total: input.result.succeeded.length + input.result.failed.length,
      succeeded: input.result.succeeded.length,
      failed: input.result.failed.length
    },
    results: {
      succeeded: input.result.succeeded.map(s => ({
        slug: (s.result.metadata as any).imagePath?.split("/").pop()?.replace(/\.png$/, ""),
        brandId: s.result.metadata.brandId,
        templateId: s.result.metadata.templateId,
        paths: s.result.paths
      })),
      failed: input.result.failed
    }
  };
  await writeFile(path, JSON.stringify(body, null, 2) + "\n", "utf8");
  return path;
}
