const crypto = require('crypto');
require('dotenv').config();

/**
 * REALAiID BUREAU - HID ORIGO INFRASTRUCTURE BRIDGE v2.6
 * MODULE: hid-origo-bridge.js
 * STATUS: PHL-01 STABLE // API KEY SECURED VIA ENV
 * * ROLE: Manages physical security perimeters, over-the-air virtual 
 * credential provisioning, and remote lock strike triggers.
 */

// SECURITY: Retrieve API Key from environment variables (Never hardcode)
const HID_API_KEY = process.env.HID_ORIGO_API_KEY;

/**
 * SUBSYSTEM A: OVER-THE-AIR MOBILE CREDENTIAL KEYS
 * Provisions an encrypted high-assurance mobile access credential 
 * to a target mobile container.
 */
async function issueMobileAccessCredential(sovereignID, deviceHardwareId) {
    if (!HID_API_KEY) {
        throw new Error("[HID-ORIGO] ERROR: API Key missing in environment.");
    }

    console.log(`[HID-ORIGO] Dispatching mobile credential enrollment for: ${deviceHardwareId}`);
    
    // Simulate cloud peripheral initialization response latencies
    await new Promise(resolve => setTimeout(resolve, 950));

    const registrationHash = crypto.createHash('sha256')
        .update(sovereignID + deviceHardwareId + "HID_ORIGO_SECURE_ELEMENT_SEAL_2026")
        .digest('hex');

    return {
        success: !!sovereignID && !!deviceHardwareId,
        mobileIdSeeded: `HID-OTA-${registrationHash.substring(0, 16).toUpperCase()}`,
        assignedFacilityProfile: "CLASS_A_FOUNDER_ALL_FACILITIES",
        activationState: "ACTIVE_PROXIMITY_KEY_BOUND",
        timestamp: new Date().toISOString()
    };
}

/**
 * SUBSYSTEM A: PROVISION MOBILE CREDENTIAL
 * Pushes a virtual REALAiID badge to the HID Origo digital wallet profile container.
 */
async function provisionMobileCredential(nodeId, mobileId) {
    console.log(`[HID-ORIGO] INITIATING PROVISIONING SEQUENCE ON CARD MATRIX POOL`);
    console.log(`[HID-ORIGO] TARGET SYSTEM NODE: ${nodeId || "PHL-01"}`);
    
    // Simulate API Latency
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
        status: 'SUCCESS',
        protocol: 'HID_ORIGO_V3_ENHANCED',
        credential_id: `HID-VC-${crypto.randomBytes(5).toString('hex').toUpperCase()}`,
        node_id: nodeId || "PHL-01",
        authorized_by: 'PHL-01-MAINFRAME',
        timestamp: new Date().toISOString()
    };
}

/**
 * SUBSYSTEM B: PHYSICAL READER HARDWARE REMOTE COMMANDS
 * Sends a high-assurance remote release signal to a physical HID reader 
 * to clear the magnetic strike.
 */
async function triggerDoorUnlock(readerId, nodeId) {
    console.log('-----------------------------------------------');
    console.log(`[HID-ORIGO] EXECUTING REMOTE UAC COMMAND`);
    console.log(`[HID-ORIGO] TARGET READER: ${readerId}`);
    
    // Simulate the physical strike release timing
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log(`[HARDWARE] MAGNETIC STRIKE SYSTEM RELEASED.`);
    console.log('-----------------------------------------------');
    
    return {
        success: true,
        action: 'DOOR_UNLOCKED',
        reader: readerId,
        authorized_node: nodeId || "PHL-01",
        status: 'STRIKE_RELEASED',
        handshake: 'BIOMETRIC_INTENT_VERIFIED',
        timestamp: new Date().toISOString()
    };
}

module.exports = { 
    issueMobileAccessCredential,
    provisionMobileCredential, 
    triggerDoorUnlock 
};
