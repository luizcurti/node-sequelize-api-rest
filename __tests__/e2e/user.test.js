import request from 'supertest';
import app from '../../src/app';
import { uniqueEmail, createUserAndLogin } from './helpers';

describe('E2E - User Routes (/user)', () => {
  let user;

  beforeAll(async () => {
    user = await createUserAndLogin();
  });

  // ────────────────────────────────────────────────
  // POST /user/ — create user
  // ────────────────────────────────────────────────
  describe('POST /user/', () => {
    it('should create a new user with valid data', async () => {
      const res = await request(app)
        .post('/user/')
        .send({ name: 'New User', email: uniqueEmail(), password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'New User');
      expect(res.body).toHaveProperty('email');
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).not.toHaveProperty('password_hash');
    });

    it('should return 400 with invalid email', async () => {
      const res = await request(app)
        .post('/user/')
        .send({ name: 'Test', email: 'invalid-email', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
      expect(Array.isArray(res.body.errors)).toBe(true);
    });

    it('should return 400 with name too short (< 3 chars)', async () => {
      const res = await request(app)
        .post('/user/')
        .send({ name: 'AB', email: uniqueEmail(), password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.errors.some((e) => e.includes('Name'))).toBe(true);
    });

    it('should return 400 with password too short (< 6 chars)', async () => {
      const res = await request(app)
        .post('/user/')
        .send({ name: 'Valid Name', email: uniqueEmail(), password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.errors.some((e) => e.includes('Password'))).toBe(true);
    });

    it('should return 400 with duplicate email', async () => {
      const email = uniqueEmail();
      await request(app)
        .post('/user/')
        .send({ name: 'First User', email, password: 'password123' });

      const res = await request(app)
        .post('/user/')
        .send({ name: 'Second User', email, password: 'password456' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  // ────────────────────────────────────────────────
  // GET /user/ — list users
  // ────────────────────────────────────────────────
  describe('GET /user/', () => {
    it('should return a list of users as an array', async () => {
      const res = await request(app).get('/user/');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('each user should only expose id, name and email', async () => {
      const res = await request(app).get('/user/');

      expect(res.status).toBe(200);
      if (res.body.length > 0) {
        const u = res.body[0];
        expect(u).toHaveProperty('id');
        expect(u).toHaveProperty('name');
        expect(u).toHaveProperty('email');
        expect(u).not.toHaveProperty('password_hash');
      }
    });
  });

  // ────────────────────────────────────────────────
  // GET /user/:id — get user by ID
  // ────────────────────────────────────────────────
  describe('GET /user/:id', () => {
    it('should return the user by ID', async () => {
      const res = await request(app).get(`/user/${user.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', user.id);
      expect(res.body).toHaveProperty('email', user.email);
    });

    it('should return 404 for non-existent ID', async () => {
      const res = await request(app).get('/user/999999');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('errors');
    });
  });

  // ────────────────────────────────────────────────
  // PUT /user/ — update own user (requires token)
  // ────────────────────────────────────────────────
  describe('PUT /user/', () => {
    it('should update the authenticated user\'s name', async () => {
      const res = await request(app)
        .put('/user/')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ name: 'Updated Name E2E' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated Name E2E');
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .put('/user/')
        .send({ name: 'No Token' });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('errors');
    });

    it('should return 400 with invalid email on update', async () => {
      const res = await request(app)
        .put('/user/')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ email: 'not-an-email' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  // ────────────────────────────────────────────────
  // DELETE /user/ — delete own user (requires token)
  // ────────────────────────────────────────────────
  describe('DELETE /user/', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).delete('/user/');

      expect(res.status).toBe(401);
    });

    it('should delete the authenticated user', async () => {
      // Create and log in a dedicated user to delete
      const toDelete = await createUserAndLogin({ name: 'To Delete' });

      const res = await request(app)
        .delete('/user/')
        .set('Authorization', `Bearer ${toDelete.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('deleted', true);
    });
  });
});
