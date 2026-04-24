require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Registrant = require('./models/Registrant');
const verifyAccess = require('./middleware'); 
const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. MAINFRAME CONNECTION (MongoDB Atlas) ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('[DATABASE] Connected to MongoDB Atlas - Ledger Active'))
    .catch(err => console.error('[ERROR] Connection Denied:', err));

// --- 2. MIDDLEWARE & CONFIGURATION ---
app.use(express.json());

// Apply the Gatekeeper logic (verifyAccess) to protect restricted routes
app.use(verifyAccess);

// Serve your Front-End assets (index.html, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// --- 3. API ENDPOINTS (Data Exchange) ---

// Registry Verification Search
app.post('/api/verify', async (req, res) => {
    const { searchId } = req.body;
    try {
        const user = await Registrant.findOne({ vssn_id: searchId });
        if (user) {
            res.json({ status: "Authenticated", residency: user.residency });
        } else {
            res.status(404).json({ error: "Identity Not Found in Ledger." });
        }
    } catch (err) {
        res.status(500).json({ error: "Node Timeout." });
    }
});

// Update VSSN Hash (Triggered after Voice/Spatial capture)
app.post('/api/update-vssn', async (req, res) => {
    const { email, new_hash } = req.body;
    try {
        await Registrant.findOneAndUpdate({ email: email }, { vssn_hash: new_hash });
        res.json({ status: "VSSN Anchored to Ledger." });
    } catch (err) {
        res.status(500).json({ error: "Hash Write Failed." });
    }
});

// --- 4. START SERVER ---
app.listen(PORT, () => {
    console.log(`-----------------------------------------------`);
    console.log(`REALAIID BUREAU MAINFRAME ACTIVE ON PORT ${PORT}`);
    console.log(`NODE: PHL-MAIN-01 | ENCRYPTION: AES-256`);
    console.log(`-----------------------------------------------`);

});