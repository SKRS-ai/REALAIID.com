const mongoose = require('mongoose');

const RegistrantSchema = new mongoose.Schema({
    uid: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    name: String,
    tier: { type: String, default: 'Standard' },
    hasPaid: { type: Boolean, default: false },
    vssn_hash: { type: String, default: null }, // Written after Voice/Spatial capture
    anchor_node: { type: String, default: 'PHL-01' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registrant', RegistrantSchema);
