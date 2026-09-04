import assert from "node:assert/strict";
import test from "node:test";
import { isWorkspaceId, workspaceDefinitions } from "../lib/workspaces";

test("workspace navigation has stable unique routes and shortcuts", () => {
  assert.equal(workspaceDefinitions.length, 6);
  assert.equal(new Set(workspaceDefinitions.map(item => item.id)).size, 6);
  assert.deepEqual(workspaceDefinitions.map(item => item.shortcut), [1, 2, 3, 4, 5, 6]);
  assert.ok(workspaceDefinitions.every(item => item.label.length > 8 && item.hint.length > 4));
});

test("workspace route guard rejects unknown hash values", () => {
  assert.equal(isWorkspaceId("architecture"), true);
  assert.equal(isWorkspaceId("admin"), false);
  assert.equal(isWorkspaceId(""), false);
});
