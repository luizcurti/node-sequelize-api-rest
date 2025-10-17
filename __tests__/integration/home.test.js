import request from 'supertest';
import app from '../../src/app';

describe('Home Routes', () => {
  it('should return success message on GET /', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.body).toBe('Index');
  });
});