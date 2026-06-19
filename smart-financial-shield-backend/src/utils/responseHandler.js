/**
 * Response Handler Utility
 * Standardized response formatting
 */

const sendResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify(body)
  };
};

const sendError = (statusCode, message, details = null) => {
  const body = {
    error: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (details) {
    body.details = details;
  }

  return sendResponse(statusCode, body);
};

module.exports = {
  sendResponse,
  sendError
};
