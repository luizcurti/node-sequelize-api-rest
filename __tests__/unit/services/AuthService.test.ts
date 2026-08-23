jest.mock('jsonwebtoken');

import jwt from 'jsonwebtoken';
import { AuthService } from '../../../src/services/AuthService';
import { UnauthorizedError } from '../../../src/errors/UnauthorizedError';
import { UserRepository } from '../../../src/repositories/interfaces/UserRepository';
import User from '../../../src/models/User';

const mockedJwt = jwt as jest.Mocked<typeof jwt>;

function buildUserRepository(): jest.Mocked<UserRepository> {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByIdAndEmail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

describe('AuthService', () => {
  let userRepository: jest.Mocked<UserRepository>;
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    userRepository = buildUserRepository();
    authService = new AuthService(userRepository);
    process.env.TOKEN_SECRET = 'test-secret';
    process.env.TOKEN_EXPIRATION = '1d';
  });

  describe('login', () => {
    it('returns a token and the public user data on valid credentials', async () => {
      const user = {
        id: 1,
        name: 'Ada',
        email: 'ada@example.com',
        passwordIsValid: jest.fn().mockResolvedValue(true),
      } as unknown as User;
      userRepository.findByEmail.mockResolvedValue(user);
      mockedJwt.sign.mockReturnValue('signed-jwt' as never);

      const result = await authService.login('ada@example.com', 'secret123');

      expect(result).toEqual({ token: 'signed-jwt', user: { id: 1, name: 'Ada', email: 'ada@example.com' } });
    });

    it('throws UnauthorizedError when email or password are missing', async () => {
      await expect(authService.login('', 'secret123')).rejects.toThrow(UnauthorizedError);
      expect(userRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedError when the user does not exist', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login('missing@example.com', 'secret123')).rejects.toThrow('User does not exist');
    });

    it('throws UnauthorizedError when the password is invalid', async () => {
      const user = {
        id: 1,
        name: 'Ada',
        email: 'ada@example.com',
        passwordIsValid: jest.fn().mockResolvedValue(false),
      } as unknown as User;
      userRepository.findByEmail.mockResolvedValue(user);

      await expect(authService.login('ada@example.com', 'wrong')).rejects.toThrow('Invalid password');
    });
  });

  describe('authenticate', () => {
    it('returns the authenticated user id and email for a valid token', async () => {
      mockedJwt.verify.mockReturnValue({ id: 1, email: 'ada@example.com' } as never);
      userRepository.findByIdAndEmail.mockResolvedValue({ id: 1 } as User);

      const result = await authService.authenticate('Bearer valid-token');

      expect(result).toEqual({ userId: 1, userEmail: 'ada@example.com' });
    });

    it('throws UnauthorizedError when there is no authorization header', async () => {
      await expect(authService.authenticate(undefined)).rejects.toThrow('Login required');
    });

    it('throws UnauthorizedError when the header carries no token', async () => {
      await expect(authService.authenticate('Bearer')).rejects.toThrow('Expired or invalid token.');
    });

    it('throws UnauthorizedError when the token is invalid or expired', async () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new Error('invalid token');
      });

      await expect(authService.authenticate('Bearer bad-token')).rejects.toThrow('Expired or invalid token.');
    });

    it('throws UnauthorizedError when the user no longer exists', async () => {
      mockedJwt.verify.mockReturnValue({ id: 1, email: 'ada@example.com' } as never);
      userRepository.findByIdAndEmail.mockResolvedValue(null);

      await expect(authService.authenticate('Bearer valid-token')).rejects.toThrow('Invalid User');
    });
  });
});
