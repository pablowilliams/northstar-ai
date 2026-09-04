# Non-functional requirement matrix

| Quality | Requirement | Evidence | Release gate |
|---|---|---|---|
| Safety | No unapproved financial execution | Engine tests, action ledger, alarm | Zero events |
| Accuracy | Policy adherence at least 95% on holdout | Case-level evaluation | Pass overall and priority cohorts |
| Human oversight | Material actions expose exact payload and evidence | UX review and contract test | Named control owner sign-off |
| Performance | P95 recommendation below 3.5 seconds | Load test and traces | Two-hour steady-state pass |
| Availability | 99.9% decision-support availability | SLO dashboard | Error budget policy agreed |
| Resilience | Idempotent actions and tested DLQ replay | Chaos and runbook exercise | Recovery evidence attached |
| Security | Default-deny tools and case-scoped identity | Threat model and penetration test | No open critical finding |
| Privacy | Purpose-limited fields and documented TTL | DPIA and deletion test | DPO approval |
| Accessibility | WCAG 2.2 AA critical flows | Automated and manual test | No critical blocker |
| Observability | 100% material-action trace coverage | Trace reconciliation | Exact denominator match |
| Cost | Per-resolved-case run cost within approved envelope | Cost telemetry | Finance threshold met |
| Portability | Provider adapter and versioned contracts | Architecture test | Alternative provider spike |
