#agents/verdict_agent.py

# def generate_final_verdict(evidence_result, language_result):
#     evidence_status = evidence_result.get("status")
#     deceptive = language_result.get("deceptive_language_detected")

#     if evidence_status == "Supported" and not deceptive:
#         verdict = "Trustworthy"
#         risk = "Low"

#     elif evidence_status != "Supported" and deceptive:
#         verdict = "Greenwashing"
#         risk = "High"

#     elif evidence_status == "Supported" and deceptive:
#         verdict = "Misleading Framing"
#         risk = "Medium"

#     else:
#         verdict = "Unverified Claim"
#         risk = "Medium"

#     return {
#         "final_verdict": verdict,
#         "risk_level": risk,
#         "evidence_analysis": evidence_result,
#         "language_analysis": language_result
#     }

# verdict_agent.py
def generate_verdict_explanation(
    evidence_verdict: str,
    language_flag: bool,
    vague_terms: list
) -> str:
    """
    Generate a concise, human-readable explanation for the final verdict.
    """

    if evidence_verdict == "SUPPORTED" and not language_flag:
        return (
            "The claim is supported by concrete evidence from verified ESG disclosures "
            "and uses clear, measurable language."
        )

    if evidence_verdict == "SUPPORTED" and language_flag:
        return (
            "Although evidence exists, the claim relies on vague or aspirational language "
            "that may exaggerate sustainability intent."
        )

    if evidence_verdict == "CONTRADICTED":
        return (
            "Available ESG evidence contradicts the claim, indicating a potential case of misrepresentation."
        )

    if evidence_verdict == "INSUFFICIENT_EVIDENCE":
        return (
            "No verifiable ESG evidence was found to substantiate this claim."
        )

    if language_flag:
        return (
            f"The claim uses vague or non-committal terms such as {', '.join(vague_terms)}, "
            "which may indicate greenwashing."
        )

    return "The claim could not be conclusively verified based on available data."

def generate_final_verdict(evidence_result: dict, language_result: dict) -> dict:
    """
    Combine evidence verification + language deception results
    into a final sustainability risk verdict.
    """

    evidence_verdict = evidence_result.get("verdict")
    language_flag = language_result.get("deceptive_language_detected", False)

    # Rule-based verdict logic (aligned with user's 3-category model)
    if evidence_verdict == "SUPPORTED" and not language_flag:
        return {
            "final_verdict": "Verified Claim",
            "risk_level": "Low",
            "evidence_analysis": evidence_result,
            "language_analysis": language_result
        }

    # "Partially Verified" covers cases where there is some evidence but issues (deception) or explicit insufficiency
    if (evidence_verdict == "SUPPORTED" and language_flag) or evidence_verdict == "INSUFFICIENT_EVIDENCE":
        return {
            "final_verdict": "Unsupported / Partially Verified",
            "risk_level": "Medium",
            "evidence_analysis": evidence_result,
            "language_analysis": language_result
        }

    # "Misleading / Greenwashing" covers contradictions
    if evidence_verdict == "CONTRADICTED":
        return {
            "final_verdict": "Misleading / Greenwashing",
            "risk_level": "High",
            "evidence_analysis": evidence_result,
            "language_analysis": language_result
        }

    # Fallback
    return {
        "final_verdict": "Unsupported / Partially Verified",
        "risk_level": "Medium",
        "evidence_analysis": evidence_result,
        "language_analysis": language_result
    }
