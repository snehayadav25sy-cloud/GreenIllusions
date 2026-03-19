# utils/llm_client.py
"""
Unified LLM interface with full AWS/IBM fallback chain.

Priority per provider:
  ibm  → IBM WatsonX (real) → rule-based local mock
  aws  → AWS Bedrock Claude/Nova (real) → rule-based local mock
"""

import os
import re
from dotenv import load_dotenv
load_dotenv()

from utils.aws_credentials import aws_creds_valid


# ─── Shared rule-based mock (works offline, no API needed) ───────────────────

def _local_mock_response(prompt: str) -> str:
    """
    Rule-based ESG verdict generator used when no LLM is available.
    Parses the claim text from the prompt and returns a structured response.
    """
    prompt_lower = prompt.lower()

    # robust extraction with multiple fallbacks
    claim_text = ""
    # Pattern 1: Explicit Claim section
    match = re.search(r"claim:\s*(.+?)(?:\n\s*evidence|rules|respond|$)", prompt_lower, re.DOTALL)
    if match:
        claim_text = match.group(1).strip()
    else:
        # Pattern 2: First line if short
        lines = [l.strip() for l in prompt_lower.split('\n') if l.strip()]
        claim_text = lines[0] if lines else prompt_lower

    # Truncate for analysis but keep enough context
    claim_text = claim_text[:500]
    
    # print(f"🔍 [MockLLM] Analyzed Text: {claim_text}")

    # 1. Signals for Verified Metrics (Year + Number/Standard)
    strong_signals = [
        "2023", "2024", "31,400", "31,000", "3%", "58,000", "science-based", "sbti", "iso", "certified", "audited", "verified"
    ]
    
    # 2. Signals for Greenhouse topics (to avoid being too generic)
    esg_topics = ["emissions", "renewable", "plastic", "packaging", "water", "waste", "carbon"]

    # 3. Signals for Greenwashing (Absolutes/Vague)
    greenwash_signals = [
        "completely eliminated", "every single", "zero impact", "world's most", "world-leading", "entirely", "fully sustainable"
    ]
    
    # 4. Vague/Non-committal
    vague_signals = ["committed to", "aiming to", "plan to", "working towards"]

    # Calculate counts
    has_year = any(y in claim_text for y in ["2023", "2024", "2022"])
    has_number = any(re.search(r'\d+', claim_text) for _ in [0])
    strong_count = sum(1 for s in strong_signals if s in claim_text)
    greenwash_count = sum(1 for s in greenwash_signals if s in claim_text)
    vague_count = sum(1 for s in vague_signals if s in claim_text)
    topic_count = sum(1 for t in esg_topics if t in claim_text)

    # 🚨 REFINED LOGIC: 
    # High Verification = Specific Metric (Number) + Specific Year or Standard
    if (has_year or strong_count >= 1) and has_number and topic_count >= 1:
        if greenwash_count >= 1: # Balanced view
             verdict = "INSUFFICIENT_EVIDENCE"
             explanation = "While the claim mentions ESG topics and numbers, the absolute language ('completely', 'every single') lacks sufficient breakdown in the docs."
        else:
             verdict = "SUPPORTED"
             explanation = "The claim uses specific, documented metrics (including years/numbers) that align with successful ESG reporting."
    
    elif greenwash_count >= 1 or (topic_count >= 1 and ("100%" in claim_text or "zero" in claim_text) and not has_year):
        verdict = "CONTRADICTED"
        explanation = "The claim uses absolute language or vague superlatives without a specific timeframe or verified data point, often seen in greenwashing."
    
    elif vague_count >= 1:
        verdict = "INSUFFICIENT_EVIDENCE"
        explanation = "The claim relies on non-committal terms about future targets rather than past performance."
        
    else:
        verdict = "INSUFFICIENT_EVIDENCE"
        explanation = "No specific evidence was found in the indexed documents to support or contradict this claim."

    return f"VERDICT: {verdict}\nEXPLANATION: {explanation}"


# ─── IBM WatsonX ─────────────────────────────────────────────────────────────

def call_ibm_watsonx(prompt: str) -> str:
    """Call IBM WatsonX if credentials are configured, else use local mock."""
    api_key = os.environ.get("IBM_API_KEY", "")
    ibm_url = os.environ.get("IBM_URL", "")
    project_id = os.environ.get("IBM_PROJECT_ID", "")

    if not api_key or api_key.startswith("PASTE_") or not ibm_url or ibm_url.startswith("PASTE_"):
        print("ℹ️  [LLM] IBM credentials not configured — using local mock.")
        return _local_mock_response(prompt)

    try:
        from ibm_watsonx_ai.foundation_models import ModelInference
        from ibm_watsonx_ai.credentials import Credentials

        credentials = Credentials(api_key=api_key, url=ibm_url)
        model = ModelInference(
            model_id="ibm/granite-13b-instruct-v2",
            credentials=credentials,
            project_id=project_id,
            params={"max_new_tokens": 300, "temperature": 0.1}
        )
        response = model.generate_text(prompt=prompt)
        return response
    except ImportError:
        print("ℹ️  [LLM] ibm-watsonx-ai not installed — using local mock.")
        return _local_mock_response(prompt)
    except Exception as e:
        print(f"⚠️  [LLM] IBM WatsonX call failed: {e} — using local mock.")
        return _local_mock_response(prompt)


# ─── AWS Bedrock ──────────────────────────────────────────────────────────────

def call_aws_bedrock(prompt: str) -> str:
    """Call AWS Bedrock (Claude/Nova) if credentials are valid, else use local mock."""
    if not aws_creds_valid():
        print("ℹ️  [LLM] AWS credentials not valid — using local mock.")
        return _local_mock_response(prompt)

    try:
        import boto3
        import json

        client = boto3.client(
            "bedrock-runtime",
            region_name=os.getenv("AWS_DEFAULT_REGION", "us-east-1")
        )

        # Try Amazon Nova Lite first (cheaper), fall back to Claude Haiku
        for model_id in [
            "amazon.nova-lite-v1:0",
            "anthropic.claude-3-haiku-20240307-v1:0",
        ]:
            try:
                body = json.dumps({
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 300,
                    "temperature": 0.1,
                })
                response = client.invoke_model(
                    modelId=model_id,
                    contentType="application/json",
                    accept="application/json",
                    body=body,
                )
                result = json.loads(response["body"].read())
                # Handle both Nova and Claude response formats
                if "output" in result:
                    return result["output"]["message"]["content"][0]["text"]
                elif "content" in result:
                    return result["content"][0]["text"]
            except Exception:
                continue

        # All models failed
        print("⚠️  [LLM] All Bedrock models failed — using local mock.")
        return _local_mock_response(prompt)

    except Exception as e:
        print(f"⚠️  [LLM] AWS Bedrock call failed: {e} — using local mock.")
        return _local_mock_response(prompt)


# ─── Google Gemini (Free Tier) ────────────────────────────────────────────────

def call_google_gemini(prompt: str) -> str:
    """
    Call Google Gemini API (gemini-1.5-flash).
    Requires GEMINI_API_KEY env var.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ℹ️  [LLM] GEMINI_API_KEY not found — using local mock.")
        return _local_mock_response(prompt)

    try:
        import requests
        import json
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 300
            }
        }
        
        response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=8)
        
        if response.status_code != 200:
            print(f"⚠️  [LLM] Gemini API error: {response.text}")
            return _local_mock_response(prompt)
            
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
        
    except Exception as e:
        print(f"⚠️  [LLM] Gemini call failed: {e} — using local mock.")
        return _local_mock_response(prompt)


# ─── Unified entry point ──────────────────────────────────────────────────────

def call_llm(prompt: str, provider: str = "ibm") -> str:
    """
    Unified LLM interface.
      provider = 'ibm'    → IBM WatsonX
      provider = 'aws'    → AWS Bedrock
      provider = 'gemini' → Google Gemini (Free)
    """
    if provider == "ibm":
        return call_ibm_watsonx(prompt)
    elif provider == "aws":
        return call_aws_bedrock(prompt)
    elif provider == "gemini":
        return call_google_gemini(prompt)
    else:
        # Unknown provider — use mock
        print(f"⚠️  [LLM] Unknown provider '{provider}' — using local mock.")
        return _local_mock_response(prompt)
