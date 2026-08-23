import User from '../models/User';
import { CreateUserData, UpdateUserData, UserRepository } from './interfaces/UserRepository';

export class SequelizeUserRepository implements UserRepository {
  create(data: CreateUserData): Promise<User> {
    return User.create(data);
  }

  findAll(): Promise<User[]> {
    return User.findAll({ attributes: ['id', 'name', 'email'] });
  }

  findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  findByIdAndEmail(id: number, email: string): Promise<User | null> {
    return User.findOne({ where: { id, email } });
  }

  update(user: User, data: UpdateUserData): Promise<User> {
    return user.update(data);
  }

  async delete(user: User): Promise<void> {
    await user.destroy();
  }
}
