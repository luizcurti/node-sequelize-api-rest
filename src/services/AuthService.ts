import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { UserRepository } from '../repositories/interfaces/UserRepository';

interface LoginResult {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface AuthenticatedUser {
  userId: number;
  userEmail: string;
}

interface TokenPayload {
  id: number;
  email: string;
}

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(email: string, password: string): Promise<LoginResult> {
    if (!email || !password) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError('User does not exist');
    }

    if (!(await user.passwordIsValid(password))) {
      throw new UnauthorizedError('Invalid password');
    }

    const { id } = user;
    const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET as string, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    } as jwt.SignOptions);

    return { token, user: { id, name: user.name, email } };
  }

  async authenticate(authorizationHeader: string | undefined): Promise<AuthenticatedUser> {
    if (!authorizationHeader) {
      throw new UnauthorizedError('Login required');
    }

    const [, token] = authorizationHeader.split(' ');

    if (!token) {
      throw new UnauthorizedError('Expired or invalid token.');
    }

    let payload: TokenPayload;
    try {
      payload = jwt.verify(token, process.env.TOKEN_SECRET as string) as unknown as TokenPayload;
    } catch {
      throw new UnauthorizedError('Expired or invalid token.');
    }

    const { id, email } = payload;
    const user = await this.userRepository.findByIdAndEmail(id, email);

    if (!user) {
      throw new UnauthorizedError('Invalid User');
    }

    return { userId: id, userEmail: email };
  }
}
