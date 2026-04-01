import request from 'supertest';
import app from '../../src/app';
import { uniqueEmail, createUserAndLogin, createStudent } from './helpers';

describe('E2E - Student Routes (/students)', () => {
  let token;

  beforeAll(async () => {
    const user = await createUserAndLogin({ name: 'Student Tester' });
    token = user.token;
  });

  // ────────────────────────────────────────────────
  // GET /students/ — list all
  // ────────────────────────────────────────────────
  describe('GET /students/', () => {
    it('should return an array of students without authentication', async () => {
      const res = await request(app).get('/students/');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('each student should have the expected fields', async () => {
      await createStudent(token);
      const res = await request(app).get('/students/');

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);

      const s = res.body[0];
      expect(s).toHaveProperty('id');
      expect(s).toHaveProperty('name');
      expect(s).toHaveProperty('lastname');
      expect(s).toHaveProperty('email');
      expect(s).toHaveProperty('age');
      expect(s).toHaveProperty('weight');
      expect(s).toHaveProperty('height');
      expect(s).toHaveProperty('Photos');
    });
  });

  // ────────────────────────────────────────────────
  // POST /students/ — create student (requires token)
  // ────────────────────────────────────────────────
  describe('POST /students/', () => {
    it('should create a student with valid data', async () => {
      const data = {
        name: 'John',
        lastname: 'Doe',
        email: uniqueEmail('student'),
        age: 25,
        weight: 70.0,
        height: 175.0,
      };

      const res = await request(app)
        .post('/students/')
        .set('Authorization', `Bearer ${token}`)
        .send(data);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'John');
      expect(res.body).toHaveProperty('lastname', 'Doe');
      expect(res.body).toHaveProperty('email', data.email);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/students/')
        .send({ name: 'No Token', lastname: 'Test', email: uniqueEmail(), age: 20, weight: 60, height: 160 });

      expect(res.status).toBe(401);
    });

    it('should return 400 with invalid email', async () => {
      const res = await request(app)
        .post('/students/')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Email Inv', lastname: 'Alido', email: 'invalid', age: 20, weight: 60, height: 160 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should return 400 with name too short', async () => {
      const res = await request(app)
        .post('/students/')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'AB', lastname: 'Valido', email: uniqueEmail(), age: 20, weight: 60, height: 160 });

      expect(res.status).toBe(400);
      expect(res.body.errors.some((e) => e.includes('Name'))).toBe(true);
    });

    it('should return 400 with duplicate email', async () => {
      const email = uniqueEmail('dup');
      await createStudent(token, { email });

      const res = await request(app)
        .post('/students/')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Dup Student', lastname: 'Last', email, age: 20, weight: 60, height: 160 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  // ────────────────────────────────────────────────
  // GET /students/:id — get by ID
  // ────────────────────────────────────────────────
  describe('GET /students/:id', () => {
    it('should return the student by ID', async () => {
      const created = await createStudent(token);

      const res = await request(app).get(`/students/${created.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', created.id);
      expect(res.body).toHaveProperty('name', created.name);
      expect(res.body).toHaveProperty('Photos');
    });

    it('should return 404 for non-existent ID', async () => {
      const res = await request(app).get('/students/999999');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toContain('Student does not exist');
    });
  });

  // ────────────────────────────────────────────────
  // PUT /students/:id — update student (requires token)
  // ────────────────────────────────────────────────
  describe('PUT /students/:id', () => {
    it('should update student fields', async () => {
      const created = await createStudent(token);

      const res = await request(app)
        .put(`/students/${created.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name', lastname: 'Updated Lastname' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated Name');
      expect(res.body).toHaveProperty('lastname', 'Updated Lastname');
    });

    it('should return 404 for non-existent ID', async () => {
      const res = await request(app)
        .put('/students/999999')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Name' });

      expect(res.status).toBe(404);
      expect(res.body.errors).toContain('Student does not exist');
    });

    it('should return 401 without token', async () => {
      const created = await createStudent(token);

      const res = await request(app)
        .put(`/students/${created.id}`)
        .send({ name: 'No token' });

      expect(res.status).toBe(401);
    });

    it('should return 400 with invalid age (non-numeric string)', async () => {
      const created = await createStudent(token);

      const res = await request(app)
        .put(`/students/${created.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ age: 'invalido' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  // ────────────────────────────────────────────────
  // DELETE /students/:id — remove student (requires token)
  // ────────────────────────────────────────────────
  describe('DELETE /students/:id', () => {
    it('should delete the student by ID', async () => {
      const created = await createStudent(token);

      const deleteRes = await request(app)
        .delete(`/students/${created.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toHaveProperty('deleted', true);
    });

    it('deleted student should no longer exist', async () => {
      const created = await createStudent(token);

      await request(app)
        .delete(`/students/${created.id}`)
        .set('Authorization', `Bearer ${token}`);

      const res = await request(app).get(`/students/${created.id}`);
      expect(res.status).toBe(404);
    });

    it('should return 404 for non-existent ID', async () => {
      const res = await request(app)
        .delete('/students/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.errors).toContain('Student does not exist');
    });

    it('should return 401 without token', async () => {
      const created = await createStudent(token);

      const res = await request(app)
        .delete(`/students/${created.id}`);

      expect(res.status).toBe(401);
    });
  });
});
