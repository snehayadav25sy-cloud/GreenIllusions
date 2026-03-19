import os
import time
from datetime import datetime
from utils.aws_credentials import aws_creds_valid

# Check once at module load
_USE_CLOUDWATCH = aws_creds_valid()
if not _USE_CLOUDWATCH:
    print("ℹ️  [CloudWatch] Using console-only logging (no valid AWS credentials).")


class CloudWatchLogger:
    def __init__(self, log_group="GreenIllusions/Agents", log_stream="WorkflowStream"):
        self.log_group = log_group
        self.log_stream = log_stream
        self.client = None
        self.sequence_token = None

        if _USE_CLOUDWATCH:
            try:
                import boto3
                self.client = boto3.client(
                    'logs',
                    region_name=os.environ.get("AWS_DEFAULT_REGION", "us-east-1")
                )
                self._ensure_log_stream()
                print(f"✅ [CloudWatch] Logging to group '{log_group}'.")
            except Exception:
                self.client = None

    def _ensure_log_stream(self):
        if not self.client:
            return
        try:
            self.client.create_log_group(logGroupName=self.log_group)
        except Exception:
            pass
        try:
            self.client.create_log_stream(
                logGroupName=self.log_group,
                logStreamName=self.log_stream
            )
        except Exception:
            pass

    def log(self, message: str):
        """Log to CloudWatch if available, always print to console."""
        print(f"📝 [LOG] {message}")
        if not self.client:
            return
        try:
            timestamp = int(round(time.time() * 1000))
            formatted = f"[{datetime.utcnow().isoformat()}] {message}"
            kwargs = {
                'logGroupName': self.log_group,
                'logStreamName': self.log_stream,
                'logEvents': [{'timestamp': timestamp, 'message': formatted}]
            }
            if self.sequence_token:
                kwargs['sequenceToken'] = self.sequence_token
            response = self.client.put_log_events(**kwargs)
            self.sequence_token = response.get('nextSequenceToken')
        except Exception:
            pass  # never crash the pipeline over logging
