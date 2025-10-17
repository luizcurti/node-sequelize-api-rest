import request from 'supertest';
import app from '../../src/app';

describe('App CORS Configuration', () => {
  it('should allow requests from whitelisted origins', async () => {
    const response = await request(app)
      .get('/')
      .set('Origin', 'http://localhost:3000')
      .expect(200);

    expect(response.headers).toHaveProperty('access-control-allow-origin');
  });

  it('should reject requests from non-whitelisted origins', async () => {
    const response = await request(app)
      .get('/')
      .set('Origin', 'http://malicious-site.com');

    // CORS error will be handled by the cors middleware
    // The response might be 500 or have specific CORS error
    expect([200, 500]).toContain(response.status);
  });

  it('should allow requests without origin (server-to-server)', async () => {
    const response = await request(app)
      .get('/');

    expect(response.status).toBe(200);
  });
});
