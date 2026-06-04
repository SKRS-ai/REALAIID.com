import time
import sys
import os

# Ensure the project root (REALAiiD.com) is in sys.path
# This makes 'sdk' a valid top-level package
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
if project_root not in sys.path:
    sys.path.append(project_root)

# Import directly from the bureau_sdk package
from sdk.bureau_sdk.HardwareAnchorModule import HardwareAnchorModule
from sdk.bureau_sdk.BureauLedgerInterface import BureauLedgerInterface

class BureauIdentityHandshake:
    """
    Handles the cryptographic handshake between a ROS 2 robot node
    and the REALAiiD Sovereign Ledger.
    """
    def __init__(self, ros_node_id, ham_device):
        self.ros_node_id = ros_node_id
        self.ham = ham_device 
        self.ledger = BureauLedgerInterface()

    def generate_handshake_payload(self):
        """Creates a signed payload for ledger registration."""
        timestamp = str(time.time())
        raw_data = f"{self.ros_node_id}:{self.ham.get_serial()}:{timestamp}"
        signature = self.ham.sign(raw_data.encode('utf-8'))
        
        return {
            "node_id": self.ros_node_id,
            "hw_serial": self.ham.get_serial(),
            "payload": raw_data,
            "signature": signature.hex(),
            "timestamp": timestamp
        }

    def execute_registration(self):
        """Performs the on-chain registration."""
        print(f"Initiating handshake for node: {self.ros_node_id}...")
        
        payload = self.generate_handshake_payload()
        
        transaction_hash = self.ledger.submit_transaction(
            contract="IdentityRegistry",
            function="registerRobot",
            args=[payload]
        )
        
        if transaction_hash:
            print(f"Success! Robot anchored. Tx: {transaction_hash}")
            return transaction_hash
        else:
            raise ConnectionError("Handshake failed: Ledger rejected registration.")

if __name__ == "__main__":
    ham = HardwareAnchorModule(device_path="/dev/tpm0")
    handshake = BureauIdentityHandshake(ros_node_id="AGILITY_DIGIT_001", ham_device=ham)
    tx_hash = handshake.execute_registration()