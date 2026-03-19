from rag.retriever import retrieve_evidence
import json

def test_retrieval():
    query = "carbon emissions"
    print(f"🔍 Testing retrieval for query: '{query}'")
    
    # Retrieve with metadata
    results = retrieve_evidence(query, k=3)
    
    print(f"\n✅ Found {len(results)} results.\n")
    
    for i, res in enumerate(results, start=1):
        print(f"--- Result {i} ---")
        print(f"📄 Text: {res['text'][:100]}...")
        print(f"🏷️ Metadata: {json.dumps(res.get('metadata', {}), indent=2)}")
        
        # Verify metadata keys present
        meta = res.get('metadata', {})
        if "source" in meta and "page" in meta:
           print("✅ Metadata verified.")
        else:
           print("❌ Missing metadata fields.")
           
if __name__ == "__main__":
    test_retrieval()
