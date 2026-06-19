/**
 * Sample test file
 * Replace with your actual tests
 */

describe('Hello Handler', () => {
  it('should return success response', async () => {
    const handler = require('../../src/handlers/hello').handler;
    const result = await handler({});
    
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.message).toContain('Smart Financial Shield API');
  });
});
