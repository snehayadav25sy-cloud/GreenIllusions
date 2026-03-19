export interface ClaimResult {
  claim: string;
  analysis: {
    final_verdict: string;
    risk_level: string;
    explanation: string;
  };
}

export interface AnalysisResponse {
  total_claims_analyzed: number;
  results: ClaimResult[];
}
