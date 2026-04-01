import request from 'supertest';
import app from '../../src/app';

// Gera dados únicos para evitar conflito entre testes
export const uniqueEmail = (prefix = 'test') =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}@e2e.test`;

/**
 * Creates a user and returns { id, token }
 */
export async function createUserAndLogin(overrides = {}) {
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

  return { id, email, token: loginRes.body.token, password: userData.password };
}

/**
 * Creates a student and returns the created object
 */
export async function createStudent(token, overrides = {}) {
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
