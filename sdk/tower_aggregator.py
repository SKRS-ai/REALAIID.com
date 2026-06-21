# tower_aggregator.py
import time
from bureau_sdk.BureauLedgerInterface import BureauLedgerInterface

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
            for peer in peers:
                self.fleet_state[peer['node_id']] = peer
            
            # 3. Output summary (This will be piped to your UI later)
            self.print_status()
            
            time.sleep(10) # Aggregation heartbeat

    def print_status(self):
        print("\n--- Control Tower: Current Fleet Status ---")
        for node_id, data in self.fleet_state.items():
            print(f"Node: {node_id} | Status: {data['status']} | Battery: {data['battery']}%")
        print("-------------------------------------------\n")

if __name__ == "__main__":
    tower = ControlTowerAggregator()
    tower.run_aggregation_loop()