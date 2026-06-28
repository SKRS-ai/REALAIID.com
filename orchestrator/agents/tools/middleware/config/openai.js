// /orchestrator/config/openai.js
const { OpenAI } = require('openai');
require('dotenv').config();

/**
 * OpenAI Client Configuration for REALAiiD Orchestrator
 * Centralized configuration for all GPT model interactions.
 */

if (!process.env.OPENAI_API_KEY) {
    console.error("❌ ERROR: OPENAI_API_KEY is not set in .env file!");
    process.exit(1); // Fail fast in production
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    
    // Optional: Add organization if using multiple accounts
    // organization: process.env.OPENAI_ORG_ID,
    
    // Timeout and retry settings for reliability
    timeout: 60000,           // 60 seconds
    maxRetries: 3,
});

console.log("✅ OpenAI client initialized successfully.");

/**
 * Helper to easily switch models
 */
const models = {
    fast: "gpt-4o-mini",           // Quick responses
    balanced: "gpt-4o",            // Default good balance
    reasoning: "o1-preview",       // Deep reasoning (slower)
    vision: "gpt-4o",              // Vision + text
};

module.exports = {
    openai,
    models,
    // Convenience method
    getClient: () => openai
};