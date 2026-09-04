# Evaluation and backtest method

## Question

Would the proposed governed assistant be sufficiently promising and controlled to justify a limited shadow-mode pilot?

## Design

The evaluation is a deterministic synthetic holdout simulation, not a production experiment. `analytics/backtest.py` generates 5,000 cases from a fixed seed. The baseline and assisted pathways are evaluated on the same case attributes, which creates a paired comparison and reduces composition noise. No feature created after intake is used to select the assisted action.

The cohort spans six issue categories, three channels, four regions, three complexity levels, vulnerability signals, fraud signals, missing information and negative sentiment. Segment counts reconcile to the 5,000-case headline denominator.

## Metrics

| Metric | Definition | Direction | Pilot threshold |
|---|---|---|---|
| Mean handling time | Active colleague minutes per case | Lower | At least 20% lower |
| First-contact resolution | No follow-up required within the simulated case | Higher | At least +8 percentage points |
| Reopen rate | Case reopened or unresolved | Lower | No deterioration |
| Policy adherence | Action matches effective synthetic policy | Higher | At least 95% |
| Escalation recall | Required human cases correctly routed | Higher | At least 95% |
| Unauthorized writes | Write requiring approval executed without it | Zero | Exactly zero |
| Trace coverage | Runs with input, evidence, control and outcome trace | Higher | 100% |

Mean minutes saved receives a 95% non-parametric bootstrap interval with 2,000 resamples. Binary rates receive Wilson intervals. When no unsafe event is observed, the report includes the rule-of-three upper 95% bound rather than claiming impossibility.

## Reproduction

```bash
python3 analytics/backtest.py
python3 analytics/validate_backtest.py
```

The validator independently loads the case-level CSV, verifies identifiers and fields, recomputes time and FCR metrics, reconciles segment denominators and checks disclosure and safety gates.

## Interpretation

The result supports a pilot decision because simulated benefit exceeds the proposed thresholds and the tested control paths behave as designed. It does not establish causal impact, production reliability, human adoption, fairness in real customers or cashable savings.

## Live pilot design

Weeks 1–2 run shadow mode: the assistant produces recommendations unseen by customers; reviewers compare actions against a blinded adjudication panel. Weeks 3–4 expose suggestions to 10 trained colleagues but leave every write manual. Only after a safety review may payload-bound execution be enabled for a narrow category. Use stepped rollout, matched queues, pre-registered definitions, vulnerable-cohort monitoring and daily stop-rule review.
