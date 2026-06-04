class HardwareAnchorModule:
    def __init__(self, device_path="/dev/tpm0"):
        self.device_path = device_path
        self.serial = "AGILITY-DIGIT-SN-8892" # Placeholder for hardware-backed ID

    def get_serial(self):
        return self.serial

    def sign(self, data: bytes):
        """Mock signing functionality using standard libraries."""
        import hashlib
        # In production, this would interface with a TPM (e.g., via tpm2-pytss)
        return hashlib.sha256(data).digest()