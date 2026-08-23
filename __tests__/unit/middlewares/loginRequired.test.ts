jest.mock('../../../src/container', () => ({
  authService: { authenticate: jest.fn() },
}));

import { NextFunction, Request, Response } from 'express';
import loginRequired from '../../../src/middlewares/loginRequired';
import { authService } from '../../../src/container';
import { AuthService } from '../../../src/services/AuthService';
import { UnauthorizedError } from '../../../src/errors/UnauthorizedError';

const mockedAuthService = authService as jest.Mocked<AuthService>;

describe('loginRequired', () => {
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    next = jest.fn();
  });

  it('attaches userId/userEmail to the request and calls next on success', async () => {
    mockedAuthService.authenticate.mockResolvedValue({ userId: 1, userEmail: 'ada@example.com' });
    const req = { headers: { authorization: 'Bearer valid-token' } } as unknown as Request;

    await loginRequired(req, {} as Response, next);

    expect(req.userId).toBe(1);
    expect(req.userEmail).toBe('ada@example.com');
    expect(next).toHaveBeenCalled();
  });

  it('propagates the error from authService instead of calling next', async () => {
    mockedAuthService.authenticate.mockRejectedValue(new UnauthorizedError('Login required'));
    const req = { headers: {} } as unknown as Request;

    await expect(loginRequired(req, {} as Response, next)).rejects.toThrow('Login required');
    expect(next).not.toHaveBeenCalled();
  });
});
