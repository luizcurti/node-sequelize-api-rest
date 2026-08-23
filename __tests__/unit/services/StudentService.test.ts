import { StudentService } from '../../../src/services/StudentService';
import { NotFoundError } from '../../../src/errors/NotFoundError';
import { StudentRepository } from '../../../src/repositories/interfaces/StudentRepository';
import Student from '../../../src/models/Student';

function buildStudentRepository(): jest.Mocked<StudentRepository> {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

describe('StudentService', () => {
  let studentRepository: jest.Mocked<StudentRepository>;
  let studentService: StudentService;

  beforeEach(() => {
    studentRepository = buildStudentRepository();
    studentService = new StudentService(studentRepository);
  });

  it('creates a student through the repository', async () => {
    const data = {
      name: 'Ada', lastname: 'Lovelace', email: 'ada@example.com', age: 30, weight: 60, height: 165,
    };
    const created = { id: 1 } as Student;
    studentRepository.create.mockResolvedValue(created);

    await expect(studentService.createStudent(data)).resolves.toBe(created);
    expect(studentRepository.create).toHaveBeenCalledWith(data);
  });

  it('lists all students through the repository', async () => {
    const students = [{ id: 1 } as Student];
    studentRepository.findAll.mockResolvedValue(students);

    await expect(studentService.listStudents()).resolves.toBe(students);
  });

  it('returns a student by id when it exists', async () => {
    const student = { id: 1 } as Student;
    studentRepository.findById.mockResolvedValue(student);

    await expect(studentService.getStudent(1)).resolves.toBe(student);
  });

  it('throws NotFoundError when the student does not exist', async () => {
    studentRepository.findById.mockResolvedValue(null);

    await expect(studentService.getStudent(999)).rejects.toThrow(NotFoundError);
  });

  it('updates an existing student', async () => {
    const student = { id: 1 } as Student;
    const updated = { id: 1, name: 'Updated' } as Student;
    studentRepository.findById.mockResolvedValue(student);
    studentRepository.update.mockResolvedValue(updated);

    await expect(studentService.updateStudent(1, { name: 'Updated' })).resolves.toBe(updated);
    expect(studentRepository.update).toHaveBeenCalledWith(student, { name: 'Updated' });
  });

  it('throws NotFoundError when updating a non-existent student', async () => {
    studentRepository.findById.mockResolvedValue(null);

    await expect(studentService.updateStudent(999, { name: 'Updated' })).rejects.toThrow(NotFoundError);
    expect(studentRepository.update).not.toHaveBeenCalled();
  });

  it('deletes an existing student', async () => {
    const student = { id: 1 } as Student;
    studentRepository.findById.mockResolvedValue(student);

    await studentService.deleteStudent(1);

    expect(studentRepository.delete).toHaveBeenCalledWith(student);
  });

  it('throws NotFoundError when deleting a non-existent student', async () => {
    studentRepository.findById.mockResolvedValue(null);

    await expect(studentService.deleteStudent(999)).rejects.toThrow(NotFoundError);
    expect(studentRepository.delete).not.toHaveBeenCalled();
  });
});
