import User from '../../models/User';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByIdAndEmail(id: number, email: string): Promise<User | null>;
  update(user: User, data: UpdateUserData): Promise<User>;
  delete(user: User): Promise<void>;
}
