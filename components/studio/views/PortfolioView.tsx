"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CircleDollarSign,
  Clock3,
  Scale,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import { opportunities } from "@/lib/data";
import { OpportunityMatrix } from "../charts";
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

export function PortfolioView({
  navigate,
}: {
  navigate: (view: string) => void;
}) {
  const [selectedId, setSelectedId] = useState("returns");
  const [weights, setWeights] = useState({
    value: 32,
    feasibility: 26,
    evidence: 22,
    risk: 20,
  });
  const selected =
    opportunities.find((item) => item.id === selectedId) ?? opportunities[0];
  const ranked = useMemo(
    () =>
      opportunities
        .map((item) => ({
          ...item,
          workshopScore: Math.round(
            ((item.value * weights.value +
              item.feasibility * weights.feasibility +
              item.evidence * weights.evidence +
              (6 - item.risk) * weights.risk) /
              (Object.values(weights).reduce((a, b) => a + b, 0) * 5)) *
              100,
          ),
        }))
        .sort((a, b) => b.workshopScore - a.workshopScore),
    [weights],
  );
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Opportunity intelligence / Portfolio 01"
        title="Choose where AI earns the right to scale."
        description="A transparent, challengeable portfolio that weighs business value against delivery reality, evidence strength and controllable risk."
        actions={
          <Badge tone="info">
            <Target size={12} /> 5 opportunities assessed
          </Badge>
        }
      />
      <div className="portfolio-layout">
        <Panel className="matrix-panel">
          <SectionTitle
            eyebrow="Decision matrix"
            title="Value × feasibility"
            detail="Select a point to inspect the case."
          />
          <OpportunityMatrix selected={selectedId} onSelect={setSelectedId} />
        </Panel>
        <Panel className="opportunity-detail">
          <div className="opportunity-detail__head">
            <IconBadge icon={BriefcaseBusiness} />
            <Badge
              tone={
                selected.recommendation === "Accelerate"
                  ? "success"
                  : selected.recommendation === "Incubate"
                    ? "warning"
                    : "neutral"
              }
            >
              {selected.recommendation}
            </Badge>
          </div>
          <p className="eyebrow">Selected opportunity</p>
          <h2>{selected.title}</h2>
          <p>{selected.problem}</p>
          <div className="score-strip">
            <div>
              <strong>{selected.score}</strong>
              <span>approved score</span>
            </div>
            <div>
              <strong>{selected.effortWeeks}</strong>
              <span>delivery weeks</span>
            </div>
            <div>
              <strong>{gbp.format(selected.annualValueGbp)}</strong>
              <span>annual opportunity</span>
            </div>
          </div>
          <dl className="decision-factors">
            <div>
              <dt>Value</dt>
              <dd>{selected.value}/5</dd>
            </div>
            <div>
              <dt>Feasibility</dt>
              <dd>{selected.feasibility}/5</dd>
            </div>
            <div>
              <dt>Evidence</dt>
              <dd>{selected.evidence}/5</dd>
            </div>
            <div>
              <dt>Risk</dt>
              <dd>{selected.risk}/5</dd>
            </div>
          </dl>
          {selected.id === "returns" ? (
            <button
              className="button button--primary button--full"
              onClick={() => navigate("prototype")}
            >
              Open controlled prototype <ArrowRight size={15} />
            </button>
          ) : (
            <div className="opportunity-note">
              <Scale size={16} />
              <span>
                Retain in portfolio; gather missing evidence before build
                funding.
              </span>
            </div>
          )}
        </Panel>
      </div>
      <Panel>
        <SectionTitle
          eyebrow="Workshop sensitivity"
          title="Change the emphasis. Preserve the audit trail."
          detail="These controls explore stakeholder priorities. They do not overwrite the approved 32/26/22/20 score."
          action={
            <Badge tone="warning">
              <SlidersHorizontal size={12} /> Scenario only
            </Badge>
          }
        />
        <div className="weight-grid">
          {Object.entries(weights).map(([key, value]) => (
            <label key={key}>
              <span>
                <b>{key}</b>
                <em>{value}%</em>
              </span>
              <input
                type="range"
                min="10"
                max="45"
                value={value}
                onChange={(e) =>
                  setWeights({ ...weights, [key]: Number(e.target.value) })
                }
              />
            </label>
          ))}
        </div>
        <div className="ranking-table">
          <div className="ranking-table__head">
            <span>Rank</span>
            <span>Opportunity</span>
            <span>Function</span>
            <span>Workshop score</span>
            <span>Approved</span>
            <span>Decision</span>
          </div>
          {ranked.map((item, index) => (
            <button
              key={item.id}
              className={selectedId === item.id ? "active" : ""}
              onClick={() => setSelectedId(item.id)}
            >
              <span>0{index + 1}</span>
              <span>
                <b>{item.title}</b>
                <small>{item.problem}</small>
              </span>
              <span>{item.function}</span>
              <span>
                <i style={{ width: `${item.workshopScore}%` }} />
                <b>{item.workshopScore}</b>
              </span>
              <span>{item.score}</span>
              <span>
                <Badge
                  tone={
                    item.recommendation === "Accelerate"
                      ? "success"
                      : item.recommendation === "Incubate"
                        ? "warning"
                        : "neutral"
                  }
                >
                  {item.recommendation}
                </Badge>
              </span>
            </button>
          ))}
        </div>
      </Panel>
      <div className="portfolio-callouts">
        <article>
          <IconBadge icon={CircleDollarSign} tone="yellow" />
          <div>
            <span>Highest theoretical value</span>
            <b>Promotion optimiser</b>
            <p>
              Do not fund yet: evidence is weak and margin risk is difficult to
              reverse.
            </p>
          </div>
        </article>
        <article>
          <IconBadge icon={Clock3} />
          <div>
            <span>Fastest credible proof</span>
            <b>Returns resolution</b>
            <p>
              Frequent workflow, dated policy evidence and bounded enterprise
              actions.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
