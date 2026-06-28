// /orchestrator/agents/aii-economy-agent.js
const openai = require('../config/openai');
const privacyEnforcer = require('../middleware/privacy-enforcer');
const bridgeTools = require('../tools/bridge-tools');

class AIIEconomyAgent {
    constructor() {
        this.assistant = null;
    }

    async initialize() {
        if (this.assistant) return this.assistant;

        this.assistant = await openai.beta.assistants.create({
            name: "REALAiiD $AII Economy Agent",
            instructions: `You are the $AII Economy Agent for REALAiiD Bureau.

You manage all aspects of the $AII Compute Currency economy with precision and sovereignty.

Core Rules:
- ALWAYS require valid Bio-Sign™ proof before any $AII transaction or operation.
- Optimize compute credit usage, yields, and conversions while maintaining transparency.
- Support minting, spending, staking, and bridging to other currencies (including stablecoins and Digital Euro when integrated).
- Provide clear, user-friendly explanations of economic actions.
- Log all transactions immutably on the forensic ledger.
- Enforce privacy: never expose full user data unless explicitly authorized.

Available Tools: Use bridge tools for $AII Economy (B-31), Fiscal Root, Bio-Sign, and related bridges.`,
            tools: bridgeTools.getAllTools(),
            model: "gpt-4o",           // Use o1-preview for complex economic reasoning
            temperature: 0.1,          // Balanced for reliable economic decisions
        });

        console.log("✅ $AII Economy Agent initialized with ID:", this.assistant.id);
        return this.assistant;
    }

    /**
     * Process $AII economy related requests
     * @param {Object} context - e.g. { action: "mint", amount: 100, reason: "compute contribution" }
     * @param {Object} bioSignProof - Live biometric proof
     */
    async process(context, bioSignProof) {
        await this.initialize();

        // 1. Enforce Bio-Sign verification
        const isValidBio = await privacyEnforcer.verifyBioSign(bioSignProof);
        if (!isValidBio) {
            throw new Error("Bio-Sign™ verification failed. $AII transaction cannot proceed.");
        }

        // 2. Create thread
        const thread = await openai.beta.threads.create();

        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: `Process $AII Economy request: ${JSON.stringify(context)}`
        });

        // 3. Run assistant
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: this.assistant.id,
        });

        // Poll for completion
        let result = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        
        while (result.status === "in_progress" || result.status === "queued") {
            await new Promise(resolve => setTimeout(resolve, 1000));
            result = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        if (result.status === "completed") {
            const messages = await openai.beta.threads.messages.list(thread.id);
            const response = messages.data[0].content[0].text.value;

            // Log the economic interaction
            await privacyEnforcer.logInteraction({
                type: "aii-economy",
                action: context.action,
                timestamp: new Date().toISOString(),
                result: "success"
            });

            return {
                success: true,
                response: response,
                transactionId: `aii_${Date.now()}`,
                auditId: `audit_aii_${Date.now()}`
            };
        } else {
            throw new Error(`$AII Economy operation failed: ${result.status}`);
        }
    }
}

module.exports = new AIIEconomyAgent();