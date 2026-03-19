import boto3
import os
import json

def retrieve_from_bedrock_kb(query: str, kb_id: str, n_results: int = 5) -> list:
    """
    Retrieves information from Amazon Bedrock Knowledge Base.
    
    Args:
        query (str): The search query.
        kb_id (str): The Knowledge Base ID.
        n_results (int): Number of results to return.
        
    Returns:
        list: List of dicts with 'text' and 'metadata'.
    """
    try:
        # Bedrock Agent Runtime client
        client = boto3.client(
            service_name='bedrock-agent-runtime',
            region_name=os.environ.get('AWS_DEFAULT_REGION', 'us-east-1')
        )
        
        response = client.retrieve(
            knowledgeBaseId=kb_id,
            retrievalQuery={
                'text': query
            },
            retrievalConfiguration={
                'vectorSearchConfiguration': {
                    'numberOfResults': n_results
                }
            }
        )
        
        results = []
        if 'retrievalResults' in response:
            for result in response['retrievalResults']:
                content = result.get('content', {}).get('text', '')
                location = result.get('location', {})
                
                # Extract metadata if available
                metadata = {}
                if 's3Location' in location:
                    metadata['source'] = location['s3Location'].get('uri', 'Unknown S3')
                    
                # Other metadata might be in the 'metadata' field if mapped in KB
                if 'metadata' in result:
                    metadata.update(result['metadata'])
                    
                results.append({
                    "text": content,
                    "metadata": metadata
                })
                
        return results
        
    except Exception as e:
        print(f"⚠️ Bedrock KB Retrieval Failed: {e}")
        return None  # Signal failure to trigger fallback
