/**
 * Update Transaction Handler
 * Updates an existing transaction
 */

const { sendResponse, sendError } = require('../../utils/responseHandler');
const { validateTransaction } = require('../../utils/validators');

module.exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;
    const body = JSON.parse(event.body || '{}');

    if (!id) {
      return sendError(400, 'Transaction ID is required');
    }

    // Validate input
    const validation = validateTransaction(body, true);
    if (!validation.valid) {
      return sendError(400, validation.error);
    }

    console.log('Updating transaction:', id);

    // Updated transaction - replace with database update
    const transaction = {
      id: id,
      ...body,
      updatedAt: new Date().toISOString()
    };

    return sendResponse(200, {
      message: 'Transaction updated successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return sendError(500, 'Failed to update transaction');
  }
};
