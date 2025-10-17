import User from '../../../src/models/User';
import { Model } from 'sequelize';
import bcryptjs from 'bcryptjs';

jest.mock('bcryptjs');

describe('User Model', () => {
  it('should be defined', () => {
    expect(User).toBeDefined();
    expect(typeof User.init).toBe('function');
    expect(typeof User.associate).toBe('undefined');
  });

  it('should have passwordIsValid method', () => {
    expect(typeof User.prototype.passwordIsValid).toBe('function');
  });

  describe('beforeSave hook', () => {
    let mockSequelize;

    beforeEach(() => {
      mockSequelize = {
        define: jest.fn(),
        models: {},
      };
      jest.clearAllMocks();
    });

    it('should hash password when password is provided', async () => {
      const mockInit = jest.spyOn(Model, 'init').mockImplementation(() => User);
      const mockAddHook = jest.spyOn(User, 'addHook').mockImplementation(() => {});

      User.init(mockSequelize);

      expect(mockAddHook).toHaveBeenCalledWith('beforeSave', expect.any(Function));

   
      const hookFunction = mockAddHook.mock.calls[0][1];
      const mockUser = { password: 'testpassword123' };

      bcryptjs.hash.mockResolvedValue('hashedPassword123');

      await hookFunction(mockUser);

      expect(bcryptjs.hash).toHaveBeenCalledWith('testpassword123', 8);
      expect(mockUser.password_hash).toBe('hashedPassword123');

      mockInit.mockRestore();
      mockAddHook.mockRestore();
    });

    it('should not hash password when password is not provided', async () => {
      const mockInit = jest.spyOn(Model, 'init').mockImplementation(() => User);
      const mockAddHook = jest.spyOn(User, 'addHook').mockImplementation(() => {});

      User.init(mockSequelize);

   
      const hookFunction = mockAddHook.mock.calls[0][1];
      const mockUser = { password: undefined, password_hash: 'existingHash' };

      await hookFunction(mockUser);

      expect(bcryptjs.hash).not.toHaveBeenCalled();
      expect(mockUser.password_hash).toBe('existingHash');

      mockInit.mockRestore();
      mockAddHook.mockRestore();
    });
  });

  describe('passwordIsValid', () => {
    it('should validate password correctly', async () => {
      const mockUserInstance = {
        password_hash: 'hashedPassword123',
        passwordIsValid: User.prototype.passwordIsValid,
      };

      bcryptjs.compare.mockResolvedValue(true);

      const result = await mockUserInstance.passwordIsValid('testpassword');

      expect(bcryptjs.compare).toHaveBeenCalledWith('testpassword', 'hashedPassword123');
      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const mockUserInstance = {
        password_hash: 'hashedPassword123',
        passwordIsValid: User.prototype.passwordIsValid,
      };

      bcryptjs.compare.mockResolvedValue(false);

      const result = await mockUserInstance.passwordIsValid('wrongpassword');

      expect(bcryptjs.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword123');
      expect(result).toBe(false);
    });
  });
});
