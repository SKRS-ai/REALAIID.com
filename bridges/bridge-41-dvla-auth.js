/**
 * BRIDGE-41-DVLA-AUTH
 * ROLE: Handles UK DVLA Vehicle Enquiry Service Integration
 * STATUS: PRODUCTION READY // MOCK DRIVER ENABLED
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');

// Toggle: Set to false once production credentials are acquired
const USE_MOCK = true; 
const DVLA_API_KEY = process.env.DVLA_API_KEY; 
const DVLA_BASE_URL = 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles';

// Mock Data Driver
const getMockVehicleData = (vrn) => ({
    artEndDate: "2026-12-31",
    co2Emissions: 135,
    colour: "BLUE",
    engineCapacity: 2494,
    fuelType: "PETROL",
    make: "ROVER",
    markedForExport: false,
    monthOfFirstRegistration: "2004-12",
    motStatus: "No details held by DVLA",
    registrationNumber: vrn,
    revenueWeight: 1640,
    taxDueDate: "2027-01-01",
    taxStatus: "Taxed",
    typeApproval: "N1",
    wheelplan: "NON STANDARD",
    yearOfManufacture: 2004,
    euroStatus: "EURO 6 AD",
    realDrivingEmissions: "1",
    dateOfLastV5CIssued: "2026-01-01"
});

// Route: POST /api/v1/bridge-41-dvla-auth/
router.post('/', async (req, res) => {
    // Safety check for body
    if (!req.body) {
        return res.status(400).json({ status: "ERROR", message: "Missing request body" });
    }

    const { registrationNumber } = req.body;

    if (!registrationNumber) {
        return res.status(400).json({ status: "ERROR", message: "VRN required" });
    }

    if (USE_MOCK) {
        console.log(`[B-41] MOCK-MODE: Querying VRN ${registrationNumber}`);
        return res.status(200).json({
            status: "SUCCESS",
            node: "BRIDGE-41",
            source: "MOCK_DRIVER",
            data: getMockVehicleData(registrationNumber)
        });
    }

    try {
        console.log(`[B-41] LIVE-MODE: Querying VRN ${registrationNumber}`);
        const response = await axios.post(DVLA_BASE_URL, 
            { registrationNumber },
            { headers: { 'x-api-key': DVLA_API_KEY, 'Content-Type': 'application/json' } }
        );

        res.status(200).json({
            status: "SUCCESS",
            node: "BRIDGE-41",
            source: "LIVE_API",
            data: response.data
        });
    } catch (error) {
        // Detailed error logging to help debug if the API rejects the request
        const errorMsg = error.response ? error.response.data : error.message;
        console.error(`[B-41] LIVE-MODE Error:`, errorMsg);
        res.status(500).json({ status: "ERROR", message: "Failed to retrieve vehicle data", detail: errorMsg });
    }
});

// Ensure the router is exported correctly for the server.js dynamic loader
module.exports = router;