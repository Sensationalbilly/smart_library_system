import fetch from "node-fetch";

const url = "https://yh9ch7tkdd.execute-api.eu-north-1.amazonaws.com/prod/calculate-risk";

const data = {
  userId: "123",
  amount: 2500,
  type: "international",
  timestamp: new Date().toISOString()
};

fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
})
  .then(res => res.json())
  .then(response => {
    const body = typeof response.body === "string" ? JSON.parse(response.body) : response;
    console.log("✅ Risk Score:", body.riskScore);
    console.log("⚠️ Risk Flag:", body.flag);
  })
  .catch(err => console.error("Error calling API:", err));


