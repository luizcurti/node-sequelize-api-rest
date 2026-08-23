import Student from '../../models/Student';

export interface CreateStudentData {
  name: string;
  lastname: string;
  email: string;
  age: number;
  weight: number;
  height: number;
}

export type UpdateStudentData = Partial<CreateStudentData>;

export interface StudentRepository {
  create(data: CreateStudentData): Promise<Student>;
  findAll(): Promise<Student[]>;
  findById(id: number): Promise<Student | null>;
  update(student: Student, data: UpdateStudentData): Promise<Student>;
  delete(student: Student): Promise<void>;
}
