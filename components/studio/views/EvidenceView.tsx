"use client";

import { useMemo, useState } from "react";
import {
  BadgePoundSterling,
  Beaker,
  CheckCircle2,
  CircleAlert,
  Gauge,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { backtest } from "@/lib/data";
import { calculateBusinessCase } from "@/lib/scoring";
import { CohortBars } from "../charts";
import {
  Badge,
  PageHeader,
  Panel,
  SectionTitle,
  StatCard,
} from "../primitives";

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});
export function EvidenceView() {
  const [cases, setCases] = useState(120000),
    [hourly, setHourly] = useState(32),
    [cost, setCost] = useState(190000);
  const model = useMemo(
    () =>
      calculateBusinessCase({
        annualCases: cases,
        minutesSaved: backtest.headline.mean_minutes_saved,
        hourlyCost: hourly,
        repeatContactsAvoided:
          (cases * backtest.headline.reopen_reduction_pp) / 100,
        contactCost: 7.8,
        yearOneCost: cost,
      }),
    [cases, hourly, cost],
  );
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Evidence lab / Backtest 01"
        title="Make every number inspectable."
        description="Case-level evidence, uncertainty, cohort performance and commercial assumptions remain visible - including the reasons not to overclaim."
        actions={
          <Badge tone="success">
            <CheckCircle2 size={12} /> Independent validator passed
          </Badge>
        }
      />
      <div className="stats-grid">
        <StatCard
          icon={TrendingDown}
          label="Mean time reduction"
          value={`${backtest.headline.mean_time_reduction_pct}%`}
          detail={`${backtest.headline.mean_minutes_saved_95ci[0]}-${backtest.headline.mean_minutes_saved_95ci[1]} min 95% CI`}
          delta="Paired holdout"
        />
        <StatCard
          icon={TrendingUp}
          label="FCR uplift"
          value={`+${backtest.headline.fcr_uplift_pp}pp`}
          detail={`${backtest.headline.baseline_fcr_pct}% to ${backtest.headline.assisted_fcr_pct}%`}
          delta="5,000 cases"
        />
        <StatCard
          icon={ShieldCheck}
          label="Policy adherence"
          value={`${backtest.headline.assisted_policy_adherence_pct}%`}
          detail={`${(backtest.uncertainty.assisted_policy_95ci[0] * 100).toFixed(1)}-${(backtest.uncertainty.assisted_policy_95ci[1] * 100).toFixed(1)}% 95% CI`}
          delta="Validated"
        />
        <StatCard
          icon={CircleAlert}
          label="Unsafe writes"
          value="0 / 5,000"
          detail={`${backtest.uncertainty.zero_unsafe_write_upper_95_pct}% upper 95% bound`}
          delta="Not impossible"
          tone="yellow"
        />
      </div>
      <div className="evidence-grid">
        <Panel>
          <SectionTitle
            eyebrow="Cohort evidence"
            title="Benefit persists as complexity rises"
            detail="Time reduction and FCR uplift by pre-defined complexity cohort."
            action={
              <Badge tone="info">
                <Beaker size={12} /> Fixed seed 42026
              </Badge>
            }
          />
          <CohortBars rows={backtest.segments.complexity} />
          <div className="evidence-key">
            <span>
              <i />
              Handling-time reduction
            </span>
            <span>
              <i />
              FCR uplift
            </span>
          </div>
        </Panel>
        <Panel className="scenario-panel">
          <SectionTitle
            eyebrow="Commercial model"
            title="Change the assumptions"
            detail="The model recalculates instantly; the evidence does not."
          />
          <label>
            <span>
              Annual cases <b>{cases.toLocaleString()}</b>
            </span>
            <input
              type="range"
              min="40000"
              max="240000"
              step="5000"
              value={cases}
              onChange={(e) => setCases(Number(e.target.value))}
            />
          </label>
          <label>
            <span>
              Loaded hourly cost <b>£{hourly}</b>
            </span>
            <input
              type="range"
              min="20"
              max="55"
              value={hourly}
              onChange={(e) => setHourly(Number(e.target.value))}
            />
          </label>
          <label>
            <span>
              Year-one platform cost <b>{gbp.format(cost)}</b>
            </span>
            <input
              type="range"
              min="100000"
              max="400000"
              step="10000"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
            />
          </label>
          <div className="scenario-results">
            <div>
              <BadgePoundSterling size={17} />
              <span>
                Gross value<b>{gbp.format(model.grossValue)}</b>
              </span>
            </div>
            <div>
              <Gauge size={17} />
              <span>
                Payback<b>{model.paybackMonths.toFixed(1)} months</b>
              </span>
            </div>
            <div>
              <TrendingUp size={17} />
              <span>
                Year-one net<b>{gbp.format(model.netValue)}</b>
              </span>
            </div>
          </div>
        </Panel>
      </div>
      <Panel className="method-panel">
        <SectionTitle
          eyebrow="Evaluation integrity"
          title="A claim ledger, not a victory lap"
        />
        <div className="method-grid">
          <article>
            <span>01</span>
            <b>Paired holdout</b>
            <p>
              The same 5,000 cases run through baseline and assisted pathways
              using intake-available fields.
            </p>
          </article>
          <article>
            <span>02</span>
            <b>Uncertainty reported</b>
            <p>
              2,000 bootstrap resamples for mean differences; Wilson intervals
              for binary rates.
            </p>
          </article>
          <article>
            <span>03</span>
            <b>Segments reconcile</b>
            <p>
              Complexity, channel, category and vulnerability cohorts each sum
              to the headline denominator.
            </p>
          </article>
          <article>
            <span>04</span>
            <b>Independent validation</b>
            <p>
              A separate script reloads case rows and recalculates each headline
              claim.
            </p>
          </article>
        </div>
      </Panel>
      <div className="claim-boundary">
        <CircleAlert size={20} />
        <div>
          <b>Claim boundary</b>
          <p>
            {backtest.metadata.claim_boundary} Annualised value is capacity
            opportunity, not guaranteed cashable savings.
          </p>
        </div>
      </div>
    </div>
  );
}
