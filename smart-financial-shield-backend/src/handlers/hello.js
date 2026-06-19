/**
 * Hello World Handler
 * Basic health check endpoint
 */

const { sendResponse, sendError } = require('../utils/responseHandler');

module.exports.handler = async (event) => {
  try {
    console.log('Hello endpoint called');
    
    return sendResponse(200, {
      message: 'Smart Financial Shield API is running!',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Error in hello handler:', error);
    return sendError(500, 'Internal server error');
  }
};
