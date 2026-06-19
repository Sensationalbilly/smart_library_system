// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fetch = require("node-fetch"); // if you want to call external Lambda

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const TX_FILE = path.join(DATA_DIR, "transactions.json");

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]");
if (!fs.existsSync(TX_FILE)) fs.writeFileSync(TX_FILE, "[]");

app.use(cors()); // front-end can call
app.use(bodyParser.json());

// Disable caching for development
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.use(express.static(path.join(__dirname, "public")));

// Helper functions
const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8") || "[]");
const writeJson = (p, data) => fs.writeFileSync(p, JSON.stringify(data, null, 2));

// Very simple token check
function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Missing token" });

  const users = readJson(USERS_FILE);
  const user = users.find(u => u.token === token);
  if (!user) return res.status(401).json({ error: "Invalid token" });

  req.user = user;
  next();
}

// Routes --------------------------------------------------

// Signup
app.post("/api/signup", (req, res) => {
  const { firstname, lastname, email, password, username } = req.body || {};
  
  // Support both old username format and new email format
  const userIdentifier = (email || username || '').toLowerCase().trim();
  if (!userIdentifier || !password) return res.status(400).json({ error: "Email and password are required" });
  
  if (!firstname || !lastname) return res.status(400).json({ error: "First name and last name are required" });

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userIdentifier)) {
    return res.status(400).json({ error: "Please enter a valid email address" });
  }

  const users = readJson(USERS_FILE);
  
  // Check for duplicate email (case-insensitive)
  const existingUser = users.find(u => 
    (u.email && u.email.toLowerCase() === userIdentifier) || 
    (u.username && u.username.toLowerCase() === userIdentifier)
  );
  
  if (existingUser) {
    return res.status(400).json({ error: "An account with this email already exists" });
  }

  const userId = uuidv4();
  const token = uuidv4();
  const newUser = { 
    id: userId, 
    firstname: firstname.trim(),
    lastname: lastname.trim(),
    email: userIdentifier,
    username: userIdentifier, 
    password, 
    token,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  writeJson(USERS_FILE, users);
  res.json({ message: "Account created successfully", userId, token });
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password, username } = req.body || {};
  const userIdentifier = (email || username || '').toLowerCase().trim();
  
  if (!userIdentifier || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  
  const users = readJson(USERS_FILE);
  const user = users.find(u => 
    ((u.email && u.email.toLowerCase() === userIdentifier) || 
     (u.username && u.username.toLowerCase() === userIdentifier)) && 
    u.password === password
  );
  
  if (!user) return res.status(401).json({ error: "Invalid email or password" });

  // rotate token for simplicity
  user.token = uuidv4();
  writeJson(USERS_FILE, users);
  res.json({ 
    userId: user.id, 
    token: user.token,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email
  });
});

// Get current user
app.get("/api/me", authenticate, (req, res) => {
  const { id, username, firstname, lastname, email } = req.user;
  res.json({ id, username, firstname, lastname, email });
});

// Save transaction + call fraud logic
app.post("/api/transaction", authenticate, async (req, res) => {
  const { amount = 0, type = "domestic", timestamp } = req.body || {};
  const userId = req.user.id;
  const tx = {
    id: uuidv4(),
    userId,
    amount: Number(amount),
    type,
    timestamp: timestamp || new Date().toISOString()
  };

  // --- FRAUD SCORING LOGIC (local) ---
  // This analyzes multiple factors to calculate fraud risk
  let riskScore = 0;
  const riskFactors = [];

  // Factor 1: Transaction Amount
  if (tx.amount > 10000) {
    riskScore += 40;
    riskFactors.push("Very high transaction amount (>$10,000)");
  } else if (tx.amount > 5000) {
    riskScore += 25;
    riskFactors.push("High transaction amount ($5,000-$10,000)");
  } else if (tx.amount > 1000) {
    riskScore += 15;
    riskFactors.push("Moderate transaction amount ($1,000-$5,000)");
  }

  // Factor 2: Transaction Type
  if (tx.type === "international") {
    riskScore += 30;
    riskFactors.push("International transaction (higher fraud risk)");
  }

  // Factor 3: Time-based analysis (unusual hours)
  const hour = new Date(tx.timestamp).getHours();
  if (hour >= 0 && hour < 6) {
    riskScore += 20;
    riskFactors.push("Transaction during unusual hours (12 AM - 6 AM)");
  }

  // Factor 4: Frequency check (multiple transactions in short time)
  const recentTxs = readJson(TX_FILE).filter(t => {
    const timeDiff = new Date(tx.timestamp) - new Date(t.timestamp);
    return t.userId === userId && timeDiff < 3600000 && timeDiff > 0; // within 1 hour
  });
  if (recentTxs.length >= 3) {
    riskScore += 25;
    riskFactors.push("Multiple transactions in short time period");
  }

  // Factor 5: Round number amounts (common in fraud)
  if (tx.amount % 1000 === 0 && tx.amount >= 1000) {
    riskScore += 10;
    riskFactors.push("Round number amount (common fraud pattern)");
  }

  // Determine risk level
  let flag, recommendation;
  if (riskScore >= 70) {
    flag = "HIGH_RISK";
    recommendation = "Transaction blocked. Please verify your identity or contact support.";
  } else if (riskScore >= 40) {
    flag = "MEDIUM_RISK";
    recommendation = "Additional verification required. Please confirm this transaction.";
  } else {
    flag = "LOW_RISK";
    recommendation = "Transaction approved. No suspicious activity detected.";
    if (riskFactors.length === 0) {
      riskFactors.push("Normal transaction pattern");
    }
  }

  tx.riskScore = Math.min(riskScore, 100); // Cap at 100
  tx.flag = flag;
  tx.riskFactors = riskFactors;
  tx.recommendation = recommendation;

  // Save transaction
  const txs = readJson(TX_FILE);
  txs.push(tx);
  writeJson(TX_FILE, txs);

  res.json({ tx });
});

// Get user's transactions
app.get("/api/transactions", authenticate, (req, res) => {
  const txs = readJson(TX_FILE).filter(t => t.userId === req.user.id).reverse();
  res.json({ transactions: txs });
});

// Optional: proxy to your AWS Lambda endpoint instead of local logic
// Uncomment and edit the lambdaUrl to call the real lambda
/*
const lambdaUrl = "https://yh9ch7tkdd.execute-api.eu-north-1.amazonaws.com/prod/calculate-risk";
async function callLambda(data) {
  const r = await fetch(lambdaUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const json = await r.json();
  // if lambda returns object inside 'body'
  return typeof json.body === "string" ? JSON.parse(json.body) : json;
}
*/

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Open http://localhost:3000 in your browser");
});