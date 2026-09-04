import assert from "node:assert/strict";
import test from "node:test";
import { approveRun, runWorkflow } from "../lib/engine";
import { cases, opportunities } from "../lib/data";
import { calculateBusinessCase, scoreOpportunity } from "../lib/scoring";

test("portfolio methodology ranks bounded returns use case first", () => {
  assert.equal([...opportunities].sort((a,b)=>b.score-a.score)[0].id, "returns");
  assert.equal(opportunities[0].recommendation, "Accelerate");
});

test("high-value refund is bound to human approval and exact payload", () => {
  const run = runWorkflow(cases.find(item => item.id === "AST-02711")!);
  assert.equal(run.status, "awaiting_approval");
  assert.ok(run.proposedAction);
  assert.throws(() => approveRun(run, "0000000000000000"), /does not match/);
  const approved = approveRun(run, run.proposedAction!.payloadHash);
  assert.equal(approved.status, "completed");
  assert.equal(approved.trace.at(-1)?.id, "execute");
});

test("fraud signal blocks financial action", () => {
  const run = runWorkflow(cases.find(item => item.id === "AST-04126")!);
  assert.equal(run.status, "blocked");
  assert.equal(run.proposedAction, undefined);
  assert.ok(run.evidence.some(item => item.id === "POL-FRD-07"));
});

test("vulnerability forces human route", () => {
  const run = runWorkflow(cases.find(item => item.id === "AST-03844")!);
  assert.equal(run.status, "awaiting_approval");
  assert.match(run.recommendation, /human handoff/i);
  assert.ok(run.evidence.some(item => item.id === "POL-VUL-01"));
});

test("scoring and benefits arithmetic remain deterministic", () => {
  const opportunity = scoreOpportunity({ id: "x", title: "X", function: "Ops", problem: "P", value: 5, feasibility: 5, evidence: 5, risk: 1, effortWeeks: 4, annualValueGbp: 1 });
  assert.equal(opportunity.score, 100);
  const value = calculateBusinessCase({ annualCases: 120000, minutesSaved: 7.1, hourlyCost: 32, repeatContactsAvoided: 20000, contactCost: 7.8, yearOneCost: 190000 });
  assert.equal(Math.round(value.capacityValue), 454400);
  assert.equal(Math.round(value.grossValue), 610400);
});
