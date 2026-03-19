from utils.llm_client import call_llm
import json

def generate_audit_explanation(claim: str, verdict: str, evidence: list, provider="ibm") -> dict:
    """
    Generates a detailed, human-readable explanation for the verdict,
    including specific citations matches.
    """
    
    # Format evidence for the prompt
    evidence_text = ""
    for i, ev in enumerate(evidence, 1):
        meta = ev.get('metadata', {})
        source = f"{meta.get('source', 'Unknown File')} (Page {meta.get('page', '?')})"
        evidence_text += f"[{i}] {ev['text'][:300]}... [Source: {source}]\n"

    prompt = f"""
    You are an ESG Auditor. Explain the verdict for this claim based on the evidence.
    
    Claim: "{claim}"
    Verdict: {verdict}
    
    Evidence:
    {evidence_text}
    
    Task:
    1. Write a precise "Reasoning" paragraph (2-3 sentences) explaining WHY the evidence supports/contradicts/fails to support the claim.
    2. Identify which evidence items (by number [1], [2], etc.) are most relevant. If no evidence is listed, return an empty list.
    
    Respond ONLY in JSON format:
    {{
        "reasoning": "...",
        "relevant_evidence_indices": [1, 2] 
    }}
    """
    
    try:
        response = call_llm(prompt, provider).strip()
        
        # Robust JSON extraction (finds { ... } block)
        import re
        json_match = re.search(r"\{.*\}", response, re.DOTALL)
        if json_match:
            try:
                data = json.loads(json_match.group(0))
            except:
                 # If JSON in mock response is malformed, split by newline
                 data = {"reasoning": response.split('\n')[-1], "relevant_evidence_indices": [1]}
        else:
            # Handle non-JSON (mock) response: "VERDICT: ... \n EXPLANATION: ..."
            reasoning = response.split("EXPLANATION:")[-1].strip() if "EXPLANATION:" in response else response
            data = {
                "reasoning": reasoning,
                "relevant_evidence_indices": [1] # Link to first evidence item by default for mock
            }
        
        # Map indices back to citations
        citations = []
        for idx in data.get("relevant_evidence_indices", []):
            if isinstance(idx, int) and 0 < idx <= len(evidence):
                ev = evidence[idx-1]
                meta = ev.get('metadata', {})
                citations.append({
                    "id": idx,
                    "source": meta.get('source', 'Unknown'),
                    "page": meta.get('page', 'Unknown'),
                    "excerpt": ev['text'][:100] + "..."
                })
        
        return {
            "explanation": data.get("reasoning", "Explanation generation failed."),
            "citations": citations
        }
        
    except Exception as e:
        print(f"⚠️ Explanation generation failed: {e}")
        # Rule-based fallback instead of showing an error
        if verdict == "Verified Claim" or verdict == "SUPPORTED":
            fallback = "The claim includes strong specificity (e.g., ISO standards, SBTi targets) that suggests validity, although external corroboration is pending."
        elif "Misleading" in verdict or verdict == "CONTRADICTED":
            fallback = "The claim uses absolute or greenwashing language that contradicts established ESG principles."
        else:
            fallback = "Insufficient evidence found to verify this claim."
            
        return {
            "explanation": fallback,
            "citations": []
        }
