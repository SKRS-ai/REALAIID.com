/**
 * REALAiID BUREAU // SDK HANDSHAKE TEST
 * TARGET: AUSTIN-PILOT-001 (Austin Immersion)
 * NODE: PHL-01 (Philadelphia Mainframe)
 */

const { RealAiidClient } = require('./server.js');

async function runTest() {
    console.log("--------------------------------------------------");
    console.log("REALAiID BUREAU // SDK HANDSHAKE INITIATED...");
    console.log("--------------------------------------------------");

    try {
        // 1. Initialize the Merchant Client for Austin Retail
        const merchant = new RealAiidClient({
            merchantId: 'MCH-AUSTIN-7782',
            environment: 'production',
            enforceRealityDefender: true
        });

        console.log(`[INIT] Merchant ID: ${merchant.merchantId}`);
        console.log(`[INIT] Environment: ${merchant.environment}`);
        console.log(`[INIT] SDK Version: ${merchant.version}`);

        // 2. Simulate Attestation Generation (The Handshake)
        console.log("\n[ACTION] Triggering Handshake Knot™...");
        const attestation = await merchant.generateAttestation({
            intent: "AUSTIN_IMMERSION_RETAIL_INGEST",
            timestamp: new Date().toISOString()
        });

        // 3. Verify Response logic
        console.log(`[RESPONSE] Status: ${attestation.status}`);
        console.log(`[RESPONSE] Node: ${attestation.node}`);
        
        if (attestation.status === 'PENDING_BIO_HANDSHAKE') {
            console.log("\n>>> SUCCESS: PHL-01 node is communicating with Austin SDK.");
            console.log(">>> SYSTEM: Ready for Biometric Ingest Stage.");
        }

    } catch (error) {
        console.error("\n[CRITICAL] SDK HANDSHAKE FAILURE:");
        console.error(error.message);
    }
    
    console.log("--------------------------------------------------");
    // Note: We process.exit(0) here because server.js starts a listener 
    // when required, and we want to close the test after execution.
    process.exit(0);
}

runTest();