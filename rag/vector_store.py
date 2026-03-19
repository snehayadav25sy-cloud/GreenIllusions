import faiss
import numpy as np

class VectorStore:
    def __init__(self, dim: int):
        self.dim = dim
        self.index = faiss.IndexFlatL2(dim)
        self.chunks = [] # Stores dicts: {'text': str, 'metadata': dict}

        print(f"[FAISS] Index created with dim = {dim}")

    def add(self, embeddings, chunks):
        """
        embeddings: List of embedding vectors
        chunks: List of chunk dictionaries {'text': ..., 'metadata': ...}
        """
        embeddings_array = np.array(embeddings, dtype="float32")

        # 🔒 HARD SAFETY CHECK
        if embeddings_array.shape[1] != self.dim:
            raise ValueError(
                f"Embedding dim mismatch: expected {self.dim}, "
                f"got {embeddings_array.shape[1]}"
            )

        self.index.add(embeddings_array)
        self.chunks.extend(chunks)

    def search(self, query_embedding, k=5):
        """
        Returns list of chunks (dicts with text and metadata).
        """
        query_array = np.array(query_embedding, dtype="float32").reshape(1, -1)

        # 🔒 QUERY DIMENSION CHECK
        if query_array.shape[1] != self.dim:
            raise ValueError(
                f"Query embedding dim mismatch: expected {self.dim}, "
                f"got {query_array.shape[1]}"
            )

        D, indices = self.index.search(query_array, k)
        
        # Filter results -1 means not found
        valid_indices = [i for i in indices[0] if i != -1 and i < len(self.chunks)]
        
        return [self.chunks[i] for i in valid_indices]
