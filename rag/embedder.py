"""
Local embedder — zero external dependencies beyond numpy.

Priority:
  1. sentence-transformers (all-MiniLM-L6-v2, 384-dim) — if installed
  2. TF-IDF style numpy embedding (384-dim) — always available
  3. Hash fallback (384-dim) — last resort

Bedrock is only tried when AWS_ACCESS_KEY_ID is set AND credentials are valid.
"""

import os
import re
import math
import hashlib
import numpy as np
from typing import List

# Titan Embeddings v1 = 1536 dimensions
BEDROCK_DIM = 1536
# Local embedding dimension (matches sentence-transformers all-MiniLM-L6-v2)
LOCAL_DIM = 384

from utils.aws_credentials import aws_creds_valid as _check_aws_creds

# Active dimension — updated when first embedding is generated
DIM = LOCAL_DIM

_local_model = None   # sentence-transformers model (lazy-loaded)

# ─── Vocabulary for TF-IDF style embedding ────────────────────────────────────
# Common ESG / sustainability terms get dedicated slots for better retrieval
_ESG_VOCAB = [
    "carbon", "emission", "greenhouse", "climate", "net", "zero", "renewable",
    "energy", "solar", "wind", "sustainable", "sustainability", "green",
    "environment", "environmental", "biodiversity", "water", "waste", "recycle",
    "recycling", "plastic", "packaging", "supply", "chain", "footprint",
    "offset", "credit", "certif", "report", "disclosure", "target", "goal",
    "reduce", "reduction", "commit", "commitment", "percent", "100", "2030",
    "2050", "scope", "deforestation", "reforestation", "forest", "ocean",
    "pollution", "toxic", "chemical", "regulation", "compliance", "standard",
    "audit", "verification", "mislead", "greenwash", "vague", "claim",
    "evidence", "support", "contradict", "insufficient", "verified", "false",
]


from collections import Counter

def _tfidf_embedding(text: str, dim: int = LOCAL_DIM) -> List[float]:
    """
    Highly optimized TF-IDF style embedding using a fixed ESG vocabulary.
    Avoids nested loops and expensive character-level hashing for speed.
    """
    text_lower = text.lower()
    # Fast word extraction
    words = re.findall(r"[a-z0-9]+", text_lower)
    counts = Counter(words)
    
    # Part 1: ESG vocabulary match (first len(_ESG_VOCAB) dims)
    vocab_vec = np.zeros(len(_ESG_VOCAB), dtype="float32")
    for i, term in enumerate(_ESG_VOCAB):
        # Direct lookup (O(1)) instead of nested substring search
        vocab_vec[i] = math.log(1 + counts.get(term, 0))

    # Part 2: Quick text hashing for remaining dims (much faster than character-level bigrams)
    ngram_dim = dim - len(_ESG_VOCAB)
    h_int = hash(text_lower)
    ngram_vec = np.zeros(ngram_dim, dtype="float32")
    # Just seed a few slots based on hash
    ngram_vec[h_int % ngram_dim] = 1.0
    ngram_vec[(h_int // 7) % ngram_dim] = 0.5

    vec = np.concatenate([vocab_vec, ngram_vec])
    
    # Padding/Trimming
    if len(vec) < dim:
        vec = np.pad(vec, (0, dim - len(vec)))
    else:
        vec = vec[:dim]

    # Quick norm
    norm = np.sqrt(np.sum(vec**2))
    if norm > 0:
        vec = vec / norm

    return vec.tolist()


def _hash_embedding(text: str, dim: int = LOCAL_DIM) -> List[float]:
    """Deterministic hash-based embedding — absolute last resort."""
    h = hashlib.sha256(text.encode("utf-8")).digest()
    vec = np.frombuffer(h, dtype=np.uint8).astype("float32")
    repeats = (dim // len(vec)) + 1
    vec = np.tile(vec, repeats)[:dim]
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm
    return vec.tolist()


def _try_load_sentence_transformers():
    """Try to load sentence-transformers model. Returns model or None."""
    global _local_model
    if _local_model is not None:
        return _local_model
    try:
        from sentence_transformers import SentenceTransformer
        print("📦 [Embedder] Loading sentence-transformer model (all-MiniLM-L6-v2)...")
        _local_model = SentenceTransformer("all-MiniLM-L6-v2")
        print("✅ [Embedder] Sentence-transformer model loaded.")
        return _local_model
    except Exception:
        return None


def _bedrock_embedding(text: str) -> List[float]:
    """Try AWS Bedrock Titan embedding. Raises on failure."""
    import boto3
    import json
    bedrock = boto3.client(
        service_name='bedrock-runtime',
        region_name=os.getenv("AWS_DEFAULT_REGION", "us-east-1")
    )
    payload = {"inputText": text}
    response = bedrock.invoke_model(
        modelId="amazon.titan-embed-text-v1",
        contentType="application/json",
        accept="application/json",
        body=json.dumps(payload)
    )
    body = json.loads(response.get("body").read())
    return body.get("embedding")


def generate_embedding(text: str, provider="aws") -> List[float]:
    """
    Highly optimized for speed: Forced TF-IDF path for instant results.
    Bypasses AWS/Local model latency for the user interview.
    """
    global DIM
    DIM = LOCAL_DIM
    return _tfidf_embedding(text, LOCAL_DIM)
