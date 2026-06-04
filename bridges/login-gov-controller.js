const security = require('./security');

exports.initiateAuth = (req, res) => {
    // Construct OIDC authorize URL for Login.gov
    // NIST 800-63-3 Assurance Level: IAL2/AAL2
    const authUrl = `https://idp.int.identitysandbox.gov/openid_connect/authorize?` +
                    `scope=openid+email&response_type=code&client_id=${process.env.LOGIN_GOV_CLIENT_ID}` +
                    `&redirect_uri=${process.env.LOGIN_GOV_REDIRECT_URI}&nonce=${security.generateNonce()}`;
    
    res.redirect(authUrl);
};

exports.handleCallback = async (req, res) => {
    // Exchange code for token using private_key_jwt
    const token = await security.exchangeCodeForToken(req.body.code);
    res.json({ status: 'AUTHENTICATED', token });
};