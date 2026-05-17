import { randomBytes } from "node:crypto";

export type JobStatus = "pending" | "running" | "done" | "failed";

export interface JobResultEntry {
  ok: boolean;
  pin?: unknown;
  paths?: unknown;
  error?: { code: string; message: string; context: Record<string, unknown> };
}

export interface JobState {
  jobId: string;
  status: JobStatus;
  createdAt: string;
  completedAt?: string;
  progress: { done: number; total: number; failed: number };
  results?: JobResultEntry[];
  fatalError?: { code: string; message: string };
}

// In-memory job registry.
//
// LIMITATIONS:
// - No TTL / eviction. Entries accumulate until process restart.
//   Acceptable for low-volume MVP (dozens of jobs/day).
//   For high-volume production, swap for SQLite-backed store via the
//   JobStore interface — see Phase B.5 follow-up in BACKLOG.md.
// - Single-process only. Survives only the current Node instance.
//   For multi-replica deployment, use a shared store (Redis/SQLite).
// - Module-level singleton. Tests should call _resetJobs() in beforeEach.
const JOBS = new Map<string, JobState>();

export function createJobId(): string {
  const time36 = Date.now().toString(36);
  const rand = randomBytes(4).toString("hex");
  return `job_${time36}_${rand}`;
}

export function registerJob(jobId: string, opts: { total: number }): void {
  JOBS.set(jobId, {
    jobId,
    status: "running",
    createdAt: new Date().toISOString(),
    progress: { done: 0, total: opts.total, failed: 0 }
  });
}

export function completeJob(jobId: string, results: JobResultEntry[]): void {
  const job = JOBS.get(jobId);
  if (!job) return;
  const done = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;
  job.status = "done";
  job.completedAt = new Date().toISOString();
  job.progress.done = done;
  job.progress.failed = failed;
  job.results = results;
}

export function failJob(jobId: string, err: unknown): void {
  const job = JOBS.get(jobId);
  if (!job) return;
  job.status = "failed";
  job.completedAt = new Date().toISOString();
  const msg = err instanceof Error ? err.message : String(err);
  job.fatalError = { code: "JOB_FAILED", message: msg };
  job.progress.failed = job.progress.total;
}

export function getJob(jobId: string): JobState | undefined {
  return JOBS.get(jobId);
}

/** Test helper. NOT exported from index.ts. */
export function _resetJobs(): void {
  JOBS.clear();
}
