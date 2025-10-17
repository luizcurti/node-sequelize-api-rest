import UserController from '../../../src/controllers/UserController';
import User from '../../../src/models/User';

jest.mock('../../../src/models/User');

describe('UserController', () => {
  let req, res, mockUser;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      userId: 1,
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      update: jest.fn(),
      destroy: jest.fn(),
    };
    
    jest.clearAllMocks();
  });

  describe('store', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      req.body = userData;

      const createdUser = {
        id: 1,
        name: userData.name,
        email: userData.email,
      };

      User.create.mockResolvedValue(createdUser);

      await UserController.store(req, res);

      expect(User.create).toHaveBeenCalledWith(userData);
      expect(res.json).toHaveBeenCalledWith({
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      });
    });

    it('should handle validation errors', async () => {
      const userData = {
        name: 'Jo', 
        email: 'invalid-email',
        password: '123',
      };
      req.body = userData;

      const validationError = {
        errors: [
          { message: 'Name field must be between 3 and 255 characters' },
          { message: 'Invalid email' },
          { message: 'Password must be between 6 and 50 characters' },
        ],
      };

      User.create.mockRejectedValue(validationError);

      await UserController.store(req, res);

      expect(User.create).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          'Name field must be between 3 and 255 characters',
          'Invalid email',
          'Password must be between 6 and 50 characters',
        ],
      });
    });
  });

  describe('index', () => {
    it('should return all users', async () => {
      const users = [
        { id: 1, name: 'User 1', email: 'user1@example.com' },
        { id: 2, name: 'User 2', email: 'user2@example.com' },
      ];

      User.findAll.mockResolvedValue(users);

      await UserController.index(req, res);

      expect(User.findAll).toHaveBeenCalledWith({
        attributes: ['id', 'name', 'email'],
      });
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should handle errors and return null', async () => {
      User.findAll.mockRejectedValue(new Error('Database error'));

      await UserController.index(req, res);

      expect(User.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(null);
    });
  });

  describe('show', () => {
    it('should return a specific user', async () => {
      const userId = '1';
      req.params.id = userId;

      User.findByPk.mockResolvedValue(mockUser);

      await UserController.show(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(userId);
      expect(res.json).toHaveBeenCalledWith({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      });
    });

    it('should handle errors and return null', async () => {
      const userId = '999';
      req.params.id = userId;

      User.findByPk.mockRejectedValue(new Error('User not found'));

      await UserController.show(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(userId);
      expect(res.json).toHaveBeenCalledWith(null);
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };
      req.body = updateData;

      const updatedUser = {
        ...mockUser,
        ...updateData,
      };

      User.findByPk.mockResolvedValue(mockUser);
      mockUser.update.mockResolvedValue(updatedUser);

      await UserController.update(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(req.userId);
      expect(mockUser.update).toHaveBeenCalledWith(updateData);
      expect(res.json).toHaveBeenCalledWith({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      });
    });

    it('should return error if user does not exist', async () => {
      User.findByPk.mockResolvedValue(null);

      await UserController.update(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(req.userId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['User does not exist'],
      });
    });

    it('should handle validation errors during update', async () => {
      const updateData = {
        email: 'invalid-email',
      };
      req.body = updateData;

      const validationError = {
        errors: [{ message: 'Invalid email' }],
      };

      User.findByPk.mockResolvedValue(mockUser);
      mockUser.update.mockRejectedValue(validationError);

      await UserController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Invalid email'],
      });
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      User.findByPk.mockResolvedValue(mockUser);
      mockUser.destroy.mockResolvedValue();

      await UserController.delete(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(req.userId);
      expect(mockUser.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(null);
    });

    it('should return error if user does not exist', async () => {
      User.findByPk.mockResolvedValue(null);

      await UserController.delete(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(req.userId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['User does not exist'],
      });
    });

    it('should handle errors during deletion', async () => {
      const deleteError = {
        errors: [{ message: 'Cannot delete user' }],
      };

      User.findByPk.mockResolvedValue(mockUser);
      mockUser.destroy.mockRejectedValue(deleteError);

      await UserController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Cannot delete user'],
      });
    });
  });
});