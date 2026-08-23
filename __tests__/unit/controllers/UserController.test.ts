jest.mock('../../../src/container', () => ({
  userService: {
    createUser: jest.fn(),
    listUsers: jest.fn(),
    getUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  },
}));

import { Request, Response } from 'express';
import User from '../../../src/models/User';
import userController from '../../../src/controllers/UserController';
import { userService } from '../../../src/container';
import { UserService } from '../../../src/services/UserService';

const mockedUserService = userService as jest.Mocked<UserService>;

function mockResponse(): Response {
  return { json: jest.fn() } as unknown as Response;
}

function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    password_hash: 'secret-hash',
    ...overrides,
  } as User;
}

describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('store', () => {
    it('creates a user and exposes only id, name and email', async () => {
      const res = mockResponse();
      const body = { name: 'Ada Lovelace', email: 'ada@example.com', password: 'secret123' };
      mockedUserService.createUser.mockResolvedValue(buildUser());

      await userController.store({ body } as Request, res);

      expect(mockedUserService.createUser).toHaveBeenCalledWith(body);
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Ada Lovelace', email: 'ada@example.com' });
    });
  });

  describe('index', () => {
    it('lists users via the user service', async () => {
      const res = mockResponse();
      const users = [buildUser()];
      mockedUserService.listUsers.mockResolvedValue(users);

      await userController.index({} as Request, res);

      expect(res.json).toHaveBeenCalledWith(users);
    });
  });

  describe('show', () => {
    it('returns a single user by numeric id, stripped down to public fields', async () => {
      const res = mockResponse();
      mockedUserService.getUser.mockResolvedValue(buildUser({ id: 7 }));

      await userController.show({ params: { id: '7' } } as unknown as Request, res);

      expect(mockedUserService.getUser).toHaveBeenCalledWith(7);
      expect(res.json).toHaveBeenCalledWith({ id: 7, name: 'Ada Lovelace', email: 'ada@example.com' });
    });
  });

  describe('update', () => {
    it('updates the authenticated user', async () => {
      const res = mockResponse();
      mockedUserService.updateUser.mockResolvedValue(buildUser({ name: 'Updated' }));

      const req = { userId: 1, body: { name: 'Updated' } } as unknown as Request;

      await userController.update(req, res);

      expect(mockedUserService.updateUser).toHaveBeenCalledWith(1, { name: 'Updated' });
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Updated', email: 'ada@example.com' });
    });
  });

  describe('delete', () => {
    it('deletes the authenticated user', async () => {
      const res = mockResponse();
      mockedUserService.deleteUser.mockResolvedValue(undefined);

      const req = { userId: 1 } as unknown as Request;

      await userController.delete(req, res);

      expect(mockedUserService.deleteUser).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ deleted: true });
    });
  });
});
