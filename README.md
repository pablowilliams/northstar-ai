# Northstar Transformation Studio

Northstar is a decision-grade AI consulting workbench for a fictional UK retailer, Aster & Row. It connects strategy, discovery, opportunity prioritisation, agentic solution architecture, responsible-AI controls, a working governed prototype, evaluation, benefits modelling and an investment roadmap in one demonstrable product.

This is a portfolio project. All customers, records, policies and results are synthetic.

## What an interviewer can inspect

- A transparent five-use-case opportunity portfolio and sensitivity workshop
- A returns-resolution agent that retrieves dated policy evidence, exposes its trace, binds approval to an exact payload and blocks risky cases
- A reproducible 5,000-case baseline-versus-assisted backtest with bootstrap and Wilson intervals
- An independent validator that reconciles case-level data to every headline metric
- A 400-case adversarial suite covering prompt injection, exfiltration, tool override and role spoofing
- An editable benefit model, residual-risk register, target AWS architecture and gated 12-week roadmap
- OpenAPI and MCP contracts, Terraform, CI/CD, runbooks, ADRs and a decision brief export

## Run locally

Requirements: Node.js 22+, npm and Python 3.11+.

```bash
npm install
npm run backtest
npm run dev
```

Open `http://localhost:3002`.

## Verify the evidence

```bash
npm run validate:backtest
npm test
npm run check
```

The generated evidence lives in `data/backtest-results.json`; the 5,000 case rows are in `data/synthetic_cases.csv`. The seed is fixed at `42026`.

## Headline portfolio result

On the synthetic holdout, simulated governed assistance reduced mean handling time from 19.16 to 12.05 minutes (37.1%), increased first-contact resolution from 69.1% to 86.8% (+17.7 percentage points), and recorded zero unauthorised writes in 5,000 cases. These are simulation results, not production or causal claims.

## Architecture

The local proof uses a deterministic workflow so it runs without paid services or secrets. The target design maps the same contracts onto AWS Bedrock, Lambda, Step Functions, API Gateway, Aurora PostgreSQL/pgvector, OpenSearch, Cognito, KMS and CloudWatch/OpenTelemetry. Material actions cross a separate tool gateway and payload-bound approval service.

See `docs/architecture.md`, `docs/evaluation-method.md`, `docs/model-card.md`, `docs/threat-model.md` and `docs/cv-evidence-ledger.md`.

## Claim discipline

Safe wording: “Built and backtested ... on 5,000 synthetic cases, reducing simulated ...”

Unsafe wording: “Reduced a retailer’s live handling time by 37.1%.”

The latter is false because Aster & Row and the evaluation are fictional.
