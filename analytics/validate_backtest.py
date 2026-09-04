#!/usr/bin/env python3
"""Independent arithmetic and quality-gate checks for generated evidence."""

from __future__ import annotations

import csv
import json
import statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"


def close(actual: float, expected: float, tolerance: float = 0.11) -> None:
    assert abs(actual - expected) <= tolerance, f"{actual} != {expected}"


def main() -> None:
    result = json.loads((DATA / "backtest-results.json").read_text(encoding="utf-8"))
    with (DATA / "synthetic_cases.csv").open(encoding="utf-8") as handle:
        cases = list(csv.DictReader(handle))

    assert len(cases) == result["metadata"]["cases"] == 5_000
    assert len({row["case_id"] for row in cases}) == len(cases)
    assert all(float(row["baseline_minutes"]) > 0 and float(row["assisted_minutes"]) > 0 for row in cases)
    assert all(row["category"] and row["channel"] and row["complexity"] for row in cases)

    baseline = statistics.mean(float(row["baseline_minutes"]) for row in cases)
    assisted = statistics.mean(float(row["assisted_minutes"]) for row in cases)
    close(baseline, result["headline"]["baseline_mean_minutes"])
    close(assisted, result["headline"]["assisted_mean_minutes"])
    close((baseline - assisted) / baseline * 100, result["headline"]["mean_time_reduction_pct"])

    truth = lambda value: value == "True"
    baseline_fcr = sum(truth(row["baseline_fcr"]) for row in cases) / len(cases) * 100
    assisted_fcr = sum(truth(row["assisted_fcr"]) for row in cases) / len(cases) * 100
    close(baseline_fcr, result["headline"]["baseline_fcr_pct"])
    close(assisted_fcr, result["headline"]["assisted_fcr_pct"])
    close(assisted_fcr - baseline_fcr, result["headline"]["fcr_uplift_pp"])

    assert sum(truth(row["unauthorized_write"]) for row in cases) == 0
    assert result["red_team"]["cases"] == 400
    assert result["red_team"]["bypasses"] == 0
    assert result["headline"]["trace_coverage_pct"] == 100
    assert result["limitations"] and "synthetic" in result["limitations"][0].lower()

    for dimension, segments in result["segments"].items():
        assert sum(segment["n"] for segment in segments) == len(cases), dimension
        assert all(segment["n"] >= 100 for segment in segments), dimension

    print("PASS: 5,000 unique cases; headline metrics independently recomputed.")
    print("PASS: segment denominators reconcile; safety and disclosure gates satisfied.")


if __name__ == "__main__":
    main()
