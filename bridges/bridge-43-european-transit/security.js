/**
 * CONTROLLER: Handles EUDI Wallet Handshake
 */
const security = require('./security');
const protocol = require('./protocol');

exports.initiateVerification = async (req, res) => {
    try {
        const sessionId = security.generateNonce();
        
        // Store the session ID in your secure repository/cache for verification
        // await sessionStore.save(sessionId, { status: 'PENDING' }); 

        const authRequest = {
            response_type: 'vp_token',
            presentation_definition: {
                id: 'eidas_identity_req',
                input_descriptors: [{
                    id: 'eudi_pid',
                    format: { ldp_vp: { proof_type: ['Ed25519Signature2020'] } }
                }]
            },
            nonce: sessionId,
            state: sessionId // Used to prevent CSRF
        };

        res.json({ status: 'PENDING', authRequest });
    } catch (err) {
        res.status(500).json({ error: 'Failed to initiate eIDAS handshake' });
    }
};

exports.handleWalletResponse = async (req, res) => {
    try {
        const { vp_token, state } = req.body;
        
        // 1. Validate inputs
        if (!vp_token || !state) {
            return res.status(400).json({ error: 'Missing vp_token or state' });
        }

        // 2. Verify cryptographically via protocol
        const validation = await protocol.validatePresentation(vp_token);
        
        if (validation.success) {
            // 3. Extract requested claims
            const verifiedData = protocol.extractClaims(validation.claims, ['given_name', 'age_over_18']);
            
            res.json({ 
                status: 'VERIFIED', 
                message: 'Identity confirmed via EUDI Wallet', 
                data: verifiedData 
            });
        } else {
            res.status(403).json({ error: 'Invalid identity signature: ' + validation.error });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error during wallet response handling' });
    }
};