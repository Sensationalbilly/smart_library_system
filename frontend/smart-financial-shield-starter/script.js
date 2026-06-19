// Fake login user
const VALID_USER = "admin";
const VALID_PASS = "12345";

// Login function
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const error = document.getElementById("error");

  if (user === VALID_USER && pass === VALID_PASS) {
    localStorage.setItem("userId", "U001");
    window.location.href = "dashboard.html";
  } else {
    error.textContent = "Invalid username or password";
  }
}

// Dashboard load
if (window.location.pathname.includes("dashboard")) {
  const uid = localStorage.getItem("userId");
  if (!uid) window.location.href = "index.html";

  document.getElementById("userId").textContent = uid;
}

// Make transaction
async function makeTransaction() {
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;

  const res = await fetch("/api/fraud-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, type })
  });

  const data = await res.json();

  document.getElementById("result").innerHTML = `
    <h3>Fraud Result</h3>
    <p><b>Risk Score:</b> ${data.riskScore}</p>
    <p><b>Flag:</b> ${data.flag}</p>
  `;
}

// Logout
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}