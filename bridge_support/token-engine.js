/**
 * REALAiID BUREAU - $AII TOKEN ENGINE
 * ROLE: Core Economic Orchestrator
 * STATUS: INITIALIZING // PRODUCTION_READY
 */

// --- CONFIGURATION ---
const BASE_RATE = 0.0001; // $AII per compute tick
const IDENTITY_PREMIUM_CAPS = {
    TIER_1: 0.03, // 3%
    TIER_2: 0.08, // 8%
    TIER_3: 0.12, // 12%
    TIER_4: 0.15  // 15%
};

/**
 * Calculates compute dividends based on node uptime and activity
 */
function calculateComputeDividend(nodeUptime, computeTicks) {
    // 1.5x multiplier for high-availability nodes (99.9%+)
    const performanceMultiplier = nodeUptime > 99.9 ? 1.5 : 1.0;
    return (computeTicks * BASE_RATE) * performanceMultiplier;
}

/**
 * Calculates the price of a personalized identity unit
 * Formula: Base + (Identity Tier Premium)
 */
function calculateIdentityPremiumPrice(baseAiiValue, tier) {
    const premiumFactor = IDENTITY_PREMIUM_CAPS[tier] || 0;
    const premiumAmount = baseAiiValue * premiumFactor;
    return {
        baseValue: baseAiiValue,
        premiumAmount: premiumAmount,
        totalPrice: baseAiiValue + premiumAmount
    };
}

/**
 * Calculates royalties for identity owners on secondary sales
 */
function calculateRoyalty(salePrice, royaltyRate) {
    // Standard royalty 0.5% to 2%
    return salePrice * Math.min(royaltyRate, 0.02);
}

module.exports = { 
    calculateComputeDividend, 
    calculateIdentityPremiumPrice, 
    calculateRoyalty 
};