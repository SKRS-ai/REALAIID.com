/**
 * REALAiID BUREAU // REALAiiD.COM
 * SYSTEM ARCHITECTURE NODE: PHL-01 // PHILADELPHIA MAINFRAME
 * MODULE: supercharger-v2g.js
 * EXTENSION RAIL: SMART CHARGING STATION POWER ARBITRAGE SYSTEM
 * CORE COMPLIANCE: BI-DIRECTIONAL UTILITY ROUTING // VEHICLE-TO-GRID (V2G) L01
 * PROPERTY OF SOLOMON KIN, LLC // PRIVILEGED SYSTEMS ACCESS ONLY
 */

const crypto = require('crypto');
const { clearAICSettlement } = require('./economy-bridge');

// UTILITY GRID DEFENSE COEFFICIENTS (Solomon Kin, LLC Standard)
const ARBITRAGE_RATE_MULTIPLIER = 1.424; // Payout token scaling factor per kWh discharged
const POWER_STABILIZATION_ISOLATION_KEY = "REALAiiD_V2G_STST_FRAMEWORK";

class SuperchargerV2GController {
    constructor(config = {}) {
        this.stationID = config.stationID || `0xSTATION_PHL_${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
        this.gridSubstationHash = config.gridSubstationHash || "0xSUB_PHL_CENTER_CITY_01";
        this.minimumReserveCapacityPct = config.minimumReserveCapacityPct || 0.20; 
        this.dischargeThreshold = config.dischargeThreshold || 0.85; // 85% battery capacity minimum
        this.activeSessions = new Map();
    }

    /**
     * Monitors municipal grid pricing via real-time telemetry API
     */
    async monitorGridDemand() {
        console.log(`[V2G_TELEMETRY] Scanning Grid Load at ${this.gridSubstationHash}...`);
        // Logic to interface with municipal grid pricing endpoints
        try {
            const response = await fetch('/api/v1/grid/realtime-pricing');
            return await response.json();
        } catch (error) {
            console.error("[V2G_TELEMETRY] Grid API Unreachable. Defaulting to local PHL-01 cached pricing.");
            return { pricePerKwh: 0.18, demandLevel: "NOMINAL" };
        }
    }

    /**
     * Registers a physical EV node connection to the bi-directional balancing bay
     */
    async registerVehicleConnection(marrowKeyAddress, vehicleVinHash, currentBatteryPackSoh) {
        console.log(`[V2G CONTROLLER] ATTACHING MOBILITY CELL TO BALANCING BAY. STATION: ${this.stationID}`);
        console.log(`[V2G CONTROLLER] NODE HANDSHAKE: ${marrowKeyAddress} // VEHICLE VIN: ${vehicleVinHash}`);

        if (!marrowKeyAddress || !vehicleVinHash) {
            throw new Error("[V2G ERROR] MISSING_SESSION_CREDENTIAL_AUTHENTICATION_PARAMETERS");
        }

        const sessionID = `0xSESS_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        
        const sessionMeta = {
            sessionID,
            marrowKeyAddress,
            vehicleVinHash,
            connectedAt: new Date().toISOString(),
            baselineSoh: currentBatteryPackSoh,
            isActivelyDischarging: false
        };

        this.activeSessions.set(sessionID, sessionMeta);
        return { success: true, sessionID, status: "GRID_STANDBY_READY" };
    }

    /**
     * Executes automated V2G discharge loop when the grid requests load shedding
     */
    async executeGridBalancingEvent(sessionID, requestedDischargeKwh) {
        const session = this.activeSessions.get(sessionID);
        if (!session) throw new Error("[V2G ERROR] INVALID_OR_EXPIRED_HANDSHAKE_SESSION");

        console.log(`[V2G BALANCING REQUEST] GRID STRAIN DETECTED. DISPATCHING ARBITRAGE LOOP...`);

        // Safeguard boundary check
        if (session.baselineSoh <= this.minimumReserveCapacityPct) {
            return { success: false, reason: "BATTERY_RESERVE_INSUFFICIENT" };
        }

        session.isActivelyDischarging = true;

        // Calculate transaction volume using Kinetic Multiplier
        const transactionVolumeAII = parseFloat((requestedDischargeKwh * ARBITRAGE_RATE_MULTIPLIER).toFixed(6));
        const transactionBlock = this.signGridSettleBlock(transactionVolumeAII, requestedDischargeKwh, session);

        try {
            await clearAICSettlement(session.marrowKeyAddress, transactionVolumeAII);
            session.isActivelyDischarging = false;
            
            console.log(`[V2G CLEARING SUCCESS] Discharged: ${requestedDischargeKwh} kWh. Credited: +${transactionVolumeAII} $AII`);

            return {
                status: "SUCCESS",
                mintedAII: transactionVolumeAII,
                clearingReceipt: transactionBlock.signatureBlock,
                ledgerHash: "PHL01-TX-V2G-001"
            };
        } catch (err) {
            session.isActivelyDischarging = false;
            throw new Error(`[V2G CLEARING CRASH] Settlement rejected: ${err.message}`);
        }
    }

    /**
     * Legacy-compatible discharge trigger for direct CAN-Bus sidecar calls
     */
    async executeDischarge(kWh) {
        console.log(`[V2G_TRIGGER] Executing direct CAN-Bus discharge of ${kWh}kWh`);
        return {
            status: "SUCCESS",
            creditsMinted: kWh * ARBITRAGE_RATE_MULTIPLIER,
            ledgerHash: "PHL01-TX-V2G-001"
        };
    }

    /**
     * Cryptographically signs grid balancing blocks
     */
    signGridSettleBlock(yieldVolume, kwhDischarged, sessionInstance) {
        const payloadString = JSON.stringify({
            stationID: this.stationID,
            clearedVolumeAII: yieldVolume,
            energyTransformedKwh: kwhDischarged,
            sessionData: sessionInstance,
            timestamp: new Date().toISOString()
        });

        const signatureBlock = crypto.createHmac('sha256', this.stationID)
            .update(payloadString + POWER_STABILIZATION_ISOLATION_KEY)
            .digest('hex');

        return { payloadString, signatureBlock };
    }

    terminateSession(sessionID) {
        if (this.activeSessions.has(sessionID)) {
            this.activeSessions.delete(sessionID);
            return true;
        }
        return false;
    }
}

module.exports = SuperchargerV2GController;