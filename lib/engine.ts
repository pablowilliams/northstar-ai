import { createHash, randomUUID } from "crypto";
import { cases, evidence } from "./data";
import type { CustomerCase, WorkflowRun } from "./types";

const sensitivePatterns = [/ignore (all|previous) instructions/i, /system prompt/i, /send .* data/i, /bypass/i];

export function findCase(id: string) {
  return cases.find((item) => item.id === id);
}

export function runWorkflow(input: CustomerCase): WorkflowRun {
  const started = Date.now();
  const blocked = input.fraudSignal || sensitivePatterns.some((pattern) => pattern.test(input.message));
  const vulnerable = input.vulnerable || input.sentiment === "Distressed";
  const relevant = evidence.filter((item) => {
    if (blocked && item.id === "POL-FRD-07") return true;
    if (vulnerable && item.id === "POL-VUL-01") return true;
    if (input.category === "Damaged item" && item.id === "POL-DMG-02") return true;
    if (input.category === "Warranty" && item.id === "POL-WAR-03") return true;
    return item.id === "POL-RET-04";
  }).slice(0, 3);
  const approvalRequired = vulnerable || input.orderValue >= 100 || input.category === "Missing refund";
  const amount = input.category === "Late delivery" ? 0 : input.orderValue;
  const proposed = JSON.stringify({ caseId: input.id, amount, action: blocked ? "refer_fraud" : "resolve_return" });
  const payloadHash = createHash("sha256").update(proposed).digest("hex").slice(0, 16);
  const recommendation = blocked
    ? "Do not issue a refund. Preserve the case and refer it to the fraud queue."
    : vulnerable
      ? "Offer an immediate human handoff and arrange an accessible resolution path."
      : input.expectedAction;

  return {
    runId: `run_${randomUUID().slice(0, 8)}`,
    caseId: input.id,
    status: blocked ? "blocked" : approvalRequired ? "awaiting_approval" : "ready",
    recommendation,
    rationale: blocked
      ? "A restricted risk signal is present; autonomous financial action is outside policy."
      : `The recommendation is grounded in ${relevant.map((item) => item.id).join(", ")} and limited by the approval policy.`,
    confidence: blocked ? 0.99 : vulnerable ? 0.94 : 0.97,
    evidence: relevant,
    trace: [
      { id: "intake", label: "Classify case", status: "passed", detail: `${input.category}; ${input.complexity.toLowerCase()} complexity`, latencyMs: 28 },
      { id: "guard", label: "Apply trust boundary", status: blocked ? "blocked" : "passed", detail: blocked ? "Risk or untrusted instruction requires containment" : "No instruction-boundary breach detected", latencyMs: 12 },
      { id: "retrieve", label: "Retrieve policy", status: "passed", detail: `${relevant.length} effective policy passages retrieved`, latencyMs: 74 },
      { id: "decide", label: "Construct recommendation", status: approvalRequired ? "review" : blocked ? "blocked" : "passed", detail: approvalRequired ? "Human approval is required for the exact payload" : "Action remains within delegated authority", latencyMs: 96 },
      { id: "observe", label: "Write audit trace", status: "passed", detail: "Inputs, evidence, control decisions and timings recorded", latencyMs: Math.max(6, Date.now() - started + 6) },
    ],
    proposedAction: blocked ? undefined : { tool: "commerce.issue_refund_or_replacement", amountGbp: amount, payloadHash, expiresAt: new Date(Date.now() + 10 * 60_000).toISOString() },
    controls: ["Evidence grounding", "Least-privilege tool scope", "Payload-bound approval", "Sensitive-cohort fallback", "Immutable trace"],
  };
}

export function approveRun(run: WorkflowRun, payloadHash: string): WorkflowRun {
  if (!run.proposedAction || run.proposedAction.payloadHash !== payloadHash) throw new Error("Approval does not match the proposed payload");
  if (new Date(run.proposedAction.expiresAt).getTime() < Date.now()) throw new Error("Approval token has expired");
  return {
    ...run,
    status: "completed",
    trace: [...run.trace, { id: "execute", label: "Execute approved tool call", status: "passed", detail: `Exact payload ${payloadHash} executed in simulation`, latencyMs: 118 }],
  };
}
