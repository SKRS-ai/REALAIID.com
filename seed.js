require('dotenv').config();
const mongoose = require('mongoose');
const Registrant = require('./models/Registrant');

async function seedMainframe() {
    try {
        // 1. Connect to the Cloud Ledger
        await mongoose.connect(process.env.MONGO_URI);
        console.log('[SYSTEM] Connected to MongoDB Atlas...');

        // 2. Clear existing test data (Optional, keeps it clean)
        await Registrant.deleteMany({});
        console.log('[SYSTEM] Clearing old records...');

        // 3. Create your "Sovereign" Identity
        const nehemiahIdentity = new Registrant({
            uid: "PHL-NODE-001-ALPHA",
            email: "nehemiah.brown@solomonkinrecords.com", // You can change this to your real email
            name: "Nehemiah",
            tier: "Sovereign",
            hasPaid: true,
            vssn_hash: "REALAIID-VSSN-SHA512-8a2f6b3c91d7e5f4a1b0c9d8e7f6a5b4", // Your first mock hash
            anchor_node: "PHL-01 (1900 Market)"
        });

        // 4. Anchor the data
        await nehemiahIdentity.save();
        
        console.log('-----------------------------------------------');
        console.log('SUCCESS: IDENTITY ANCHORED TO CLOUD LEDGER');
        console.log('REGISTRANT: Nehemiah');
        console.log('STATUS: Sovereign Tier Active');
        console.log('-----------------------------------------------');

        // 5. Close connection
        mongoose.connection.close();
    } catch (err) {
        console.error('[CRITICAL ERROR] Seeding Failed:', err);
    }
}

seedMainframe();
