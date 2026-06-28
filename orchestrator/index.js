// /orchestrator/index.js
/**
 * PHL-01 INTELLIGENT ORCHESTRATOR
 * Main entry point for all agent coordination and bridge execution
 */

const { openai, models } = require('./config/openai');
const verificationAgent = require('./agents/verification-agent');
const sentinelAgent = require('./agents/sentinel-agent');
const aiiEconomyAgent = require('./agents/aii-economy-agent');
const roboticsAgent = require('./agents/robotics-agent');
const contextBuilder = require('./utils/context-builder');
const privacyEnforcer = require('./middleware/privacy-enforcer');

class PHL01Orchestrator {
    constructor() {
        console.log("🚀 PHL-01 Orchestrator initialized");
    }

    /**
     * Main entry point for all orchestrated requests
     */
    async processRequest(reqBody) {
        const { input, context = {}, bioSignProof, agentType = "verification" } = reqBody;

        if (!bioSignProof) {
            throw new Error("Bio-Sign™ proof is required for all orchestrated requests.");
        }

        // Build safe context
        const safeContext = await contextBuilder.build(context, bioSignProof, agentType);

        let result;

        switch (agentType.toLowerCase()) {
            case "sentinel":
                result = await sentinelAgent.verify(safeContext, bioSignProof);
                break;

            case "aii-economy":
                result = await aiiEconomyAgent.process(safeContext, bioSignProof);
                break;

            case "robotics":
                result = await roboticsAgent.process(safeContext, bioSignProof);
                break;

            case "verification":
            default:
                result = await verificationAgent.verify(safeContext, bioSignProof);
                break;
        }

        return {
            success: true,
            agentType,
            timestamp: new Date().toISOString(),
            result
        };
    }
}

// Export singleton instance
module.exports = new PHL01Orchestrator();