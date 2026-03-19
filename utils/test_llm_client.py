from utils.llm_client import call_llm

prompt = "Respond with exactly this word: WORKING"

print("IBM TEST:")
print(call_llm(prompt, provider="ibm"))

print("\nAWS TEST:")
print(call_llm(prompt, provider="aws"))


# utils/test_llm_client.py

# from utils.llm_client import call_llm

# def main():
#     prompt = "Explain ESG in one sentence."

#     print("=== IBM Watsonx ===")
#     try:
#         result_ibm = call_llm(prompt, provider="ibm")
#         print(result_ibm)
#     except Exception as e:
#         print("IBM Watsonx error:", e)

#     print("\n=== AWS Bedrock ===")
#     try:
#         result_aws = call_llm(prompt, provider="aws")
#         print(result_aws)
#     except Exception as e:
#         print("AWS Bedrock error:", e)

# if __name__ == "__main__":
#     main()
