# from utils.llm_client import call_llm
# import json

# def detect_language_deception(text: str, provider: str = "ibm"):
#     """
#     Detects greenwashing-style language deception.
#     This agent analyzes ONLY wording, not factual accuracy.
#     """

#     prompt = f"""
# You are a Sustainability Language & Greenwashing Analyst.

# Analyze ONLY the language in the text below.
# Do NOT verify facts.
# Do NOT assume any external data.

# TEXT:
# \"\"\"{text}\"\"\"

# Check for:
# 1. Vague or non-measurable terms (e.g. "eco-friendly", "green", "responsible").
# 2. Emotional or aspirational framing without concrete action.
# 3. Missing metrics, timelines, or standards.
# 4. Lack of accountability or third-party validation.

# Rules:
# - If the sentence contains numbers, percentages, dates, or standards, deception is likely FALSE.
# - Be conservative. Do not over-flag.

# Respond ONLY in valid JSON using this exact structure:

# {{
#   "deceptive_language_detected": true or false,
#   "vague_terms": [],
#   "manipulation_type": [],
#   "explanation": ""
# }}

# The explanation must be at most 2 sentences.
# """

#     response = call_llm(prompt, provider)

#     try:
#         return json.loads(response)
#     except Exception:
#         return {
#             "deceptive_language_detected": False,
#             "vague_terms": [],
#             "manipulation_type": [],
#             "explanation": "Unable to confidently assess language deception."
#         }



# Hybrid logic for now

def detect_language_deception(text: str, provider: str = "ibm"):
    vague_keywords = [
        "green", "greener", "sustainable", "sustainability",
        "responsible", "eco-friendly", "future", "tomorrow"
    ]

    manipulation_type = []
    vague_terms = []

    text_lower = text.lower()

    for word in vague_keywords:
        if word in text_lower:
            vague_terms.append(word)

    has_numbers = any(char.isdigit() for char in text)

    if vague_terms and not has_numbers:
        manipulation_type.append("vague language")
        manipulation_type.append("aspirational framing")

        return {
            "deceptive_language_detected": True,
            "vague_terms": vague_terms,
            "manipulation_type": manipulation_type,
            "explanation": "The statement uses aspirational or vague sustainability language without measurable commitments."
        }

    return {
        "deceptive_language_detected": False,
        "vague_terms": [],
        "manipulation_type": [],
        "explanation": "The statement includes concrete or measurable information."
    }
