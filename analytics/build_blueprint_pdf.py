#!/usr/bin/env python3
"""Create the detailed Northstar portfolio blueprint PDF."""

from __future__ import annotations

import json
import math
import textwrap
from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen.canvas import Canvas

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT.parent / "output" / "pdf" / "northstar-ai-transformation-blueprint.pdf"
RESULTS = json.loads((ROOT / "data" / "backtest-results.json").read_text())
W, H = A4

INK = HexColor("#19221D")
GREEN = HexColor("#123F32")
GREEN2 = HexColor("#1D6A50")
LIME = HexColor("#C6E468")
PAPER = HexColor("#F4F1EA")
SURFACE = HexColor("#FFFDF8")
MUTED = HexColor("#667068")
LINE = HexColor("#D9D8D0")
AMBER = HexColor("#D58A22")
AMBER_BG = HexColor("#F8EAD3")

FONT_PATHS = [
    ("Manrope", "/System/Library/Fonts/Supplemental/Arial.ttf"),
    ("ManropeBold", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"),
    ("Serif", "/System/Library/Fonts/Supplemental/Georgia.ttf"),
    ("SerifBold", "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"),
    ("Mono", "/System/Library/Fonts/Supplemental/Courier New.ttf"),
]
for name, path in FONT_PATHS:
    if Path(path).exists():
        pdfmetrics.registerFont(TTFont(name, path))


PHASES = [
    ("01", "Engagement and commercial framing", "Turn an AI conversation into a sponsored, measurable business decision.", [
        ("Mandate and decision contract", "Define the decision, sponsor, deadline, funding envelope and evidence required before delivery begins.", "Signed one-page mandate and decision log"),
        ("Problem hypothesis", "State the operational problem without smuggling in a preferred technology or solution.", "Testable problem statement with counter-evidence"),
        ("Stakeholder map", "Make influence, accountability, concerns and commitments explicit across business and technology.", "Stakeholder contract and engagement cadence"),
        ("Executive discovery workshop", "Run a structured 120-minute session that converts stories into evidence and choices.", "Workshop pack, outputs and action owners"),
        ("Current-state baseline", "Quantify volumes, time, quality, failure demand, risk and cost using agreed definitions.", "Metric dictionary and signed baseline"),
        ("Opportunity portfolio", "Compare five AI opportunities using transparent value, feasibility, evidence and risk criteria.", "Ranked portfolio with dissent recorded"),
        ("Commercial value case", "Separate gross capacity, cashable savings, revenue protection, cost and uncertainty.", "Finance-reviewable benefits ledger"),
        ("Investment proposal", "Package scope, gates, budget, benefits, risks and exit criteria for SteerCo.", "Decision brief and 12-week funding ask"),
    ]),
    ("02", "Product and service design", "Design the human service around the assistant, not merely the assistant inside the service.", [
        ("Personas and jobs-to-be-done", "Model customer, colleague, supervisor and control-owner needs at the moment of resolution.", "Prioritised jobs and failure anxieties"),
        ("Current and target journeys", "Expose system switching, policy interpretation, wait states and discretion across the journey.", "Measured current-state and target-state maps"),
        ("Service blueprint", "Connect frontstage conversation, colleague work, orchestration, tools and policy ownership.", "End-to-end blueprint with handoffs"),
        ("Interaction contract", "Specify what the assistant recommends, explains, cites, proposes, blocks and escalates.", "Screen-level behaviour specification"),
        ("Human oversight experience", "Make review meaningful by exposing evidence, uncertainty and exact proposed consequences.", "Approval, rejection and escalation flows"),
        ("Accessibility and inclusion", "Design for keyboard use, assistive technology, plain language and vulnerable-customer needs.", "WCAG 2.2 AA test plan"),
        ("Adoption and capability", "Prepare colleagues and managers to calibrate trust, override safely and surface policy gaps.", "Training, champions and feedback loop"),
        ("Outcome-led backlog", "Slice delivery by measurable user and control outcomes instead of horizontal technical layers.", "Prioritised epics with acceptance evidence"),
    ]),
    ("03", "Data and knowledge foundation", "Make data ownership, policy lineage and retrieval quality first-class product capabilities.", [
        ("Data inventory and ownership", "Identify case, order, policy, identity, approval, telemetry and outcome sources with named owners.", "Data product catalogue and RACI"),
        ("Synthetic evaluation dataset", "Create a privacy-safe 5,000-case holdout spanning categories, channels, complexity and risks.", "Seeded generator and case-level CSV"),
        ("Canonical case contract", "Define typed fields, permitted values, provenance, quality rules and version strategy.", "Versioned schema and validation tests"),
        ("Policy content governance", "Require owner, version, effective date, audience, jurisdiction and review status for every source.", "Publish and rollback workflow"),
        ("Chunking and metadata", "Optimise policy passages for decisions, citations and effective-date filtering rather than arbitrary size.", "Chunk standard and metadata dictionary"),
        ("Retrieval architecture", "Combine lexical, vector and metadata filters with reranking and refusal on weak evidence.", "Retrieval service and benchmark"),
        ("Golden set and adjudication", "Build difficult cases with independent labels, disagreement handling and source references.", "Versioned golden set and rubric"),
        ("Privacy and retention", "Minimise fields, document purpose, separate identifiers and enforce case-memory expiry.", "DPIA starter and deletion evidence"),
    ]),
    ("04", "Agentic solution design", "Create a legible state machine with bounded authority, tool contracts and explicit stop conditions.", [
        ("Orchestration state machine", "Model intake, classify, retrieve, recommend, propose, approve, execute and observe as explicit states.", "State diagram and transition tests"),
        ("Planning and stop conditions", "Limit steps, time, cost and authority; stop on ambiguity, risk, stale evidence or control failure.", "Budgets and deterministic abort paths"),
        ("Model and provider routing", "Route classification, retrieval support and generation by capability, risk, latency and cost.", "Provider adapter and routing policy"),
        ("Memory boundaries", "Keep working memory case-scoped, short-lived and redacted; avoid uncontrolled cross-customer memory.", "Memory schema, TTL and deletion test"),
        ("MCP tool gateway", "Expose narrow read and propose/execute tools with strict schemas, identity and audit metadata.", "MCP contracts and abuse tests"),
        ("Payload-bound approval", "Bind approval to a canonical hash, approver, expiry, nonce and unchanged business action.", "Mismatch and replay tests"),
        ("Guardrail stack", "Layer input, evidence, generation and action controls with independent observability.", "Control matrix and fail-closed paths"),
        ("Prompt and policy lifecycle", "Version prompts as code, test them against the golden set and preserve release evidence.", "Prompt registry and rollback rule"),
    ]),
    ("05", "Enterprise and AWS architecture", "Map the proof to a resilient, secure and supportable serverless target state.", [
        ("Context and container architecture", "Separate experience, engagement evidence, agent platform, enterprise tools and control plane.", "C4 context and container views"),
        ("AWS serverless mapping", "Use API Gateway, Lambda, Step Functions, Bedrock, DynamoDB, SQS and managed observability deliberately.", "Target service map and rationale"),
        ("Integration patterns", "Choose synchronous read, asynchronous write, event, batch and compensation patterns by consequence.", "Integration decision matrix"),
        ("Identity and authorisation", "Propagate colleague identity and purpose; combine role, attributes, tool scope and action policy.", "AuthN/AuthZ sequence and tests"),
        ("Resilience and failure modes", "Design timeout, retry, circuit break, DLQ, idempotency, degradation and kill-switch behaviour.", "Failure-mode catalogue and game days"),
        ("Performance and scalability", "Set end-to-end latency budgets, concurrency limits, quotas and back-pressure behaviour.", "SLOs and load-test scenarios"),
        ("Continuity and recovery", "Define RTO/RPO, backups, corpus rollback, regional assumptions and manual fallback.", "Recovery plan and exercise evidence"),
        ("FinOps and sustainability", "Attribute token, retrieval, orchestration and logging cost per resolved case and environment.", "Cost dashboard and budget alarms"),
    ]),
    ("06", "Responsible AI and security", "Translate abstract principles into owned controls, tests, monitoring and incident response.", [
        ("Use-case risk classification", "Classify autonomy, data sensitivity, affected people, reversibility and regulatory exposure.", "Risk tier and required control set"),
        ("Harm and control mapping", "Trace plausible harms to prevention, detection, response, evidence and accountable owners.", "Harm-control-evidence matrix"),
        ("Threat modelling", "Model injection, exfiltration, excessive agency, approval abuse, poisoning and supply-chain compromise.", "Threat model and security backlog"),
        ("Vulnerable-customer safeguards", "Detect signals without profiling harm; offer accessible human routes and monitor outcomes.", "Consumer-duty control standard"),
        ("Fairness and cohort monitoring", "Compare service quality across relevant cohorts with minimum sample and escalation rules.", "Cohort dashboard and review cadence"),
        ("Transparency and contestability", "Explain assistance, sources, consequences, uncertainty and routes to correct or appeal.", "Transparency copy and complaint flow"),
        ("Audit and evidence retention", "Preserve model, prompt, policy, tool, approval, outcome and release lineage proportionately.", "Audit schema and retention schedule"),
        ("Incident and kill switch", "Define severity, authority, write disablement, case reconciliation, notification and recovery.", "Exercised runbook and time-to-disable KPI"),
    ]),
    ("07", "Engineering and platform delivery", "Demonstrate production habits through contracts, automation, tests and operational ownership.", [
        ("Repository and domain structure", "Keep product UI, domain engine, contracts, evidence, infrastructure and runbooks discoverable.", "Reviewable repository map"),
        ("API design and versioning", "Use stable resources, strict validation, idempotency, actionable errors and explicit deprecation.", "OpenAPI contract and tests"),
        ("Test strategy", "Cover unit, contract, workflow, evaluation, abuse, accessibility, performance and recovery layers.", "Risk-based test pyramid"),
        ("CI/CD quality gates", "Block changes on lint, types, tests, evaluation drift, security findings and build failure.", "GitHub Actions pipeline"),
        ("Infrastructure as code", "Encode encryption, versioning, approvals, queues, audit logs and severity-one alarms.", "Terraform plan and policy checks"),
        ("Environment and release strategy", "Separate dev, evaluation, staging and production data, identities, quotas and approvals.", "Promotion and rollback workflow"),
        ("Observability and SLOs", "Connect user outcome, agent quality, tool safety, latency and cost through shared trace context.", "Operational cockpit and alerts"),
        ("Code review and mentoring", "Use design notes, threat-aware reviews, pairing and evidence-based standards to raise team capability.", "Review checklist and learning cadence"),
    ]),
    ("08", "Evaluation and backtesting", "Prove that headline claims reconcile to case-level evidence and preserve uncertainty.", [
        ("Evaluation question and claims", "Define the pilot decision, allowed claims, prohibited claims, metrics and decision thresholds first.", "Pre-registered evaluation charter"),
        ("Paired holdout design", "Compare baseline and assistance on the same 5,000 synthetic cases using intake-available attributes.", "Fixed cohort and seed"),
        ("Synthetic generator", "Generate realistic variation while keeping distributions, probabilities and limitations inspectable.", "Deterministic Python generator"),
        ("Independent validation", "Reload case rows and recompute headline rates, uniqueness, segment totals and disclosure gates.", "Separate validator and PASS output"),
        ("Uncertainty quantification", "Use bootstrap intervals for paired continuous differences and Wilson intervals for rates.", "95% intervals and zero-event bounds"),
        ("Segment and fairness checks", "Inspect complexity, category, channel and vulnerability rather than relying on an overall average.", "Minimum-size cohort table"),
        ("Adversarial backtest", "Exercise prompt injection, exfiltration, tool override and role spoofing with known expected outcomes.", "400-case abuse suite"),
        ("Pilot thresholds and stop rules", "Convert simulation into conservative live gates, shadow mode and severity-one stop criteria.", "Pilot scorecard and daily review"),
    ]),
    ("09", "Delivery, governance and scale", "Move from proof to operational service through gated investment and accountable ownership.", [
        ("Twelve-week roadmap", "Sequence discover, design, prove, pilot and scale-decision phases around evidence gates.", "Week-by-week integrated plan"),
        ("Mobilisation and discovery", "Confirm team, access, baseline, policies, pilot cohort, risks and ways of working.", "Mobilisation checklist"),
        ("Shadow-mode proof", "Generate recommendations without affecting customers and compare them with blinded adjudication.", "Shadow report and error taxonomy"),
        ("Controlled colleague pilot", "Expose suggestions to trained colleagues while retaining manual or payload-bound execution.", "Pilot dashboard and daily huddle"),
        ("Progressive rollout", "Expand by reversible journey, cohort and authority only after threshold and risk review.", "Cohort rollout plan"),
        ("Product operating model", "Assign outcome, service, model, policy, data, control and benefits ownership.", "RACI and governance calendar"),
        ("Technical governance", "Use lightweight ADRs, architecture review, NFR evidence and debt decisions tied to risk.", "Design authority pack"),
        ("Benefits realisation", "Track baseline, adoption, capacity release, cash conversion, leakage and owner actions.", "Finance-owned benefit ledger"),
    ]),
    ("10", "Interview and CV conversion", "Turn the project into credible evidence of consulting judgment and hands-on architecture.", [
        ("Twenty-minute demo", "Tell a decision story: mandate, prioritisation, three workflow cases, evidence, architecture and ask.", "Timed demo script"),
        ("Executive storyboard", "Lead with decision and value, reveal technical depth on demand, and keep limitations visible.", "Six-part narrative arc"),
        ("Architecture defence", "Explain trade-offs in agency, serverless services, retrieval, approvals, observability and portability.", "Panel challenge questions"),
        ("Backtest defence", "Describe paired design, uncertainty, synthetic limits and how a live pilot would differ.", "Evidence-led methodology answer"),
        ("Commercial defence", "Distinguish capacity from cash, expose assumptions and explain staged funding and exit criteria.", "Finance challenge answer"),
        ("CV claim ledger", "Attach every number to an artifact, reproduction command, denominator and boundary.", "Auditable CV evidence table"),
        ("STAR stories", "Prepare leadership, ambiguity, risk, technical depth, stakeholder challenge and learning narratives.", "Six concise interview stories"),
        ("Portfolio extension", "Define the next increments that demonstrate cloud deployment, user research and observed pilot evidence.", "Credible 30-day improvement plan"),
    ]),
]

SOURCES = [
    ("Accenture - Data & AI Strategy Consultant", "https://www.accenture.com/gb-en/careers/jobdetails?id=R00343549_en"),
    ("Accenture - Customer AI Engineer", "https://www.accenture.com/gb-en/careers/jobdetails?id=R00314667_en"),
    ("Accenture - AI CX Delivery Consultant", "https://www.accenture.com/gb-en/careers/jobdetails?id=R00314082_en"),
    ("Accenture - Lead AI Solution Architect", "https://www.accenture.com/gb-en/careers/jobdetails?id=R00274072_en"),
    ("Accenture - AI and Agentic Technical Delivery Lead", "https://www.accenture.com/gb-en/careers/jobdetails?id=R00345711_en"),
    ("EY - Applied AI Engineer", "https://careers.ey.com/ey/job/London-Consultant%2C-AI-Engineer-TC-FS-1-E14-5EY/1382111233/"),
    ("EY - Analytics and AI Consultant", "https://careers.ey.com/ey/job/London-Consultant%2C-Analytics-%26-AI%2C-EY-Parthenon-SE1-2AF/1431066333/"),
    ("EY - AI Business Transformation", "https://careers.ey.com/ey/job/London-Senior-Consultant-Microsoft-AI-Business-Transformation-TC-FS-E14-5EY/1419780733/"),
    ("Capgemini - GenAI Full Stack Engineer", "https://careers.capgemini.com/job/London-GenAI-Full-Stack-Engineer-Consultant-Senior-Consultant-Digital-Excellence/1153954001/"),
    ("Capgemini - AI Assurance Senior Consultant", "https://careers.capgemini.com/job/London-AI-Assurance-Senior-Consultant/1425780833/"),
    ("BCG X careers", "https://careers.bcg.com/global/en/x"),
]


def safe(text: str) -> str:
    return (text.replace("–", "-").replace("—", "-").replace("−", "-").replace("’", "'")
            .replace("“", '"').replace("”", '"').replace("…", "...").replace("≥", ">=").replace("≤", "<="))


def wrap(text: str, width: int) -> list[str]:
    return textwrap.wrap(safe(text), width=width, break_long_words=False, break_on_hyphens=False) or [""]


class Blueprint:
    def __init__(self, path: Path):
        path.parent.mkdir(parents=True, exist_ok=True)
        self.c = Canvas(str(path), pagesize=A4)
        self.c.setTitle("Northstar AI Transformation Studio - As-Built Portfolio Blueprint")
        self.c.setAuthor("Pablo Williams")
        self.c.setSubject("AI consulting strategy, architecture, governance, evaluation and delivery plan")
        self.c.setKeywords("AI consulting, agentic AI, solution architecture, AWS, Responsible AI, portfolio")
        self.page = 0

    def next(self, title: str = "", section: str = "NORTHSTAR TRANSFORMATION STUDIO"):
        if self.page:
            self.c.showPage()
        self.page += 1
        self.c.setFillColor(PAPER); self.c.rect(0, 0, W, H, fill=1, stroke=0)
        if self.page > 1:
            self.c.setStrokeColor(LINE); self.c.line(42, H-40, W-42, H-40)
            self.c.setFont("Mono", 6.8); self.c.setFillColor(MUTED); self.c.drawString(42, H-31, safe(section.upper()))
            self.c.drawRightString(W-42, H-31, f"PAGE {self.page:03d}")
            self.c.line(42, 31, W-42, 31)
            self.c.drawString(42, 19, "PORTFOLIO EVIDENCE - SYNTHETIC DATA - 04 SEPTEMBER 2026")
            self.c.drawRightString(W-42, 19, "PABLO WILLIAMS")
        return self.c

    def heading(self, kicker: str, title: str, subtitle: str = "") -> float:
        c = self.c; y = H-72
        c.setFillColor(GREEN2); c.setFont("Mono", 7); c.drawString(42, y, safe(kicker.upper()))
        y -= 22; c.setFillColor(INK); c.setFont("SerifBold", 25)
        for line in wrap(title, 39): c.drawString(42, y, line); y -= 29
        if subtitle:
            y -= 2; c.setFillColor(MUTED); c.setFont("Manrope", 9.2)
            for line in wrap(subtitle, 92): c.drawString(42, y, line); y -= 13
        c.setStrokeColor(INK); c.line(42, y-8, W-42, y-8)
        return y-26

    def label(self, text: str, x: float, y: float, color=GREEN2):
        self.c.setFillColor(color); self.c.setFont("Mono", 6.6); self.c.drawString(x, y, safe(text.upper()))

    def para(self, text: str, x: float, y: float, width: int = 88, size: float = 8.5, leading: float = 12, color=INK) -> float:
        self.c.setFillColor(color); self.c.setFont("Manrope", size)
        for line in wrap(text, width): self.c.drawString(x, y, line); y -= leading
        return y

    def bullets(self, items: list[str], x: float, y: float, width: int = 78, size: float = 8.2, leading: float = 11.2, gap: float = 5) -> float:
        for item in items:
            lines = wrap(item, width)
            self.c.setFillColor(GREEN2); self.c.circle(x+3, y+2, 1.8, fill=1, stroke=0)
            self.c.setFillColor(INK); self.c.setFont("Manrope", size)
            for idx, line in enumerate(lines): self.c.drawString(x+12, y, line); y -= leading
            y -= gap
        return y

    def card(self, x, y, w, h, fill=SURFACE, stroke=LINE):
        self.c.setFillColor(fill); self.c.setStrokeColor(stroke); self.c.roundRect(x, y, w, h, 3, fill=1, stroke=1)

    def finish(self):
        self.c.save()


def cover(book: Blueprint):
    c = book.next()
    c.setFillColor(GREEN); c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(LIME); c.circle(W-72, H-86, 56, fill=1, stroke=0)
    c.setFillColor(GREEN); c.setFont("SerifBold", 36); c.drawCentredString(W-72, H-98, "N")
    c.setFillColor(LIME); c.setFont("Mono", 8); c.drawString(48, H-82, "NORTHSTAR / AS-BUILT PORTFOLIO BLUEPRINT")
    c.setFillColor(white); c.setFont("SerifBold", 45)
    y = H-180
    for line in ["AI Transformation", "Studio"]: c.drawString(48, y, line); y -= 52
    c.setFont("Manrope", 14); c.setFillColor(HexColor("#D9E4DD"))
    for line in ["Strategy, agentic architecture, Responsible AI,", "evaluation, delivery and interview evidence."]:
        c.drawString(50, y, line); y -= 20
    c.setStrokeColor(HexColor("#49675A")); c.line(48, 210, W-48, 210)
    stats = [("108", "planned pages"), ("5,000", "synthetic holdout cases"), ("400", "adversarial cases"), ("6", "automated domain tests")]
    x = 48
    for value, label in stats:
        c.setFillColor(white); c.setFont("SerifBold", 20); c.drawString(x, 170, value)
        c.setFillColor(HexColor("#AFC1B7")); c.setFont("Manrope", 6.8); c.drawString(x, 155, label.upper()); x += 124
    c.setFillColor(white); c.setFont("ManropeBold", 9); c.drawString(48, 74, "Prepared for portfolio demonstration")
    c.setFillColor(HexColor("#AFC1B7")); c.setFont("Manrope", 8); c.drawString(48, 58, "Pablo Williams | 04 September 2026 | Version 1.0")


def front_page(book: Blueprint, kicker: str, title: str, subtitle: str, sections: list[tuple[str, str]]):
    book.next(title, "INTRODUCTION")
    y = book.heading(kicker, title, subtitle)
    for heading, body in sections:
        book.label(heading, 42, y); y -= 14
        y = book.para(body, 42, y, 94, 9, 13, INK); y -= 17


def toc_pages(book: Blueprint):
    entries = [(phase[0], phase[1], 9 + idx*9) for idx, phase in enumerate(PHASES)]
    for part in range(4):
        book.next("Contents", "CONTENTS")
        start = part*3; subset = entries[start:start+3]
        y = book.heading(f"Contents / {part+1} of 4", "A 108-page path from mandate to evidence", "Each phase begins with a decision frame and continues with eight implementation modules.")
        for number, title, page in subset:
            book.card(42, y-110, W-84, 92)
            book.c.setFillColor(LIME); book.c.circle(72, y-63, 19, fill=1, stroke=0)
            book.c.setFillColor(GREEN); book.c.setFont("SerifBold", 16); book.c.drawCentredString(72, y-69, number)
            book.c.setFillColor(INK); book.c.setFont("SerifBold", 16); book.c.drawString(108, y-48, safe(title))
            book.c.setFillColor(MUTED); book.c.setFont("Manrope", 8); book.c.drawString(108, y-68, "Phase introduction plus eight detailed implementation modules")
            book.c.setFillColor(GREEN2); book.c.setFont("Mono", 8); book.c.drawRightString(W-62, y-58, f"START {page:03d}")
            y -= 112
        if part == 3:
            book.card(42, y-174, W-84, 156, AMBER_BG, HexColor("#E3C48C"))
            book.label("Appendices", 60, y-43, AMBER)
            book.c.setFillColor(INK); book.c.setFont("SerifBold", 18); book.c.drawString(60, y-67, "Evidence, contracts and readiness")
            book.bullets(["Repository and API map", "MCP tool-control contract", "Risk and metric dictionaries", "Assumption and CV claim ledgers", "Final readiness checklist and role-source notes"], 58, y-89, 72, 8, 11, 3)


def phase_intro(book: Blueprint, number: str, title: str, purpose: str, modules: list[tuple[str,str,str]]):
    book.next(title, f"PHASE {number}")
    y = book.heading(f"Phase {number}", title, purpose)
    book.card(42, y-104, W-84, 88, GREEN, GREEN)
    book.c.setFillColor(LIME); book.c.setFont("SerifBold", 31); book.c.drawString(60, y-58, number)
    book.c.setFillColor(white); book.c.setFont("ManropeBold", 10); book.c.drawString(120, y-43, "PHASE EXIT CONDITION")
    exit_text = f"The accountable sponsor can make the next decision using named evidence, owned risks and an explicit gate - not optimism."
    book.para(exit_text, 120, y-61, 66, 8.2, 11, HexColor("#DDE8E1"))
    y -= 132
    book.label("Module map", 42, y); y -= 18
    for idx, (name, objective, deliverable) in enumerate(modules):
        col = idx % 2; row = idx // 2; x = 42 + col*257; top = y-row*104
        book.card(x, top-88, 241, 78)
        book.c.setFillColor(GREEN2); book.c.setFont("Mono", 7); book.c.drawString(x+13, top-28, f"{number}.{idx+1}")
        book.c.setFillColor(INK); book.c.setFont("ManropeBold", 9); book.c.drawString(x+48, top-28, safe(name))
        book.para(objective, x+13, top-45, 48, 7, 9, MUTED)
        book.c.setFillColor(GREEN2); book.c.setFont("ManropeBold", 6.8); book.c.drawString(x+13, top-78, safe(deliverable.upper()))


def module_page(book: Blueprint, phase_no: str, phase_title: str, idx: int, title: str, objective: str, deliverable: str):
    book.next(title, f"PHASE {phase_no} / {phase_title}")
    y = book.heading(f"Module {phase_no}.{idx}", title, objective)
    plan_templates = [
        f"Frame the decision this module must unlock and record the accountable owner before producing artifacts.",
        f"Collect direct evidence from workflow data, policy, system behaviour and stakeholder interviews; tag assumptions separately.",
        f"Design the smallest useful artifact for {title.lower()}, including version, owner, status and review date.",
        f"Challenge the design with an edge case, an affected-user perspective and a failure or abuse scenario.",
        f"Connect the output to product backlog, architecture, control, evaluation and benefits evidence so it cannot become shelfware.",
        f"Review with the decision maker and control owner; capture dissent, actions and an explicit accept/rework/stop outcome.",
    ]
    book.label("Implementation sequence", 42, y); y -= 15
    for step, text in enumerate(plan_templates, 1):
        book.c.setFillColor(GREEN); book.c.circle(51, y+2, 8, fill=1, stroke=0)
        book.c.setFillColor(LIME); book.c.setFont("Mono", 6); book.c.drawCentredString(51, y, str(step))
        y = book.para(text, 67, y+4, 83, 7.8, 10.5, INK); y -= 5
    y -= 3
    book.card(42, y-119, 248, 108, SURFACE, LINE)
    book.label("Definition of done", 56, y-30)
    done = [
        f"{deliverable} exists in a version-controlled, reviewable form.",
        "Inputs, definitions, assumptions and exclusions are visible.",
        "A named owner accepts maintenance and decision responsibility.",
        "The relevant test, metric or review record is linked.",
    ]
    book.bullets(done, 55, y-49, 43, 6.9, 9, 2)
    book.card(305, y-119, 248, 108, GREEN, GREEN)
    book.label("As-built portfolio evidence", 319, y-30, LIME)
    evidence_map = {
        "08": f"data/backtest-results.json; 5,000-case CSV; validator PASS; seed {RESULTS['metadata']['seed']}",
        "04": "lib/engine.ts; payload-hash approval; dated evidence; trace; blocked fraud case",
        "05": "docs/architecture.md; infra/*.tf; OpenAPI and MCP contracts; kill-switch alarm",
        "07": "strict TypeScript; six tests; Python validator; GitHub Actions; production build",
        "10": "20-minute demo; README claim boundary; docs/cv-evidence-ledger.md",
    }
    evidence = evidence_map.get(phase_no, f"docs and application view for {phase_title.lower()}; owned acceptance evidence")
    book.para(evidence, 319, y-50, 42, 7.2, 10, white)
    y -= 140
    book.label("Governance strip", 42, y); y -= 15
    strips = [("Owner", "Business or platform owner"), ("Cadence", "Weekly until accepted"), ("Gate", "Evidence reviewed"), ("Status", "Implemented in portfolio")]
    x = 42
    for label, value in strips:
        book.card(x, y-47, 121, 39)
        book.label(label, x+9, y-23); book.c.setFillColor(INK); book.c.setFont("ManropeBold", 7.2); book.c.drawString(x+9, y-37, safe(value)); x += 130
    y -= 73
    book.card(42, y-78, W-84, 68, AMBER_BG, HexColor("#E3C48C"))
    book.label("Interview defence", 56, y-31, AMBER)
    defence = f"I treated {title.lower()} as a decision and operating capability. The artifact is useful because it has an owner, a review gate, linked evidence and a defined failure response."
    book.para(defence, 56, y-47, 88, 8.2, 11, INK)


def appendix_page(book: Blueprint, number: str, title: str, subtitle: str, left_title: str, left_items: list[str], right_title: str, right_items: list[str]):
    book.next(title, "APPENDICES")
    y = book.heading(f"Appendix {number}", title, subtitle)
    book.card(42, 108, 248, y-125); book.card(305, 108, 248, y-125)
    book.label(left_title, 56, y-18); book.bullets(left_items, 54, y-40, 43, 7.6, 10.2, 4)
    book.label(right_title, 319, y-18); book.bullets(right_items, 317, y-40, 43, 7.6, 10.2, 4)


def build():
    book = Blueprint(OUTPUT)
    cover(book)
    front_page(book, "Portfolio truth", "Scope, disclosure and claim boundary", "This manual is deliberately explicit about what was built, what was simulated and what remains a live-pilot hypothesis.", [
        ("Built", "A connected Next.js consulting workbench, deterministic governed workflow, APIs, evidence retrieval, exact-payload approval, scenario model, exports, OpenAPI and MCP contracts, Terraform controls, CI/CD, tests, documentation and runbooks."),
        ("Evaluated", f"A fixed-seed holdout of {RESULTS['metadata']['cases']:,} synthetic cases and 400 deterministic adversarial cases. Mean minutes saved receives 2,000 bootstrap resamples; binary metrics use Wilson intervals."),
        ("Not claimed", "No real retailer, customer, live model, cloud account, production integration, randomised trial or booked financial saving is represented. Aster & Row is fictional."),
        ("Safe language", "Use 'built and backtested on synthetic cases' and 'simulated improvement'. Never say the project reduced a client's actual handling time or delivered booked savings."),
    ])
    front_page(book, "Executive summary", "The answer first", "Approve a controlled 12-week pilot hypothesis - because the use case is valuable, bounded and measurable, not because agentic AI is fashionable.", [
        ("Decision", "Approve GBP 190,000 to prove agent-assisted returns in shadow mode and a narrow colleague pilot. Keep financial execution disabled initially and expand authority only after safety and quality gates."),
        ("Synthetic evidence", f"Mean handling time moved from {RESULTS['headline']['baseline_mean_minutes']} to {RESULTS['headline']['assisted_mean_minutes']} minutes ({RESULTS['headline']['mean_time_reduction_pct']}% lower); first-contact resolution improved by {RESULTS['headline']['fcr_uplift_pp']} percentage points; policy adherence reached {RESULTS['headline']['assisted_policy_adherence_pct']}%."),
        ("Business case", f"At 120,000 annual cases and GBP 32 loaded hourly cost, the editable model produces GBP {RESULTS['business_case']['year_one_net_value_gbp']:,} year-one net capacity value, {RESULTS['business_case']['payback_months']} months payback and GBP {RESULTS['business_case']['three_year_npv_gbp']:,} three-year NPV."),
        ("Control posture", f"Zero unauthorised writes were observed in {RESULTS['metadata']['cases']:,} synthetic cases, with a {RESULTS['uncertainty']['zero_unsafe_write_upper_95_pct']}% rule-of-three upper 95% bound. Zero bypasses were observed in 400 known attacks; this is evidence, not proof against novel threats."),
    ])
    front_page(book, "How to use this manual", "Three reading paths", "The same artifact supports delivery planning, an interviewer demonstration and honest CV evidence.", [
        ("Twenty-minute interviewer path", "Read pages 3, 17, 35, 53, 71, 89 and the claim ledger. In the app, show the opportunity ranking, a routine case, an approval case, a blocked case, the backtest and the architecture."),
        ("Delivery-lead path", "Work phases 01 to 03 before committing architecture. Use phases 04 to 07 for build and controls, phase 08 for evidence, and phase 09 for gated rollout."),
        ("Architecture-review path", "Focus on bounded agency, trust boundaries, MCP tools, exact-payload approval, AWS mapping, resilience, threat model, NFRs, evaluation and kill-switch operation."),
        ("Evidence rule", "Every headline claim must point to an artifact, command, denominator and boundary. If one element is missing, present the statement as a hypothesis or remove it."),
    ])
    toc_pages(book)
    for number, title, purpose, modules in PHASES:
        phase_intro(book, number, title, purpose, modules)
        for idx, (module_title, objective, deliverable) in enumerate(modules, 1):
            module_page(book, number, title, idx, module_title, objective, deliverable)

    appendix_page(book, "A", "Repository evidence map", "Where an interviewer can inspect each capability.", "Product and evidence", [
        "components/NorthstarStudio.tsx - six connected consulting views and live interactions",
        "lib/engine.ts - deterministic workflow, retrieval, risk block and exact-payload approval",
        "analytics/backtest.py - 5,000-case generator and metrics",
        "analytics/validate_backtest.py - independent reconciliation",
        "data/backtest-results.json - headline, uncertainty, segment and value evidence",
    ], "Enterprise delivery", [
        "contracts/openapi.yaml - API resources and validation",
        "contracts/mcp-tools.json - read, propose and execute tool boundary",
        "infra/*.tf - encryption, evidence, approvals, queues, logs and alarms",
        "docs - architecture, evaluation, system card, threat model and runbooks",
        ".github/workflows/quality.yml - automated quality gates",
    ])
    appendix_page(book, "B", "API and integration contract", "A compact resource map for the implemented local proof.", "Read surfaces", [
        "GET /api/health - system and evidence checks",
        "GET /api/engagement - mandate, stakeholders, risks and roadmap",
        "GET /api/opportunities - portfolio and scoring method",
        "GET /api/cases - synthetic prototype records",
        "GET /api/backtest - full evaluation aggregate",
    ], "Decision and action surfaces", [
        "POST /api/opportunities - validate and score a new opportunity",
        "POST /api/workflows - execute a case-scoped governed run",
        "POST /api/approvals - approve only the recorded payload hash",
        "GET /api/export/steerco - download the decision brief",
        "All inputs use strict schemas; write mismatch returns HTTP 409",
    ])
    appendix_page(book, "C", "MCP tool-control contract", "A material tool is split into read, propose and execute capabilities.", "Control design", [
        "Customer content is always untrusted data, never agent instruction",
        "Tool allow-list and additionalProperties=false constrain arguments",
        "Read identity is case-scoped and purpose-bound",
        "Proposal creates no financial side effect",
        "Execution requires proposal ID, exact payload hash and approval token",
    ], "Abuse and recovery", [
        "Hash mismatch or expiry fails closed",
        "Idempotency key prevents duplicate execution",
        "DLQ preserves failed asynchronous actions for review",
        "Unsafe-write alarm triggers the tool-gateway kill switch",
        "Every execution records evidence, approver and release lineage",
    ])
    appendix_page(book, "D", "Risk register extract", "Residual risk is accepted by accountable owners, not hidden by model confidence.", "Customer and decision risk", [
        "R-01 Incorrect policy - dated retrieval, citations and human fallback - residual Medium",
        "R-02 Unauthorised action - exact-payload approval and audit - residual Low",
        "R-03 Vulnerable-customer harm - human route and cohort monitoring - residual Medium",
        "R-05 Non-cashable benefit - finance owner and staged investment - residual Medium",
    ], "Technical and security risk", [
        "R-04 Prompt injection - trust boundary, allow-list and schema validation - residual Low",
        "Corpus poisoning - signed releases, owners and rollback",
        "Duplicate action - idempotency and ledger reconciliation",
        "Evaluation gaming - fixed holdout, fingerprints and independent validation",
        "Supplier change - version pinning, regression suite and exit strategy",
    ])
    appendix_page(book, "E", "Metric dictionary", "The small set of measures used to make the pilot decision.", "Outcome measures", [
        f"Mean handling time - baseline {RESULTS['headline']['baseline_mean_minutes']} vs assisted {RESULTS['headline']['assisted_mean_minutes']} minutes",
        f"First-contact resolution - {RESULTS['headline']['baseline_fcr_pct']}% vs {RESULTS['headline']['assisted_fcr_pct']}%",
        f"Reopen rate - {RESULTS['headline']['baseline_reopen_pct']}% vs {RESULTS['headline']['assisted_reopen_pct']}%",
        f"Policy adherence - assisted {RESULTS['headline']['assisted_policy_adherence_pct']}%",
        "Adoption and override rate - live-pilot measures, not simulated claims",
    ], "Safety and platform measures", [
        f"Escalation recall - {RESULTS['headline']['escalation_recall_pct']}% simulated",
        f"Retrieval accuracy - {RESULTS['headline']['retrieval_accuracy_pct']}% simulated",
        "Unauthorised write rate - target zero with upper-bound reporting",
        "Trace coverage - target and simulated result 100%",
        "P95 latency and cost per resolved case - release SLOs",
    ])
    appendix_page(book, "F", "Business-case assumptions", "Make the economic claim editable and finance-owned.", "Base inputs", [
        "Annual case volume: 120,000",
        f"Mean minutes saved: {RESULTS['headline']['mean_minutes_saved']}",
        "Loaded colleague cost: GBP 32 per hour",
        f"Avoided repeat contacts: {RESULTS['business_case']['avoided_repeat_contacts']:,}",
        "Cost per repeat contact: GBP 7.80",
        "Year-one platform cost: GBP 190,000",
    ], "Base outputs and caveats", [
        f"Gross annual capacity value: GBP {RESULTS['business_case']['annual_gross_value_gbp']:,}",
        f"Year-one net capacity value: GBP {RESULTS['business_case']['year_one_net_value_gbp']:,}",
        f"Modelled payback: {RESULTS['business_case']['payback_months']} months",
        f"Three-year NPV at 8%: GBP {RESULTS['business_case']['three_year_npv_gbp']:,}",
        "Capacity is not cash until a conversion mechanism and owner are agreed",
    ])
    appendix_page(book, "G", "CV claim ledger", "Every number has a reproduction path and a truth boundary.", "Defensible statements", [
        "Built a governed AI transformation workbench covering strategy, delivery, risk and architecture",
        "Backtested on 5,000 synthetic cases with a fixed seed and independent validator",
        "Reduced simulated mean handling time by 37.1%",
        "Improved simulated FCR by 17.7 percentage points",
        "Observed zero unauthorised writes and zero bypasses in known attack suites",
    ], "Words that must remain", [
        "Synthetic - the cases and organisation are fictional",
        "Simulated - outcomes were generated, not observed in production",
        "Modelled - financial value depends on editable assumptions",
        "Observed - zero events does not mean impossible",
        "Portfolio - the implementation demonstrates capability, not client delivery",
    ])
    appendix_page(book, "H", "Final readiness checklist", "What must be true before showing the project to an interviewer.", "Technical readiness", [
        "npm run check passes from a clean checkout",
        "python3 analytics/backtest.py reproduces committed results",
        "Routine, approval and blocked cases work in the UI",
        "OpenAPI, MCP and Terraform artifacts match the explanation",
        "No secret, real personal data or unsupported claim is committed",
    ], "Presentation readiness", [
        "Twenty-minute demo rehearsed with a five-minute fallback",
        "CV claim retains synthetic, simulated and modelled boundaries",
        "Three architecture trade-offs and two limitations prepared",
        "Benefits assumptions can be changed live without hiding the result",
        "Close by asking which decision or risk the panel would challenge",
    ])
    for part in range(2):
        book.next("Role-requirement sources", "SOURCE NOTES")
        y = book.heading(f"Source notes / {part+1} of 2", "Current role patterns that shaped the portfolio", "Official employer career pages accessed during September 2026. Links are included for traceability; roles may close or change.")
        for name, url in SOURCES[part*6:(part+1)*6]:
            book.c.setFillColor(INK); book.c.setFont("ManropeBold", 8.5); book.c.drawString(42, y, safe(name)); y -= 13
            book.c.setFillColor(GREEN2); book.c.setFont("Mono", 6.4)
            for line in wrap(url, 88): book.c.drawString(42, y, line); y -= 9
            y -= 12
        book.card(42, 112, W-84, 108, GREEN, GREEN)
        book.label("Synthesis", 58, 192, LIME)
        synthesis = "The recurring demand is broader than model building: value framing, client workshops, enterprise integration, RAG and agents, APIs, cloud/serverless, Responsible AI, evaluation, DevOps, production operations and the ability to lead engineers while staying hands-on. Northstar is structured to provide inspectable evidence across that full span."
        book.para(synthesis, 58, 174, 83, 8.2, 11.5, white)
    book.finish()
    print(f"Created {OUTPUT} with {book.page} pages")


if __name__ == "__main__":
    build()
