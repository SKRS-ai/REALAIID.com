// REALAIID.com | Digital Sovereignty Protocol: Middleware
// Purpose: Protect "Vault" and "Restricted" pages from unauthorized access.

const verifyAccess = (req, res, next) => {
    // Check for tokens and payment status in headers
    const userSession = req.headers['x-access-token']; 
    const hasPaid = req.headers['x-payment-status'] === 'confirmed';

    // List of "Restricted" and "Vault" files requiring the Triple-Lock check
    const restrictedPages = [
        '/voice-terminal.html', 
        '/calibrate-camera.html', 
        '/vssn-complete.html',
        '/dashboard.html',
        '/api-docs.html'
    ];

    // Security Logic
    if (restrictedPages.includes(req.path)) {
        if (!userSession || !hasPaid) {
            console.log(`[SECURITY ALERT] Unauthorized access attempt to ${req.path}`);
            // Redirect to checkout if security criteria aren't met
            return res.redirect('/register-checkout.html');
        }
    }
    
    next(); // Access granted to the "Mainframe"
};

// Exporting the module for use in server.js
module.exports = verifyAccess;