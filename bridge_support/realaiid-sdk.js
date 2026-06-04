/**
 * REALAiID BUREAU // UNIVERSAL CLIENT INGESTION SDK v1.0
 * MODULE: realaiid-sdk.js
 * ROLE: Encapsulates distributed mainframe sensory rails into an integration package client library
 * STATUS: PHL-01 STABLE // SDK DIST CORE READY
 */

class REALAIIDClient {
    /**
     * Instantiates the core platform communication hub context
     * @param {Object} config - Configuration options detailing endpoints and routing protocols
     */
    constructor(config) {
        this.gatewayUrl = config?.gatewayUrl || 'http://localhost:3000';
        this.authNodeKey = config?.authNodeKey || null;
    }

    /**
     * Dispatches an un-interceptable network request out to the active orchestrator mainframe core
     * @private
     */
    async _dispatchGatewayRequest(path, payload, method = 'POST') {
        const endpoint = `${this.gatewayUrl}${path}`;
        
        try {
            // Emulate client payload transmission stack tracking contexts
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Bureau-Node-Key': this.authNodeKey || 'SDK_MOCK_PASS'
                }
            };

            if (method === 'POST') {
                options.body = JSON.stringify(payload);
            }

            // Standard javascript network channel lookup call
            const response = await fetch(endpoint, options);
            if (!response.ok) {
                throw new Error(`Platform gateway rejected transmission context: Status ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`[SDK-CORE-CRITICAL-ERROR] Ingestion path route failed to resolve: ${error.message}`);
            return { success: false, error: "GATEWAY_CONNECTION_DISRUPTION", message: error.message };
        }
    }

    /**
     * Executes a zero-knowledge national identity verification checking loop run
     * @param {string} sovereignID - Parent human tracking identification node handle
     * @param {string} rawIdString - Unsanitized identifier sequence string (e.g., SSN)
     */
    async sanitizeNationalIdentifier(sovereignID, rawIdString) {
        return await this._dispatchGatewayRequest('/api/v1/identity/national-sanitize', {
            sovereignID,
            nationalId: rawIdString
        });
    }

    /**
     * Records a secure cryptographic attestation footprint binding legal documents to human roots
     * @param {string} sovereignID -signer biological human tracking identification node handle
     * @param {string} documentHash - Clean content-addressed checksum identifier hash value literal
     * @param {string} documentTitle - Human legible title string handle
     */
    async executeBioSignAttestation(sovereignID, documentHash, documentTitle) {
        return await this._dispatchGatewayRequest('/api/v1/compliance/biosign-attest', {
            sovereignID,
            documentHash,
            documentTitle
        });
    }

    /**
     * Computes localized utility costs and deducts pricing points from pre-funded wallet packages
     * @param {string} sovereignID - Biological human tracking identity node string
     * @param {Array} targetedBridgesList - Collection array of targeted infrastructure handles to open
     */
    async processPreFundedUtilityCheckout(sovereignID, targetedBridgesList) {
        return await this._dispatchGatewayRequest('/api/v1/finance/utility-checkout', {
            sovereignID,
            targetedBridges: targetedBridgesList,
            paymentMedium: 'AII_CREDIT'
        });
    }
}

module.exports = REALAIIDClient;