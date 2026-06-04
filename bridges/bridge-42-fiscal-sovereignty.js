/**
 * BRIDGE-42-FISCAL-SOVEREIGNTY
 * ROLE: HMRC MTD VAT Compliance & Sovereign Fiscal Sync
 * STATUS: DEVELOPMENT // SANDBOX READY
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');

// HMRC Sandbox URL: switch to https://api.service.hmrc.gov.uk for production
const HMRC_BASE_URL = 'https://test-api.service.hmrc.gov.uk';
const CLIENT_ID = process.env.HMRC_CLIENT_ID;
const CLIENT_SECRET = process.env.HMRC_CLIENT_SECRET;

// 1. Initiate OAuth2 Authorization Request
router.get('/auth', (req, res) => {
    const authUrl = `${HMRC_BASE_URL}/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&scope=write:vat read:vat&redirect_uri=${process.env.REDIRECT_URI}`;
    res.redirect(authUrl);
});

// 2. Handle Callback & Exchange Code for Token
router.get('/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const response = await axios.post(`${HMRC_BASE_URL}/oauth/token`, {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: process.env.REDIRECT_URI,
            code
        });
        // Store these tokens securely; they are required for all subsequent API calls
        const { access_token, refresh_token } = response.data;
        res.json({ status: "AUTHENTICATED", message: "Tokens acquired" });
    } catch (err) {
        res.status(500).json({ status: "ERROR", message: "Token exchange failed" });
    }
});

// 3. Submit VAT Return
router.post('/submit-vat', async (req, res) => {
    const { vrn, periodKey, vatData } = req.body;
    
    try {
        const response = await axios.post(
            `${HMRC_BASE_URL}/organisations/vat/${vrn}/returns`,
            {
                periodKey,
                vatDueSales: vatData.vatDueSales,
                vatDueAcquisitions: vatData.vatDueAcquisitions,
                totalVatDue: vatData.totalVatDue,
                vatReclaimedCurrPeriod: vatData.vatReclaimedCurrPeriod,
                netVatDue: vatData.netVatDue,
                totalValueSalesExVAT: vatData.totalValueSalesExVAT,
                totalValuePurchasesExVAT: vatData.totalValuePurchasesExVAT,
                totalValueGoodsSuppliedExVAT: vatData.totalValueGoodsSuppliedExVAT,
                totalAcquisitionsExVAT: vatData.totalAcquisitionsExVAT,
                finalised: true
            },
            {
                headers: {
                    'Authorization': `Bearer ${req.headers.access_token}`,
                    'Content-Type': 'application/json',
                    'Gov-Test-Scenario': 'QUARTERLY_VAT_RETURN' // Use for sandbox testing
                }
            }
        );
        res.json({ status: "SUCCESS", data: response.data });
    } catch (err) {
        res.status(500).json({ status: "ERROR", detail: err.response?.data || err.message });
    }
});

module.exports = router;