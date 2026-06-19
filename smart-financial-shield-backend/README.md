# Smart Financial Shield Backend

AWS Lambda Serverless API backend for the Smart Financial Shield application.

## Overview

This is a Node.js serverless backend application built with the Serverless Framework, designed to run on AWS Lambda with API Gateway integration.

## Project Structure

```
smart-financial-shield-backend/
├── src/
│   ├── handlers/
│   │   ├── hello.js              # Example hello world handler
│   │   └── transactions/
│   │       ├── create.js         # Create transaction
│   │       ├── get.js            # List transactions
│   │       ├── getById.js        # Get transaction by ID
│   │       ├── update.js         # Update transaction
│   │       └── delete.js         # Delete transaction
│   ├── utils/
│   │   ├── logger.js             # Logging utility
│   │   ├── errorHandler.js       # Error handling
│   │   └── validators.js         # Input validation
│   ├── models/
│   │   └── Transaction.js        # Transaction model
│   └── config/
│       └── aws.js                # AWS SDK configuration
├── tests/                         # Test files
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── package.json                   # NPM dependencies
├── serverless.yml                 # Serverless Framework configuration
└── README.md                      # This file
```

## Prerequisites

- Node.js 18.x or later
- AWS Account with credentials configured
- AWS CLI installed and configured
- Serverless Framework CLI

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Copy environment variables:**
```bash
cp .env.example .env
```

3. **Configure AWS credentials:**
```bash
aws configure
```

## Development

### Local Testing

Run serverless offline to test locally:

```bash
npm run dev
```

This starts a local API Gateway emulator at `http://localhost:3000`.

### Testing the API

**Hello endpoint:**
```bash
curl http://localhost:3000/hello
```

**Create transaction:**
```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "type": "expense", "category": "groceries"}'
```

**Get transactions:**
```bash
curl http://localhost:3000/transactions
```

**Get transaction by ID:**
```bash
curl http://localhost:3000/transactions/{id}
```

**Update transaction:**
```bash
curl -X PUT http://localhost:3000/transactions/{id} \
  -H "Content-Type: application/json" \
  -d '{"amount": 150, "category": "utilities"}'
```

**Delete transaction:**
```bash
curl -X DELETE http://localhost:3000/transactions/{id}
```

## Deployment

### Deploy to AWS

Deploy all functions and API Gateway:

```bash
npm run deploy
```

Deploy to a specific stage:

```bash
serverless deploy --stage production
```

### Deploy individual functions

```bash
npm run deploy:function -- --function functionName --stage dev
```

### View logs

```bash
npm run logs -- --function functionName --stage dev
```

## Environment Variables

Configure the following in your `.env` file:

- `AWS_REGION`: AWS region (default: us-east-1)
- `STAGE`: Deployment stage (dev, staging, production)
- `NODE_ENV`: Node environment
- `DYNAMODB_TABLE_TRANSACTIONS`: DynamoDB table name for transactions

## Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## API Documentation

### Endpoints

- `GET /hello` - Health check endpoint
- `POST /transactions` - Create a new transaction
- `GET /transactions` - List all transactions
- `GET /transactions/{id}` - Get transaction by ID
- `PUT /transactions/{id}` - Update transaction
- `DELETE /transactions/{id}` - Delete transaction

### Request/Response Format

All requests and responses use JSON format with CORS enabled.

## Architecture

- **Framework**: Serverless Framework v3
- **Runtime**: Node.js 18.x
- **Compute**: AWS Lambda
- **API**: AWS API Gateway
- **Database**: AWS DynamoDB (optional)
- **Monitoring**: AWS CloudWatch

## Security

- IAM roles with least privilege
- Environment-based configuration
- Input validation on all endpoints
- CORS enabled for cross-origin requests

## Performance Optimization

- Lambda function packaging optimized
- Tracing enabled via X-Ray
- CloudWatch logs integration
- Cold start optimization

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## License

MIT
