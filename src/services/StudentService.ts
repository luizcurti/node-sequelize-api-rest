import Student from '../models/Student';
import { NotFoundError } from '../errors/NotFoundError';
import { CreateStudentData, StudentRepository, UpdateStudentData } from '../repositories/interfaces/StudentRepository';

export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  createStudent(data: CreateStudentData): Promise<Student> {
    return this.studentRepository.create(data);
  }

  listStudents(): Promise<Student[]> {
    return this.studentRepository.findAll();
  }

  async getStudent(id: number): Promise<Student> {
    const student = await this.studentRepository.findById(id);

    if (!student) {
      throw new NotFoundError('Student does not exist');
    }

    return student;
  }

  async updateStudent(id: number, data: UpdateStudentData): Promise<Student> {
    const student = await this.getStudent(id);
    return this.studentRepository.update(student, data);
  }

  async deleteStudent(id: number): Promise<void> {
    const student = await this.getStudent(id);
    await this.studentRepository.delete(student);
  }
}
