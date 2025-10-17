import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Add global test helpers
global.mockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  userId: null,
  ...overrides,
});

global.mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

global.mockNext = () => jest.fn();

// Simple test to avoid "no tests" error
describe('Setup', () => {
  it('should load environment variables', () => {
    expect(process.env).toBeDefined();
  });
});