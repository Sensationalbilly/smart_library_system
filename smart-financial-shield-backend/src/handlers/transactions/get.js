/**
 * Get Transactions Handler
 * Lists all financial transactions
 */

const { sendResponse, sendError } = require('../../utils/responseHandler');

module.exports.handler = async (event) => {
  try {
    console.log('Getting transactions list');

    // Mock data - replace with database query
    const transactions = [
      {
        id: '1',
        amount: 100,
        type: 'expense',
        category: 'groceries',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        amount: 200,
        type: 'income',
        category: 'salary',
        createdAt: new Date().toISOString()
      }
    ];

    return sendResponse(200, {
      message: 'Transactions retrieved successfully',
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error('Error getting transactions:', error);
    return sendError(500, 'Failed to retrieve transactions');
  }
};
