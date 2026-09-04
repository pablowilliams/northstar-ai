# Security policy

This repository contains synthetic data and a local simulation. It must not be connected to real customer, payment or identity systems without a separate security review.

Report a suspected vulnerability privately through GitHub security advisories. Do not include credentials, personal data or exploit details in a public issue.

The reference control model uses default-deny tools, schema-constrained arguments, case-scoped identity, non-executable proposals, payload-bound approval, idempotency and a write kill switch. See `docs/threat-model.md` and `docs/runbooks/write-kill-switch.md`.
