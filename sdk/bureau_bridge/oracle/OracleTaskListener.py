import time
import threading
from sdk.bureau_sdk.BureauLedgerInterface import BureauLedgerInterface
from sdk.bureau_sdk.TelemetryModule import TelemetryModule
from sdk.bureau_sdk.LogArchiverModule import LogArchiverModule
from sdk.bureau_sdk.ConsensusModule import ConsensusModule
from sdk.bureau_sdk.FleetRegistryModule import FleetRegistryModule

# Attempt to import ROS 2, fallback if not present
try:
    import rclpy
    from rclpy.node import Node
    HAS_ROS = True
except ImportError:
    HAS_ROS = False
    Node = object # Mock base class

class OracleTaskListener(Node if HAS_ROS else object):
    def __init__(self, ros_node_id):
        self.ros_node_id = ros_node_id
        self.ledger = BureauLedgerInterface()
        self.telemetry = TelemetryModule(ros_node_id)
        self.archiver = LogArchiverModule()
        self.consensus = ConsensusModule()
        self.registry = FleetRegistryModule(ros_node_id)
        self.processed_tasks = set()
        
        if HAS_ROS:
            super().__init__('oracle_task_listener')
            self.create_timer(5.0, self.poll_ledger_callback)
            self.get_logger().info(f"ROS 2 Mode: Monitoring Ledger for {self.ros_node_id}...")
        else:
            self.running = True
            print(f"Standalone Mode: Monitoring Ledger for {self.ros_node_id}...")
            # Start Background Threads
            threading.Thread(target=self.telemetry_heartbeat, daemon=True).start()
            threading.Thread(target=self.archiving_heartbeat, daemon=True).start()
            threading.Thread(target=self.registry_heartbeat, daemon=True).start()

    def telemetry_heartbeat(self):
        while True:
            try:
                data = self.telemetry.get_vital_signs()
                payload = self.telemetry.format_for_ledger(data)
                self.ledger.submit_transaction("TaskOracle", "reportTelemetry", [self.ros_node_id, payload])
                time.sleep(30)
            except Exception as e:
                print(f"Telemetry error: {e}")
                time.sleep(60)

    def archiving_heartbeat(self):
        while True:
            try:
                fingerprint = self.archiver.generate_log_fingerprint()
                if fingerprint:
                    self.ledger.submit_transaction("TaskOracle", "reportLogAudit", [self.ros_node_id, fingerprint])
            except Exception as e:
                print(f"Archiving error: {e}")
            time.sleep(3600)

    def registry_heartbeat(self):
        """Announces status to the ledger for peer visibility."""
        while True:
            try:
                status_data = self.registry.format_status(
                    battery=self.telemetry.get_vital_signs()['battery'],
                    current_task="IDLE"
                )
                self.ledger.submit_transaction("FleetRegistry", "announcePresence", [self.ros_node_id, status_data])
            except Exception as e:
                print(f"Registry error: {e}")
            time.sleep(60)

    def poll_ledger_callback(self):
        self.run_polling_logic()

    def run_polling_logic(self):
        """Consensus-aware polling logic with Fleet Awareness."""
        try:
            # 1. Fleet Awareness: Check what others are doing
            peers = self.ledger.get_fleet_status()
            # Logic: We can now parse 'peers' to decide if we should yield 
            # to a more capable or better-positioned robot.
            
            # 2. Existing Task Lock Logic
            task_response = self.ledger.submit_transaction("TaskOracle", "acquireTaskLock", [self.ros_node_id])
            
            if task_response and task_response != "NO_TASK":
                if self.consensus.verify_lock(task_response, self.ros_node_id, {"status": "LOCKED", "owner": self.ros_node_id}):
                    self.process_task(task_response)
            
            # 3. Heartbeat on active locks
            self.ledger.submit_transaction("TaskOracle", "pulseLock", [self.ros_node_id])
                
        except Exception as e:
            print(f"Consensus or Fleet error: {e}")

    def process_task(self, task):
        if task in self.processed_tasks:
            return 
            
        msg = f"Dispatching task: {task}"
        if HAS_ROS: self.get_logger().info(msg)
        else: print(msg)
        
        try:
            self.ledger.submit_transaction("TaskOracle", "reportTaskCompletion", [task, "COMPLETED"])
            payout_status = self.ledger.request_payout("TaskOracle", task)
            print(f"Settlement status: {payout_status}")
            self.processed_tasks.add(task)
        except Exception as e:
            if HAS_ROS: self.get_logger().error(f"Failed: {e}")
            else: print(f"Failed: {e}")

    def run_standalone(self):
        while self.running:
            self.run_polling_logic()
            time.sleep(5)

def main(args=None):
    if HAS_ROS:
        rclpy.init(args=args)
        listener = OracleTaskListener(ros_node_id="AGILITY_DIGIT_001")
        rclpy.spin(listener)
        listener.destroy_node()
        rclpy.shutdown()
    else:
        listener = OracleTaskListener(ros_node_id="AGILITY_DIGIT_001")
        listener.run_standalone()

if __name__ == "__main__":
    main()