exports.handler = async (event) => {
  const { text } = JSON.parse(event.body || '{}');

  const suspiciousWords = ["urgent", "click", "send", "transfer", "otp"];
  const score = suspiciousWords.reduce(
    (sum, w) => sum + (text.toLowerCase().includes(w) ? 0.2 : 0),
    0
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      riskScore: Math.min(score, 1.0),
      label: score > 0.3 ? "suspicious" : "normal",
      explanation: "Basic rule-based check completed."
    })
  };
};
