# CV evidence ledger

## Safe headline

Built a governed AI transformation workbench and backtested an agent-assisted returns workflow across 5,000 synthetic cases, reducing simulated mean handling time by 37.1% and improving first-contact resolution by 17.7 percentage points, with zero unauthorised writes observed.

## Evidence map

| Claim | Artifact | Reproduce | Boundary |
|---|---|---|---|
| 5,000 cases | `data/synthetic_cases.csv` | Count unique `case_id` | Synthetic records |
| 37.1% mean-time reduction | `data/backtest-results.json` | `python3 analytics/validate_backtest.py` | Simulated baseline/intervention |
| +17.7pp FCR | Same | Validator recomputes both rates | Not a live experiment |
| 0 unauthorised writes | Case CSV and engine tests | Validator and `npm test` | Upper 95% bound is 0.06% |
| 400/400 attacks blocked | `data/red-team-results.json` | Re-run backtest | Deterministic known attacks |
| £449,825 year-one net value | Benefits model | Change UI assumptions | Capacity opportunity, not booked saving |
| 3.6-month payback | Benefits model | Cost divided by gross monthly value | Assumption-sensitive |

## Interview answer

“The headline numbers are not client outcomes. I created a fixed synthetic holdout to demonstrate how I would pre-register metrics, compare a bounded agent with a baseline, inspect cohorts and quantify uncertainty before a pilot. The point is the evaluation discipline. In production I would validate the baseline with finance, run shadow mode, and retain the word ‘simulated’ until a controlled pilot produced observed outcomes.”
