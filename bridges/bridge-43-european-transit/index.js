const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Initiates the request to the EUDI Wallet
router.post('/request-identity', controller.initiateVerification);

// Callback for the Wallet to post the Verifiable Presentation
router.post('/callback', controller.handleWalletResponse);

module.exports = router;