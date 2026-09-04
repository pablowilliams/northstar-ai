export type Workstream = "Discover" | "Design" | "Prove" | "Scale";
export type RiskLevel = "Low" | "Medium" | "High";

export interface Opportunity {
  id: string;
  title: string;
  function: string;
  problem: string;
  value: number;
  feasibility: number;
  evidence: number;
  risk: number;
  effortWeeks: number;
  annualValueGbp: number;
  recommendation: "Accelerate" | "Incubate" | "Monitor";
  score: number;
}

export interface CustomerCase {
  id: string;
  customer: string;
  category: string;
  channel: string;
  orderValue: number;
  daysSincePurchase: number;
  complexity: "Low" | "Medium" | "High";
  vulnerable: boolean;
  fraudSignal: boolean;
  sentiment: "Calm" | "Frustrated" | "Distressed";
  message: string;
  expectedAction: string;
}

export interface Evidence {
  id: string;
  title: string;
  section: string;
  excerpt: string;
  effectiveFrom: string;
  confidence: number;
}

export interface TraceStep {
  id: string;
  label: string;
  status: "passed" | "review" | "blocked";
  detail: string;
  latencyMs: number;
}

export interface WorkflowRun {
  runId: string;
  caseId: string;
  status: "ready" | "awaiting_approval" | "completed" | "blocked";
  recommendation: string;
  rationale: string;
  confidence: number;
  evidence: Evidence[];
  trace: TraceStep[];
  proposedAction?: {
    tool: string;
    amountGbp: number;
    payloadHash: string;
    expiresAt: string;
  };
  controls: string[];
}
