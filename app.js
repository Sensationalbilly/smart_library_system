const fetch = require("node-fetch");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const apiUrl =
  "https://yh9ch7tkdd.execute-api.eu-north-1.amazonaws.com/prod/calculate-risk";

// Fake users (you can modify)
const users = [
  { username: "admin", password: "12345", userId: "U001" },
  { username: "mohamed", password: "pass2024", userId: "U002" }
];

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

async function login() {
  console.log("\n=== LOGIN ===");

  let username = await ask("Username: ");
  let password = await ask("Password: ");

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    console.log("\n❌ Wrong username or password.\n");
    return login();
  }

  console.log(`\n✅ Welcome ${username}!`);
  dashboard(user);
}

async function dashboard(user) {
  console.log(`
=========================
      DASHBOARD
=========================
User ID: ${user.userId}
1. Make Transaction (Fraud Check)
2. Logout
`);

  let choice = await ask("Choose an option: ");

  if (choice === "1") return makeTransaction(user);
  if (choice === "2") {
    console.log("\nLogged out.\n");
    return login();
  }

  console.log("Invalid choice.");
  dashboard(user);
}

async function makeTransaction(user) {
  console.log("\n=== New Transaction ===");

  let amount = await ask("Amount: ");
  let type = await ask("Type (local/international): ");

  const data = {
    userId: user.userId,
    amount: Number(amount),
    type,
    timestamp: new Date().toISOString()
  };

  console.log("\n⏳ Checking fraud risk...\n");

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const raw = await res.json();

    // API Gateway sometimes wraps JSON inside 'body'
    const response =
      typeof raw.body === "string" ? JSON.parse(raw.body) : raw;

    console.log("========== FRAUD RESULT ==========");
    console.log(`Risk Score: ${response.riskScore}`);
    console.log(`Flag: ${response.flag}`);
    console.log("===================================\n");

  } catch (err) {
    console.log("❌ Error calling fraud API:", err.message);
  }

  dashboard(user);
}

login();