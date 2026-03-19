# from utils.llm_client import call_llm


# def extract_claims(text: str, provider: str = "ibm") -> str:
#     prompt = f"""
# You are a sustainability auditor.

# Extract all environmental or sustainability claims from the text.
# Return them as bullet points.

# TEXT:
# {text}
# """
#     return call_llm(prompt, provider)

def extract_claims(text, provider="ibm"):
    """
    Extract factual sustainability-related claims from ESG text.
    Returns a structured dictionary with at least one claim.
    """
    sentences = [s.strip() for s in text.split('.') if len(s.strip()) > 10]

    ESG_KEYWORDS = [
        "reduce", "emission", "carbon", "net zero", "net-zero",
        "sustainable", "renewable", "commit", "green", "eco",
        "water", "waste", "recycle", "energy", "climate",
        "offset", "biodiversity", "supply chain", "footprint",
        "certif", "report", "disclosure", "target", "goal",
        "plastic", "packaging", "zero", "100%", "percent",
    ]

    claims = [
        s for s in sentences
        if any(kw in s.lower() for kw in ESG_KEYWORDS)
    ]

    # Fallback: if no keyword match, treat the whole text as one claim
    if not claims:
        claims = [text.strip()]

    return {"claims": claims}

