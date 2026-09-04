"use client";

import { useMemo, useState } from "react";
import { backtest, cases, engagement, opportunities, risks, roadmap, stakeholders } from "@/lib/data";
import { calculateBusinessCase } from "@/lib/scoring";
import type { CustomerCase, WorkflowRun } from "@/lib/types";

type View = "brief" | "portfolio" | "prototype" | "evidence" | "architecture" | "roadmap";

const nav: { id: View; label: string; kicker: string }[] = [
  { id: "brief", label: "Engagement brief", kicker: "01" },
  { id: "portfolio", label: "Opportunity portfolio", kicker: "02" },
  { id: "prototype", label: "Controlled prototype", kicker: "03" },
  { id: "evidence", label: "Value & evidence", kicker: "04" },
  { id: "architecture", label: "Architecture & risk", kicker: "05" },
  { id: "roadmap", label: "Decision & roadmap", kicker: "06" },
];

const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

function Metric({ label, value, detail, tone = "ink" }: { label: string; value: string; detail: string; tone?: "ink" | "green" | "amber" }) {
  return <article className={`metric metric-${tone}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>;
}

function DeltaBar({ before, after, max, beforeLabel, afterLabel }: { before: number; after: number; max: number; beforeLabel: string; afterLabel: string }) {
  return <div className="delta-bars">
    <div><span>{beforeLabel}</span><i style={{ width: `${before / max * 100}%` }} className="bar-before" /><b>{before}</b></div>
    <div><span>{afterLabel}</span><i style={{ width: `${after / max * 100}%` }} className="bar-after" /><b>{after}</b></div>
  </div>;
}

function BriefView() {
  return <div className="view-stack">
    <section className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">SteerCo decision workspace / September 2026</p>
        <h1>Turn a promising AI use case into a controlled investment decision.</h1>
        <p className="lead">Northstar brings discovery evidence, portfolio choices, a working agent, architecture, risk and quantified value into one accountable consulting engagement.</p>
        <div className="decision-strip"><span>Decision required</span><strong>{engagement.decision}</strong></div>
      </div>
      <div className="mandate-card">
        <span className="status-dot">On track</span>
        <h2>{engagement.client}</h2>
        <dl>
          <div><dt>Programme</dt><dd>{engagement.programme}</dd></div>
          <div><dt>Sponsor</dt><dd>{engagement.sponsor}</dd></div>
          <div><dt>Decision date</dt><dd>{engagement.decisionDate}</dd></div>
          <div><dt>Evidence strength</dt><dd>{engagement.evidenceStrength}/100</dd></div>
        </dl>
      </div>
    </section>
    <section className="metrics-grid four">
      <Metric label="Evaluated holdout" value="5,000" detail="Synthetic cases; fixed seed" />
      <Metric label="Mean handling time" value={`−${backtest.headline.mean_time_reduction_pct}%`} detail={`${backtest.headline.baseline_mean_minutes} → ${backtest.headline.assisted_mean_minutes} minutes`} tone="green" />
      <Metric label="First-contact resolution" value={`+${backtest.headline.fcr_uplift_pp}pp`} detail={`${backtest.headline.baseline_fcr_pct}% → ${backtest.headline.assisted_fcr_pct}%`} tone="green" />
      <Metric label="Year-one net value" value={money.format(backtest.business_case.year_one_net_value_gbp)} detail={`${backtest.business_case.payback_months}-month modelled payback`} tone="amber" />
    </section>
    <section className="two-col wide-left">
      <article className="panel">
        <header className="panel-head"><div><p className="eyebrow">Case for change</p><h2>The operational problem is specific—and testable.</h2></div><span className="tag">Evidence-backed</span></header>
        <div className="problem-grid">
          <div><strong>Five</strong><span>systems opened during a typical return</span></div>
          <div><strong>19.2 min</strong><span>simulated baseline mean handling time</span></div>
          <div><strong>34.8%</strong><span>simulated cases reopened</span></div>
        </div>
        <blockquote>“Resolve routine customer issues in one conversation without weakening trust or control.”<cite>Programme north star</cite></blockquote>
      </article>
      <article className="panel">
        <p className="eyebrow">Engagement health</p><h2>Four signals before funding</h2>
        <ul className="signal-list">
          <li><span className="signal green" />Problem evidence <b>Strong</b></li>
          <li><span className="signal green" />Technical feasibility <b>Proved</b></li>
          <li><span className="signal amber" />Operating readiness <b>Needs pilot</b></li>
          <li><span className="signal amber" />Cashable benefit <b>Finance review</b></li>
        </ul>
      </article>
    </section>
    <section className="panel">
      <header className="panel-head"><div><p className="eyebrow">Stakeholder contract</p><h2>Decision rights are part of the architecture.</h2></div></header>
      <div className="table-wrap"><table><thead><tr><th>Role</th><th>Posture</th><th>Primary concern</th><th>Commitment</th></tr></thead><tbody>{stakeholders.map((row) => <tr key={row.role}><td><b>{row.role}</b></td><td>{row.posture}</td><td>{row.concern}</td><td>{row.commitment}</td></tr>)}</tbody></table></div>
    </section>
  </div>;
}

function PortfolioView() {
  const [weights, setWeights] = useState({ value: 32, feasibility: 26, evidence: 22, risk: 20 });
  return <div className="view-stack">
    <header className="view-head"><div><p className="eyebrow">Opportunity portfolio</p><h1>Prioritise the work—not the technology.</h1><p>Transparent scoring balances value, feasibility, evidence and controllable risk. Change the emphasis and watch the investment order move.</p></div><div className="stamp">Method v1.2<br/><b>Weighted score</b></div></header>
    <section className="panel scoring-panel">
      <div className="weight-controls">
        {Object.entries(weights).map(([key, value]) => <label key={key}><span>{key}<b>{value}%</b></span><input aria-label={`${key} weight`} type="range" min="10" max="45" value={value} onChange={(event) => setWeights({ ...weights, [key]: Number(event.target.value) })} /></label>)}
      </div>
      <p className="micro-note">The stored recommendation uses the approved 32/26/22/20 methodology. Sliders support workshop sensitivity—not silent score rewriting.</p>
    </section>
    <section className="panel opportunity-table">
      <div className="table-wrap"><table><thead><tr><th>Rank</th><th>Opportunity</th><th>Function</th><th>Score</th><th>Risk</th><th>Effort</th><th>Annual value</th><th>Decision</th></tr></thead><tbody>{[...opportunities].sort((a,b)=>b.score-a.score).map((item, index) => <tr key={item.id} className={item.id === "returns" ? "selected-row" : ""}><td>0{index + 1}</td><td><b>{item.title}</b><small>{item.problem}</small></td><td>{item.function}</td><td><span className="score-ring">{item.score}</span></td><td>{item.risk}/5</td><td>{item.effortWeeks} wks</td><td>{money.format(item.annualValueGbp)}</td><td><span className={`pill ${item.recommendation.toLowerCase()}`}>{item.recommendation}</span></td></tr>)}</tbody></table></div>
    </section>
    <section className="two-col">
      <article className="panel"><p className="eyebrow">Recommendation</p><h2>Start with returns resolution.</h2><p className="body-copy">It combines a painful, frequent workflow with accessible policy evidence and bounded tool actions. That makes it the strongest place to prove value while learning how Aster & Row governs agentic systems.</p><div className="proof-list"><span>High transaction volume</span><span>Measurable baseline</span><span>Bounded authority</span><span>Reusable platform pattern</span></div></article>
      <article className="panel"><p className="eyebrow">Do not automate yet</p><h2>Autonomous promotion optimisation.</h2><p className="body-copy">The theoretical upside is high, but evidence is weak and downside reaches margin, stock and customer trust. Instrument the decision process first; keep trading accountability human.</p><div className="callout amber-callout"><b>Discovery question</b><span>Which promotion decisions are reversible within 24 hours?</span></div></article>
    </section>
  </div>;
}

function PrototypeView() {
  const [selected, setSelected] = useState<CustomerCase>(cases[0]);
  const [run, setRun] = useState<WorkflowRun | null>(null);
  const [loading, setLoading] = useState(false);
  async function execute() {
    setLoading(true);
    const response = await fetch("/api/workflows", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ caseId: selected.id }) });
    setRun(await response.json()); setLoading(false);
  }
  async function approve() {
    if (!run?.proposedAction) return;
    const response = await fetch("/api/approvals", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ runId: run.runId, payloadHash: run.proposedAction.payloadHash }) });
    setRun(await response.json());
  }
  return <div className="view-stack">
    <header className="view-head"><div><p className="eyebrow">Controlled prototype</p><h1>An agent that shows its work—and knows when to stop.</h1><p>Select an edge case, execute the governed workflow, inspect the policy evidence and approve only the exact action proposed.</p></div><span className="environment">SIMULATION / NO LIVE WRITES</span></header>
    <section className="prototype-grid">
      <aside className="case-list panel"><p className="eyebrow">Evaluation cases</p>{cases.map((item) => <button key={item.id} className={selected.id === item.id ? "active" : ""} onClick={()=>{setSelected(item);setRun(null);}}><span>{item.id}<i>{item.channel}</i></span><b>{item.category}</b><small>{item.customer} · {money.format(item.orderValue)}</small></button>)}</aside>
      <article className="case-detail panel">
        <div className="case-top"><div><p className="eyebrow">{selected.id} / {selected.complexity} complexity</p><h2>{selected.customer}</h2></div><div className="case-flags">{selected.vulnerable && <span>Vulnerability signal</span>}{selected.fraudSignal && <span className="danger">Fraud signal</span>}<span>{selected.sentiment}</span></div></div>
        <div className="customer-message"><span>Customer message</span><p>{selected.message}</p></div>
        <dl className="case-facts"><div><dt>Order</dt><dd>{money.format(selected.orderValue)}</dd></div><div><dt>Purchase</dt><dd>{selected.daysSincePurchase} days ago</dd></div><div><dt>Channel</dt><dd>{selected.channel}</dd></div><div><dt>Expected</dt><dd>{selected.expectedAction}</dd></div></dl>
        <button className="primary-action" onClick={execute} disabled={loading}>{loading ? "Running controls…" : "Run governed workflow"}<span>⌘ ↵</span></button>
        {run && <div className="run-output">
          <div className="recommendation"><div><span className={`run-status ${run.status}`}>{run.status.replaceAll("_", " ")}</span><h3>{run.recommendation}</h3><p>{run.rationale}</p></div><strong>{Math.round(run.confidence*100)}%<small>confidence</small></strong></div>
          <div className="trace"><h3>Execution trace</h3>{run.trace.map((step) => <div key={step.id} className={`trace-step ${step.status}`}><i /><span><b>{step.label}</b><small>{step.detail}</small></span><em>{step.latencyMs} ms</em></div>)}</div>
          <div className="evidence-stack"><h3>Grounding evidence</h3>{run.evidence.map((item)=><details key={item.id}><summary><span>{item.id} · {item.title}</span><b>{Math.round(item.confidence*100)}%</b></summary><p>{item.excerpt}</p><small>{item.section} · Effective {item.effectiveFrom}</small></details>)}</div>
          {run.status === "awaiting_approval" && run.proposedAction && <div className="approval-box"><div><span>Human approval required</span><b>{run.proposedAction.tool}</b><small>Payload {run.proposedAction.payloadHash} · {money.format(run.proposedAction.amountGbp)}</small></div><button onClick={approve}>Approve exact payload</button></div>}
        </div>}
      </article>
    </section>
  </div>;
}

function EvidenceView() {
  const [annualCases, setAnnualCases] = useState(120000);
  const [hourlyCost, setHourlyCost] = useState(32);
  const [yearOneCost, setYearOneCost] = useState(190000);
  const model = useMemo(() => calculateBusinessCase({ annualCases, minutesSaved: backtest.headline.mean_minutes_saved, hourlyCost, repeatContactsAvoided: annualCases * backtest.headline.reopen_reduction_pp / 100, contactCost: 7.8, yearOneCost }), [annualCases, hourlyCost, yearOneCost]);
  return <div className="view-stack">
    <header className="view-head"><div><p className="eyebrow">Value and evidence</p><h1>A business case with its working shown.</h1><p>All results below come from the reproducible synthetic holdout. Assumptions are editable; uncertainty and claim limits stay visible.</p></div><div className="verified-badge"><span>✓</span><b>Validator passed</b><small>5,000 / 5,000 cases reconciled</small></div></header>
    <section className="metrics-grid four"><Metric label="Mean time saved" value={`${backtest.headline.mean_minutes_saved} min`} detail={`95% CI ${backtest.headline.mean_minutes_saved_95ci[0]}–${backtest.headline.mean_minutes_saved_95ci[1]}`} tone="green"/><Metric label="FCR uplift" value={`+${backtest.headline.fcr_uplift_pp}pp`} detail="Paired synthetic comparison" tone="green"/><Metric label="Policy adherence" value={`${backtest.headline.assisted_policy_adherence_pct}%`} detail={`95% CI ${(backtest.uncertainty.assisted_policy_95ci[0]*100).toFixed(1)}–${(backtest.uncertainty.assisted_policy_95ci[1]*100).toFixed(1)}%`}/><Metric label="Unsafe writes" value="0 / 5,000" detail={`95% upper bound ${backtest.uncertainty.zero_unsafe_write_upper_95_pct}%`} tone="amber"/></section>
    <section className="two-col evidence-layout">
      <article className="panel"><header className="panel-head"><div><p className="eyebrow">Operational backtest</p><h2>Baseline vs governed assistance</h2></div><span className="tag">Seed 42026</span></header>
        <div className="comparison-block"><h3>Mean handling time / minutes</h3><DeltaBar before={backtest.headline.baseline_mean_minutes} after={backtest.headline.assisted_mean_minutes} max={25} beforeLabel="Baseline" afterLabel="Assisted" /></div>
        <div className="comparison-block"><h3>First-contact resolution / percent</h3><DeltaBar before={backtest.headline.baseline_fcr_pct} after={backtest.headline.assisted_fcr_pct} max={100} beforeLabel="Baseline" afterLabel="Assisted" /></div>
        <h3 className="segment-title">Time reduction by complexity</h3><div className="segment-bars">{backtest.segments.complexity.map((row)=><div key={row.segment}><span>{row.segment}<small>n={row.n}</small></span><i><b style={{width:`${row.time_reduction_pct/50*100}%`}} /></i><strong>{row.time_reduction_pct}%</strong></div>)}</div>
      </article>
      <article className="panel model-card"><p className="eyebrow">Benefits model</p><h2>Change assumptions live</h2>
        <label><span>Annual case volume <b>{annualCases.toLocaleString()}</b></span><input type="range" min="40000" max="240000" step="5000" value={annualCases} onChange={e=>setAnnualCases(Number(e.target.value))}/></label>
        <label><span>Loaded hourly cost <b>£{hourlyCost}</b></span><input type="range" min="20" max="55" value={hourlyCost} onChange={e=>setHourlyCost(Number(e.target.value))}/></label>
        <label><span>Year-one platform cost <b>{money.format(yearOneCost)}</b></span><input type="range" min="100000" max="400000" step="10000" value={yearOneCost} onChange={e=>setYearOneCost(Number(e.target.value))}/></label>
        <div className="model-results"><div><span>Gross annual value</span><b>{money.format(model.grossValue)}</b></div><div><span>Year-one net value</span><b>{money.format(model.netValue)}</b></div><div><span>Payback</span><b>{model.paybackMonths.toFixed(1)} months</b></div></div>
        <p className="micro-note">Capacity value is not automatically cashable. Finance must agree the conversion mechanism before scale funding.</p>
      </article>
    </section>
    <section className="panel disclosure"><div><p className="eyebrow">Claim boundary</p><h2>What these numbers do—and do not—prove.</h2></div><ul>{backtest.limitations.map(item=><li key={item}>{item}</li>)}</ul></section>
  </div>;
}

function ArchitectureView() {
  return <div className="view-stack"><header className="view-head"><div><p className="eyebrow">Architecture and risk</p><h1>Bounded agency on an observable platform.</h1><p>The assistant may retrieve, reason and propose. Material writes remain behind policy, identity and approval controls.</p></div><span className="tag">AWS target / local proof</span></header>
    <section className="panel architecture-map"><div className="arch-lane"><span>Experience</span><div><b>Agent workspace</b><small>Next.js · accessible UI</small></div><div><b>SteerCo cockpit</b><small>Evidence · benefits · risk</small></div></div><div className="arch-arrow">↓ authenticated request + trace context</div><div className="arch-lane"><span>Agent platform</span><div><b>Orchestrator</b><small>State machine · stop conditions</small></div><div><b>Policy retrieval</b><small>Hybrid search · effective dates</small></div><div><b>Guardrail service</b><small>Input · output · action policy</small></div><div><b>Memory</b><small>Case-scoped · TTL · redaction</small></div></div><div className="arch-arrow">↓ signed, schema-validated tool intent</div><div className="arch-lane"><span>Enterprise boundary</span><div><b>Tool gateway</b><small>MCP facade · allow-list</small></div><div><b>Approval service</b><small>Payload hash · expiry</small></div><div><b>Commerce APIs</b><small>Orders · refunds · CRM</small></div></div><div className="arch-arrow">↓ logs, metrics, evidence lineage</div><div className="arch-lane"><span>Control plane</span><div><b>Identity</b><small>Cognito · IAM · KMS</small></div><div><b>Observability</b><small>OpenTelemetry · CloudWatch</small></div><div><b>Evaluation</b><small>Golden set · cohort drift</small></div><div><b>Governance</b><small>Model register · release gates</small></div></div></section>
    <section className="two-col wide-left"><article className="panel"><header className="panel-head"><div><p className="eyebrow">Risk register</p><h2>Controls have owners and residual risk.</h2></div></header><div className="table-wrap"><table><thead><tr><th>ID</th><th>Risk</th><th>Control pattern</th><th>Residual</th><th>Owner</th></tr></thead><tbody>{risks.map(row=><tr key={row.id}><td>{row.id}</td><td><b>{row.risk}</b><small>Inherent: {row.inherent}</small></td><td>{row.control}</td><td><span className={`risk ${row.residual.toLowerCase()}`}>{row.residual}</span></td><td>{row.owner}</td></tr>)}</tbody></table></div></article><article className="panel"><p className="eyebrow">Adversarial suite</p><h2>400 / 400 blocked</h2><p className="body-copy">Prompt injection, data exfiltration, tool override and role spoofing are exercised as deterministic abuse cases.</p><div className="donut" style={{"--value":"100%"} as React.CSSProperties}><span>0<small>bypasses</small></span></div><div className="callout amber-callout"><b>Uncertainty matters</b><span>Zero observed bypasses still implies a 0.75% upper 95% rate under the rule of three.</span></div></article></section>
  </div>;
}

function RoadmapView() {
  return <div className="view-stack"><header className="view-head"><div><p className="eyebrow">Decision and roadmap</p><h1>Fund learning in stages. Scale only on evidence.</h1><p>A 12-week route from confirmed problem to production decision, with accountable gates and explicit stop conditions.</p></div><a className="export-button" href="/api/export/steerco">Export SteerCo brief ↗</a></header>
    <section className="panel roadmap"><div className="roadmap-track">{roadmap.map((item,index)=><article key={item.phase}><span>0{index+1}</span><p>{item.weeks}</p><h2>{item.phase}</h2><div>{item.outcome}</div><small><b>Gate</b>{item.gate}</small></article>)}</div></section>
    <section className="two-col"><article className="panel"><p className="eyebrow">Investment recommendation</p><h2>Approve £190k for a controlled pilot.</h2><ul className="decision-list"><li><b>Scope</b><span>Returns and damaged-item journeys only</span></li><li><b>Cohort</b><span>10 trained colleagues; shadow mode before action mode</span></li><li><b>Authority</b><span>No autonomous refund above £0 in the first release</span></li><li><b>Success</b><span>≥20% handling-time reduction; no material outcome gap</span></li><li><b>Stop</b><span>Any severity-one control breach or vulnerable-cohort harm</span></li></ul></article><article className="panel"><p className="eyebrow">Interview-ready narrative</p><h2>Show judgment, not just software.</h2><ol className="demo-script"><li><span>2 min</span>Frame the decision and stakeholder mandate.</li><li><span>3 min</span>Explain why returns outranked four alternatives.</li><li><span>5 min</span>Run a routine case, approval case and blocked case.</li><li><span>4 min</span>Defend the backtest and financial assumptions.</li><li><span>3 min</span>Walk the target architecture and residual risks.</li><li><span>3 min</span>Ask the panel which gate they would challenge.</li></ol></article></section>
    <section className="cv-card"><p className="eyebrow">Evidence-led CV line</p><blockquote>Built a governed AI transformation workbench and backtested an agent-assisted returns workflow across 5,000 synthetic cases, reducing simulated mean handling time by 37.1% and improving first-contact resolution by 17.7 percentage points, with zero unauthorised writes observed.</blockquote><p>Always retain “synthetic” and “simulated” when using this claim.</p></section>
  </div>;
}

export function NorthstarStudio() {
  const [view, setView] = useState<View>("brief");
  const index = nav.findIndex(item => item.id === view);
  return <main className="shell"><aside className="sidebar"><div className="brand"><span>N</span><div><b>Northstar</b><small>Transformation Studio</small></div></div><div className="client-chip"><span>ACTIVE ENGAGEMENT</span><b>Aster & Row</b><small>Customer resolution</small></div><nav>{nav.map(item=><button key={item.id} className={view===item.id?"active":""} onClick={()=>setView(item.id)}><i>{item.kicker}</i><span>{item.label}</span></button>)}</nav><div className="sidebar-foot"><div><span>Evidence pack</span><b>v1.0 · 04 Sep 2026</b></div><a href="/api/health">System health ↗</a></div></aside><section className="workspace"><header className="topbar"><div><span>Strategy</span><i>/</i><b>{nav[index].label}</b></div><div className="top-actions"><span className="data-status">Synthetic data</span><a href="/api/export/steerco">Export brief</a><span className="avatar">PW</span></div></header><div className="content">{view === "brief" && <BriefView/>}{view === "portfolio" && <PortfolioView/>}{view === "prototype" && <PrototypeView/>}{view === "evidence" && <EvidenceView/>}{view === "architecture" && <ArchitectureView/>}{view === "roadmap" && <RoadmapView/>}</div></section></main>;
}
