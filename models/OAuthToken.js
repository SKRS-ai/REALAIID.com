/**
 * SCHEMA: OAuthToken
 * ROLE: Securely vaults fiscal access/refresh tokens in MongoDB
 */
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    // The internal ID of the user or system node owning these credentials
    userId: { 
        type: String, 
        required: true, 
        index: true 
    },
    // The provider name (e.g., 'HMRC')
    provider: { 
        type: String, 
        default: 'HMRC' 
    },
    // Tokens - NOTE: In a production environment, consider adding 
    // encryption/decryption middleware (e.g., mongoose-encryption)
    accessToken: { 
        type: String, 
        required: true 
    },
    refreshToken: { 
        type: String, 
        required: true 
    },
    // Expiration timestamp to trigger refresh logic
    expiresAt: { 
        type: Date, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Automatically remove expired token documents from MongoDB if desired
// tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OAuthToken', tokenSchema);