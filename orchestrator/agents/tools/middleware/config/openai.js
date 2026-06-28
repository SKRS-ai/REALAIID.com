// /orchestrator/config/openai.js
const { OpenAI } = require('openai');
require('dotenv').config();

if (!process.env.OPENAI_API_KEY) {
    console.error("❌ CRITICAL ERROR: OPENAI_API_KEY is missing in .env file!");
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 60000,
    maxRetries: 3,
});

console.log("✅ OpenAI client initialized successfully.");

const models = {
    fast: "gpt-4o-mini",
    balanced: "gpt-4o",
    reasoning: "o1-preview",
    vision: "gpt-4o"
};

module.exports = {
    openai,
    models,
    getClient: () => openai
};