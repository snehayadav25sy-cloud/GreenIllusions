"""
utils/aws_credentials.py

Shared AWS credential validator used by all services.
Checks once at startup via STS — caches result permanently.
"""

import os

_valid: bool | None = None  # None = not checked yet


def aws_creds_valid() -> bool:
    """
    Returns True if AWS credentials are present AND valid.
    Result is cached after first call — never retried if invalid.
    """
    global _valid
    if _valid is not None:
        return _valid

    key = os.environ.get("AWS_ACCESS_KEY_ID", "")
    secret = os.environ.get("AWS_SECRET_ACCESS_KEY", "")

    # Reject obvious placeholder values from .env
    if not key or key.startswith("PASTE_") or not secret or secret.startswith("PASTE_"):
        _valid = False
        print("ℹ️  [AWS] No real credentials configured — all AWS services will use local fallbacks.")
        return False

    try:
        import boto3
        from botocore.config import Config
        
        # ⚡ FAIL FAST: 3-second timeout to prevent "1 minute" hangs
        fast_config = Config(connect_timeout=3, read_timeout=3, retries={'max_attempts': 0})
        
        sts = boto3.client(
            "sts", 
            region_name=os.getenv("AWS_DEFAULT_REGION", "us-east-1"),
            config=fast_config
        )
        identity = sts.get_caller_identity()
        _valid = True
        print(f"✅ [AWS] Credentials valid. Account: {identity.get('Account', 'unknown')}")
    except Exception as e:
        _valid = False
        print(f"ℹ️  [AWS] Credentials invalid/timeout ({type(e).__name__}) — fast fallback to local mode.")
    return _valid
