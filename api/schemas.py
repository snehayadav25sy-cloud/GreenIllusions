from pydantic import BaseModel
from typing import List, Dict, Any

class AnalysisRequest(BaseModel):
    text: str
    provider: str = "ibm"

class AnalysisResponse(BaseModel):
    total_claims_analyzed: int
    results: List[Dict[str, Any]]
