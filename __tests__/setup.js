import dotenv from 'dotenv';

dotenv.config();

jest.setTimeout(10000);

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

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

describe('Setup', () => {
  it('should load environment variables', () => {
    expect(process.env).toBeDefined();
  });
});