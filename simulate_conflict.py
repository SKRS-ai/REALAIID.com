import threading
from sdk.bureau_sdk.BureauLedgerInterface import BureauLedgerInterface

def request_lock(robot_id):
    ledger = BureauLedgerInterface()
    # Both try to lock the same Task ID: 'TASK_CRITICAL_001'
    result = ledger.submit_transaction("TaskOracle", "acquireTaskLock", ["TASK_CRITICAL_001", robot_id])
    print(f"[{robot_id}] Attempted lock. Result: {result}")

# Spin up two threads simulating two robots
t1 = threading.Thread(target=request_lock, args=("AGILITY_DIGIT_001",))
t2 = threading.Thread(target=request_lock, args=("AGILITY_DIGIT_002",))

t1.start()
t2.start()
t1.join()
t2.join()