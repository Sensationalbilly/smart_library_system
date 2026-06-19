/**
 * Delete Transaction Handler
 * Deletes a transaction
 */

const { sendResponse, sendError } = require('../../utils/responseHandler');

module.exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;

    if (!id) {
      return sendError(400, 'Transaction ID is required');
    }

    console.log('Deleting transaction:', id);

    // Delete from database - replace with actual implementation
    
    return sendResponse(200, {
      message: 'Transaction deleted successfully',
      data: { id: id }
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return sendError(500, 'Failed to delete transaction');
  }
};
