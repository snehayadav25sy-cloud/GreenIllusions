import os
from rag.setup_rag import setup_rag
from rag.embedder import generate_embedding
from rag.bedrock_kb_retriever import retrieve_from_bedrock_kb

_vector_store = None

def get_vector_store():
    global _vector_store
    if _vector_store is None:
        _vector_store = setup_rag()
    return _vector_store

def retrieve_evidence(query: str, provider="aws", k=5):
    """
    Retrieve top-k evidence chunks for a query.

    Strategy:
    1. Try Bedrock Knowledge Base (if BEDROCK_KB_ID is set).
    2. Fallback to local FAISS Vector Store with local embeddings.
    """

    # 1. Try AWS Bedrock Knowledge Base
    kb_id = os.environ.get("BEDROCK_KB_ID")
    if provider == "bedrock-kb" or (provider == "aws" and kb_id):
        print(f"☁️ Attempting retrieval from Bedrock KB: {kb_id}...")
        results = retrieve_from_bedrock_kb(query, kb_id, n_results=k)
        if results is not None:
            print(f"✅ Bedrock KB returned {len(results)} results.")
            return results
        else:
            print("⚠️ Falling back to local FAISS index...")

    # 2. Fallback to Local FAISS
    try:
        vector_store = get_vector_store()
        query_embedding = generate_embedding(query, provider)
        return vector_store.search(query_embedding, k=k)
    except Exception as e:
        print(f"⚠️ [Retriever] FAISS search failed: {e}. Returning empty evidence.")
        return []
