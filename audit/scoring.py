def calculate_confidence_score(verdict: str, risk_level: str, compliance_status: str, evidence_count: int) -> float:
    """
    Calculates a confidence score (0.0 - 1.0) based on multiple factors.
    """
    
    base_score = 0.5
    
    # 1. Verdict Strength
    if verdict == "Verified Claim":
        base_score = 0.8
    elif verdict == "Misleading Claim":
        base_score = 0.9  # High confidence it's false
    elif verdict == "Potential Greenwashing":
        base_score = 0.7
    elif verdict == "Unverified Claim":
        base_score = 0.3
    
    # 2. Risk Adjustment
    if risk_level == "Low":
        base_score += 0.1
    elif risk_level == "High":
        base_score += 0.05 # Confidence in high risk is good
        
    # 3. Compliance Adjustment
    if compliance_status == "NON_COMPLIANT":
        base_score -= 0.15 # Conflicting signals (Verified but Illegal?)
    elif compliance_status == "WARNING":
        base_score -= 0.05
        
    # 4. Evidence Quantity (Simple heuristic)
    if evidence_count == 0:
        base_score = 0.1 # No evidence = Low confidence
    elif evidence_count >= 3:
        base_score += 0.05
        
    # Cap at 0.98 (Leave room for doubt)
    return min(max(base_score, 0.1), 0.98)
