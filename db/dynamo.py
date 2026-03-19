import boto3
import os
import uuid
import json
from datetime import datetime
from botocore.exceptions import ClientError
from utils.aws_credentials import aws_creds_valid

# Path to local history file (relative to project root)
_LOCAL_HISTORY_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "history.json")


def _ensure_history_file():
    """Make sure the history file and its parent directory exist."""
    path = os.path.abspath(_LOCAL_HISTORY_FILE)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if not os.path.exists(path):
        with open(path, "w") as f:
            json.dump([], f)
    return path


def save_to_local(item: dict):
    """Append a single history record to the local JSON file."""
    try:
        path = _ensure_history_file()
        with open(path, "r") as f:
            records = json.load(f)
        records.insert(0, item)   # newest first
        records = records[:200]   # keep last 200
        with open(path, "w") as f:
            json.dump(records, f, indent=2, default=str)
    except Exception as e:
        print(f"⚠️  Local history save failed: {e}")


def get_from_local() -> list:
    """Read history records from the local JSON file."""
    try:
        path = _ensure_history_file()
        with open(path, "r") as f:
            records = json.load(f)
        return records[:50]
    except Exception as e:
        print(f"⚠️  Local history read failed: {e}")
        return []

def save_claim_analysis(claim_data: dict, table_name: str = "GreenIllusionsClaims"):
    """
    Saves the analyzed claim and verdict. Always saves locally; also saves to DynamoDB if creds exist.
    """
    # Build the record
    item = {
        'ClaimID': str(uuid.uuid4()),
        'Timestamp': datetime.utcnow().isoformat(),
        'Claim': claim_data.get('claim', ''),
        'Verdict': claim_data.get('analysis', {}).get('final_verdict', 'Unknown'),
        'Confidence': str(claim_data.get('analysis', {}).get('confidence', 0.0)),
        'RiskLevel': claim_data.get('analysis', {}).get('risk_level', 'Unknown'),
        'ComplianceStatus': claim_data.get('analysis', {}).get('compliance_check', {}).get('compliance_status', 'N/A'),
    }

    # Always save locally first
    save_to_local(item)

    # Also try DynamoDB if credentials are valid
    if not aws_creds_valid():
        return
    try:
        region = os.environ.get("AWS_DEFAULT_REGION", "us-east-1")
        dynamodb = boto3.resource('dynamodb', region_name=region)
        table = dynamodb.Table(table_name)
        item_dynamo = dict(item)
        item_dynamo['FullAnalysis'] = claim_data
        table.put_item(Item=item_dynamo)
        print(f"✅ Saved claim analysis to DynamoDB table '{table_name}'.")
    except ClientError as e:
        print(f"❌ Failed to save to DynamoDB: {e.response['Error']['Message']}")
    except Exception as e:
        print(f"❌ DynamoDB Error: {e}")

def get_claim_history(table_name: str = "GreenIllusionsClaims"):
    """
    Retrieves the last 50 claims. Falls back to local JSON if no AWS credentials.
    """
    # Try DynamoDB first if credentials are valid
    if aws_creds_valid():
        try:
            region = os.environ.get("AWS_DEFAULT_REGION", "us-east-1")
            dynamodb = boto3.resource('dynamodb', region_name=region)
            table = dynamodb.Table(table_name)
            response = table.scan(Limit=50)
            items = response.get('Items', [])
            items.sort(key=lambda x: x.get('Timestamp', ''), reverse=True)
            return items
        except Exception as e:
            print(f"❌ DynamoDB fetch failed, falling back to local: {e}")

    # Fallback: local JSON file
    return get_from_local()
