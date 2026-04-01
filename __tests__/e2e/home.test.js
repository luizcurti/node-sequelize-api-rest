import request from 'supertest';
import app from '../../src/app';

describe('E2E - Home Routes', () => {
  describe('GET /', () => {
    it('should return status 200', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    });

    it('should return "Index"', async () => {
      const res = await request(app).get('/');
      expect(res.body).toBe('Index');
    });
  });
});
