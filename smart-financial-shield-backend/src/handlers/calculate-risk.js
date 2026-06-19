const { sendResponse, sendError } = require('../utils/responseHandler');

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { userId, amount, type, timestamp } = body;

    if (!userId || amount === undefined || !type) {
      return sendError(400, 'Missing required fields: userId, amount, type');
    }

    const riskAnalysis = calculateTransactionRisk(userId, amount, type);

    return sendResponse(200, riskAnalysis);
  } catch (error) {
    console.error('Error calculating risk:', error);
    return sendError(500, 'Failed to calculate risk');
  }
};

function calculateTransactionRisk(userId, amount, type) {
  let riskScore = 0;
  const factors = [];

  if (amount > 10000) {
    riskScore += 0.4;
    factors.push('High transaction amount');
  } else if (amount > 5000) {
    riskScore += 0.2;
    factors.push('Moderate transaction amount');
  } else if (amount > 1000) {
    riskScore += 0.1;
    factors.push('Above average transaction amount');
  }

  if (type === 'international') {
    riskScore += 0.2;
    factors.push('International transaction');
  }

  const hour = new Date().getHours();
  if (hour < 6 || hour > 22) {
    riskScore += 0.1;
    factors.push('Unusual transaction time');
  }

  const userRiskFactor = parseInt(userId) % 10;
  if (userRiskFactor > 7) {
    riskScore += 0.2;
    factors.push('User risk profile elevated');
  }

  riskScore = Math.min(riskScore, 1.0);

  let flag = 'LOW_RISK';
  if (riskScore >= 0.7) {
    flag = 'HIGH_RISK';
  } else if (riskScore >= 0.4) {
    flag = 'MEDIUM_RISK';
  }

  return {
    riskScore: Math.round(riskScore * 100) / 100,
    flag,
    factors,
    recommendation: flag === 'HIGH_RISK' ? 'Manual review required' : 
                   flag === 'MEDIUM_RISK' ? 'Additional monitoring needed' : 'Normal processing',
    timestamp: new Date().toISOString()
  };
}