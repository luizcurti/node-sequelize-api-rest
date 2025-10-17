import StudentController from '../../../src/controllers/StudentController';
import Student from '../../../src/models/Student';
import Photo from '../../../src/models/Photo';

jest.mock('../../../src/models/Student');
jest.mock('../../../src/models/Photo');

describe('StudentController', () => {
  let req, res, mockStudent;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    mockStudent = {
      id: 1,
      name: 'Test Student',
      lastname: 'Test Lastname',
      email: 'student@example.com',
      age: 20,
      weight: 70,
      height: 175,
      update: jest.fn(),
      destroy: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('index', () => {
    it('should return all students with photos', async () => {
      const students = [
        {
          ...mockStudent,
          Photos: [{ id: 1, filename: 'photo1.jpg' }],
        },
        {
          id: 2,
          name: 'Student 2',
          lastname: 'Lastname 2',
          email: 'student2@example.com',
          age: 22,
          weight: 65,
          height: 170,
          Photos: [],
        },
      ];

      Student.findAll.mockResolvedValue(students);

      await StudentController.index(req, res);

      expect(Student.findAll).toHaveBeenCalledWith({
        attributes: ['id', 'name', 'lastname', 'email', 'age', 'weight', 'height'],
        order: [['id', 'DESC'], [Photo, 'id', 'DESC']],
        include: {
          model: Photo,
          attributes: ['url', 'filename'],
        },
      });
      expect(res.json).toHaveBeenCalledWith(students);
    });

    it('should handle errors and return null', async () => {
      Student.findAll.mockRejectedValue(new Error('Database error'));

      await expect(StudentController.index(req, res)).rejects.toThrow('Database error');
    });
  });

  describe('store', () => {
    it('should create a new student successfully', async () => {
      const studentData = {
        name: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        age: 21,
        weight: 75,
        height: 180,
      };
      req.body = studentData;

      const createdStudent = {
        id: 1,
        ...studentData,
      };

      Student.create.mockResolvedValue(createdStudent);

      await StudentController.store(req, res);

      expect(Student.create).toHaveBeenCalledWith(studentData);
      expect(res.json).toHaveBeenCalledWith(createdStudent);
    });

    it('should handle validation errors', async () => {
      const studentData = {
        name: 'Jo',
        email: 'invalid-email',
        age: -1, 
      };
      req.body = studentData;

      const validationError = {
        errors: [
          { message: 'Name field must be between 3 and 255 characters' },
          { message: 'Invalid email' },
          { message: 'Age must be a positive number' },
        ],
      };

      Student.create.mockRejectedValue(validationError);

      await StudentController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          'Name field must be between 3 and 255 characters',
          'Invalid email',
          'Age must be a positive number',
        ],
      });
    });
  });

  describe('show', () => {
    it('should return error if ID is missing', async () => {
      req.params = {};

      await StudentController.show(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Faltando ID'],
      });
    });

    it('should return a specific student with photos', async () => {
      const studentId = '1';
      req.params.id = studentId;

      const studentWithPhotos = {
        ...mockStudent,
        Photos: [{ id: 1, filename: 'photo1.jpg' }],
      };

      Student.findByPk.mockResolvedValue(studentWithPhotos);

      await StudentController.show(req, res);

      expect(Student.findByPk).toHaveBeenCalledWith(studentId, {
        attributes: ['id', 'name', 'lastname', 'email', 'age', 'weight', 'height'],
        order: [['id', 'DESC'], [Photo, 'id', 'DESC']],
        include: {
          model: Photo,
          attributes: ['url', 'filename'],
        },
      });
      expect(res.json).toHaveBeenCalledWith(studentWithPhotos);
    });

    it('should return error if student not found', async () => {
      const studentId = '999';
      req.params.id = studentId;

      Student.findByPk.mockResolvedValue(null);

      await StudentController.show(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Student não existe'],
      });
    });

    it('should handle errors', async () => {
      const studentId = '1';
      req.params.id = studentId;

      const dbError = {
        errors: [{ message: 'Database error' }],
      };
      Student.findByPk.mockRejectedValue(dbError);

      await StudentController.show(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Database error'],
      });
    });
  });

  describe('update', () => {
    it('should return error if ID is missing', async () => {
      req.params = {};
      req.body = {
        name: 'João Updated',
        email: 'joao.updated@mail.com',
      };

      await StudentController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Faltando ID'],
      });
    });

    it('should update a student successfully', async () => {
      const studentId = '1';
      req.params.id = studentId;
      req.body = {
        name: 'João Updated',
        email: 'joao.updated@mail.com',
      };

      Student.findByPk.mockResolvedValue(mockStudent);
      mockStudent.update.mockResolvedValue({ ...mockStudent, ...req.body });

      await StudentController.update(req, res);

      expect(Student.findByPk).toHaveBeenCalledWith(studentId);
      expect(mockStudent.update).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith({ ...mockStudent, ...req.body });
    });

    it('should return error if student does not exist', async () => {
      const studentId = '999';
      req.params.id = studentId;

      Student.findByPk.mockResolvedValue(null);

      await StudentController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Student não existe'],
      });
    });

    it('should handle validation errors', async () => {
      const studentId = '1';
      const updateData = {
        email: 'invalid-email',
      };
      req.params.id = studentId;
      req.body = updateData;

      const validationError = {
        errors: [{ message: 'Invalid email' }],
      };

      Student.findByPk.mockResolvedValue(mockStudent);
      mockStudent.update.mockRejectedValue(validationError);

      await StudentController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Invalid email'],
      });
    });
  });

  describe('delete', () => {
    it('should return error if ID is missing', async () => {
      req.params = {};

      await StudentController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Faltando ID'],
      });
    });

    it('should delete a student successfully', async () => {
      const studentId = '1';
      req.params.id = studentId;

      Student.findByPk.mockResolvedValue(mockStudent);
      mockStudent.destroy.mockResolvedValue();

      await StudentController.delete(req, res);

      expect(Student.findByPk).toHaveBeenCalledWith(studentId);
      expect(mockStudent.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ apagado: true });
    });

    it('should return error if student not found', async () => {
      const studentId = '999';
      req.params.id = studentId;

      Student.findByPk.mockResolvedValue(null);

      await StudentController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Student não existe'],
      });
    });

    it('should handle errors during deletion', async () => {
      const studentId = '1';
      req.params.id = studentId;

      const deleteError = {
        errors: [{ message: 'Cannot delete student' }],
      };

      Student.findByPk.mockResolvedValue(mockStudent);
      mockStudent.destroy.mockRejectedValue(deleteError);

      await StudentController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Cannot delete student'],
      });
    });
  });
});
