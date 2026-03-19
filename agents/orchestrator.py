#orchestrator.py

# from agents.claims_extraction_agent import extract_claims
# from agents.evidence_verification_agent import verify_claim
# from agents.language_deception_agent import detect_language_deception
# from agents.verdict_agent import generate_final_verdict
# from agents.verdict_agent import generate_verdict_explanation

# # ✅ GLOBAL STORE (used by analytics)
# LAST_ORCHESTRATOR_RESULT = {}


# def run_analysis(esg_text, provider="ibm"):
#     claims_response = extract_claims(esg_text, provider)
#     claims = claims_response.get("claims", [])

#     results = []

#     for claim in claims:
#         evidence_result = verify_claim(claim, provider)
#         language_result = detect_language_deception(claim, provider)

#         final_result = generate_final_verdict(
#             evidence_result,
#             language_result
#         )

#         explanation = generate_verdict_explanation(
#             evidence_verdict=evidence_result["verdict"],
#             language_flag=language_result["deceptive_language_detected"],
#             vague_terms=language_result.get("vague_terms", [])
#         )

#         final_result["explanation"] = explanation

#         results.append({
#             "claim": claim,
#             "analysis": final_result
#         })

#     result = {
#         "total_claims_analyzed": len(claims),
#         "results": results
#     }

#     # 🔥 THIS IS THE FIX
#     global LAST_ORCHESTRATOR_RESULT
#     LAST_ORCHESTRATOR_RESULT = result
    
#     print("🔥 ORCHESTRATOR STATE UPDATED:", LAST_ORCHESTRATOR_RESULT)
#     return result

# agents/orchestrator.py
# agents/orchestrator.py

from agents.claims_extraction_agent import extract_claims
from workflow.verification_workflow import VerificationWorkflow

# GLOBAL STORE
LAST_ORCHESTRATOR_RESULT = None


def run_analysis(esg_text: str, provider: str = "ibm"):
    global LAST_ORCHESTRATOR_RESULT
    
    import time
    start_time = time.time()

    # 1. Extract Claims
    claims_response = extract_claims(esg_text, provider)
    claims = claims_response.get("claims", [])

    results = []
    
    # 2. Run Workflow for each claim
    workflow = VerificationWorkflow(provider)

    for claim in claims:
        # Run the explicit workflow
        analysis_result = workflow.run(claim)
        results.append(analysis_result)

    # STORE RESULT FOR ANALYTICS
    LAST_ORCHESTRATOR_RESULT = {
        "total_claims_analyzed": len(results),
        "results": results,
    }

    return LAST_ORCHESTRATOR_RESULT
