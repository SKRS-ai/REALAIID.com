/**
 * BRIDGE: Fiscal Sovereignty (HMRC Integration)
 * STATUS: Ingestion Ready
 */
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Route: /api/v1/fiscal-sovereignty/callback
router.get('/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send("No authorization code provided.");
    }

    try {
        const tokenResponse = await axios.post('https://test-api.service.hmrc.gov.uk/oauth/token', {
            client_id: process.env.HMRC_CLIENT_ID,
            client_secret: process.env.HMRC_CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: process.env.HMRC_REDIRECT_URI,
            code: code
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const { access_token, refresh_token } = tokenResponse.data;

        console.log("Access Token received successfully.");
        // TODO: Persist access_token/refresh_token to MongoDB here
        
        res.send("Authentication Successful. You can now close this window.");
    } catch (error) {
        console.error("Token Exchange Failed:", error.response?.data || error.message);
        res.status(500).send("Authentication failed during token exchange.");
    }
});

module.exports = router;