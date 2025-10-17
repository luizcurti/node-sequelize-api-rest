import request from 'supertest';
import app from '../../src/app';

describe('Student Routes', () => {
  let authToken;

  beforeAll(async () => {
    // Get auth token before running tests
    const loginResponse = await request(app)
      .post('/tokens/')
      .send({
        email: 'admin@email.com',
        password: '123456'
      });

    authToken = loginResponse.body.token;
  });

  describe('GET /students/', () => {
    it('should return list of students', async () => {
      const response = await request(app)
        .get('/students/')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /students/', () => {
    it('should create a new student with authentication', async () => {
      const studentData = {
        name: 'John Doe',
        lastname: 'Doe',
        email: `john.doe${Date.now()}@example.com`,
        age: 25,
        weight: 70,
        height: 1.75
      };

      const response = await request(app)
        .post('/students/')
        .set('Authorization', `Bearer ${authToken}`)
        .send(studentData);

      if (response.status !== 200) {
        console.log('Error response:', response.body);
      }

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(studentData.name);
      expect(response.body.email).toBe(studentData.email);
    });

    it('should not create student without authentication', async () => {
      const studentData = {
        name: 'John Doe',
        lastname: 'Doe',
        email: 'john.doe2@example.com',
        age: 25,
        weight: 70,
        height: 1.75
      };

      const response = await request(app)
        .post('/students/')
        .send(studentData)
        .expect(401);

      expect(response.body).toHaveProperty('errors');
    });

    it('should not create student with invalid data', async () => {
      const studentData = {
        name: 'A', // Too short
        email: 'invalid-email',
        age: -5 // Invalid age
      };

      const response = await request(app)
        .post('/students/')
        .set('Authorization', `Bearer ${authToken}`)
        .send(studentData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /students/:id', () => {
    it('should return a student with photos', async () => {
      // First create a student
      const studentData = {
        name: 'Student With Photo',
        lastname: 'Test',
        email: `photo${Date.now()}@example.com`,
        age: 22,
        weight: 65,
        height: 1.70,
      };

      const createResponse = await request(app)
        .post('/students/')
        .set('Authorization', `Bearer ${authToken}`)
        .send(studentData);

      const studentId = createResponse.body.id;

      // Get the student (which will include Photos with url field)
      const response = await request(app)
        .get(`/students/${studentId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', studentId);
      expect(response.body).toHaveProperty('name', studentData.name);
      expect(response.body).toHaveProperty('Photos');
      expect(Array.isArray(response.body.Photos)).toBe(true);
    });
  });
});

