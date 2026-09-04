import {
  Activity,
  Braces,
  CheckCircle2,
  Cloud,
  Database,
  Fingerprint,
  GitBranch,
  KeyRound,
  LockKeyhole,
  Network,
  RadioTower,
  RotateCcw,
  Shield,
  ShieldAlert,
  Workflow,
  Zap,
} from "lucide-react";
import { risks } from "@/lib/data";
import { Badge, PageHeader, Panel, SectionTitle } from "../primitives";

const nodes = [
  {
    lane: "Experience",
    items: [
      {
        name: "Colleague workspace",
        detail: "Next.js · WCAG 2.2",
        icon: Braces,
      },
      {
        name: "Decision cockpit",
        detail: "Value · evidence · risk",
        icon: Activity,
      },
    ],
  },
  {
    lane: "Agent platform",
    items: [
      {
        name: "Orchestrator",
        detail: "Explicit state machine",
        icon: Workflow,
      },
      {
        name: "Knowledge service",
        detail: "Hybrid retrieval · lineage",
        icon: Database,
      },
      {
        name: "Guardrail service",
        detail: "Input · output · action",
        icon: Shield,
      },
      {
        name: "Case memory",
        detail: "Scoped · redacted · TTL",
        icon: RotateCcw,
      },
    ],
  },
  {
    lane: "Enterprise boundary",
    items: [
      { name: "MCP gateway", detail: "Schema · allow-list", icon: Network },
      {
        name: "Approval service",
        detail: "Hash · expiry · nonce",
        icon: LockKeyhole,
      },
      { name: "Commerce APIs", detail: "Orders · CRM · refund", icon: Zap },
    ],
  },
  {
    lane: "Control plane",
    items: [
      { name: "Identity", detail: "Cognito · IAM · KMS", icon: Fingerprint },
      { name: "Observability", detail: "OTel · CloudWatch", icon: RadioTower },
      { name: "Evaluation", detail: "Golden set · cohorts", icon: GitBranch },
      { name: "Governance", detail: "Registry · release gate", icon: KeyRound },
    ],
  },
];
export function ArchitectureView() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Architecture / Target state"
        title="Bounded agency on an observable platform."
        description="The model may retrieve, reason and propose. Material consequences cross a separately owned, policy-enforced execution boundary."
        actions={
          <>
            <Badge tone="info">
              <Cloud size={12} /> AWS target
            </Badge>
            <Badge tone="success">
              <CheckCircle2 size={12} /> Local proof operational
            </Badge>
          </>
        }
      />
      <Panel className="architecture-panel">
        <SectionTitle
          eyebrow="Logical architecture"
          title="Four layers. Three trust boundaries. One trace."
          detail="Every state transition has an owner, timeout, control decision and evidence record."
        />
        <div className="architecture-canvas">
          {nodes.map((lane, index) => (
            <div key={lane.lane} className="architecture-lane">
              <div className="architecture-lane__label">
                <span>0{index + 1}</span>
                <b>{lane.lane}</b>
              </div>
              <div className="architecture-nodes">
                {lane.items.map(({ name, detail, icon: Icon }) => (
                  <article key={name}>
                    <Icon size={17} />
                    <div>
                      <b>{name}</b>
                      <small>{detail}</small>
                    </div>
                  </article>
                ))}
              </div>
              {index < nodes.length - 1 && (
                <div className="boundary">
                  <span>
                    {index === 0
                      ? "Authenticated request + trace context"
                      : index === 1
                        ? "Signed, schema-validated tool intent"
                        : "Events + evidence lineage"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>
      <div className="architecture-grid">
        <Panel>
          <SectionTitle
            eyebrow="Residual risk"
            title="Controls have owners"
            action={<ShieldAlert size={18} color="#b04a3f" />}
          />
          <div className="risk-table">
            <div>
              <span>ID</span>
              <span>Risk</span>
              <span>Control pattern</span>
              <span>Residual</span>
            </div>
            {risks.map((item) => (
              <div key={item.id}>
                <span>{item.id}</span>
                <span>
                  <b>{item.risk}</b>
                  <small>{item.owner}</small>
                </span>
                <span>{item.control}</span>
                <span>
                  <Badge tone={item.residual === "Low" ? "success" : "warning"}>
                    {item.residual}
                  </Badge>
                </span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="security-card">
          <div className="security-card__icon">
            <Shield size={30} />
          </div>
          <p className="eyebrow">Adversarial evidence</p>
          <h2>400 / 400</h2>
          <p>
            Known attacks blocked across prompt injection, data exfiltration,
            tool override and role spoofing.
          </p>
          <div className="security-meter">
            <i />
            <span>0 observed bypasses</span>
          </div>
          <div className="upper-bound">
            <b>0.75%</b>
            <span>upper 95% bypass rate</span>
          </div>
          <small>
            Zero observed events is evidence of tested controls, not proof
            against novel threats.
          </small>
        </Panel>
      </div>
      <div className="architecture-principles">
        <article>
          <Shield size={18} />
          <b>Default deny</b>
          <span>No arbitrary tool or network access</span>
        </article>
        <article>
          <Fingerprint size={18} />
          <b>Purpose-bound identity</b>
          <span>User, case and action scope propagate</span>
        </article>
        <article>
          <LockKeyhole size={18} />
          <b>Exact approval</b>
          <span>Any payload change invalidates consent</span>
        </article>
        <article>
          <RadioTower size={18} />
          <b>Observable consequence</b>
          <span>100% action trace coverage</span>
        </article>
      </div>
    </div>
  );
}
