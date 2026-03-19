def chunk_text(doc_obj, chunk_size=500, overlap=50):
    """
    Split text into overlapping chunks, preserving metadata.
    Expects doc_obj to be a dict: {'text': str, 'metadata': dict}
    """
    text = doc_obj["text"]
    metadata = doc_obj["metadata"]
    
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk_content = " ".join(words[i:i+chunk_size])
        
        chunks.append({
            "text": chunk_content,
            "metadata": metadata
        })
        
    return chunks
