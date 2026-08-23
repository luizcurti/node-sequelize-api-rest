import { PhotoService } from '../../../src/services/PhotoService';
import { ValidationAppError } from '../../../src/errors/ValidationAppError';
import { PhotoRepository } from '../../../src/repositories/interfaces/PhotoRepository';
import { StudentRepository } from '../../../src/repositories/interfaces/StudentRepository';
import Photo from '../../../src/models/Photo';
import Student from '../../../src/models/Student';

function buildPhotoRepository(): jest.Mocked<PhotoRepository> {
  return { create: jest.fn() };
}

function buildStudentRepository(): jest.Mocked<StudentRepository> {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

describe('PhotoService', () => {
  let photoRepository: jest.Mocked<PhotoRepository>;
  let studentRepository: jest.Mocked<StudentRepository>;
  let photoService: PhotoService;

  beforeEach(() => {
    photoRepository = buildPhotoRepository();
    studentRepository = buildStudentRepository();
    photoService = new PhotoService(photoRepository, studentRepository);
  });

  it('creates a photo linked to the student when the student exists', async () => {
    const student = { id: 1 } as Student;
    const file = { originalname: 'photo.png', filename: 'stored.png' };
    const photo = { id: 1 } as Photo;
    studentRepository.findById.mockResolvedValue(student);
    photoRepository.create.mockResolvedValue(photo);

    await expect(photoService.createPhoto(1, file)).resolves.toBe(photo);
    expect(photoRepository.create).toHaveBeenCalledWith({ ...file, student_id: 1 });
  });

  it('throws a validation error when the student does not exist', async () => {
    studentRepository.findById.mockResolvedValue(null);

    await expect(
      photoService.createPhoto(999, { originalname: 'a.png', filename: 'a.png' }),
    ).rejects.toThrow(ValidationAppError);
    expect(photoRepository.create).not.toHaveBeenCalled();
  });

  it('throws a validation error without querying the repository when the student id is NaN', async () => {
    await expect(
      photoService.createPhoto(Number('not-a-number'), { originalname: 'a.png', filename: 'a.png' }),
    ).rejects.toThrow(ValidationAppError);
    expect(studentRepository.findById).not.toHaveBeenCalled();
  });
});
