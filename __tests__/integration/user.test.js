import request from 'supertest';
import app from '../../src/app';

describe('User Routes', () => {
  describe('GET /user/', () => {
    it('should return list of users', async () => {
      const response = await request(app)
        .get('/user/')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /user/', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      };

      const response = await request(app)
        .post('/user/')
        .send(userData);

      if (response.status !== 200) {
        console.log('Error response:', response.body);
      }

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('password_hash');
    });

    it('should not create user with invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/user/')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should not create user with short password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test2@example.com',
        password: '123'
      };

      const response = await request(app)
        .post('/user/')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });
});


