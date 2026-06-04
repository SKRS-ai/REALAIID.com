class ConsensusModule:
    def verify_lock(self, task_id, node_id, ledger_response):
        """
        Verify if the ledger has granted exclusive access to the task.
        """
        return ledger_response.get("status") == "LOCKED" and ledger_response.get("owner") == node_id

    def generate_task_proof(self, task_id, success_data):
        """
        Signs the result of an action to prove the task was completed.
        """
        return f"PROOF_{task_id}_{hash(success_data)}"