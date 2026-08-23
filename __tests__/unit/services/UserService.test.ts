import { UserService } from '../../../src/services/UserService';
import { NotFoundError } from '../../../src/errors/NotFoundError';
import { UserRepository } from '../../../src/repositories/interfaces/UserRepository';
import User from '../../../src/models/User';

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

describe('UserService', () => {
  let userRepository: jest.Mocked<UserRepository>;
  let userService: UserService;

  beforeEach(() => {
    userRepository = buildUserRepository();
    userService = new UserService(userRepository);
  });

  it('creates a user through the repository', async () => {
    const data = { name: 'Ada', email: 'ada@example.com', password: 'secret123' };
    const created = { id: 1 } as User;
    userRepository.create.mockResolvedValue(created);

    await expect(userService.createUser(data)).resolves.toBe(created);
    expect(userRepository.create).toHaveBeenCalledWith(data);
  });

  it('lists all users through the repository', async () => {
    const users = [{ id: 1 } as User];
    userRepository.findAll.mockResolvedValue(users);

    await expect(userService.listUsers()).resolves.toBe(users);
  });

  it('returns a user by id when it exists', async () => {
    const user = { id: 1 } as User;
    userRepository.findById.mockResolvedValue(user);

    await expect(userService.getUser(1)).resolves.toBe(user);
  });

  it('throws NotFoundError when the user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(userService.getUser(999)).rejects.toThrow(NotFoundError);
  });

  it('updates an existing user', async () => {
    const user = { id: 1 } as User;
    const updated = { id: 1, name: 'Updated' } as User;
    userRepository.findById.mockResolvedValue(user);
    userRepository.update.mockResolvedValue(updated);

    await expect(userService.updateUser(1, { name: 'Updated' })).resolves.toBe(updated);
    expect(userRepository.update).toHaveBeenCalledWith(user, { name: 'Updated' });
  });

  it('throws NotFoundError when updating a non-existent user', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(userService.updateUser(999, { name: 'Updated' })).rejects.toThrow(NotFoundError);
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('deletes an existing user', async () => {
    const user = { id: 1 } as User;
    userRepository.findById.mockResolvedValue(user);

    await userService.deleteUser(1);

    expect(userRepository.delete).toHaveBeenCalledWith(user);
  });

  it('throws NotFoundError when deleting a non-existent user', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(userService.deleteUser(999)).rejects.toThrow(NotFoundError);
    expect(userRepository.delete).not.toHaveBeenCalled();
  });
});
