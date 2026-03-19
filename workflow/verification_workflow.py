from agents.claims_extraction_agent import extract_claims
from agents.evidence_verification_agent import verify_claim
from agents.language_deception_agent import detect_language_deception
from agents.compliance_agent import check_compliance
from agents.verdict_agent import generate_final_verdict
from audit.explanation import generate_audit_explanation
from audit.scoring import calculate_confidence_score
from rag.retriever import retrieve_evidence   # ← was missing, caused NameError

# AWS Services
from db.dynamo import save_claim_analysis
from utils.cloudwatch_logger import CloudWatchLogger

class VerificationWorkflow:
    def __init__(self, provider="aws"):
        self.provider = provider
        self.context = {}
        # Initialize Logger
        self.logger = CloudWatchLogger()

    def run(self, claim: str):
        """
        Executes the full verification pipeline for a single claim.
        """
        self.logger.log(f"🚀 Starting verification for claim: '{claim[:50]}...'")
        
        # Standardized Shared State Object
        self.context = {
            "claim": claim,
            "evidence": [],
            "verdict": "",
            "confidence": 0.0,
            "explanation": "",
            "citations": [],
            "compliance": {},
            "trace": []
        }
        
        # Step 1: Normalization
        self.normalize_claim()
        
        # Step 2: Evidence Retrieval
        self.retrieve_data()
        
        # Step 3: Analysis (Verification + Language + Compliance)
        self.analyze()
        
        # Step 4: Verdict, Explanation & Confidence (Audit Layer)
        self.synthesize_verdict()
        
        result_payload = {
            "claim": self.context["claim"],
            "analysis": {
                "final_verdict": self.context["verdict"],
                "risk_level": self._derive_risk(self.context["verdict"]),
                "explanation": self.context["explanation"],
                "confidence": self.context["confidence"],
                "compliance_check": self.context["compliance"],
                "citations": self.context["citations"],
                "trace": self.context["trace"]
            }
        }
        
        # AWS Integration: LOG & SAVE
        self.logger.log(f"🏁 Finished verification. Verdict: {self.context['verdict']}")
        save_claim_analysis(result_payload)
        
        return result_payload

    def normalize_claim(self):
        """Step 1: Clean and prepare the claim text."""
        self.context["claim"] = self.context["claim"].strip()
        self._add_trace("Normalized claim.")

    def retrieve_data(self):
        """Step 2: Retrieve evidence from RAG."""
        query = self.context["claim"]
        evidence_chunks = retrieve_evidence(query, self.provider, k=5)
        # Store in shared context
        self.context["evidence"] = evidence_chunks
        self._add_trace(f"Retrieved {len(evidence_chunks)} evidence chunks.")

    def analyze(self):
        """Step 3: Run specific agentic checks."""
        claim = self.context["claim"]
        self.logger.log("Running analysis agents...")
        
        # Core checks
        self.context["evidence_result"] = verify_claim(claim, self.provider)
        self.context["language_result"] = detect_language_deception(claim, self.provider)
        self.context["compliance"] = check_compliance(claim, self.provider)
        
        self._add_trace("Completed Agent Analysis (Verification, Language, Compliance).")

    def synthesize_verdict(self):
        """Step 4: Combine results using Audit Layer."""
        evidence_result = self.context.get("evidence_result", {})
        language_result = self.context.get("language_result", {})
        compliance = self.context.get("compliance", {})
        
        # 1. Base Verdict
        final_result = generate_final_verdict(evidence_result, language_result)
        self.context["verdict"] = final_result["final_verdict"]
        
        # 2. Audit Explanation (The "Why")
        audit_exp = generate_audit_explanation(
            self.context["claim"], 
            self.context["verdict"], 
            self.context["evidence"],
            self.provider
        )
        self.context["explanation"] = audit_exp["explanation"]
        self.context["citations"] = audit_exp["citations"]
        
        # 3. Confidence Scoring (The "Trust")
        self.context["confidence"] = calculate_confidence_score(
            verdict=self.context["verdict"],
            risk_level=final_result["risk_level"],
            compliance_status=compliance.get("compliance_status", "WARNING"),
            evidence_count=len(self.context["evidence"])
        )
        
        self._add_trace("Synthesized Verdict, Explanation, and Confidence Score.")

    def _derive_risk(self, verdict):
        """Helper to map verdict back to risk level for API consistency."""
        if verdict == "Verified Claim": return "Low"
        if "Misleading" in verdict or "Greenwashing" in verdict: return "High"
        return "Medium"
        
    def _add_trace(self, message):
        self.context["trace"].append(message)
        # Log granular trace
        self.logger.log(f"Trace: {message}")
