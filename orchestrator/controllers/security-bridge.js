// orchestrator/controllers/security-bridge.js
const express = require('express');
const router = express.Router();
const securityLogic = require('../../bridges/security'); // Import from the bridge location

// Wrap the bridge logic in a standard Express handler
router.use((req, res, next) => {
    try {
        // Assume securityLogic is a function or router
        if (typeof securityLogic === 'function') {
            return securityLogic(req, res, next);
        }
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = router;