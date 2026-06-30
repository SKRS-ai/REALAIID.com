/**
 * PHL-01 INTELLIGENT ORCHESTRATOR
 * Main entry point for all agent coordination and bridge execution
 */

const path = require('path');
const express = require('express'); // Added for Router
const router = express.Router(); // Master Router

// Updated to use path.join for absolute resolution
const { openai, models } = require(path.join(__dirname, 'config', 'openai'));

const verificationAgent = require('./agents/verification-agent');
const sentinelAgent = require('./agents/sentinel-agent');
const aiiEconomyAgent = require('./agents/aii-economy-agent');
const roboticsAgent = require('./agents/robotics-agent');
const movieAgent = require('./agents/movie-agent');
const contextBuilder = require('./utils/context-builder');
const privacyEnforcer = require('./middleware/privacy-enforcer');

// Import your new security controller
const securityController = require('./controllers/security-bridge');

class PHL01Orchestrator {
    constructor() {
        console.log("🚀 PHL-01 Orchestrator initialized");
        console.log("🛠 Using OpenAI Model:", models.balanced);
    }

    async processRequest(reqBody) {
        const { input, context = {}, bioSignProof, agentType = "verification" } = reqBody;

        if (!bioSignProof) {
            throw new Error("Bio-Sign™ proof is required for all orchestrated requests.");
        }

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
            case "movie":
                result = await movieAgent.process(safeContext, bioSignProof);
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

// Instantiate
const orchestratorInstance = new PHL01Orchestrator();

// Attach Routes to the Router
router.use('/security', securityController);

// Export both the instance (for internal code) and the router (for server.js)
module.exports = orchestratorInstance;
module.exports.router = router;