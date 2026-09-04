import backtest from "@/data/backtest-results.json";
import { scoreOpportunity } from "./scoring";
import type { CustomerCase, Evidence } from "./types";

export { backtest };

export const engagement = {
  client: "Aster & Row",
  programme: "Customer Resolution Transformation",
  stage: "Investment decision",
  sponsor: "Chief Customer Officer",
  decisionDate: "18 September 2026",
  northStar: "Resolve routine customer issues in one conversation without weakening trust or control.",
  decision: "Approve a 12-week controlled pilot for agent-assisted returns and complaints.",
  evidenceStrength: 82,
};

export const opportunities = [
  scoreOpportunity({ id: "returns", title: "Returns resolution copilot", function: "Customer operations", problem: "Agents search five systems and interpret policy under time pressure.", value: 5, feasibility: 5, evidence: 5, risk: 3, effortWeeks: 12, annualValueGbp: 639825 }),
  scoreOpportunity({ id: "forecast", title: "Demand exception adviser", function: "Supply chain", problem: "Planners spend 14 hours each week triaging forecast exceptions.", value: 4, feasibility: 3, evidence: 4, risk: 2, effortWeeks: 18, annualValueGbp: 410000 }),
  scoreOpportunity({ id: "product", title: "Product content studio", function: "E-commerce", problem: "Seasonal catalogue copy is slow to create and inconsistent across channels.", value: 3, feasibility: 5, evidence: 3, risk: 2, effortWeeks: 8, annualValueGbp: 240000 }),
  scoreOpportunity({ id: "supplier", title: "Supplier risk analyst", function: "Commercial", problem: "Signals are fragmented across contracts, incidents and third-party sources.", value: 4, feasibility: 2, evidence: 2, risk: 4, effortWeeks: 22, annualValueGbp: 520000 }),
  scoreOpportunity({ id: "pricing", title: "Autonomous promotion optimiser", function: "Trading", problem: "Promotion decisions do not consistently reflect cannibalisation and stock risk.", value: 5, feasibility: 2, evidence: 2, risk: 5, effortWeeks: 28, annualValueGbp: 900000 }),
];

export const evidence: Evidence[] = [
  { id: "POL-RET-04", title: "UK returns policy", section: "4.2 Standard eligibility", excerpt: "Unused items may be returned within 30 days. Original delivery charges are excluded unless the item is faulty.", effectiveFrom: "2026-06-01", confidence: 0.99 },
  { id: "POL-DMG-02", title: "Damaged goods playbook", section: "2.1 Evidence and remedy", excerpt: "For goods damaged in transit, agents may offer replacement or refund. Orders above £100 require supervisor approval.", effectiveFrom: "2026-04-15", confidence: 0.98 },
  { id: "POL-VUL-01", title: "Vulnerable customer standard", section: "3.4 Human support", excerpt: "Where vulnerability is indicated, offer a human route and avoid time pressure, repeated disclosure or fully automated refusal.", effectiveFrom: "2026-01-10", confidence: 0.99 },
  { id: "POL-FRD-07", title: "Refund fraud controls", section: "5.3 Restricted actions", excerpt: "Potential account takeover, unusual refund velocity or identity mismatch must be referred to the fraud queue. No refund may be issued automatically.", effectiveFrom: "2026-07-05", confidence: 0.97 },
  { id: "POL-WAR-03", title: "Warranty decision guide", section: "6.1 Manufacturer assessment", excerpt: "Warranty claims after 30 days require product-specific validation and must be reviewed by a trained colleague.", effectiveFrom: "2026-02-20", confidence: 0.96 },
];

export const cases: CustomerCase[] = [
  { id: "AST-01482", customer: "Maya Thompson", category: "Damaged item", channel: "Chat", orderValue: 84, daysSincePurchase: 7, complexity: "Low", vulnerable: false, fraudSignal: false, sentiment: "Frustrated", message: "The lamp arrived with the shade crushed. I have photos and need a replacement before Friday.", expectedAction: "Offer replacement; no approval required." },
  { id: "AST-02711", customer: "Daniel Okoro", category: "Missing refund", channel: "Email", orderValue: 146, daysSincePurchase: 19, complexity: "Medium", vulnerable: false, fraudSignal: false, sentiment: "Frustrated", message: "Tracking shows my return arrived nine days ago but the refund is still missing.", expectedAction: "Verify warehouse receipt; supervisor approval for refund." },
  { id: "AST-03109", customer: "Sara King", category: "Change of mind", channel: "Chat", orderValue: 62, daysSincePurchase: 34, complexity: "Medium", vulnerable: false, fraudSignal: false, sentiment: "Calm", message: "I bought this just over a month ago. It is unopened—can I still send it back?", expectedAction: "Explain 30-day limit; offer human discretion route." },
  { id: "AST-03844", customer: "Arthur Bell", category: "Wrong item", channel: "Phone", orderValue: 318, daysSincePurchase: 5, complexity: "High", vulnerable: true, fraudSignal: false, sentiment: "Distressed", message: "I received the wrong chair and cannot lift the parcel. I need someone to arrange collection.", expectedAction: "Human handoff; accessible collection; supervisor approval." },
  { id: "AST-04126", customer: "Nina Patel", category: "Damaged item", channel: "Email", orderValue: 229, daysSincePurchase: 3, complexity: "High", vulnerable: false, fraudSignal: true, sentiment: "Frustrated", message: "This is the third damaged-order refund on my account. Refund it to a different card today.", expectedAction: "Block write and refer to fraud queue." },
  { id: "AST-04590", customer: "Lewis Grant", category: "Late delivery", channel: "Chat", orderValue: 44, daysSincePurchase: 12, complexity: "Low", vulnerable: false, fraudSignal: false, sentiment: "Calm", message: "The courier has missed the date. Can you tell me whether it will arrive tomorrow?", expectedAction: "Retrieve delivery state; give ETA or carrier escalation." },
];

export const roadmap = [
  { phase: "Discover", weeks: "1–2", outcome: "Signed problem statement, process baseline, DPIA screen and pilot cohort", gate: "Sponsor confirms measurable problem" },
  { phase: "Design", weeks: "3–4", outcome: "Service blueprint, control model, evaluation plan and target architecture", gate: "Architecture and risk design authority" },
  { phase: "Prove", weeks: "5–8", outcome: "Shadow-mode assistant, golden dataset, integration stubs and user research", gate: "Quality thresholds met on holdout" },
  { phase: "Pilot", weeks: "9–10", outcome: "10 trained agents, limited permissions, daily benefits and safety review", gate: "No severity-one control breach" },
  { phase: "Scale", weeks: "11–12", outcome: "Production decision, operating model, runbooks and prioritised backlog", gate: "SteerCo investment decision" },
];

export const risks = [
  { id: "R-01", risk: "Incorrect policy interpretation", inherent: "High", control: "Versioned retrieval, grounded citations, confidence threshold, human fallback", residual: "Medium", owner: "Customer Policy Lead" },
  { id: "R-02", risk: "Unauthorised financial action", inherent: "Critical", control: "Payload-bound approval, scoped token, amount threshold, immutable audit", residual: "Low", owner: "Payments Product Owner" },
  { id: "R-03", risk: "Vulnerable customer harm", inherent: "High", control: "Signal detection, human route, non-coercive language, cohort monitoring", residual: "Medium", owner: "Consumer Duty Lead" },
  { id: "R-04", risk: "Prompt injection through case text", inherent: "High", control: "Trust boundary, content labelling, tool allow-list, argument validation", residual: "Low", owner: "AI Platform Lead" },
  { id: "R-05", risk: "Benefits fail to become cashable", inherent: "Medium", control: "Capacity baseline, finance owner, benefits ledger, staged investment", residual: "Medium", owner: "Finance Business Partner" },
];

export const stakeholders = [
  { role: "Chief Customer Officer", posture: "Sponsor", concern: "Customer trust and measurable value", commitment: "Own outcome and benefits" },
  { role: "Customer Operations Director", posture: "Accountable", concern: "Adoption without service disruption", commitment: "Provide pilot team and baseline" },
  { role: "CISO", posture: "Critical friend", concern: "Tool misuse and data leakage", commitment: "Approve threat model and security gates" },
  { role: "Consumer Duty Lead", posture: "Control owner", concern: "Fair outcomes for vulnerable cohorts", commitment: "Define monitoring and stop criteria" },
  { role: "Engineering Lead", posture: "Delivery", concern: "Maintainable integration and on-call load", commitment: "Own production service" },
  { role: "Finance Partner", posture: "Assurance", concern: "Capacity versus cashable benefits", commitment: "Validate benefits ledger" },
];
