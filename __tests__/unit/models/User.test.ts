import { Sequelize } from 'sequelize';
import bcryptjs from 'bcryptjs';
import User from '../../../src/models/User';

jest.mock('bcryptjs');

const mockedBcrypt = bcryptjs as jest.Mocked<typeof bcryptjs>;

describe('User model', () => {
  const sequelize = new Sequelize({ dialect: 'mysql', logging: false });
  let beforeSaveHook: (user: User) => Promise<void>;

  beforeAll(() => {
    const addHookSpy = jest.spyOn(User, 'addHook');
    User.initModel(sequelize);
    const call = addHookSpy.mock.calls.find(([hookName]) => hookName === 'beforeSave');
    beforeSaveHook = call![1] as (user: User) => Promise<void>;
    addHookSpy.mockRestore();
  });

  it('defines the expected attributes', () => {
    expect(Object.keys(User.getAttributes())).toEqual(
      expect.arrayContaining(['id', 'name', 'email', 'password_hash', 'password']),
    );
  });

  describe('passwordIsValid', () => {
    it('compares the given password against the stored hash', async () => {
      const user = User.build({ name: 'Ada', email: 'ada@example.com', password_hash: 'hashed' });
      mockedBcrypt.compare.mockResolvedValue(true as never);

      await expect(user.passwordIsValid('secret')).resolves.toBe(true);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('secret', 'hashed');
    });
  });

  describe('beforeSave hook', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('hashes the password when it was set for this save', async () => {
      const user = User.build({ name: 'Ada', email: 'ada@example.com', password: 'plain' });
      mockedBcrypt.hash.mockResolvedValue('hashed' as never);

      await beforeSaveHook(user);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('plain', 8);
      expect(user.password_hash).toBe('hashed');
    });

    it('leaves the stored hash untouched when no password is provided', async () => {
      const user = User.build({ name: 'Ada', email: 'ada@example.com', password_hash: 'existing' });

      await beforeSaveHook(user);

      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      expect(user.password_hash).toBe('existing');
    });

    it('does not re-hash a stale virtual password value that was not changed for this save', async () => {
      const user = User.build({
        name: 'Ada', email: 'ada@example.com', password: 'plain', password_hash: 'existing',
      });
      user.changed('password', false);

      await beforeSaveHook(user);

      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      expect(user.password_hash).toBe('existing');
    });
  });
});
