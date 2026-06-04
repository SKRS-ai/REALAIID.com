import hashlib
import os

class LogArchiverModule:
    def __init__(self, log_path="logs/"):
        self.log_path = log_path

    def generate_log_fingerprint(self):
        """Creates a SHA-256 hash of all log files in the directory."""
        hasher = hashlib.sha256()
        # Ensure directory exists
        if not os.path.exists(self.log_path):
            return None
        
        # Sort files to ensure the hash is consistent
        for filename in sorted(os.listdir(self.log_path)):
            with open(os.path.join(self.log_path, filename), "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hasher.update(chunk)
        return hasher.hexdigest()