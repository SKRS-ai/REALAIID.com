// /orchestrator/tools/bridge-tools.js
const verificationAgent = require('../agents/verification-agent');
const sentinelAgent = require('../agents/sentinel-agent');
const aiiEconomyAgent = require('../agents/aii-economy-agent');
const roboticsAgent = require('../agents/robotics-agent');

/**
 * Bridge Tools Registry for GPT Function Calling
 * All tools are exposed to the Assistants API
 */
const bridgeTools = [
    {
        type: "function",
        function: {
            name: "verify_identity",
            description: "Perform a Bio-Sign™ verified identity check with minimal disclosure",
            parameters: {
                type: "object",
                properties: {
                    context: { 
                        type: "object", 
                        description: "Context of the verification (e.g. traffic-stop, boarding, access-request)" 
                    },
                    requiredProofs: { 
                        type: "array", 
                        items: { type: "string" },
                        description: "List of minimal proofs needed (e.g. ['valid_dl', 'no_warrants', 'residency'])" 
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
            description: "Law Enforcement / Public Safety verification using Sentinel Reader protocol",
            parameters: {
                type: "object",
                properties: {
                    requestType: { type: "string", enum: ["traffic-stop", "pedestrian-check", "warrant-query", "access-control"] },
                    context: { type: "object" }
                },
                required: ["requestType"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "aii_economy_action",
            description: "Perform $AII Compute Currency operations (mint, spend, stake, convert)",
            parameters: {
                type: "object",
                properties: {
                    action: { type: "string", enum: ["mint", "spend", "stake", "convert", "yield_check"] },
                    amount: { type: "number" },
                    reason: { type: "string" }
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
                    task: { type: "string" }
                },
                required: ["robotId", "action"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "check_warrant_status",
            description: "Privacy-preserving warrant and compliance status check",
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
            description: "Log an immutable audit record for any interaction",
            parameters: {
                type: "object",
                properties: {
                    type: { type: "string" },
                    details: { type: "object" }
                },
                required: ["type"]
            }
        }
    }
];

/**
 * Returns all available tools for GPT Assistants
 */
function getAllTools() {
    return bridgeTools;
}

/**
 * Example tool execution handler (called by orchestrator)
 */
async function executeTool(toolCall) {
    const { name, arguments: args } = toolCall.function;

    switch (name) {
        case "verify_identity":
            return await verificationAgent.verify(args.context, args.bioSignProof || {});
        case "sentinel_verify":
            return await sentinelAgent.verify(args.context, args.bioSignProof || {});
        case "aii_economy_action":
            return await aiiEconomyAgent.process(args, args.bioSignProof || {});
        case "robotics_authorize":
            return await roboticsAgent.process(args, args.bioSignProof || {});
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
}

module.exports = {
    getAllTools,
    executeTool
};