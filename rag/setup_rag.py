import os
import pickle
from rag.vector_store import VectorStore
from rag.document_loader import load_documents
from rag.chunker import chunk_text

def setup_rag():
    """
    Load ESG documents, chunk them, embed them, and store in FAISS.
    The VectorStore dimension is determined dynamically from the first embedding
    so it works correctly whether Bedrock (1536-dim) or local (384-dim) is used.
    """
    cache_path = os.path.join("data", "embeddings_cache.pkl")

    # ⚡ QUICK CACHE CHECK: If all files in esg_docs match the cache, return immediately
    if os.path.exists(cache_path):
        try:
            with open(cache_path, "rb") as f:
                data = pickle.load(f)
                cached_chunks = data["chunks"]
                # Convert list to list if it was a weird structure
                cached_embeddings = data.get("embeddings", [])
                
                # Check for sources more robustly
                cached_sources = set()
                for c in cached_chunks:
                    src = c.get("metadata", {}).get("source")
                    if src: cached_sources.add(src)
                
                # Compare filenames (lenient check: just filenames, no full paths)
                current_files = set(f for f in os.listdir("data/esg_docs") if f.endswith(".txt"))
                
                if current_files.issubset(cached_sources) and len(cached_sources) > 0:
                    print(f"⚡ Index is already cached ({len(cached_chunks)} chunks). Bypassing indexing.")
                    from rag.embedder import DIM
                    vector_store = VectorStore(dim=DIM)
                    if cached_embeddings:
                        vector_store.add(cached_embeddings, cached_chunks)
                    return vector_store
                else:
                    print(f"🔄 Documents added or changed. Refreshing index...")
        except Exception as e:
            print(f"⚠️ Cache read issue: {e}. Re-indexing...")

    # If no cache or stale, start full processing
    print("🔄 Loading documents...")
    documents = load_documents("data/esg_docs")

    all_chunks = []
    all_embeddings = []

    # If no cache, process from scratch
    print(f"📊 Processing {len(documents)} documents...")

    # Import here so DIM is read after the module is loaded
    from rag.embedder import generate_embedding

    total_chunks = 0
    
    for i, doc in enumerate(documents):
        chunks = chunk_text(doc)
        print(f"   📄 Processing doc {i+1}/{len(documents)}: {doc.get('metadata', {}).get('source', 'unknown')} ({len(chunks)} chunks)...")
        
        for chunk in chunks:
            if chunk["text"].strip():
                embedding = generate_embedding(chunk["text"])
                all_chunks.append(chunk)
                all_embeddings.append(embedding)
                total_chunks += 1

    # Save to cache
    try:
        with open(cache_path, "wb") as f:
            pickle.dump({
                "chunks": all_chunks,
                "embeddings": all_embeddings
            }, f)
        print(f"💾 Saved embeddings to cache: {cache_path}")
    except Exception as e:
        print(f"⚠️ Failed to save cache: {e}")

    # Read DIM *after* embeddings are generated (it may have been updated)
    from rag.embedder import DIM
    vector_store = VectorStore(dim=DIM)

    if all_chunks:
        vector_store.add(all_embeddings, all_chunks)
        print(f"✅ Indexed {len(all_chunks)} chunks from {len(documents)} documents (dim={DIM})")
    else:
        print("⚠️ No chunks to index.")

    return vector_store


if __name__ == "__main__":
    setup_rag()
