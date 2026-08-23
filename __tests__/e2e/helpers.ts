import request from 'supertest';
import app from '../../src/app';

// Generates unique data to avoid conflicts between tests
export const uniqueEmail = (prefix = 'test'): string => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}@e2e.test`;

interface UserOverrides {
  name?: string;
  email?: string;
  password?: string;
}

interface CreatedUser {
  id: number;
  email: string;
  token: string;
  password: string;
}

export async function createUserAndLogin(overrides: UserOverrides = {}): Promise<CreatedUser> {
  const userData = {
    name: 'E2E User',
    email: uniqueEmail('user'),
    password: 'password123',
    ...overrides,
  };

  const createRes = await request(app).post('/user/').send(userData);
  const { id, email } = createRes.body;

  const loginRes = await request(app)
    .post('/tokens/')
    .send({ email, password: userData.password });

  return {
    id, email, token: loginRes.body.token, password: userData.password,
  };
}

interface StudentOverrides {
  name?: string;
  lastname?: string;
  email?: string;
  age?: number;
  weight?: number;
  height?: number;
}

export interface CreatedStudent {
  id: number;
  name: string;
  lastname: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  Photos: unknown[];
}

export async function createStudent(token: string, overrides: StudentOverrides = {}): Promise<CreatedStudent> {
  const studentData = {
    name: 'E2E Student',
    lastname: 'Tester',
    email: uniqueEmail('student'),
    age: 20,
    weight: 70.0,
    height: 175.0,
    ...overrides,
  };

  const res = await request(app)
    .post('/students/')
    .set('Authorization', `Bearer ${token}`)
    .send(studentData);

  return res.body;
}
