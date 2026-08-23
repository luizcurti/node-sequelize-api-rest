import User from '../models/User';
import { NotFoundError } from '../errors/NotFoundError';
import { CreateUserData, UpdateUserData, UserRepository } from '../repositories/interfaces/UserRepository';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  createUser(data: CreateUserData): Promise<User> {
    return this.userRepository.create(data);
  }

  listUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUser(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User does not exist');
    }

    return user;
  }

  async updateUser(id: number, data: UpdateUserData): Promise<User> {
    const user = await this.getUser(id);
    return this.userRepository.update(user, data);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUser(id);
    await this.userRepository.delete(user);
  }
}
