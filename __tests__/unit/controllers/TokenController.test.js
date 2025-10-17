import TokenController from '../../../src/controllers/TokenController';
import User from '../../../src/models/User';
import jwt from 'jsonwebtoken';

jest.mock('../../../src/models/User');
jest.mock('jsonwebtoken');

describe('TokenController', () => {
  let req, res, mockUser;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    mockUser = {
      id: 1,
      email: 'test@example.com',
      passwordIsValid: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('store', () => {
    it('should create token with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      req.body = credentials;

      const mockToken = 'mock-jwt-token';

      User.findOne.mockResolvedValue(mockUser);
      mockUser.passwordIsValid.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      await TokenController.store(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: credentials.email },
      });
      expect(mockUser.passwordIsValid).toHaveBeenCalledWith(credentials.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION }
      );
      expect(res.json).toHaveBeenCalledWith({
        token: mockToken,
        user: { name: mockUser.name, id: mockUser.id, email: mockUser.email },
      });
    });

    it('should return error with missing email', async () => {
      req.body = { password: 'password123' };

      await TokenController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Invalid credentials'],
      });
    });

    it('should return error with missing password', async () => {
      req.body = { email: 'test@example.com' };

      await TokenController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Invalid credentials'],
      });
    });

    it('should return error with non-existent user', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };
      req.body = credentials;

      User.findOne.mockResolvedValue(null);

      await TokenController.store(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: credentials.email },
      });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['User does not exist'],
      });
    });

    it('should return error with invalid password', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      req.body = credentials;

      User.findOne.mockResolvedValue(mockUser);
      mockUser.passwordIsValid.mockResolvedValue(false);

      await TokenController.store(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: credentials.email },
      });
      expect(mockUser.passwordIsValid).toHaveBeenCalledWith(credentials.password);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Invalid password'],
      });
    });

    it('should handle database errors', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      req.body = credentials;

      User.findOne.mockRejectedValue(new Error('Database error'));

      await TokenController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Internal server error'],
      });
    });

    it('should handle JWT signing errors', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      req.body = credentials;

      User.findOne.mockResolvedValue(mockUser);
      mockUser.passwordIsValid.mockResolvedValue(true);
      jwt.sign.mockImplementation(() => {
        throw new Error('JWT Error');
      });

      await TokenController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Internal server error'],
      });
    });
  });
});