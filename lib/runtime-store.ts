import type { WorkflowRun } from "./types";

declare global {
  var northstarRuns: Map<string, WorkflowRun> | undefined;
}

export const runs = globalThis.northstarRuns ?? new Map<string, WorkflowRun>();
globalThis.northstarRuns = runs;
