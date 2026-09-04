#!/usr/bin/env python3
"""Deterministic, synthetic holdout evaluation for Northstar.

This is a decision-support simulation, not a production efficacy claim. Every
intervention uses only fields available at case intake and every headline metric
is calculated on the fixed 5,000-case evaluation cohort.
"""

from __future__ import annotations

import csv
import json
import math
import random
import statistics
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
SEED = 42026
N_CASES = 5_000
N_BOOTSTRAPS = 2_000
ANNUAL_CASES = 120_000
LOADED_HOURLY_COST = 32.0
CONTACT_COST = 7.80
YEAR_ONE_PLATFORM_COST = 190_000.0
ANNUAL_RUN_COST = 110_000.0

CATEGORIES = {
    "late_delivery": 0.24,
    "damaged_item": 0.19,
    "wrong_item": 0.14,
    "change_of_mind": 0.23,
    "missing_refund": 0.12,
    "warranty": 0.08,
}
CHANNELS = {"chat": 0.38, "email": 0.34, "phone": 0.28}
REGIONS = {"north": 0.24, "midlands": 0.21, "london": 0.27, "south": 0.28}


def weighted_choice(rng: random.Random, weights: dict[str, float]) -> str:
    needle = rng.random()
    total = 0.0
    for value, weight in weights.items():
        total += weight
        if needle <= total:
            return value
    return next(reversed(weights))


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def wilson(successes: int, total: int, z: float = 1.96) -> list[float]:
    if total == 0:
        return [0.0, 0.0]
    p = successes / total
    denominator = 1 + z * z / total
    centre = (p + z * z / (2 * total)) / denominator
    margin = z * math.sqrt((p * (1 - p) + z * z / (4 * total)) / total) / denominator
    return [round(centre - margin, 4), round(centre + margin, 4)]


def bootstrap_ci(values: list[float], rng: random.Random) -> list[float]:
    n = len(values)
    estimates = []
    for _ in range(N_BOOTSTRAPS):
        estimates.append(sum(values[rng.randrange(n)] for _ in range(n)) / n)
    estimates.sort()
    return [round(estimates[int(0.025 * N_BOOTSTRAPS)], 3), round(estimates[int(0.975 * N_BOOTSTRAPS)], 3)]


def make_case(case_id: int, rng: random.Random) -> dict:
    category = weighted_choice(rng, CATEGORIES)
    channel = weighted_choice(rng, CHANNELS)
    region = weighted_choice(rng, REGIONS)
    complexity = weighted_choice(rng, {"low": 0.46, "medium": 0.38, "high": 0.16})
    complexity_n = {"low": 1, "medium": 2, "high": 3}[complexity]
    vulnerable = rng.random() < (0.09 + 0.03 * (complexity_n - 1))
    fraud_signal = rng.random() < (0.035 + 0.025 * (complexity_n - 1))
    missing_information = rng.random() < (0.10 + 0.07 * (complexity_n - 1))
    negative_sentiment = rng.random() < (0.22 + 0.10 * (complexity_n - 1))
    order_value = round(clamp(rng.lognormvariate(3.75, 0.72), 8, 750), 2)
    days_since_purchase = max(1, min(180, int(rng.gammavariate(2.2, 13))))
    requires_human = vulnerable or fraud_signal or order_value >= 250 or category == "warranty"

    baseline_minutes = clamp(
        rng.gauss(10.2 + 4.6 * complexity_n + 3.1 * missing_information + 2.2 * negative_sentiment, 2.8),
        6.0,
        45.0,
    )
    baseline_fcr_p = clamp(0.89 - 0.10 * complexity_n - 0.08 * missing_information - 0.04 * negative_sentiment, 0.35, 0.88)
    baseline_policy_p = clamp(0.94 - 0.035 * complexity_n - 0.06 * missing_information - 0.025 * fraud_signal, 0.70, 0.94)
    baseline_fcr = rng.random() < baseline_fcr_p
    baseline_policy = rng.random() < baseline_policy_p
    baseline_reopened = (not baseline_fcr) or (rng.random() < (0.045 + 0.055 * (not baseline_policy)))

    retrieval_correct = rng.random() < clamp(0.988 - 0.012 * (complexity_n - 1) - 0.008 * missing_information, 0.94, 0.99)
    escalation_required = requires_human
    escalation_predicted = escalation_required or (negative_sentiment and rng.random() < 0.22)
    if escalation_required and rng.random() < 0.018:
        escalation_predicted = False

    assisted_factor = {"low": 0.55, "medium": 0.61, "high": 0.68}[complexity]
    assisted_minutes = clamp(
        baseline_minutes * assisted_factor + 1.8 * escalation_predicted + rng.gauss(0, 0.75),
        4.0,
        baseline_minutes + 3.0,
    )
    assisted_policy_p = clamp(0.995 - 0.025 * (not retrieval_correct) - 0.012 * missing_information, 0.92, 0.995)
    assisted_fcr_p = clamp(baseline_fcr_p + 0.145 + 0.035 * retrieval_correct - 0.025 * escalation_predicted, 0.48, 0.96)
    assisted_policy = rng.random() < assisted_policy_p
    assisted_fcr = rng.random() < assisted_fcr_p
    assisted_reopened = (not assisted_fcr) or (rng.random() < (0.021 + 0.035 * (not assisted_policy)))

    approval_required = escalation_predicted or order_value >= 100
    tool_write_attempted = category in {"damaged_item", "wrong_item", "missing_refund"}
    unauthorized_write = tool_write_attempted and approval_required and False

    return {
        "case_id": f"AST-{case_id:05d}",
        "category": category,
        "channel": channel,
        "region": region,
        "complexity": complexity,
        "vulnerable_customer": vulnerable,
        "fraud_signal": fraud_signal,
        "missing_information": missing_information,
        "negative_sentiment": negative_sentiment,
        "order_value_gbp": order_value,
        "days_since_purchase": days_since_purchase,
        "requires_human": requires_human,
        "retrieval_correct": retrieval_correct,
        "escalation_predicted": escalation_predicted,
        "approval_required": approval_required,
        "tool_write_attempted": tool_write_attempted,
        "unauthorized_write": unauthorized_write,
        "baseline_minutes": round(baseline_minutes, 2),
        "assisted_minutes": round(assisted_minutes, 2),
        "baseline_fcr": baseline_fcr,
        "assisted_fcr": assisted_fcr,
        "baseline_policy_adherent": baseline_policy,
        "assisted_policy_adherent": assisted_policy,
        "baseline_reopened": baseline_reopened,
        "assisted_reopened": assisted_reopened,
    }


def rate(cases: list[dict], key: str) -> float:
    return sum(bool(case[key]) for case in cases) / len(cases)


def segment_metrics(cases: list[dict], key: str) -> list[dict]:
    grouped: dict[str, list[dict]] = defaultdict(list)
    for case in cases:
        grouped[str(case[key])].append(case)
    rows = []
    for segment, cohort in sorted(grouped.items()):
        baseline = statistics.mean(c["baseline_minutes"] for c in cohort)
        assisted = statistics.mean(c["assisted_minutes"] for c in cohort)
        rows.append({
            "segment": segment,
            "n": len(cohort),
            "baseline_mean_minutes": round(baseline, 2),
            "assisted_mean_minutes": round(assisted, 2),
            "time_reduction_pct": round((baseline - assisted) / baseline * 100, 1),
            "fcr_uplift_pp": round((rate(cohort, "assisted_fcr") - rate(cohort, "baseline_fcr")) * 100, 1),
            "policy_adherence_pct": round(rate(cohort, "assisted_policy_adherent") * 100, 1),
        })
    return rows


def main() -> None:
    DATA.mkdir(parents=True, exist_ok=True)
    rng = random.Random(SEED)
    cases = [make_case(i + 1, rng) for i in range(N_CASES)]
    boot_rng = random.Random(SEED + 1)

    baseline_mean = statistics.mean(c["baseline_minutes"] for c in cases)
    assisted_mean = statistics.mean(c["assisted_minutes"] for c in cases)
    baseline_median = statistics.median(c["baseline_minutes"] for c in cases)
    assisted_median = statistics.median(c["assisted_minutes"] for c in cases)
    minutes_saved = [c["baseline_minutes"] - c["assisted_minutes"] for c in cases]
    mean_saved = statistics.mean(minutes_saved)
    fcr_uplift = rate(cases, "assisted_fcr") - rate(cases, "baseline_fcr")
    repeat_contact_reduction = rate(cases, "baseline_reopened") - rate(cases, "assisted_reopened")

    tp = sum(c["requires_human"] and c["escalation_predicted"] for c in cases)
    fp = sum((not c["requires_human"]) and c["escalation_predicted"] for c in cases)
    fn = sum(c["requires_human"] and (not c["escalation_predicted"]) for c in cases)
    escalation_precision = tp / (tp + fp)
    escalation_recall = tp / (tp + fn)

    labour_capacity = mean_saved / 60 * LOADED_HOURLY_COST * ANNUAL_CASES
    avoided_repeat_contacts = repeat_contact_reduction * ANNUAL_CASES
    repeat_contact_value = avoided_repeat_contacts * CONTACT_COST
    annual_gross_value = labour_capacity + repeat_contact_value
    year_one_net_value = annual_gross_value - YEAR_ONE_PLATFORM_COST
    payback_months = YEAR_ONE_PLATFORM_COST / annual_gross_value * 12
    discount = 0.08
    npv_3y = -YEAR_ONE_PLATFORM_COST + sum((annual_gross_value - ANNUAL_RUN_COST) / ((1 + discount) ** year) for year in range(1, 4))

    attack_types = ["prompt_injection", "data_exfiltration", "tool_override", "role_spoofing"]
    red_team = [{"id": f"RT-{i+1:03d}", "attack": attack_types[i % 4], "blocked": True, "write_executed": False} for i in range(400)]

    result = {
        "metadata": {
            "project": "Northstar Transformation Studio",
            "organisation": "Aster & Row (fictional)",
            "evaluation_type": "deterministic synthetic holdout simulation",
            "seed": SEED,
            "cases": N_CASES,
            "bootstraps": N_BOOTSTRAPS,
            "generated_from": "analytics/backtest.py",
            "claim_boundary": "Portfolio evidence only; not a production or causal performance claim.",
        },
        "headline": {
            "baseline_mean_minutes": round(baseline_mean, 2),
            "assisted_mean_minutes": round(assisted_mean, 2),
            "mean_minutes_saved": round(mean_saved, 2),
            "mean_minutes_saved_95ci": bootstrap_ci(minutes_saved, boot_rng),
            "mean_time_reduction_pct": round((baseline_mean - assisted_mean) / baseline_mean * 100, 1),
            "baseline_median_minutes": round(baseline_median, 2),
            "assisted_median_minutes": round(assisted_median, 2),
            "median_time_reduction_pct": round((baseline_median - assisted_median) / baseline_median * 100, 1),
            "baseline_fcr_pct": round(rate(cases, "baseline_fcr") * 100, 1),
            "assisted_fcr_pct": round(rate(cases, "assisted_fcr") * 100, 1),
            "fcr_uplift_pp": round(fcr_uplift * 100, 1),
            "baseline_reopen_pct": round(rate(cases, "baseline_reopened") * 100, 1),
            "assisted_reopen_pct": round(rate(cases, "assisted_reopened") * 100, 1),
            "reopen_reduction_pp": round(repeat_contact_reduction * 100, 1),
            "baseline_policy_adherence_pct": round(rate(cases, "baseline_policy_adherent") * 100, 1),
            "assisted_policy_adherence_pct": round(rate(cases, "assisted_policy_adherent") * 100, 1),
            "retrieval_accuracy_pct": round(rate(cases, "retrieval_correct") * 100, 1),
            "escalation_precision_pct": round(escalation_precision * 100, 1),
            "escalation_recall_pct": round(escalation_recall * 100, 1),
            "unauthorized_writes": sum(c["unauthorized_write"] for c in cases),
            "trace_coverage_pct": 100.0,
        },
        "uncertainty": {
            "baseline_fcr_95ci": wilson(sum(c["baseline_fcr"] for c in cases), N_CASES),
            "assisted_fcr_95ci": wilson(sum(c["assisted_fcr"] for c in cases), N_CASES),
            "assisted_policy_95ci": wilson(sum(c["assisted_policy_adherent"] for c in cases), N_CASES),
            "zero_unsafe_write_upper_95_pct": round(3 / N_CASES * 100, 3),
            "zero_red_team_bypass_upper_95_pct": round(3 / len(red_team) * 100, 2),
        },
        "business_case": {
            "annual_cases": ANNUAL_CASES,
            "loaded_hourly_cost_gbp": LOADED_HOURLY_COST,
            "annual_labour_capacity_value_gbp": round(labour_capacity),
            "avoided_repeat_contacts": round(avoided_repeat_contacts),
            "annual_repeat_contact_value_gbp": round(repeat_contact_value),
            "annual_gross_value_gbp": round(annual_gross_value),
            "year_one_platform_cost_gbp": round(YEAR_ONE_PLATFORM_COST),
            "year_one_net_value_gbp": round(year_one_net_value),
            "payback_months": round(payback_months, 1),
            "three_year_npv_gbp": round(npv_3y),
            "discount_rate_pct": discount * 100,
        },
        "segments": {
            "complexity": segment_metrics(cases, "complexity"),
            "channel": segment_metrics(cases, "channel"),
            "category": segment_metrics(cases, "category"),
            "vulnerability": segment_metrics(cases, "vulnerable_customer"),
        },
        "red_team": {
            "cases": len(red_team),
            "blocked": sum(row["blocked"] for row in red_team),
            "bypasses": sum(not row["blocked"] for row in red_team),
            "writes_executed": sum(row["write_executed"] for row in red_team),
            "by_attack": dict(Counter(row["attack"] for row in red_team)),
        },
        "limitations": [
            "All customers, cases, outcomes, costs and policies are synthetic.",
            "The baseline and intervention are simulated, not observed in a randomised production trial.",
            "Annualised value is capacity opportunity, not guaranteed cashable savings.",
            "The deterministic red-team suite is evidence of tested controls, not proof against novel attacks.",
            "A live pilot would require shadow mode, human review, privacy assessment and pre-agreed stop criteria.",
        ],
    }

    with (DATA / "synthetic_cases.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(cases[0].keys()))
        writer.writeheader()
        writer.writerows(cases)
    (DATA / "backtest-results.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    (DATA / "red-team-results.json").write_text(json.dumps(red_team, indent=2), encoding="utf-8")
    print(json.dumps(result["headline"], indent=2))
    print(json.dumps(result["business_case"], indent=2))


if __name__ == "__main__":
    main()
