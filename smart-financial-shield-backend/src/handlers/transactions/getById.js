/**
 * Get Transaction by ID Handler
 * Retrieves a specific transaction
 */

const { sendResponse, sendError } = require('../../utils/responseHandler');

module.exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;

    if (!id) {
      return sendError(400, 'Transaction ID is required');
    }

    console.log('Getting transaction:', id);

    // Mock data - replace with database query
    const transaction = {
      id: id,
      amount: 100,
      type: 'expense',
      category: 'groceries',
      createdAt: new Date().toISOString()
    };

    return sendResponse(200, {
      message: 'Transaction retrieved successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error getting transaction:', error);
    return sendError(500, 'Failed to retrieve transaction');
  }
};
