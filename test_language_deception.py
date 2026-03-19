from agents.language_deception_agent import detect_language_deception

tests = [
    "We are committed to a greener future through responsible innovation.",
    "The company reduced carbon emissions by 30% between 2021 and 2023.",
    "We aim to build a sustainable tomorrow for all stakeholders."
]

for text in tests:
    print("\nTEXT:", text)
    print("IBM RESULT:")
    print(detect_language_deception(text, provider="ibm"))
    print("AWS RESULT:")
    print(detect_language_deception(text, provider="aws"))
