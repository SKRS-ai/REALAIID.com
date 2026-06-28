// /orchestrator/middleware/bio-sign-guard.js
/**
 * Bio-Sign™ Guard Middleware
 * Enforces the core security rule: ALL operations must be backed by live Bio-Sign™ verification
 */

const privacyEnforcer = require('./privacy-enforcer');

class BioSignGuard {
    /**
     * Main guard function - must be called before any sensitive operation
     * @param {Object} bioSignProof - Live biometric proof from client device
     * @param {String} operation - Description of the operation (for logging)
     * @returns {Promise<Object>} Verified proof + metadata
     */
    async enforce(bioSignProof, operation = "unknown") {
        if (!bioSignProof) {
            throw new Error("Bio-Sign™ proof is required for this operation.");
        }

        // Verify the biometric proof
        const verificationResult = await privacyEnforcer.verifyBioSign(bioSignProof);
        
        if (!verificationResult.valid) {
            throw new Error(`Bio-Sign™ verification failed: ${verificationResult.reason || 'Invalid biological signature'}`);
        }

        // Log the verified operation
        await privacyEnforcer.logInteraction({
            type: "bio-sign-guard",
            operation: operation,
            timestamp: new Date().toISOString(),
            status: "verified",
            userToken: verificationResult.userToken || "anonymous"
        });

        return {
            success: true,
            userToken: verificationResult.userToken,
            verifiedAt: new Date().toISOString(),
            assuranceLevel: "IAL3" // High assurance per NIST standards
        };
    }

    /**
     * Quick check for low-risk operations
     */
    async quickCheck(bioSignProof) {
        if (!bioSignProof) return false;
        const result = await privacyEnforcer.verifyBioSign(bioSignProof);
        return result.valid === true;
    }
}

module.exports = new BioSignGuard();