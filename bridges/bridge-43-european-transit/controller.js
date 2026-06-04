const security = require('./security');
const protocol = require('./protocol');

exports.initiateVerification = async (req, res) => {
    try {
        // Generate a state and nonce for this session
        const sessionId = security.generateNonce();
        
        // Construct the OpenID4VP request object
        const authRequest = {
            response_type: 'vp_token',
            presentation_definition: {
                id: 'eidas_identity_req',
                input_descriptors: [{
                    id: 'eudi_pid',
                    format: { ldp_vp: { proof_type: ['Ed25519Signature2020'] } }
                }]
            },
            nonce: sessionId
        };

        res.json({ status: 'PENDING', authRequest });
    } catch (err) {
        res.status(500).json({ error: 'Failed to initiate eIDAS handshake' });
    }
};

exports.handleWalletResponse = async (req, res) => {
    try {
        const { vp_token, state } = req.body;
        
        if (!vp_token) {
            return res.status(400).json({ error: 'Missing vp_token in request' });
        }

        // 1. Validate the cryptographic signature via protocol.js
        const validation = await protocol.validatePresentation(vp_token);
        
        if (validation.success) {
            // 2. Extract only the fields required for the transaction
            const verifiedData = protocol.extractClaims(validation.claims, ['given_name', 'age_over_18']);
            
            // 3. Proceed with authorization logic
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