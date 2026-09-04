import type { Opportunity } from "./types";

export function scoreOpportunity(input: Omit<Opportunity, "score" | "recommendation">): Opportunity {
  const raw = input.value * 0.32 + input.feasibility * 0.26 + input.evidence * 0.22 + (6 - input.risk) * 0.2;
  const score = Math.round(raw * 20);
  const recommendation = score >= 76 && input.risk <= 3 ? "Accelerate" : score >= 60 ? "Incubate" : "Monitor";
  return { ...input, score, recommendation };
}

export function calculateBusinessCase(inputs: {
  annualCases: number;
  minutesSaved: number;
  hourlyCost: number;
  repeatContactsAvoided: number;
  contactCost: number;
  yearOneCost: number;
}) {
  const capacityValue = (inputs.annualCases * inputs.minutesSaved * inputs.hourlyCost) / 60;
  const repeatContactValue = inputs.repeatContactsAvoided * inputs.contactCost;
  const grossValue = capacityValue + repeatContactValue;
  return {
    capacityValue,
    repeatContactValue,
    grossValue,
    netValue: grossValue - inputs.yearOneCost,
    paybackMonths: (inputs.yearOneCost / grossValue) * 12,
  };
}
