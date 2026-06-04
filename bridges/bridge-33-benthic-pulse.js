/**
 * REALAiID BUREAU - BENTHIC PULSE (Bridge 33)
 * ROLE: Deep-Cold Data Center Telemetry
 * STATUS: MASTER_ACTIVE // NODE PHL-01
 */

const express = require('express');
const crypto = require('crypto');
const router = express.Router();

async function initializeBenthicPulse() {
    // 1. Telemetry Ingest Root
    const telemetryRoot = {
        nodeID: "PHL-01-SUBMERGED",
        sensorArray: "ACTIVE",
        environmentalStatus: "STABLE_4C",
        timestamp: new Date().toISOString()
    };

    try {
        console.log(`[BENTHIC-PULSE] INITIATING SOVEREIGN TELEMETRY SYNC...`);

        // 2. Forensic Hashing (Internal Seal)
        const benthicSeal = crypto.createHmac('sha256', telemetryRoot.nodeID)
            .update(JSON.stringify(telemetryRoot) + "BENTHIC_PULSE_ROOT")
            .digest('hex');

        // 3. High-Assurance Handshake
        // Use environment variable for the port to ensure absolute URL resolution
        const port = process.env.PORT || 3000;
        const response = await fetch(`http://localhost:${port}/api/v1/benthic/sync`, {
            method: 'POST',
            headers: { 
                'X-Bureau-Authority': 'SOVEREIGN_ROOT_LOCKED',
                'X-Forensic-Seal': benthicSeal,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                ...telemetryRoot,
                benthic_marrow_id: benthicSeal
            })
        });

        if (response.ok) {
            console.log("Bridge 33: Benthic Pulse Telemetry Seated");
        }
    } catch (e) {
        console.error("Benthic Ingest Critical Failure:", e);
    }
}

// AUTO-SEAT: Execute on initialization
initializeBenthicPulse();

// Express Route Logic for this Bridge
router.post('/sync', (req, res) => {
    res.status(200).json({ status: "PULSE_NOMINAL" });
});

module.exports = router;