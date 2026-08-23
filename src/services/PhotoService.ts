import Photo from '../models/Photo';
import { ValidationAppError } from '../errors/ValidationAppError';
import { PhotoRepository } from '../repositories/interfaces/PhotoRepository';
import { StudentRepository } from '../repositories/interfaces/StudentRepository';

export interface UploadedPhotoFile {
  originalname: string;
  filename: string;
}

export class PhotoService {
  constructor(
    private readonly photoRepository: PhotoRepository,
    private readonly studentRepository: StudentRepository,
  ) {}

  async createPhoto(studentId: number, file: UploadedPhotoFile): Promise<Photo> {
    const student = Number.isNaN(studentId) ? null : await this.studentRepository.findById(studentId);

    if (!student) {
      throw new ValidationAppError(['Student does not exist']);
    }

    const { originalname, filename } = file;

    return this.photoRepository.create({ originalname, filename, student_id: studentId });
  }
}
