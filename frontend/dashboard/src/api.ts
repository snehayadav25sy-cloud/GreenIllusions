import { AnalysisResponse } from "./types";

export async function analyzeESG(
  text: string,
  provider: string
): Promise<AnalysisResponse> {
  const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, provider }),
  });

  if (!response.ok) {
    throw new Error("Backend API failed");
  }

  return response.json();
}

export async function fetchAnalytics() {
  const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
  const response = await fetch(`${API_BASE}/analytics`);

  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return response.json();
}
