/**
 * REALAiID BUREAU - SENTRYAI HARDWARE TELEMETRY BRIDGE
 * MODULE: sentry-bridge.js
 * INTEGRATION: SentryAi Sensor Mesh / RealityDefender / TreasuryBridge
 * ROLE: Ingests real-time hardware telemetry and mints sovereign compute yields.
 * STATUS: PHL-01 STABLE // TELEMETRY INGEST ACTIVE
 */

const express = require('express');
const router = express.Router();

// Importing prerequisite modules from the Bureau Mesh
const RealityDefender = require('./reality-defender-bridge');
const TreasuryBridge = require('./economy-bridge'); 
const SentryCore = require('../core/sentry-core'); // Assumed path for Sentry Logic

// =========================================================================
// API ROUTER ENDPOINTS
// =========================================================================

/**
 * POST /api/v1/sentry-bridge/telemetry-ingest
 * ROLE: Ingests sensor data, verifies forensic integrity, and settles sovereign yield.
 */
router.post('/telemetry-ingest', async (req, res) => {
    const { unitId, modelType, sensorData, cryptoHash } = req.body;

    if (!unitId || !modelType || !sensorData || !cryptoHash) {
        return res.status(400).json({ success: false, error: "MISSING_TELEMETRY_PARAMETERS" });
    }

    try {
        // 1. Verify integrity via RealityDefender (Forensic Check)
        // Note: Assuming verifySignature exists on the Radar instance
        const isValid = await RealityDefender.performForensicLookup(cryptoHash); 
        if (isValid.action !== 'ALLOW') {
            return res.status(403).json({ success: false, error: "TAMPER_DETECTED" });
        }

        // 2. Calculate specific Yield for R, C, or I models
        const yieldData = await SentryCore.calculateYield(modelType, sensorData);

        // 3. Update the Sovereign Ledger
        await TreasuryBridge.clearAICSettlement(unitId, yieldData);

        res.json({ 
            success: true, 
            unitId, 
            yield: yieldData,
            status: "TELEMETRY_SETTLED" 
        });

    } catch (error) {
        console.error(`[SENTRY-BRIDGE] INGEST_FAILURE: ${error.message}`);
        res.status(500).json({ success: false, error: "TELEMETRY_INGEST_FAILURE" });
    }
});

module.exports = router;