import request from 'supertest';
import path from 'path';
import fs from 'fs';
import app from '../../src/app';
import { createUserAndLogin, createStudent } from './helpers';

// Directory where multer saves test uploads
const UPLOADS_DIR = path.resolve(process.cwd(), '__tests__', 'uploads', 'images');

// Ensure the test uploads directory exists
beforeAll(() => {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
});

// Remove image files generated during tests
afterAll(() => {
  if (fs.existsSync(UPLOADS_DIR)) {
    const files = fs.readdirSync(UPLOADS_DIR);
    files.forEach((f) => fs.unlinkSync(path.join(UPLOADS_DIR, f)));
  }
});

describe('E2E - Photo Routes (/photos)', () => {
  let token;
  let student;
  const FIXTURE_PNG = path.resolve(process.cwd(), '__tests__', 'fixtures', 'test.png');

  beforeAll(async () => {
    const user = await createUserAndLogin({ name: 'Photo Tester' });
    token = user.token;
    student = await createStudent(token);

    // Ensure the fixtures dir and test image exist
    const fixturesDir = path.dirname(FIXTURE_PNG);
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }
    // Create a minimal valid PNG (1x1 transparent pixel)
    if (!fs.existsSync(FIXTURE_PNG)) {
      const minimalPng = Buffer.from(
        '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000'
        + 'a49444154789c6260000000020001e221bc330000000049454e44ae426082',
        'hex',
      );
      fs.writeFileSync(FIXTURE_PNG, minimalPng);
    }
  });

  // ────────────────────────────────────────────────
  // POST /photos/ — photo upload (requires token)
  // ────────────────────────────────────────────────
  describe('POST /photos/', () => {
    it('should upload a photo linked to a student', async () => {
      const res = await request(app)
        .post('/photos/')
        .set('Authorization', `Bearer ${token}`)
        .attach('photo', FIXTURE_PNG)
        .field('student_id', String(student.id));

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('originalname');
      expect(res.body).toHaveProperty('filename');
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/photos/')
        .attach('photo', FIXTURE_PNG)
        .field('student_id', String(student.id));

      expect(res.status).toBe(401);
    });

    it('should return 400 with a non-image file', async () => {
      // Create a temporary text file
      const txtFile = path.resolve(process.cwd(), '__tests__', 'fixtures', 'test.txt');
      fs.writeFileSync(txtFile, 'i am not an image');

      const res = await request(app)
        .post('/photos/')
        .set('Authorization', `Bearer ${token}`)
        .attach('photo', txtFile)
        .field('student_id', String(student.id));

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');

      fs.unlinkSync(txtFile);
    });

    it('should return 400 with non-existent student_id', async () => {
      const res = await request(app)
        .post('/photos/')
        .set('Authorization', `Bearer ${token}`)
        .attach('photo', FIXTURE_PNG)
        .field('student_id', '999999');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('uploaded photo should appear in GET /students/:id', async () => {
      await request(app)
        .post('/photos/')
        .set('Authorization', `Bearer ${token}`)
        .attach('photo', FIXTURE_PNG)
        .field('student_id', String(student.id));

      const res = await request(app).get(`/students/${student.id}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.Photos)).toBe(true);
      expect(res.body.Photos.length).toBeGreaterThan(0);
      expect(res.body.Photos[0]).toHaveProperty('filename');
      expect(res.body.Photos[0]).toHaveProperty('url');
    });
  });
});
