jest.mock('../../../src/container', () => ({
  authService: { login: jest.fn() },
}));

import { Request, Response } from 'express';
import tokenController from '../../../src/controllers/TokenController';
import { authService } from '../../../src/container';
import { AuthService } from '../../../src/services/AuthService';
import { UnauthorizedError } from '../../../src/errors/UnauthorizedError';

const mockedAuthService = authService as jest.Mocked<AuthService>;

function mockResponse(): Response {
  return { json: jest.fn() } as unknown as Response;
}

describe('TokenController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs in with the given credentials and returns the result', async () => {
    const res = mockResponse();
    const result = { token: 'jwt', user: { id: 1, name: 'Ada', email: 'ada@example.com' } };
    mockedAuthService.login.mockResolvedValue(result);

    const req = { body: { email: 'ada@example.com', password: 'secret123' } } as unknown as Request;

    await tokenController.store(req, res);

    expect(mockedAuthService.login).toHaveBeenCalledWith('ada@example.com', 'secret123');
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it('defaults email and password to empty strings when missing from the body', async () => {
    const res = mockResponse();
    mockedAuthService.login.mockRejectedValue(new UnauthorizedError('Invalid credentials'));

    const req = { body: {} } as unknown as Request;

    await expect(tokenController.store(req, res)).rejects.toThrow('Invalid credentials');
    expect(mockedAuthService.login).toHaveBeenCalledWith('', '');
  });
});
