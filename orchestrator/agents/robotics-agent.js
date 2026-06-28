// /orchestrator/agents/robotics-agent.js
const openai = require('../config/openai');
const privacyEnforcer = require('../middleware/privacy-enforcer');
const bridgeTools = require('../tools/bridge-tools');

class RoboticsAgent {
    constructor() {
        this.assistant = null;
    }

    async initialize() {
        if (this.assistant) return this.assistant;

        this.assistant = await openai.beta.assistants.create({
            name: "REALAiiD Robotics Agent",
            instructions: `You are the REALAiiD Robotics Agent (RoboSign™ Orchestrator).

You manage secure identity, authorization, and operations for autonomous robots and robotic fleets.

Core Principles:
- ALWAYS require valid Bio-Sign™ proof from the human owner before any robot action or ownership transfer.
- Enforce RoboSign™ identity verification for every robot.
- Support minimal disclosure and context-aware permissions (home robot, industrial fleet, delivery, etc.).
- Prioritize safety, owner consent, and auditability.
- Handle M2M (machine-to-machine) interactions using $AII Compute Currency when needed.
- Log all robot actions immutably on the forensic ledger.

Available Tools: Use RoboSign™ bridges, Bio-Sign™, $AII Economy, and related tools to authorize and monitor robotic operations.`,
            tools: bridgeTools.getAllTools(),
            model: "gpt-4o",           // Use o1-preview for complex safety reasoning
            temperature: 0.1,
        });

        console.log("✅ Robotics Agent initialized with ID:", this.assistant.id);
        return this.assistant;
    }

    /**
     * Process robotics-related requests
     * @param {Object} context - e.g. { action: "task_authorize", robotId: "RBT-7842", task: "deliver package" }
     * @param {Object} bioSignProof - Owner's live biometric proof
     */
    async process(context, bioSignProof) {
        await this.initialize();

        // 1. Enforce Bio-Sign verification from human owner
        const isValidBio = await privacyEnforcer.verifyBioSign(bioSignProof);
        if (!isValidBio) {
            throw new Error("Bio-Sign™ owner verification failed. Robot operation denied.");
        }

        // 2. Create thread for this robotics session
        const thread = await openai.beta.threads.create();

        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: `Robotics Request: ${JSON.stringify(context)}`
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

            // Log the robotics interaction
            await privacyEnforcer.logInteraction({
                type: "robotics",
                robotId: context.robotId,
                action: context.action,
                timestamp: new Date().toISOString(),
                result: "success"
            });

            return {
                success: true,
                response: response,
                authorizationToken: `robo_auth_${Date.now()}`,
                auditId: `robotics_${Date.now()}`
            };
        } else {
            throw new Error(`Robotics operation failed: ${result.status}`);
        }
    }
}

module.exports = new RoboticsAgent();