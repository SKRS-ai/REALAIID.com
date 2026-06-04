const express = require('express');
const router = express.Router();
const loginGovController = require('./login-gov-controller');
const mdlProtocol = require('./mdl-protocol');

// Login.gov OIDC Flow
router.get('/login-gov/auth', loginGovController.initiateAuth);
router.post('/login-gov/callback', loginGovController.handleCallback);

// mDL (ISO/IEC 18013-5) Listener
router.post('/mdl/verify', mdlProtocol.verifyPresentation);

module.exports = router;