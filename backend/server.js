require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");
const { Low, JSONFile } = require("lowdb");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Load environment
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "SFS_DEV_SECRET";

const USE_LAMBDA = process.env.USE_LAMBDA === "true";
const USE_OPENAI = process.env.USE_OPENAI === "true";
const LAMBDA_URL = process.env.LAMBDA_URL;

// Setup DB
const file = path.join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initDB() {
  await db.read();
  db.data = db.data || { users: [], transactions: [] };
  await db.write();
}
initDB();

// =======================
// JWT Authentication
// =======================
function createToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
}

async function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    await db.read();
    const user = db.data.users.find((u) => u.id === decoded.id && u.token === token);

    if (!user) return res.status(401).json({ error: "Invalid token" });

    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// =======================
// FRAUD ENGINE
// =======================

// LOCAL fallback scoring
function localScore(tx) {
  let risk = 0;

  if (tx.amount > 1000) risk += 30;
  if (tx.amount > 5000) risk += 50;
  if (tx.type === "international") risk += 40;

  const flag = risk > 70 ? "HIGH_RISK" : risk > 40 ? "MEDIUM_RISK" : "LOW_RISK";

  return { riskScore: risk, flag };
}

// Lambda scoring
async function lambdaScore(tx) {
  const res = await fetch(LAMBDA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tx),
  });

  const json = await res.json();

  return JSON.parse(json.body);
}

// OpenAI scoring
async function openaiScore(tx) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return localScore(tx);

  const prompt = `
Given transaction: ${JSON.stringify(tx)}

Return ONLY a JSON object:
{
  "riskScore": <0-200>,
  "flag": "LOW_RISK" | "MEDIUM_RISK" | "HIGH_RISK"
}
`;

  const res = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      prompt,
      max_tokens: 60,
      temperature: 0,
    }),
  });

  const data = await res.json();
  const text = data.choices[0].text.trim();

  try {
    return JSON.parse(text);
  } catch {
    return localScore(tx);
  }
}

// =======================
// AUTH ROUTES
// =======================
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;

  await db.read();
  if (db.data.users.find((u) => u.username === username))
    return res.status(400).json({ error: "Username already exists" });

  const hash = await bcrypt.hash(password, 10);
  const id = uuidv4();
  const token = createToken(id);

  const user = { id, username, passwordHash: hash, token };
  db.data.users.push(user);
  await db.write();

  res.json({ userId: id, token });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  await db.read();
  const user = db.data.users.find((u) => u.username === username);

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = createToken(user.id);
  user.token = token;

  await db.write();

  res.json({ userId: user.id, token });
});

// =======================
// FRAUD CHECK
// =======================
app.post("/api/transaction", auth, async (req, res) => {
  const { amount, type } = req.body;

  const tx = {
    id: uuidv4(),
    userId: req.user.id,
    amount,
    type,
    timestamp: new Date().toISOString(),
  };

  let result;

  try {
    if (USE_LAMBDA) result = await lambdaScore(tx);
    else if (USE_OPENAI) result = await openaiScore(tx);
    else result = localScore(tx);
  } catch (e) {
    result = localScore(tx);
  }

  tx.riskScore = result.riskScore;
  tx.flag = result.flag;

  await db.read();
  db.data.transactions.push(tx);
  await db.write();

  res.json({ tx });
});

app.get("/api/transactions", auth, async (req, res) => {
  await db.read();
  const list = db.data.transactions.filter((t) => t.userId === req.user.id);
  res.json({ transactions: list });
});

// =======================
// START SERVER
// =======================
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);