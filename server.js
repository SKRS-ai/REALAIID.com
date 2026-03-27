require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Registrant = require('./models/Registrant'); // The Schema we created

const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. MAINFRAME CONNECTION (MongoDB) ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('[DATABASE] Connected to MongoDB Atlas - Ledger Active'))
    .catch(err => console.error('[ERROR] Connection Denied:', err));

// --- 2. MIDDLEWARE & CONFIG ---
app.use(express.json());
app.use(express.static('public')); // Serves index, hashing-info, etc.

// --- 3. SECURITY LAYER: THE GATEKEEPER ---
const verifyAccess = async (req, res, next) => {
    // In a real scenario, this would check a JWT token or Session Cookie
    const restrictedPaths = ['/dashboard.html', '/voice-terminal.html', '/calibrate-camera.html'];
    
    if (restrictedPaths.includes(req.path)) {
        // Simple Logic: Check database if the user is authorized
        // We'll use a placeholder email for now; later this comes from the login session
        const user = await Registrant.findOne({ email: 'nehemiah@example.com' }); 
        
        if (!user || !user.hasPaid) {
            console.log(`[SECURITY] Access Denied to ${req.path}. Redirecting to Checkout.`);
            return res.redirect('/register-checkout.html');
        }
    }
    next();
};

app.use(verifyAccess);

// --- 4. API ENDPOINTS (Data Exchange) ---

// Get User Profile for Dashboard
app.get('/api/user-profile', async (req, res) => {
    try {
        const user = await Registrant.findOne({ email: 'nehemiah@example.com' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Mainframe Timeout." });
    }
});

// Update VSSN Hash (Called after Voice/Spatial capture is complete)
app.post('/api/update-vssn', async (req, res) => {
    const { email, new_hash } = req.body;
    try {
        await Registrant.findOneAndUpdate({ email: email }, { vssn_hash: new_hash });
        res.json({ status: "VSSN Anchored to Ledger." });
    } catch (err) {
        res.status(500).json({ error: "Hash Write Failed." });
    }
});

// --- 5. START SERVER ---
app.listen(PORT, () => {
    console.log(`-----------------------------------------------`);
    console.log(`REALAIID BUREAU MAINFRAME ACTIVE ON PORT ${PORT}`);
    console.log(`NODE LOCATION: PHL-MAIN-01 (1900 Market St)`);
    console.log(`-----------------------------------------------`);
});
