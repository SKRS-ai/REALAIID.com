// /orchestrator/tools/tool-registry.js

/**
 * Centralized Tool Registry for REALAiiD Orchestrator
 * This file defines all available tools that GPT Assistants can call.
 */

const verificationAgent = require('../agents/verification-agent');
const sentinelAgent = require('../agents/sentinel-agent');
const aiiEconomyAgent = require('../agents/aii-economy-agent');
const roboticsAgent = require('../agents/robotics-agent');

/**
 * Tool Definitions (for OpenAI Assistants API Function Calling)
 */
const tools = [
    {
        type: "function",
        function: {
            name: "verify_identity",
            description: "Perform Bio-Sign™ verified identity check with minimal disclosure for any context",
            parameters: {
                type: "object",
                properties: {
                    context: { 
                        type: "object", 
                        description: "Verification context (traffic-stop, access-request, boarding, etc.)" 
                    },
                    requiredProofs: { 
                        type: "array", 
                        items: { type: "string" },
                        description: "Optional: specific proofs needed (valid_dl, residency, no_warrants, etc.)" 
                    }
                },
                required: ["context"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "sentinel_verify",
            description: "Law enforcement / public safety verification using Sentinel Reader protocol",
            parameters: {
                type: "object",
                properties: {
                    requestType: { 
                        type: "string", 
                        enum: ["traffic-stop", "pedestrian-check", "warrant-query", "access-control", "incident-response"] 
                    },
                    context: { type: "object", description: "Additional context for the request" }
                },
                required: ["requestType"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "aii_economy_action",
            description: "Execute operations in the $AII Compute Currency economy",
            parameters: {
                type: "object",
                properties: {
                    action: { 
                        type: "string", 
                        enum: ["mint", "spend", "stake", "convert", "balance", "yield_check"] 
                    },
                    amount: { type: "number" },
                    reason: { type: "string" },
                    target: { type: "string" }
                },
                required: ["action"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "robotics_authorize",
            description: "Authorize or manage robotic operations via RoboSign™",
            parameters: {
                type: "object",
                properties: {
                    robotId: { type: "string" },
                    action: { type: "string" },
                    task: { type: "string" },
                    ownerBioProof: { type: "string" }
                },
                required: ["robotId", "action"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "check_warrant_status",
            description: "Privacy-preserving real-time warrant and compliance status check",
            parameters: {
                type: "object",
                properties: {
                    biometricToken: { type: "string" }
                },
                required: ["biometricToken"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "log_interaction",
            description: "Create an immutable audit record for any interaction (required for compliance)",
            parameters: {
                type: "object",
                properties: {
                    type: { type: "string" },
                    details: { type: "object" }
                },
                required: ["type", "details"]
            }
        }
    }
];

/**
 * Returns all tools for GPT Assistants
 */
function getAllTools() {
    return tools;
}

/**
 * Tool Execution Router
 */
async function executeTool(toolCall) {
    const { name, arguments: args } = toolCall.function;

    switch (name) {
        case "verify_identity":
            return await verificationAgent.verify(args.context, args.bioSignProof || {});
            
        case "sentinel_verify":
            return await sentinelAgent.verify(args.context || {}, args.bioSignProof || {});
            
        case "aii_economy_action":
            return await aiiEconomyAgent.process(args, args.bioSignProof || {});
            
        case "robotics_authorize":
            return await roboticsAgent.process(args, args.bioSignProof || {});
            
        case "check_warrant_status":
            // Placeholder - connect to B-45 Warrant Oracle
            return { status: "clear", auditId: `warrant_${Date.now()}` };
            
        case "log_interaction":
            return await privacyEnforcer.logInteraction(args);
            
        default:
            throw new Error(`Unknown tool called: ${name}`);
    }
}

module.exports = {
    getAllTools,
    executeTool
};