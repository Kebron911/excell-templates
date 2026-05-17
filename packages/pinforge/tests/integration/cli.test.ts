import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const CLI = resolve(fileURLToPath(import.meta.url), "..", "..", "..", "dist", "cli.js");

describe("pinforge CLI", () => {
  it("brands subcommand lists strguests and excel-templates", () => {
    const out = spawnSync("node", [CLI, "brands"], { encoding: "utf8" });
    expect(out.status).toBe(0);
    expect(out.stdout).toContain("strguests");
    expect(out.stdout).toContain("excel-templates");
  });

  it("templates subcommand lists big-hook", () => {
    const out = spawnSync("node", [CLI, "templates"], { encoding: "utf8" });
    expect(out.status).toBe(0);
    expect(out.stdout).toContain("big-hook");
  });

  it("generate without required flags exits non-zero", () => {
    const out = spawnSync("node", [CLI, "generate"], { encoding: "utf8" });
    expect(out.status).not.toBe(0);
  });
});
