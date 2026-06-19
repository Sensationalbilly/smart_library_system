// Simple Express server for your fraud detection frontend

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(express.json());
// Serve static files from public directory first
app.use(express.static(path.join(__dirname, 'public')));
// Serve other static files from root
app.use(express.static(__dirname));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Auth endpoints
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    res.json({ token: "fake-token-" + Date.now() });
  } else {
    res.status(400).json({ error: "Invalid credentials" });
  }
});

app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    res.json({ message: "Account created" });
  } else {
    res.status(400).json({ error: "Missing fields" });
  }
});

// Fake fraud API endpoint for testing
app.post("/api/fraud-check", (req, res) => {
  const { amount, type } = req.body;

  // simple logic
  const riskScore = type === "international" ? 70 : 20;
  const flag = riskScore > 50 ? "HIGH_RISK" : "LOW_RISK";

  res.json({
    riskScore,
    flag
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Frontend running on http://localhost:${PORT}`));