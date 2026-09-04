# System card: Returns Resolution Copilot

## Intended use

Assist trained UK customer-service colleagues with policy retrieval, next-best-action recommendations, drafts and tightly controlled returns actions. The system is decision support, not a customer-facing autonomous adjudicator.

## Out of scope

Fully automated refusal; identity decisions; fraud adjudication; legal advice; warranty decisions without specialist review; actions for vulnerable customers without a human route; refunds above the configured threshold without exact-payload approval.

## Components

Case intake, risk classifier, dated policy retrieval, orchestration state machine, tool-policy engine, approval service, commerce gateway, response composer, evaluator and trace exporter. The local proof replaces model inference with deterministic rules to remain inspectable and runnable without secrets.

## Data

All bundled cases and policies are synthetic. A live system would minimise customer data, separate identifiers from evaluation extracts, define retention by purpose, document lawful basis and complete a DPIA before pilot.

## Known limitations

Synthetic distributions cannot represent the full diversity of real language, accessibility needs, fraud tactics or operational exceptions. Confidence scores are illustrative. Deterministic safety tests cannot predict novel attacks. Policy retrieval quality will degrade if document ownership and effective-date metadata are weak.

## Human oversight

The interface shows the recommendation, rationale, evidence, confidence, control trace and exact proposed action. Reviewers can reject, edit by initiating a new proposal, or escalate. Approval is not transferable to a modified payload.

## Monitoring

Monitor handling time, FCR, reopen rate, policy adherence, override rate, escalation recall, unsafe-write attempts, retrieval misses, cohort outcome gaps, latency, model cost and colleague satisfaction. Any severity-one control breach activates the write kill switch and incident process.
