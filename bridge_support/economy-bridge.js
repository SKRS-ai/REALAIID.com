/**
 * REALAiID BUREAU // SOVEREIGN METAVERSE ECONOMY
 * MODULE: economy-bridge.js
 * ROLE: Coordinates transactional settlements, $AII issuance, Bio-Value metrics, and royalty loops.
 * STATUS: PRODUCTION-READY // INTEGRATED WITH PHL-01 MAINFRAME
 */

const express = require('express');
const router = express.Router();
// Adjusted path to look one level up for the ledger module
const { mintSovereignAsset } = require('../services/ledger'); 

// =========================================================================
// CORE ECONOMIC LOGIC
// =========================================================================

function calculateComputeYield(petascaleFlops, kineticReserveJoules) {
    if (!petascaleFlops || petascaleFlops <= 0) return 0;
    const COMPUTE_CONVERSION_FACTOR = 0.00125;
    const rawYield = (petascaleFlops * 0.6) + ((kineticReserveJoules || 0) * 0.4);
    return parseFloat((rawYield * COMPUTE_CONVERSION_FACTOR).toFixed(6));
}

async function clearAICSettlement(sovereignID, amount) {
    console.log(`[ECONOMY-BRIDGE] Clearing settlement for ${sovereignID}...`);
    return await mintSovereignAsset(sovereignID, amount, 'COMPUTE_YIELD');
}

async function getBioValueCalculation(sovereignID) {
    const baseValue = 100;
    const bioSignStrength = 2.5; 
    const activityScore = 45.75; 
    const bioValue = baseValue + (bioSignStrength * activityScore);
    return { totalValue: bioValue.toFixed(2), currency: 'USD', timestamp: new Date().toISOString() };
}

async function mintSovereignRoyalty(sovereignID, scrapeEventHash) {
    console.log(`[ROYALTY-ENGINE] Minting royalty for scrape event: ${scrapeEventHash}`);
    return await mintSovereignAsset(sovereignID, 5.00, 'LIKENESS_ROYALTY');
}

// =========================================================================
// API ROUTER ENDPOINTS
// =========================================================================

// POST /api/v1/economy-bridge/settle
router.post('/settle', async (req, res) => {
    const { sovereignID, amount } = req.body;
    try {
        const result = await clearAICSettlement(sovereignID, amount);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/v1/economy-bridge/bio-value/:sovereignID
router.get('/bio-value/:sovereignID', async (req, res) => {
    const result = await getBioValueCalculation(req.params.sovereignID);
    res.json(result);
});

// POST /api/v1/economy-bridge/mint-royalty
router.post('/mint-royalty', async (req, res) => {
    const { sovereignID, scrapeEventHash } = req.body;
    try {
        const result = await mintSovereignRoyalty(sovereignID, scrapeEventHash);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;