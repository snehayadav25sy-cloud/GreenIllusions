from agents.orchestrator import run_analysis

text = """
We reduced carbon emissions by 30% between 2021 and 2023.
We are committed to a greener future through responsible innovation.
"""

output = run_analysis(text, provider="ibm")
print(output)
