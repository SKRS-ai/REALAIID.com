// The "Gatekeeper" Middleware
const verifyAccess = (req, res, next) => {
    const userSession = req.headers['x-access-token']; // Simplified for this example
    const hasPaid = req.headers['x-payment-status'] === 'confirmed';

    // List of "Restricted" and "Vault" files
    const restrictedPages = [
        '/voice-terminal.html', 
        '/calibrate-camera.html', 
        '/vssn-complete.html',
        '/dashboard.html',
        '/api-docs.html'
    ];

    if (restrictedPages.includes(req.path)) {
        if (!userSession || !hasPaid) {
            console.log(`[SECURITY ALERT] Unauthorized access attempt to ${req.path}`);
            return res.redirect('/register-checkout.html'); // Force them to pay first
        }
    }
    
    next(); // Access granted
};

app.use(verifyAccess);
