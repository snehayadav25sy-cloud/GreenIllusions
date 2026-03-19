# print(">>> FILE LOADED <<<")

# from agents.evidence_verification_agent import verify_claim

# print(">>> IMPORTS DONE <<<")

# def main():
#     print(">>> main() started <<<")
#     claim = "IBM is involved in AI and sustainability."
#     result = verify_claim(claim, provider="ibm")
#     print(">>> verify_claim returned <<<")
#     print(result)

# if __name__ == "__main__":
#     main()

# test_evidence_agent.py

from agents.evidence_verification_agent import verify_claim

def main():
    claim = "Volkswagen contributes to the circular economy"
    result = verify_claim(claim, provider="ibm")

    print("\n=== Evidence Verification Result ===")
    print("Claim:", result["claim"])
    print("Verdict:", result["verdict"])
    print("Explanation:", result["explanation"])
    print("\nEvidence Chunks:")
    for e in result["evidence"]:
        print("-", e[:200], "...")

if __name__ == "__main__":
    main()
