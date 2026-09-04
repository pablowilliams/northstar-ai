import assert from "node:assert/strict";
import test from "node:test";
import { evidence } from "../lib/data";

test("policy evidence has lineage and effective dates", () => {
  assert.ok(evidence.length >= 5);
  for (const item of evidence) {
    assert.match(item.id, /^POL-/);
    assert.match(item.effectiveFrom, /^2026-/);
    assert.ok(item.confidence >= 0.9 && item.confidence <= 1);
    assert.ok(item.excerpt.length > 40);
  }
});
