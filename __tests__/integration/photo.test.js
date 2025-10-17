import request from 'supertest';
import app from '../../src/app';

describe('Photo Routes Integration', () => {
  let authToken;

  beforeAll(async () => {
    // Get auth token before running tests
    const loginResponse = await request(app)
      .post('/tokens/')
      .send({
        email: 'admin@email.com',
        password: '123456',
      });

    authToken = loginResponse.body.token;
  });

  describe('POST /photos/', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .post('/photos/')
        .expect(401);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return error when no file is provided', async () => {
      const response = await request(app)
        .post('/photos/')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      // Will fail validation but the route handler will be called
      expect([400, 401]).toContain(response.status);
    });
  });
});
