from agents.claims_extraction_agent import extract_claims

text = "We are eco-friendly and committed to a greener future."

print("IBM:")
print(extract_claims(text, provider="ibm"))

print("\nAWS:")
print(extract_claims(text, provider="aws"))
