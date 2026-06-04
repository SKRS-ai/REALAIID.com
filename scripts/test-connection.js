require('dotenv').config({ path: 'core/.env' });
const axios = require('axios');

async function testHMRCConnection() {
    console.log("Checking environment...");
    // This will print the ID if the .env file is correctly formatted
    console.log("Client ID loaded:", process.env.HMRC_CLIENT_ID);
    
    if (!process.env.HMRC_CLIENT_ID) {
        console.error("CRITICAL: HMRC_CLIENT_ID is undefined. Please verify the content of core/.env");
        return;
    }

    try {
        const response = await axios.get('https://test-api.service.hmrc.gov.uk/organisations/vat/test/obligations', {
            headers: {
                'Accept': 'application/vnd.hmrc.1.0+json',
                'Authorization': `Bearer ${process.env.HMRC_ACCESS_TOKEN || 'MISSING_TOKEN'}` 
            }
        });
        console.log("Connection Successful:", response.data);
    } catch (err) {
        console.error("Connection Failed:", err.response?.data?.message || err.message);
    }
}

testHMRCConnection();