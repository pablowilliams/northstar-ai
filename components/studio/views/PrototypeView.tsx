"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  DatabaseZap,
  FileCheck2,
  Fingerprint,
  LockKeyhole,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cases } from "@/lib/data";
import type { CustomerCase, WorkflowRun } from "@/lib/types";
import { Badge, PageHeader, Panel, Skeleton } from "../primitives";

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function PrototypeView() {
  const [selected, setSelected] = useState<CustomerCase>(cases[0]);
  const [run, setRun] = useState<WorkflowRun | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function execute() {
    setLoading(true);
    setRun(null);
    setNotice(null);
    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ caseId: selected.id }),
      });
      if (!response.ok) throw new Error("Workflow service rejected the case");
      setRun(await response.json());
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Workflow failed");
    } finally {
      setLoading(false);
    }
  }
  async function approve() {
    if (!run?.proposedAction) return;
    const response = await fetch("/api/approvals", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        runId: run.runId,
        payloadHash: run.proposedAction.payloadHash,
      }),
    });
    const body = await response.json();
    if (!response.ok) {
      setNotice(body.error ?? "Approval rejected");
      return;
    }
    setRun(body);
    setNotice("The exact simulated payload was approved and executed.");
  }
  function choose(item: CustomerCase) {
    setSelected(item);
    setRun(null);
    setNotice(null);
  }
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Agent operations / Governed workflow"
        title="Prove the useful path. Expose the dangerous one."
        description="A fully inspectable case workflow with dated evidence, explicit state transitions, bounded tools and payload-level human approval."
        actions={
          <>
            <Badge tone="warning">
              <LockKeyhole size={12} /> Simulation · no live writes
            </Badge>
            <button
              className="button button--secondary"
              onClick={() => {
                setRun(null);
                setNotice(null);
              }}
            >
              <RotateCcw size={14} /> Reset
            </button>
          </>
        }
      />
      <div className="prototype-shell">
        <Panel className="case-rail">
          <div className="case-rail__head">
            <div>
              <span>Evaluation queue</span>
              <b>{cases.length} curated cases</b>
            </div>
            <Badge tone="neutral">Synthetic</Badge>
          </div>
          <div className="case-filter">
            <Sparkles size={14} />
            <span>Edge cases included</span>
          </div>
          <div className="case-rail__list">
            {cases.map((item) => (
              <button
                key={item.id}
                className={selected.id === item.id ? "active" : ""}
                onClick={() => choose(item)}
              >
                <div>
                  <span>{item.id}</span>
                  <Badge
                    tone={
                      item.fraudSignal
                        ? "danger"
                        : item.vulnerable
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {item.complexity}
                  </Badge>
                </div>
                <b>{item.category}</b>
                <small>
                  {item.customer} · {gbp.format(item.orderValue)}
                </small>
              </button>
            ))}
          </div>
        </Panel>
        <div className="prototype-main">
          <Panel className="case-workspace">
            <header className="case-workspace__head">
              <div className="customer-title">
                <span className="customer-avatar">
                  {selected.customer
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </span>
                <div>
                  <p>
                    {selected.id} · {selected.channel}
                  </p>
                  <h2>{selected.customer}</h2>
                </div>
              </div>
              <div className="case-badges">
                {selected.vulnerable && (
                  <Badge tone="warning">
                    <CircleUserRound size={12} /> Vulnerability signal
                  </Badge>
                )}
                {selected.fraudSignal && (
                  <Badge tone="danger">
                    <ShieldAlert size={12} /> Fraud signal
                  </Badge>
                )}
                <Badge>{selected.sentiment}</Badge>
              </div>
            </header>
            <div className="message-card">
              <span>Customer message</span>
              <p>“{selected.message}”</p>
            </div>
            <div className="case-metadata">
              <div>
                <span>Order value</span>
                <b>{gbp.format(selected.orderValue)}</b>
              </div>
              <div>
                <span>Purchased</span>
                <b>{selected.daysSincePurchase} days ago</b>
              </div>
              <div>
                <span>Issue</span>
                <b>{selected.category}</b>
              </div>
              <div>
                <span>Expected control path</span>
                <b>{selected.expectedAction}</b>
              </div>
            </div>
            <button className="run-button" onClick={execute} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" /> Running policy and safety
                  controls
                </>
              ) : (
                <>
                  <span>
                    <Play size={15} fill="currentColor" /> Run governed workflow
                  </span>
                  <small>
                    Uses synthetic evidence only <ArrowRight size={13} />
                  </small>
                </>
              )}
            </button>
          </Panel>
          {notice && (
            <div
              className={`toast-inline ${run?.status === "completed" ? "success" : "warning"}`}
              role="status"
            >
              {run?.status === "completed" ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}
              <span>{notice}</span>
            </div>
          )}
          {loading && (
            <Panel>
              <Skeleton lines={5} />
            </Panel>
          )}
          {run && !loading && (
            <Panel className="run-console">
              <header className="run-console__head">
                <div>
                  <Badge
                    tone={
                      run.status === "blocked"
                        ? "danger"
                        : run.status === "completed"
                          ? "success"
                          : run.status === "awaiting_approval"
                            ? "warning"
                            : "info"
                    }
                  >
                    {run.status.replaceAll("_", " ")}
                  </Badge>
                  <h2>{run.recommendation}</h2>
                  <p>{run.rationale}</p>
                </div>
                <div className="confidence">
                  <strong>{Math.round(run.confidence * 100)}</strong>
                  <span>%</span>
                  <small>confidence</small>
                </div>
              </header>
              <div className="run-grid">
                <div className="trace-panel">
                  <div className="subhead">
                    <span>
                      <DatabaseZap size={15} /> Execution trace
                    </span>
                    <small>
                      {run.trace.reduce((sum, x) => sum + x.latencyMs, 0)} ms
                      total
                    </small>
                  </div>
                  {run.trace.map((step, index) => (
                    <div
                      className={`trace-row trace-row--${step.status}`}
                      key={step.id}
                    >
                      <div className="trace-rail">
                        <i>
                          {step.status === "passed" ? (
                            <Check size={11} />
                          ) : step.status === "blocked" ? (
                            <AlertTriangle size={11} />
                          ) : (
                            index + 1
                          )}
                        </i>
                        {index < run.trace.length - 1 && <span />}
                      </div>
                      <div>
                        <b>{step.label}</b>
                        <small>{step.detail}</small>
                      </div>
                      <em>{step.latencyMs}ms</em>
                    </div>
                  ))}
                </div>
                <div className="evidence-panel">
                  <div className="subhead">
                    <span>
                      <FileCheck2 size={15} /> Grounding evidence
                    </span>
                    <small>{run.evidence.length} sources</small>
                  </div>
                  {run.evidence.map((item) => (
                    <details key={item.id} open>
                      <summary>
                        <div>
                          <b>{item.id}</b>
                          <span>{item.title}</span>
                        </div>
                        <span>
                          {Math.round(item.confidence * 100)}%{" "}
                          <ChevronDown size={13} />
                        </span>
                      </summary>
                      <p>{item.excerpt}</p>
                      <footer>
                        {item.section}
                        <span />
                        Effective {item.effectiveFrom}
                      </footer>
                    </details>
                  ))}
                </div>
              </div>
              <div className="control-footer">
                <div>
                  <ShieldCheck size={17} />
                  <span>
                    <b>Controls applied</b>
                    <small>{run.controls.join(" · ")}</small>
                  </span>
                </div>
                <span className="trace-id">
                  <Fingerprint size={13} /> {run.runId}
                </span>
              </div>
              {run.status === "awaiting_approval" && run.proposedAction && (
                <div className="approval-card">
                  <div className="approval-card__icon">
                    <LockKeyhole size={20} />
                  </div>
                  <div>
                    <span>Exact-payload approval required</span>
                    <h3>{run.proposedAction.tool}</h3>
                    <p>
                      {gbp.format(run.proposedAction.amountGbp)} · hash{" "}
                      <code>{run.proposedAction.payloadHash}</code>
                    </p>
                  </div>
                  <button className="button button--primary" onClick={approve}>
                    Approve & execute <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
