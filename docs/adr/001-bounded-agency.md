# ADR 001: Bounded agency and separate execution boundary

Status: accepted.

Decision: the model may recommend and propose but cannot directly call material enterprise write APIs. A schema-constrained gateway and payload-bound approval service mediate execution.

Rationale: a fluent recommendation should not imply authority. Separation makes least privilege, human review, idempotency, audit and kill-switch operation independently testable.

Consequence: the workflow is more complex and some journeys are slower. The same boundary becomes a reusable platform control across future agents.
