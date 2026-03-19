import os
import boto3

def verify_kb_access():
    kb_id = os.environ.get("BEDROCK_KB_ID")
    region = os.environ.get("AWS_DEFAULT_REGION", "us-east-1")
    
    print(f"🔍 Verifying Bedrock Knowledge Base Configuration...")
    print(f"   Region: {region}")
    print(f"   KB ID: {kb_id if kb_id else 'Not Set (Will use FAISS Fallback)'}")
    
    if not kb_id:
        print("\n⚠️ BEDROCK_KB_ID is not set.")
        print("   To use AWS Knowledge Base, set this environment variable.")
        print("   Otherwise, the system will use the local FAISS index.")
        return

    try:
        client = boto3.client('bedrock-agent', region_name=region)
        response = client.get_knowledge_base(knowledgeBaseId=kb_id)
        
        status = response['knowledgeBase']['status']
        print(f"\n✅ Found Knowledge Base: {response['knowledgeBase']['name']}")
        print(f"   Status: {status}")
        
        if status == 'ACTIVE':
            print("🚀 Ready for retrieval!")
        else:
            print("⚠️ Knowledge base is not active. Retrieval may fail.")
            
    except Exception as e:
        print(f"\n❌ Failed to access Knowledge Base: {e}")
        print("   Check your AWS credentials and permissions.")

if __name__ == "__main__":
    verify_kb_access()
