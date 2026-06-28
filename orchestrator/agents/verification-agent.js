// /orchestrator/agents/verification-agent.js
const openai = require('../config/openai');
const privacyEnforcer = require('../middleware/privacy-enforcer');
const bridgeTools = require('../tools/bridge-tools');

class VerificationAgent {
    constructor() {
        this.assistant = null;
    }

    async initialize() {
        if (this.assistant) return this.assistant;

        this.assistant = await openai.beta.assistants.create({
            name: "REALAiiD Verification Agent",
            instructions: `You are a sovereign identity verification agent for REALAiiD Bureau.
            
Core Rules:
- ALWAYS require valid Bio-Sign™ proof before any action.
- Use minimal disclosure: only return what is explicitly needed for the context.
- Never reveal full PII (address, DOB, SSN, etc.) unless legally required and authorized.
- Use available bridge tools to verify claims.
- Log every verification immutably.
- Prioritize citizen privacy and officer safety.`,
            tools: bridgeTools.getAllTools(), // Includes DMV, Warrant, Bio-Sign, etc.
            model: "gpt-4o", // or "o1-preview" for deeper reasoning
            temperature: 0.1, // Low temperature for consistent, reliable behavior
        });

        console.log("✅ Verification Agent initialized with ID:", this.assistant.id);
        return this.assistant;
    }

    /**
     * Process a verification request (e.g. traffic stop, ID check, etc.)
     */
    async verify(context, bioSignProof, requestType = "traffic-stop") {
        await this.initialize();

        // 1. Enforce Bio-Sign verification first
        const isValidBio = await privacyEnforcer.verifyBioSign(bioSignProof);
        if (!isValidBio) {
            throw new Error("Bio-Sign™ verification failed. Identity cannot be confirmed.");
        }

        // 2. Create a thread for this verification session
        const thread = await openai.beta.threads.create();

        // 3. Add user message with context
        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: `Context: ${requestType}. Verify the following with minimal disclosure: ${JSON.stringify(context)}`
        });

        // 4. Run the assistant with tools
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: this.assistant.id,
        });

        // Wait for completion (in production use polling or webhooks)
        let result = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        
        while (result.status === "in_progress" || result.status === "queued") {
            await new Promise(resolve => setTimeout(resolve, 800));
            result = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        if (result.status === "completed") {
            const messages = await openai.beta.threads.messages.list(thread.id);
            const response = messages.data[0].content[0].text.value;

            // Log the interaction immutably
            await privacyEnforcer.logInteraction({
                type: requestType,
                timestamp: new Date().toISOString(),
                context: context,
                result: "success"
            });

            return {
                success: true,
                proof: response,
                minimalInfo: this.extractMinimalInfo(response),
                auditId: `audit_${Date.now()}`
            };
        } else {
            throw new Error(`Verification failed: ${result.status}`);
        }
    }

    // Helper to ensure only minimal info is returned
    extractMinimalInfo(response) {
        // In real implementation, parse and sanitize output
        return response; // Placeholder - enhance with structured outputs
    }
}

module.exports = new VerificationAgent();