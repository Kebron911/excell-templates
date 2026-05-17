import { describe, expect, it, beforeEach } from "vitest";
import {
  _resetJobs,
  completeJob,
  createJobId,
  failJob,
  getJob,
  registerJob
} from "../../src/jobs.js";

beforeEach(() => {
  _resetJobs();
});

describe("jobs module", () => {
  it("createJobId produces unique job_-prefixed ids", () => {
    const a = createJobId();
    const b = createJobId();
    expect(a).toMatch(/^job_/);
    expect(b).toMatch(/^job_/);
    expect(a).not.toBe(b);
  });

  it("registerJob sets status running", () => {
    const id = createJobId();
    registerJob(id, { total: 3 });
    const job = getJob(id);
    expect(job).toBeDefined();
    expect(job!.status).toBe("running");
    expect(job!.progress.total).toBe(3);
    expect(job!.progress.done).toBe(0);
  });

  it("completeJob updates counts + status to done", () => {
    const id = createJobId();
    registerJob(id, { total: 2 });
    completeJob(id, [
      { ok: true, pin: {}, paths: {} },
      { ok: false, error: { code: "ERR", message: "fail", context: {} } }
    ]);
    const job = getJob(id);
    expect(job!.status).toBe("done");
    expect(job!.progress.done).toBe(1);
    expect(job!.progress.failed).toBe(1);
    expect(job!.completedAt).toBeDefined();
  });

  it("failJob captures fatalError", () => {
    const id = createJobId();
    registerJob(id, { total: 1 });
    failJob(id, new Error("crashed"));
    const job = getJob(id);
    expect(job!.status).toBe("failed");
    expect(job!.fatalError?.message).toBe("crashed");
    expect(job!.completedAt).toBeDefined();
  });
});
