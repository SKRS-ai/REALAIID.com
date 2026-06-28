// /orchestrator/config/openai.js
const { OpenAI } = require('openai');
require('dotenv').config();

/**
 * REALAiiD OpenAI Configuration
 * Centralized client for all GPT interactions in the Orchestrator
 */

if (!process.env.OPENAI_API_KEY) {
    console.error("❌ CRITICAL ERROR: OPENAI_API_KEY is missing in .env file!");
    console.error("Please add it to your .env file and restart the server.");
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 90000,           // 90 seconds for complex reasoning
    maxRetries: 3,
    // Optional: You can add organization if needed
    // organization: process.env.OPENAI_ORG_ID,
});

console.log("✅ OpenAI client initialized successfully.");

const models = {
    fast: "gpt-4o-mini",        // Quick responses
    balanced: "gpt-4o",         // Best balance of speed & capability
    reasoning: "o1-preview",    // Deep reasoning (slower, more expensive)
    vision: "gpt-4o",           // Multimodal (images + text)
};

module.exports = {
    openai,
    models,
    getClient: () => openai,
    
    // Helper to get model by type
    getModel: (type = "balanced") => models[type] || models.balanced
};