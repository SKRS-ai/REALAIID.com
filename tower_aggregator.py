# tower_aggregator.py (Master)
import time
from sdk.bureau_sdk.BureauLedgerInterface import BureauLedgerInterface

class ControlTowerAggregator:
    def __init__(self):
        self.ledger = BureauLedgerInterface()
        self.fleet_state = {}

    def run_aggregation_loop(self):
        print("Control Tower: Aggregating Fleet Data...")
        while True:
            # 1. Fetch live fleet registry
            peers = self.ledger.get_fleet_status()
            
            # 2. Update local state
            # This loop automatically captures all new keys (robosign_identity, aii_balance, etc.)
            for peer in peers:
                node_id = peer.get('node_id')
                if node_id:
                    self.fleet_state[node_id] = peer
            
            # 3. Output summary
            self.print_status()
            
            time.sleep(10) # Aggregation heartbeat

    def print_status(self):
        print("\n--- Control Tower: Current Fleet Status ---")
        for node_id, data in self.fleet_state.items():
            # Dynamically pull fields; default to 'N/A' if missing
            status = data.get('status', 'UNKNOWN')
            battery = data.get('battery', 0)
            identity = data.get('robosign_identity', 'N/A')
            balance = data.get('aii_balance', 0.0)
            
            print(f"Node: {node_id} | Status: {status} | Battery: {battery}% | "
                  f"Identity: {identity} | Balance: ${balance:,.2f}")
        print("-------------------------------------------\n")

if __name__ == "__main__":
    tower = ControlTowerAggregator()
    tower.run_aggregation_loop()