# Threat model

## Assets

Customer identifiers and messages; order and payment state; policy corpus; prompts and orchestration logic; credentials; approval tokens; audit evidence; evaluation results; business-case assumptions.

## Principal threats and mitigations

| Threat | Path | Prevent | Detect | Respond |
|---|---|---|---|---|
| Prompt injection | Customer text or retrieved content | Treat content as data, instruction hierarchy, allow-listed tools | Injection classifier and unusual tool-intent metric | Block run; retain trace; update abuse set |
| Data exfiltration | Prompt or tool response | Case-scoped access, output filters, no arbitrary network | DLP and cross-case identifier alert | Revoke token; isolate run; privacy incident process |
| Excessive agency | Agent chains multiple actions | Explicit state machine, step and cost budgets | Tool-call count and loop alarm | Abort; recommendation-only mode |
| Approval bait-and-switch | Payload changes after review | Canonical payload hash, expiry, single use | Hash mismatch metric | Reject and require new approval |
| Duplicate financial action | Retry after timeout | Idempotency key and ledger | Duplicate proposal alert | Reconcile and compensate |
| Policy poisoning | Unauthorised corpus update | Signed release, document owner, effective dates | Retrieval quality and source-change alert | Roll back corpus version |
| Evaluation gaming | Test leakage or metric selection | Fixed holdout, registered metrics, independent validator | Data fingerprint and CI reconciliation | Invalidate release evidence |
| Supply-chain compromise | Package or action tampering | Lockfile, dependabot, least-privilege CI, provenance | SCA and build attestations | Block release and rotate secrets |

## Abuse testing

The included 400-case deterministic suite covers four categories equally. A production release adds multilingual injection, Unicode smuggling, indirect injection in attachments, argument boundary attacks, denial-of-wallet, recursive tool plans and compromised source documents.
