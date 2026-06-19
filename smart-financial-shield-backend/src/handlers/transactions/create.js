/**
 * Create Transaction Handler
 * Creates a new financial transaction
 */

const { sendResponse, sendError } = require('../../utils/responseHandler');
const { validateTransaction } = require('../../utils/validators');
const { generateId } = require('../../utils/helpers');

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    
    // Validate input
    const validation = validateTransaction(body);
    if (!validation.valid) {
      return sendError(400, validation.error);
    }

    // Create transaction object
    const transaction = {
      id: generateId(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Transaction created:', transaction);

    return sendResponse(201, {
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return sendError(500, 'Failed to create transaction');
  }
};
