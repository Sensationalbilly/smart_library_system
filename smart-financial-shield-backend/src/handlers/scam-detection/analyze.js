/**
 * Scam Detection Handler
 * Analyzes messages for scam indicators
 * 
 * This handler receives a message from the frontend and performs:
 * - Text analysis for common scam patterns
 * - Risk level assessment
 * - Red flag identification
 * - Recommendation generation
 */

const { sendResponse, sendError } = require('../../utils/responseHandler');
const { validateMessage } = require('../../utils/validators');

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');

    // Validate input
    const validation = validateMessage(body.message);
    if (!validation.valid) {
      return sendError(400, validation.error);
    }

    const message = body.message.toLowerCase();

    // Analyze message for scam indicators
    const analysis = analyzeScamMessage(message);

    console.log('Scam analysis result:', analysis);

    return sendResponse(200, {
      message: 'Message analyzed successfully',
      data: analysis,
    });
  } catch (error) {
    console.error('Error analyzing message:', error);
    return sendError(500, 'Failed to analyze message');
  }
};

/**
 * Analyze message for scam indicators
 * @param {string} message - The message to analyze
 * @returns {Object} Analysis result with risk level, flags, and recommendations
 */
function analyzeScamMessage(message) {
  let riskScore = 0;
  const redFlags = [];

  // Common scam keywords and phrases
  const highRiskPatterns = [
    /congratulations.*won/i,
    /click.*immediately/i,
    /verify.*account/i,
    /confirm.*identity/i,
    /update.*payment/i,
    /urgent.*action/i,
    /limited.*time/i,
    /act.*now/i,
    /prize.*claim/i,
    /free.*money/i,
    /bank.*details/i,
    /wire.*transfer/i,
    /western.*union/i,
    /bitcoin/i,
    /gift.*card/i,
  ];

  const mediumRiskPatterns = [
    /click.*link/i,
    /download.*app/i,
    /confirm.*details/i,
    /re-activate/i,
    /suspended/i,
    /validate/i,
    /unauthorized.*access/i,
  ];

  const urgencyPatterns = [
    /immediately/i,
    /urgent/i,
    /asap/i,
    /quick/i,
    /right now/i,
    /limited.*time/i,
    /expire/i,
    /don't delay/i,
  ];

  const personalInfoRequests = [
    /password/i,
    /pin/i,
    /social.*security/i,
    /credit.*card/i,
    /bank.*account/i,
    /cvv/i,
    /expiry/i,
    /private.*key/i,
    /seed.*phrase/i,
  ];

  const suspiciousLinks = /https?:\/\//i.test(message) && !/https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i.test(message);

  // Check for high-risk patterns
  highRiskPatterns.forEach((pattern) => {
    if (pattern.test(message)) {
      riskScore += 30;
      redFlags.push(pattern.source.split('/')[1] || 'High-risk phrase detected');
    }
  });

  // Check for medium-risk patterns
  mediumRiskPatterns.forEach((pattern) => {
    if (pattern.test(message)) {
      riskScore += 15;
      redFlags.push(pattern.source.split('/')[1] || 'Suspicious phrase detected');
    }
  });

  // Check for urgency language
  urgencyPatterns.forEach((pattern) => {
    if (pattern.test(message)) {
      riskScore += 10;
      redFlags.push('Creates false urgency');
    }
  });

  // Check for personal information requests
  personalInfoRequests.forEach((pattern) => {
    if (pattern.test(message)) {
      riskScore += 25;
      redFlags.push('Requests sensitive personal information');
    }
  });

  // Check for suspicious links
  if (suspiciousLinks) {
    riskScore += 20;
    redFlags.push('Contains suspicious links or URLs');
  }

  // Check message length (very short or very long messages can be suspicious)
  if (message.length < 20) {
    riskScore += 5;
    redFlags.push('Suspiciously short message');
  }

  // Remove duplicates
  const uniqueRedFlags = [...new Set(redFlags)];

  // Determine risk level and confidence
  let riskLevel = 'Low';
  let confidence = Math.min(riskScore, 100);

  if (riskScore >= 60) {
    riskLevel = 'High';
  } else if (riskScore >= 30) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'Low';
  }

  // Determine scam type
  let scamType = identifyScamType(message);

  // Generate recommendation
  let recommendation = generateRecommendation(riskLevel);

  // Generate summary
  let summary = generateSummary(riskLevel, uniqueRedFlags);

  return {
    riskLevel,
    confidence,
    scamType: scamType || 'Unknown Scam Type',
    redFlags: uniqueRedFlags.slice(0, 5), // Limit to 5 top flags
    summary,
    recommendation,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Identify the type of scam
 * @param {string} message - The message to analyze
 * @returns {string} Scam type
 */
function identifyScamType(message) {
  const scamTypes = {
    'phishing': /verify.*account|confirm.*identity|click.*link|password|bank.*details/i,
    'lottery/prize': /congratulations.*won|claim.*prize|lottery/i,
    'investment': /guaranteed.*return|easy.*money|investment.*opportunity/i,
    'romance': /darling|sweetheart|love.*you|miss.*you/i,
    'tech_support': /virus|malware|update.*software|system.*error/i,
    'payment_fraud': /wire.*transfer|bitcoin|gift.*card|western.*union/i,
    'impersonation': /from.*bank|from.*paypal|from.*apple|official.*statement/i,
  };

  for (const [type, pattern] of Object.entries(scamTypes)) {
    if (pattern.test(message)) {
      return type.replace(/_/g, ' ').toUpperCase();
    }
  }

  return null;
}

/**
 * Generate recommendation based on risk level
 * @param {string} riskLevel - Risk level (Low, Medium, High)
 * @returns {string} Recommendation
 */
function generateRecommendation(riskLevel) {
  const recommendations = {
    High: "⚠️ This message shows strong scam indicators. Do NOT click links, download files, or provide personal information. Report this to the sender's platform immediately.",
    Medium: "⚠️ This message has some suspicious characteristics. Be cautious with any requests for personal information or money. Verify directly with the organization through official channels.",
    Low: "✓ This message appears to be legitimate, but stay vigilant. Always verify unexpected requests through official channels before taking action.",
  };

  return recommendations[riskLevel] || recommendations.Medium;
}

/**
 * Generate analysis summary
 * @param {string} riskLevel - Risk level
 * @param {Array} redFlags - Array of red flags
 * @returns {string} Summary
 */
function generateSummary(riskLevel, redFlags) {
  if (riskLevel === 'High') {
    return `This message has ${redFlags.length} indicators of a scam or phishing attempt. Multiple red flags suggest this is likely fraudulent.`;
  } else if (riskLevel === 'Medium') {
    return `This message contains ${redFlags.length} characteristics commonly found in scams. Use caution and verify independently before responding.`;
  } else {
    return `This message appears to be legitimate with only minor concerns. However, always verify unexpected communications through official channels.`;
  }
}
