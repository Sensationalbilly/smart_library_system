const https = require('https');

const data = JSON.stringify({
  userId: "123",
  amount: 2500,
  type: "international",
  timestamp: new Date().toISOString()
});

const options = {
  hostname: 'yh9ch7tkdd.execute-api.eu-north-1.amazonaws.com',
  port: 443,
  path: '/prod/calculate-risk',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const response = JSON.parse(body);
      const result = typeof response.body === 'string' ? JSON.parse(response.body) : response;
      console.log(`Risk Score: ${result.riskScore}`);
      console.log(`Risk Flag: ${result.flag}`);
    } catch (err) {
      console.error('Parse error:', err);
      console.log('Raw response:', body);
    }
  });
});

req.on('error', (err) => console.error('Request error:', err));
req.write(data);
req.end();