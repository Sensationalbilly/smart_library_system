// Simple in-memory storage for demo purposes
let users = {};
let currentUser = null;

// Show/hide forms
function showLogin() {
  document.getElementById('signupForm').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');
}

function showSignup() {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('signupForm').classList.remove('hidden');
}

// Authentication functions
function signup() {
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;
  
  if (!username || !password) {
    alert('Please fill in all fields');
    return;
  }
  
  if (users[username]) {
    alert('Username already exists');
    return;
  }
  
  users[username] = { password };
  alert('Account created successfully! Please login.');
  showLogin();
}

function login() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  if (!username || !password) {
    alert('Please fill in all fields');
    return;
  }
  
  if (!users[username] || users[username].password !== password) {
    alert('Invalid credentials');
    return;
  }
  
  currentUser = username;
  showDashboard();
}

function logout() {
  currentUser = null;
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('auth').classList.remove('hidden');
  document.getElementById('result').textContent = 'Waiting...';
}

function showDashboard() {
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('welcomeMsg').textContent = `Welcome, ${currentUser}!`;
}

// Fraud detection logic
function checkFraud() {
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;
  
  if (!amount || amount <= 0) {
    document.getElementById('result').textContent = 'Please enter a valid amount';
    return;
  }
  
  let riskScore = 0;
  let riskLevel = 'LOW';
  let reasons = [];
  
  // Simple fraud detection rules
  if (amount > 10000) {
    riskScore += 30;
    reasons.push('High transaction amount');
  }
  
  if (type === 'international') {
    riskScore += 20;
    reasons.push('International transaction');
  }
  
  if (amount > 50000) {
    riskScore += 40;
    reasons.push('Extremely high amount');
  }
  
  // Determine risk level
  if (riskScore >= 60) {
    riskLevel = 'HIGH';
  } else if (riskScore >= 30) {
    riskLevel = 'MEDIUM';
  }
  
  const result = {
    amount: amount,
    type: type,
    riskScore: riskScore,
    riskLevel: riskLevel,
    reasons: reasons.length > 0 ? reasons : ['Normal transaction pattern'],
    recommendation: riskLevel === 'HIGH' ? 'BLOCK' : riskLevel === 'MEDIUM' ? 'REVIEW' : 'APPROVE'
  };
  
  document.getElementById('result').textContent = JSON.stringify(result, null, 2);
}

// Event listener for check button
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('checkBtn').addEventListener('click', checkFraud);
});