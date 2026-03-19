# rag/document_loader.py
import os

def load_documents(folder_path="data/esg_docs"):
    """
    Loads documents and returns a list of dictionaries with text and metadata.
    """
    documents = []
    if not os.path.exists(folder_path):
        os.makedirs(folder_path, exist_ok=True)
        
    for file in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file)
        
        if file.endswith(".txt"):
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
                documents.append({
                    "text": text,
                    "metadata": {
                        "source": file,
                        "page": 1, 
                        "section": "General"
                    }
                })
        # Placeholder for PDF support if needed later
        # elif file.endswith(".pdf"):
        #     documents.extend(load_pdf(file_path))
            
    return documents
