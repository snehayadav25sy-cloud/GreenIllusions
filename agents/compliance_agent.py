# agents/compliance_agent.py
from utils.llm_client import call_llm
import re

def check_compliance(claim: str, provider: str = "ibm") -> dict:
    """
    Checks the claim against major ESG regulations (FTC Green Guides, EU Green Claims Directive).
    Returns a compliance assessment.
    """
    
    prompt = f"""
    You are an ESG Compliance Officer. Evaluate the following sustainability claim against:
    1. FTC Green Guides (USA) - warns against broad, unqualified claims like "Eco-friendly".
    2. EU Green Claims Directive - requires specific, comparable, and verifiable data.
    
    Claim: "{claim}"
    
    Analyze if this claim violates any of these principles.
    
    Respond ONLY in this format:
    STATUS: COMPLIANT | NON_COMPLIANT | WARNING
    REASON: One concise sentence explaining the specific violation or compliance.
    """
    
    try:
        response = call_llm(prompt, provider).strip()
        
        status_match = re.search(r"STATUS:\s*(COMPLIANT|NON_COMPLIANT|WARNING)", response, re.IGNORECASE)
        reason_match = re.search(r"REASON:\s*(.+)", response, re.IGNORECASE | re.DOTALL)
        
        status = status_match.group(1).upper() if status_match else "WARNING"
        reason = reason_match.group(1).strip() if reason_match else "Could not determine compliance status."
        
        return {
            "compliance_status": status,
            "compliance_reason": reason
        }
        
    except Exception as e:
        print(f"⚠️ Compliance check failed: {e}")
        return {
            "compliance_status": "WARNING",
            "compliance_reason": "Compliance check failed due to technical error."
        }
