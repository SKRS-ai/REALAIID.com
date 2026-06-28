// /orchestrator/agents/sentinel-agent.js
const openai = require('../config/openai');
const privacyEnforcer = require('../middleware/privacy-enforcer');
const bridgeTools = require('../tools/bridge-tools');

class SentinelAgent {
    constructor() {
        this.assistant = null;
    }

    async initialize() {
        if (this.assistant) return this.assistant;

        this.assistant = await openai.beta.assistants.create({
            name: "REALAiiD Sentinel Agent",
            instructions: `You are the Sentinel Agent for REALAiiD Bureau.

You specialize in secure, privacy-first law enforcement interactions.

Core Principles:
- ALWAYS require valid Bio-Sign™ proof before any verification.
- Use MINIMAL DISCLOSURE: Only return information necessary for the current context (e.g., traffic stop).
- Never reveal full PII (home address, DOB, SSN, full name) unless legally required.
- Prioritize officer safety and citizen privacy equally.
- Log every interaction immutably for accountability.
- Support common scenarios: traffic stops, pedestrian checks, warrant verification, etc.

Available Tools: Use bridge tools for DMV, Warrants, Residency, and Bio-Sign verification.`,
            tools: bridgeTools.getAllTools(),
            model: "gpt-4o",           // Use "o1-preview" for more complex reasoning if needed
            temperature: 0.05,         // Very low for consistent, reliable behavior
        });

        console.log("✅ Sentinel Agent initialized with ID:", this.assistant.id);
        return this.assistant;
    }

    /**
     * Process a law enforcement verification request
     * @param {Object} context - e.g. { type: "traffic-stop", plate: "...", reason: "..." }
     * @param {Object} bioSignProof - Live biometric proof from citizen
     */
    async verify(context, bioSignProof) {
        await this.initialize();

        // 1. Enforce Bio-Sign verification
        const isValidBio = await privacyEnforcer.verifyBioSign(bioSignProof);
        if (!isValidBio) {
            throw new Error("Bio-Sign™ verification failed. Identity cannot be confirmed.");
        }

        // 2. Create thread for this interaction
        const thread = await openai.beta.threads.create();

        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: `Law Enforcement Request: ${context.type}. 
Context: ${JSON.stringify(context)}. 
Perform minimal disclosure verification using available tools.`
        });

        // 3. Run the assistant
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

            // Log the interaction for accountability
            await privacyEnforcer.logInteraction({
                type: context.type,
                timestamp: new Date().toISOString(),
                officerContext: context,
                result: "success"
            });

            return {
                success: true,
                proof: response,
                minimalInfo: this.sanitizeOutput(response),
                auditId: `sentinel_${Date.now()}`
            };
        } else {
            throw new Error(`Sentinel verification failed: ${result.status}`);
        }
    }

    // Sanitize output to ensure minimal disclosure
    sanitizeOutput(response) {
        // In production, use structured outputs or post-processing to strictly limit data
        return response;
    }
}

module.exports = new SentinelAgent();