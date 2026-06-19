/**
 * AWS Configuration
 * AWS SDK setup and configuration
 */

const AWS = require('aws-sdk');

const isDev = process.env.STAGE === 'dev';

const config = {
  region: process.env.AWS_REGION || 'us-east-1',
  dynamodb: {
    endpoint: isDev ? 'http://localhost:8000' : undefined
  }
};

// Create AWS service clients
const dynamodb = new AWS.DynamoDB.DocumentClient(config.dynamodb);
const s3 = new AWS.S3();
const cloudwatch = new AWS.CloudWatch();

module.exports = {
  dynamodb,
  s3,
  cloudwatch,
  config
};
