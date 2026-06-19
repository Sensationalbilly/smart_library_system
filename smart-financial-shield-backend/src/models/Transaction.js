/**
 * Transaction Model
 * Transaction data model and operations
 */

const { dynamodb } = require('../config/aws');
const { generateId } = require('../utils/helpers');

class Transaction {
  constructor(data) {
    this.id = data.id || generateId();
    this.amount = data.amount;
    this.type = data.type; // 'income' or 'expense'
    this.category = data.category;
    this.description = data.description;
    this.date = data.date || new Date().toISOString();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  async save() {
    const tableName = process.env.DYNAMODB_TABLE_TRANSACTIONS || 'transactions-dev';
    
    const params = {
      TableName: tableName,
      Item: this
    };

    try {
      await dynamodb.put(params).promise();
      return this;
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  }

  static async getById(id) {
    const tableName = process.env.DYNAMODB_TABLE_TRANSACTIONS || 'transactions-dev';
    
    const params = {
      TableName: tableName,
      Key: { id }
    };

    try {
      const result = await dynamodb.get(params).promise();
      return result.Item ? new Transaction(result.Item) : null;
    } catch (error) {
      console.error('Error getting transaction:', error);
      throw error;
    }
  }

  static async getAll() {
    const tableName = process.env.DYNAMODB_TABLE_TRANSACTIONS || 'transactions-dev';
    
    const params = {
      TableName: tableName
    };

    try {
      const result = await dynamodb.scan(params).promise();
      return result.Items.map(item => new Transaction(item));
    } catch (error) {
      console.error('Error getting all transactions:', error);
      throw error;
    }
  }

  async update(data) {
    this.updatedAt = new Date().toISOString();
    Object.assign(this, data);
    return this.save();
  }

  async delete() {
    const tableName = process.env.DYNAMODB_TABLE_TRANSACTIONS || 'transactions-dev';
    
    const params = {
      TableName: tableName,
      Key: { id: this.id }
    };

    try {
      await dynamodb.delete(params).promise();
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }
}

module.exports = Transaction;
