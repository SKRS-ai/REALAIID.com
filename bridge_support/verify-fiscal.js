// verify-fiscal.js
const http = require('http');

const data = JSON.stringify({
  assetType: 'BTC',
  walletAddress: '1BUREAU_TEST_ADDR',
  quantity: 1.5
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/fiscal/liquidity-ingest',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log("FISCAL RAIL RESPONSE:", body);
    process.exit(0);
  });
});

req.on('error', (e) => console.error("RAIL CONNECTION ERROR:", e.message));
req.write(data);
req.end();