import request from 'supertest';
import app from '../../src/app';

describe('Token Routes', () => {
  describe('POST /tokens/', () => {
    it('should return JWT token with valid credentials', async () => {
      // First create a user through the seeded data or create one
      const loginData = {
        email: 'admin@email.com', // Using seeded user
        password: '123456'
      };

      const response = await request(app)
        .post('/tokens/')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should not return token with invalid credentials', async () => {
      const loginData = {
        email: 'wrong@email.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/tokens/')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('errors');
    });

    it('should not return token with missing email', async () => {
      const loginData = {
        password: '123456'
      };

      const response = await request(app)
        .post('/tokens/')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('errors');
    });

    it('should not return token with missing password', async () => {
      const loginData = {
        email: 'admin@email.com'
      };

      const response = await request(app)
        .post('/tokens/')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('errors');
    });
  });
});