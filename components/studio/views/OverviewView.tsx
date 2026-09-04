import {
  Activity,
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  Clock3,
  Database,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { backtest, engagement, roadmap, stakeholders } from "@/lib/data";
import { ValueTrend } from "../charts";
import {
  Badge,
  PageHeader,
  Panel,
  ProgressBar,
  SectionTitle,
  StatCard,
} from "../primitives";

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function OverviewView({
  navigate,
}: {
  navigate: (view: string) => void;
}) {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Executive engagement / Decision workspace"
        title="A credible route from AI ambition to accountable delivery."
        description="One operating view for the sponsor, delivery team and control owners - joining opportunity, architecture, evidence, risk and value."
        actions={
          <>
            <Badge tone="success">
              <Activity size={12} /> Programme on track
            </Badge>
            <button
              className="button button--primary"
              onClick={() => navigate("prototype")}
            >
              Open live proof <ArrowUpRight size={15} />
            </button>
          </>
        }
      />

      <Panel className="decision-hero">
        <div className="decision-hero__copy">
          <span className="decision-hero__label">
            SteerCo decision / 18 September
          </span>
          <h2>{engagement.decision}</h2>
          <p>
            The proof has cleared its internal evidence gate. Funding remains
            conditional on finance validating how capacity becomes realised
            value.
          </p>
          <div className="decision-hero__actions">
            <button
              className="button button--light"
              onClick={() => navigate("roadmap")}
            >
              Review recommendation
            </button>
            <a className="text-link" href="/api/export/steerco">
              Download decision brief <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
        <div className="decision-hero__score">
          <div
            className="score-dial"
            style={
              {
                "--score": `${engagement.evidenceStrength * 3.6}deg`,
              } as React.CSSProperties
            }
          >
            <span>
              <strong>{engagement.evidenceStrength}</strong>
              <small>evidence score</small>
            </span>
          </div>
          <div>
            <b>Decision confidence</b>
            <small>
              Strong enough to pilot. Not enough to claim production value.
            </small>
          </div>
        </div>
      </Panel>

      <div className="stats-grid">
        <StatCard
          icon={Database}
          label="Holdout evaluated"
          value="5,000"
          detail="Fixed-seed synthetic cases"
          delta="Validated"
        />
        <StatCard
          icon={Clock3}
          label="Mean handle time"
          value={`-${backtest.headline.mean_time_reduction_pct}%`}
          detail={`${backtest.headline.baseline_mean_minutes} to ${backtest.headline.assisted_mean_minutes} minutes`}
          delta="7.1 min saved"
        />
        <StatCard
          icon={CheckCircle2}
          label="First-contact resolution"
          value={`+${backtest.headline.fcr_uplift_pp}pp`}
          detail={`${backtest.headline.assisted_fcr_pct}% assisted result`}
          delta="Holdout"
        />
        <StatCard
          icon={Banknote}
          label="Year-one net value"
          value={gbp.format(backtest.business_case.year_one_net_value_gbp)}
          detail="Modelled capacity opportunity"
          delta={`${backtest.business_case.payback_months} mo payback`}
          tone="yellow"
        />
      </div>

      <div className="dashboard-grid dashboard-grid--wide">
        <Panel>
          <SectionTitle
            eyebrow="Benefits confidence"
            title="Value becomes more credible at each gate."
            detail="Confidence-adjusted trajectory, not a revenue forecast."
            action={<Badge tone="info">Base case</Badge>}
          />
          <ValueTrend />
          <div className="chart-legend">
            <span>
              <i className="legend-dot legend-dot--green" />
              Confidence-adjusted value
            </span>
            <b>
              {gbp.format(backtest.business_case.annual_gross_value_gbp)}
              <small>gross annual opportunity</small>
            </b>
          </div>
        </Panel>
        <Panel>
          <SectionTitle
            eyebrow="Programme controls"
            title="Readiness by workstream"
          />
          <div className="readiness-list">
            <div>
              <span>
                <b>Business case</b>
                <small>Finance validation outstanding</small>
              </span>
              <ProgressBar value={82} label="82%" />
            </div>
            <div>
              <span>
                <b>Solution proof</b>
                <small>Holdout and workflow passing</small>
              </span>
              <ProgressBar value={94} label="94%" />
            </div>
            <div>
              <span>
                <b>Security & risk</b>
                <small>Game day still required</small>
              </span>
              <ProgressBar value={78} label="78%" tone="yellow" />
            </div>
            <div>
              <span>
                <b>Operating readiness</b>
                <small>Pilot team nominated</small>
              </span>
              <ProgressBar value={66} label="66%" tone="yellow" />
            </div>
          </div>
        </Panel>
      </div>

      <div className="dashboard-grid dashboard-grid--balanced">
        <Panel>
          <SectionTitle
            eyebrow="Delivery path"
            title="Five gates to a scale decision"
            action={
              <button
                className="link-button"
                onClick={() => navigate("roadmap")}
              >
                Full roadmap <ArrowUpRight size={13} />
              </button>
            }
          />
          <div className="gate-list">
            {roadmap.map((item, index) => (
              <div
                key={item.phase}
                className={index < 2 ? "complete" : index === 2 ? "active" : ""}
              >
                <span>
                  {index < 2 ? <CheckCircle2 size={15} /> : index + 1}
                </span>
                <div>
                  <b>{item.phase}</b>
                  <small>
                    {item.weeks} · {item.gate}
                  </small>
                </div>
                <Badge
                  tone={
                    index < 2 ? "success" : index === 2 ? "warning" : "neutral"
                  }
                >
                  {index < 2
                    ? "Complete"
                    : index === 2
                      ? "In progress"
                      : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <SectionTitle
            eyebrow="Governance"
            title="Accountability is visible"
            action={<ShieldCheck size={19} color="#187255" />}
          />
          <div className="owner-list">
            {stakeholders.slice(0, 4).map((item, index) => (
              <div key={item.role}>
                <span className={`owner-avatar owner-avatar--${index + 1}`}>
                  {item.role
                    .split(" ")
                    .map((x) => x[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <span>
                  <b>{item.role}</b>
                  <small>{item.commitment}</small>
                </span>
                <Badge tone={index === 0 ? "success" : "neutral"}>
                  {item.posture}
                </Badge>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="insight-panel">
          <Sparkles size={20} />
          <span>Principal insight</span>
          <h2>
            The highest-value design choice is not the model. It is the
            separation between recommendation, proposal and execution.
          </h2>
          <button
            className="link-button link-button--light"
            onClick={() => navigate("architecture")}
          >
            Inspect the control boundary <ArrowUpRight size={13} />
          </button>
        </Panel>
      </div>
    </div>
  );
}
