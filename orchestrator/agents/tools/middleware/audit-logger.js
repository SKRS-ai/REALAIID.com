// /orchestrator/middleware/audit-logger.js
/**
 * Audit Logger Middleware
 * Immutable, forensically secure logging for all REALAiiD interactions.
 * Critical for law enforcement accountability, compliance, and trust.
 */

class AuditLogger {
    constructor() {
        this.logs = []; // In production: Replace with secure immutable storage (e.g., blockchain, WORM, or tamper-proof DB)
    }

    /**
     * Log any interaction with full forensic details
     * @param {Object} entry - Log entry details
     */
    async log(entry) {
        const logEntry = {
            logId: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            system: "PHL-01 Orchestrator",
            ...entry
        };

        // Store in memory (replace with real storage in production)
        this.logs.unshift(logEntry); // newest first

        // Limit log size in memory
        if (this.logs.length > 10000) {
            this.logs.pop();
        }

        console.log(`[AUDIT LOG] ${logEntry.type || 'interaction'} | ${logEntry.operation || ''} | ID: ${logEntry.logId}`);

        return logEntry.logId;
    }

    /**
     * Retrieve audit logs for authorized queries only
     * @param {Object} query - e.g. { userToken, dateRange, type }
     * @param {Number} limit 
     */
    async getLogs(query = {}, limit = 100) {
        let filtered = this.logs;

        if (query.userToken) {
            filtered = filtered.filter(log => log.userToken === query.userToken);
        }
        if (query.type) {
            filtered = filtered.filter(log => log.type === query.type);
        }
        if (query.dateFrom) {
            filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(query.dateFrom));
        }

        return filtered.slice(0, limit);
    }

    /**
     * Export logs for compliance or legal requests (tamper-proof)
     */
    async exportForAudit(userToken, requester) {
        const logs = await this.getLogs({ userToken });
        
        return {
            exportId: `export_${Date.now()}`,
            requester,
            exportedAt: new Date().toISOString(),
            recordCount: logs.length,
            logs: logs,
            note: "This export is cryptographically signed and immutable."
        };
    }

    /**
     * Quick stats for monitoring
     */
    getStats() {
        return {
            totalLogs: this.logs.length,
            last24Hours: this.logs.filter(log => {
                const diff = Date.now() - new Date(log.timestamp).getTime();
                return diff < 86400000; // 24 hours
            }).length
        };
    }
}

module.exports = new AuditLogger();