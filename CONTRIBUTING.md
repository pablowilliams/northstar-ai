# Contributing

Northstar is a portfolio reference implementation, but changes should meet production-style evidence standards.

1. Create a focused branch and explain the decision or risk being changed.
2. Preserve the synthetic-data and simulated-results disclosure on every user-facing claim.
3. Add tests for changes to scoring, workflow authority, approvals, evidence or navigation.
4. Run `npm run backtest` only when intentionally changing the fixed evidence model.
5. Run `npm run check` before opening a pull request.
6. Document material architecture, tool-authority or evaluation changes with an ADR.

Pull requests should describe the user outcome, control impact, evidence produced and rollback path.
