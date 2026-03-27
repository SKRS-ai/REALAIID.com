const express = require('express');
const app = express();
const PORT = 3000;

// MOCK DATABASE 
// (In production, this would be MongoDB or PostgreSQL)
const registrantDatabase = [
    {
        uid: "PHL-USER-9921",
        name: "Nehemiah",
        tier: "Sovereign",
        vssn_hash: "REALAIID-VSSN-SHA512-8a2f6b3c91d...ae44",
        node: "PHL-01",
        shield_active: true,
        resonance_lock: true
    }
];

// MIDDLEWARE
app.use(express.static('public')); // Serves your HTML/CSS/Images
app.use(express.json());

// API ENDPOINT: Fetch Registrant Data
app.get('/api/user-profile', (req, res) => {
    // 1. In a real app, we verify the JWT token from the browser here
    const user = registrantDatabase[0]; 

    if (user) {
        console.log(`[MAINFRAME] Authenticated session for Node: ${user.node}`);
        res.json(user);
    } else {
        res.status(401).send("Unauthorized Access Detected.");
    }
});

app.listen(PORT, () => {
    console.log(`[REALAIID BUREAU] Mainframe active at http://localhost:${PORT}`);
    console.log(`[STATUS] Monitoring Ingest Node: PHL-01`);
});
