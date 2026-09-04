# Runbook: retrieval degradation

Trigger when grounded-answer accuracy falls below threshold, a policy source is stale or unsigned, retrieval latency breaches budget, citations mismatch the answer, or a cohort shows a material outcome gap.

Move the affected journey to recommendation-only or human-only mode. Pin the last known good corpus, quarantine changed documents, compare retrieval candidates and effective-date filters, rerun the golden set and priority cohorts, and obtain policy-owner approval before restoring the source bundle.
