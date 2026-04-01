import request from 'supertest';
import app from '../../src/app';
import { uniqueEmail, createUserAndLogin } from './helpers';

describe('E2E - Token Routes (/tokens)', () => {
  let userEmail;
  const userPassword = 'password123';

  beforeAll(async () => {
    userEmail = uniqueEmail('token');
    await request(app)
      .post('/user/')
      .send({ name: 'Token Test User', email: userEmail, password: userPassword });
  });

  // ────────────────────────────────────────────────
  // POST /tokens/ — login / token generation
  // ────────────────────────────────────────────────
  describe('POST /tokens/', () => {
    it('should return a JWT token with valid credentials', async () => {
      const res = await request(app)
        .post('/tokens/')
        .send({ email: userEmail, password: userPassword });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
      expect(res.body.token.split('.')).toHaveLength(3); // JWT format
    });

    it('should return user info alongside the token', async () => {
      const res = await request(app)
        .post('/tokens/')
        .send({ email: userEmail, password: userPassword });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('name');
      expect(res.body.user).toHaveProperty('email');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).not.toHaveProperty('password');
      expect(res.body.user).not.toHaveProperty('password_hash');
    });

    it('should return 401 with wrong password', async () => {
      const res = await request(app)
        .post('/tokens/')
        .send({ email: userEmail, password: 'wrongPassword' });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toContain('Invalid password');
    });

    it('should return 401 with non-existent email', async () => {
      const res = await request(app)
        .post('/tokens/')
        .send({ email: 'nonexistent@test.com', password: userPassword });

      expect(res.status).toBe(401);
      expect(res.body.errors).toContain('User does not exist');
    });

    it('should return 401 without email', async () => {
      const res = await request(app)
        .post('/tokens/')
        .send({ password: userPassword });

      expect(res.status).toBe(401);
      expect(res.body.errors).toContain('Invalid credentials');
    });

    it('should return 401 without password', async () => {
      const res = await request(app)
        .post('/tokens/')
        .send({ email: userEmail });

      expect(res.status).toBe(401);
      expect(res.body.errors).toContain('Invalid credentials');
    });

    it('should return 401 with empty body', async () => {
      const res = await request(app).post('/tokens/').send({});

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('errors');
    });
  });

  // ────────────────────────────────────────────────
  // Verify generated token authenticates protected routes
  // ────────────────────────────────────────────────
  describe('Token validated on protected route', () => {
    it('should accept the generated token on a route requiring authentication', async () => {
      const loginRes = await request(app)
        .post('/tokens/')
        .send({ email: userEmail, password: userPassword });

      const { token } = loginRes.body;

      const res = await request(app)
        .put('/user/')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Verifying Token' });

      expect(res.status).toBe(200);
    });

    it('should reject an invalid token on a protected route', async () => {
      const res = await request(app)
        .put('/user/')
        .set('Authorization', 'Bearer token.invalid.here')
        .send({ name: 'No access' });

      expect(res.status).toBe(401);
    });
  });
});
