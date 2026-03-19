import { ClaimResult } from "../types";

export function riskDistribution(results: ClaimResult[]) {
  const counts = { Low: 0, Medium: 0, High: 0 };

  results.forEach((r) => {
    const risk = r.analysis.risk_level;
    if (risk in counts) counts[risk as keyof typeof counts]++;
  });

  return [
    { name: "Low", value: counts.Low },
    { name: "Medium", value: counts.Medium },
    { name: "High", value: counts.High },
  ];
}

export function verdictCounts(results: ClaimResult[]) {
  const map: Record<string, number> = {};

  results.forEach((r) => {
    const v = r.analysis.final_verdict;
    map[v] = (map[v] || 0) + 1;
  });

  return Object.entries(map).map(([name, value]) => ({
    name,
    value,
  }));
}
