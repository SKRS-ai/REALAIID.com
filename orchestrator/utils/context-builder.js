/**
 * Context Builder - Safely builds context for agents
 */
module.exports = {
    build: async (context, bioSignProof, agentType) => {
        return {
            ...context,
            verified: !!bioSignProof,
            agentType,
            timestamp: new Date().toISOString()
        };
    }
};
