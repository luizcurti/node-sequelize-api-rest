jest.mock('../../../src/container', () => ({
  studentService: {
    listStudents: jest.fn(),
    createStudent: jest.fn(),
    getStudent: jest.fn(),
    updateStudent: jest.fn(),
    deleteStudent: jest.fn(),
  },
}));

import { Request, Response } from 'express';
import Student from '../../../src/models/Student';
import studentController from '../../../src/controllers/StudentController';
import { studentService } from '../../../src/container';
import { StudentService } from '../../../src/services/StudentService';
import { NotFoundError } from '../../../src/errors/NotFoundError';

const mockedStudentService = studentService as jest.Mocked<StudentService>;

function mockResponse(): Response {
  return { json: jest.fn() } as unknown as Response;
}

describe('StudentController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('index', () => {
    it('lists students via the student service', async () => {
      const res = mockResponse();
      const students = [{ id: 1, name: 'Ada' } as unknown as Student];
      mockedStudentService.listStudents.mockResolvedValue(students);

      await studentController.index({} as Request, res);

      expect(mockedStudentService.listStudents).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(students);
    });
  });

  describe('store', () => {
    it('creates a student via the student service', async () => {
      const res = mockResponse();
      const body = {
        name: 'Ada', lastname: 'Lovelace', email: 'ada@example.com', age: 30, weight: 60, height: 165,
      };
      const created = { id: 1, ...body } as unknown as Student;
      mockedStudentService.createStudent.mockResolvedValue(created);

      await studentController.store({ body } as Request, res);

      expect(mockedStudentService.createStudent).toHaveBeenCalledWith(body);
      expect(res.json).toHaveBeenCalledWith(created);
    });
  });

  describe('show', () => {
    it('returns a student by numeric id', async () => {
      const res = mockResponse();
      const student = { id: 5 } as unknown as Student;
      mockedStudentService.getStudent.mockResolvedValue(student);

      await studentController.show({ params: { id: '5' } } as unknown as Request, res);

      expect(mockedStudentService.getStudent).toHaveBeenCalledWith(5);
      expect(res.json).toHaveBeenCalledWith(student);
    });

    it('propagates a NotFoundError instead of handling it itself', async () => {
      const res = mockResponse();
      mockedStudentService.getStudent.mockRejectedValue(new NotFoundError('Student does not exist'));

      await expect(
        studentController.show({ params: { id: '999' } } as unknown as Request, res),
      ).rejects.toThrow('Student does not exist');
    });
  });

  describe('update', () => {
    it('updates a student via the student service', async () => {
      const res = mockResponse();
      const updated = { id: 5, name: 'Updated' } as unknown as Student;
      mockedStudentService.updateStudent.mockResolvedValue(updated);

      const req = { params: { id: '5' }, body: { name: 'Updated' } } as unknown as Request;

      await studentController.update(req, res);

      expect(mockedStudentService.updateStudent).toHaveBeenCalledWith(5, { name: 'Updated' });
      expect(res.json).toHaveBeenCalledWith(updated);
    });
  });

  describe('delete', () => {
    it('deletes a student via the student service', async () => {
      const res = mockResponse();
      mockedStudentService.deleteStudent.mockResolvedValue(undefined);

      await studentController.delete({ params: { id: '5' } } as unknown as Request, res);

      expect(mockedStudentService.deleteStudent).toHaveBeenCalledWith(5);
      expect(res.json).toHaveBeenCalledWith({ deleted: true });
    });
  });
});
