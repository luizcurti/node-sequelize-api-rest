import Photo from '../models/Photo';
import Student from '../models/Student';
import { CreateStudentData, StudentRepository, UpdateStudentData } from './interfaces/StudentRepository';

const STUDENT_ATTRIBUTES = ['id', 'name', 'lastname', 'email', 'age', 'weight', 'height'];
const PHOTO_INCLUDE = { model: Photo, as: 'Photos', attributes: ['url', 'filename'] };

export class SequelizeStudentRepository implements StudentRepository {
  create(data: CreateStudentData): Promise<Student> {
    return Student.create(data);
  }

  findAll(): Promise<Student[]> {
    return Student.findAll({
      attributes: STUDENT_ATTRIBUTES,
      order: [['id', 'DESC'], [{ model: Photo, as: 'Photos' }, 'id', 'DESC']],
      include: PHOTO_INCLUDE,
    });
  }

  findById(id: number): Promise<Student | null> {
    return Student.findByPk(id, {
      attributes: STUDENT_ATTRIBUTES,
      include: PHOTO_INCLUDE,
    });
  }

  update(student: Student, data: UpdateStudentData): Promise<Student> {
    return student.update(data);
  }

  async delete(student: Student): Promise<void> {
    await student.destroy();
  }
}
