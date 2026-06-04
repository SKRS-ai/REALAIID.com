/**
 * REALAiID BUREAU - DMV AUTHORITY (Bridge 09)
 * ROLE: Vehicle Asset Anchoring & Transport Class Oracle
 * PROTOCOL: VIN-to-Sovereign Frequency Mapping
 * STATUS: PRODUCTION_ACTIVE // CLASS_RATING_ENABLED
 */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { validateTransportClass } = require('../bridge_support/transport-credentials');

// --- ASSET ANCHORING LOGIC ---
async function anchorVehicleToNode(nodeId, vinCode) {
    console.log(`[DMV-AUTHORITY] MAPPING VIN: ${vinCode} TO SOVEREIGN NODE: ${nodeId}`);

    const assetHash = crypto.createHmac('sha256', nodeId)
        .update(vinCode + "SOLOMON_KIN_MARITIME")
        .digest('hex');

    return {
        success: true,
        bridge: "09",
        assetType: "AUTOMOTIVE",
        standing: "IMMUTABLE_OWNERSHIP_SEATED",
        ignitionStatus: "MARROW_LOCKED",
        timestamp: new Date().toISOString(),
        forensic_hash: assetHash
    };
}

// --- API ROUTER ENDPOINTS ---

// Existing Anchor Endpoint
router.post('/anchor', async (req, res) => {
    const { nodeId, vinCode } = req.body;
    const result = await anchorVehicleToNode(nodeId, vinCode);
    res.json(result);
});

// NEW: Class-Rating Aware License Validation
router.post('/validate-license', async (req, res) => {
    try {
        const { licenseData } = req.body;
        const validation = await validateTransportClass(licenseData);
        res.json({ success: true, ...validation });
    } catch (error) {
        res.status(500).json({ success: false, error: 'LICENSE_VALIDATION_FAILURE' });
    }
});

module.exports = router;