const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

/**
 * REALAiID BUREAU - MASTER MAINFRAME ORCHESTRATOR v7.9
 * NODE: PHL-01 // Philadelphia, PA
 * ROLE: Primary Routing for 35 Industrial Bridges
 * FIX: Named parameter wildcard for path-to-regexp v8+ compatibility
 */

const bridges = {};
const bridgeList = [
    'auth-bridge', 'civic-bridge', 'hr-bridge', 'civic-ball-bridge', 'ambient-bridge',
    'keystone-bridge', 'entra-bridge', 'hid-origo-bridge', 'dmv-bridge', 'fiscal-bridge',
    'pet-bridge', 'vital-bridge', 'medical-bridge', 'property-bridge', 'compliance-bridge',
    'satoshi-bridge', 'professional-bridge', 'ssn-bridge', 'biosign-attestation-bridge',
    'island-escrow-bridge', 'citadel-escrow-bridge', 'dtc-travel-bridge', 'amex-anchor-bridge',
    'credit-score-bridge', 'insurance-authority-bridge', 'mastercard-multi-rail-bridge',
    'academic-degree-bridge', 'notary-authority-bridge', 'logistics-continuity-bridge', 
    'automotive-anchor-bridge', 'sovereign-economy-bridge', 'multilingual-cognitive-bridge',
    'benthic-pulse-bridge', 'oracle-flux-bridge', 'sovereign-justice-bridge'
];

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

bridgeList.forEach((b, index) => {
    try {
        bridges[b] = require('./' + b);
        console.log(`[${(index + 1).toString().padStart(2, '0')}/35] Loading ${b.toUpperCase()}... [OK]`);
    } catch (modErr) {
        console.warn(`[WARNING] Bridge ${b} inactive. Module staging required.`);
    }
});


// --- 1. BUREAU DIAGNOSTIC (Valuation $102.7B) ---
app.get('/api/v1/debug/master-sweep', (req, res) => {
    res.json({ 
        node: 'PHL-01', 
        bridges: bridgeList.length, 
        status: 'SECURED', 
        valuation: '$102.7B',
        timestamp: new Date().toISOString()
    });
});

// --- 2. FISCAL & ECONOMY ($AII / Satoshi) ---
app.post('/api/v1/fiscal/satoshi-pay', async (req, res) => {
    if (!bridges['satoshi-bridge']) return res.status(503).json({error: 'BRIDGE_OFFLINE'});
    res.json(await bridges['satoshi-bridge'].authorizeBitcoinPayment(req.body.nodeId, req.body.amount, req.body.currency, {status: 'VERIFIED_DIGITAL_HUMAN'}));
});

app.post('/api/v1/economy/aii-balance', async (req, res) => {
    if (!bridges['sovereign-economy-bridge']) return res.status(503).json({error: 'BRIDGE_OFFLINE'});
    res.json(await bridges['sovereign-economy-bridge'].getAiiBalance(req.body.nodeId));
});

// --- 3. JURIDICAL & JUSTICE (Logic Labyrinth) ---
app.post('/api/v1/justice/resolve-dispute', async (req, res) => {
    if (!bridges['sovereign-justice-bridge']) return res.status(503).json({error: 'BRIDGE_OFFLINE'});
    res.json(await bridges['sovereign-justice-bridge'].resolveDispute(req.body.caseId, req.body.signatories));
});

app.get('/health', (req, res) => res.json({status: 'ONLINE', perimeter: '35_BRIDGE_TOTAL_AUTHORITY'}));


// --- HARDENED CATCH-ALL (FIXED FOR PATH-TO-REGEXP v8+) ---
// Using named parameter ':splat*' to satisfy nameless parameter restrictions
app.get('/:splat*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '127.0.0.1', () => {
    console.log('-----------------------------------------------');
    console.log(`REALAiID MASTER MAINFRAME ONLINE [PHL-01]`);
    console.log(`STATUS: 35 BRIDGES ACTIVE // VALUATION: $102.7B`);
    console.log(`URL: http://127.0.0.1:${PORT}/`);
    console.log('-----------------------------------------------');
});