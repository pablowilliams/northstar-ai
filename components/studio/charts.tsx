import { opportunities } from "@/lib/data";

export function ValueTrend() {
  const points =
    "8,118 56,110 104,94 152,99 200,72 248,61 296,42 344,28 392,20";
  return (
    <div
      className="trend-chart"
      role="img"
      aria-label="Cumulative confidence-adjusted value increases across five delivery gates"
    >
      <svg viewBox="0 0 400 138" preserveAspectRatio="none">
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#187255" stopOpacity=".24" />
            <stop offset="1" stopColor="#187255" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[24, 56, 88, 120].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} className="chart-grid" />
        ))}
        <polygon points={`0,138 ${points} 400,138`} fill="url(#area)" />
        <polyline
          points={points}
          fill="none"
          stroke="#187255"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[
          { x: 8, y: 118 },
          { x: 104, y: 94 },
          { x: 200, y: 72 },
          { x: 296, y: 42 },
          { x: 392, y: 20 },
        ].map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#f7f6f1"
            stroke="#187255"
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="chart-axis">
        <span>Discovery</span>
        <span>Design</span>
        <span>Shadow</span>
        <span>Pilot</span>
        <span>Scale gate</span>
      </div>
    </div>
  );
}

export function OpportunityMatrix({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="matrix"
      role="img"
      aria-label="AI opportunities plotted by feasibility and business value"
    >
      <span className="matrix__axis matrix__axis--y">Business value</span>
      <span className="matrix__axis matrix__axis--x">Delivery feasibility</span>
      <span className="matrix__quadrant matrix__quadrant--tl">
        Strategic bets
      </span>
      <span className="matrix__quadrant matrix__quadrant--tr">Prioritise</span>
      <span className="matrix__quadrant matrix__quadrant--bl">Avoid</span>
      <span className="matrix__quadrant matrix__quadrant--br">Quick wins</span>
      {opportunities.map((item, index) => {
        const x = 10 + ((item.feasibility - 1) / 4) * 78;
        const y = 88 - ((item.value - 1) / 4) * 76;
        return (
          <button
            key={item.id}
            className={`matrix__point ${selected === item.id ? "active" : ""}`}
            style={{ left: `${x}%`, top: `${y}%` }}
            onClick={() => onSelect(item.id)}
            aria-label={`${item.title}: score ${item.score}`}
          >
            <i>{index + 1}</i>
            <span>{item.title}</span>
          </button>
        );
      })}
    </div>
  );
}

export function CohortBars({
  rows,
}: {
  rows: Array<{
    segment: string;
    time_reduction_pct: number;
    fcr_uplift_pp: number;
    n: number;
  }>;
}) {
  return (
    <div className="cohort-chart">
      {rows.map((row) => (
        <div className="cohort-row" key={row.segment}>
          <div>
            <b>{row.segment}</b>
            <small>n={row.n.toLocaleString()}</small>
          </div>
          <div className="cohort-bar">
            <i style={{ width: `${(row.time_reduction_pct / 50) * 100}%` }} />
            <span>{row.time_reduction_pct}% time</span>
          </div>
          <div className="cohort-bar cohort-bar--alt">
            <i style={{ width: `${(row.fcr_uplift_pp / 30) * 100}%` }} />
            <span>+{row.fcr_uplift_pp}pp FCR</span>
          </div>
        </div>
      ))}
    </div>
  );
}
