# Architecture

## Decision context

Northstar demonstrates two products: a consulting decision workbench and a governed returns-resolution assistant. The local implementation is intentionally deterministic and zero-cost. The target state maps the same domain contracts to AWS-managed services.

## Runtime sequence

1. The authenticated colleague opens a case. The experience service attaches role, purpose and trace context.
2. Intake classifies the case but treats every customer message and retrieved passage as untrusted data.
3. The orchestrator retrieves only effective, audience-approved policy passages and records evidence IDs.
4. Action policy evaluates vulnerability, fraud signals, amount, action type and confidence.
5. The assistant produces a recommendation and, where permitted, a non-executable tool proposal.
6. Material actions cross the tool gateway. The approval service binds a named approver, payload hash, expiry and single-use nonce.
7. Execution accepts only the unchanged payload and emits an immutable audit event.
8. Evaluation, cost, latency, control outcomes and cohort outcomes flow to the observability plane.

## Trust boundaries

- Browser to API: OIDC identity, CSRF control, schema validation and rate limiting.
- Orchestrator to evidence: retrieved content is labelled data; instructions embedded in content are ignored.
- Agent to tools: default deny, narrow schemas, per-tool identity and no arbitrary network access.
- Proposal to execution: a change in action, amount, recipient or evidence invalidates approval.
- Application to observability: redact personal data before logging; retain evidence references and hashes.

## Target AWS mapping

| Capability | Primary service | Design note |
|---|---|---|
| Edge | CloudFront, WAF, API Gateway | Managed rules, throttling and request IDs |
| Identity | Cognito federated to enterprise IdP | Role and attribute-based authorisation |
| Orchestration | Step Functions and Lambda | Explicit states, retries, timeouts and compensation |
| Foundation model | Bedrock | Approved model allow-list and regional processing |
| Retrieval | S3, OpenSearch or Aurora pgvector | Version, effective date and audience metadata |
| Memory | DynamoDB | Case scope, TTL and deletion policy |
| Tools | Private API Gateway and Lambda | MCP-compatible facade over enterprise APIs |
| Approval | DynamoDB and KMS-signed token | Payload-bound, expiring, single-use approval |
| Events | EventBridge and SQS | Decoupled writes, replay and DLQ |
| Observability | OpenTelemetry, CloudWatch, X-Ray | Trace across prompt, retrieval and action |
| Evidence | Versioned S3 with KMS | Immutable release and evaluation artifacts |

## Failure behaviour

The safe default is recommendation-only mode. Retrieval failure, stale policy, identity failure, tool timeout, approval mismatch, anomalous cohort outcomes or an unsafe-write alarm disables execution while preserving read-only assistance. Idempotency keys prevent duplicate refunds. Retries exclude validation and policy failures.

## Non-functional targets

- P95 read-only recommendation under 3.5 seconds; P99 under 7 seconds.
- 99.9% monthly availability for decision support; no dependency on the assistant for basic returns processing.
- Recovery time objective 60 minutes; recovery point objective 15 minutes for case state and zero loss for approved financial actions.
- 100% trace coverage for action proposals and executions.
- 365-day operational audit retention; policy-controlled case-memory TTL.
- Zero autonomous financial writes in the initial release.
