/**
 * REALAiID BUREAU // PHL-01 MAINFRAME OS // MASTER ORCHESTRATOR v25.2
 * ROLE: Unified Sovereign Gateway // Autonomous Bridge Grid Ingestion
 * STATUS: PRODUCTION READY // INFRASTRUCTURE MESH ACTIVE
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const winston = require('winston');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'core/.env' });

// ========================
// ORCHESTRATOR IMPORT (Only once)
// ========================
// In server.js
const orchestrator = require('./orchestrator/index'); // The instance
const orchestratorRouter = require('./orchestrator/index').router; // The router

// Mount the entire orchestrator router
app.use('/api', orchestratorRouter);

// Usage:
// await orchestrator.processRequest(body);

const app = express();

// --- CRITICAL ERROR HANDLING ---
process.on('uncaughtException', (err) => {
    console.error('CRITICAL UNCAUGHT EXCEPTION:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION AT:', promise, 'REASON:', reason);
    process.exit(1);
});

const PORT = process.env.PORT || 3000;

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("[SYSTEM] Connected to MongoDB Atlas: RealAIID-Mainframe-01"))
    .catch(err => console.error("[CRITICAL] MongoDB connection error:", err));

// --- LOGGER ---
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [new winston.transports.Console()]
});

// --- MIDDLEWARE ---
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- DIAGNOSTIC TRACE ---
app.use((req, res, next) => {
    console.log(`[TRACE] ${req.method} ${req.originalUrl}`);
    next();
});

// =========================================================================
// 1. AUTONOMOUS DYNAMIC BRIDGE LOADER
// =========================================================================
const bridgesPath = path.join(__dirname, 'bridges');

if (fs.existsSync(bridgesPath)) {
    fs.readdirSync(bridgesPath).forEach(file => {
        if (file.endsWith('.js')) {
            const bridgeName = file.replace('.js', '');
            try {
                const bridgeRouter = require(path.join(bridgesPath, file));
                app.use(`/api/v1/${bridgeName}`, bridgeRouter);
                console.log(`[SYSTEM] Mounted ${bridgeName} to /api/v1/${bridgeName}`);
            } catch (err) {
                logger.error(`[!] Node ${file} failed ingestion: ${err.message}`);
            }
        }
    });
}

// =========================================================================
// 2. INTELLIGENT ORCHESTRATOR
// =========================================================================
app.post('/api/orchestrate', async (req, res) => {
    try {
        const { input, context, bioSignProof, agentType = "verification" } = req.body;

        if (!bioSignProof) {
            return res.status(401).json({ error: "Bio-Sign™ proof is required" });
        }

        let result;

        switch (agentType.toLowerCase()) {
            case "sentinel":
                result = await require('./orchestrator/agents/sentinel-agent').verify(context, bioSignProof);
                break;
            case "aii-economy":
                result = await require('./orchestrator/agents/aii-economy-agent').process(context, bioSignProof);
                break;
            case "robotics":
                result = await require('./orchestrator/agents/robotics-agent').process(context, bioSignProof);
                break;
            case "verification":
            default:
                result = await require('./orchestrator/agents/verification-agent').verify(context, bioSignProof);
                break;
        }

        res.json(result);
    } catch (error) {
        console.error("Orchestrator Error:", error);
        res.status(500).json({ error: error.message });
    }
});

console.log("✅ REALAiiD Orchestrator mounted at /api/orchestrate");

// =========================================================================
// 3. TELEMETRY & STATIC FILES
// =========================================================================
app.get('/api/v1/telemetry/live-mesh', (req, res) => {
    res.json({
        nodesActive: 41,
        meshStatus: "PHL-01_STABLE",
        timestamp: new Date().toISOString()
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- HEARTBEAT ---
setInterval(() => {
    console.log('[HEARTBEAT] Mesh Active...');
}, 60000);

// --- FINAL SERVER START ---
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`[PHL-01] MAINFRAME V25.2 ONLINE // AUTONOMOUS MESH ACTIVE // ORCHESTRATOR READY`);
    console.log(`[SYSTEM] Server is running and listening on port ${PORT}`);
});