import time
import random # Replace with actual sensor reads (e.g., via ros2 topic echo)

class TelemetryModule:
    def __init__(self, ros_node_id):
        self.ros_node_id = ros_node_id

    def get_vital_signs(self):
        """
        Simulates gathering data from robot hardware.
        In production, replace these with calls to your ROS 2 sensor topics.
        """
        return {
            "battery": random.randint(20, 100),
            "temp_c": random.uniform(30.0, 75.0),
            "status": "OPERATIONAL" if random.random() > 0.05 else "FAULT"
        }

    def format_for_ledger(self, data):
        # Convert dictionary to a compact string or JSON for the ledger
        return f"BAT:{data['battery']}|TMP:{data['temp_c']:.1f}|STS:{data['status']}"