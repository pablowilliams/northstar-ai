export const workspaceDefinitions = [
  { id: "overview", label: "Executive overview", hint: "Decision and health", shortcut: 1 },
  { id: "portfolio", label: "Opportunity portfolio", hint: "Prioritisation", shortcut: 2 },
  { id: "prototype", label: "Controlled prototype", hint: "Agent workflow", shortcut: 3 },
  { id: "evidence", label: "Value & evidence", hint: "Backtest and ROI", shortcut: 4 },
  { id: "architecture", label: "Architecture & risk", hint: "Platform controls", shortcut: 5 },
  { id: "roadmap", label: "Decision & roadmap", hint: "Delivery plan", shortcut: 6 },
] as const;

export type WorkspaceId = typeof workspaceDefinitions[number]["id"];

export function isWorkspaceId(value: string): value is WorkspaceId {
  return workspaceDefinitions.some(item => item.id === value);
}
