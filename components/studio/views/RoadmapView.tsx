import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Download,
  Flag,
  ShieldAlert,
  UsersRound,
} from "lucide-react";
import { backtest, roadmap } from "@/lib/data";
import {
  Badge,
  IconBadge,
  PageHeader,
  Panel,
  SectionTitle,
} from "../primitives";

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});
export function RoadmapView() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Decision & mobilisation / Plan 01"
        title="Fund learning in stages. Scale only on evidence."
        description="A 12-week route from confirmed problem to production decision, with accountable gates, reversible scope and explicit stop conditions."
        actions={
          <a href="/api/export/steerco" className="button button--primary">
            <Download size={14} /> Export SteerCo brief
          </a>
        }
      />
      <Panel className="recommendation-card">
        <div>
          <Badge tone="success">
            <CheckCircle2 size={12} /> Recommended for approval
          </Badge>
          <h2>Approve a controlled 12-week pilot.</h2>
          <p>
            Returns and damaged-item journeys only. Shadow mode before action
            mode. No autonomous financial write in the initial release.
          </p>
        </div>
        <div className="investment">
          <span>Funding ask</span>
          <strong>
            {gbp.format(backtest.business_case.year_one_platform_cost_gbp)}
          </strong>
          <small>3.6-month modelled payback</small>
        </div>
      </Panel>
      <Panel>
        <SectionTitle
          eyebrow="Integrated roadmap"
          title="Five phases. Five evidence gates."
          detail="A phase completes only when its decision evidence is accepted - not when the calendar ends."
        />
        <div className="timeline">
          {roadmap.map((item, index) => (
            <article
              key={item.phase}
              className={index < 2 ? "complete" : index === 2 ? "active" : ""}
            >
              <header>
                <span>
                  {index < 2 ? <CheckCircle2 size={14} /> : index + 1}
                </span>
                <small>{item.weeks}</small>
              </header>
              <h3>{item.phase}</h3>
              <p>{item.outcome}</p>
              <footer>
                <Flag size={12} />
                <span>
                  <b>Exit gate</b>
                  {item.gate}
                </span>
              </footer>
            </article>
          ))}
        </div>
      </Panel>
      <div className="roadmap-grid">
        <Panel>
          <SectionTitle
            eyebrow="Pilot contract"
            title="Scope, success and stop"
          />
          <div className="contract-list">
            <div>
              <IconBadge icon={UsersRound} />
              <span>
                <b>Cohort</b>
                <small>
                  10 trained colleagues; matched queue; daily review
                </small>
              </span>
            </div>
            <div>
              <IconBadge icon={CalendarClock} />
              <span>
                <b>Success</b>
                <small>
                  &gt;=20% handle-time reduction and &gt;=8pp FCR uplift
                </small>
              </span>
            </div>
            <div>
              <IconBadge icon={ShieldAlert} tone="red" />
              <span>
                <b>Stop condition</b>
                <small>
                  Any severity-one control breach or vulnerable-cohort harm
                </small>
              </span>
            </div>
            <div>
              <IconBadge icon={CircleDollarSign} tone="yellow" />
              <span>
                <b>Benefit gate</b>
                <small>
                  Finance agrees capacity conversion before scale funding
                </small>
              </span>
            </div>
          </div>
        </Panel>
        <Panel>
          <SectionTitle
            eyebrow="Twenty-minute interview"
            title="A decision story, not a feature tour"
          />
          <ol className="interview-timeline">
            <li>
              <span>02 min</span>
              <div>
                <b>Frame the mandate</b>
                <small>Decision, sponsor and claim boundary</small>
              </div>
            </li>
            <li>
              <span>03 min</span>
              <div>
                <b>Defend prioritisation</b>
                <small>Why returns beat four alternatives</small>
              </div>
            </li>
            <li>
              <span>06 min</span>
              <div>
                <b>Run three cases</b>
                <small>Routine, approval and blocked paths</small>
              </div>
            </li>
            <li>
              <span>05 min</span>
              <div>
                <b>Challenge the evidence</b>
                <small>Backtest, segments and economics</small>
              </div>
            </li>
            <li>
              <span>04 min</span>
              <div>
                <b>Close on judgment</b>
                <small>Architecture trade-offs and next gate</small>
              </div>
            </li>
          </ol>
        </Panel>
      </div>
      <Panel className="cv-proof">
        <div>
          <span>CV evidence line</span>
          <p>
            Built and backtested a governed agent-assisted returns platform
            across 5,000 synthetic cases, reducing simulated mean handling time
            by 37.1% and improving first-contact resolution by 17.7 percentage
            points, with zero unauthorised writes observed.
          </p>
          <small>
            Retain “synthetic” and “simulated” whenever this claim is used.
          </small>
        </div>
        <a href="/api/export/steerco">
          Open evidence pack <ArrowUpRight size={14} />
        </a>
      </Panel>
    </div>
  );
}
