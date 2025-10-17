import loginRequired from '../../../src/middlewares/loginRequired';
import User from '../../../src/models/User';
import jwt from 'jsonwebtoken';

jest.mock('../../../src/models/User');
jest.mock('jsonwebtoken');

describe('loginRequired middleware', () => {
  let req, res, next, mockUser;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
    };

    jest.clearAllMocks();
  });

  describe('valid authentication', () => {
    it('should allow access with valid token', async () => {
      const token = 'valid-jwt-token';
      const decodedData = { id: 1, email: 'test@example.com' };
      
      req.headers.authorization = `Bearer ${token}`;

      jwt.verify.mockReturnValue(decodedData);
      User.findOne.mockResolvedValue(mockUser);

      await loginRequired(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.TOKEN_SECRET);
      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          id: decodedData.id,
          email: decodedData.email,
        },
      });
      expect(req.userId).toBe(decodedData.id);
      expect(req.userEmail).toBe(decodedData.email);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('invalid authentication', () => {
    it('should return 401 when no authorization header', async () => {
      await loginRequired(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Login required'],
      });
      expect(next).not.toHaveBeenCalled();
    });



    it('should return 401 when token is invalid', async () => {
      const invalidToken = 'invalid-token';
      req.headers.authorization = `Bearer ${invalidToken}`;

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await loginRequired(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(invalidToken, process.env.TOKEN_SECRET);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Expired or invalid token.'],
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when token is expired', async () => {
      const expiredToken = 'expired-token';
      req.headers.authorization = `Bearer ${expiredToken}`;

      const tokenExpiredError = new Error('Token expired');
      tokenExpiredError.name = 'TokenExpiredError';
      jwt.verify.mockImplementation(() => {
        throw tokenExpiredError;
      });

      await loginRequired(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Expired or invalid token.'],
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when user does not exist in database', async () => {
      const token = 'valid-token-but-user-deleted';
      const decodedData = { id: 999, email: 'deleted@example.com' };
      
      req.headers.authorization = `Bearer ${token}`;

      jwt.verify.mockReturnValue(decodedData);
      User.findOne.mockResolvedValue(null);

      await loginRequired(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          id: decodedData.id,
          email: decodedData.email,
        },
      });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Invalid User'],
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const token = 'valid-token';
      const decodedData = { id: 1, email: 'test@example.com' };
      
      req.headers.authorization = `Bearer ${token}`;

      jwt.verify.mockReturnValue(decodedData);
      User.findOne.mockRejectedValue(new Error('Database error'));

      await loginRequired(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Expired or invalid token.'],
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle token without Bearer prefix', async () => {
      req.headers.authorization = 'just-token-without-bearer';

      await loginRequired(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Expired or invalid token.'],
      });
    });

    it('should handle empty token after Bearer', async () => {
      req.headers.authorization = 'Bearer ';

      await loginRequired(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Expired or invalid token.'],
      });
    });

    it('should handle authorization header with only Bearer', async () => {
      req.headers.authorization = 'Bearer';

      await loginRequired(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Expired or invalid token.'],
      });
    });
  });
});